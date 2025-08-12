// LangChain Chatbot Agent
import { BaseAgent } from '../base/base-agent.js';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

export class ChatbotAgent extends BaseAgent {
  constructor(config = {}) {
    super('ChatbotAgent', config);
    this.model = null;
    this.chain = null;
    this.memory = null;
  }

  async initialize() {
    try {
      // Initialize OpenAI model
      this.model = new ChatOpenAI({
        modelName: this.config.modelName || 'gpt-4',
        temperature: this.config.temperature || 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Initialize memory for conversation history
      this.memory = new BufferMemory({
        returnMessages: true,
        memoryKey: 'history'
      });

      // Create conversation chain
      this.chain = new ConversationChain({
        llm: this.model,
        memory: this.memory,
        prompt: ChatPromptTemplate.fromMessages([
          [
            'system',
            'You are a helpful financial assistant for a retirement planning application. Answer questions about retirement planning, investments, and financial forecasting.'
          ],
          ['history', '{history}'],
          ['user', '{input}']
        ])
      });

      this.isEnabled = true;
      console.log('ChatbotAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ChatbotAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('ChatbotAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      const response = await this.chain.call({
        input: request.query || request.input
      });

      return this.formatResponse(response.response);
    } catch (error) {
      console.error('Error processing request in ChatbotAgent:', error);
      throw error;
    }
  }

  // Clear conversation history
  clearHistory() {
    if (this.memory) {
      this.memory.clear();
    }
  }

  // Get conversation history
  async getHistory() {
    if (this.memory) {
      const history = await this.memory.loadMemoryVariables({});
      return history.history;
    }
    return [];
  }
}

export default ChatbotAgent;
