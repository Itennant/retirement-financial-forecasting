// Agent Configuration Manager
import fs from 'fs';
import path from 'path';

export class AgentConfigManager {
  constructor(configPath = './config/agents') {
    this.configPath = configPath;
    this.configs = new Map();
    this.defaultConfig = {
      enabled: true,
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000
    };
  }

  // Load configuration for a specific agent
  async loadAgentConfig(agentName, platform) {
    const configFileName = `${agentName}.${platform}.json`;
    const configFilePath = path.join(this.configPath, configFileName);

    try {
      if (fs.existsSync(configFilePath)) {
        const configFile = fs.readFileSync(configFilePath, 'utf8');
        const config = JSON.parse(configFile);
        this.configs.set(`${platform}-${agentName}`, { ...this.defaultConfig, ...config });
        return this.configs.get(`${platform}-${agentName}`);
      } else {
        // Return default config if no specific config exists
        const defaultConfig = { ...this.defaultConfig };
        this.configs.set(`${platform}-${agentName}`, defaultConfig);
        return defaultConfig;
      }
    } catch (error) {
      console.error(`Error loading config for ${agentName}:`, error);
      // Return default config on error
      const defaultConfig = { ...this.defaultConfig };
      this.configs.set(`${platform}-${agentName}`, defaultConfig);
      return defaultConfig;
    }
  }

  // Load all configurations for a platform
  async loadPlatformConfigs(platform) {
    const platformConfigPath = path.join(this.configPath, platform);
    
    if (!fs.existsSync(platformConfigPath)) {
      return new Map();
    }

    const configs = new Map();
    const files = fs.readdirSync(platformConfigPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const configPath = path.join(platformConfigPath, file);
          const configFile = fs.readFileSync(configPath, 'utf8');
          const config = JSON.parse(configFile);
          
          const agentName = path.basename(file, '.json');
          configs.set(agentName, { ...this.defaultConfig, ...config });
        } catch (error) {
          console.error(`Error loading config file ${file}:`, error);
        }
      }
    }

    return configs;
  }

  // Get configuration for an agent
  getAgentConfig(agentName, platform) {
    const configKey = `${platform}-${agentName}`;
    return this.configs.get(configKey) || this.defaultConfig;
  }

  // Update configuration for an agent
  async updateAgentConfig(agentName, platform, newConfig) {
    const configKey = `${platform}-${agentName}`;
    const existingConfig = this.configs.get(configKey) || {};
    const updatedConfig = { ...existingConfig, ...newConfig };
    
    this.configs.set(configKey, updatedConfig);

    // Save to file
    const configFileName = `${agentName}.${platform}.json`;
    const configFilePath = path.join(this.configPath, configFileName);
    
    try {
      // Ensure config directory exists
      const configDir = path.dirname(configFilePath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));
      console.log(`Configuration updated for ${agentName} (${platform})`);
    } catch (error) {
      console.error(`Error saving config for ${agentName}:`, error);
    }

    return updatedConfig;
  }

  // Get all configurations
  getAllConfigs() {
    return Object.fromEntries(this.configs);
  }

  // Validate configuration
  validateConfig(config) {
    const requiredFields = ['enabled'];
    const errors = [];

    for (const field of requiredFields) {
      if (config[field] === undefined) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (config.timeout !== undefined && (typeof config.timeout !== 'number' || config.timeout < 0)) {
      errors.push('Timeout must be a positive number');
    }

    if (config.maxRetries !== undefined && (typeof config.maxRetries !== 'number' || config.maxRetries < 0)) {
      errors.push('MaxRetries must be a non-negative number');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // Load environment-specific configurations
  async loadEnvironmentConfig(environment = process.env.NODE_ENV || 'development') {
    const envConfigPath = path.join(this.configPath, 'environments', `${environment}.json`);
    
    if (fs.existsSync(envConfigPath)) {
      try {
        const configFile = fs.readFileSync(envConfigPath, 'utf8');
        const envConfig = JSON.parse(configFile);
        
        // Merge with existing configs
        Object.entries(envConfig).forEach(([key, config]) => {
          const existingConfig = this.configs.get(key) || {};
          this.configs.set(key, { ...existingConfig, ...config });
        });

        console.log(`Loaded environment configuration for ${environment}`);
      } catch (error) {
        console.error(`Error loading environment config for ${environment}:`, error);
      }
    }
  }

  // Get platform-specific default configuration
  getPlatformDefaults(platform) {
    const platformDefaults = {
      langchain: {
        modelName: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
      },
      flowise: {
        baseUrl: 'http://localhost:3000',
        defaultOptions: {}
      },
      n8n: {
        baseUrl: 'http://localhost:5678',
        defaultInput: {}
      }
    };

    return platformDefaults[platform] || {};
  }
}

export default AgentConfigManager;
