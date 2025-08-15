// Test file for DatabaseService with Supabase integration
import DatabaseService from './database.service.js';
import config from '../../config/settings/app.config.js';

// Test database service functionality
async function testDatabaseService() {
  console.log('Testing DatabaseService...');
  
  // Initialize database service
  const db = new DatabaseService(config);
  
  try {
    // Test connection
    console.log('Testing database connection...');
    
    // Simple test query
    const result = await db.raw('SELECT 1 as test');
    console.log('Database connection successful:', result.rows);
    
    // Test insert operation
    console.log('Testing insert operation...');
    const insertResult = await db.insert('users', {
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString()
    });
    console.log('Insert operation successful:', insertResult);
    
    // Test select operation
    console.log('Testing select operation...');
    const selectResult = await db.select('users', { email: 'test@example.com' });
    console.log('Select operation successful:', selectResult);
    
    // Test update operation
    console.log('Testing update operation...');
    const updateResult = await db.update('users', 
      { email: 'test@example.com' }, 
      { name: 'Updated Test User' }
    );
    console.log('Update operation successful:', updateResult);
    
    // Test delete operation
    console.log('Testing delete operation...');
    const deleteResult = await db.delete('users', { email: 'test@example.com' });
    console.log('Delete operation successful:', deleteResult);
    
    console.log('All database service tests passed!');
    
  } catch (error) {
    console.error('Database service test failed:', error);
  } finally {
    // Close database connection
    await db.close();
    console.log('Database connection closed');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseService().then(() => {
    console.log('Database service test completed');
  }).catch(error => {
    console.error('Database service test failed:', error);
  });
}

export default testDatabaseService;
