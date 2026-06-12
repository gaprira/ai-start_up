'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, Zap, ArrowRight, Plus } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export default function DashboardPage() {
  const { user } = useUser()
  const { t } = useLang()
  const [genCount, setGenCount] = useState(0)
  const [plan, setPlan] = useState('FREE')

  useEffect(() => {
    fetch('/api/generations')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setGenCount(data.length) })
      .catch(() => {})
    fetch('/api/test/current-plan')
      .then(r => r.json())
      .then(data => { if (data.plan) setPlan(data.plan) })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">{t.dash_title}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.dash_welcome}, {user?.firstName || 'Entrepreneur'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Sparkles, title: t.dash_total, value: String(genCount), sub: plan === 'FREE' ? `${3 - genCount} generations left` : 'Unlimited', color: 'text-emerald-400' },
          { icon: TrendingUp, title: t.dash_plan, value: plan, sub: plan === 'FREE' ? 'Upgrade for more' : 'Unlimited generations', color: 'text-green-400' },
          { icon: Zap, title: t.dash_top, value: '--', sub: t.dash_see, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-medium">{stat.title}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              {plan === 'FREE' && i === 0 && <Badge variant="secondary" className="text-xs">{3 - genCount}/3</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-8">
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

      <div>
        <h2 className="text-lg font-semibold mb-4">{t.dash_recent}</h2>
        <div className="glass-card rounded-2xl p-12 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t.dash_empty}</p>
        </div>
      </div>
    </div>
  )
}
