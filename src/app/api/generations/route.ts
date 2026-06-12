import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const generations = await prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        interests: true,
        createdAt: true,
        scores: true,
      },
    })

    const parsedGenerations = generations.map(gen => ({
      ...gen,
      scores: JSON.parse(gen.scores),
    }))

    return NextResponse.json(parsedGenerations)
  } catch (error) {
    console.error('Fetch generations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch generations' },
      { status: 500 }
    )
  }
}
