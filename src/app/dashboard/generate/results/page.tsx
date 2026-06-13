'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Target,
  Rocket,
  Palette,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Zap,
  BarChart3,
  PieChart,
  Presentation,
  Trophy,
  Info,
  Layers,
  CheckCircle,
  Flame
} from 'lucide-react'
import Link from 'next/link'
import { PLAN_FEATURES } from '@/lib/stripe'
import { useLang } from '@/lib/i18n'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

interface Idea {
  name: string
  pitch: string
  problem: string
  whyNow: string
  targetAudience: string
  market: {
    tam: string
    sam: string
    som: string
    competitors: string[]
    gaps: string
    advantage: string
  }
  businessModel: {
    pricing: string
    tiers: Array<{
      name: string
      price: string
      features: string[]
    }>
    year1Revenue: string
    year2Revenue: string
    acquisition: string[]
  }
  mvp: {
    coreFeatures: string[]
    niceToHave: string[]
    techStack: string[]
    devEstimate: string
    infrastructureCost: string
  }
  validation: {
    firstCustomers: string
    whereToFind: string[]
    outreachExamples: string[]
    landingPageCopy: string
  }
  branding: {
    nameVariations: string[]
    taglines: string[]
    domains: string[]
    logoPrompts: string[]
  }
  launchPlan: {
    week1: string
    week2: string
    week3: string
    week4: string
  }
  scores: {
    marketSize: number
    pain: number
    competition: number
    aiAdvantage: number
    monetization: number
  }
  totalScore: number
}

const COLORS = ['#059669', '#10b981', '#14b8a6', '#22d3ee', '#38bdf8']
const PIE_COLORS = ['#059669', '#14b8a6', '#22d3ee']

