import OpenAI from 'openai'

let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) throw new Error('OPENROUTER_API_KEY environment variable is not set')
    _openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Startup Generator 9000',
      },
    })
  }
  return _openai
}

export const AI_MODEL = process.env.AI_MODEL || 'meta-llama/llama-3-70b-instruct:free'

export const GENERATION_PROMPT = `You are an expert startup advisor and market analyst. Based on the user's input, generate 3 complete startup opportunities.

User Input:
- Interests: {interests}
- Skills: {skills}
- Industry Knowledge: {industry}
- Budget: {budget}
- Target Audience: {audience}

For EACH startup idea, provide a comprehensive analysis in the following JSON format:

{
  "ideas": [
    {
      "name": "Startup Name",
      "pitch": "One-line pitch",
      "problem": "Problem statement",
      "whyNow": "Why this is relevant now",
      "targetAudience": "Specific target audience",
      
      "market": {
        "tam": "Total Addressable Market estimate",
        "sam": "Serviceable Addressable Market estimate",
        "som": "Serviceable Obtainable Market estimate",
        "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
        "gaps": "Market gaps this startup fills",
        "advantage": "Competitive advantage"
      },
      
      "businessModel": {
        "pricing": "Pricing strategy",
        "tiers": [
          { "name": "Tier 1", "price": "$X/mo", "features": ["feature1", "feature2"] },
          { "name": "Tier 2", "price": "$Y/mo", "features": ["feature1", "feature2"] }
        ],
        "year1Revenue": "$X",
        "year2Revenue": "$Y",
        "acquisition": ["Channel 1", "Channel 2"]
      },
      
      "mvp": {
        "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
        "niceToHave": ["Feature 4", "Feature 5"],
        "techStack": ["Technology 1", "Technology 2"],
        "devEstimate": "X weeks",
        "infrastructureCost": "$X/month"
      },
      
      "validation": {
        "firstCustomers": "Description of first 10 customers",
        "whereToFind": ["Platform 1", "Platform 2"],
        "outreachExamples": ["Message 1", "Message 2"],
        "landingPageCopy": "Hero section copy"
      },
      
      "branding": {
        "nameVariations": ["Name 1", "Name 2", "Name 3"],
        "taglines": ["Tagline 1", "Tagline 2"],
        "domains": ["domain1.com", "domain2.com"],
        "logoPrompts": ["Prompt 1", "Prompt 2"]
      },
      
      "launchPlan": {
        "week1": "Validation activities",
        "week2": "MVP development",
        "week3": "Beta user onboarding",
        "week4": "Public launch"
      },
      
      "scores": {
        "marketSize": 8,
        "pain": 9,
        "competition": 7,
        "aiAdvantage": 8,
        "monetization": 7
      }
    }
  ]
}

Scoring Guidelines:
- Market Size Score (0-10): Based on TAM/SAM/SOM potential
- Pain Score (0-10): How severe is the problem being solved
- Competition Score (0-10): Lower competition = higher score
- AI Advantage Score (0-10): How well AI can enhance the product
- Monetization Score (0-10): Clear paths to revenue

Return ONLY valid JSON, no markdown or additional text.`
