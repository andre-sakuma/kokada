import { NextFunction, Request, Response } from 'express'
import {} from '../../service/prisma'
import { verify } from 'jsonwebtoken'

export default async function auth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization'] as string

  if (!token) {
    next(new Error('No token provided.'))
    return
  }

  if (!token.startsWith('Bearer ')) {
    next(new Error('Invalid token.'))
    return
  }

  try {
    const user = verify(token.split(' ')[1], 'superSecretKey')
    req.user = user
    next()
  } catch (error) {
    next(new Error('Unauthorized'))
  }
}
