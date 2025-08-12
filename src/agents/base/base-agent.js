// Base Agent Class
export class BaseAgent {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.isEnabled = config.isEnabled !== false;
  }

  // Initialize the agent
  async initialize() {
    throw new Error('Initialize method must be implemented by subclass');
  }

  // Process a request
  async processRequest(request) {
    throw new Error('ProcessRequest method must be implemented by subclass');
  }

  // Get agent status
  getStatus() {
    return {
      name: this.name,
      isEnabled: this.isEnabled,
      config: this.config
    };
  }

  // Enable/disable agent
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Validate request format
  validateRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request format');
    }
    return true;
  }

  // Format response
  formatResponse(response) {
    return {
      agent: this.name,
      timestamp: new Date().toISOString(),
      response: response
    };
  }
}

export default BaseAgent;
