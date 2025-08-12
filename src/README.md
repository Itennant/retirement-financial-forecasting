# Financial Forecasting Application - Code Structure

This directory contains the source code for the retirement financial forecasting desktop application with AI integration.

## Directory Structure

### `src/core/`
Core application logic and business services
- `services/` - Business logic services
- `controllers/` - Request handlers and application controllers  
- `interfaces/` - Application interfaces and contracts

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
