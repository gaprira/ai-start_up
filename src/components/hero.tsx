'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function Hero() {
  const { t } = useLang()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-in-up">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {t.hero_badge}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight animate-fade-in-up animate-delay-100">
          {t.hero_title_1}{' '}
          <span className="gradient-text">{t.hero_title_2}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200 text-balance">
          {t.hero_desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up animate-delay-300">
          <Link href="/sign-up">
            <Button size="lg" className="btn-gradient text-white h-12 px-8 text-base font-semibold rounded-xl group">
              {t.hero_cta}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" size="lg" className="h-12 px-8 text-base text-muted-foreground hover:text-foreground rounded-xl">
              {t.hero_how}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
          {[
            { icon: '⚡', title: t.hero_card1_title, desc: t.hero_card1_desc },
            { icon: '📊', title: t.hero_card2_title, desc: t.hero_card2_desc },
            { icon: '🚀', title: t.hero_card3_title, desc: t.hero_card3_desc },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-center">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
