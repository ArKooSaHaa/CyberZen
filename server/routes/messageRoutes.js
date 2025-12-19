import express from 'express';
import { sendMessage, getMessages, getChatUsers } from '../controller/messageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', auth, sendMessage);

// NOTE: order matters. place the /users route before the dynamic :userId route
// @route   GET /api/messages/users
// @desc    Get all users who have chatted with admin
// @access  Private (for admin)
router.get('/users', auth, getChatUsers);

// @route   GET /api/messages/:userId
// @desc    Get messages with a specific user
// @access  Private
router.get('/:userId', auth, getMessages);

export { router as default };
