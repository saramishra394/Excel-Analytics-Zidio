import { useEffect, useState } from "react"
import admin from "../Services/AdminService"
import auth from "../Services/AuthService"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { FaSearch, FaTrash, FaEye, FaUserPlus } from "react-icons/fa"

const AdminDashboard = () => {
  const [allUser, setAllUser] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [adminData, setAdminData] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await admin.getAllUsers()
        setAllUser(res || [])
        setFilteredUsers(res || [])
        const currentAdmin = await auth.getCurrentUser()
        if (!currentAdmin) {
          toast.error("Please login")
          return navigate("/login")
        }
        setAdminData(currentAdmin)
      } catch {
        toast.error("Error fetching data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const handleDelete = async id => {
    if (!window.confirm("Delete this user?")) return
    try {
      await admin.deleteUser(id)
      toast.success("User deleted successfully")
      const updatedUsers = allUser.filter(u => u._id !== id)
      setAllUser(updatedUsers)
      setFilteredUsers(updatedUsers)
    } catch {
      toast.error("Error deleting user")
    }
  }

  const handleView = user => navigate(`/userHistory/${user._id}`)

  const handleSearch = e => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    setFilteredUsers(
      allUser.filter(
        u =>
          u.username?.toLowerCase().includes(value) ||
          u.email?.toLowerCase().includes(value)
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 space-y-8">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center space-y-6 relative">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 text-center">
          Welcome, {adminData.username}
        </h2>
        <div className="w-full max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="🔍 Search by username or email..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" />
        </div>
        <button
          onClick={() => navigate("/createUser")}
          className="px-6 py-3 mt-2 rounded-2xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium shadow-xl transform transition hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
        >
          <FaUserPlus />
          <span>Create User</span>
        </button>
        <div className="absolute bottom-4 left-6 text-indigo-700 text-sm bg-indigo-100 px-3 py-1 rounded-xl shadow-sm font-medium">
          Total Users: {filteredUsers.length}
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.length ? (
          filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between transform hover:scale-[1.01] hover:shadow-xl transition"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(user)}
                  className="bg-gradient-to-r from-sky-500 to-purple-600 text-white px-3 py-2 rounded-xl text-sm shadow-md flex items-center space-x-1 transform hover:scale-105 transition"
                >
                  <FaEye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-2 rounded-xl text-sm shadow-md flex items-center space-x-1 transform hover:scale-105 transition"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">No users found</div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
