
import multer from 'multer'
import path from 'path'


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext === '.xls' || ext === '.xlsx') {
    cb(null, true)
  } else {
    cb(new Error('Only .xls or .xlsx files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // optional: limit file size to 5MB
})

export default upload
