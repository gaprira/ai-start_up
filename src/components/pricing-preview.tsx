'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function Pricing() {
  const { t } = useLang()

  const plans = [
    { name: 'Free', price: '$0', description: t.pricing_free_desc, features: ['Unlimited generations', 'Basic idea overview', 'Simple scoring'], cta: t.pricing_start, popular: false },
    { name: 'Pro', price: '$19', period: t.pricing_mo, description: t.pricing_pro_desc, features: ['Unlimited generations', 'Competitor analysis', 'Startup reports', 'Market analysis', 'Business model details'], cta: t.pricing_getpro, popular: true },
    { name: 'Founder', price: '$49', period: t.pricing_mo, description: t.pricing_founder_desc, features: ['Everything in Pro', 'Launch plans', 'Branding kit', 'PDF exports', 'Startup scoring', 'Validation plans', 'AI-generated assets'], cta: t.pricing_getfounder, popular: false },
  ]

  return (
    <section id="pricing" className="py-20 sm:py-32 relative">
      <div className="divider-glow absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-4">{t.pricing_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t.pricing_title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t.pricing_desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative rounded-2xl p-px ${plan.popular ? 'animate-pulse-glow' : ''}`}
              style={plan.popular ? { background: 'linear-gradient(135deg, rgba(167,139,250,0.4), rgba(232,121,249,0.4), rgba(251,113,133,0.4))' } : undefined}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1">{t.pricing_popular}</Badge>
                </div>
              )}
              <div className={`rounded-2xl p-6 sm:p-8 h-full ${plan.popular ? 'bg-card' : 'glass-card'}`}>
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-8">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-400 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button variant={plan.popular ? 'default' : 'outline'} className={`w-full h-11 rounded-xl font-semibold ${plan.popular ? 'btn-gradient text-white' : ''}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
