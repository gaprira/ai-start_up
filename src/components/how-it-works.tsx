'use client'

import { FileInput, Sparkles, BarChart3, Rocket } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function HowItWorks() {
  const { t } = useLang()

  const steps = [
    { icon: FileInput, number: '01', title: t.how_1_title, description: t.how_1_desc },
    { icon: Sparkles, number: '02', title: t.how_2_title, description: t.how_2_desc },
    { icon: BarChart3, number: '03', title: t.how_3_title, description: t.how_3_desc },
    { icon: Rocket, number: '04', title: t.how_4_title, description: t.how_4_desc },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-32 relative">
      <div className="divider-glow absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-4">{t.how_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t.how_title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t.how_desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="step-number mb-4">{step.number}</div>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <step.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
