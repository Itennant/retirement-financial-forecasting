// Flowise Manager for Multiple Chatflows
import FlowiseClient from './flowise-client.js';
import { FlowiseAgent } from './flowise-agent.js';

export class FlowiseManager {
  constructor(config = {}) {
    this.config = config;
    this.client = null;
    this.agents = new Map();
    this.chatflows = new Map();
  }

  async initialize() {
    try {
      // Initialize Flowise client
      this.client = new FlowiseClient({
        baseUrl: this.config.baseUrl,
        apiKey: this.config.apiKey
      });

      // Load available chatflows
      await this.loadChatflows();

      console.log('FlowiseManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FlowiseManager:', error);
      throw error;
    }
  }

  // Load all available chatflows
  async loadChatflows() {
    try {
      const chatflows = await this.client.getChatflows();
      chatflows.forEach(chatflow => {
        this.chatflows.set(chatflow.id, chatflow);
      });
      console.log(`Loaded ${chatflows.length} chatflows`);
    } catch (error) {
      console.error('Error loading chatflows:', error);
      throw error;
    }
  }

  // Create a Flowise agent for a specific chatflow
  async createAgent(chatflowId, agentConfig = {}) {
    try {
      const chatflow = this.chatflows.get(chatflowId);
      if (!chatflow) {
        throw new Error(`Chatflow ${chatflowId} not found`);
      }

      const config = {
        ...this.config,
        ...agentConfig,
        chatflowId: chatflowId
      };

      const agent = new FlowiseAgent(config);
      await agent.initialize();

      this.agents.set(chatflowId, agent);
      return agent;
    } catch (error) {
      console.error(`Error creating agent for chatflow ${chatflowId}:`, error);
      throw error;
    }
  }

  // Get an existing agent
  getAgent(chatflowId) {
    return this.agents.get(chatflowId);
  }

  // Process request through a specific chatflow agent
  async processRequest(chatflowId, request) {
    const agent = this.getAgent(chatflowId);
    if (!agent) {
      throw new Error(`Agent for chatflow ${chatflowId} not found`);
    }

    return await agent.processRequest(request);
  }

  // Get all available chatflows
  getChatflows() {
    return Array.from(this.chatflows.values());
  }

  // Get chatflow by ID
  getChatflow(chatflowId) {
    return this.chatflows.get(chatflowId);
  }

  // Create a new chatflow
  async createChatflow(chatflowData) {
    try {
      const response = await this.client.createChatflow(chatflowData);
      this.chatflows.set(response.id, response);
      return response;
    } catch (error) {
      console.error('Error creating chatflow:', error);
      throw error;
    }
  }

  // Update an existing chatflow
  async updateChatflow(chatflowId, chatflowData) {
    try {
      const response = await this.client.updateChatflow(chatflowId, chatflowData);
      this.chatflows.set(chatflowId, response);
      return response;
    } catch (error) {
      console.error(`Error updating chatflow ${chatflowId}:`, error);
      throw error;
    }
  }

  // Get agent status
  getAgentStatus() {
    const status = {};
    this.agents.forEach((agent, chatflowId) => {
      status[chatflowId] = agent.getStatus();
    });
    return status;
  }
}

export default FlowiseManager;
