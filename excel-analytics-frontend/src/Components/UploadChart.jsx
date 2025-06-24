import React, { useState } from "react"
import * as XLSX from "xlsx"
import service from "../Services/Services.js"
import { toast } from "react-toastify"
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js"
import { useNavigate } from "react-router-dom"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale
)

const UploadChart = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [chartType, setChartType] = useState("bar")
  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const binaryStr = evt.target.result
      const workbook = XLSX.read(binaryStr, { type: "binary" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet)

      if (rows.length === 0) {
        toast.error("Excel file is empty")
        return
      }

      const extractedLabels = Object.keys(rows[0])
      const extractedValues = rows.map((row) =>
        extractedLabels.map((label) => row[label] ?? null)
      )

      setLabels(extractedLabels)
      setValues(extractedValues)
    }
    reader.readAsBinaryString(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title || !chartType) {
      return toast.error("All fields are required")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("chartType", chartType)

    const result = await service.uploadChart(formData)
    if (result) {
      toast.success("Chart uploaded successfully")
      navigate(`/analyzeChart/${result}`)
    }
  }

  const getDarkColor = () => {
    const r = Math.floor(Math.random() * 128)
    const g = Math.floor(Math.random() * 128)
    const b = Math.floor(Math.random() * 128)
    return `rgba(${r}, ${g}, ${b}, 0.8)`
  }

  const renderChart = () => {
    if (!labels.length || !values.length) return null

    const dataset = {
      labels,
      datasets: values.map((valueSet, idx) => ({
        label: `Row ${idx + 1}`,
        data: valueSet.map((v) => (typeof v === "number" ? v : parseFloat(v)) || 0),
        backgroundColor: getDarkColor(),
        borderColor: getDarkColor(),
        borderWidth: 1,
      })),
    }

    switch (chartType) {
      case "bar":
        return <Bar data={dataset} />
      case "line":
        return <Line data={dataset} />
      case "pie":
        return (
          <Pie
            data={{
              labels,
              datasets: [
                {
                  label: title,
                  data: values[0],
                  backgroundColor: labels.map(() => getDarkColor()),
                },
              ],
            }}
          />
        )
      case "doughnut":
        return (
          <Doughnut
            data={{
              labels,
              datasets: [
                {
                  label: title,
                  data: values[0],
                  backgroundColor: labels.map(() => getDarkColor()),
                },
              ],
            }}
          />
        )
      case "radar":
        return <Radar data={dataset} />
      case "polarArea":
        return (
          <PolarArea
            data={{
              labels,
              datasets: [
                {
                  label: title,
                  data: values[0],
                  backgroundColor: labels.map(() => getDarkColor()),
                },
              ],
            }}
          />
        )
      case "scatter":
        return (
          <Scatter
            data={{
              datasets: [
                {
                  label: title,
                  data: values[0].map((y, x) => ({ x, y })),
                  backgroundColor: getDarkColor(),
                },
              ],
            }}
          />
        )
      case "bubble":
        return (
          <Bubble
            data={{
              datasets: [
                {
                  label: title,
                  data: values[0].map((r, x) => ({ x, y: r, r: 10 })),
                  backgroundColor: getDarkColor(),
                },
              ],
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">Upload Excel Chart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow border border-slate-200 space-y-3 text-sm">
          <h2 className="font-semibold mb-1 text-base">Upload Options</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full text-sm"
              required
            />
            <input
              type="text"
              placeholder="Chart title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              required
            />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="bar">Bar chart</option>
              <option value="line">Line chart</option>
              <option value="pie">Pie chart</option>
              <option value="doughnut">Doughnut chart</option>
              <option value="radar">Radar chart</option>
              <option value="polarArea">Polar area chart</option>
              <option value="scatter">Scatter chart</option>
              <option value="bubble">Bubble chart</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 text-white w-full p-2 text-sm rounded hover:bg-indigo-700"
            >
              Upload
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-slate-200 text-sm flex flex-col">
          <h2 className="font-semibold mb-1 text-base">Chart Preview</h2>
          <div className="flex-1 min-h-[300px] bg-slate-50 border border-slate-100 p-2 rounded flex items-center justify-center">
            {renderChart() || <p className="text-slate-400">No preview</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 text-sm overflow-x-auto">
        <h2 className="font-semibold mb-1 text-base">Data Preview</h2>
        {labels.length ? (
          <table className="min-w-full border border-slate-200 text-xs">
            <thead className="bg-slate-100 text-slate-700">
              <tr>{labels.map((label, i) => <th key={i} className="p-1 border border-slate-200">{label}</th>)}</tr>
            </thead>
            <tbody>
              {values.slice(0, 10).map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 ? "bg-slate-50" : ""}>
                  {row.map((cell, cIdx) => <td key={cIdx} className="p-1 border border-slate-200">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500">No data loaded</p>
        )}
      </div>
    </div>
  )
}

export default UploadChart
