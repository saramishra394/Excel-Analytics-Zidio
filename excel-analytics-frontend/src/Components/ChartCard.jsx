import React, { useState } from "react"
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
  Bubble,
} from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
)

const chartComponents = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  scatter: Scatter,
  bubble: Bubble,
}

const getRandomColor = (opacity = 0.7) => {
  const r = Math.floor(50 + Math.random() * 205)
  const g = Math.floor(50 + Math.random() * 205)
  const b = Math.floor(50 + Math.random() * 205)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const ChartCard = ({ chart }) => {
  const { title, sheetName, createdAt, data } = chart
  const rawData = data.raw || []
  const availableColumns = data.labels || []
  const [chartType, setChartType] = useState(chart.chartType?.toLowerCase() || "bar")
  const [xColumn, setXColumn] = useState(availableColumns[0] || "")
  const [yColumn, setYColumn] = useState(availableColumns[1] || "")

  const ChartComponent = chartComponents[chartType] || Bar
  const xValues = rawData.map((row) => row[xColumn])
  const yValues = rawData.map((row) => Number(row[yColumn]))

  let datasets = [{ label: `${yColumn} vs ${xColumn}`, borderWidth: 1 }]

  if (chartType === "scatter") {
    datasets[0].data = yValues.map((y, index) => ({ x: index, y }))
    datasets[0].backgroundColor = datasets[0].data.map(() => getRandomColor(0.7))
    datasets[0].borderColor = datasets[0].data.map(() => getRandomColor(1))
  } else if (chartType === "bubble") {
    datasets[0].data = yValues.map((y, index) => ({ x: index, y, r: 8 }))
    datasets[0].backgroundColor = datasets[0].data.map(() => getRandomColor(0.7))
    datasets[0].borderColor = datasets[0].data.map(() => getRandomColor(1))
  } else {
    datasets[0].data = yValues
    datasets[0].backgroundColor = yValues.map(() => getRandomColor(0.7))
    datasets[0].borderColor = yValues.map(() => getRandomColor(1))
  }

  const chartData = { labels: xValues, datasets }

  const isRadial = chartType === "radar" || chartType === "polarArea"
  const isScatterOrBubble = chartType === "scatter" || chartType === "bubble"
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: !["pie", "doughnut", "polarArea"].includes(chartType),
      },
    },
    scales: isRadial
      ? {
          r: {
            pointLabels: { display: false },
            ticks: { backdropColor: "rgba(0,0,0,0)", stepSize: 50 },
            grid: { color: "rgba(200,200,200,0.2)" },
          },
        }
      : isScatterOrBubble
      ? {
          x: { title: { display: true, text: xColumn } },
          y: { title: { display: true, text: yColumn } },
        }
      : {
          x: { title: { display: true, text: xColumn } },
          y: { title: { display: true, text: yColumn } },
        },
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label className="text-sm font-medium">Chart Type:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border rounded p-1"
          >
            {Object.keys(chartComponents).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">X-Axis:</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full border rounded p-1"
          >
            {availableColumns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Y-Axis:</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full border rounded p-1"
          >
            {availableColumns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-64">
        <ChartComponent data={chartData} options={chartOptions} />
      </div>
      <div className="text-sm text-gray-500">
        Sheet: {sheetName} {createdAt && `| Created on ${new Date(createdAt).toLocaleDateString()}`}
      </div>
    </div>
  )
}

export default ChartCard
