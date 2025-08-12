// Agent Usage Example
import { getAgentManager } from '../agent-manager.js';

// Example usage of the agent system
async function example() {
  try {
    // Initialize the agent manager
    const agentManager = getAgentManager();
    await agentManager.initialize();

    console.log('Agent Manager initialized successfully');

    // Get system health status
    const healthStatus = await agentManager.getHealthStatus();
    console.log('Health Status:', JSON.stringify(healthStatus, null, 2));

    // Get registered agents and platforms
    const agents = agentManager.getAgents();
    const platforms = agentManager.getPlatforms();
    
    console.log('Registered Agents:', agents);
    console.log('Registered Platforms:', platforms);

    // Example 1: Process a request through LangChain financial agent
    console.log('\n--- Processing Financial Request ---');
    const financialRequest = {
      agentId: 'langchain-financial',
      query: 'What are the best investment strategies for retirement planning?'
    };

    const financialResponse = await agentManager.processRequest(financialRequest);
    console.log('Financial Response:', JSON.stringify(financialResponse, null, 2));

    // Example 2: Process a chatbot request
    console.log('\n--- Processing Chatbot Request ---');
    const chatbotRequest = {
      agentId: 'langchain-chatbot',
      input: 'Hello! I need help with my retirement planning.'
    };

    const chatbotResponse = await agentManager.processRequest(chatbotRequest);
    console.log('Chatbot Response:', JSON.stringify(chatbotResponse, null, 2));

    // Example 3: Batch process multiple requests
    console.log('\n--- Batch Processing Requests ---');
    const batchRequests = [
      {
        agentId: 'langchain-analysis',
        query: 'Analyze this financial portfolio: Stocks 60%, Bonds 30%, Cash 10%'
      },
      {
        agentId: 'langchain-recommendation',
        input: 'Recommend investment options for a 35-year-old with moderate risk tolerance'
      }
    ];

    const batchResponse = await agentManager.batchProcess(batchRequests);
    console.log('Batch Response:', JSON.stringify(batchResponse, null, 2));

    // Example 4: Create a new Flowise agent (if Flowise is running)
    try {
      console.log('\n--- Creating Flowise Agent ---');
      // This would work if Flowise server is running
      // const flowiseAgent = await agentManager.createAgent('my-chatflow', 'flowise', {
      //   chatflowId: 'your-chatflow-id'
      // });
      // console.log('Flowise Agent created:', flowiseAgent);
    } catch (error) {
      console.log('Flowise agent creation failed (Flowise server likely not running):', error.message);
    }

    // Example 5: Update agent configuration
    console.log('\n--- Updating Agent Configuration ---');
    const updatedConfig = await agentManager.updateAgentConfig('financial', 'langchain', {
      temperature: 0.5,
      maxTokens: 1500
    });
    console.log('Updated Configuration:', updatedConfig);

    // Stop all agents
    console.log('\n--- Stopping All Agents ---');
    await agentManager.stopAllAgents();
    console.log('All agents stopped successfully');

  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Run the example
// example();

export { example };
