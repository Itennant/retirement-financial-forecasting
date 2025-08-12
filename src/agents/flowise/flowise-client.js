// Flowise Client for API Integration
import axios from 'axios';

export class FlowiseClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.apiKey = config.apiKey || process.env.FLOWISE_API_KEY;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });
  }

  // Get all available chatflows
  async getChatflows() {
    try {
      const response = await this.client.get('/api/v1/chatflows');
      return response.data;
    } catch (error) {
      console.error('Error fetching chatflows:', error);
      throw error;
    }
  }

  // Get a specific chatflow by ID
  async getChatflow(chatflowId) {
    try {
      const response = await this.client.get(`/api/v1/chatflows/${chatflowId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chatflow ${chatflowId}:`, error);
      throw error;
    }
  }

  // Send message to a chatflow
  async sendMessage(chatflowId, message, options = {}) {
    try {
      const response = await this.client.post(`/api/v1/chatflows/${chatflowId}/prediction`, {
        question: message,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error(`Error sending message to chatflow ${chatflowId}:`, error);
      throw error;
    }
  }

  // Create a new chatflow
  async createChatflow(chatflowData) {
    try {
      const response = await this.client.post('/api/v1/chatflows', chatflowData);
      return response.data;
    } catch (error) {
      console.error('Error creating chatflow:', error);
      throw error;
    }
  }

  // Update an existing chatflow
  async updateChatflow(chatflowId, chatflowData) {
    try {
      const response = await this.client.put(`/api/v1/chatflows/${chatflowId}`, chatflowData);
      return response.data;
    } catch (error) {
      console.error(`Error updating chatflow ${chatflowId}:`, error);
      throw error;
    }
  }
}

export default FlowiseClient;
