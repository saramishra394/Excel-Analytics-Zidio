import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import connectDB from "./Database/dbConnection.js"
import { userRouter } from "./Routes/UserRoutes.js"
import { adminRouter } from "./Routes/AdminRoutes.js"
import { checkAdmin, protect } from "./Middlewares/Auth.js"
import { fileRouter } from "./Routes/FileRoutes.js"
import genAI from "./GenAI/GenAiRoutes.js"

dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/admins', protect, checkAdmin, adminRouter)
app.use('/api/files', protect, fileRouter)
app.use('/api/AI-support',protect,genAI)

const startServer = async () => {
  try {
    await connectDB()
    
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
