export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/prisma'

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ plan: 'FREE' })
  }

  try {
    const { userId } = getAuth(req as any)
    const testerHeader = req.headers.get('x-tester-mode')

    if (!userId && !testerHeader) {
      return NextResponse.json({ plan: 'FREE' })
    }

    const effectiveUserId = userId || 'tester-user'

    try {
      const user = await (await getDb()).user.findUnique({
        where: { clerkId: effectiveUserId },
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
