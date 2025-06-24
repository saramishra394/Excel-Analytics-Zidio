import { useEffect, useState, forwardRef } from "react"
import { useParams } from "react-router-dom"
import service from "../Services/Services"
import Chart3D from "./Chart3d"
import ChartDownloadWrapper from "./ChartDownloader"
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2"
import aiInsights from "../Services/AIService"
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

const chart2dComponents = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  scatter: Scatter,
  bubble: Bubble,
}

const AnalyzeChart = () => {
  const { chartId } = useParams()
  const [chartData, setChartData] = useState(null)
  const [analysisData, setAnalysisData] = useState([])
  const [viewMode, setViewMode] = useState("3d")
  const [chartType, setChartType] = useState("bar3d")
  const [chart2d, setChart2d] = useState(null)
  const [xColumn, setXColumn] = useState("")
  const [yColumn, setYColumn] = useState("")
  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState(null)
  const [loadingInsight, setLoadingInsight] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chartRes = await service.getChartData(chartId)
        setChartData(chartRes)
        const analysisRes = await service.analyzeChart(chartId)
        setAnalysisData(analysisRes || [])
        const chart2dRes = await service.getSingleChart(chartId)
        setChart2d(chart2dRes)
        const columns = chart2dRes?.data?.labels || []
        setXColumn(columns[0] || "")
        setYColumn(columns[1] || "")
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [chartId])

  useEffect(() => {
    const fetchInsight = async () => {
      if (chart2d?.title && chart2d?.data?.raw) {
        setLoadingInsight(true)
        try {
          const result = await aiInsights.insights(chart2d?.title, { raw: chart2d?.data?.raw })
          setInsight(result)
        } catch (error) {
          console.error(error)
        } finally {
          setLoadingInsight(false)
        }
      }
    }
    fetchInsight()
  }, [chart2d])

  const render2DChart = (ref) => {
    const ChartComponent = chart2dComponents[chartType] || Bar
    const raw = chart2d?.data?.raw || []
    if (!xColumn || !yColumn || raw.length === 0) {
      return <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"><p className="text-gray-500">Insufficient Data</p></div>
    }
    const xData = raw.map((row) => row[xColumn])
    const yData = raw.map((row) => Number(row[yColumn]))
    const chartData2D = { labels: xData, datasets: [{ label: `${yColumn} vs ${xColumn}`, data: yData, backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 }] }
    if (chartType === "scatter") {
      chartData2D.datasets = [{ label: `${yColumn} vs ${xColumn}`, data: yData.map((y, x) => ({ x, y })), backgroundColor: "rgba(75, 192, 192, 0.6)" }]
    } else if (chartType === "bubble") {
      chartData2D.datasets = [{ label: `${yColumn} vs ${xColumn}`, data: yData.map((r, x) => ({ x, y: r, r: 10 })), backgroundColor: "rgba(75, 192, 192, 0.6)" }]
    }
    const WrappedChart = forwardRef((props, ref) => <ChartComponent ref={ref} {...props} />)
    return <WrappedChart ref={ref} data={chartData2D} options={{ responsive: true }} />
  }

  const handleDownload = async () => {
    try {
      await service.downloads(chartId)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center"><p className="text-xl text-gray-500">Loading chart data...</p></div>
  }

  if (!chartData || !chart2d) {
    return <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center"><p className="text-xl text-red-500">No chart data available.</p></div>
  }

  const labelOptions = chart2d?.data?.labels || []
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Chart Analysis Dashboard</h1>
          <p className="text-gray-600">Interactive visualization and insights</p>
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="3d">🎯 3D View</option>
            <option value="2d">📊 2D View</option>
          </select>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="bg-white border-2 border-purple-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
            {viewMode === "3d" ? (
              <>
                <option value="bar3d">📊 3D Bar</option>
                <option value="line3d">📈 3D Line</option>
                <option value="scatter3d">✨ 3D Scatter</option>
                <option value="surface3d">🌄 3D Surface</option>
                <option value="heatmap3d">🔥 3D Heatmap</option>
              </>
            ) : (
              <>
                <option value="bar">📊 Bar</option>
                <option value="line">📈 Line</option>
                <option value="pie">🥧 Pie</option>
                <option value="doughnut">🍩 Doughnut</option>
                <option value="radar">🕸️ Radar</option>
                <option value="polarArea">🎯 PolarArea</option>
                <option value="scatter">✨ Scatter</option>
                <option value="bubble">🫧 Bubble</option>
              </>
            )}
          </select>
          {viewMode === "2d" && (
            <>
              <select value={xColumn} onChange={(e) => setXColumn(e.target.value)} className="bg-white border-2 border-emerald-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {labelOptions.map((label) => <option key={label} value={label}>{`X: ${label}`}</option>)}
              </select>
              <select value={yColumn} onChange={(e) => setYColumn(e.target.value)} className="bg-white border-2 border-rose-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500">
                {labelOptions.map((label) => <option key={label} value={label}>{`Y: ${label}`}</option>)}
              </select>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{viewMode === "3d" ? "3D Visualization" : "2D Chart View"}</h2>
            <ChartDownloadWrapper type={viewMode} canvasId="three-canvas" onDownload={handleDownload}>{(chartRef) => viewMode === "3d" ? <Chart3D chartType={chartType} x={chartData.x} y={chartData.y} z={chartData.z} /> : render2DChart(chartRef)}</ChartDownloadWrapper>
          </div>
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Statistical Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-left">
                    <th className="px-4 py-2">Label</th>
                    <th className="px-4 py-2">Min</th>
                    <th className="px-4 py-2">Max</th>
                    <th className="px-4 py-2">Avg</th>
                    <th className="px-4 py-2">Median</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.length ? analysisData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 font-medium">{row.label}</td>
                      <td className="px-4 py-2">{row.min ?? "—"}</td>
                      <td className="px-4 py-2">{row.max ?? "—"}</td>
                      <td className="px-4 py-2">{row.avg ?? "—"}</td>
                      <td className="px-4 py-2">{row.median ?? "—"}</td>
                    </tr>
                  )) : <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No analysis data.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Insights</h2>
          {loadingInsight ? <p className="text-center text-pink-500">Generating insights...</p> : insight ? <p className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-gray-800">{insight}</p> : <p className="text-center text-gray-500">No AI insights available.</p>}
        </div>
      </div>
    </div>
  )
}

export default AnalyzeChart
