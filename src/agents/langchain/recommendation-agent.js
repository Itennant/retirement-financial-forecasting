// LangChain Recommendation Agent
import { BaseAgent } from '../base/base-agent.js';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class RecommendationAgent extends BaseAgent {
  constructor(config = {}) {
    super('RecommendationAgent', config);
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
        temperature: this.config.temperature || 0.5,
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Create prompt template for recommendations
      this.prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          'You are a financial recommendation expert. Based on user profiles and financial data, provide personalized investment and retirement planning recommendations. Consider risk tolerance, time horizon, and financial goals.'
        ],
        ['user', '{input}']
      ]);

      // Initialize output parser
      this.parser = new StringOutputParser();

      // Create chain
      this.chain = this.prompt.pipe(this.model).pipe(this.parser);

      this.isEnabled = true;
      console.log('RecommendationAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RecommendationAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('RecommendationAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      const response = await this.chain.invoke({
        input: request.query || request.input
      });

      return this.formatResponse(response);
    } catch (error) {
      console.error('Error processing request in RecommendationAgent:', error);
      throw error;
    }
  }

  // Generate personalized investment recommendations
  async generateInvestmentRecommendations(userProfile, marketData) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Generate personalized investment recommendations based on user profile and current market conditions.'
      ],
      [
        'user',
        'User Profile: {userProfile}\nCurrent Market Data: {marketData}\nProvide detailed investment recommendations.'
      ]
    ]);

    const chain = prompt.pipe(this.model).pipe(this.parser);
    
    const response = await chain.invoke({
      userProfile: JSON.stringify(userProfile, null, 2),
      marketData: JSON.stringify(marketData, null, 2)
    });

    return this.formatResponse(response);
  }

  // Generate retirement planning recommendations
  async generateRetirementRecommendations(retirementProfile) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Generate comprehensive retirement planning recommendations based on the user\'s retirement profile.'
      ],
      [
        'user',
        'Retirement Profile: {retirementProfile}\nProvide detailed retirement planning recommendations including savings targets, investment strategies, and timeline adjustments.'
      ]
    ]);

    const chain = prompt.pipe(this.model).pipe(this.parser);
    
    const response = await chain.invoke({
      retirementProfile: JSON.stringify(retirementProfile, null, 2)
    });

    return this.formatResponse(response);
  }
}

export default RecommendationAgent;
