export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getDb } from '@/lib/prisma'

export async function GET() {
  try {
    await (await getDb()).$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  } catch {
    return NextResponse.json({
      status: 'degraded',
      db: 'disconnected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }, { status: 503 })
  }
}
