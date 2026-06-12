export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma().user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.plan === 'FREE' || user.plan === 'PRO') {
      return NextResponse.json(
        { error: 'PDF export requires Founder plan' },
        { status: 403 }
      )
    }

    const { generationId } = await req.json()

    const generation = await prisma().generation.findUnique({
      where: { id: generationId },
    })

    if (!generation || generation.userId !== user.id) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: generation,
      message: 'PDF generation would happen here.',
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export' },
      { status: 500 }
    )
  }
}
