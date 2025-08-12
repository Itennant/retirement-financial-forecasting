-- Financial Data Schema
-- Version: 1.0
-- Description: Core financial data tables for scenarios, projections, and calculations

-- Financial scenarios table
CREATE TABLE financial_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    advisor_id UUID NOT NULL REFERENCES advisors(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scenario_type VARCHAR(50) DEFAULT 'retirement' CHECK (scenario_type IN ('retirement', 'investment', 'debt_management', 'estate_planning')),
    base_currency VARCHAR(3) DEFAULT 'ZAR',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'draft')),
    is_primary BOOLEAN DEFAULT FALSE,
    assumptions JSONB, -- Scenario assumptions and parameters
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cash flows table
CREATE TABLE cash_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    flow_type VARCHAR(50) NOT NULL CHECK (flow_type IN ('income', 'expense', 'asset_sale', 'liability_payment')),
    category VARCHAR(100), -- 'salary', 'pension', 'rental', 'medical', 'education', etc.
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly', 'quarterly', 'annually')),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for ongoing
    escalation_rate DECIMAL(5, 4) DEFAULT 0, -- Annual escalation percentage
    tax_deductible BOOLEAN DEFAULT FALSE,
    is_inflation_adjusted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id),
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL, -- 'property', 'investment_fund', 'retirement_fund', 'vehicle', 'business'
    category VARCHAR(100), -- 'residential', 'commercial', 'equity', 'bond', 'pension', etc.
    description TEXT,
    current_value DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    purchase_date DATE,
    purchase_value DECIMAL(15, 2),
    expected_return_rate DECIMAL(5, 4), -- Annual expected return percentage
    volatility DECIMAL(5, 4), -- Standard deviation of returns
    liquidity VARCHAR(20) DEFAULT 'moderate' CHECK (liquidity IN ('high', 'moderate', 'low')),
    is_retirement_fund BOOLEAN DEFAULT FALSE,
    tax_implications JSONB, -- Tax treatment information
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Liabilities table
CREATE TABLE liabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id),
    name VARCHAR(255) NOT NULL,
    liability_type VARCHAR(100) NOT NULL, -- 'mortgage', 'personal_loan', 'credit_card', 'business_loan'
    description TEXT,
    current_balance DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    interest_rate DECIMAL(5, 4) NOT NULL, -- Annual interest rate
    interest_type VARCHAR(20) DEFAULT 'fixed' CHECK (interest_type IN ('fixed', 'variable')),
    monthly_payment DECIMAL(15, 2),
    start_date DATE NOT NULL,
    end_date DATE,
    outstanding_balance DECIMAL(15, 2),
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    asset_id UUID REFERENCES assets(id), -- Link to specific asset if applicable
    name VARCHAR(255) NOT NULL,
    investment_type VARCHAR(100) NOT NULL, -- 'unit_trust', 'shares', 'bonds', 'etf', 'property', 'private_equity'
    fund_name VARCHAR(255),
    isin_code VARCHAR(50), -- International Securities Identification Number
    units_held DECIMAL(15, 4),
    unit_price DECIMAL(15, 4),
    total_value DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    purchase_date DATE,
    purchase_price DECIMAL(15, 4),
    provider VARCHAR(255), -- Investment provider/broker
    fee_structure JSONB, -- Management fees, performance fees, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monte Carlo simulations table
CREATE TABLE monte_carlo_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    simulation_name VARCHAR(255) NOT NULL,
    number_of_iterations INTEGER NOT NULL DEFAULT 1000,
    confidence_level DECIMAL(5, 4) DEFAULT 0.95, -- 95% confidence
    time_horizon_years INTEGER NOT NULL,
    initial_portfolio_value DECIMAL(15, 2) NOT NULL,
    annual_contribution DECIMAL(15, 2),
    annual_withdrawal DECIMAL(15, 2),
    expected_return_rate DECIMAL(5, 4),
    standard_deviation DECIMAL(5, 4),
    inflation_rate DECIMAL(5, 4) DEFAULT 0.06, -- Default South African inflation
    results JSONB, -- Simulation results and statistics
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Financial projections table
CREATE TABLE financial_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES financial_scenarios(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    projection_date DATE NOT NULL,
    year_number INTEGER NOT NULL,
    age INTEGER,
    net_worth DECIMAL(15, 2),
    liquid_assets DECIMAL(15, 2),
    fixed_assets DECIMAL(15, 2),
    total_liabilities DECIMAL(15, 2),
    net_assets DECIMAL(15, 2),
    annual_income DECIMAL(15, 2),
    annual_expenses DECIMAL(15, 2),
    annual_savings DECIMAL(15, 2),
    withdrawal_amount DECIMAL(15, 2),
    cumulative_savings DECIMAL(15, 2),
    success_probability DECIMAL(5, 4), -- Monte Carlo success probability
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_financial_scenarios_client_id ON financial_scenarios(client_id);
CREATE INDEX idx_financial_scenarios_advisor_id ON financial_scenarios(advisor_id);
CREATE INDEX idx_financial_scenarios_status ON financial_scenarios(status);
CREATE INDEX idx_cash_flows_scenario_id ON cash_flows(scenario_id);
CREATE INDEX idx_cash_flows_client_id ON cash_flows(client_id);
CREATE INDEX idx_cash_flows_flow_type ON cash_flows(flow_type);
CREATE INDEX idx_assets_client_id ON assets(client_id);
CREATE INDEX idx_assets_scenario_id ON assets(scenario_id);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);
CREATE INDEX idx_liabilities_client_id ON liabilities(client_id);
CREATE INDEX idx_liabilities_scenario_id ON liabilities(scenario_id);
CREATE INDEX idx_investments_client_id ON investments(client_id);
CREATE INDEX idx_investments_asset_id ON investments(asset_id);
CREATE INDEX idx_monte_carlo_simulations_scenario_id ON monte_carlo_simulations(scenario_id);
CREATE INDEX idx_monte_carlo_simulations_client_id ON monte_carlo_simulations(client_id);
CREATE INDEX idx_financial_projections_scenario_id ON financial_projections(scenario_id);
CREATE INDEX idx_financial_projections_client_id ON financial_projections(client_id);
CREATE INDEX idx_financial_projections_projection_date ON financial_projections(projection_date);

-- Triggers for updated_at
CREATE TRIGGER update_financial_scenarios_updated_at BEFORE UPDATE ON financial_scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_flows_updated_at BEFORE UPDATE ON cash_flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liabilities_updated_at BEFORE UPDATE ON liabilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE financial_scenarios IS 'Financial planning scenarios for clients';
COMMENT ON TABLE cash_flows IS 'Income and expense cash flows for financial projections';
COMMENT ON TABLE assets IS 'Client assets including properties, investments, and retirement funds';
COMMENT ON TABLE liabilities IS 'Client liabilities including loans and credit facilities';
COMMENT ON TABLE investments IS 'Detailed investment holdings and portfolio information';
COMMENT ON TABLE monte_carlo_simulations IS 'Monte Carlo simulation results for risk analysis';
COMMENT ON TABLE financial_projections IS 'Projected financial outcomes over time';

COMMENT ON COLUMN financial_scenarios.is_primary IS 'Indicates if this is the primary/active scenario for the client';
COMMENT ON COLUMN cash_flows.escalation_rate IS 'Annual percentage increase for inflation or salary growth';
COMMENT ON COLUMN assets.expected_return_rate IS 'Expected annual return percentage for investment projections';
COMMENT ON COLUMN liabilities.interest_type IS 'Whether the interest rate is fixed or variable over time';
