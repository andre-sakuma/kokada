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
      {
        name: 'u1',
        email: 'u1@teste.com',
        password: 'u1',
      },
      {
        name: 'u2',
        email: 'u2@teste.com',
        password: 'u2',
      },
      {
        name: 'u3',
        email: 'u3@teste.com',
        password: 'u3',
      },
      {
        name: 'u4',
        email: 'u4@teste.com',
        password: 'u4',
      },
      {
        name: 'u5',
        email: 'u5@teste.com',
        password: 'u5',
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

  const normalUsers = await prisma.user.findMany({
    where: {
      NOT: {
        email: 'admin@admin.com',
      },
    },
  })

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < 50; i++) {
      const randomUser =
        normalUsers[Math.floor(Math.random() * normalUsers.length)]

      const test = await tx.test.create({
        data: {
          label: `Test ${i + 1}`,
          userId: randomUser.id,
        },
      })

      const questions = await tx.question.findMany({
        take: 15,
        skip: Math.floor(Math.random() * 15),
      })

      const possibleAnswers = ['A', 'B', 'C', 'D', 'E']
      const chooseRandomAnswer = () =>
        possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]

      let corrects = 0
      await tx.testItem.createMany({
        data: questions.map((question) => {
          const answer = chooseRandomAnswer()
          const isCorrect = answer === question.correctAnswer
          if (isCorrect) {
            corrects++
          }
          return {
            questionId: question.id,
            testId: test.id,
            correct: isCorrect,
            answer,
          }
        }),
      })

      await tx.test.update({
        where: {
          id: test.id,
        },
        data: {
          finishedAt: new Date(),
          correct: corrects,
          percentage: Math.floor((corrects / 15) * 100),
        },
      })
    }
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
