import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import auth from "../Services/AuthService"
import { toast } from "react-toastify"

const Header = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await auth.getCurrentUser()
        if (!res) {
          toast.error("Something went wrong")
        } else {
          setUser(res)
        }
      } catch {
        toast.error("Can't find user")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const getInitials = (username) => {
    if (!username) return "?"
    return username.trim().split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  const handleLogout = () => {
    try {
      const res = auth.logout()
      if (!res) {
        toast.error("Something went wrong")
      } else {
        navigate("/")
      }
    } catch {
      toast.error("Please try again later")
    }
  }

  if (loading) {
    return (
      <header className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <span className="text-white">Loading header...</span>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Excel-Analytics</h1>
        </div>
        <div className="flex items-center space-x-6 relative">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium focus:outline-none text-base"
            >
              {getInitials(user.username)}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
