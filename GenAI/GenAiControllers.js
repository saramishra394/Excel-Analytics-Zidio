import { Insights } from "../Models/AI_InsightsModel.js"
import genAI from "./GenAiConfig.js"

const generateInsights = async (req, res) => {
  try {
    const { chartTitle, data } = req.body
    const userId = req.user?._id

    if (!data || !data.raw || !chartTitle) {
      return res.status(400).json({
        success: false,
        message: "Missing chartTitle or raw chart data"
      })
    }

    const rowsToAnalyze = data.raw.slice(0, 20)

    const prompt = `
You are a business analyst.
Here is the chart titled: "${chartTitle}".

Below are sample data records:

${rowsToAnalyze.map((row, i) => `Record ${i + 1}: ${JSON.stringify(row)}`).join("\n")}

Please analyze these records and provide:
- General patterns or trends in the data
- Notable values or anomalies
- Possible insights about the dataset
- Suggested chart types that could best represent this data
- Actionable recommendations or observations

Respond in 4–6 lines.
`

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const insight = response.text().trim()

    await Insights.create({
      userId:userId,
      insights:insight
    })
    return res.status(200).json({
      success: true,
      message: "Insight fetched successfully",
      data: insight
    })

  } catch (error) {
    console.error("Gemini Insight Error:", error)
    return res.status(500).json({
      success: false,
      message: "Gemini AI insight generation failed"
    })
  }
}

export default generateInsights
