import { PrismaClient } from '@prisma/client'
import Categories from './data/categories'
import Questions from './data/questions'

const prisma = new PrismaClient()
async function main() {
  await prisma.categoryQuestionRelation.deleteMany({})
  await prisma.testItem.deleteMany({})
  await prisma.test.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.category.deleteMany({})
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

  const admin = await prisma.user.findUnique({
    where: {
      email: 'admin@admin.com',
    },
  })

  if (!admin) {
    throw new Error('Admin not found')
  }

  await prisma.category.createMany({
    data: Categories,
  })

  const createdCategories = await prisma.category.findMany()

  for (const category of createdCategories) {
    const label = category.label as
      | 'Problem Solving'
      | 'Critical Reasoning'
      | 'Data Suffiency'

    const questions = Questions[label]
    for (const question of questions) {
      await prisma.question.create({
        data: {
          ...question,
          authorId: admin.id,
          categories: {
            create: {
              categoryId: category.id,
            },
          },
        },
      })
    }
  }
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
