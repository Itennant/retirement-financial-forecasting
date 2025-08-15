// Example usage of vector operations with DatabaseService
// This example shows how to use vector operations for financial document similarity search
import DatabaseService from './database.service.js';
import config from '../../config/settings/app.config.js';

// Initialize database service
const db = new DatabaseService(config);

// Example: Generate embedding for financial document
// In a real application, you would use an embedding model like OpenAI embeddings
async function generateFinancialEmbedding(documentContent) {
  // This is a placeholder - in practice, you would use:
  // const { embedding } = await openai.embeddings.create({
  //   model: "text-embedding-ada-002",
  //   input: documentContent,
  // });
  // return embedding;
  
  // For this example, we'll return a mock embedding
  return Array(1536).fill(0).map(() => Math.random());
}

// Example: Insert financial document with embedding
async function insertFinancialDocument(document) {
  try {
    // Generate embedding for the document
    const embedding = await generateFinancialEmbedding(document.content);
    
    // For SQLite, convert embedding to JSON string
    const embeddingValue = Array.isArray(embedding) ? JSON.stringify(embedding) : embedding;
    
    // Insert document with embedding
    const result = await db.insertVector('financial_document_embeddings', {
      document_id: document.id,
      client_id: document.clientId,
      document_type: document.type, // 'investment_analysis', 'retirement_plan', 'risk_assessment', etc.
      content: document.content,
      embedding: embeddingValue,
      created_at: new Date().toISOString()
    });
    
    console.log('Financial document inserted with embedding:', result);
    return result;
  } catch (error) {
    console.error('Error inserting financial document:', error);
    throw error;
  }
}

// Example: Find similar financial documents
async function findSimilarFinancialDocuments(query, clientId, limit = 5) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateFinancialEmbedding(query);
    
    // Perform semantic search
    const similarDocs = await db.semanticSearch(
      'financial_document_embeddings', 
      queryEmbedding, 
      limit
    );
    
    console.log('Similar financial documents found:', similarDocs.rows || similarDocs);
    return similarDocs.rows || similarDocs;
  } catch (error) {
    console.error('Error finding similar financial documents:', error);
    throw error;
  }
}

// Example: Create vector table for financial documents
async function createFinancialDocumentEmbeddingsTable() {
  try {
    console.log('To create vector tables, you have two options:');
    console.log('\n1. For Supabase (PostgreSQL):');
    console.log('   - Enable the vector extension in your Supabase project:');
    console.log('     CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('   - Create tables using the SQL from sql/schema/05_vector_tables.sql');
    console.log('   - Modify embedding columns to use vector(1536) type');
    console.log('   - Create ivfflat indexes for efficient similarity search');
    
    console.log('\n2. For local development with SQLite:');
    console.log('   - Use the SQL from sql/schema/05_vector_tables.sql as-is');
    console.log('   - Embeddings will be stored as TEXT (JSON arrays)');
    console.log('   - Similarity calculations will be performed in JavaScript');
    
    console.log('\nFor more details, see the Supabase Integration Guide: docs/17_supabase_integration.md');
  } catch (error) {
    console.error('Error displaying table creation instructions:', error);
  }
}

// Example usage
async function runVectorExamples() {
  console.log('Running vector operation examples...');
  
  // Show table creation instructions
  await createFinancialDocumentEmbeddingsTable();
  
  // Check if table exists before proceeding
  try {
    // Try to insert a test document to check if table exists
    const testDocument = {
      id: 'test-doc-' + Date.now(),
      clientId: 'test-client',
      type: 'investment_analysis',
      content: 'Test document for vector operations example'
    };
    
    await insertFinancialDocument(testDocument);
    console.log('Successfully connected to vector table');
    
    // Clean up test document
    if (db.config.database.client === 'supabase' && db.supabaseInstance) {
      await db.supabaseInstance.from('financial_document_embeddings').delete().match({ id: testDocument.id });
    } else {
      // For SQLite, we would need to implement delete functionality
      console.log('Test document created (not deleted for SQLite)');
    }
    
  } catch (error) {
    console.warn('Vector table may not exist or is not properly configured:', error.message);
    console.log('Please create the vector tables before running this example.');
    console.log('See instructions above or check sql/schema/05_vector_tables.sql');
    return;
  }
  
  console.log('Vector operation examples completed');
}

// Export for use in other modules
export {
  generateFinancialEmbedding,
  insertFinancialDocument,
  findSimilarFinancialDocuments,
  createFinancialDocumentEmbeddingsTable,
  runVectorExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runVectorExamples().then(() => {
    console.log('Vector examples finished');
  }).catch(error => {
    console.error('Vector examples failed:', error);
  });
}
