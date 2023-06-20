import * as express from 'express'
import * as cors from 'cors'
import { connect, disconnect } from './service/prisma'

import UserController from './controllers/user'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', UserController)

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err, 'asdasdasdasds')
  res.status(500)
  res.render('error', { error: err })
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
