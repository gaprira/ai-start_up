'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardNavbar as Navbar } from '@/components/dashboard-navbar'
import { Sidebar } from '@/components/sidebar'

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-bg page-bg">
      <Navbar />
      <div className="flex pt-16 max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
