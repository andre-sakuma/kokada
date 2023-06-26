import * as express from 'express'
import * as cors from 'cors'
import { connect, disconnect } from './service/prisma'

import UserController from './controllers/user'
import QuestionController from './controllers/question'
import CategoryController from './controllers/category'
import TestController from './controllers/test'
import UploadController from './controllers/upload'
import ValidationController from './controllers/validation'
import * as path from 'path'

import AuthMiddleware from './middlewares/auth'

const app = express()

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - started`)
  next()
})

app.get('/status', (req, res) => {
  res.send('alive')
})

app.use('/question', AuthMiddleware, QuestionController)
app.use('/category', AuthMiddleware, CategoryController)
app.use('/test', AuthMiddleware, TestController)
app.use('/user', AuthMiddleware, UserController)
app.use('/upload', AuthMiddleware, UploadController)
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params
  const fullfilepath = path.join(__dirname, '../uploads/' + filename)
  return res.sendFile(fullfilepath)
})
console.log(path.join(__dirname, './uploads'))
app.use('/', ValidationController)

app.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || 500
  console.error(`[${status}] ${req.method} ${req.url} - ${err.message}`)
  res.status(status)
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
