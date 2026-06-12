import { z } from 'zod'

export const startupInputSchema = z.object({
  interests: z.string().min(1, 'Please describe your interests'),
  skills: z.string().min(1, 'Please describe your skills'),
  industry: z.string().min(1, 'Please describe your industry knowledge'),
  budget: z.string().min(1, 'Please enter your available budget'),
  audience: z.string().min(1, 'Please describe your target audience'),
})

export type StartupInput = z.infer<typeof startupInputSchema>

export const ideaSchema = z.object({
  name: z.string(),
  pitch: z.string(),
  problem: z.string(),
  whyNow: z.string(),
  targetAudience: z.string(),
  market: z.object({
    tam: z.string(),
    sam: z.string(),
    som: z.string(),
    competitors: z.array(z.string()),
    gaps: z.string(),
    advantage: z.string(),
  }),
  businessModel: z.object({
    pricing: z.string(),
    tiers: z.array(z.object({
      name: z.string(),
      price: z.string(),
      features: z.array(z.string()),
    })),
    year1Revenue: z.string(),
    year2Revenue: z.string(),
    acquisition: z.array(z.string()),
  }),
  mvp: z.object({
    coreFeatures: z.array(z.string()),
    niceToHave: z.array(z.string()),
    techStack: z.array(z.string()),
    devEstimate: z.string(),
    infrastructureCost: z.string(),
  }),
  validation: z.object({
    firstCustomers: z.string(),
    whereToFind: z.array(z.string()),
    outreachExamples: z.array(z.string()),
    landingPageCopy: z.string(),
  }),
  branding: z.object({
    nameVariations: z.array(z.string()),
    taglines: z.array(z.string()),
    domains: z.array(z.string()),
    logoPrompts: z.array(z.string()),
  }),
  launchPlan: z.object({
    week1: z.string(),
    week2: z.string(),
    week3: z.string(),
    week4: z.string(),
  }),
  scores: z.object({
    marketSize: z.number(),
    pain: z.number(),
    competition: z.number(),
    aiAdvantage: z.number(),
    monetization: z.number(),
  }),
})

export type Idea = z.infer<typeof ideaSchema>
