import React, { useEffect, useState } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js"
import { toast } from "react-toastify"
import auth from "../Services/AuthService.js"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
)

const chartComponents = { bar: Bar, line: Line, pie: Pie }

const UserDashboard = () => {
  const [user, setUser] = useState({})
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadUserAndCharts = async () => {
      try {
        const res = await auth.getCurrentUser()
        if (!res || !res._id) {
          toast.error("Please login again")
          navigate("/login")
          return
        }
        setUser(res)
        const chartsRes = await auth.userHistory(res._id)
        if (!chartsRes || !Array.isArray(chartsRes)) {
          toast.error("No chart data found")
          return
        }
        setCharts(chartsRes)
      } catch (error) {
        toast.error("Error loading dashboard data")
      } finally {
        setLoading(false)
      }
    }
    loadUserAndCharts()
  }, [navigate])

  const filteredCharts = charts.filter((chart) => {
    const term = searchTerm.trim().toLowerCase()
    return (
      chart.title?.toLowerCase().includes(term) ||
      chart.chartType?.toLowerCase().includes(term) ||
      chart.sheetName?.toLowerCase().includes(term)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative w-20 h-20 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalDownloads = Array.isArray(user.downloads)
    ? user.downloads.reduce((acc, d) => acc + (d.count || 0), 0)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 space-y-8">

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center space-y-6 relative">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 text-center">
          Welcome {user.username || "User"}
        </h2>

        <div className="w-full max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search charts..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400">
            <FaSearch />
          </div>
        </div>

        <button
          onClick={() => navigate("/uploadChart")}
          className="px-6 py-3 mt-2 rounded-2xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium shadow-xl transform transition hover:scale-105 hover:shadow-2xl"
        >
          ➕ Upload Chart
        </button>

        <div className="absolute bottom-4 left-6 text-indigo-700 font-medium text-sm bg-indigo-100 px-3 py-1 rounded-xl shadow-sm">
          Uploaded Charts: {charts.length}
        </div>
        <div className="absolute bottom-4 right-6 text-purple-700 font-medium text-sm bg-purple-100 px-3 py-1 rounded-xl shadow-sm">
          Total Downloads: {totalDownloads}
        </div>
      </div>

      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
        📊 Your Charts History
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharts.map((chart, index) => {
          const ChartComponent = chartComponents[chart.chartType?.toLowerCase()] || Bar
          const chartData = {
            labels: chart.data.labels,
            datasets: chart.data.values.map((value, i) => {
              const opacity = Math.min(0.35 + i * 0.1, 0.9).toFixed(2)
              return Array.isArray(value)
                ? {
                    label: `Series ${i + 1}`,
                    data: value,
                    backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                    borderRadius: 8,
                  }
                : {
                    label: value.label || `Series ${i + 1}`,
                    data: value.data || [],
                    backgroundColor: value.backgroundColor || `rgba(139, 92, 246, ${opacity})`,
                    borderRadius: 8,
                  }
            }),
          }

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 8 },
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 8, padding: 8, font: { size: 10 } },
              },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 5, font: { size: 10 } },
                grid: { color: "#e5e7eb" },
              },
              y: {
                beginAtZero: true,
                ticks: { font: { size: 10 } },
                grid: { color: "#e5e7eb" },
              },
            },
          }

          return (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-2xl transform hover:scale-[1.03] hover:shadow-2xl transition duration-200 flex flex-col space-y-3"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">{chart.title}</h3>
                <div className="text-xs text-gray-500 flex flex-col">
                  <span>📁 {chart.sheetName}</span>
                  <span>📅 {new Date(chart.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex-grow bg-white p-2 rounded-xl border border-gray-100 shadow-inner">
                <ChartComponent data={chartData} options={chartOptions} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserDashboard
