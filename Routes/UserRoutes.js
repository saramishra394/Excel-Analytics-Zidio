import express from 'express'
import { getCurrentUser, loginUser, logoutUser, registerUser, updateAccountDetails, userHistory } from '../Controllers/UserControllers.js'
import { protect } from '../Middlewares/Auth.js'

const userRouter = express.Router()


userRouter.post('/register',registerUser)

userRouter.post('/login',loginUser)
userRouter.patch('/update-account/:userId',protect ,updateAccountDetails)
userRouter.get('/currentUser', protect ,getCurrentUser)
userRouter.post('/logout',protect,logoutUser)
userRouter.get('/history/:userId',protect , userHistory)

export  {userRouter}