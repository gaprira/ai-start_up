'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Startup Generator
                <span className="text-muted-foreground font-medium ml-1">9000</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer_desc}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.footer_product}</h4>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav_pricing}</Link></li>
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.features_label}</Link></li>
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav_docs}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.footer_company}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.footer_legal}</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="divider-glow mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Startup Generator 9000. {t.footer_rights}</p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
