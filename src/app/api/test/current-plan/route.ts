export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any)

    if (!userId) {
      return NextResponse.json({ plan: 'FREE' })
    }

    try {
      const user = await (await getDb()).user.findUnique({
        where: { clerkId: userId },
        select: { plan: true },
      })
      return NextResponse.json({ plan: user?.plan || 'FREE' })
    } catch {
      return NextResponse.json({ plan: 'FREE' })
    }
  } catch {
    return NextResponse.json({ plan: 'FREE' })
  }
}
