'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, CreditCard, FlaskConical } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useLang } from '@/lib/i18n'

export default function BillingPage() {
  const { toast } = useToast()
  const { t } = useLang()
  const [loading, setLoading] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState('FREE')

  const plans = [
    {
      name: 'Free',
      planKey: 'FREE',
      price: 0,
      description: t.pricing_free_desc,
      features: [t.billing_free_f1, t.billing_free_f2, t.billing_free_f3, t.billing_free_f4],
    },
    {
      name: 'Pro',
      planKey: 'PRO',
      price: 19,
      description: t.pricing_pro_desc,
      features: [t.billing_pro_f1, t.billing_pro_f2, t.billing_pro_f3, t.billing_pro_f4, t.billing_pro_f5],
      popular: true,
    },
    {
      name: 'Founder',
      planKey: 'FOUNDER',
      price: 49,
      description: t.pricing_founder_desc,
      features: [t.billing_founder_f1, t.billing_founder_f2, t.billing_founder_f3, t.billing_founder_f4, t.billing_founder_f5, t.billing_founder_f6],
    },
  ]

  useEffect(() => {
    const localPlan = localStorage.getItem('currentPlan')
    if (localPlan) {
      setCurrentPlan(localPlan)
      return
    }
    fetch('/api/test/current-plan')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { if (data.plan) { setCurrentPlan(data.plan); localStorage.setItem('currentPlan', data.plan) } })
      .catch(() => {})
  }, [])

  const handleSwitchPlan = async (planKey: string) => {
    setLoading(planKey)
    try {
      const response = await fetch('/api/test/switch-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      setCurrentPlan(data.plan)
      localStorage.setItem('currentPlan', data.plan)
      toast({ title: t.billing_plan_updated, description: `${t.billing_switched_to} ${planKey} plan.` })
    } catch {
      toast({ title: t.billing_plan_failed, description: t.billing_plan_failed_desc, variant: 'destructive' } as any)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-2">{t.billing_subtitle}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t.billing_title}</h1>
      </div>

      <div className="glass-card rounded-2xl p-5 flex items-center gap-4 border-yellow-500/20">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <FlaskConical className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-yellow-400">{t.billing_dev_mode}</p>
          <p className="text-xs text-muted-foreground">{t.billing_dev_mode_desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative rounded-2xl ${plan.popular ? 'p-px' : ''}`}
            style={plan.popular ? { background: 'linear-gradient(135deg, rgba(167,139,250,0.4), rgba(232,121,249,0.4), rgba(251,113,133,0.4))' } : undefined}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1">{t.billing_most_popular}</Badge>
              </div>
            )}
            <div className={`rounded-2xl p-6 sm:p-8 h-full ${plan.popular ? 'bg-card' : 'glass-card'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {currentPlan === plan.planKey && <Badge variant="secondary">{t.billing_current}</Badge>}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl sm:text-4xl font-bold">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                {plan.price > 0 && <span className="text-muted-foreground">{t.billing_mo}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-8">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={currentPlan === plan.planKey ? 'secondary' : 'default'}
                className={`w-full h-11 rounded-xl font-semibold ${currentPlan !== plan.planKey && plan.popular ? 'btn-gradient text-white' : ''}`}
                onClick={() => handleSwitchPlan(plan.planKey)}
                disabled={loading === plan.planKey || currentPlan === plan.planKey}
              >
                {loading === plan.planKey ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {currentPlan === plan.planKey ? t.billing_current_plan : `${t.billing_switch_to} ${plan.name}`}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
