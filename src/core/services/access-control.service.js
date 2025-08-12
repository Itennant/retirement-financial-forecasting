// Access Control Service for Financial Forecasting Application

class AccessControlService {
    constructor(paymentService, config) {
        this.paymentService = paymentService;
        this.config = config;
        this.accessCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }

    async checkAdvisorAccess(advisorId) {
        // Check cache first
        const cachedResult = this.getCachedAccessResult(`advisor:${advisorId}`);
        if (cachedResult !== null) {
            return cachedResult;
        }

        try {
            // Check payment status
            const paymentStatus = await this.paymentService.checkPaymentStatus(advisorId);
            
            if (!paymentStatus.success) {
                const result = {
                    hasAccess: false,
                    reason: 'Payment status check failed',
                    error: paymentStatus.error
                };
                this.cacheAccessResult(`advisor:${advisorId}`, result);
                return result;
            }

            const hasAccess = paymentStatus.advisorStatus === 'active';
            const result = {
                hasAccess: hasAccess,
                reason: hasAccess ? 'Access granted' : 'Advisor registration fees unpaid',
                paymentStatus: paymentStatus.advisorStatus
            };

            this.cacheAccessResult(`advisor:${advisorId}`, result);
            return result;
        } catch (error) {
            console.error('Error checking advisor access:', error);
            const result = {
                hasAccess: false,
                reason: 'System error checking access',
                error: error.message
            };
            this.cacheAccessResult(`advisor:${advisorId}`, result);
            return result;
        }
    }

    async checkClientReportAccess(clientId, advisorId) {
        // Check cache first
        const cachedResult = this.getCachedAccessResult(`client:${clientId}:advisor:${advisorId}`);
        if (cachedResult !== null) {
            return cachedResult;
        }

        try {
            // Check if advisor has access first
            const advisorAccess = await this.checkAdvisorAccess(advisorId);
            if (!advisorAccess.hasAccess) {
                const result = {
                    hasAccess: false,
                    reason: 'Advisor access denied',
                    advisorAccess: advisorAccess
                };
                this.cacheAccessResult(`client:${clientId}:advisor:${advisorId}`, result);
                return result;
            }

            // Check client payment status
            const paymentStatus = await this.paymentService.checkPaymentStatus(advisorId, clientId);
            
            if (!paymentStatus.success) {
                const result = {
                    hasAccess: false,
                    reason: 'Payment status check failed',
                    error: paymentStatus.error
                };
                this.cacheAccessResult(`client:${clientId}:advisor:${advisorId}`, result);
                return result;
            }

            const hasAccess = paymentStatus.clientStatus === 'active';
            const result = {
                hasAccess: hasAccess,
                reason: hasAccess ? 'Access granted' : 'Client has unpaid invoices to advisor',
                paymentStatus: paymentStatus.clientStatus,
                advisorAccess: advisorAccess
            };

            this.cacheAccessResult(`client:${clientId}:advisor:${advisorId}`, result);
            return result;
        } catch (error) {
            console.error('Error checking client report access:', error);
            const result = {
                hasAccess: false,
                reason: 'System error checking access',
                error: error.message
            };
            this.cacheAccessResult(`client:${clientId}:advisor:${advisorId}`, result);
            return result;
        }
    }

    async enforceAdvisorAccess(advisorId) {
        const accessCheck = await this.checkAdvisorAccess(advisorId);
        
        if (!accessCheck.hasAccess) {
            throw new Error(`Access denied: ${accessCheck.reason}`);
        }
        
        return accessCheck;
    }

    async enforceClientReportAccess(clientId, advisorId) {
        const accessCheck = await this.checkClientReportAccess(clientId, advisorId);
        
        if (!accessCheck.hasAccess) {
            throw new Error(`Access denied: ${accessCheck.reason}`);
        }
        
        return accessCheck;
    }

    cacheAccessResult(key, result) {
        const cacheEntry = {
            result: result,
            timestamp: Date.now()
        };
        this.accessCache.set(key, cacheEntry);
    }

    getCachedAccessResult(key) {
        const cacheEntry = this.accessCache.get(key);
        if (!cacheEntry) {
            return null;
        }

        // Check if cache entry is still valid
        if (Date.now() - cacheEntry.timestamp > this.cacheTimeout) {
            this.accessCache.delete(key);
            return null;
        }

        return cacheEntry.result;
    }

    clearAccessCache(key) {
        if (key) {
            this.accessCache.delete(key);
        } else {
            this.accessCache.clear();
        }
    }

    async handlePaymentSuccess(paymentDetails) {
        // Clear cache when payment is successful
        if (paymentDetails.advisorId) {
            this.clearAccessCache(`advisor:${paymentDetails.advisorId}`);
        }
        if (paymentDetails.clientId && paymentDetails.advisorId) {
            this.clearAccessCache(`client:${paymentDetails.clientId}:advisor:${paymentDetails.advisorId}`);
        }

        console.log('Access cache cleared after successful payment');
        return { success: true, message: 'Access cache updated' };
    }

    async getAccessStatus(advisorId, clientId = null) {
        if (clientId) {
            return await this.checkClientReportAccess(clientId, advisorId);
        } else {
            return await this.checkAdvisorAccess(advisorId);
        }
    }

    // Grace period management
    async checkGracePeriod(expiryDate) {
        if (!expiryDate) return { inGracePeriod: false, daysRemaining: 0 };

        const today = new Date();
        const expiry = new Date(expiryDate);
        const gracePeriodEnd = new Date(expiry);
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30); // 30-day grace period

        const inGracePeriod = today <= gracePeriodEnd && today > expiry;
        const daysRemaining = Math.ceil((gracePeriodEnd - today) / (1000 * 60 * 60 * 24));

        return {
            inGracePeriod: inGracePeriod,
            daysRemaining: Math.max(0, daysRemaining),
            gracePeriodEnd: gracePeriodEnd
        };
    }
}

module.exports = AccessControlService;
