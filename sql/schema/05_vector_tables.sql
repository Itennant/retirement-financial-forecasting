-- Vector Tables Schema
-- Version: 1.0
-- Description: Vector tables for AI-powered features like semantic search and recommendations
-- Follows documentation strategy from docs/09_documentation_strategy.md

-- Note: This file contains PostgreSQL-specific syntax for Supabase
-- For SQLite, use TEXT columns for embeddings and perform similarity calculations in application code

-- Enable vector extension (for Supabase only)
-- Run this separately in Supabase SQL editor:
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Financial document embeddings table
-- For Supabase: Uses vector type
-- For SQLite: Use TEXT for embedding column
CREATE TABLE financial_document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID, -- Reference to the original document
    client_id UUID NOT NULL, -- Associated client
    advisor_id UUID, -- Associated advisor (if applicable)
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN (
        'investment_analysis', 
        'retirement_plan', 
        'risk_assessment', 
        'financial_projection',
        'tax_strategy',
        'estate_planning',
        'budget_analysis',
        'debt_management'
    )),
    content TEXT, -- Original document content (for reference)
    title VARCHAR(255), -- Document title
    embedding TEXT, -- For SQLite: JSON array string; For Supabase: vector(1536)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client profile embeddings table
-- For Supabase: Uses vector type
-- For SQLite: Use TEXT for embeddings column
CREATE TABLE client_profile_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL UNIQUE, -- Reference to client
    profile_data JSONB, -- Client profile data used for embedding
    embedding TEXT, -- For SQLite: JSON array string; For Supabase: vector(1536)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investment recommendation embeddings table
-- For Supabase: Uses vector type
-- For SQLite: Use TEXT for embeddings column
CREATE TABLE investment_recommendation_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL UNIQUE, -- Reference to recommendation
    investment_type VARCHAR(100) NOT NULL CHECK (investment_type IN (
        'unit_trust',
        'shares',
        'bonds',
        'etf',
        'property',
        'private_equity',
        'retirement_fund'
    )),
    risk_profile VARCHAR(50) CHECK (risk_profile IN (
        'conservative',
        'moderate',
        'balanced',
        'growth',
        'aggressive'
    )),
    embedding TEXT, -- For SQLite: JSON array string; For Supabase: vector(1536)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
-- Note: These are PostgreSQL-specific. For SQLite, create standard indexes
-- CREATE INDEX idx_financial_document_embeddings_embedding ON financial_document_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
-- CREATE INDEX idx_client_profile_embeddings_embedding ON client_profile_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
-- CREATE INDEX idx_investment_recommendation_embeddings_embedding ON investment_recommendation_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Additional indexes for common query patterns (work with both SQLite and PostgreSQL)
CREATE INDEX idx_financial_document_embeddings_client_id ON financial_document_embeddings(client_id);
CREATE INDEX idx_financial_document_embeddings_document_type ON financial_document_embeddings(document_type);
CREATE INDEX idx_client_profile_embeddings_client_id ON client_profile_embeddings(client_id);

-- Triggers for updated_at (PostgreSQL version)
-- Note: For SQLite, use the simpler trigger syntax
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_document_embeddings_updated_at 
    BEFORE UPDATE ON financial_document_embeddings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profile_embeddings_updated_at 
    BEFORE UPDATE ON client_profile_embeddings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_recommendation_embeddings_updated_at 
    BEFORE UPDATE ON investment_recommendation_embeddings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE financial_document_embeddings IS 'Financial document embeddings for semantic search and similarity-based retrieval';
COMMENT ON TABLE client_profile_embeddings IS 'Client profile embeddings for similarity-based recommendations';
COMMENT ON TABLE investment_recommendation_embeddings IS 'Investment recommendation embeddings for similarity search';

COMMENT ON COLUMN financial_document_embeddings.document_type IS 'Type of financial document for categorization';
COMMENT ON COLUMN financial_document_embeddings.embedding IS 'Embedding vector (JSON array for SQLite, vector type for Supabase)';
COMMENT ON COLUMN client_profile_embeddings.embedding IS 'Embedding vector (JSON array for SQLite, vector type for Supabase)';
COMMENT ON COLUMN investment_recommendation_embeddings.embedding IS 'Embedding vector (JSON array for SQLite, vector type for Supabase)';

-- Cross-references to documentation
/*
Related Documentation:
- Supabase Integration Guide: docs/17_supabase_integration.md
- AI Agent Architecture: docs/06_agent_architecture.md
- Financial Data Schema: sql/schema/04_financial_data.sql

Implementation Notes:
- Compatible with both SQLite (local development) and PostgreSQL (Supabase)
- Uses TEXT columns for embeddings to support both database types
- Includes updated_at triggers for audit trails
- Optimized for financial forecasting application use cases

For Supabase deployment:
1. Enable the vector extension: CREATE EXTENSION IF NOT EXISTS vector;
2. Change embedding columns to vector(1536) type
3. Create ivfflat indexes for efficient similarity search

Last Updated: 14/08/2025
Next Review Date: 21/08/2025
*/
