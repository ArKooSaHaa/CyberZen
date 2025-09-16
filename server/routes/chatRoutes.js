import express from 'express';
import { chatController } from '../controller/chatController.js';

const router = express.Router();

// Timeout middleware
const timeoutMiddleware = (req, res, next) => {
  // Set a 20-second timeout for the request
  req.setTimeout(20000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
};

// POST /api/chat - Send a message to the chatbot
router.post('/chat', timeoutMiddleware, chatController.handleChat);

export default router;