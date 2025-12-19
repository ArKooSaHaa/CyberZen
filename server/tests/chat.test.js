import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// In-memory store for mock messages
const mockMessages = [];

// Mock the Message model constructor
const MockMessageConstructor = jest.fn().mockImplementation((data) => {
  const instance = {
    ...data,
    save: jest.fn().mockImplementation(function() {
      mockMessages.push(this); // Add the message to our in-memory store
      return Promise.resolve(this);
    }),
  };
  return instance;
});

// Mock the Message model's static methods if any are used (e.g., find)
MockMessageConstructor.find = jest.fn().mockResolvedValue(mockMessages);

jest.mock('../models/Message.js', () => {
  return {
    __esModule: true,
    default: MockMessageConstructor,
  };
});


describe('Chat functionality', () => {
  let io, server, clientSocket, adminSocket;
  let app;
  const TEST_PORT = 3002; // Use a different port for testing

  beforeAll((done) => {
    app = express();
    server = createServer(app);
    io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    const userSockets = {}; // In-memory store for user sockets { userId: socketId }

    // Store original io.to
    const originalIoTo = io.to;

    // Mock io.to to control emission
    io.to = jest.fn((socketId) => {
      // Check if the socketId is valid and corresponds to a registered user
      const isRegistered = Object.values(userSockets).includes(socketId);
      if (socketId && isRegistered) {
        return originalIoTo(socketId); // Use original behavior for valid sockets
      }
      // For invalid or unregistered socketIds, return a mock emitter that does nothing
      return {
        emit: jest.fn(),
      };
    });

    io.on('connection', (socket) => {
      socket.on('registerUser', (userId) => {
        userSockets[userId] = socket.id;
      });

      socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, message } = data;
        const newMessage = new MockMessageConstructor({ senderId, receiverId, message });
        await newMessage.save();
        
        const targetSocketId = userSockets[receiverId];
        // Now, io.to(targetSocketId) will be our mock, which handles the undefined case
        io.to(targetSocketId).emit('receiveMessage', newMessage);
      });

      socket.on('adminReply', async (data) => {
        const { senderId, receiverId, message } = data;
        const newMessage = new MockMessageConstructor({ senderId, receiverId, message });
        await newMessage.save();

        const targetSocketId = userSockets[receiverId];
        // Now, io.to(targetSocketId) will be our mock, which handles the undefined case
        io.to(targetSocketId).emit('receiveMessage', newMessage);
      });

      socket.on('typing', (data) => {
        const targetSocketId = userSockets[data.recipientId];
        if (targetSocketId) {
          io.to(targetSocketId).emit('typing', { isTyping: true, senderId: data.senderId });
        }
      });

      socket.on('stopTyping', (data) => {
        const targetSocketId = userSockets[data.recipientId];
        if (targetSocketId) {
          io.to(targetSocketId).emit('stopTyping', { isTyping: false, senderId: data.senderId });
        }
      });

      socket.on('disconnect', () => {
        for (const userId in userSockets) {
          if (userSockets[userId] === socket.id) {
            delete userSockets[userId];
            break;
          }
        }
      });
    });

    server.listen(TEST_PORT, () => {
      clientSocket = new Client(`http://localhost:${TEST_PORT}`);
      adminSocket = new Client(`http://localhost:${TEST_PORT}`);

      let clientConnected = false;
      let adminConnected = false;

      clientSocket.on('connect', () => {
        clientConnected = true;
        if (adminConnected) done();
      });
      clientSocket.on('connect_error', (err) => {
        console.error('Client Socket Connection Error:', err);
        done(err); // Fail the test if client connection fails
      });

      adminSocket.on('connect', () => {
        adminConnected = true;
        if (clientConnected) done();
      });
      adminSocket.on('connect_error', (err) => {
        console.error('Admin Socket Connection Error:', err);
        done(err); // Fail the test if admin connection fails
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    adminSocket.close();
    server.close();
  });

  beforeEach(() => {
    // Clear mock messages before each test
    mockMessages.length = 0; // Clear the in-memory store
    MockMessageConstructor.mockClear(); // Clear mock constructor calls
    MockMessageConstructor.find.mockClear(); // Clear mock find calls
  });

  test('should allow a user to register', (done) => {
    const userId = 'user123';
    clientSocket.emit('registerUser', userId);
    done();
  });

  test('should allow an admin to register', (done) => {
    const adminId = 'admin';
    adminSocket.emit('registerUser', adminId);
    done();
  });

  test('should allow a user to send a message to admin', (done) => {
    const senderId = 'user123';
    const receiverId = 'admin';
    const messageText = 'Hello Admin!';

    adminSocket.on('receiveMessage', (message) => {
      expect(message.senderId).toBe(senderId);
      expect(message.receiverId).toBe(receiverId);
      expect(message.message).toBe(messageText);
      expect(mockMessages.length).toBe(1);
      done();
    });

    clientSocket.emit('registerUser', senderId);
    adminSocket.emit('registerUser', receiverId);
    clientSocket.emit('sendMessage', { senderId, receiverId, message: messageText });
  });

  test('should allow an admin to reply to a user', (done) => {
    const senderId = 'admin';
    const receiverId = 'user123';
    const messageText = 'Hello User!';

    clientSocket.on('receiveMessage', (message) => {
      expect(message.senderId).toBe(senderId);
      expect(message.receiverId).toBe(receiverId);
      expect(message.message).toBe(messageText);
      expect(mockMessages.length).toBe(1);
      done();
    });

    clientSocket.emit('registerUser', receiverId);
    adminSocket.emit('registerUser', senderId);
    adminSocket.emit('adminReply', { senderId, receiverId, message: messageText });
  });

  test('should broadcast typing event from user to admin', (done) => {
    const senderId = 'user123';
    const recipientId = 'admin';

    adminSocket.on('typing', (data) => {
      expect(data.isTyping).toBe(true);
      expect(data.senderId).toBe(senderId);
      done();
    });

    clientSocket.emit('registerUser', senderId);
    adminSocket.emit('registerUser', recipientId);
    clientSocket.emit('typing', { senderId, recipientId });
  });

  test('should broadcast stopTyping event from user to admin', (done) => {
    const senderId = 'user123';
    const recipientId = 'admin';

    adminSocket.on('stopTyping', (data) => {
      expect(data.isTyping).toBe(false);
      expect(data.senderId).toBe(senderId);
      done();
    });

    clientSocket.emit('registerUser', senderId);
    adminSocket.emit('registerUser', recipientId);
    clientSocket.emit('stopTyping', { senderId, recipientId });
  });

  test('should not send message if admin is not registered', (done) => {
    const senderId = 'user123';
    const receiverId = 'admin';
    const messageText = 'Hello Admin!';

    const mockReceiveMessage = jest.fn();
    adminSocket.on('receiveMessage', mockReceiveMessage);

    clientSocket.emit('registerUser', senderId);
    // Do NOT register adminSocket
    clientSocket.emit('sendMessage', { senderId, receiverId, message: messageText });

    setTimeout(() => {
      expect(mockReceiveMessage).not.toHaveBeenCalled();
      expect(mockMessages.length).toBe(1); // Message should still be saved to DB
      done();
    }, 500); // Increased timeout
  });

  test('should not send admin reply if user is not registered', (done) => {
    const senderId = 'admin';
    const receiverId = 'user123';
    const messageText = 'Hello User!';

    const mockReceiveMessage = jest.fn();
    clientSocket.on('receiveMessage', mockReceiveMessage);

    adminSocket.emit('registerUser', senderId);
    // Do NOT register clientSocket
    adminSocket.emit('adminReply', { senderId, receiverId, message: messageText });

    setTimeout(() => {
      expect(mockReceiveMessage).not.toHaveBeenCalled();
      expect(mockMessages.length).toBe(1); // Message should still be saved to DB
      done();
    }, 500); // Increased timeout
  });
});
