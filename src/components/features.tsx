'use client'

import { Lightbulb, BarChart3, Target, Rocket, CheckCircle, Palette, FileText, TrendingUp } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function Features() {
  const { t } = useLang()

  const features = [
    { icon: Lightbulb, title: t.features_1_title, description: t.features_1_desc },
    { icon: BarChart3, title: t.features_2_title, description: t.features_2_desc },
    { icon: Target, title: t.features_3_title, description: t.features_3_desc },
    { icon: Rocket, title: t.features_4_title, description: t.features_4_desc },
    { icon: CheckCircle, title: t.features_5_title, description: t.features_5_desc },
    { icon: Palette, title: t.features_6_title, description: t.features_6_desc },
    { icon: FileText, title: t.features_7_title, description: t.features_7_desc },
    { icon: TrendingUp, title: t.features_8_title, description: t.features_8_desc },
  ]

  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-xs font-medium text-emerald-400 tracking-widest uppercase mb-4">{t.features_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t.features_title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t.features_desc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <feature.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
