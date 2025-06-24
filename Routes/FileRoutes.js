import express from 'express'
import upload from '../Middlewares/MulterConfig.js'
import { analyzeChart, getChart, getChartData, searchChart, uploadChart } from '../Controllers/FileControllers.js'
import { downloadCount } from '../Controllers/UserControllers.js'


const fileRouter = express.Router()

fileRouter.post('/uploadChart', upload.single('file'), uploadChart)
fileRouter.get('/getChartData/:chartId',getChart)
fileRouter.get('/analyzeChart/:chartId',analyzeChart)
fileRouter.get('/searchChart',searchChart)
fileRouter.get('/chartData/:chartId',getChartData)
fileRouter.post('/downloads',downloadCount)
  
export {fileRouter}