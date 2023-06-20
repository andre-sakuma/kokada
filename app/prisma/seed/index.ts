import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  await prisma.user.deleteMany({})
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin',
      },
    ],
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
