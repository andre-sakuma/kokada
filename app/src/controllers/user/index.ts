import { Router } from 'express'
import { getPrisma } from '../../service/prisma'

const app = Router()

app.get('/', async (req, res) => {
  const users = await getPrisma().user.findMany()
  res.json(users)
})

app.post('/', async (req, res) => {
  const { name, email, password } = req.body
  const user = await getPrisma().user.create({
    data: {
      name,
      email,
      password,
    },
  })
  res.json(user)
})

app.put('/:id', async (req, res) => {
  const { id } = req.params
  const data = req.body
  const user = await getPrisma().user.update({
    where: {
      id: Number(id),
    },
    data,
  })
  res.json(user)
})

app.delete('/:id', async (req, res) => {
  const { id } = req.params
  const user = await getPrisma().user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(user)
})

export default app
