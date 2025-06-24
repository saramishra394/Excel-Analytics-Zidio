import { createBrowserRouter } from "react-router-dom"
import Layout from "./Layouts/Layout"
import LoginForm from "./Components/Login"
import UploadChart from "./Components/UploadChart"
import ChartAnalysis from "./Components/AnalyzeChart"
import UserDashboard from "./Components/UserDashboard"
import AdminDashboard from "./Components/AdminDashboard"
import GetUserHistory from "./Components/UserHistory"
import CreateUser from "./Components/CreateUser"

const router = createBrowserRouter([
  { path: "/", element: <LoginForm /> },

  {
    element: <Layout />, 
    children: [
      { path: "/adminDashboard", element: <AdminDashboard /> },
      { path: "/dashboard", element: <UserDashboard /> },
      { path: "/uploadChart", element: <UploadChart /> },
      { path: "/analyzeChart/:chartId", element: <ChartAnalysis /> },
      { path: "/userHistory/:userId", element: <GetUserHistory /> },
      { path: "/createUser", element: <CreateUser /> },
    ],
  },
])

export default router
