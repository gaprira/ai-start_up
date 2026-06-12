export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()

    if (!['FREE', 'PRO', 'FOUNDER'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    let user = await prisma().user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      user = await prisma().user.create({
        data: {
          clerkId: userId,
          email: 'user@example.com',
          plan,
        },
      })
    } else {
      user = await prisma().user.update({
        where: { id: user.id },
        data: { plan },
      })
    }

    return NextResponse.json({ plan: user.plan })
  } catch (error) {
    console.error('Switch plan error:', error)
    return NextResponse.json({ error: 'Failed to switch plan' }, { status: 500 })
  }
}
