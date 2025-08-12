// LangChain Analysis Agent
import { BaseAgent } from '../base/base-agent.js';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export class AnalysisAgent extends BaseAgent {
  constructor(config = {}) {
    super('AnalysisAgent', config);
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
        temperature: this.config.temperature || 0.3, // Lower temperature for analysis
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      // Create prompt template for financial analysis
      this.prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          'You are a financial analysis expert. Analyze financial data, documents, and reports to provide insights and recommendations. Be thorough and accurate in your analysis.'
        ],
        ['user', '{input}']
      ]);

      // Initialize output parser
      this.parser = new StringOutputParser();

      // Create chain
      this.chain = this.prompt.pipe(this.model).pipe(this.parser);

      this.isEnabled = true;
      console.log('AnalysisAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AnalysisAgent:', error);
      this.isEnabled = false;
      throw error;
    }
  }

  async processRequest(request) {
    if (!this.isEnabled) {
      throw new Error('AnalysisAgent is not enabled');
    }

    this.validateRequest(request);

    try {
      let input = request.query || request.input;

      // If document analysis is requested, process documents
      if (request.documents) {
        input = await this.processDocuments(request.documents, input);
      }

      const response = await this.chain.invoke({
        input: input
      });

      return this.formatResponse(response);
    } catch (error) {
      console.error('Error processing request in AnalysisAgent:', error);
      throw error;
    }
  }

  // Process multiple documents for analysis
  async processDocuments(documents, query) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = documents.map(doc => 
      new Document({ pageContent: doc.content, metadata: doc.metadata || {} })
    );

    const splitDocs = await textSplitter.splitDocuments(docs);
    
    // Combine document content with query
    const combinedContent = splitDocs.map(doc => doc.pageContent).join('\n\n');
    return `Documents to analyze:\n${combinedContent}\n\nQuery: ${query}`;
  }

  // Perform comparative analysis
  async comparativeAnalysis(dataSets, analysisType) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Perform comparative analysis on the provided datasets and provide insights.'
      ],
      [
        'user',
        'Datasets: {datasets}\nAnalysis Type: {analysisType}\nProvide detailed comparative insights.'
      ]
    ]);

    const chain = prompt.pipe(this.model).pipe(this.parser);
    
    const response = await chain.invoke({
      datasets: JSON.stringify(dataSets, null, 2),
      analysisType: analysisType
    });

    return this.formatResponse(response);
  }
}

export default AnalysisAgent;
