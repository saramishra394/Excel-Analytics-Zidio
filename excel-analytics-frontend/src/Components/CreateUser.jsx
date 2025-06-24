import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import adminService from "../Services/AdminService"
import { useNavigate } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"

const CreateUser = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const res = await adminService.createUser(data)
      if (res) {
        toast.success("User created successfully")
        reset()
        setTimeout(() => navigate("/adminDashboard"), 1000)
      } else {
        toast.error("Error creating user")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 mb-2 justify-center">
          <div className="bg-gradient-to-r from-sky-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <FaUserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 text-center">
            Create User
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
              placeholder="Enter username"
            />
            {errors.username && <p className="text-rose-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-md"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              {...register("role")}
              defaultValue="user"
              className="w-full p-3 rounded-2xl border-2 border-indigo-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-medium shadow-xl transform transition hover:scale-105 hover:shadow-2xl ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateUser
