'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Sparkles, CreditCard, Settings, HelpCircle, Presentation, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLang()

  const sidebarItems = [
    { title: t.sidebar_dashboard, href: '/dashboard', icon: LayoutDashboard },
    { title: t.sidebar_generate, href: '/dashboard/generate', icon: Sparkles },
    { title: t.sidebar_pitch_deck, href: '/dashboard/pitch-deck', icon: Presentation },
    { title: t.sidebar_billing, href: '/dashboard/billing', icon: CreditCard },
    { title: t.sidebar_settings, href: '/dashboard/settings', icon: Settings },
    { title: t.sidebar_help, href: '/dashboard/help', icon: HelpCircle },
  ]

  const nav = (
    <nav className="space-y-1">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              isActive
                ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <item.icon className={cn('h-4 w-4', isActive && 'text-emerald-400')} />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute bottom-20 right-4 w-56 glass-card rounded-2xl p-4 border border-white/10 shadow-xl" onClick={e => e.stopPropagation()}>
            {nav}
          </div>
        </div>
      )}

      <aside className="w-56 border-r border-white/5 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
        {nav}
      </aside>
    </>
  )
}
