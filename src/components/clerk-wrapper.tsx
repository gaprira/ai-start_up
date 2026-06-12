'use client'

import { ClerkProvider as CP } from '@clerk/nextjs'
import { useState, useEffect, ReactNode } from 'react'

export function ClerkWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CP>
      {children}
    </CP>
  )
}
