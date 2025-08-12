// Main Agent Manager - Unified Interface for All Agent Platforms
import AgentOrchestrator from './orchestration/agent-orchestrator.js';
import AgentConfigManager from './config/agent-config-manager.js';
import { FinancialAgent, ChatbotAgent, AnalysisAgent, RecommendationAgent } from './langchain/index.js';
import { FlowiseManager } from './flowise/index.js';
import { N8nWorkflowManager } from './n8n/index.js';

export class AgentManager {
  constructor(config = {}) {
    this.config = config;
    this.orchestrator = new AgentOrchestrator(config.orchestrator || {});
    this.configManager = new AgentConfigManager(config.configPath);
    this.initialized = false;
    this.platforms = new Map();
  }

  // Initialize all agent platforms
  async initialize() {
    try {
      console.log('Initializing Agent Manager...');

      // Load environment configurations
      await this.configManager.loadEnvironmentConfig();

      // Initialize LangChain agents
      await this.initializeLangChain();

      // Initialize Flowise
      await this.initializeFlowise();

      // Initialize n8n
      await this.initializen8n();

      this.initialized = true;
      console.log('Agent Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Agent Manager:', error);
      throw error;
    }
  }

  // Initialize LangChain agents
  async initializeLangChain() {
    try {
      const langchainConfig = this.configManager.getPlatformDefaults('langchain');

      // Create and register LangChain agents
      const financialAgent = new FinancialAgent(langchainConfig);
      await financialAgent.initialize();
      this.orchestrator.registerAgent('financial', financialAgent, 'langchain');

      const chatbotAgent = new ChatbotAgent(langchainConfig);
      await chatbotAgent.initialize();
      this.orchestrator.registerAgent('chatbot', chatbotAgent, 'langchain');

      const analysisAgent = new AnalysisAgent(langchainConfig);
      await analysisAgent.initialize();
      this.orchestrator.registerAgent('analysis', analysisAgent, 'langchain');

      const recommendationAgent = new RecommendationAgent(langchainConfig);
      await recommendationAgent.initialize();
      this.orchestrator.registerAgent('recommendation', recommendationAgent, 'langchain');

      console.log('LangChain agents initialized');
    } catch (error) {
      console.error('Error initializing LangChain agents:', error);
      throw error;
    }
  }

  // Initialize Flowise
  async initializeFlowise() {
    try {
      const flowiseConfig = this.configManager.getPlatformDefaults('flowise');
      
      const flowiseManager = new FlowiseManager(flowiseConfig);
      await flowiseManager.initialize();
      
      this.orchestrator.registerPlatform('flowise', flowiseManager);
      this.platforms.set('flowise', flowiseManager);

      console.log('Flowise initialized');
    } catch (error) {
      console.error('Error initializing Flowise:', error);
      // Don't throw error - allow other platforms to initialize
    }
  }

  // Initialize n8n
  async initializen8n() {
    try {
      const n8nConfig = this.configManager.getPlatformDefaults('n8n');
      
      const n8nManager = new N8nWorkflowManager(n8nConfig);
      await n8nManager.initialize();
      
      this.orchestrator.registerPlatform('n8n', n8nManager);
      this.platforms.set('n8n', n8nManager);

      console.log('n8n initialized');
    } catch (error) {
      console.error('Error initializing n8n:', error);
      // Don't throw error - allow other platforms to initialize
    }
  }

  // Process a request through the agent system
  async processRequest(request) {
    if (!this.initialized) {
      throw new Error('AgentManager not initialized. Call initialize() first.');
    }

    try {
      const result = await this.orchestrator.routeRequest(request);
      return result;
    } catch (error) {
      console.error('Error processing request:', error);
      throw error;
    }
  }

  // Batch process multiple requests
  async batchProcess(requests) {
    if (!this.initialized) {
      throw new Error('AgentManager not initialized. Call initialize() first.');
    }

    try {
      const result = await this.orchestrator.batchProcess(requests);
      return result;
    } catch (error) {
      console.error('Error processing batch requests:', error);
      throw error;
    }
  }

  // Get system health status
  async getHealthStatus() {
    if (!this.initialized) {
      return { status: 'not_initialized' };
    }

    try {
      const health = await this.orchestrator.healthCheck();
      return {
        status: 'healthy',
        ...health
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Get all registered agents
  getAgents() {
    return this.orchestrator.getAgents();
  }

  // Get all registered platforms
  getPlatforms() {
    return this.orchestrator.getPlatforms();
  }

  // Stop all agents
  async stopAllAgents() {
    try {
      await this.orchestrator.stopAllAgents();
      this.initialized = false;
      console.log('All agents stopped');
    } catch (error) {
      console.error('Error stopping agents:', error);
      throw error;
    }
  }

  // Reload configurations
  async reloadConfigurations() {
    try {
      await this.configManager.loadEnvironmentConfig();
      console.log('Configurations reloaded');
    } catch (error) {
      console.error('Error reloading configurations:', error);
      throw error;
    }
  }

  // Get platform manager
  getPlatformManager(platformName) {
    return this.platforms.get(platformName);
  }

  // Create a new agent for a platform
  async createAgent(agentName, platformName, agentConfig = {}) {
    const platformManager = this.platforms.get(platformName);
    if (!platformManager) {
      throw new Error(`Platform ${platformName} not found`);
    }

    if (typeof platformManager.createAgent === 'function') {
      const agent = await platformManager.createAgent(agentName, agentConfig);
      this.orchestrator.registerAgent(agentName, agent, platformName);
      return agent;
    } else {
      throw new Error(`Platform ${platformName} does not support dynamic agent creation`);
    }
  }

  // Update agent configuration
  async updateAgentConfig(agentName, platformName, newConfig) {
    return await this.configManager.updateAgentConfig(agentName, platformName, newConfig);
  }

  // Get agent configuration
  getAgentConfig(agentName, platformName) {
    return this.configManager.getAgentConfig(agentName, platformName);
  }
}

// Singleton instance
let agentManagerInstance = null;

export const getAgentManager = (config = {}) => {
  if (!agentManagerInstance) {
    agentManagerInstance = new AgentManager(config);
  }
  return agentManagerInstance;
};

export default AgentManager;
