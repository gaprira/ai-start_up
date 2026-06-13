export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const user = await (await getDb()).user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const generation = await (await getDb()).generation.findUnique({
        where: { id: params.id },
      })

      if (!generation || generation.userId !== user.id) {
        return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
      }

      let parsedIdeas: any[] = []
      let parsedScores: any[] = []
      try { parsedIdeas = JSON.parse(generation.ideas) } catch { parsedIdeas = [] }
      try { parsedScores = JSON.parse(generation.scores) } catch { parsedScores = [] }

      return NextResponse.json({
        ...generation,
        ideas: parsedIdeas,
        scores: parsedScores,
      })
    } catch {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch generation' }, { status: 500 })
  }
}
