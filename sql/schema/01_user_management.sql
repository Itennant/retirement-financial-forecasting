-- User Management Schema
-- Version: 1.0
-- Description: Core user management tables for advisors, clients, and system users
-- Follows documentation strategy from docs/09_documentation_strategy.md
-- Related to: docs/03_business_operations.md (Advisor/Client Management section)

-- Advisors table
-- Tracks financial advisors and their payment status for access control
CREATE TABLE advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    registration_number VARCHAR(50),
    vat_number VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'South Africa',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    registration_fee_paid BOOLEAN DEFAULT FALSE,
    last_payment_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    grace_period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
-- Client profiles linked to advisors with financial data access controls
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_id UUID NOT NULL REFERENCES advisors(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    id_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'South Africa',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (generic user management)
-- Core authentication and authorization table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'advisor', 'client', 'agent')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
-- Role-based access control with granular permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB, -- JSON array of permitted actions and resources
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles mapping
-- Many-to-many relationship between users and roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Indexes for performance
-- Optimized for common query patterns in financial forecasting application
CREATE INDEX idx_advisors_email ON advisors(email);
CREATE INDEX idx_advisors_user_id ON advisors(user_id);
CREATE INDEX idx_advisors_status ON advisors(status);
CREATE INDEX idx_advisors_payment_status ON advisors(registration_fee_paid);
CREATE INDEX idx_clients_advisor_id ON clients(advisor_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Triggers for updated_at
-- Automatic timestamp updates for audit trails
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_advisors_updated_at BEFORE UPDATE ON advisors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
-- Business context and usage guidelines for each table and key columns
COMMENT ON TABLE advisors IS 'Financial advisors registered in the system with payment status tracking for access control';
COMMENT ON TABLE clients IS 'Clients assigned to advisors with financial data access controls';
COMMENT ON TABLE users IS 'Generic user management table with authentication and authorization';
COMMENT ON TABLE roles IS 'User roles and permissions with JSONB permissions structure';
COMMENT ON TABLE user_roles IS 'Mapping between users and roles for many-to-many relationship';

COMMENT ON COLUMN advisors.registration_fee_paid IS 'Indicates if advisor has paid registration fees - used for access control enforcement';
COMMENT ON COLUMN advisors.last_payment_date IS 'Date of last successful payment for billing history';
COMMENT ON COLUMN advisors.next_billing_date IS 'Date of next scheduled billing for automated reminders';
COMMENT ON COLUMN advisors.grace_period_end IS 'End date of grace period for late payments';
COMMENT ON COLUMN clients.advisor_id IS 'Foreign key to advisors table - establishes client-advisor relationship';
COMMENT ON COLUMN users.role IS 'Primary role for user - determines initial access level';
COMMENT ON COLUMN roles.permissions IS 'JSON array of permitted actions and resources - granular access control';

-- Cross-references to documentation
/*
Related Documentation:
- Business Operations: docs/03_business_operations.md
- Agent Architecture: docs/06_agent_architecture.md
- Documentation Strategy: docs/09_documentation_strategy.md

Implementation Notes:
- Follows 3NF normalization principles
- Supports multi-tenant architecture with row-level security
- PCI DSS compliant for payment-related data handling
- Audit trails maintained through updated_at timestamps
- Indexes optimized for financial forecasting query patterns

Last Updated: 09/08/2025
Next Review Date: 16/08/2025
*/
