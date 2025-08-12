// AI Agent Payment Service for Financial Forecasting Application

class AgentPaymentService {
    constructor(config, paymentService) {
        this.config = config;
        this.paymentService = paymentService;
        this.agentUsageCache = new Map();
        this.usageCacheTimeout = 60 * 1000; // 1 minute cache
    }

    async checkAgentAccess(agentId, agentType = 'financial_modeling') {
        try {
            // Check if agent has valid payment status
            const paymentStatus = await this.getAgentPaymentStatus(agentId);
            
            if (!paymentStatus.success) {
                return {
                    hasAccess: false,
                    reason: 'Payment status check failed',
                    error: paymentStatus.error
                };
            }

            const hasAccess = paymentStatus.status === 'active' || paymentStatus.status === 'trial';
            const result = {
                hasAccess: hasAccess,
                reason: hasAccess ? 'Access granted' : 'Agent payment required',
                paymentStatus: paymentStatus.status,
                usageQuota: paymentStatus.usageQuota,
                currentUsage: paymentStatus.currentUsage
            };

            return result;
        } catch (error) {
            console.error('Error checking agent access:', error);
            return {
                hasAccess: false,
                reason: 'System error checking access',
                error: error.message
            };
        }
    }

    async enforceAgentAccess(agentId, agentType) {
        const accessCheck = await this.checkAgentAccess(agentId, agentType);
        
        if (!accessCheck.hasAccess) {
            throw new Error(`Agent access denied: ${accessCheck.reason}`);
        }
        
        // Check usage quotas
        if (accessCheck.currentUsage >= accessCheck.usageQuota) {
            throw new Error('Agent usage quota exceeded');
        }
        
        return accessCheck;
    }

