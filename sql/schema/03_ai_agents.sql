-- AI Agents Schema
-- Version: 1.0
-- Description: AI agent registration, usage tracking, and metadata tables

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    agent_type VARCHAR(100) NOT NULL, -- 'financial_modeling', 'user_interaction', 'compliance_monitoring', etc.
    version VARCHAR(20) DEFAULT '1.0.0',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'maintenance')),
    owner_id UUID REFERENCES users(id), -- User who owns/created this agent
    mcp_endpoint VARCHAR(500), -- MCP server endpoint URL
    api_key_hash VARCHAR(255), -- Hashed API key for authentication
    capabilities JSONB, -- JSON array of agent capabilities
    configuration JSONB, -- Agent-specific configuration settings
    max_concurrent_sessions INTEGER DEFAULT 10,
    usage_quota INTEGER DEFAULT 10000, -- Monthly usage quota
    current_usage INTEGER DEFAULT 0, -- Current month usage
    subscription_type VARCHAR(50) DEFAULT 'free' CHECK (subscription_type IN ('free', 'basic', 'pro', 'premium', 'enterprise')),
    last_heartbeat TIMESTAMP, -- Last check-in time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent sessions table
CREATE TABLE agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id),
    user_id UUID REFERENCES users(id), -- User who initiated the session
    session_type VARCHAR(50) NOT NULL, -- 'financial_calculation', 'report_generation', 'data_analysis', etc.
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'timeout')),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_ms INTEGER, -- Session duration in milliseconds
    input_data JSONB, -- Input data for the session
    output_data JSONB, -- Output/results from the session
    error_message TEXT, -- Error message if session failed
    resource_usage JSONB, -- CPU, memory, etc. usage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent communications table
CREATE TABLE agent_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_agent_id UUID NOT NULL REFERENCES agents(id),
    receiver_agent_id UUID NOT NULL REFERENCES agents(id),
    message_type VARCHAR(100) NOT NULL, -- 'request', 'response', 'notification', 'error'
    protocol VARCHAR(50) DEFAULT 'mcp', -- 'mcp', 'rest', 'websocket'
    payload JSONB, -- Message payload
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'processed', 'failed')),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent orchestration table
CREATE TABLE agent_orchestration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    agents_involved JSONB, -- Array of agent IDs involved in workflow
    execution_order JSONB, -- Order of agent execution
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'failed')),
    start_conditions JSONB, -- Conditions that trigger workflow start
    completion_criteria JSONB, -- Criteria for workflow completion
    error_handling JSONB, -- Error handling strategy
    timeout_seconds INTEGER DEFAULT 300, -- 5 minutes default timeout
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent monitoring table
CREATE TABLE agent_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id),
    metric_type VARCHAR(50) NOT NULL, -- 'cpu_usage', 'memory_usage', 'response_time', 'error_rate'
    value DECIMAL(10, 4) NOT NULL,
    threshold DECIMAL(10, 4), -- Alert threshold
    alert_triggered BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_agents_owner_id ON agents(owner_id);
CREATE INDEX idx_agents_agent_type ON agents(agent_type);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agent_sessions_agent_id ON agent_sessions(agent_id);
CREATE INDEX idx_agent_sessions_user_id ON agent_sessions(user_id);
CREATE INDEX idx_agent_sessions_status ON agent_sessions(status);
CREATE INDEX idx_agent_communications_sender_agent_id ON agent_communications(sender_agent_id);
CREATE INDEX idx_agent_communications_receiver_agent_id ON agent_communications(receiver_agent_id);
CREATE INDEX idx_agent_communications_status ON agent_communications(status);
CREATE INDEX idx_agent_orchestration_owner_id ON agent_orchestration(owner_id);
CREATE INDEX idx_agent_orchestration_status ON agent_orchestration(status);
CREATE INDEX idx_agent_monitoring_agent_id ON agent_monitoring(agent_id);
CREATE INDEX idx_agent_monitoring_metric_type ON agent_monitoring(metric_type);
CREATE INDEX idx_agent_monitoring_recorded_at ON agent_monitoring(recorded_at);

-- Triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_sessions_updated_at BEFORE UPDATE ON agent_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_communications_updated_at BEFORE UPDATE ON agent_communications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_orchestration_updated_at BEFORE UPDATE ON agent_orchestration
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE agents IS 'Registered AI agents in the system';
COMMENT ON TABLE agent_sessions IS 'Individual agent usage sessions';
COMMENT ON TABLE agent_communications IS 'Inter-agent communication records';
COMMENT ON TABLE agent_orchestration IS 'Agent workflow orchestration';
COMMENT ON TABLE agent_monitoring IS 'Agent performance and health monitoring';

COMMENT ON COLUMN agents.owner_id IS 'User who owns/created this agent';
COMMENT ON COLUMN agents.capabilities IS 'JSON array of agent capabilities and supported operations';
COMMENT ON COLUMN agents.configuration IS 'Agent-specific configuration settings';
COMMENT ON COLUMN agents.subscription_type IS 'Payment tier/subscription level for the agent';
COMMENT ON COLUMN agent_sessions.session_type IS 'Type of service the agent is providing';
COMMENT ON COLUMN agent_communications.message_type IS 'Type of message being exchanged between agents';
