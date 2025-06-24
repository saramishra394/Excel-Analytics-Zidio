import { Router } from "express";
import generateInsights from "./GenAiControllers.js";


const genAI = Router()
genAI.post('/insights',generateInsights)

export default genAI