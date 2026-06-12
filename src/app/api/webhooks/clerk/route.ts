export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

async function validateRequest(request: Request) {
  const headerPayload = headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return null
  }

  const body = await request.text()
  const wh = new Webhook(webhookSecret)

  try {
    wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
    return JSON.parse(body)
  } catch (error) {
    console.error('Webhook verification failed:', error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const payload = await validateRequest(req)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid webhook' },
        { status: 400 }
      )
    }

    const { type, data } = payload

    switch (type) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url } = data
        
        await prisma().user.create({
          data: {
            clerkId: id,
            email: email_addresses[0]?.email_address || '',
            name: [first_name, last_name].filter(Boolean).join(' ') || null,
            avatar: image_url || null,
          },
        })
        break
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url } = data
        
        await prisma().user.update({
          where: { clerkId: id },
          data: {
            email: email_addresses[0]?.email_address || undefined,
            name: [first_name, last_name].filter(Boolean).join(' ') || undefined,
            avatar: image_url || undefined,
          },
        })
        break
      }

      case 'user.deleted': {
        const { id } = data
        
        await prisma().user.delete({
          where: { clerkId: id },
        })
        break
      }
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
