// n8n Agent Integration
import { BaseAgent } from '../base/base-agent.js';
import N8nClient from './n8n-client.js';

export class N8nAgent extends BaseAgent {
  constructor(config = {}) {
    super('N8nAgent', config);
    this.client = null;
    this.workflowId = config.workflowId;
    this.defaultInput = config.defaultInput || {};
  }

  async initialize() {
    try {
      // Initialize n8n client
      this.client = new N8nClient({
        baseUrl: this.config.baseUrl,
        apiKey: this.config.apiKey
      });

      // Verify workflow exists
      if (this.workflowId) {
        await this.client.getWorkflow(this.workflowId);
      }

      this.isEnabled = true;
      console.log('N8nAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize N8nAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('N8nAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      const workflowId = request.workflowId || this.workflowId;
      if (!workflowId) {
        throw new Error('No workflowId specified for N8nAgent');
      }

      const inputData = {
        ...this.defaultInput,
        ...request.input,
        ...request.data
      };

      const response = await this.client.executeWorkflow(workflowId, inputData);

      return this.formatResponse(response);
    } catch (error) {
      console.error('Error processing request in N8nAgent:', error);
      throw error;
    }
  }

  // Get available workflows
  async getWorkflows() {
    if (!this.client) {
      throw new Error('N8nAgent not initialized');
    }

    try {
      const workflows = await this.client.getWorkflows();
      return this.formatResponse(workflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }

  // Switch to a different workflow
  switchWorkflow(workflowId) {
    this.workflowId = workflowId;
  }

  // Create a new workflow
  async createWorkflow(workflowData) {
    if (!this.client) {
      throw new Error('N8nAgent not initialized');
    }

    try {
      const response = await this.client.createWorkflow(workflowData);
      return this.formatResponse(response);
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  // Get execution status
  async getExecutionStatus(executionId) {
    if (!this.client) {
      throw new Error('N8nAgent not initialized');
    }

    try {
      const response = await this.client.getExecutionStatus(executionId);
      return this.formatResponse(response);
    } catch (error) {
      console.error(`Error fetching execution status ${executionId}:`, error);
      throw error;
    }
  }
}

export default N8nAgent;
