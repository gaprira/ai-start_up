'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Calendar } from 'lucide-react'

interface Generation {
  id: string
  interests: string
  createdAt: string
  scores: Array<{ name: string; score: number }>
}

export default function GenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isTester = localStorage.getItem('testerMode') === 'true'
    fetch('/api/generations', {
      headers: isTester ? { 'x-tester-mode': 'true' } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGenerations(data)
          localStorage.setItem('generations', JSON.stringify(data))
        } else {
          const cached = localStorage.getItem('generations')
          if (cached) setGenerations(JSON.parse(cached))
        }
        setLoading(false)
      })
      .catch(() => {
        const cached = localStorage.getItem('generations')
        if (cached) {
          try { setGenerations(JSON.parse(cached)) } catch {}
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Generations</h1>
          <p className="text-muted-foreground">
            View all your startup idea generations.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button variant="gradient">
            <Sparkles className="mr-2 h-4 w-4" />
            New Generation
          </Button>
        </Link>
      </div>

      {generations.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No generations yet. Create your first startup idea!
            </p>
            <Link href="/dashboard/generate">
              <Button variant="gradient">
                Generate Ideas
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {generations.map((gen) => (
            <Link key={gen.id} href={`/dashboard/generate/results?id=${gen.id}`}>
              <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(gen.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {gen.interests}
                      </p>
                      <div className="flex gap-2">
                        {gen.scores.slice(0, 3).map((score, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {score.name}: {score.score}/100
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
