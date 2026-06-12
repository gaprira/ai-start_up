'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, ChevronLeft, ChevronRight, 
  Presentation, Target, Lightbulb, DollarSign, Users,
  Rocket, TrendingUp, Lock
} from 'lucide-react'
import { PLAN_FEATURES } from '@/lib/stripe'

interface Idea {
  name: string
  pitch: string
  problem: string
  whyNow: string
  targetAudience: string
  market?: { tam: string; sam: string; som: string; competitors: string[]; gaps: string; advantage: string }
  businessModel?: { pricing: string; tiers: Array<{ name: string; price: string; features: string[] }>; year1Revenue: string; year2Revenue: string; acquisition: string[] }
  mvp?: { coreFeatures: string[]; niceToHave: string[]; techStack: string[]; devEstimate: string; infrastructureCost: string }
  validation?: { firstCustomers: string; whereToFind: string[]; outreachExamples: string[]; landingPageCopy: string }
  branding?: { nameVariations: string[]; taglines: string[]; domains: string[]; logoPrompts: string[] }
  launchPlan?: { week1: string; week2: string; week3: string; week4: string }
  scores?: { marketSize: number; pain: number; competition: number; aiAdvantage: number; monetization: number }
  totalScore?: number
}

function TitleSlide({ idea }: { idea: Idea }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-12">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
        <Presentation className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold mb-4 tracking-tight">{idea.name}</h1>
      <p className="text-2xl text-muted-foreground mb-6">{idea.pitch}</p>
      <div className="flex gap-3">
        <Badge className="bg-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5">Score: {idea.totalScore || '—'}/100</Badge>
        <Badge variant="outline" className="text-sm px-4 py-1.5">{idea.branding?.taglines?.[0] || ''}</Badge>
      </div>
    </div>
  )
}

function ProblemSlide({ idea }: { idea: Idea }) {
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <Target className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-red-400 tracking-widest uppercase">The Problem</p>
          <h2 className="text-3xl font-bold">What We Solve</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">{idea.problem}</p>
        <div className="glass-card rounded-2xl p-6 border-l-4 border-red-500/50">
          <p className="text-sm font-medium text-red-400 mb-2">Why Now?</p>
          <p className="text-muted-foreground">{idea.whyNow}</p>
        </div>
      </div>
    </div>
  )
}

