import { Router } from 'express'
import { getPrisma } from '../../service/prisma'
import { funcWrapper } from '../../utils/funcWrapper'

const app = Router()

app.get(
  '/',
  funcWrapper(async (req) => {
    const categories = await getPrisma().category.findMany({
      include: {
        questions: true,
      },
    })
    return categories
  })
)

app.post(
  '/',
  funcWrapper(async (req) => {
    const { label, slug } = req.body
    const category = await getPrisma().category.create({
      data: {
        label,
        slug,
      },
    })
    return category
  })
)

app.put(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const data = req.body
    const category = await getPrisma().category.update({
      where: {
        id: Number(id),
      },
      data,
    })
    return category
  })
)

app.delete(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const category = await getPrisma().category.delete({
      where: {
        id: Number(id),
      },
    })
    return category
  })
)

export default app
