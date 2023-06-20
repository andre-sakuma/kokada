import { Router } from 'express'
import { getPrisma } from '../../service/prisma'
import { funcWrapper } from '../../utils/funcWrapper'
import { sign } from 'jsonwebtoken'

const app = Router()

app.post(
  '/login',
  funcWrapper(async (req) => {
    const { password, email } = req.body
    const user = await getPrisma().user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.password !== password) {
      throw new Error('Unauthorized')
    }

    return sign(user, 'superSecretKey', { expiresIn: '1h' })
  })
)

export default app
