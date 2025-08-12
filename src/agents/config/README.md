# Agent Configuration

This directory contains configuration files for different agent platforms and environments.

## Directory Structure

```
config/agents/
├── environments/          # Environment-specific configurations
│   ├── development.json
│   ├── production.json
│   └── staging.json
├── langchain/           # LangChain agent configurations
│   ├── financial.json
│   ├── chatbot.json
│   ├── analysis.json
│   └── recommendation.json
├── flowise/             # Flowise configurations
│   └── default.json
├── n8n/                 # n8n configurations
│   └── default.json
└── README.md
```

## Configuration Format

Each configuration file follows this structure:

```json
{
  "enabled": true,
  "timeout": 30000,
  "maxRetries": 3,
  "retryDelay": 1000,
  "platformSpecificSettings": {}
}
```

## Environment Variables

The following environment variables are used:

- `OPENAI_API_KEY`: OpenAI API key for LangChain agents
- `FLOWISE_API_KEY`: Flowise API key (optional)
- `N8N_API_KEY`: n8n API key (optional)
- `NODE_ENV`: Environment (development, production, staging)

## Platform-Specific Configurations

### LangChain
```json
{
  "enabled": true,
  "modelName": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 2000,
  "timeout": 30000
}
```

### Flowise
```json
{
  "enabled": true,
  "baseUrl": "http://localhost:3000",
  "timeout": 30000,
  "defaultOptions": {}
}
```

### n8n
```json
{
  "enabled": true,
  "baseUrl": "http://localhost:5678",
  "timeout": 30000,
  "defaultInput": {}
}
```

## Best Practices

1. **Environment Separation**: Use different configurations for development, staging, and production
2. **Security**: Never commit API keys to version control
3. **Validation**: All configurations are validated at runtime
4. **Fallbacks**: Default configurations are provided for missing settings
5. **Documentation**: Keep configuration files well-documented
