import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import auth from "../Services/AuthService.js"
import { toast } from "react-toastify"

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let res

      if (isLogin) {
        res = await auth.login(data)
        if (!res) {
          toast.error("Login failed")
          return
        }
        toast.success("Logged in successfully")
      } else {
        res = await auth.register(data)
        if (!res) {
          toast.error("Signup failed")
          return
        }
        toast.success("Account created successfully")
      }

      setTimeout(() => {
        if (res.role === "admin") {
          navigate("/adminDashboard")
        } else {
          navigate("/dashboard")
        }
      }, 1000)

      reset()
    } catch (err) {
      toast.error("Something went wrong")
      console.error("Auth error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-rose-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium shadow-xl transform transition hover:scale-105 hover:shadow-2xl ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                reset()
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
