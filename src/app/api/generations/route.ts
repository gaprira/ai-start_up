export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json([])
    }

    try {
      const user = await (await getDb()).user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        return NextResponse.json([])
      }

      const generations = await (await getDb()).generation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          interests: true,
          createdAt: true,
          scores: true,
        },
      })

      const parsedGenerations = generations.map(gen => {
        try {
          return { ...gen, scores: JSON.parse(gen.scores) }
        } catch {
          return { ...gen, scores: [] }
        }
      })

      return NextResponse.json(parsedGenerations)
    } catch {
      return NextResponse.json([])
    }
  } catch {
    return NextResponse.json([])
  }
}
