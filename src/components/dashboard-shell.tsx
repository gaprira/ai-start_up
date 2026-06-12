'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardNavbar as Navbar } from '@/components/dashboard-navbar'
import { Sidebar } from '@/components/sidebar'

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [testerMode, setTesterMode] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTesterMode(localStorage.getItem('testerMode') === 'true')
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !testerMode && isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [ready, testerMode, isLoaded, isSignedIn, router])

  if (!ready || (!testerMode && !isLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-bg page-bg">
      {testerMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/10 border-b border-yellow-500/20 text-center py-1.5">
          <span className="text-xs font-medium text-yellow-400">Tester Mode Active</span>
          <button onClick={() => { localStorage.removeItem('testerMode'); window.location.href = '/' }} className="ml-4 text-xs text-yellow-400/70 hover:text-yellow-400 underline">Exit</button>
        </div>
      )}
      <div className={testerMode ? 'pt-8' : ''}>
        <Navbar />
        <div className="flex pt-16 max-w-7xl mx-auto">
          <Sidebar />
          <main className="flex-1 p-8 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
