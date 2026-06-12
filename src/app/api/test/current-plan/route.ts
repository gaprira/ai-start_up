import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any)

    if (!userId) {
      return NextResponse.json({ plan: 'FREE' })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { plan: true },
    })

    return NextResponse.json({ plan: user?.plan || 'FREE' })
  } catch (error) {
    return NextResponse.json({ plan: 'FREE' })
  }
}