function SolutionSlide({ idea }: { idea: Idea }) {
  const features = idea.mvp?.coreFeatures || []
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Lightbulb className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase">The Solution</p>
          <h2 className="text-3xl font-bold">Our Approach</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">{idea.pitch}</p>
        {features.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {features.slice(0, 3).map((feature, i) => (
              <div key={i} className="glass-card rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                  {i + 1}
                </div>
                <p className="text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MarketSlide({ idea }: { idea: Idea }) {
  const market = idea.market
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-blue-400 tracking-widest uppercase">Market Opportunity</p>
          <h2 className="text-3xl font-bold">Market Size</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {market ? (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Addressable Market</p>
                <p className="text-4xl font-bold text-blue-400">{market.tam}</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Serviceable Market</p>
                <p className="text-4xl font-bold text-emerald-400">{market.sam}</p>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Obtainable Market</p>
                <p className="text-4xl font-bold text-teal-400">{market.som}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-muted-foreground">Upgrade to Pro to see market analysis</p>
          </div>
        )}
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm font-medium mb-2">Target Audience</p>
          <p className="text-muted-foreground">{idea.targetAudience}</p>
        </div>
      </div>
    </div>
  )
}

function BusinessSlide({ idea }: { idea: Idea }) {
  const bm = idea.businessModel
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-green-400 tracking-widest uppercase">Business Model</p>
          <h2 className="text-3xl font-bold">How We Make Money</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {bm ? (
          <>
            <p className="text-lg text-muted-foreground mb-6">{bm.pricing}</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {bm.tiers.map((tier, i) => (
                <div key={i} className={`glass-card rounded-xl p-5 ${i === 1 ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">{tier.name}</p>
                    <Badge variant={i === 1 ? 'default' : 'secondary'}>{tier.price}</Badge>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tier.features.slice(0, 3).map((f, j) => (
                      <li key={j}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Year 1 Revenue</p>
                <p className="text-2xl font-bold text-green-400">{bm.year1Revenue}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Year 2 Revenue</p>
                <p className="text-2xl font-bold text-green-400">{bm.year2Revenue}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-muted-foreground">Upgrade to Pro to see business model</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TractionSlide({ idea }: { idea: Idea }) {
  const mvp = idea.mvp
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <Rocket className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-purple-400 tracking-widest uppercase">Traction & MVP</p>
          <h2 className="text-3xl font-bold">Product Roadmap</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {mvp ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-xl p-5">
                <p className="text-sm font-medium mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {mvp.techStack.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-sm font-medium mb-2">Development Time</p>
                <p className="text-2xl font-bold text-emerald-400">{mvp.devEstimate}</p>
                <p className="text-xs text-muted-foreground mt-1">Infra: {mvp.infrastructureCost}/mo</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm font-medium mb-2">Core Features</p>
              <div className="flex flex-wrap gap-2">
                {mvp.coreFeatures.map((f, i) => (
                  <Badge key={i} className="bg-emerald-500/20 text-emerald-400 text-xs">{f}</Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-muted-foreground">Upgrade to Founder to see MVP details</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TeamSlide({ idea }: { idea: Idea }) {
  const val = idea.validation
  return (
    <div className="flex flex-col h-full px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-orange-400 tracking-widest uppercase">Validation</p>
          <h2 className="text-3xl font-bold">First Customers</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {val ? (
          <>
            <div className="glass-card rounded-2xl p-6 mb-6">
              <p className="text-sm font-medium mb-2">Finding Our First 10</p>
              <p className="text-muted-foreground">{val.firstCustomers}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-xl p-5">
                <p className="text-sm font-medium mb-3">Where to Find</p>
                <div className="flex flex-wrap gap-2">
                  {val.whereToFind.map((p, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <p className="text-sm font-medium mb-3">Landing Page</p>
                <p className="text-sm text-muted-foreground italic">"{val.landingPageCopy}"</p>
              </div>
            </div>
            {val.outreachExamples[0] && (
              <div className="glass-card rounded-xl p-5">
                <p className="text-sm font-medium mb-3">Outreach Template</p>
                <p className="text-sm text-muted-foreground italic">"{val.outreachExamples[0]}"</p>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-muted-foreground">Upgrade to Founder to see validation plan</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AskSlide({ idea }: { idea: Idea }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-12">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
        <DollarSign className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4">The Ask</h2>
      <p className="text-xl text-muted-foreground mb-8">We're looking for partners who believe in this vision</p>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-3xl font-bold text-emerald-400">{idea.market?.tam || '—'}</p>
          <p className="text-sm text-muted-foreground mt-2">Market Size</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-3xl font-bold text-emerald-400">{idea.mvp?.devEstimate || '—'}</p>
          <p className="text-sm text-muted-foreground mt-2">To MVP</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-3xl font-bold text-emerald-400">{idea.businessModel?.year1Revenue || '—'}</p>
          <p className="text-sm text-muted-foreground mt-2">Year 1 Revenue</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Badge className="bg-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5">{idea.branding?.domains?.[0] || ''}</Badge>
        <Badge variant="outline" className="text-sm px-4 py-1.5">{idea.branding?.taglines?.[0] || ''}</Badge>
      </div>
    </div>
  )
}

function LockedSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-12">
      <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 flex items-center justify-center mb-6">
        <Lock className="h-10 w-10 text-yellow-400" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Pitch Deck Generator</h2>
      <p className="text-lg text-muted-foreground mb-6">This feature requires the Founder plan</p>
      <Link href="/dashboard/billing">
        <Button className="btn-gradient text-white px-8 py-6 text-lg rounded-2xl">
          Upgrade to Founder
        </Button>
      </Link>
    </div>
  )
}

function PitchDeckContent() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('id')
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const localPlan = localStorage.getItem('currentPlan')
    if (localPlan) {
      const features = PLAN_FEATURES[localPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.FREE
      setHasAccess(features.showLaunchPlan)
    } else {
      fetch('/api/test/current-plan')
        .then(r => { if (!r.ok) throw new Error(); return r.json() })
        .then(data => {
          if (data.plan) {
            const features = PLAN_FEATURES[data.plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.FREE
            setHasAccess(features.showLaunchPlan)
          }
        })
        .catch(() => {})
    }

    if (ideaId) {
      fetch(`/api/generations/${ideaId}`)
        .then(res => { if (!res.ok) throw new Error(); return res.json() })
        .then(data => {
          if (data.ideas && data.ideas.length > 0) {
            setIdea(data.ideas[0])
          }
          setLoading(false)
        })
        .catch(() => {
          const cached = localStorage.getItem('lastIdeas')
          if (cached) {
            try {
              const ideas = JSON.parse(cached)
              if (ideas.length > 0) setIdea(ideas[0])
            } catch {}
          }
          setLoading(false)
        })
    } else {
      const cached = localStorage.getItem('lastIdeas')
      if (cached) {
        try {
          const ideas = JSON.parse(cached)
          if (ideas.length > 0) setIdea(ideas[0])
        } catch {}
      }
      setLoading(false)
    }
  }, [ideaId])

  const slides = idea ? [
    { title: 'Title', content: <TitleSlide idea={idea} /> },
    { title: 'Problem', content: <ProblemSlide idea={idea} /> },
    { title: 'Solution', content: <SolutionSlide idea={idea} /> },
    { title: 'Market', content: <MarketSlide idea={idea} /> },
    { title: 'Business', content: <BusinessSlide idea={idea} /> },
    { title: 'Traction', content: <TractionSlide idea={idea} /> },
    { title: 'Team', content: <TeamSlide idea={idea} /> },
    { title: 'The Ask', content: <AskSlide idea={idea} /> },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!ideaId) {
    return (
      <div className="text-center py-12">
        <Presentation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No idea selected</p>
        <Link href="/dashboard/generate">
          <Button variant="outline" className="rounded-xl border-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Generate an Idea First
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dashboard/generate/results?id=${ideaId}`} className="text-muted-foreground hover:text-foreground text-sm mb-2 inline-flex items-center transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Results
          </Link>
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-1">Pitch Deck</p>
          <h1 className="text-3xl font-bold tracking-tight">{idea?.name || 'Pitch Deck'}</h1>
        </div>
        {hasAccess && slides.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="rounded-xl border-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentSlide + 1} / {slides.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="rounded-xl border-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {hasAccess ? (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/5 overflow-x-auto">
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all ${
                  currentSlide === i
                    ? 'text-emerald-400 bg-emerald-500/10 border-b-2 border-emerald-500'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
          <div className="h-[600px] bg-gradient-to-br from-background via-background to-emerald-500/5">
            {slides[currentSlide]?.content}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl h-[600px]">
          <LockedSlide />
        </div>
      )}

      {hasAccess && slides.length > 0 && (
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === i ? 'bg-emerald-500 w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PitchDeckPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    }>
      <PitchDeckContent />
    </Suspense>
  )
}
