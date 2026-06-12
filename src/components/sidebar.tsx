'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Sparkles, CreditCard, Settings, HelpCircle, Presentation } from 'lucide-react'

const sidebarItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Generate', href: '/dashboard/generate', icon: Sparkles },
  { title: 'Pitch Deck', href: '/dashboard/pitch-deck', icon: Presentation },
  { title: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r border-white/5 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
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
    </aside>
  )
}
