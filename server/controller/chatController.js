import geminiService from '../services/geminiService.js';

export const chatController = {
    async handleChat(req, res) {
        try {
            console.log('Received chat request:', req.body);
            
            const { message } = req.body;
            
            // Validate input
            if (!message || typeof message !== 'string') {
                console.log('Invalid message format:', message);
                return res.status(400).json({ 
                    error: 'Invalid message format. Message must be a non-empty string.' 
                });
            }

            // Set JSON content type header explicitly
            res.setHeader('Content-Type', 'application/json');

            // Get response from Gemini
            console.log('Sending message to Gemini:', message);
            const response = await geminiService.sendMessage(message);
            console.log('Received response from Gemini:', response);
            
            // Send response back to client
            return res.json({ response });

        } catch (error) {
            console.error('Chat error:', error);
            
            // Set JSON content type header explicitly
            res.setHeader('Content-Type', 'application/json');
            
            if (error.message.includes('timeout')) {
                return res.status(504).json({
                    error: 'Request timed out. Please try again.'
                });
            }
            
            if (error.message.includes('API key')) {
                return res.status(500).json({
                    error: 'Server configuration error. Please contact support.'
                });
            }

            return res.status(500).json({ 
                error: `Failed to process chat message: ${error.message}` 
            });
        }
    }
};

