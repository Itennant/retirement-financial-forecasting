// Agent Orchestrator for Multi-Platform Management
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';

export class AgentOrchestrator {
  constructor(config = {}) {
    this.config = config;
    this.agents = new Map();
    this.platforms = new Map();
    this.requestQueue = [];
    this.isProcessing = false;
  }

  // Register an agent platform (LangChain, Flowise, n8n, etc.)
  registerPlatform(platformName, platformManager) {
    this.platforms.set(platformName, platformManager);
    console.log(`Platform ${platformName} registered`);
  }

  // Register an individual agent
  registerAgent(agentName, agentInstance, platformName) {
    const agentId = `${platformName}-${agentName}`;
    this.agents.set(agentId, {
      name: agentName,
      instance: agentInstance,
      platform: platformName,
      id: agentId
    });
    console.log(`Agent ${agentName} registered for platform ${platformName}`);
  }

  // Get registered platforms
  getPlatforms() {
    return Array.from(this.platforms.keys());
  }

  // Get registered agents
  getAgents() {
    return Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      platform: agent.platform,
      status: agent.instance.getStatus()
    }));
  }

  // Route request to appropriate agent
  async routeRequest(request) {
    const { agentId, platform, ...agentRequest } = request;

    // If specific agent ID is provided
    if (agentId) {
      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }
      return await this.processAgentRequest(agent, agentRequest);
    }

    // If platform is specified, route to platform manager
    if (platform) {
      const platformManager = this.platforms.get(platform);
      if (!platformManager) {
        throw new Error(`Platform ${platform} not found`);
      }
      return await platformManager.processRequest(request.workflowId || request.chatflowId, agentRequest);
    }

    // If no specific routing, use routing strategy
    return await this.routeByStrategy(request);
  }

  // Process request through specific agent
  async processAgentRequest(agent, request) {
    try {
      const response = await agent.instance.processRequest(request);
      return {
        agentId: agent.id,
        platform: agent.platform,
        response: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error processing request for agent ${agent.id}:`, error);
      throw error;
    }
  }

  // Route request using strategy (simple round-robin, load-based, etc.)
  async routeByStrategy(request) {
    // Simple round-robin routing as default strategy
    const agents = Array.from(this.agents.values());
    if (agents.length === 0) {
      throw new Error('No agents available for routing');
    }

    // Find agents that match the request type
    const matchingAgents = agents.filter(agent => 
      this.isAgentSuitable(agent, request)
    );

    if (matchingAgents.length === 0) {
      throw new Error('No suitable agents found for request');
    }

    // Simple round-robin selection
    const selectedAgent = lodash.sample(matchingAgents);
    return await this.processAgentRequest(selectedAgent, request);
  }

  // Check if agent is suitable for request
  isAgentSuitable(agent, request) {
    // Basic suitability checks
    if (!agent.instance.isEnabled) {
      return false;
    }

    // Add more sophisticated routing logic here based on:
    // - Agent capabilities
    // - Request type
    // - Agent load
    // - Priority levels
    // - Specialization areas

    return true;
  }

  // Batch process multiple requests
  async batchProcess(requests) {
    const results = [];
    const errors = [];

    for (const request of requests) {
      try {
        const result = await this.routeRequest(request);
        results.push(result);
      } catch (error) {
        errors.push({
          request: request,
          error: error.message
        });
      }
    }

    return {
      results,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  // Get platform status
  getPlatformStatus() {
    const status = {};
    this.platforms.forEach((platform, platformName) => {
      if (typeof platform.getAgentStatus === 'function') {
        status[platformName] = platform.getAgentStatus();
      } else {
        status[platformName] = 'active';
      }
    });
    return status;
  }

  // Stop all agents across all platforms
  async stopAllAgents() {
    const stopPromises = [];
    
    this.agents.forEach(agent => {
      if (typeof agent.instance.setEnabled === 'function') {
        agent.instance.setEnabled(false);
      }
    });

    this.platforms.forEach(platform => {
      if (typeof platform.stopAllAgents === 'function') {
        stopPromises.push(platform.stopAllAgents());
      }
    });

    await Promise.all(stopPromises);
    console.log('All agents stopped across all platforms');
  }

  // Health check for all agents
  async healthCheck() {
    const healthStatus = {
      platforms: {},
      agents: {},
      timestamp: new Date().toISOString()
    };

    // Check platform health
    for (const [platformName, platform] of this.platforms) {
      try {
        if (typeof platform.getWorkflows === 'function') {
          await platform.getWorkflows();
          healthStatus.platforms[platformName] = 'healthy';
        } else if (typeof platform.getChatflows === 'function') {
          await platform.getChatflows();
          healthStatus.platforms[platformName] = 'healthy';
        } else {
          healthStatus.platforms[platformName] = 'active';
        }
      } catch (error) {
        healthStatus.platforms[platformName] = `error: ${error.message}`;
      }
    }

    // Check agent health
    for (const [agentId, agent] of this.agents) {
      try {
        const status = agent.instance.getStatus();
        healthStatus.agents[agentId] = status.isEnabled ? 'healthy' : 'disabled';
      } catch (error) {
        healthStatus.agents[agentId] = `error: ${error.message}`;
      }
    }

    return healthStatus;
  }
}

export default AgentOrchestrator;
