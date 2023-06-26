import { Router } from 'express'
import { funcWrapper } from '../../utils/funcWrapper'
import * as multer from 'multer'
import * as path from 'path'

const upload = multer({ dest: path.join(__dirname, '../../../uploads') })

const app = Router()

app.post(
  '/',
  upload.single('image'),
  funcWrapper(async (req) => {
    if (!req.file) {
      throw new Error('No file uploaded.')
    }

    return {
      url: `http://localhost:3000/uploads/${req.file.filename}`,
      file: req.file,
    }
  })
)

export default app
