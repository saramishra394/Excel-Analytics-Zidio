import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import adminService from "../Services/AdminService"
import { toast } from "react-toastify"
import { FaEye } from "react-icons/fa"

const GetUserHistory = () => {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await adminService.getSingleUser(userId)
        if (!res) {
          toast.error("This user has no chart history")
        } else {
          setUserData(res)
        }
      } catch {
        toast.error("Error fetching user history")
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [userId])

  const username = userData?.chartDetails?.[0]?.username || "Unknown User"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 space-y-8">

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 text-center">
          User Chart History
        </h1>
        <div className="flex items-center space-x-4 w-full max-w-md bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-r from-sky-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            <FaEye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-600">{username}</h2>
            <p className="text-sm text-gray-500">
              Total Charts: {userData?.totalCharts || 0} | Total Downloads: {userData?.downloadCount || 0}
            </p>
          </div>
        </div>
      </div>

      {userData?.chartDetails?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.chartDetails.map((chart, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg transform hover:scale-[1.01] hover:shadow-xl transition"
            >
              <h3 className="text-md font-medium text-gray-800 mb-1 truncate">{chart.title}</h3>
              <p className="text-xs text-gray-500">Type: {chart.chartType}</p>
              <p className="text-xs text-gray-400 mt-1">Created: {new Date(chart.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl flex flex-col items-center space-y-2 text-center">
          <FaEye className="w-10 h-10 text-indigo-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">No Chart History Found</h3>
          <p className="text-sm text-gray-500">This user hasn’t uploaded any charts yet.</p>
        </div>
      )}
    </div>
  )
}

export default GetUserHistory
