// n8n Workflow Manager for Multiple Workflows
import N8nClient from './n8n-client.js';
import { N8nAgent } from './n8n-agent.js';

export class N8nWorkflowManager {
  constructor(config = {}) {
    this.config = config;
    this.client = null;
    this.agents = new Map();
    this.workflows = new Map();
  }

  async initialize() {
    try {
      // Initialize n8n client
      this.client = new N8nClient({
        baseUrl: this.config.baseUrl,
        apiKey: this.config.apiKey
      });

      // Load available workflows
      await this.loadWorkflows();

      console.log('N8nWorkflowManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize N8nWorkflowManager:', error);
      throw error;
    }
  }

  // Load all available workflows
  async loadWorkflows() {
    try {
      const workflows = await this.client.getWorkflows();
      workflows.forEach(workflow => {
        this.workflows.set(workflow.id, workflow);
      });
      console.log(`Loaded ${workflows.length} workflows`);
    } catch (error) {
      console.error('Error loading workflows:', error);
      throw error;
    }
  }

  // Create an n8n agent for a specific workflow
  async createAgent(workflowId, agentConfig = {}) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      const config = {
        ...this.config,
        ...agentConfig,
        workflowId: workflowId
      };

      const agent = new N8nAgent(config);
      await agent.initialize();

      this.agents.set(workflowId, agent);
      return agent;
    } catch (error) {
      console.error(`Error creating agent for workflow ${workflowId}:`, error);
      throw error;
    }
  }

  // Get an existing agent
  getAgent(workflowId) {
    return this.agents.get(workflowId);
  }

  // Process request through a specific workflow agent
  async processRequest(workflowId, request) {
    const agent = this.getAgent(workflowId);
    if (!agent) {
      throw new Error(`Agent for workflow ${workflowId} not found`);
    }

    return await agent.processRequest(request);
  }

  // Get all available workflows
  getWorkflows() {
    return Array.from(this.workflows.values());
  }

  // Get workflow by ID
  getWorkflow(workflowId) {
    return this.workflows.get(workflowId);
  }

  // Create a new workflow
  async createWorkflow(workflowData) {
    try {
      const response = await this.client.createWorkflow(workflowData);
      this.workflows.set(response.id, response);
      return response;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  // Update an existing workflow
  async updateWorkflow(workflowId, workflowData) {
    try {
      const response = await this.client.updateWorkflow(workflowId, workflowData);
      this.workflows.set(workflowId, response);
      return response;
    } catch (error) {
      console.error(`Error updating workflow ${workflowId}:`, error);
      throw error;
    }
  }

  // Get execution status
  async getExecutionStatus(executionId) {
    try {
      const response = await this.client.getExecutionStatus(executionId);
      return response;
    } catch (error) {
      console.error(`Error fetching execution status ${executionId}:`, error);
      throw error;
    }
  }

  // Get agent status
  getAgentStatus() {
    const status = {};
    this.agents.forEach((agent, workflowId) => {
      status[workflowId] = agent.getStatus();
    });
    return status;
  }

  // Stop all agents
  stopAllAgents() {
    this.agents.forEach(agent => {
      agent.setEnabled(false);
    });
    console.log('All n8n agents stopped');
  }
}

export default N8nWorkflowManager;
