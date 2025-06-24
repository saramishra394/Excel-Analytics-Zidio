import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      {/* main content area */}
      <main className="flex-1 pt-16 pb-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
