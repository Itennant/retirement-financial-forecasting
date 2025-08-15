# Financial Forecasting Application - Code Structure

This directory contains the source code for the retirement financial forecasting desktop application with AI integration.

## Directory Structure

### `src/core/`
Core application logic and business services
- `services/` - Business logic services
  - `database.service.js` - Database service with Supabase integration
- `controllers/` - Request handlers and application controllers  

### `src/agents/`
AI agent system implementation
- `mcp/` - MCP server implementation and agent registration
- `communication/` - Agent-to-agent communication protocols
- `orchestration/` - Agent orchestration and management

### `src/billing/`
Payment processing and billing system
- `payments/` - Payment processing logic and workflows
- `gateways/` - Payment gateway integrations
- `invoices/` - Invoice generation and management
- `subscriptions/` - Subscription management and lifecycle

### `src/ui/`
User interface components and screens
- `components/` - Reusable UI components
- `screens/` - Application screens and views
- `styles/` - CSS/SCSS styles and themes

### `src/models/`
Data models and domain entities
- `financial/` - Financial data models and calculations
- `ai/` - AI/ML models and agent data structures
- `user/` - User and client data models

### `src/data/`
Data access and persistence layer
- `repositories/` - Data repository implementations
- `dto/` - Data transfer objects
- `migrations/` - Database migration scripts

### `src/utils/`
Utility functions and helpers
- `helpers/` - General utility functions
- `validators/` - Input and data validation
- `formatters/` - Data formatting utilities

### `src/config/`
Application configuration
- `environments/` - Environment-specific configurations
- `settings/` - Application settings and constants

### `src/tests/`
Test suites and specifications
- `unit/` - Unit tests
- `integration/` - Integration tests
- `e2e/` - End-to-end tests

## Development Guidelines

- Follow the existing directory structure for new code
- Maintain separation of concerns between layers
- Use dependency injection for loose coupling
- Write tests for all business logic
- Document public APIs and interfaces

## Database Service and Supabase Integration

The application now includes a `DatabaseService` that provides seamless integration with both SQLite (default) and Supabase (development mode). This service abstracts database operations and automatically switches between database backends based on environment configuration.

### Key Features
- Automatic database switching based on environment variables
- Unified API for database operations (select, insert, update, delete)
- Support for raw SQL queries
- Supabase-specific features (real-time subscriptions, authentication, storage)

### Usage
```javascript
const DatabaseService = require('./core/services/database.service');
const config = require('./config/settings/app.config');

// Initialize database service
const db = new DatabaseService(config);

// Perform database operations
const users = await db.select('users', { active: true });
const newUser = await db.insert('users', { name: 'John Doe', email: 'john@example.com' });
```

### Configuration
To use Supabase in development mode, set the following environment variables:
```bash
export DATABASE_CLIENT=supabase
export SUPABASE_URL=your_supabase_project_url
export SUPABASE_KEY=your_supabase_api_key
```

For detailed setup instructions, see [Supabase Integration Guide](../docs/17_supabase_integration.md).

## Additional Documentation

For information on development workflow and branching strategy, see:
- [Development Workflow Documentation (MD)](../docs/09_development_workflow.md)
- [Development Workflow Documentation (DOCX)](../docs/09_development_workflow.docx)

For cross-platform development setup instructions, see:
- [Cross-Platform Setup Documentation (MD)](../docs/10_cross_platform_setup.md)
- [Cross-Platform Setup Documentation (DOCX)](../docs/10_cross_platform_setup.docx)
