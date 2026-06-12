export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getDb } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = data
      
      await (await getDb()).user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
        },
      })
    }

    if (type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data
      
      await (await getDb()).user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address || undefined,
          name: `${first_name || ''} ${last_name || ''}`.trim() || undefined,
          avatar: image_url || undefined,
        },
      })
    }

    if (type === 'user.deleted') {
      const { id } = data
      
      await (await getDb()).user.delete({
        where: { clerkId: id },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
