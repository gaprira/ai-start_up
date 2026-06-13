'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, Zap, ArrowRight, Plus, ArrowRight as Arrow, Trash2, Flame } from 'lucide-react'
import { useLang } from '@/lib/i18n'

interface GenItem {
  id: string
  interests: string
  createdAt: string
  scores: Array<{ name: string; score: number }>
}

interface TrendingItem {
  name: string
  pitch: string
  score: number
  tags: string[]
  trend: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const { t } = useLang()
  const [genCount, setGenCount] = useState(0)
  const [plan, setPlan] = useState('FREE')
  const [generations, setGenerations] = useState<GenItem[]>([])
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [selectedTrending, setSelectedTrending] = useState<TrendingItem | null>(null)

  useEffect(() => {
    const localPlan = localStorage.getItem('currentPlan')
    if (localPlan) setPlan(localPlan)

    const cached = localStorage.getItem('generations')
    if (cached) {
      try {
        const gens = JSON.parse(cached)
        setGenerations(gens)
        setGenCount(gens.length)
      } catch {}
    }

    const isTester = localStorage.getItem('testerMode') === 'true'
    fetch('/api/generations', {
      headers: isTester ? { 'x-tester-mode': 'true' } : {},
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGenerations(data)
          setGenCount(data.length)
          localStorage.setItem('generations', JSON.stringify(data))
          data.forEach((gen: GenItem) => {
            if (gen.scores && gen.scores.length > 0) {
              const cached = localStorage.getItem(`gen_${gen.id}`)
              if (!cached) {
                localStorage.setItem(`gen_${gen.id}`, JSON.stringify(gen.scores.map((s: any) => ({ name: s.name, totalScore: s.score, pitch: '', problem: '', whyNow: '', targetAudience: '', market: { tam: '', sam: '', som: '', competitors: [], gaps: '', advantage: '' }, businessModel: { pricing: '', tiers: [], year1Revenue: '', year2Revenue: '', acquisition: [] }, mvp: { coreFeatures: [], niceToHave: [], techStack: [], devEstimate: '', infrastructureCost: '' }, validation: { firstCustomers: '', whereToFind: [], outreachExamples: [], landingPageCopy: '' }, branding: { nameVariations: [], taglines: [], domains: [], logoPrompts: [] }, launchPlan: { week1: '', week2: '', week3: '', week4: '' }, scores: {} }))))
              }
            }
          })
        }
      })
      .catch(() => {})

    fetch('/api/trending')
      .then(r => r.json())
      .then(data => { if (data.startups) setTrending(data.startups) })
      .catch(() => {})
  }, [])

  const deleteGeneration = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = generations.filter(g => g.id !== id)
    setGenerations(updated)
    setGenCount(updated.length)
    localStorage.setItem('generations', JSON.stringify(updated))
    localStorage.removeItem(`gen_${id}`)
  }

  const topScore = generations.reduce((max, gen) => {
    const genMax = (gen.scores || []).reduce((m, s) => Math.max(m, s.score), 0)
    return Math.max(max, genMax)
  }, 0)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">{t.dash_title}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t.dash_welcome}, {user?.firstName || t.dash_fallback_name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Sparkles, title: t.dash_total, value: String(genCount), sub: plan === 'FREE' ? `${Math.max(0, 3 - genCount)} ${t.dash_generations_left}` : t.dash_unlimited, color: 'text-emerald-400' },
          { icon: TrendingUp, title: t.dash_plan, value: plan, sub: plan === 'FREE' ? t.dash_upgrade_more : t.dash_unlimited_gen, color: 'text-green-400' },
          { icon: Zap, title: t.dash_top, value: topScore > 0 ? `${topScore}/100` : '--', sub: topScore > 0 ? t.dash_best : t.dash_see, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-medium">{stat.title}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              {plan === 'FREE' && i === 0 && <Badge variant="secondary" className="text-xs">{Math.max(0, 3 - genCount)}/3</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">{t.dash_ready}</h2>
            <p className="text-sm text-muted-foreground">{t.dash_ready_desc}</p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="btn-gradient text-white h-11 px-6 rounded-xl font-semibold shrink-0 group">
              <Plus className="mr-2 h-4 w-4" />
              {t.dash_genbtn}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t.dash_recent}</h2>
            {generations.length > 0 && (
              <button
                onClick={() => { setGenerations([]); setGenCount(0); localStorage.removeItem('generations') }}
                className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                {t.dash_clear_all || 'Clear all'}
              </button>
            )}
          </div>
          {generations.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t.dash_empty}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generations.slice(0, 10).map((gen) => (
                <Link key={gen.id} href={`/dashboard/generate/results?id=${gen.id}`}>
                  <div className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(gen.createdAt).toLocaleDateString()} {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">{gen.interests}</p>
                        <div className="flex gap-2 mt-2">
                          {(gen.scores || []).slice(0, 3).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {s.name}: {s.score}/100
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                          onClick={(e) => deleteGeneration(gen.id, e)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <Arrow className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {trending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Flame className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold">{t.gen_trending}</h2>
            </div>
            <div className="space-y-3">
              {trending.slice(0, 5).map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => {
                  setSelectedTrending(item)
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="score-badge !text-xs">{item.score}/100</span>
                    <span className="text-xs text-emerald-400/70 font-medium">{item.trend}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.pitch}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, j) => (
                      <span key={j} className="text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full px-1.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
