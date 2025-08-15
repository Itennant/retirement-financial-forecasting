# Financial Forecasting Application - Master Design Document

## Documentation Standards and Requirements

**IMPORTANT**: This master index serves as the single source of truth for all project documentation.

### Documentation Naming Convention

All documentation files MUST follow this naming convention:

- **Format**: `##_descriptive_name.md` (where ## is a two-digit number)
- **Numbering**: Sequential numbering starting from 00 (reserved for this master index)
- **File Types**: Primary documentation in `.md` format, with optional `.docx` versions for stakeholder distribution

### Documentation Management Requirements

1. **All new documentation MUST be added to this master index** with appropriate numbering and links
2. **Before creating new documentation**, check existing numbering to avoid conflicts
3. **Update the Table of Contents** whenever documents are added, removed, or restructured
4. **Cross-reference related documents** to maintain navigation clarity
5. **README files** for specific modules/folders should follow the pattern: `{module}-README.md`

---

## Table of Contents

### Core Documentation (Numbered Series)

1. [Master Index (This Document)](#00-master-index)
2. [AI-Centric Architecture](#01-ai-centric-architecture)
3. [Core Modules](#02-core-modules)
4. [Business Operations](#03-business-operations)
5. [Reporting Framework](#04-reporting-framework)
6. [Implementation Roadmap](#05-implementation-roadmap)
7. [Agent Architecture](#06-agent-architecture)
8. [Standing Data and Calculations](#07-standing-data-calculations)
9. [Agent Development Progress](#08-agent-development-progress)
10. [Development Workflow](#09-development-workflow)
11. [Documentation Strategy](#09-documentation-strategy)
12. [Cross-Platform Setup](#10-cross-platform-setup)
13. [Project Structure](#11-project-structure)
14. [Agents Overview](#12-agents-overview)
15. [Agent Configuration Guide](#13-agent-configuration-guide)
16. [SQL Database Documentation](#14-sql-database-documentation)
17. [Source Code Documentation](#15-source-code-documentation)
18. [Calculation Agent Integration](#16-calculation-agent-integration)
19. [Supabase Integration Guide](#17-supabase-integration-guide)

### External Module References

- [Source Code Overview](../src/README.md)
- [SQL Database Queries & Schema](../sql/README.md)

---

## 00. Master Index

**File**: `00_master_index.md` (This Document)  
**Purpose**: Central navigation hub and documentation standards  
**Status**: ✅ Active - Updated 2025-08-14

This document serves as the comprehensive index for all project documentation and establishes the standards for future documentation creation and maintenance.

---

## 01. AI-Centric Architecture

**File**: [`01_ai_centric_architecture.md`](01_ai_centric_architecture.md)  
**Purpose**: Foundational AI architecture and agent ecosystem design  
**Key Topics**:

- Agent Ecosystem Design
- API Gateway Architecture
- Knowledge Management Systems
- Integration Patterns

---

## 02. Core Modules

**File**: [`02_core_modules.md`](02_core_modules.md)  
**Purpose**: Essential application modules and their interactions  
**Key Topics**:

- User Experience Layer
- Financial Modeling Engine
- Data Management Systems
- Module Integration Patterns

---

## 03. Business Operations

**File**: [`03_business_operations.md`](03_business_operations.md)  
**Purpose**: Commercial aspects and business logic implementation  
**Key Topics**:

- Multi-tier Billing System
- Advisor/Client Management
- Payment Processing
- Subscription Lifecycle
- AI Agent Monetization

---

## 04. Reporting Framework

**File**: [`04_reporting_framework.md`](04_reporting_framework.md)  
**Purpose**: Comprehensive reporting and visualization capabilities  
**Key Topics**:

- Standard Report Templates
- Custom Visualization Tools
- Export Formats
- Automated Generation

---

## 05. Implementation Roadmap

**File**: [`05_implementation_roadmap.md`](05_implementation_roadmap.md)  
**Purpose**: Development phases and milestone tracking  
**Key Topics**:

- Phase 1: Core Financial Modeling
- Phase 2: AI Agent Integration
- Phase 3: Reporting and Visualization
- Phase 4: Commercial Operations

---

## 06. Agent Architecture

**File**: [`06_agent_architecture.md`](06_agent_architecture.md)  
**Purpose**: Detailed agent system design and communication protocols  
**Key Topics**:

- MCP Server Implementation
- Agent-to-Agent Communication
- API Design for Interactions
- Orchestration Patterns

---

## 07. Standing Data and Calculations

**File**: [`07_standing_data_calculations.md`](07_standing_data_calculations.md)  
**Purpose**: Financial data structures and calculation methodologies  
**Key Topics**:

- Input Data Requirements
- Financial Data Structures
- Balance Sheet Components
- Calculation Methodologies
- Monte Carlo Simulations
- Reporting Requirements

---

## 08. Agent Development Progress

**File**: [`08_agent_development_progress.md`](08_agent_development_progress.md)  
**Purpose**: Real-time development status and milestone tracking  
**Key Topics**:

- Current Development Status
- Milestone Progress
- Testing Results
- Next Steps

**Current Status**: ✅ Core architecture implemented and tested  
**Next Milestone**: Integration Testing (Target: 16/08/2025)

---

## 09. Development Workflow

**File**: [`09_development_workflow.md`](09_development_workflow.md)  
**Purpose**: Development processes and team coordination  
**Key Topics**:

- Development Processes
- Code Standards
- Testing Procedures
- Deployment Workflow

---

## 09. Documentation Strategy

**File**: [`09_documentation_strategy.md`](09_documentation_strategy.md)  
**Purpose**: Documentation approach and maintenance procedures  
**Key Topics**:

- Documentation Philosophy
- Update Procedures
- Cross-referencing Standards
- Stakeholder Communication

**Update Frequency**: Weekly or bi-weekly, immediate after major milestones

---

## 10. Cross-Platform Setup

**File**: [`10_cross_platform_setup.md`](10_cross_platform_setup.md)  
**Purpose**: Installation and configuration across different platforms  
**Key Topics**:

- Platform-specific Setup
- Development Environment
- Dependencies
- Configuration Management

---

## 11. Project Structure

**File**: [`11_project_structure.md`](11_project_structure.md)  
**Purpose**: High-level project organization and folder structure  
**Key Topics**:

- Directory Organization
- Module Structure
- File Naming Conventions
- Project Hierarchy

---

## 12. Agents Overview

**File**: [`12_agents_readme.md`](12_agents_readme.md)  
**Purpose**: Agent system overview and usage examples  
**Key Topics**:

- Agent Types and Functions
- Usage Examples
- System Integration Points
- Best Practices

---

## 13. Agent Configuration Guide

**File**: [`13_agents_config_readme.md`](13_agents_config_readme.md)  
**Purpose**: Agent configuration and environment setup  
**Key Topics**:

- Configuration Files
- Environment Variables
- Setup Procedures
- Troubleshooting

---

## 14. SQL Database Documentation

**File**: [`14_sql_readme.md`](14_sql_readme.md)  
**Purpose**: Database schema, migrations, and queries documentation  
**Key Topics**:

- Schema Design
- Migration Procedures
- Query Examples
- Database Management

---

## 15. Source Code Documentation

**File**: [`15_src_readme.md`](15_src_readme.md)  
**Purpose**: Source code organization and module descriptions  
**Key Topics**:

- Code Structure
- Module Descriptions
- API Documentation
- Development Guidelines

---

## 16. Calculation Agent Integration

**File**: [`16_calculation_agent_integration.md`](16_calculation_agent_integration.md)  
**Purpose**: Integration plan for complex calculation capabilities with NLP UI  
**Key Topics**:

- Wolfram Alpha and Python integration
- Natural Language Processing interface
- Agent architecture extension
- Security and performance considerations

Also available as [DOCX version](16_calculation_agent_integration.docx)

---

## Module-Specific Documentation

### External References

- [Source Code Overview](../src/README.md) - Detailed source code documentation
- [SQL Database Queries & Schema](../sql/README.md) - Comprehensive database documentation

---

## Documentation Maintenance Guidelines

### For Developers Adding New Documentation:

1. **Assign Sequential Number**: Use the next available number in the sequence (currently 11+)
2. **Follow Naming Convention**: `##_descriptive_name.md`
3. **Update This Index**: Add entry with proper linking and description
4. **Cross-Reference**: Link related documents bidirectionally
5. **Status Tracking**: Include creation/update dates and current status

### For Document Updates:

1. **Update Modified Date**: Include last modified date in document
2. **Update Status**: Reflect current state (Active, Draft, Deprecated)
3. **Version Notes**: Include significant change summaries
4. **Cross-Reference Check**: Update related document links as needed

---

## Quick Navigation

**Development Focus Areas:**

- [Agent Architecture](06_agent_architecture.md) - Core system design
- [Development Progress](08_agent_development_progress.md) - Current status
- [Implementation Roadmap](05_implementation_roadmap.md) - Planned phases

**Business & Operations:**

- [Business Operations](03_business_operations.md) - Commercial framework
- [Reporting Framework](04_reporting_framework.md) - Client deliverables

**Technical Implementation:**

- [AI-Centric Architecture](01_ai_centric_architecture.md) - Foundation design
- [Core Modules](02_core_modules.md) - System components
- [Standing Data & Calculations](07_standing_data_calculations.md) - Financial logic

---

## 17. Supabase Integration Guide

**File**: [`17_supabase_integration.md`](17_supabase_integration.md)  
**Purpose**: Supabase integration for development and deployment  
**Key Topics**:

- Development mode Supabase setup
- Environment variable configuration
- Render deployment configuration
- Database service usage examples

Also available as [DOCX version](17_supabase_integration.docx)

---

_Last Updated: 2025-08-14_  
_Next Review: 2025-08-21_
