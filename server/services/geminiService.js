import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    this.isConfigured = false;
    this.initError = null;
    
    // Set the initial context for the AI
    this.context = "You are CyberZen Assistant, a friendly and helpful AI focused on cybersecurity. Keep responses concise and informative.";
    
    // Configuration for generation
    this.genConfig = {
      temperature: 0.7,     // Balance between creativity and consistency
      maxOutputTokens: 200, // Limit response length for conciseness
      topK: 40,
      topP: 0.8,
    };

    this.initialize();
  }

  initialize() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Warning: GEMINI_API_KEY environment variable is not configured');
      this.initError = 'Missing API key';
      return false;
    }
    
    try {
      console.log('Initializing Gemini service with API key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
      // Initialize the Gemini AI with the API key from environment variables
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Get the generative model
      this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
      this.isConfigured = true;
      console.log('Successfully initialized Gemini service');
      return true;
    } catch (error) {
      console.error('Error initializing Gemini service:', error);
      this.initError = error.message;
      return false;
    }
  }

  async sendMessage(message) {
    try {
      if (!this.isConfigured) {
        const errorDetail = this.initError ? ` Error: ${this.initError}` : '';
        return `I apologize, but I'm not properly configured at the moment. Please contact the administrator to set up the AI service.${errorDetail}`;
      }

      if (!this.model) {
        return "The AI model is not initialized properly. Please try again later.";
      }

      // Combine context with user message
      const prompt = `${this.context}\n\nUser: ${message}\n\nAssistant:`;
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        // Generate content with the combined prompt
        const result = await this.model.generateContent({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: this.genConfig
        });

        clearTimeout(timeoutId);

        const response = await result.response;
        if (!response || !response.text) {
          throw new Error('Invalid response from AI');
        }
        
        return response.text();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('AI response timeout');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('Gemini API key not configured properly');
      }
      throw error;
    }
  }
}

// Export a singleton instance
export default new GeminiService();