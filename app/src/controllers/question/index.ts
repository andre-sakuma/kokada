import { Router } from 'express'
import { getPrisma } from '../../service/prisma'
import { funcWrapper } from '../../utils/funcWrapper'

const app = Router()

app.get(
  '/',
  funcWrapper(async (req) => {
    const questions = await getPrisma().question.findMany()
    return questions
  })
)

app.post(
  '/',
  funcWrapper(async (req) => {
    const { correctAnswer, imageUrl, categories, label } = req.body
    const authorId = req.user.id
    const question = await getPrisma().question.create({
      data: {
        label,
        correctAnswer,
        imageUrl,
        authorId,
      },
    })

    await getPrisma().categoryQuestionRelation.createMany({
      data: categories.map((categoryId: number) => ({
        categoryId,
        questionId: question.id,
      })),
    })

    return question
  })
)

app.get(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const question = await getPrisma().question.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
    return question
  })
)

app.put(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const data = req.body
    const question = await getPrisma().question.update({
      where: {
        id: Number(id),
      },
      data,
    })
    return question
  })
)

app.delete(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const question = await getPrisma().question.delete({
      where: {
        id: Number(id),
      },
    })
    return question
  })
)

export default app
