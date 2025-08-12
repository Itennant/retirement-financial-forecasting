// n8n Client for API Integration
import axios from 'axios';

export class N8nClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:5678';
    this.apiKey = config.apiKey || process.env.N8N_API_KEY;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });
  }

  // Get all available workflows
  async getWorkflows() {
    try {
      const response = await this.client.get('/api/v1/workflows');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }

  // Get a specific workflow by ID
  async getWorkflow(workflowId) {
    try {
      const response = await this.client.get(`/api/v1/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow ${workflowId}:`, error);
      throw error;
    }
  }

  // Execute a workflow
  async executeWorkflow(workflowId, inputData = {}) {
    try {
      const response = await this.client.post(`/api/v1/workflows/${workflowId}/run`, {
        ...inputData
      });
      return response.data;
    } catch (error) {
      console.error(`Error executing workflow ${workflowId}:`, error);
      throw error;
    }
  }

  // Create a new workflow
  async createWorkflow(workflowData) {
    try {
      const response = await this.client.post('/api/v1/workflows', workflowData);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  // Update an existing workflow
  async updateWorkflow(workflowId, workflowData) {
    try {
      const response = await this.client.patch(`/api/v1/workflows/${workflowId}`, workflowData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workflow ${workflowId}:`, error);
      throw error;
    }
  }

  // Get workflow execution status
  async getExecutionStatus(executionId) {
    try {
      const response = await this.client.get(`/api/v1/executions/${executionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching execution ${executionId}:`, error);
      throw error;
    }
  }
}

export default N8nClient;
