'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Sparkles, Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n'

export function DashboardNavbar() {
  const { isSignedIn } = useUser()
  const { t, toggle, lang } = useLang()

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-white/5">
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

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav_dashboard}
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'RU' : 'EN'}
          </button>
          <div className="w-px h-6 bg-white/10" />
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </nav>
  )
}
