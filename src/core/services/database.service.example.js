// Example usage of DatabaseService with Supabase integration
import DatabaseService from './database.service.js';
import config from '../../config/settings/app.config.js';

// Initialize database service
const db = new DatabaseService(config);

// Example functions demonstrating database operations
async function exampleDatabaseOperations() {
  try {
    // Example: Create a new user
    console.log('Creating a new user...');
    const newUser = await db.insert('users', {
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: new Date().toISOString()
    });
    console.log('New user created:', newUser);

    // Example: Retrieve users
    console.log('Retrieving users...');
    const users = await db.select('users', { active: true });
    console.log('Active users:', users);

    // Example: Update a user
    console.log('Updating user...');
    const updatedUser = await db.update('users', 
      { id: newUser.id }, 
      { name: 'Jane Doe', updated_at: new Date().toISOString() }
    );
    console.log('User updated:', updatedUser);

    // Example: Delete a user
    console.log('Deleting user...');
    const deleted = await db.delete('users', { id: newUser.id });
    console.log('User deleted:', deleted);

    // Example: Raw SQL query
    console.log('Executing raw SQL query...');
    const result = await db.raw('SELECT COUNT(*) as count FROM users');
    console.log('User count:', result.rows[0].count);

  } catch (error) {
    console.error('Database operation failed:', error);
  }
}

// Example: Supabase-specific operations (when using Supabase)
async function exampleSupabaseOperations() {
  if (config.database.client === 'supabase' && config.environment === 'development') {
    console.log('Running Supabase-specific operations...');
    
    // Get Supabase client instance
    const supabase = db.getDB();
    
    // Example: Real-time subscription
    // const subscription = supabase
    //   .from('users')
    //   .on('INSERT', payload => {
    //     console.log('New user inserted:', payload.new);
    //   })
    //   .subscribe();
    
    // Example: Authentication
    // const { user, error } = await supabase.auth.signIn({
    //   email: 'user@example.com',
    //   password: 'password'
    // });
    
    // Example: Storage
    // const { data, error } = await supabase.storage
    //   .from('avatars')
    //   .upload('public/avatar1.png', file);
    
    // Example: Vector operations (if using vector tables)
    // const embedding = [0.1, 0.2, 0.3, /* ... more values ... */];
    // const vectorResult = await db.insertVector('document_embeddings', {
    //   document_id: 'some-document-id',
    //   content: 'Example document content',
    //   embedding: embedding
    // });
    // 
    // const similarDocs = await db.semanticSearch('document_embeddings', embedding, 5);
  }
}

// Run examples
async function runExamples() {
  await exampleDatabaseOperations();
  await exampleSupabaseOperations();
  
  console.log('Database service examples completed');
}

// Export for use in other modules
export {
  exampleDatabaseOperations,
  exampleSupabaseOperations,
  runExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().then(() => {
    console.log('Examples finished');
  }).catch(error => {
    console.error('Examples failed:', error);
  });
}
