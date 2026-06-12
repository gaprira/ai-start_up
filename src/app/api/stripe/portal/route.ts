export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
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

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
