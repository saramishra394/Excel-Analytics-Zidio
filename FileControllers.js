import XLSX from 'xlsx'

import fs from 'fs'
import { Chart } from '../Models/ChartModel.js'


const uploadChart = async (req, res) => {
  try {
    console.log("uploadChart is called")
    const filePath = req.file?.path
    const userId = req.user?._id
    const { title, chartType } = req.body

    if (!filePath || !userId || !title || !chartType) {
      return res.status(400).json({
        success: false,
        message: 'File, title, chartType and user are required'
      })
    }

    
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet)
    
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sheet is empty'
      })
    }

    
    const labels = Object.keys(rows[0])

    
    const values = labels.map(label => rows.map(row => row[label] ?? null))
    
    const chart = await Chart.create({
      user: userId,
      title,
      chartType,
      sheetName,
      data: {
        labels,
        values,
        raw:rows
      }
    })

    
    fs.unlinkSync(filePath)

    return res.status(200).json({
      success: true,
      message: 'Chart data saved successfully',
      data: chart._id
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}
  const getChart = async (req , res) => {
    try {
      const { chartId } = req.params
      if(!chartId){
        return res.status(400).json({
          success : false,
          message : "Please select a chart"
         })
      }

      const chart = await Chart.findById(chartId)
      if(!chart){
        return res.status(400).json({
          success : false,
          message : "Cant find chart"
        })
      }
    
      return res.status(200).json({
        success : true ,
        message : "Chart fetched successfull",
        data : chart
      })

    } catch (error) {
      return res.status(500).json({
        success : false,
        message : 'Server error',
        error : error.message
      })
    }
  }


   const analyzeChart = async (req, res) => {
  try {
    const { chartId } = req.params
    const chart = await Chart.findById(chartId)

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found"
      })
    }

    const { labels, values } = chart.data

    const analysis = labels.map((label, index) => {
      const colData = values.map(row => row[index]).filter(val => typeof val === 'number')

      if (colData.length === 0) return { label, message: "No numeric data" }

      const sum = colData.reduce((a, b) => a + b, 0)
      const avg = sum / colData.length
      const sorted = [...colData].sort((a, b) => a - b)
      const median = sorted[Math.floor(colData.length / 2)]
      const min = Math.min(...colData)
      const max = Math.max(...colData)

      return {
        label,
        min,
        max,
        avg: avg.toFixed(2),
        median
      }
    })
    console.log("Analyze chart working well =",analysis)
    return res.status(200).json({
      success: true,
      message: "Chart analyzed successfully",
      data: analysis
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}

 const getChartData = async (req, res) => {
  try {
    console.log("3d chart data called")
    const { chartId } = req.params
    const chart = await Chart.findById(chartId)

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found"
      })
    }

    const { labels, values } = chart.data
    console.log("Labels =", labels)
    console.log("Values =", values)

    const transpose = (array) =>
    array[0].map((_, colIndex) => array.map(row => row[colIndex]));

    
    const rowData = transpose(values)

    
    const columns = labels.map((_, colIndex) =>
      rowData.map(row => row[colIndex])
    )

    const parsedColumns = columns.map(col =>
      col.map(val => {
        const num = parseFloat(val)
        return isNaN(num) ? null : num
      })
    )

    const numericColumns = parsedColumns.filter(col =>
      col.every(val => val !== null)
    )

    const x = numericColumns[0] || []
    const y = numericColumns[1] || []
    const z = numericColumns[2] || []

    console.log("x, y, z:", x, y, z)

    return res.status(200).json({
      success: true,
      data: { x, y, z }
    })

  } catch (error) {
    console.error("Error in getChartData:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}


const searchChart = async (req , res) => {
  try {
    const search = req.query.search
    const userId = req.user?._id
    if(!search){
      return res.status(400).json({
        success:false,
        message:"Please write something to search"
      })
    }
    const query = {
      $user: userId,
      $or:[
        {title : {$regex : search , $options : "i"}},
        {chartType : {$regex : search , $options :"i"}}
      ]
    }

    const chart = await Chart.find( search ? query : {}).sort({ createdAt: -1 })
    if(chart.length === 0){
      return res.status(400).json({
        success:false,
        message:"Dont have any charts",
        
      })
    }
    return res.status(200).json({
      success:true,
      message:"Chart fetched successfully",
      data:chart
    })
  } catch (error) {
    return res.status(500).json({
      success:false,

    })
  }
}


export {uploadChart , getChart ,analyzeChart ,searchChart ,getChartData }