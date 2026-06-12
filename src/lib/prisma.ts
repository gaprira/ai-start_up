import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export async function getDb(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  const { PrismaClient: PC } = await import('@prisma/client')
  globalForPrisma.prisma = new PC()
  return globalForPrisma.prisma
}
