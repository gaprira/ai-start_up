export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getOpenAI, AI_MODEL } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { content, targetLang } = await req.json()

    if (!content || !targetLang) {
      return NextResponse.json({ error: 'Missing content or targetLang' }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ translated: content })
    }

    const completion = await getOpenAI().chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following JSON content to ${targetLang === 'ru' ? 'Russian' : 'English'}. 

CRITICAL RULES:
- Keep JSON keys in English
- DO NOT translate these fields at all - keep them exactly as-is: tam, sam, som, year1Revenue, year2Revenue, devEstimate, infrastructureCost, price (in tiers), scores (all score fields), totalScore, name (branding field), domains, competitors (array items)
- DO NOT translate brand names, company names, tech stack names, domain names
- Translate ONLY these descriptive text fields: pitch, problem, whyNow, targetAudience, gaps, advantage, pricing (business model description), acquisition (array items), features (in tiers), coreFeatures, niceToHave, firstCustomers, whereToFind, outreachExamples, landingPageCopy, nameVariations, taglines, logoPrompts, week1, week2, week3, week4
- Return ONLY the translated JSON, no markdown`,
        },
        {
          role: 'user',
          content: JSON.stringify(content),
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      return NextResponse.json({ translated: content })
    }

    let translated = content
    try {
      translated = JSON.parse(responseContent)
    } catch {
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        translated = JSON.parse(jsonMatch[0])
      }
    }

    return NextResponse.json({ translated })
  } catch (error) {
    console.error('Translation error:', error)
    const { content } = await req.clone().json().catch(() => ({ content: null }))
    return NextResponse.json({ translated: content })
  }
}
