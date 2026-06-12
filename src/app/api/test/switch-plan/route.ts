export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/prisma'

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

    try {
      let user = await (await getDb()).user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        user = await (await getDb()).user.create({
          data: {
            clerkId: userId,
            email: 'user@example.com',
            plan,
          },
        })
      } else {
        user = await (await getDb()).user.update({
          where: { id: user.id },
          data: { plan },
        })
      }

      return NextResponse.json({ plan: user.plan })
    } catch {
      return NextResponse.json({ plan })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch plan' }, { status: 500 })
  }
}
