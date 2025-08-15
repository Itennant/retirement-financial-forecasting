// Payment Service for Financial Forecasting Application
import stripe from 'stripe';
import paypal from 'paypal-rest-sdk';

class PaymentService {
    constructor(config) {
        this.config = config;
        this.stripe = stripe(config.payment.gateways.stripe.secretKey);
        this.paypal = paypal;
        this.setupPayPal();
    }

    setupPayPal() {
        this.paypal.configure({
            'mode': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
            'client_id': this.config.payment.gateways.paypal.clientId,
            'client_secret': this.config.payment.gateways.paypal.clientSecret
        });
    }

    async processAdvisorRegistrationPayment(advisorId, amount, currency = 'ZAR') {
        try {
            // Create payment intent for advisor registration
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency,
                metadata: {
                    advisorId: advisorId,
                    paymentType: 'advisor_registration'
                }
            });

            return {
                success: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status
            };
        } catch (error) {
            console.error('Error processing advisor payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async processClientServicePayment(clientId, advisorId, amount, currency = 'ZAR') {
        try {
            // Create payment intent for client service
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency,
                metadata: {
                    clientId: clientId,
                    advisorId: advisorId,
                    paymentType: 'client_service'
                }
            });

            return {
                success: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status
            };
        } catch (error) {
            console.error('Error processing client payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createAdvisorInvoice(advisorId, amount, description, dueDate) {
        try {
            // Create invoice for advisor
            const invoice = await this.stripe.invoices.create({
                customer: advisorId,
                auto_advance: false,
                collection_method: 'send_invoice',
                days_until_due: this.calculateDaysUntilDue(dueDate),
                metadata: {
                    advisorId: advisorId,
                    description: description,
                    paymentType: 'advisor_registration'
                }
            });

            // Add line item to invoice
            const lineItem = await this.stripe.invoiceItems.create({
                customer: advisorId,
                amount: Math.round(amount * 100),
                currency: 'ZAR',
                description: description,
                invoice: invoice.id
            });

            return {
                success: true,
                invoiceId: invoice.id,
                invoiceNumber: invoice.number,
                status: invoice.status,
                amount: amount,
                dueDate: dueDate
            };
        } catch (error) {
            console.error('Error creating advisor invoice:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createClientInvoice(clientId, advisorId, amount, description, dueDate) {
        try {
            // Create invoice for client service
            const invoice = await this.stripe.invoices.create({
                customer: clientId,
                auto_advance: false,
                collection_method: 'send_invoice',
                days_until_due: this.calculateDaysUntilDue(dueDate),
                metadata: {
                    clientId: clientId,
                    advisorId: advisorId,
                    description: description,
                    paymentType: 'client_service'
                }
            });

            // Add line item to invoice
            const lineItem = await this.stripe.invoiceItems.create({
                customer: clientId,
                amount: Math.round(amount * 100),
                currency: 'ZAR',
                description: description,
                invoice: invoice.id
            });

            return {
                success: true,
                invoiceId: invoice.id,
                invoiceNumber: invoice.number,
                status: invoice.status,
                amount: amount,
                dueDate: dueDate
            };
        } catch (error) {
            console.error('Error creating client invoice:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async processManualPayment(invoiceId, paymentMethod) {
        try {
            // Record manual payment
            const payment = await this.stripe.paymentIntents.create({
                amount: 0, // This will be handled manually
                currency: 'ZAR',
                payment_method: paymentMethod,
                confirm: true,
                metadata: {
                    invoiceId: invoiceId,
                    manualPayment: true
                }
            });

            return {
                success: true,
                paymentId: payment.id,
                status: payment.status
            };
        } catch (error) {
            console.error('Error processing manual payment:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async cancelInvoice(invoiceId) {
        try {
            const canceledInvoice = await this.stripe.invoices.cancel(invoiceId);
            
            return {
                success: true,
                invoiceId: canceledInvoice.id,
                status: canceledInvoice.status
            };
        } catch (error) {
            console.error('Error canceling invoice:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendPaymentConfirmation(parties, invoiceDetails, paymentDetails) {
        // Send confirmation to both parties
        const { invoiceCreator, payer } = parties;
        
        console.log(`Payment confirmation sent to ${invoiceCreator.email} and ${payer.email}`);
        console.log(`Invoice: ${invoiceDetails.invoiceNumber}, Amount: ${invoiceDetails.amount}`);
        console.log(`Payment Status: ${paymentDetails.status}`);

        // In a real implementation, this would send actual emails or notifications
        return {
            success: true,
            message: 'Payment confirmation sent to both parties'
        };
    }

    calculateDaysUntilDue(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays); // Minimum 1 day
    }

    async checkPaymentStatus(advisorId, clientId = null) {
        try {
            // Check if advisor has paid registration fees
            const advisorCustomer = await this.stripe.customers.retrieve(advisorId);
            
            // Check client payment status if provided
            let clientStatus = null;
            if (clientId) {
                const clientCustomer = await this.stripe.customers.retrieve(clientId);
                clientStatus = clientCustomer ? 'active' : 'inactive';
            }

            return {
                success: true,
                advisorStatus: advisorCustomer ? 'active' : 'inactive',
                clientStatus: clientStatus
            };
        } catch (error) {
            console.error('Error checking payment status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default PaymentService;
