import * as express from 'express'
import * as cors from 'cors'
import { connect, disconnect } from './service/prisma'

import UserController from './controllers/user'
import QuestionController from './controllers/question'
import ValidationController from './controllers/validation'

import AuthMiddleware from './middlewares/auth'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/status', (req, res) => {
  res.send('alive')
})

app.use('/', ValidationController)

app.use('/user', AuthMiddleware, UserController)
app.use('/question', AuthMiddleware, QuestionController)

app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err,
  })
})

app.listen(3000, async () => {
  console.log('Connecting to database...')
  await connect()
  console.log('Connected to database')

  console.log('Server is listening on port 3000')
})

app.on('close', async () => {
  console.log('Disconnecting database...')
  await disconnect()
  console.log('Disconnected database')

  console.log('Server closed')
})

app.on('error', async (err) => {
  // await disconnect()
  console.log(err)
})
