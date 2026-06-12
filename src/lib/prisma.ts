import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function prisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  globalForPrisma.prisma = new PrismaClient()
  return globalForPrisma.prisma
}
