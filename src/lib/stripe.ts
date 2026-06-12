import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    priceId: null,
    generations: 3,
    ideasCount: 1,
    features: [
      '1 startup idea per generation',
      'Basic idea overview',
      'Simple scoring',
      '3 generations total',
    ],
  },
  PRO: {
    name: 'Pro',
    description: 'Unlimited generations and competitor analysis',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    generations: Infinity,
    ideasCount: 3,
    features: [
      '3 startup ideas per generation',
      'Unlimited generations',
      'Competitor analysis',
      'Market analysis (TAM/SAM/SOM)',
      'Business model & pricing',
      'PDF export',
    ],
  },
  FOUNDER: {
    name: 'Founder',
    description: 'Complete launch toolkit with branding',
    price: 49,
    priceId: process.env.STRIPE_FOUNDER_PRICE_ID,
    generations: Infinity,
    ideasCount: 3,
    features: [
      'Everything in Pro',
      'Full MVP roadmap',
      'Validation plans',
      'Branding kit',
      '30-day launch plan',
      'Detailed scoring',
    ],
  },
} as const

export const PLAN_FEATURES = {
  FREE: {
    ideasCount: 1,
    showMarket: false,
    showBusinessModel: false,
    showMvp: false,
    showValidation: false,
    showBranding: false,
    showLaunchPlan: false,
    showDetailedScores: false,
    showPdfExport: false,
    maxScoreCategories: 2,
  },
  PRO: {
    ideasCount: 3,
    showMarket: true,
    showBusinessModel: true,
    showMvp: false,
    showValidation: false,
    showBranding: false,
    showLaunchPlan: false,
    showDetailedScores: true,
    showPdfExport: true,
    maxScoreCategories: 5,
  },
  FOUNDER: {
    ideasCount: 3,
    showMarket: true,
    showBusinessModel: true,
    showMvp: true,
    showValidation: true,
    showBranding: true,
    showLaunchPlan: true,
    showDetailedScores: true,
    showPdfExport: true,
    maxScoreCategories: 5,
  },
} as const

export type PlanType = keyof typeof PLANS