    async getAgentPaymentStatus(agentId) {
        try {
            // In a real implementation, this would check the actual payment status
            // For now, we'll simulate based on agent ID patterns
            const agentInfo = this.getAgentInfo(agentId);
            
            return {
                success: true,
                status: agentInfo.paymentStatus,
                usageQuota: agentInfo.usageQuota,
                currentUsage: agentInfo.currentUsage,
                subscriptionType: agentInfo.subscriptionType,
                nextBillingDate: agentInfo.nextBillingDate
            };
        } catch (error) {
            console.error('Error getting agent payment status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getAgentInfo(agentId) {
        // Simulate agent information based on ID patterns
        // In reality, this would query a database or payment system
        
        const usageCacheKey = `agent:${agentId}:usage`;
        const cachedUsage = this.agentUsageCache.get(usageCacheKey);
        const now = Date.now();
        
        let currentUsage = 0;
        if (cachedUsage && (now - cachedUsage.timestamp) < this.usageCacheTimeout) {
            currentUsage = cachedUsage.usage;
        } else {
            // Simulate usage calculation
            currentUsage = Math.floor(Math.random() * 1000);
            this.agentUsageCache.set(usageCacheKey, {
                usage: currentUsage,
                timestamp: now
            });
        }

        if (agentId.startsWith('premium_')) {
            return {
                paymentStatus: 'active',
                usageQuota: 10000,
                currentUsage: currentUsage,
                subscriptionType: 'premium',
                nextBillingDate: this.addDays(new Date(), 30)
            };
        } else if (agentId.startsWith('pro_')) {
            return {
                paymentStatus: 'active',
                usageQuota: 5000,
                currentUsage: currentUsage,
                subscriptionType: 'pro',
                nextBillingDate: this.addDays(new Date(), 30)
            };
        } else if (agentId.startsWith('trial_')) {
            return {
                paymentStatus: 'trial',
                usageQuota: 1000,
                currentUsage: currentUsage,
                subscriptionType: 'trial',
                nextBillingDate: this.addDays(new Date(), 14)
            };
        } else {
            return {
                paymentStatus: 'inactive',
                usageQuota: 0,
                currentUsage: currentUsage,
                subscriptionType: 'free',
                nextBillingDate: null
            };
        }
    }

    async processAgentUsagePayment(agentId, usageAmount, costPerUnit = 0.01) {
        try {
            const agentInfo = this.getAgentInfo(agentId);
            const totalCost = usageAmount * costPerUnit;
            
            // Process payment through the main payment service
            const paymentResult = await this.paymentService.processAdvisorRegistrationPayment(
                agentId, 
                totalCost, 
                'USD' // Using USD for agent payments
            );
            
            if (paymentResult.success) {
                // Update usage cache
                const usageCacheKey = `agent:${agentId}:usage`;
                const cachedUsage = this.agentUsageCache.get(usageCacheKey);
                if (cachedUsage) {
                    cachedUsage.usage += usageAmount;
                    cachedUsage.timestamp = Date.now();
                }
                
                return {
                    success: true,
                    paymentId: paymentResult.paymentIntentId,
                    amount: totalCost,
                    usageAmount: usageAmount,
                    message: 'Usage payment processed successfully'
                };
            } else {
                return {
                    success: false,
                    error: paymentResult.error
                };
            }
        } catch (error) {
            console.error('Error processing agent usage payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createAgentSubscription(agentId, subscriptionType, paymentMethod) {
        const subscriptionPlans = {
            premium: { price: 99.99, quota: 10000, currency: 'USD' },
            pro: { price: 49.99, quota: 5000, currency: 'USD' },
            basic: { price: 19.99, quota: 1000, currency: 'USD' }
        };

        const plan = subscriptionPlans[subscriptionType];
        if (!plan) {
            throw new Error('Invalid subscription type');
        }

        try {
            // Create subscription payment
            const paymentResult = await this.paymentService.processAdvisorRegistrationPayment(
                agentId,
                plan.price,
                plan.currency
            );

            if (paymentResult.success) {
                return {
                    success: true,
                    subscriptionType: subscriptionType,
                    amount: plan.price,
                    quota: plan.quota,
                    paymentId: paymentResult.paymentIntentId,
                    startDate: new Date(),
                    endDate: this.addDays(new Date(), 30)
                };
            } else {
                throw new Error(paymentResult.error);
            }
        } catch (error) {
            console.error('Error creating agent subscription:', error);
            throw error;
        }
    }

    async calculateAgentCommission(agentId, revenueGenerated, commissionRate = 0.1) {
        const commissionAmount = revenueGenerated * commissionRate;
        
        return {
            agentId: agentId,
            revenueGenerated: revenueGenerated,
            commissionRate: commissionRate,
            commissionAmount: commissionAmount,
            status: 'calculated'
        };
    }

    async processAgentCommissionPayment(agentId, commissionDetails) {
        try {
            // Process commission payment to agent
            const paymentResult = await this.paymentService.processAdvisorRegistrationPayment(
                agentId,
                commissionDetails.commissionAmount,
                'USD'
            );
            
            if (paymentResult.success) {
                return {
                    success: true,
                    paymentId: paymentResult.paymentIntentId,
                    amount: commissionDetails.commissionAmount,
                    agentId: agentId,
                    message: 'Commission payment processed successfully'
                };
            } else {
                return {
                    success: false,
                    error: paymentResult.error
                };
            }
        } catch (error) {
            console.error('Error processing agent commission payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    async getAgentBillingHistory(agentId, limit = 10) {
        // Simulate billing history retrieval
        return {
            agentId: agentId,
            transactions: [
                {
                    id: 'txn_123',
                    amount: 99.99,
                    currency: 'USD',
                    date: new Date('2023-01-15'),
                    type: 'subscription',
                    status: 'completed'
                },
                {
                    id: 'txn_124',
                    amount: 25.50,
                    currency: 'USD',
                    date: new Date('2023-01-10'),
                    type: 'usage',
                    status: 'completed'
                }
            ]
        };
    }

    async suspendAgentForNonPayment(agentId) {
        console.log(`Agent ${agentId} suspended for non-payment`);
        return {
            success: true,
            agentId: agentId,
            action: 'suspended',
            reason: 'Payment required'
        };
    }

    async restoreAgentAccess(agentId) {
        console.log(`Agent ${agentId} access restored`);
        // Clear usage cache
        const usageCacheKey = `agent:${agentId}:usage`;
        this.agentUsageCache.delete(usageCacheKey);
        
        return {
            success: true,
            agentId: agentId,
            action: 'restored',
            reason: 'Payment received'
        };
    }
}

module.exports = AgentPaymentService;
