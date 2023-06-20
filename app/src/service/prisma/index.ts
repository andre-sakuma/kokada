import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export function connect() {
  return prisma.$connect()
}

export function disconnect() {
  return prisma.$disconnect()
}

export function getPrisma() {
  return prisma
}
