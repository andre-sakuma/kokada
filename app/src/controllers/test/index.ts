import { Router } from 'express'
import { getPrisma } from '../../service/prisma'
import { funcWrapper } from '../../utils/funcWrapper'
import categories from 'prisma/seed/data/categories'

const app = Router()

app.get(
  '/',
  funcWrapper(async (req) => {
    const tests = await getPrisma().test.findMany()
    return tests
  })
)

app.post(
  '/',
  funcWrapper(async (req) => {
    const { categories, label } = req.body

    const questionsByCategory = await Promise.all(
      categories.map(async (category: { id: number; qnt: number }) => {
        const questions = await getPrisma().question.findMany({
          where: {
            categories: {
              some: {
                categoryId: category.id,
              },
            },
          },
        })

        const randomQuestions = questions
          .sort(() => Math.random() - Math.random())
          .slice(0, category.qnt)

        return randomQuestions
      })
    )

    const test = await getPrisma().test.create({
      data: {
        label,
        userId: req.user.id,
      },
    })

    await getPrisma().testItem.createMany({
      data: questionsByCategory
        .map((questions: any) =>
          questions.map((question: any) => ({
            questionId: question.id,
            testId: test.id,
          }))
        )
        .flat(),
    })

    return await getPrisma().test.findUnique({
      where: {
        id: test.id,
      },
      include: {
        items: {
          include: {
            question: true,
          },
        },
      },
    })
  })
)

app.get(
  '/results',
  funcWrapper(async (req) => {
    const allTests = await getPrisma().test.findMany({
      where: {
        correct: {
          not: null,
        },
        percentage: {
          not: null,
        },
      },
    })

    const gradeSum = allTests.reduce((acc, test) => {
      return acc + (test.percentage || 0)
    }, 0)

    const average = gradeSum / allTests.length

    const categories = await getPrisma().category.findMany({})

    const promises = categories.map(async (category) => {
      const items = await getPrisma().testItem.findMany({
        where: {
          test: {
            finishedAt: {
              not: null,
            },
          },
          question: {
            categories: {
              some: {
                categoryId: category.id,
              },
            },
          },
        },
      })

      const correctItems = items.filter((item) => item.correct)
      return {
        category,
        grade: Math.floor((correctItems.length / items.length) * 100),
      }
    })

    const averageByCategory = await Promise.all(promises)

    const mineTests = await getPrisma().test.findMany({
      where: {
        userId: req.user.id,
        finishedAt: {
          not: null,
        },
      },
      include: {
        items: {
          include: {
            question: {
              include: {
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const mineAverage =
      mineTests.reduce((acc, test) => {
        return acc + (test.percentage || 0)
      }, 0) / mineTests.length

    const mineAverageByCategory = categories.map((category) => {
      const items = mineTests
        .map((test) => test.items)
        .flat()
        .filter((item) => {
          return item.question.categories.some(
            (itemCategory) => itemCategory.categoryId === category.id
          )
        })

      const correctItems = items.filter((item) => item.correct)
      return {
        category,
        grade: Math.floor((correctItems.length / items.length) * 100),
      }
    })

    return {
      average,
      averageByCategory,
      mine: {
        average: mineAverage,
        averageByCategory: mineAverageByCategory,
      },
    }
  })
)

app.get(
  '/mine',
  funcWrapper(async (req) => {
    const id = req.user.id
    const tests = await getPrisma().test.findMany({
      where: {
        userId: id,
      },
      include: {
        items: {
          include: {
            question: {
              include: {
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    return tests
  })
)

app.post(
  '/:id/start',
  funcWrapper(async (req) => {
    const { id } = req.params
    const date = new Date()
    await getPrisma().test.update({
      where: {
        id: Number(id),
      },
      data: {
        startedAt: date,
      },
    })

    return date
  })
)

app.post(
  '/:id/finish',
  funcWrapper(async (req) => {
    const { id } = req.params
    const { answers } = req.body
    const date = new Date()
    const test = await getPrisma().test.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        items: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!test) {
      throw new Error('Test not found')
    }

    let correctAnswers = 0

    for (const item of test.items) {
      const answer = answers.find(
        (answer: any) => answer.questionId === item.questionId
      )
      if (!answer) {
        continue
      }

      if (answer.answer === item.question.correctAnswer) {
        correctAnswers++
      }
    }

    const transactions = test.items.map((item) => {
      const answer = answers.find(
        (answer: any) => answer.questionId === item.questionId
      )
      if (!answer) {
        throw new Error('Answer not found')
      }

      return getPrisma().testItem.update({
        where: {
          testId_questionId: {
            testId: test.id,
            questionId: item.questionId,
          },
        },
        data: {
          answer: answer.answer,
          correct: answer.answer === item.question.correctAnswer,
        },
      })
    })

    await getPrisma().$transaction(transactions)

    return await getPrisma().test.update({
      where: {
        id: Number(id),
      },
      data: {
        finishedAt: date,
        correct: correctAnswers,
        percentage: Math.floor((correctAnswers / test.items.length) * 100),
      },
    })
  })
)

app.get(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params

    const test = await getPrisma().test.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!test) {
      throw new Error('Test not found')
    }

    if (test.userId !== req.user.id) {
      throw new Error('Not allowed')
    }

    const query = {
      where: {
        id: Number(id),
      },
      include: {
        items: {
          include: {
            question: {
              select: {
                id: true,
                label: true,
                imageUrl: true,
                correctAnswer: false,
              },
            },
          },
        },
      },
    }

    if (test.finishedAt) {
      query.include.items.include.question.select.correctAnswer = true
      return await getPrisma().test.findUnique(query)
    }

    return await getPrisma().test.findUnique(query)
  })
)

app.put(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const data = req.body
    const test = await getPrisma().category.update({
      where: {
        id: Number(id),
      },
      data,
    })
    return test
  })
)

app.delete(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const test = await getPrisma().category.delete({
      where: {
        id: Number(id),
      },
    })
    return test
  })
)

export default app