const ROADMAP_COLOR_MAP: Record<string, { bg: string; text: string; gradient: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', gradient: 'from-emerald-400 to-teal-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', gradient: 'from-teal-400 to-cyan-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', gradient: 'from-cyan-400 to-blue-500' },
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function parseRevenue(str: string): number {
  if (!str) return 0
  const bMatch = str.match(/\$?([\d,.]+)\s*(billion|bn|bln|млрд)/i)
  if (bMatch) return parseFloat(bMatch[1].replace(/,/g, '')) * 1000
  const mMatch = str.match(/\$?([\d,.]+)\s*(million|mln|млн)/i)
  if (mMatch) return parseFloat(mMatch[1].replace(/,/g, ''))
  const kMatch = str.match(/\$?([\d,.]+)\s*(thousand|k)/i)
  if (kMatch) return parseFloat(kMatch[1].replace(/,/g, ''))
  const num = parseFloat(str.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return 0
  if (num > 1000000) return num / 1000
  if (num > 1000) return num
  return num
}

function parseMarketValue(str: string): number {
  if (!str) return 0
  const bMatch = str.match(/\$?([\d,.]+)\s*(billion|bn|bln|млрд|млрд\.)/i)
  if (bMatch) return parseFloat(bMatch[1].replace(/,/g, ''))
  const mMatch = str.match(/\$?([\d,.]+)\s*(million|mln|mln\.|млн|млн\.)/i)
  if (mMatch) return parseFloat(mMatch[1].replace(/,/g, '')) / 1000
  const kMatch = str.match(/\$?([\d,.]+)\s*(thousand|k)/i)
  if (kMatch) return parseFloat(kMatch[1].replace(/,/g, '')) / 1000000
  const num = parseFloat(str.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return 0
  if (num > 1000000) return num / 1000000
  if (num > 1000) return num / 1000
  return num
}

function LogoConcept({ name, colors }: { name: string; colors: string[] }) {
  const initials = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-white/90 tracking-tight">{initials}</span>
      </div>
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
          <span className="text-xs font-medium text-white/80">{name}</span>
        </div>
      </div>
    </div>
  )
}

interface PlanFeatures {
  ideasCount: number
  showMarket: boolean
  showBusinessModel: boolean
  showMvp: boolean
  showValidation: boolean
  showBranding: boolean
  showLaunchPlan: boolean
  showDetailedScores: boolean
  showPdfExport: boolean
  maxScoreCategories: number
}

const defaultFeatures: PlanFeatures = {
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
}

function LockedCard({ title, plan }: { title: string; plan: string }) {
  return (
    <Card className="border-white/10 bg-white/5 relative overflow-hidden">
      <CardContent className="p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        <div className="relative z-10">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="font-semibold mb-1">{title}</p>
          <p className="text-sm text-muted-foreground mb-3">{plan} {plan === 'Pro' ? 'Pro' : 'Founder'}</p>
          <Link href="/dashboard/billing">
            <Button size="sm" className="btn-gradient text-white rounded-lg text-xs">Upgrade Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResultsPage() {
  const { t, lang } = useLang()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [planFeatures, setPlanFeatures] = useState<PlanFeatures>(defaultFeatures)
  const [planName, setPlanName] = useState('FREE')
  const [trending, setTrending] = useState<Array<{ name: string; pitch: string; score: number; tags: string[]; trend: string }>>([])
  const [selectedTrending, setSelectedTrending] = useState<typeof trending[0] | null>(null)
  const [translating, setTranslating] = useState(false)
  const prevLangRef = useRef(lang)

  useEffect(() => {
    const localPlan = localStorage.getItem('currentPlan')
    if (localPlan) {
      setPlanName(localPlan)
      const features = PLAN_FEATURES[localPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.FREE
      setPlanFeatures(features)
    } else {
      fetch('/api/test/current-plan')
        .then(r => { if (!r.ok) throw new Error(); return r.json() })
        .then(data => {
          if (data.plan) {
            setPlanName(data.plan)
            const features = PLAN_FEATURES[data.plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.FREE
            setPlanFeatures(features)
          }
        })
        .catch(() => {})
    }

    if (id) {
      const cacheKey = `gen_${id}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const ideasList = JSON.parse(cached)
          setIdeas(ideasList)
          if (ideasList.length > 0) setSelectedIdea(ideasList[0])
          setLoading(false)
          return
        } catch {}
      }

      fetch(`/api/generations/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found')
          return res.json()
        })
        .then(data => {
          const ideasList = Array.isArray(data.ideas) ? data.ideas : []
          setIdeas(ideasList)
          if (ideasList.length > 0) setSelectedIdea(ideasList[0])
          setLoading(false)
        })
        .catch(() => {
          const fallback = localStorage.getItem('lastIdeas')
          if (fallback) {
            try {
              const ideasList = JSON.parse(fallback)
              setIdeas(ideasList)
              if (ideasList.length > 0) setSelectedIdea(ideasList[0])
            } catch {}
          }
          setLoading(false)
        })
    } else {
      const cached = localStorage.getItem('lastIdeas')
      if (cached) {
        try {
          const ideasList = JSON.parse(cached)
          setIdeas(ideasList)
          if (ideasList.length > 0) setSelectedIdea(ideasList[0])
        } catch {}
      }
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(data => { if (data.startups) setTrending(data.startups) })
      .catch(() => {})
  }, [])

  const translateIdeas = useCallback(async (targetLang: string) => {
    if (ideas.length === 0) return
    const cacheKey = `gen_${id || 'last'}_${targetLang}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const translated = JSON.parse(cached)
        setIdeas(translated)
        if (translated.length > 0) setSelectedIdea(translated[0])
        return
      } catch {}
    }
    setTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: ideas, targetLang }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.translated && Array.isArray(data.translated)) {
          setIdeas(data.translated)
          if (data.translated.length > 0) setSelectedIdea(data.translated[0])
          localStorage.setItem(cacheKey, JSON.stringify(data.translated))
        }
      }
    } catch (e) {
      console.error('Translation failed:', e)
    } finally {
      setTranslating(false)
    }
  }, [ideas, id])

  useEffect(() => {
    if (prevLangRef.current !== lang && ideas.length > 0 && !loading) {
      translateIdeas(lang)
    }
    prevLangRef.current = lang
  }, [lang, ideas.length, loading, translateIdeas])

  const getRadarData = (idea: Idea) => {
    const s = idea.scores || {}
    return [
      { subject: t.gen_market_size, value: s.marketSize ?? 5, fullMark: 10 },
      { subject: t.gen_market_gaps, value: s.pain ?? 5, fullMark: 10 },
      { subject: t.gen_market_competitors, value: s.competition ?? 5, fullMark: 10 },
      { subject: t.gen_score_ai, value: s.aiAdvantage ?? 5, fullMark: 10 },
      { subject: t.gen_business_revenue, value: s.monetization ?? 5, fullMark: 10 },
    ]
  }

  const getMarketPieData = (idea: Idea) => {
    let tam = parseMarketValue(idea.market?.tam || '')
    let sam = parseMarketValue(idea.market?.sam || '')
    let som = parseMarketValue(idea.market?.som || '')
    if (tam === 0 && sam === 0 && som === 0) { tam = 45; sam = 12; som = 0.15 }
    else if (sam >= tam) sam = tam * 0.3
    if (som >= sam) som = sam * 0.1
    return [
      { name: 'TAM', value: tam, label: idea.market?.tam || '$45B' },
      { name: 'SAM', value: sam, label: idea.market?.sam || '$12B' },
      { name: 'SOM', value: som, label: idea.market?.som || '$150M' },
    ]
  }

  const getRevenueData = (idea: Idea) => {
    const y1 = parseRevenue(idea.businessModel?.year1Revenue || '') || 180
    const sumSquares = 650
    const monthWord = lang === 'ru' ? 'мес' : 'mo'
    return Array.from({ length: 12 }, (_, i) => {
      const monthRevenue = Math.round(y1 * ((i + 1) * (i + 1)) / sumSquares)
      const label = monthRevenue >= 1000 ? `$${(monthRevenue / 1000).toFixed(1)}M` : `$${monthRevenue}K`
      return { name: `${i + 1} ${monthWord}`, revenue: monthRevenue, label }
    })
  }

  const handleExportPDF = () => {
    if (!selectedIdea) return

    const idea = selectedIdea
    const e = escapeHtml
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${e(idea.name)} - Startup Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 8px; color: #059669; }
  h2 { font-size: 20px; margin: 24px 0 12px; border-bottom: 2px solid #059669; padding-bottom: 6px; color: #333; }
  h3 { font-size: 16px; margin: 16px 0 8px; color: #555; }
  .pitch { font-size: 18px; color: #666; margin-bottom: 16px; }
  .score-badge { display: inline-block; background: #059669; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 14px; }
  .market-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 12px 0; }
  .market-box { background: #ecfdf5; padding: 12px; border-radius: 8px; text-align: center; }
  .market-box .label { font-size: 12px; color: #666; }
  .market-box .value { font-size: 18px; font-weight: bold; color: #059669; }
  ul { margin-left: 20px; margin-bottom: 8px; }
  li { margin-bottom: 4px; }
  .score-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .score-bar .label { width: 140px; font-size: 13px; }
  .score-bar .bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
  .score-bar .fill { height: 100%; background: #059669; border-radius: 4px; }
  .score-bar .num { width: 30px; text-align: right; font-size: 13px; font-weight: bold; }
  .roadmap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0; }
  .roadmap-week { background: #ecfdf5; padding: 16px; border-radius: 8px; border-top: 3px solid #059669; }
  .roadmap-week h4 { color: #059669; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; text-align: center; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>${e(idea.name)}</h1>
<p class="pitch">${e(idea.pitch)}</p>
<p><span class="score-badge">Score: ${idea.totalScore}/100</span></p>
<h2>Problem &amp; Opportunity</h2>
<h3>Problem</h3><p>${e(idea.problem)}</p>
<h3>Why Now</h3><p>${e(idea.whyNow)}</p>
<h3>Target Audience</h3><p>${e(idea.targetAudience)}</p>
<h2>Market Analysis</h2>
<div class="market-grid">
  <div class="market-box"><div class="label">TAM</div><div class="value">${e(idea.market.tam)}</div></div>
  <div class="market-box"><div class="label">SAM</div><div class="value">${e(idea.market.sam)}</div></div>
  <div class="market-box"><div class="label">SOM</div><div class="value">${e(idea.market.som)}</div></div>
</div>
<h3>Competitors</h3>
<table><tr><th>Competitor</th><th>Type</th></tr>
${idea.market.competitors.map((c: string) => `<tr><td>${e(c)}</td><td>Direct</td></tr>`).join('')}</table>
<h3>Market Gaps</h3><p>${e(idea.market.gaps)}</p>
<h3>Competitive Advantage</h3><p>${e(idea.market.advantage)}</p>
<h2>Business Model</h2>
<p><strong>Pricing:</strong> ${e(idea.businessModel.pricing)}</p>
<h3>Subscription Tiers</h3>
<table><tr><th>Tier</th><th>Price</th><th>Features</th></tr>
${idea.businessModel.tiers.map((t: any) => `<tr><td><strong>${e(t.name)}</strong></td><td>${e(t.price)}</td><td>${t.features.map((f: string) => e(f)).join(', ')}</td></tr>`).join('')}</table>
<div class="market-grid">
  <div class="market-box"><div class="label">Year 1 Revenue</div><div class="value">${e(idea.businessModel.year1Revenue)}</div></div>
  <div class="market-box"><div class="label">Year 2 Revenue</div><div class="value">${e(idea.businessModel.year2Revenue)}</div></div>
</div>
<h3>Acquisition Channels</h3>
<ul>${idea.businessModel.acquisition.map((a: string) => `<li>${e(a)}</li>`).join('')}</ul>
<h2>MVP Plan</h2>
<p><strong>Dev Time:</strong> ${e(idea.mvp.devEstimate)} | <strong>Infra Cost:</strong> ${e(idea.mvp.infrastructureCost)}</p>
<h3>Core Features</h3><ul>${idea.mvp.coreFeatures.map((f: string) => `<li>${e(f)}</li>`).join('')}</ul>
<h3>Nice-to-Have</h3><ul>${idea.mvp.niceToHave.map((f: string) => `<li>${e(f)}</li>`).join('')}</ul>
<h3>Tech Stack</h3><p>${idea.mvp.techStack.map((t: string) => e(t)).join(', ')}</p>
<h2>Validation Plan</h2>
<p><strong>First 10 Customers:</strong> ${e(idea.validation.firstCustomers)}</p>
<h3>Where to Find</h3><ul>${idea.validation.whereToFind.map((p: string) => `<li>${e(p)}</li>`).join('')}</ul>
<h3>Outreach Examples</h3>
${idea.validation.outreachExamples.map((ex: string) => `<p style="font-style:italic;color:#555;margin:8px 0">&ldquo;${e(ex)}&rdquo;</p>`).join('')}
<h3>Landing Page Copy</h3><p style="font-size:18px;font-weight:500;color:#333">${e(idea.validation.landingPageCopy)}</p>
<h2>Branding</h2>
<h3>Names</h3><p>${idea.branding.nameVariations.map((n: string) => e(n)).join(' | ')}</p>
<h3>Taglines</h3><p>${idea.branding.taglines.map((t: string) => e(t)).join(' | ')}</p>
<h3>Domains</h3><p>${idea.branding.domains.map((d: string) => e(d)).join(' | ')}</p>
<h2>30-Day Launch Roadmap</h2>
<div class="roadmap">
  <div class="roadmap-week"><h4>Week 1</h4><p>${e(idea.launchPlan.week1)}</p></div>
  <div class="roadmap-week"><h4>Week 2</h4><p>${e(idea.launchPlan.week2)}</p></div>
  <div class="roadmap-week"><h4>Week 3</h4><p>${e(idea.launchPlan.week3)}</p></div>
  <div class="roadmap-week"><h4>Week 4</h4><p>${e(idea.launchPlan.week4)}</p></div>
</div>
<h2>Opportunity Scores</h2>
${Object.entries(idea.scores).map(([key, val]) => `
  <div class="score-bar">
    <div class="label">${e(key.replace(/([A-Z])/g, ' $1').trim())}</div>
    <div class="bar"><div class="fill" style="width:${(val as number)*10}%"></div></div>
    <div class="num">${val}/10</div>
  </div>
`).join('')}
<div class="footer">Generated by Startup Generator 9000 &mdash; ${new Date().toLocaleDateString()}</div>
</body></html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => printWindow.print(), 500)
    } else {
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${idea.name.replace(/[^a-zA-Z0-9]/g, '_')}_report.html`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-emerald-500/10 border-b-emerald-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    )
  }

  if (!selectedIdea) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
          <Target className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">{t.gen_no_ideas}</p>
        <Link href="/dashboard/generate">
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.gen_generate_new}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/generate" className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-flex items-center transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t.gen_back_gen}
          </Link>
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-1">{t.gen_results}</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.gen_overview_title}</h1>
          {translating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <span className="text-xs text-muted-foreground">{t.gen_translating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">{planName} {t.gen_plan_badge}</Badge>
          <div className="flex flex-wrap gap-2">
            {planFeatures.showLaunchPlan ? (
              <Link href={`/dashboard/pitch-deck?id=${id}`}>
                <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                  <Presentation className="mr-2 h-4 w-4" />
                  {t.gen_pitch_deck}
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/billing">
                <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                  <Presentation className="mr-2 h-4 w-4" />
                  {t.gen_pitch_deck} ({t.gen_pitch_deck_hint})
                </Button>
              </Link>
            )}
            {planFeatures.showPdfExport ? (
              <Button variant="outline" onClick={handleExportPDF} className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                <Download className="mr-2 h-4 w-4" />
                {t.gen_export_pdf}
              </Button>
            ) : (
              <Link href="/dashboard/billing">
                <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                  <Download className="mr-2 h-4 w-4" />
                  {t.gen_export_pdf} ({t.gen_export_hint})
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[50vh] md:max-h-none">
          <h3 className="text-xs font-medium text-muted-foreground tracking-widest uppercase">{t.gen_ideasbyscore}</h3>
          {ideas.map((idea, index) => (
            <div
              key={index}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                selectedIdea.name === idea.name
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : ''
              }`}
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">#{index + 1}</span>
                <span className={`score-badge ${idea.totalScore >= 80 ? '!bg-gradient-to-r !from-green-500 !to-emerald-500' : idea.totalScore >= 60 ? '' : '!bg-gradient-to-r !from-orange-500 !to-yellow-500'}`}>
                  {idea.totalScore}/100
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{idea.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{idea.pitch}</p>
            </div>
          ))}

          {trending.length > 0 && planFeatures.showLaunchPlan && (
            <div className="glass-card rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Flame className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <h3 className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">{t.gen_trending}</h3>
              </div>
              <div className="space-y-2">
                {trending.slice(0, 4).map((item, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrending(item)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="score-badge !text-[10px] !px-1.5 !py-0">{item.score}/100</span>
                      <span className="text-[10px] text-emerald-400/70 font-medium">{item.trend}</span>
                    </div>
                    <h4 className="font-semibold text-xs mb-0.5">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{item.pitch}</p>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {item.tags.slice(0, 2).map((tag, j) => (
                        <span key={j} className="text-[9px] bg-emerald-500/10 text-emerald-400 rounded-full px-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-4 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{selectedIdea.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedIdea.pitch}</p>
              </div>
              <span className="score-badge text-base px-4 py-1.5">{selectedIdea.totalScore}/100</span>
            </div>

            <div className={`grid gap-3 mb-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`}>
              {Object.entries(selectedIdea.scores || {}).map(([key, value]) => (
                <div key={key} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{value ?? 5}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`flex flex-nowrap w-full bg-white/5 rounded-xl p-1 overflow-x-auto min-w-max`}>
                <TabsTrigger value="overview" className="rounded-lg text-xs font-medium">{t.gen_overview}</TabsTrigger>
                {planFeatures.showMarket && <TabsTrigger value="market" className="rounded-lg text-xs font-medium">{t.gen_market}</TabsTrigger>}
                {planFeatures.showBusinessModel && <TabsTrigger value="business" className="rounded-lg text-xs font-medium">{t.gen_business}</TabsTrigger>}
                {planFeatures.showMvp && <TabsTrigger value="mvp" className="rounded-lg text-xs font-medium">{t.gen_mvp}</TabsTrigger>}
                {planFeatures.showValidation && <TabsTrigger value="validation" className="rounded-lg text-xs font-medium">{t.gen_validation}</TabsTrigger>}
                {planFeatures.showBranding && <TabsTrigger value="branding" className="rounded-lg text-xs font-medium">{t.gen_branding}</TabsTrigger>}
                {planFeatures.showLaunchPlan && <TabsTrigger value="roadmap" className="rounded-lg text-xs font-medium">{t.gen_launch}</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-400" />
                        {t.gen_score_radar}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getRadarData(selectedIdea)}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                            <Radar name="Score" dataKey="value" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-400" />
                          {t.gen_problem}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.problem}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4 text-emerald-400" />
                          {t.gen_whynow}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.whyNow}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-400" />
                          {t.gen_audience_label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.targetAudience}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Market Tab — redesigned */}
              <TabsContent value="market" className="space-y-6 mt-6">
                {planFeatures.showMarket ? (
                  <>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Layers className="h-4 w-4 text-emerald-400" />
                          {t.gen_market_size}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={getMarketPieData(selectedIdea)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={90}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {getMarketPieData(selectedIdea).map((_: any, index: number) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                  formatter={(value: any, name: any) => [`$${value}B`, name]}
                                />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'TAM', label: t.gen_market_size_desc, value: selectedIdea.market?.tam, explain: t.gen_market_explain_tam, color: PIE_COLORS[0] },
                              { key: 'SAM', label: t.gen_market_serviceable, value: selectedIdea.market?.sam, explain: t.gen_market_explain_sam, color: PIE_COLORS[1] },
                              { key: 'SOM', label: t.gen_market_obtainable, value: selectedIdea.market?.som, explain: t.gen_market_explain_som, color: PIE_COLORS[2] },
                            ].map((item) => (
                              <div key={item.key} className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm">{item.key}</span>
                                    <span className="text-lg font-bold text-emerald-400">{item.value}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{item.explain}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            {t.gen_market_competitors}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_market_company}</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_market_type}</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_market_threat}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.market?.competitors || []).map((comp, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium">{comp}</td>
                                    <td className="p-3 text-muted-foreground">{t.gen_market_direct}</td>
                                    <td className="p-3">
                                      <Badge variant={i === 0 ? 'destructive' : i === 1 ? 'default' : 'secondary'} className="text-xs">
                                        {i === 0 ? t.gen_market_high : i === 1 ? t.gen_market_medium : t.gen_market_low}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <Card className="border-white/10 bg-white/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t.gen_market_gaps}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{selectedIdea.market?.gaps || '—'}</p>
                          </CardContent>
                        </Card>
                        <Card className="border-white/10 bg-white/5">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t.gen_market_advantage}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{selectedIdea.market?.advantage || '—'}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_market} plan="Pro" />
                )}
              </TabsContent>

              {/* Business Tab — fixed revenue */}
              <TabsContent value="business" className="space-y-6 mt-6">
                {planFeatures.showBusinessModel ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                            {t.gen_business_revenue}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">{t.gen_business_revenue_desc}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getRevenueData(selectedIdea)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(1)}M` : `$${v}K`} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                  formatter={(value: any, name: any, props: any) => [props?.payload?.label || `$${value}K`, name]}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_business_pricing}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{selectedIdea.businessModel?.pricing || '—'}</p>
                          <p className="text-xs font-medium text-muted-foreground mb-2">{t.gen_business_channels}</p>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.businessModel?.acquisition || []).map((channel, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{channel}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t.gen_business_tiers}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white/5">
                                <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_business_tier}</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_business_price}</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_business_features}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedIdea.businessModel?.tiers || []).map((tier, i) => (
                                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-3 font-medium">{tier.name}</td>
                                  <td className="p-3 text-emerald-400 font-semibold">{tier.price}</td>
                                  <td className="p-3 text-muted-foreground">
                                    <div className="flex flex-wrap gap-1">
                                      {tier.features.slice(0, 3).map((f, j) => (
                                        <Badge key={j} variant="secondary" className="text-xs">{f}</Badge>
                                      ))}
                                      {tier.features.length > 3 && (
                                        <Badge variant="secondary" className="text-xs">+{tier.features.length - 3}</Badge>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_business} plan="Pro" />
                )}
              </TabsContent>

              {/* MVP Tab */}
              <TabsContent value="mvp" className="space-y-6 mt-6">
                {planFeatures.showMvp ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp?.devEstimate || '—'}</p>
                          <p className="text-xs text-muted-foreground">{t.gen_mvp_devtime}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp?.infrastructureCost || '—'}</p>
                          <p className="text-xs text-muted-foreground">{t.gen_mvp_infra}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Rocket className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp?.techStack?.length || 0}</p>
                          <p className="text-xs text-muted-foreground">{t.gen_mvp_techcount}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_mvp_core}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_mvp_feature}</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_mvp_priority}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.mvp?.coreFeatures || []).map((feature, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3">{feature}</td>
                                    <td className="p-3"><Badge className="bg-emerald-500/20 text-emerald-400">{t.gen_mvp_must}</Badge></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_mvp_nice}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_mvp_feature}</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_mvp_priority}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.mvp?.niceToHave || []).map((feature, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3">{feature}</td>
                                    <td className="p-3"><Badge variant="secondary">{t.gen_mvp_nicetohave}</Badge></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t.gen_mvp_stack}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(selectedIdea.mvp?.techStack || []).map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-sm px-3 py-1">{tech}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_mvp} plan="Founder" />
                )}
              </TabsContent>

              {/* Validation Tab */}
              <TabsContent value="validation" className="space-y-6 mt-6">
                {planFeatures.showValidation ? (
                  <>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-400" />
                          {t.gen_validation_first10}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.validation?.firstCustomers || '—'}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_validation_where}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.validation?.whereToFind || []).map((platform, i) => (
                              <Badge key={i} variant="outline" className="text-sm">{platform}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_validation_landing}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">{selectedIdea.validation?.landingPageCopy || '—'}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t.gen_validation_outreach}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white/5">
                                <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">{t.gen_validation_msg}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedIdea.validation?.outreachExamples || []).map((example, i) => (
                                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                                  <td className="p-3 text-muted-foreground italic">&ldquo;{example}&rdquo;</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_validation} plan="Founder" />
                )}
              </TabsContent>

              {/* Branding Tab — with logo concepts */}
              <TabsContent value="branding" className="space-y-6 mt-6">
                {planFeatures.showBranding ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Palette className="h-4 w-4 text-emerald-400" />
                            {t.gen_branding_names}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.branding?.nameVariations || []).map((name, i) => (
                              <Badge key={i} variant="emerald" className="text-sm px-3 py-1">{name}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_branding_taglines}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {(selectedIdea.branding?.taglines || []).map((tagline, i) => (
                              <p key={i} className="text-muted-foreground italic">&ldquo;{tagline}&rdquo;</p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_branding_domains}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.branding?.domains || []).map((domain, i) => (
                              <Badge key={i} variant="outline" className="flex items-center gap-1 text-sm px-3 py-1">
                                {domain}
                                <ExternalLink className="h-3 w-3" />
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{t.gen_branding_logos}</CardTitle>
                          <p className="text-xs text-muted-foreground">{t.gen_branding_logos_desc}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(selectedIdea.branding?.nameVariations || []).slice(0, 4).map((name, i) => (
                              <LogoConcept
                                key={i}
                                name={name}
                                colors={[COLORS[i % COLORS.length], COLORS[(i + 1) % COLORS.length]]}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_branding} plan="Founder" />
                )}
              </TabsContent>

              {/* Roadmap Tab — day-by-day for Founder */}
              <TabsContent value="roadmap" className="space-y-6 mt-6">
                {planFeatures.showLaunchPlan ? (
                  <>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-emerald-400" />
                          {t.gen_roadmap_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300" />

                          <div className="space-y-8">
                            {[
                              { label: t.gen_roadmap_validation, days: '1-7', week: selectedIdea.launchPlan?.week1 || '—', color: 'emerald', icon: Target, weekLabel: t.gen_roadmap_week1 },
                              { label: t.gen_roadmap_mvp, days: '8-14', week: selectedIdea.launchPlan?.week2 || '—', color: 'teal', icon: Rocket, weekLabel: t.gen_roadmap_week2 },
                              { label: t.gen_roadmap_beta, days: '15-21', week: selectedIdea.launchPlan?.week3 || '—', color: 'cyan', icon: Users, weekLabel: t.gen_roadmap_week3 },
                              { label: t.gen_roadmap_launch, days: '22-30', week: selectedIdea.launchPlan?.week4 || '—', color: 'blue', icon: Trophy, weekLabel: t.gen_roadmap_week4 },
                            ].map((phase, i) => (
                              <div key={i} className="relative flex gap-6">
                                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${ROADMAP_COLOR_MAP[phase.color].gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25`}>
                                  W{i + 1}
                                </div>
                                <div className="flex-1 glass-card rounded-xl p-6">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Badge className={`${ROADMAP_COLOR_MAP[phase.color].bg} ${ROADMAP_COLOR_MAP[phase.color].text}`}>{t.gen_roadmap_days} {phase.days}</Badge>
                                    <h4 className="font-semibold">{phase.label}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{phase.week}</p>
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {phase.week.split(/[.!?,]+/).filter((s: string) => s.trim().length > 5).slice(0, 4).map((task: string, j: number) => (
                                      <span key={j} className="inline-flex items-center gap-1 text-xs bg-white/5 rounded-full px-2.5 py-1 text-muted-foreground">
                                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                                        {task.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: t.gen_roadmap_validation, icon: Target, color: 'emerald' },
                        { label: t.gen_roadmap_mvp, icon: Rocket, color: 'teal' },
                        { label: t.gen_roadmap_beta, icon: Users, color: 'cyan' },
                        { label: t.gen_roadmap_launch, icon: Trophy, color: 'blue' },
                      ].map((item, i) => (
                        <Card key={i} className="border-white/10 bg-white/5">
                          <CardContent className="p-4 text-center">
                            <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${ROADMAP_COLOR_MAP[item.color].bg} flex items-center justify-center`}>
                              <item.icon className={`h-5 w-5 ${ROADMAP_COLOR_MAP[item.color].text}`} />
                            </div>
                            <p className="text-sm font-medium">{item.label}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <LockedCard title={t.gen_upgrade_roadmap} plan="Founder" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {selectedTrending && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedTrending(null)}>
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedTrending.name}</h2>
                  <span className="text-xs text-emerald-400">{selectedTrending.trend}</span>
                </div>
              </div>
              <span className="score-badge text-lg px-3 py-1">{selectedTrending.score}/100</span>
            </div>
            <p className="text-muted-foreground mb-4">{selectedTrending.pitch}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedTrending.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <div className="glass-card rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-emerald-400">{selectedTrending.score}</p>
                  <p className="text-[10px] text-muted-foreground">{t.trending_score_label}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{selectedTrending.trend.replace(/[+%/]/g, '').split(' ')[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{t.trending_growth_label}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{selectedTrending.tags.length}</p>
                  <p className="text-[10px] text-muted-foreground">{t.trending_segments_label}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5" onClick={() => setSelectedTrending(null)}>{t.trending_close}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
