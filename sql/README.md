# SQL Database Structure

This directory contains all SQL-related files for the Financial Forecasting Application database, following the documentation strategy outlined in `docs/09_documentation_strategy.md`.

## Directory Structure

### `schema/`
Database schema definitions and table structures
- **01_user_management.sql**: Advisors, clients, users, and roles tables
- **02_payment_processing.sql**: Payments, invoices, subscriptions, and billing tables
- **03_ai_agents.sql**: AI agent registration, usage tracking, and monitoring tables
- **04_financial_data.sql**: Financial scenarios, projections, and calculation tables

### `queries/`
Reusable SQL queries and stored procedures
- Financial calculation queries
- Reporting queries
- User data queries
- Payment status queries

### `migrations/`
Database migration scripts for version control
- Schema evolution scripts
- Data migration scripts
- Rollback procedures

### `seeds/`
Database seed data for development and testing
- Initial reference data
- Test user data
- Sample financial scenarios
- Default configuration data

### `procedures/`
Stored procedures and functions
- Complex financial calculations
- Batch processing routines
- Data aggregation functions
- Business logic implementations

## Database Design Principles

### Normalization
- Third normal form (3NF) compliance
- Proper foreign key relationships
- Elimination of data redundancy
- Support for complex financial data relationships

### Security
- Role-based access control with granular permissions
- Data encryption for sensitive fields (PII, financial data)
- Audit trails for all financial transactions and user actions
- PCI DSS compliance for payment data handling
- Row-level security for multi-tenant data isolation

### Performance
- Proper indexing strategies for financial query patterns
- Query optimization for Monte Carlo simulations and projections
- Partitioning for large historical datasets
- Caching considerations for frequently accessed data
- Materialized views for complex reporting queries

## Key Tables Overview

### User Management (`01_user_management.sql`)
- `advisors` - Financial advisors with registration and payment status tracking
- `clients` - Client profiles linked to advisors with financial data
- `users` - Generic user management with authentication and roles
- `roles` - Access control roles and permissions with JSONB permissions structure
- `user_roles` - Many-to-many mapping between users and roles

### Payment Processing (`02_payment_processing.sql`)
- `payment_methods` - Stored payment methods with provider integration
- `invoices` - Invoice generation and tracking for advisor/client billing
- `payments` - Payment transaction records with gateway integration
- `subscriptions` - Subscription management for advisors and agents
- `agent_usage` - Agent usage tracking for billing purposes
- `agent_commissions` - Commission calculations and payments for agents

### AI Agents (`03_ai_agents.sql`)
- `agents` - AI agent registration and metadata with MCP integration
- `agent_sessions` - Individual agent usage sessions with performance tracking
- `agent_communications` - Inter-agent communication records and messaging
- `agent_orchestration` - Agent workflow orchestration and coordination
- `agent_monitoring` - Agent performance and health monitoring metrics

### Financial Data (`04_financial_data.sql`)
- `financial_scenarios` - Client financial scenarios with assumptions and parameters
- `cash_flows` - Income and expense projections with escalation rates
- `assets` - Asset holdings, valuations, and retirement fund tracking
- `liabilities` - Debt and liability tracking with interest calculations
- `investments` - Investment portfolio data with fund-specific information
- `monte_carlo_simulations` - Monte Carlo simulation results and risk analysis
- `financial_projections` - Projected financial outcomes over time periods

## Commercial Operations Integration

### Payment Enforcement
- Automated blocking of unpaid advisors through `advisors.registration_fee_paid`
- Client report generation blocking through payment status checks
- Grace period management with configurable expiration dates
- Manual payment processing support for advisor-controlled billing

### AI Agent Monetization
- Usage-based billing through `agent_usage` table with cost tracking
- Subscription management for different agent tiers
- Commission processing for agent networks and partnerships
- Performance-based pricing with usage quotas and limits

## Development Guidelines

### Naming Conventions
- Use snake_case for table and column names consistently
- Prefix table names with functional area (e.g., `user_`, `payment_`, `agent_`)
- Use descriptive, business-focused names that reflect domain concepts
- Maintain consistency across related tables and foreign key relationships
- Use standard suffixes (_id for foreign keys, _at for timestamps)

### Data Types and Precision
- Use DECIMAL(15,2) for financial amounts to ensure precision
- Use UUIDs for primary keys to support distributed systems
- Use TIMESTAMP with timezone for all date/time storage
- Use JSONB for flexible configuration and metadata storage
- Implement proper constraints and check constraints for data integrity
- Use appropriate indexing strategies for query performance

### Documentation and Maintenance
- Comment all table and column definitions with business context
- Maintain entity-relationship diagrams in documentation
- Document business rules and constraints in table comments
- Version control all schema changes with migration scripts
- Follow the documentation strategy for regular updates and reviews
- Cross-reference with technical documentation in `docs/` directory

## Cross-References
- Related to: [Business Operations Document](../docs/03_business_operations.md)
- Related to: [Agent Architecture Document](../docs/06_agent_architecture.md)
- Related to: [Standing Data Calculations](../docs/07_standing_data_calculations.md)
- Follows: [Documentation Strategy](../docs/09_documentation_strategy.md)

## Last Updated
09/08/2025

## Next Review Date
16/08/2025
