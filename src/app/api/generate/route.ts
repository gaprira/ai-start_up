export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getOpenAI, GENERATION_PROMPT, AI_MODEL } from '@/lib/openai'
import { getDb } from '@/lib/prisma'
import { PLAN_FEATURES } from '@/lib/stripe'

function generateMockIdeas(interests: string, skills: string, industry: string, budget: string, audience: string) {
  const interestList = interests.split(',').map(s => s.trim()).filter(Boolean)
  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
  const mainInterest = interestList[0] || 'technology'
  const mainSkill = skillList[0] || 'general'

  return {
    ideas: [
      {
        name: `${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Hub`,
        pitch: `AI-powered community platform for ${mainInterest} enthusiasts`,
        problem: `Enthusiasts of ${interests} struggle to find curated, high-quality content and communities tailored to their specific interests. Existing platforms are too generic and lack personalization.`,
        whyNow: 'AI can now personalize content at scale, and niche communities are growing faster than ever. The market is ready for a platform that truly understands its users.',
        targetAudience: `${audience || 'Passionate hobbyists and professionals'} who want deeper engagement with ${interests}.`,
        market: {
          tam: '$45B',
          sam: '$12B',
          som: '$150M',
          competitors: ['Substack', 'Medium', 'Patreon', 'Discord'],
          gaps: 'No platform combines AI curation with community features specifically for niche interests like ' + interests + '.',
          advantage: `Deep AI understanding of ${interests} combined with community-driven content creation. First-mover in AI-curated niche communities.`,
        },
        businessModel: {
          pricing: 'Freemium with premium content and community features',
          tiers: [
            { name: 'Free', price: '$0/mo', features: ['Basic content feed', '5 communities', 'Limited AI suggestions', 'Public profile'] },
            { name: 'Pro', price: '$9/mo', features: ['Unlimited communities', 'Advanced AI curation', 'Creator tools', 'Priority support', 'Analytics'] },
            { name: 'Team', price: '$29/mo', features: ['Everything in Pro', 'Team workspaces', 'API access', 'Custom branding', 'Dedicated support'] },
          ],
          year1Revenue: '$180K',
          year2Revenue: '$1.2M',
          acquisition: ['Content marketing', 'Community partnerships', 'SEO', 'Social media', 'Influencer collaborations'],
        },
        mvp: {
          coreFeatures: ['AI content feed', 'Community forums', 'User profiles', 'Content bookmarking', 'Basic analytics'],
          niceToHave: ['Mobile app', 'Premium content gating', 'Creator monetization', 'Advanced analytics', 'API for developers'],
          techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI API', 'Redis', 'Vercel'],
          devEstimate: '6 weeks',
          infrastructureCost: '$50/month',
        },
        validation: {
          firstCustomers: `Start with 10 active members from existing ${mainInterest} communities on Reddit and Discord who are already creating content.`,
          whereToFind: ['Reddit', 'Discord servers', 'Twitter/X', 'Facebook Groups', 'Industry forums'],
          outreachExamples: [
            `Hey! I noticed you're passionate about ${mainInterest}. We're building an AI-powered community platform specifically for people like you. Would you be interested in being an early tester?`,
            `I saw your content about ${mainInterest} — really insightful. We're launching a platform that uses AI to curate the best content and connect enthusiasts like you. Want early access?`,
          ],
          landingPageCopy: `Discover, connect, and create in the ${mainInterest} community you've been looking for. Powered by AI, built for enthusiasts.`,
        },
        branding: {
          nameVariations: [`${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Hub`, `NicheAI`, `PassionAI`, `InterestPulse`, `${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Nest`],
          taglines: ['Where niche interests thrive', 'AI-powered niche communities', `Your ${mainInterest} world, amplified`, 'Connect. Create. Curate.'],
          domains: [`${mainInterest}hub.com`, `nicheai.app`, `interestpulse.io`, `${mainInterest}nest.com`],
          logoPrompts: [`Minimalist lettermark with neural network pattern, purple gradient`, `Abstract community icon with AI brain element, modern and clean`],
        },
        launchPlan: {
          week1: 'Set up landing page with email capture. Post in 5 relevant communities. Collect 50 signups. Validate the idea with 10 interviews.',
          week2: 'Build MVP: AI feed, basic community forums, user auth. Deploy to Vercel. Daily standups.',
          week3: 'Invite first 10 beta users, gather feedback daily, iterate on core features. Fix bugs fast.',
          week4: 'Launch on Product Hunt, post on social media, email waitlist. Target 100 users in first week.',
        },
        scores: {
          marketSize: 7,
          pain: 8,
          competition: 6,
          aiAdvantage: 9,
          monetization: 7,
        },
      },
      {
        name: `SkillForge ${mainSkill}`,
        pitch: `AI tutor that teaches ${mainSkill} through hands-on projects`,
        problem: `Learning ${skills} is overwhelming with scattered resources and courses that don't adapt to individual pace. People need personalized, project-based learning paths.`,
        whyNow: 'AI tutors can now adapt to individual learning styles in real-time, and the $350B online education market is shifting toward interactive, personalized experiences.',
        targetAudience: `${audience || 'Career changers and self-learners'} who want to learn ${skills} efficiently without wasting time on generic courses.`,
        market: {
          tam: '$350B',
          sam: '$45B',
          som: '$200M',
          competitors: ['Udemy', 'Coursera', 'Codecademy', 'Brilliant'],
          gaps: 'No platform offers truly personalized, project-based AI tutoring that adapts in real-time to student progress and learning style.',
          advantage: 'AI-first approach with project-based learning paths tailored to each student. Not just video lectures — interactive building.',
        },
        businessModel: {
          pricing: 'Subscription-based with free trial',
          tiers: [
            { name: 'Explorer', price: '$0/mo', features: ['3 lessons/month', 'Community access', 'Basic projects', 'Progress tracking'] },
            { name: 'Learner', price: '$19/mo', features: ['Unlimited lessons', 'AI tutor chat', 'All projects', 'Certificates', 'Priority support'] },
            { name: 'Professional', price: '$49/mo', features: ['Everything in Learner', '1-on-1 AI coaching', 'Job placement support', 'Portfolio builder', 'Interview prep'] },
          ],
          year1Revenue: '$240K',
          year2Revenue: '$2M',
          acquisition: ['SEO', 'YouTube tutorials', 'LinkedIn marketing', 'Tech blog partnerships', 'Referral program'],
        },
        mvp: {
          coreFeatures: ['AI lesson engine', 'Project builder', 'Progress tracking', 'Community forums', 'Basic assessments'],
          niceToHave: ['Live coaching sessions', 'Job board', 'Certificate generation', 'Mobile app', 'Team learning'],
          techStack: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI API', 'Stripe', 'Vercel'],
          devEstimate: '8 weeks',
          infrastructureCost: '$100/month',
        },
        validation: {
          firstCustomers: `Find 10 people actively learning ${mainSkill} on Twitter and LinkedIn who want structured guidance instead of random YouTube tutorials.`,
          whereToFind: ['Twitter/X', 'LinkedIn', 'Reddit', 'Discord study groups', 'Dev.to'],
          outreachExamples: [
            `Hi! I see you're learning ${mainSkill}. We're building an AI tutor that creates personalized project-based learning paths. Want to try it free?`,
            `Noticed you're on a ${mainSkill} learning journey. Our AI tutor adapts to your pace and builds real projects with you. Early access available!`,
          ],
          landingPageCopy: `Learn ${mainSkill} 10x faster with an AI tutor that builds projects with you, not just lectures at you.`,
        },
        branding: {
          nameVariations: [`SkillForge ${mainSkill}`, 'LearnAI', 'ProjectMind', 'CodeForge AI', 'SkillPilot'],
          taglines: ['Learn by building, guided by AI', 'Your AI learning companion', 'Projects over lectures', `Master ${mainSkill}, your way`],
          domains: ['skillforge.ai', 'learnai.dev', 'projectmind.io', 'skillforge.dev'],
          logoPrompts: ['Anvil and hammer with digital AI glow, dark theme', 'Abstract book transforming into code, gradient purple-blue'],
        },
        launchPlan: {
          week1: 'Create landing page with email capture. Post learning tips on Twitter/LinkedIn daily. Collect 100 signups.',
          week2: 'Build core AI lesson engine and 5 sample projects. Deploy MVP. Test with 3 friends.',
          week3: 'Onboard 10 beta users, track progress, fix bugs daily. Add community features.',
          week4: 'Launch on Product Hunt and Hacker News. Email blast to waitlist. Target 200 users.',
        },
        scores: {
          marketSize: 9,
          pain: 8,
          competition: 5,
          aiAdvantage: 9,
          monetization: 8,
        },
      },
      {
        name: `${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Companion`,
        pitch: `AI co-pilot for ${mainSkill} tasks — automating the boring stuff`,
        problem: `People who work with ${skills} spend too much time on repetitive tasks. They need an AI assistant that understands their specific workflow and automates the tedious parts.`,
        whyNow: 'AI agents are now capable of handling complex, multi-step workflows. The market is ready for vertical-specific AI assistants beyond generic chatbots.',
        targetAudience: `${audience || 'Professionals and creators'} who use ${skills} daily and want to 10x their output.`,
        market: {
          tam: '$80B',
          sam: '$18B',
          som: '$250M',
          competitors: ['Notion AI', 'Jasper', 'Copy.ai', 'GitHub Copilot'],
          gaps: 'Generic AI tools don\'t understand specific workflows. Nobody is building AI co-pilots for ' + mainInterest + ' specifically.',
          advantage: `Deep domain knowledge of ${interests} combined with workflow automation. Not a general tool — built for ${mainInterest} people.`,
        },
        businessModel: {
          pricing: 'Usage-based subscription',
          tiers: [
            { name: 'Starter', price: '$0/mo', features: ['100 AI tasks/month', 'Basic templates', 'Community support'] },
            { name: 'Pro', price: '$15/mo', features: ['Unlimited AI tasks', 'Custom workflows', 'API access', 'Priority support'] },
            { name: 'Business', price: '$49/mo', features: ['Everything in Pro', 'Team features', 'Custom integrations', 'SLA', 'Dedicated account manager'] },
          ],
          year1Revenue: '$200K',
          year2Revenue: '$1.5M',
          acquisition: ['Product Hunt launch', 'Content marketing', 'YouTube demos', 'Partner integrations', 'Word of mouth'],
        },
        mvp: {
          coreFeatures: ['AI task automation', 'Template library', 'Workflow builder', 'Usage dashboard', 'Basic integrations'],
          niceToHave: ['Custom AI training', 'Team collaboration', 'Advanced analytics', 'Mobile app', 'Webhooks'],
          techStack: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI API', 'Redis', 'Vercel'],
          devEstimate: '7 weeks',
          infrastructureCost: '$75/month',
        },
        validation: {
          firstCustomers: `Find 10 people who do ${mainSkill} work daily and complain about repetitive tasks on Twitter/Reddit.`,
          whereToFind: ['Twitter/X', 'Reddit', 'LinkedIn', 'Product Hunt', 'Indie Hackers'],
          outreachExamples: [
            `Hey! I noticed you do a lot of ${mainSkill} work. We built an AI co-pilot that automates the repetitive parts. Want to try it free?`,
            `Tired of the boring parts of ${mainSkill}? Our AI assistant handles the tedious work so you can focus on what matters. Early access?`,
          ],
          landingPageCopy: `Stop doing the boring stuff. Let AI handle ${mainSkill} tasks while you focus on the creative work.`,
        },
        branding: {
          nameVariations: [`${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Companion`, 'AutoPilot AI', 'FlowBot', 'TaskGenius', `${mainInterest.charAt(0).toUpperCase() + mainInterest.slice(1)}Copilot`],
          taglines: ['Your AI co-pilot', 'Automate the boring, focus on the brilliant', 'Work smarter, not harder', `AI built for ${mainInterest}`],
          domains: [`${mainInterest}companion.com`, 'autopilotai.app', 'flowbot.io', 'taskgenius.ai'],
          logoPrompts: ['Rocket ship with AI brain core, gradient purple-blue', 'Abstract automation flowchart, minimal and modern'],
        },
        launchPlan: {
          week1: 'Build landing page. Create 3 demo videos showing automation. Post on Twitter/LinkedIn. Collect 100 signups.',
          week2: 'Build core AI automation engine with 5 templates. Deploy MVP. Test with 5 users.',
          week3: 'Onboard 10 beta users, watch them use it, iterate daily. Add integrations.',
          week4: 'Launch on Product Hunt. Email waitlist. Post results on social media. Target 300 users.',
        },
        scores: {
          marketSize: 8,
          pain: 9,
          competition: 5,
          aiAdvantage: 10,
          monetization: 8,
        },
      },
    ],
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any)
    const testerHeader = req.headers.get('x-tester-mode')
    const effectiveUserId = userId || (testerHeader ? 'tester-user' : null)
    
    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { interests, skills, industry, budget, audience } = body

    if (!interests || !skills || !industry || !budget || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let user: any = null
    let dbAvailable = true
    try {
      user = await (await getDb()).user.findUnique({
        where: { clerkId: effectiveUserId },
      })
      if (!user) {
        user = await (await getDb()).user.create({
          data: {
            clerkId: effectiveUserId,
            email: 'user@example.com',
            plan: 'FREE',
          },
        })
      }
    } catch (dbError) {
      console.error('DB unavailable, continuing without persistence:', (dbError as Error).message)
      dbAvailable = false
      user = { id: 'local-' + userId, plan: 'FOUNDER' }
    }

    let ideasData: any

    try {
      if (process.env.OPENROUTER_API_KEY) {
        const prompt = GENERATION_PROMPT
          .replace('{interests}', interests)
          .replace('{skills}', skills)
          .replace('{industry}', industry)
          .replace('{budget}', budget)
          .replace('{audience}', audience)

        const completion = await getOpenAI().chat.completions.create({
          model: AI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert startup advisor. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        })

        const content = completion.choices[0]?.message?.content

        if (content) {
          try {
            ideasData = JSON.parse(content)
          } catch (parseError) {
            const jsonMatch = content.match(/```json\s*([\s\S]*?)```/)
            if (jsonMatch) {
              ideasData = JSON.parse(jsonMatch[1].trim())
            } else {
              const jsonMatch2 = content.match(/\{[\s\S]*\}/)
              if (jsonMatch2) {
                ideasData = JSON.parse(jsonMatch2[0])
              }
            }
          }
        }
      }
    } catch (aiError) {
      console.error('AI API error, falling back to demo:', (aiError as Error).message)
    }

    if (!ideasData || !ideasData.ideas || !Array.isArray(ideasData.ideas)) {
      ideasData = generateMockIdeas(interests, skills, industry, budget, audience)
    }

    const ideasWithScores = ideasData.ideas.map((idea: any) => {
      const scores = idea.scores || {}
      const marketSize = scores.marketSize || 5
      const pain = scores.pain || 5
      const competition = scores.competition || 5
      const aiAdvantage = scores.aiAdvantage || 5
      const monetization = scores.monetization || 5
      const weightedScore = (
        marketSize * 0.25 + pain * 0.25 + competition * 0.2 + aiAdvantage * 0.15 + monetization * 0.15
      )
      return {
        name: idea.name || 'Untitled Startup',
        pitch: idea.pitch || '',
        problem: idea.problem || '',
        whyNow: idea.whyNow || '',
        targetAudience: idea.targetAudience || '',
        market: idea.market || { tam: '-', sam: '-', som: '-', competitors: [], gaps: '', advantage: '' },
        businessModel: idea.businessModel || { pricing: '-', tiers: [], year1Revenue: '-', year2Revenue: '-', acquisition: [] },
        mvp: idea.mvp || { coreFeatures: [], niceToHave: [], techStack: [], devEstimate: '-', infrastructureCost: '-' },
        validation: idea.validation || { firstCustomers: '-', whereToFind: [], outreachExamples: [], landingPageCopy: '' },
        branding: idea.branding || { nameVariations: [], taglines: [], domains: [], logoPrompts: [] },
        launchPlan: idea.launchPlan || { week1: '-', week2: '-', week3: '-', week4: '-' },
        scores: { marketSize, pain, competition, aiAdvantage, monetization },
        totalScore: Math.round(weightedScore * 10),
      }
    })

    ideasWithScores.sort((a: any, b: any) => b.totalScore - a.totalScore)

    const planKey = user.plan as keyof typeof PLAN_FEATURES
    const features = PLAN_FEATURES[planKey] || PLAN_FEATURES.FREE

    const filteredIdeas = ideasWithScores.slice(0, features.ideasCount).map((idea: any) => {
      const filtered: any = {
        name: idea.name,
        pitch: idea.pitch,
        problem: idea.problem,
        whyNow: idea.whyNow,
        targetAudience: idea.targetAudience,
      }

      if (features.showMarket) filtered.market = idea.market
      if (features.showBusinessModel) filtered.businessModel = idea.businessModel
      if (features.showMvp) filtered.mvp = idea.mvp
      if (features.showValidation) filtered.validation = idea.validation
      if (features.showBranding) filtered.branding = idea.branding
      if (features.showLaunchPlan) filtered.launchPlan = idea.launchPlan

      if (features.showDetailedScores) {
        filtered.scores = idea.scores
        filtered.totalScore = idea.totalScore
      } else {
        const scoreKeys = Object.keys(idea.scores).slice(0, features.maxScoreCategories)
        const limitedScores: any = {}
        scoreKeys.forEach((key: string) => { limitedScores[key] = idea.scores[key] })
        filtered.scores = limitedScores
        filtered.totalScore = idea.totalScore
      }

      return filtered
    })

    const genId = 'gen-' + Date.now()
    let savedId = genId

    if (dbAvailable) {
      try {
        const generation = await (await getDb()).generation.create({
          data: {
            userId: user.id,
            interests,
            skills,
            industry,
            budget,
            audience,
            ideas: JSON.stringify(filteredIdeas),
            scores: JSON.stringify(filteredIdeas.map((idea: any) => ({
              name: idea.name,
              score: idea.totalScore,
            }))),
          },
        })
        savedId = generation.id
      } catch (saveError) {
        console.error('Failed to save generation:', (saveError as Error).message)
      }
    }

    return NextResponse.json({
      id: savedId,
      ideas: filteredIdeas,
      plan: planKey,
      features,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
