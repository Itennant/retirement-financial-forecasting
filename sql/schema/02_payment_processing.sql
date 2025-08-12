-- Payment Processing Schema
-- Version: 1.0
-- Description: Payment processing tables for advisors, clients, and agent payments

-- Payment methods table
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe')),
    provider VARCHAR(50), -- 'stripe', 'paypal', etc.
    last_four_digits VARCHAR(4),
    expiry_month INTEGER,
    expiry_year INTEGER,
    cardholder_name VARCHAR(255),
    billing_address JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issuer_id UUID NOT NULL REFERENCES users(id), -- Who creates the invoice
    recipient_id UUID NOT NULL REFERENCES users(id), -- Who receives the invoice
    recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('advisor', 'client')),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
    due_date TIMESTAMP,
    paid_date TIMESTAMP,
    cancelled_date TIMESTAMP,
    payment_method VARCHAR(50), -- How it was paid
    payment_reference VARCHAR(255), -- External payment reference
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    subtotal DECIMAL(12, 2),
    total DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id),
    payer_id UUID NOT NULL REFERENCES users(id),
    payee_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    payment_method VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'manual', etc.
    payment_reference VARCHAR(255), -- External reference from payment provider
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    gateway_response JSONB, -- Raw response from payment gateway
    processed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    plan_type VARCHAR(50) NOT NULL, -- 'advisor_basic', 'advisor_premium', 'agent_basic', 'agent_premium'
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    billing_cycle VARCHAR(10) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'quarterly')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'suspended', 'expired')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    payment_method_id UUID REFERENCES payment_methods(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent usage tracking table
CREATE TABLE agent_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id),
    usage_type VARCHAR(50) NOT NULL, -- 'calculation', 'report_generation', 'api_call', etc.
    usage_amount INTEGER NOT NULL DEFAULT 1,
    cost_per_unit DECIMAL(10, 4) DEFAULT 0.01,
    total_cost DECIMAL(12, 2) NOT NULL,
    billing_period_start TIMESTAMP,
    billing_period_end TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'billed')),
    payment_id UUID REFERENCES payments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent commissions table
CREATE TABLE agent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES users(id),
    revenue_generated DECIMAL(12, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) DEFAULT 0.1000, -- 10%
    commission_amount DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'processed')),
    payment_id UUID REFERENCES payments(id),
    billing_period_start TIMESTAMP,
    billing_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);
CREATE INDEX idx_invoices_issuer_id ON invoices(issuer_id);
CREATE INDEX idx_invoices_recipient_id ON invoices(recipient_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_payee_id ON payments(payee_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_agent_usage_agent_id ON agent_usage(agent_id);
CREATE INDEX idx_agent_usage_payment_status ON agent_usage(payment_status);
CREATE INDEX idx_agent_commissions_agent_id ON agent_commissions(agent_id);
CREATE INDEX idx_agent_commissions_payment_status ON agent_commissions(payment_status);

-- Triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_usage_updated_at BEFORE UPDATE ON agent_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_commissions_updated_at BEFORE UPDATE ON agent_commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE payment_methods IS 'Stored payment methods for users';
COMMENT ON TABLE invoices IS 'Invoice generation and tracking';
COMMENT ON TABLE payments IS 'Payment transaction records';
COMMENT ON TABLE subscriptions IS 'Subscription management for advisors and agents';
COMMENT ON TABLE agent_usage IS 'Agent usage tracking for billing';
COMMENT ON TABLE agent_commissions IS 'Agent commission calculations and payments';

COMMENT ON COLUMN invoices.issuer_id IS 'User who creates/sends the invoice';
COMMENT ON COLUMN invoices.recipient_id IS 'User who receives the invoice';
COMMENT ON COLUMN payments.payer_id IS 'User who makes the payment';
COMMENT ON COLUMN payments.payee_id IS 'User who receives the payment';
COMMENT ON COLUMN agent_usage.usage_type IS 'Type of agent service used for billing purposes';
