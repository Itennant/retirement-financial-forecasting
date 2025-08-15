# Supabase Integration Guide

This document explains how to set up seamless Supabase integration while in development mode, with configuration for Render environment variables.

## Overview

The Financial Forecasting Application now supports Supabase integration in development mode. This allows developers to work with a PostgreSQL database (via Supabase) during development while maintaining SQLite for production deployments.

## Configuration

### Environment Variables

The application uses environment variables to determine which database to use. The following variables are relevant for Supabase integration:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_CLIENT` | Database client to use (`sqlite3` or `supabase`) | `sqlite3` |
| `DATABASE_PATH` | Path to SQLite database file | `./data/app.db` |
| `SUPABASE_URL` | Supabase project URL | `''` |
| `SUPABASE_KEY` | Supabase API key | `''` |

### Development Mode Setup

1. **Set environment variables** for Supabase in development:
   ```bash
   export DATABASE_CLIENT=supabase
   export SUPABASE_URL=your_supabase_project_url
   export SUPABASE_KEY=your_supabase_api_key
   ```

2. **Run the application in development mode**:
   ```bash
   npm run dev
   ```

3. **The application will automatically**:
   - Detect Supabase configuration in development mode
   - Initialize Supabase client connection
   - Use Supabase for all database operations
   - Fall back to SQLite if Supabase is not configured

### Render Environment Setup

For Render deployment, configure the following environment variables in your Render dashboard:

1. Go to your Render dashboard
2. Select your application
3. Go to "Environment" tab
4. Add the following variables:
   ```
   DATABASE_CLIENT=supabase
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_api_key
   ```

## Database Service Usage

The application includes a `DatabaseService` that abstracts database operations and works with both SQLite and Supabase.

### Example Usage

```javascript
const DatabaseService = require('./core/services/database.service');
const config = require('./config/settings/app.config');

// Initialize database service
const db = new DatabaseService(config);

// Select data
const users = await db.select('users', { active: true });

// Insert data
const newUser = await db.insert('users', {
  name: 'John Doe',
  email: 'john@example.com',
  active: true
});

// Update data
const updatedUser = await db.update('users', { id: 1 }, {
  name: 'Jane Doe'
});

// Delete data
const deleted = await db.delete('users', { id: 1 });
```

## Supabase-Specific Features

When using Supabase in development mode, you can take advantage of additional features:

### Real-time Subscriptions

```javascript
// Subscribe to real-time changes
const subscription = db.getDB()
  .from('users')
  .on('UPDATE', payload => {
    console.log('User updated:', payload.new);
  })
  .subscribe();
```

### Authentication

```javascript
// User authentication
const { user, error } = await db.getDB().auth.signIn({
  email: 'user@example.com',
  password: 'password'
});
```

### Storage

```javascript
// File storage
const { data, error } = await db.getDB().storage
  .from('avatars')
  .upload('public/avatar1.png', file);
```

## Migration from SQLite to Supabase

To migrate existing data from SQLite to Supabase:

1. Export data from SQLite:
   ```bash
   sqlite3 ./data/app.db .dump > backup.sql
   ```

2. Import data to Supabase:
   ```bash
   psql -h db.supabase.co -p 5432 -U postgres -d postgres < backup.sql
   ```

## Troubleshooting

### Common Issues

1. **Supabase connection fails**:
   - Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
   - Check network connectivity
   - Ensure Supabase project is not paused

2. **Fallback to SQLite**:
   - If Supabase is not configured properly, the application will automatically fall back to SQLite
   - Check console logs for initialization messages

3. **Environment variables not loading**:
   - Ensure variables are set before starting the application
   - For Render, verify variables are set in the dashboard

### Debugging

Enable debug logging by setting:
```bash
export DEBUG=supabase:*
```

## Security Considerations

1. **API Keys**:
   - Never commit Supabase keys to version control
   - Use environment variables for all sensitive data
   - Rotate keys regularly

2. **Row Level Security**:
   - Enable RLS on Supabase tables
   - Define appropriate policies for user data isolation

3. **Connection Security**:
   - Supabase connections use SSL by default
   - Verify SSL certificates in production

## Next Steps

1. Review the SQL schema files in `sql/schema/` to understand the database structure
2. Set up Supabase project and configure environment variables
3. Test database operations in development mode
4. Deploy to Render with Supabase configuration

## Vector Tables for AI Applications

If your application requires vector similarity search (for example, for document retrieval, recommendation systems, or semantic search), you can create vector tables that work with both Supabase and SQLite.

### Setting up Vector Support

For Supabase (PostgreSQL):
1. Enable the vector extension in your Supabase project:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. Create vector tables using the vector type:
   ```sql
   -- Example: Document embeddings for semantic search
   CREATE TABLE document_embeddings (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       document_id UUID REFERENCES documents(id),
       content TEXT,
       embedding vector(1536), -- Adjust dimension based on your embedding model
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Index for efficient similarity search
   CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
   ```

For SQLite (local development):
1. Create tables with embedding stored as TEXT (JSON array):
   ```sql
   -- Example: Document embeddings for semantic search
   CREATE TABLE document_embeddings (
       id TEXT PRIMARY KEY,
       document_id TEXT,
       content TEXT,
       embedding TEXT, -- JSON array of numbers
       created_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Creating Vector Tables

Before running vector examples, you need to create the vector tables:

1. For Supabase: Run the SQL commands in your Supabase SQL editor
2. For local development with SQLite: 
   - Create the SQLite table with embedding as TEXT
   - Or use the schema migration files in `sql/schema/05_vector_tables.sql` (modified for SQLite)

### When using the DatabaseService with vector tables:
```javascript
// Example: Inserting document embeddings
const embedding = await generateEmbedding(documentContent); // Your embedding function
await db.insertVector('document_embeddings', {
    document_id: documentId,
    content: documentContent,
    embedding: embedding
});

// Example: Semantic search
const similarDocs = await db.semanticSearch('document_embeddings', queryEmbedding, 5);
```

### Vector Operations Implementation

The DatabaseService handles the differences between Supabase and SQLite:

- For Supabase: Uses native vector operations with `vector` type
- For SQLite: Stores embeddings as JSON strings and performs similarity calculations in JavaScript

For more information on the implementation, see `src/core/services/database.service.js` and the vector operations example.

### Vector Table Best Practices

1. Choose appropriate vector dimensions based on your embedding model (e.g., 1536 for OpenAI ada-002)
2. Use appropriate indexing methods (ivfflat, hnsw) for your search requirements
3. Consider partitioning large vector tables for better performance
4. Implement proper error handling for vector operations
5. Monitor storage usage as vector tables can become large

### Running Vector Examples

To run the vector operations example:

```bash
npm run example:vector
```

This will demonstrate:
- Creating vector tables
- Inserting documents with embeddings
- Performing semantic search
- Handling vector operations with the DatabaseService

For more information on vector operations with Supabase, refer to the [Supabase Vector documentation](https://supabase.com/docs/guides/ai/vector-columns).
