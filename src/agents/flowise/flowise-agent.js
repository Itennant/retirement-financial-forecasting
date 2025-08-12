// Flowise Agent Integration
import { BaseAgent } from '../base/base-agent.js';
import FlowiseClient from './flowise-client.js';

export class FlowiseAgent extends BaseAgent {
  constructor(config = {}) {
    super('FlowiseAgent', config);
    this.client = null;
    this.chatflowId = config.chatflowId;
    this.defaultOptions = config.defaultOptions || {};
  }

  async initialize() {
    try {
      // Initialize Flowise client
      this.client = new FlowiseClient({
        baseUrl: this.config.baseUrl,
        apiKey: this.config.apiKey
      });

      // Verify chatflow exists
      if (this.chatflowId) {
        await this.client.getChatflow(this.chatflowId);
      }

      this.isEnabled = true;
      console.log('FlowiseAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FlowiseAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('FlowiseAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      const chatflowId = request.chatflowId || this.chatflowId;
      if (!chatflowId) {
        throw new Error('No chatflowId specified for FlowiseAgent');
      }

      const response = await this.client.sendMessage(
        chatflowId,
        request.query || request.input,
        { ...this.defaultOptions, ...request.options }
      );

      return this.formatResponse(response);
    } catch (error) {
      console.error('Error processing request in FlowiseAgent:', error);
      throw error;
    }
  }

  // Get available chatflows
  async getChatflows() {
    if (!this.client) {
      throw new Error('FlowiseAgent not initialized');
    }

    try {
      const chatflows = await this.client.getChatflows();
      return this.formatResponse(chatflows);
    } catch (error) {
      console.error('Error fetching chatflows:', error);
      throw error;
    }
  }

  // Switch to a different chatflow
  switchChatflow(chatflowId) {
    this.chatflowId = chatflowId;
  }

  // Create a new chatflow
  async createChatflow(chatflowData) {
    if (!this.client) {
      throw new Error('FlowiseAgent not initialized');
    }

    try {
      const response = await this.client.createChatflow(chatflowData);
      return this.formatResponse(response);
    } catch (error) {
      console.error('Error creating chatflow:', error);
      throw error;
    }
  }
}

export default FlowiseAgent;
