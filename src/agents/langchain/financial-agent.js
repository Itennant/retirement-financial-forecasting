// LangChain Financial Agent
import { BaseAgent } from '../base/base-agent.js';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class FinancialAgent extends BaseAgent {
  constructor(config = {}) {
    super('FinancialAgent', config);
    this.model = null;
    this.prompt = null;
    this.parser = null;
    this.chain = null;
  }

  async initialize() {
    try {
      // Initialize OpenAI model
      this.model = new ChatOpenAI({
        modelName: this.config.modelName || 'gpt-4',
        temperature: this.config.temperature || 0.7,
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Create prompt template for financial analysis
      this.prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          'You are a financial planning assistant. Help users with retirement planning, investment advice, and financial forecasting. Always provide accurate information and consider the user\'s risk tolerance and financial goals.'
        ],
        ['user', '{input}']
      ]);

      // Initialize output parser
      this.parser = new StringOutputParser();

      // Create chain
      this.chain = this.prompt.pipe(this.model).pipe(this.parser);

      this.isEnabled = true;
      console.log('FinancialAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FinancialAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('FinancialAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      const response = await this.chain.invoke({
        input: request.query || request.input
      });

      return this.formatResponse(response);
    } catch (error) {
      console.error('Error processing request in FinancialAgent:', error);
      throw error;
    }
  }

  // Get financial recommendations based on user profile
  async getRecommendations(userProfile) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Based on the user\'s financial profile, provide personalized retirement planning recommendations.'
      ],
      [
        'user',
        'User Profile: Age {age}, Income {income}, Savings {savings}, Risk Tolerance {riskTolerance}, Retirement Goal {goal}'
      ]
    ]);

    const chain = prompt.pipe(this.model).pipe(this.parser);
    
    const response = await chain.invoke({
      age: userProfile.age,
      income: userProfile.income,
      savings: userProfile.savings,
      riskTolerance: userProfile.riskTolerance,
      goal: userProfile.retirementGoal
    });

    return this.formatResponse(response);
  }
}

export default FinancialAgent;
