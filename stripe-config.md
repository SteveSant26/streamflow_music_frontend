# Frontend environment variables

# Add these to your frontend/src/environments/environment.ts

export const environment = {
production: false,
stripe: {
publishableKey: 'pk_test_your_publishable_key_here'
},
api: {
baseUrl: 'http://localhost:8000/api'
}
};

# Backend environment variables

# Add these to your backend/.env file

# Stripe Configuration

STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# For production, use live keys:

# STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key

# STRIPE_SECRET_KEY=sk_live_your_live_secret_key
