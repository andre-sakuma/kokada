import { NextFunction, Request, Response } from 'express'

export function funcWrapper(
  func: (req: Request & { user?: any }) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await func(req)
      if (response) {
        res.status(200)
        res.json(response)
      }
    } catch (err) {
      next(err)
    }
  }
}
