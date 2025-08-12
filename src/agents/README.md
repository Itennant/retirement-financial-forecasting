# Agent System Architecture

## Overview

This directory contains the multi-platform agent system for the financial forecasting application. The system supports multiple AI agent platforms including LangChain, Flowise, and n8n, providing a unified interface for agent management and orchestration.

## Directory Structure

```
src/agents/
├── base/                 # Base agent classes and interfaces
├── langchain/           # LangChain agent implementations
├── flowise/             # Flowise integration
├── n8n/                 # n8n workflow integration
├── orchestration/       # Agent orchestration and routing
├── config/              # Configuration management
├── examples/            # Usage examples
├── communication/       # Inter-agent communication utilities
├── mcp/                 # Model Context Protocol integration
└── README.md           # This file
```

## Supported Platforms

### 1. LangChain
- **Financial Agent**: Specialized for financial analysis and retirement planning
- **Chatbot Agent**: Conversational interface for user interactions
- **Analysis Agent**: Deep financial data analysis and insights
- **Recommendation Agent**: Personalized investment and planning recommendations

### 2. Flowise
- Integration with Flowise chatflows via API
- Dynamic agent creation for different chatflow configurations
- Support for custom Flowise workflows

### 3. n8n
- Workflow automation integration
- Support for complex financial automation workflows
- Execution monitoring and status tracking

## Architecture Components

### Base Agent (`base/base-agent.js`)
Abstract base class providing common agent functionality:
- Initialization and configuration
- Request processing interface
- Status management
- Response formatting

### Agent Manager (`agent-manager.js`)
Main entry point for the agent system:
- Platform initialization and management
- Unified interface for all agent operations
- Configuration management
- Health monitoring

### Agent Orchestrator (`orchestration/agent-orchestrator.js`)
Intelligent request routing and agent coordination:
- Multi-platform request routing
- Load balancing and failover
- Batch processing support
- Health monitoring

### Configuration Manager (`config/agent-config-manager.js`)
Centralized configuration management:
- Environment-specific configurations
- Dynamic configuration updates
- Platform-specific defaults
- Configuration validation

## Usage Examples

### Basic Usage
```javascript
import { getAgentManager } from './agents/agent-manager.js';

// Initialize agent manager
const agentManager = getAgentManager();
await agentManager.initialize();

// Process a request
const response = await agentManager.processRequest({
  agentId: 'langchain-financial',
  query: 'What are the best retirement investment strategies?'
});
```

### Batch Processing
```javascript
const batchResponse = await agentManager.batchProcess([
  {
    agentId: 'langchain-analysis',
    query: 'Analyze portfolio performance'
  },
  {
    agentId: 'langchain-recommendation',
    input: 'Recommend diversification strategies'
  }
]);
```

## Configuration

Agent configurations are managed through the `AgentConfigManager` and stored in `config/agents/`. Each platform can have environment-specific configurations.

### Environment Variables
- `OPENAI_API_KEY`: OpenAI API key for LangChain agents
- `FLOWISE_API_KEY`: Flowise API key (optional)
- `N8N_API_KEY`: n8n API key (optional)

## Extending the System

### Adding New Agents
1. Extend `BaseAgent` class
2. Implement required methods (`initialize`, `processRequest`)
3. Register with `AgentOrchestrator`

### Adding New Platforms
1. Create platform-specific client and manager
2. Implement platform interface
3. Register with `AgentOrchestrator`

## Error Handling

The system provides comprehensive error handling with:
- Retry mechanisms with exponential backoff
- Graceful degradation when platforms are unavailable
- Detailed error logging and monitoring
- Health status reporting

## Performance Considerations

- Agents are initialized once and reused
- Request queuing for rate limiting
- Timeout management for long-running operations
- Memory optimization for conversation history

## Security

- API key management through environment variables
- Input validation and sanitization
- Secure communication with external services
- Configuration isolation by environment

## Monitoring and Logging

- Comprehensive logging for all agent operations
- Health status monitoring
- Performance metrics collection
- Error tracking and reporting

## Future Enhancements

- Advanced routing strategies (load-based, capability-based)
- Enhanced caching mechanisms
- More sophisticated error recovery
- Additional agent platforms integration
- Advanced configuration management
