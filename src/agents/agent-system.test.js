// Agent System Test
import { AgentManager, getAgentManager } from './agent-manager.js';
import { BaseAgent } from './base/base-agent.js';
import { FinancialAgent } from './langchain/financial-agent.js';
import { ChatbotAgent } from './langchain/chatbot-agent.js';
import { AnalysisAgent } from './langchain/analysis-agent.js';
import { RecommendationAgent } from './langchain/recommendation-agent.js';
import { FlowiseManager } from './flowise/flowise-manager.js';
import { N8nWorkflowManager } from './n8n/n8n-workflow-manager.js';
import AgentOrchestrator from './orchestration/agent-orchestrator.js';
import AgentConfigManager from './config/agent-config-manager.js';

// Test basic imports
console.log('Testing Agent System Imports...');

// Test 1: Basic class imports
console.log('✓ BaseAgent class imported');
console.log('✓ FinancialAgent class imported');
console.log('✓ ChatbotAgent class imported');
console.log('✓ AnalysisAgent class imported');
console.log('✓ RecommendationAgent class imported');
console.log('✓ FlowiseManager class imported');
console.log('✓ N8nWorkflowManager class imported');
console.log('✓ AgentOrchestrator class imported');
console.log('✓ AgentConfigManager class imported');

// Test 2: AgentManager class
console.log('✓ AgentManager class imported');

// Test 3: Singleton instance
const agentManager1 = getAgentManager();
const agentManager2 = getAgentManager();
console.log('✓ Singleton pattern working:', agentManager1 === agentManager2);

// Test 4: Class instantiation
try {
  const baseAgent = new BaseAgent('test-agent');
  console.log('✓ BaseAgent instantiation successful');
} catch (error) {
  console.log('✗ BaseAgent instantiation failed:', error.message);
}

try {
  const orchestrator = new AgentOrchestrator();
  console.log('✓ AgentOrchestrator instantiation successful');
} catch (error) {
  console.log('✗ AgentOrchestrator instantiation failed:', error.message);
}

try {
  const configManager = new AgentConfigManager();
  console.log('✓ AgentConfigManager instantiation successful');
} catch (error) {
  console.log('✗ AgentConfigManager instantiation failed:', error.message);
}

// Test 5: Platform manager instantiation (without initialization)
try {
  const flowiseManager = new FlowiseManager();
  console.log('✓ FlowiseManager instantiation successful');
} catch (error) {
  console.log('✗ FlowiseManager instantiation failed:', error.message);
}

try {
  const n8nManager = new N8nWorkflowManager();
  console.log('✓ N8nWorkflowManager instantiation successful');
} catch (error) {
  console.log('✗ N8nWorkflowManager instantiation failed:', error.message);
}

// Test 6: LangChain agent instantiation (without initialization)
try {
  const financialAgent = new FinancialAgent();
  console.log('✓ FinancialAgent instantiation successful');
} catch (error) {
  console.log('✗ FinancialAgent instantiation failed:', error.message);
}

try {
  const chatbotAgent = new ChatbotAgent();
  console.log('✓ ChatbotAgent instantiation successful');
} catch (error) {
  console.log('✗ ChatbotAgent instantiation failed:', error.message);
}

console.log('\nAgent System Test Complete!');
console.log('Note: Full initialization tests require API keys and external services to be running.');
