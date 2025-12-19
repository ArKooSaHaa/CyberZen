import Message from '../models/Message.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.userId; // from auth middleware

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver and message are required.' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId; // from auth middleware

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ timestamp: 'asc' });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all users who have chatted with the admin
export const getChatUsers = async (req, res) => {
  try {
    // The admin is the one making this request, so we look for messages sent TO the admin.
    // For simplicity, we assume the admin's ID is 'admin'.
    const messages = await Message.find({ receiverId: 'admin' });
    
    // Get unique sender IDs
    const userIds = [...new Set(messages.map(msg => msg.senderId))];
    
    res.status(200).json(userIds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
