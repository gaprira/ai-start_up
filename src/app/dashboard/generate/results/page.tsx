'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  Target, 
  Rocket, 
  Palette,
  CheckCircle,
  ExternalLink,
  Calendar,
  Users,
  DollarSign,
  Zap,
  BarChart3,
  PieChart,
  Presentation,
  LineChart,
  Trophy
} from 'lucide-react'
import Link from 'next/link'
import { PLAN_FEATURES } from '@/lib/stripe'
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
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
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
          <p className="text-sm text-muted-foreground mb-3">Upgrade to <span className="text-emerald-400 font-medium">{plan}</span> to unlock</p>
          <Link href="/dashboard/billing">
            <Button size="sm" className="btn-gradient text-white rounded-lg text-xs">
              Upgrade Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [planFeatures, setPlanFeatures] = useState<PlanFeatures>(defaultFeatures)
  const [planName, setPlanName] = useState('FREE')

  useEffect(() => {
    fetch('/api/test/current-plan')
      .then(r => r.json())
      .then(data => {
        if (data.plan) {
          setPlanName(data.plan)
          const features = PLAN_FEATURES[data.plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.FREE
          setPlanFeatures(features)
        }
      })
      .catch(() => {})

    if (id) {
      fetch(`/api/generations/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found')
          return res.json()
        })
        .then(data => {
          const ideasList = Array.isArray(data.ideas) ? data.ideas : []
          setIdeas(ideasList)
          if (ideasList.length > 0) {
            setSelectedIdea(ideasList[0])
          }
          setLoading(false)
        })
        .catch(() => {
          const cached = localStorage.getItem('lastIdeas')
          if (cached) {
            try {
              const ideasList = JSON.parse(cached)
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

  const getRadarData = (idea: Idea) => [
    { subject: 'Market Size', value: idea.scores.marketSize, fullMark: 10 },
    { subject: 'Pain Level', value: idea.scores.pain, fullMark: 10 },
    { subject: 'Competition', value: idea.scores.competition, fullMark: 10 },
    { subject: 'AI Advantage', value: idea.scores.aiAdvantage, fullMark: 10 },
    { subject: 'Monetization', value: idea.scores.monetization, fullMark: 10 },
  ]

  const getRevenueData = (idea: Idea) => [
    { name: 'Year 1', revenue: parseInt(idea.businessModel.year1Revenue.replace(/[^0-9]/g, '')) || 180 },
    { name: 'Year 2', revenue: parseInt(idea.businessModel.year2Revenue.replace(/[^0-9]/g, '')) || 1200 },
  ]

  const getMarketData = (idea: Idea) => [
    { name: 'TAM', value: parseInt(idea.market.tam.replace(/[^0-9]/g, '')) || 45 },
    { name: 'SAM', value: parseInt(idea.market.sam.replace(/[^0-9]/g, '')) || 12 },
    { name: 'SOM', value: parseInt(idea.market.som.replace(/[^0-9]/g, '')) || 0.15 },
  ]

  const handleExportPDF = () => {
    if (!selectedIdea) return

    const idea = selectedIdea
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${idea.name} - Startup Report</title>
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
  .tier { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
  .tier-name { font-weight: bold; }
  .tier-price { color: #059669; font-weight: bold; }
  .score-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .score-bar .label { width: 140px; font-size: 13px; }
  .score-bar .bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
  .score-bar .fill { height: 100%; background: #059669; border-radius: 4px; }
  .score-bar .num { width: 30px; text-align: right; font-size: 13px; font-weight: bold; }
  .launch-week { background: #ecfdf5; border-left: 3px solid #059669; padding: 12px; margin-bottom: 8px; border-radius: 0 8px 8px 0; }
  .launch-week strong { color: #059669; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #999; text-align: center; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  .roadmap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0; }
  .roadmap-week { background: #ecfdf5; padding: 16px; border-radius: 8px; border-top: 3px solid #059669; }
  .roadmap-week h4 { color: #059669; margin-bottom: 8px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>${idea.name}</h1>
<p class="pitch">${idea.pitch}</p>
<p><span class="score-badge">Score: ${idea.totalScore}/100</span></p>

<h2>Problem & Opportunity</h2>
<h3>Problem</h3>
<p>${idea.problem}</p>
<h3>Why Now</h3>
<p>${idea.whyNow}</p>
<h3>Target Audience</h3>
<p>${idea.targetAudience}</p>

<h2>Market Analysis</h2>
<div class="market-grid">
  <div class="market-box"><div class="label">TAM</div><div class="value">${idea.market.tam}</div></div>
  <div class="market-box"><div class="label">SAM</div><div class="value">${idea.market.sam}</div></div>
  <div class="market-box"><div class="label">SOM</div><div class="value">${idea.market.som}</div></div>
</div>

<h3>Competitor Analysis</h3>
<table>
  <tr><th>Competitor</th><th>Type</th></tr>
  ${idea.market.competitors.map((c: string) => `<tr><td>${c}</td><td>Direct</td></tr>`).join('')}
</table>

<h3>Market Gaps</h3>
<p>${idea.market.gaps}</p>
<h3>Competitive Advantage</h3>
<p>${idea.market.advantage}</p>

<h2>Business Model</h2>
<p><strong>Pricing:</strong> ${idea.businessModel.pricing}</p>

<h3>Subscription Tiers</h3>
<table>
  <tr><th>Tier</th><th>Price</th><th>Features</th></tr>
  ${idea.businessModel.tiers.map((t: any) => `<tr><td><strong>${t.name}</strong></td><td>${t.price}</td><td>${t.features.join(', ')}</td></tr>`).join('')}
</table>

<div class="market-grid">
  <div class="market-box"><div class="label">Year 1 Revenue</div><div class="value">${idea.businessModel.year1Revenue}</div></div>
  <div class="market-box"><div class="label">Year 2 Revenue</div><div class="value">${idea.businessModel.year2Revenue}</div></div>
</div>

<h3>Acquisition Channels</h3>
<ul>${idea.businessModel.acquisition.map((a: string) => `<li>${a}</li>`).join('')}</ul>

<h2>MVP Plan</h2>
<p><strong>Dev Time:</strong> ${idea.mvp.devEstimate} | <strong>Infra Cost:</strong> ${idea.mvp.infrastructureCost}</p>

<h3>Core Features</h3>
<ul>${idea.mvp.coreFeatures.map((f: string) => `<li>${f}</li>`).join('')}</ul>
<h3>Nice-to-Have</h3>
<ul>${idea.mvp.niceToHave.map((f: string) => `<li>${f}</li>`).join('')}</ul>
<h3>Tech Stack</h3>
<p>${idea.mvp.techStack.join(', ')}</p>

<h2>Validation Plan</h2>
<p><strong>First 10 Customers:</strong> ${idea.validation.firstCustomers}</p>
<h3>Where to Find</h3>
<ul>${idea.validation.whereToFind.map((p: string) => `<li>${p}</li>`).join('')}</ul>
<h3>Outreach Examples</h3>
${idea.validation.outreachExamples.map((e: string) => `<p style="font-style:italic;color:#555;margin:8px 0">"${e}"</p>`).join('')}
<h3>Landing Page Copy</h3>
<p style="font-size:18px;font-weight:500;color:#333">${idea.validation.landingPageCopy}</p>

<h2>Branding</h2>
<h3>Name Variations</h3>
<p>${idea.branding.nameVariations.join(' | ')}</p>
<h3>Taglines</h3>
<p>${idea.branding.taglines.join(' | ')}</p>
<h3>Domains</h3>
<p>${idea.branding.domains.join(' | ')}</p>
<h3>Logo Prompts</h3>
<ul>${idea.branding.logoPrompts.map((p: string) => `<li>${p}</li>`).join('')}</ul>

<h2>30-Day Launch Roadmap</h2>
<div class="roadmap">
  <div class="roadmap-week"><h4>Week 1 — Validation</h4><p>${idea.launchPlan.week1}</p></div>
  <div class="roadmap-week"><h4>Week 2 — MVP</h4><p>${idea.launchPlan.week2}</p></div>
  <div class="roadmap-week"><h4>Week 3 — Beta</h4><p>${idea.launchPlan.week3}</p></div>
  <div class="roadmap-week"><h4>Week 4 — Launch</h4><p>${idea.launchPlan.week4}</p></div>
</div>

<h2>Opportunity Scores</h2>
${Object.entries(idea.scores).map(([key, val]) => `
  <div class="score-bar">
    <div class="label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
    <div class="bar"><div class="fill" style="width:${(val as number)*10}%"></div></div>
    <div class="num">${val}/10</div>
  </div>
`).join('')}

<div class="footer">Generated by Startup Generator 9000 — ${new Date().toLocaleDateString()}</div>
</body>
</html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => printWindow.print(), 500)
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
        <p className="text-muted-foreground mb-4">No ideas found</p>
        <Link href="/dashboard/generate">
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Generate New Ideas
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
            Back to Generator
          </Link>
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-1">Results</p>
          <h1 className="text-3xl font-bold tracking-tight">Your Startup Ideas</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {planName} Plan
          </Badge>
          {planFeatures.showLaunchPlan ? (
            <Link href={`/dashboard/pitch-deck?id=${id}`}>
              <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                <Presentation className="mr-2 h-4 w-4" />
                Pitch Deck
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/billing">
              <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                <Presentation className="mr-2 h-4 w-4" />
                Pitch Deck (Founder)
              </Button>
            </Link>
          )}
          {planFeatures.showPdfExport ? (
            <Button variant="outline" onClick={handleExportPDF} className="rounded-xl h-11 border-white/10 hover:bg-white/5">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          ) : (
            <Link href="/dashboard/billing">
              <Button variant="outline" className="rounded-xl h-11 border-white/10 hover:bg-white/5">
                <Download className="mr-2 h-4 w-4" />
                Export PDF (Pro)
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ideas List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Ideas by Score</h3>
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
        </div>

        {/* Idea Details */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{selectedIdea.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedIdea.pitch}</p>
              </div>
              <span className="score-badge text-base px-4 py-1.5">
                {selectedIdea.totalScore}/100
              </span>
            </div>

            {/* Score Overview Cards */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {Object.entries(selectedIdea.scores).map(([key, value]) => (
                <div key={key} className="glass-card rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{value}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`grid w-full bg-white/5 rounded-xl p-1 ${planFeatures.showLaunchPlan ? 'grid-cols-7' : planFeatures.showBranding ? 'grid-cols-6' : planFeatures.showValidation ? 'grid-cols-5' : planFeatures.showMvp ? 'grid-cols-4' : planFeatures.showBusinessModel ? 'grid-cols-3' : planFeatures.showMarket ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <TabsTrigger value="overview" className="rounded-lg text-xs font-medium">Overview</TabsTrigger>
                {planFeatures.showMarket && <TabsTrigger value="market" className="rounded-lg text-xs font-medium">Market</TabsTrigger>}
                {planFeatures.showBusinessModel && <TabsTrigger value="business" className="rounded-lg text-xs font-medium">Business</TabsTrigger>}
                {planFeatures.showMvp && <TabsTrigger value="mvp" className="rounded-lg text-xs font-medium">MVP</TabsTrigger>}
                {planFeatures.showValidation && <TabsTrigger value="validation" className="rounded-lg text-xs font-medium">Validation</TabsTrigger>}
                {planFeatures.showBranding && <TabsTrigger value="branding" className="rounded-lg text-xs font-medium">Branding</TabsTrigger>}
                {planFeatures.showLaunchPlan && <TabsTrigger value="roadmap" className="rounded-lg text-xs font-medium">Roadmap</TabsTrigger>}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <Card className="border-white/10 bg-white/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-400" />
                        Score Radar
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

                  {/* Problem & Why Now */}
                  <div className="space-y-4">
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-400" />
                          Problem Statement
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
                          Why Now?
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
                          Target Audience
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.targetAudience}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Market Tab */}
              <TabsContent value="market" className="space-y-6 mt-6">
                {planFeatures.showMarket ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Market Size Chart */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-emerald-400" />
                            Market Size (Billions)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getMarketData(selectedIdea)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Competitors Table */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            Competitors
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">Company</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Threat</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.market?.competitors || []).map((comp, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-medium">{comp}</td>
                                    <td className="p-3 text-muted-foreground">Direct</td>
                                    <td className="p-3">
                                      <Badge variant={i === 0 ? 'destructive' : i === 1 ? 'default' : 'secondary'} className="text-xs">
                                        {i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Market Gaps</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{selectedIdea.market.gaps}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Competitive Advantage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{selectedIdea.market.advantage}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <LockedCard title="Market Analysis" plan="Pro" />
                )}
              </TabsContent>

              {/* Business Tab */}
              <TabsContent value="business" className="space-y-6 mt-6">
                {planFeatures.showBusinessModel ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Revenue Chart */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                            Revenue Projection ($K)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getRevenueData(selectedIdea)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Pricing Strategy */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Pricing Strategy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{selectedIdea.businessModel.pricing}</p>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.businessModel?.acquisition || []).map((channel, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{channel}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Subscription Tiers Table */}
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Subscription Tiers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white/5">
                                <th className="text-left p-3 font-medium text-muted-foreground">Tier</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Features</th>
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
                  <LockedCard title="Business Model & Pricing" plan="Pro" />
                )}
              </TabsContent>

              {/* MVP Tab */}
              <TabsContent value="mvp" className="space-y-6 mt-6">
                {planFeatures.showMvp ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp.devEstimate}</p>
                          <p className="text-xs text-muted-foreground">Dev Time</p>
                        </CardContent>
                      </Card>
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp.infrastructureCost}</p>
                          <p className="text-xs text-muted-foreground">Infra Cost</p>
                        </CardContent>
                      </Card>
                      <Card className="border-white/10 bg-white/5">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Rocket className="h-5 w-5 text-emerald-400" />
                          </div>
                          <p className="text-2xl font-bold">{selectedIdea.mvp.techStack.length}</p>
                          <p className="text-xs text-muted-foreground">Technologies</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Core Features Table */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Core Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">Feature</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.mvp?.coreFeatures || []).map((feature, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3">{feature}</td>
                                    <td className="p-3"><Badge className="bg-emerald-500/20 text-emerald-400">Must Have</Badge></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Nice-to-Have Table */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Nice-to-Have Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-white/5">
                                  <th className="text-left p-3 font-medium text-muted-foreground">Feature</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(selectedIdea.mvp?.niceToHave || []).map((feature, i) => (
                                  <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3">{feature}</td>
                                    <td className="p-3"><Badge variant="secondary">Nice to Have</Badge></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Tech Stack */}
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tech Stack</CardTitle>
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
                  <LockedCard title="MVP Roadmap" plan="Founder" />
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
                          First 10 Customers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedIdea.validation.firstCustomers}</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Where to Find */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Where to Find Them</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {(selectedIdea.validation?.whereToFind || []).map((platform, i) => (
                              <Badge key={i} variant="outline" className="text-sm">{platform}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Landing Page Copy */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Landing Page Copy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium">{selectedIdea.validation.landingPageCopy}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Outreach Examples Table */}
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Outreach Templates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white/5">
                                <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Message</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedIdea.validation?.outreachExamples || []).map((example, i) => (
                                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                                  <td className="p-3 text-muted-foreground italic">"{example}"</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <LockedCard title="Validation Plan" plan="Founder" />
                )}
              </TabsContent>

              {/* Branding Tab */}
              <TabsContent value="branding" className="space-y-6 mt-6">
                {planFeatures.showBranding ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Name Variations */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Palette className="h-4 w-4 text-emerald-400" />
                            Name Variations
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

                      {/* Taglines */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Taglines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {(selectedIdea.branding?.taglines || []).map((tagline, i) => (
                              <p key={i} className="text-muted-foreground italic">"{tagline}"</p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Domains */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Domain Suggestions</CardTitle>
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

                      {/* Logo Prompts */}
                      <Card className="border-white/10 bg-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Logo Prompts</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {(selectedIdea.branding?.logoPrompts || []).map((prompt, i) => (
                              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-sm text-muted-foreground">{prompt}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <LockedCard title="Branding Kit" plan="Founder" />
                )}
              </TabsContent>

              {/* Roadmap Tab */}
              <TabsContent value="roadmap" className="space-y-6 mt-6">
                {planFeatures.showLaunchPlan ? (
                  <>
                    <Card className="border-white/10 bg-white/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-emerald-400" />
                          30-Day Launch Roadmap
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          {/* Timeline Line */}
                          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-300" />
                          
                          <div className="space-y-8">
                            {/* Week 1 */}
                            <div className="relative flex gap-6">
                              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                                W1
                              </div>
                              <div className="flex-1 glass-card rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-emerald-500/20 text-emerald-400">Days 1-7</Badge>
                                  <h4 className="font-semibold">Validation Week</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{selectedIdea.launchPlan.week1}</p>
                              </div>
                            </div>

                            {/* Week 2 */}
                            <div className="relative flex gap-6">
                              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                                W2
                              </div>
                              <div className="flex-1 glass-card rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-teal-500/20 text-teal-400">Days 8-14</Badge>
                                  <h4 className="font-semibold">MVP Development</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{selectedIdea.launchPlan.week2}</p>
                              </div>
                            </div>

                            {/* Week 3 */}
                            <div className="relative flex gap-6">
                              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                                W3
                              </div>
                              <div className="flex-1 glass-card rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-cyan-500/20 text-cyan-400">Days 15-21</Badge>
                                  <h4 className="font-semibold">Beta Testing</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{selectedIdea.launchPlan.week3}</p>
                              </div>
                            </div>

                            {/* Week 4 */}
                            <div className="relative flex gap-6">
                              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                                W4
                              </div>
                              <div className="flex-1 glass-card rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className="bg-blue-500/20 text-blue-400">Days 22-30</Badge>
                                  <h4 className="font-semibold">Public Launch</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{selectedIdea.launchPlan.week4}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Roadmap Summary */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Validation', icon: Target, color: 'emerald' },
                        { label: 'MVP Build', icon: Rocket, color: 'teal' },
                        { label: 'Beta Test', icon: Users, color: 'cyan' },
                        { label: 'Launch', icon: Trophy, color: 'blue' },
                      ].map((item, i) => (
                        <Card key={i} className="border-white/10 bg-white/5">
                          <CardContent className="p-4 text-center">
                            <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-${item.color}-500/10 flex items-center justify-center`}>
                              <item.icon className={`h-5 w-5 text-${item.color}-400`} />
                            </div>
                            <p className="text-sm font-medium">{item.label}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <LockedCard title="30-Day Launch Plan" plan="Founder" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
