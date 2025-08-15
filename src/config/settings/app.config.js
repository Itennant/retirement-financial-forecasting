// Application configuration
const environment = process.env.NODE_ENV || 'development';

const config = {
  environment,
  app: {
    name: 'Financial Forecasting Application',
    version: '1.0.0',
    description: 'Retirement financial forecasting with AI integration'
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  database: {
    client: process.env.DATABASE_CLIENT || 'sqlite3',
    connection: {
      filename: process.env.DATABASE_PATH || './data/app.db'
    },
    useNullAsDefault: true,
    supabase: {
      url: process.env.SUPABASE_URL || '',
      key: process.env.SUPABASE_KEY || ''
    }
  },
  payment: {
    gateways: {
      stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || ''
      },
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        clientSecret: process.env.PAYPAL_CLIENT_SECRET || ''
      }
    }
  },
  ai: {
    mcp: {
      serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:8080',
      apiKey: process.env.MCP_API_KEY || ''
    }
  }
};

export default config;
