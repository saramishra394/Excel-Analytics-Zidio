import express from "express";
import { createUser , deleteUser, getAllUser, getSingleUserHistory, searchUser} from "../Controllers/AdminControllers.js";
import { checkAdmin } from "../Middlewares/Auth.js";


const adminRouter = express.Router()

adminRouter.post('/create-user',checkAdmin,createUser)
adminRouter.get('/get-allUser',checkAdmin,getAllUser)
adminRouter.delete('/delete-user',checkAdmin,deleteUser)
adminRouter.get('/get-user/:userId',checkAdmin,getSingleUserHistory)
adminRouter.get('searchUser',checkAdmin,searchUser)



export {adminRouter}