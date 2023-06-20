import { Router } from 'express'
import { getPrisma } from '../../service/prisma'
import { funcWrapper } from '../../utils/funcWrapper'

const app = Router()

app.get(
  '/',
  funcWrapper(async (req) => {
    return req.user
  })
)

app.get(
  '/list',
  funcWrapper(async (req) => {
    const users = await getPrisma().user.findMany()
    return users
  })
)

app.post(
  '/',
  funcWrapper(async (req) => {
    const { name, email, password } = req.body
    const user = await getPrisma().user.create({
      data: {
        name,
        email,
        password,
      },
    })
    return user
  })
)

app.put(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const data = req.body
    const user = await getPrisma().user.update({
      where: {
        id: Number(id),
      },
      data,
    })
    return user
  })
)

app.delete(
  '/:id',
  funcWrapper(async (req) => {
    const { id } = req.params
    const user = await getPrisma().user.delete({
      where: {
        id: Number(id),
      },
    })
    return user
  })
)

export default app
