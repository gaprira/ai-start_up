'use client'

import Link from 'next/link'
import { Sparkles, Menu, X, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/i18n'

export function Navbar() {
  const { t, toggle, lang } = useLang()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-md group-hover:bg-emerald-500/30 transition-colors" />
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Startup Generator
            <span className="text-muted-foreground font-medium ml-1">9000</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/pricing" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
            {t.nav_pricing}
          </Link>
          <Link href="/docs" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
            {t.nav_docs}
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'RU' : 'EN'}
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <Link href="/sign-in">
            <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
              {t.nav_signin}
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="h-9 px-5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-opacity ml-1">
              {t.nav_getstarted}
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground"
          >
            <Globe className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            <Link href="/pricing" className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
              {t.nav_pricing}
            </Link>
            <Link href="/docs" className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
              {t.nav_docs}
            </Link>
            <Link href="/sign-in" className="block">
              <button className="w-full mt-2 h-10 px-4 text-sm text-muted-foreground hover:text-foreground border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                {t.nav_signin}
              </button>
            </Link>
            <Link href="/sign-up" className="block">
              <button className="w-full mt-2 h-10 px-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-opacity">
                {t.nav_getstarted}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
