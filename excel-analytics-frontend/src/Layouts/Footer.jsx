const Footer = () => {
  return (
    <footer className="bg-black text-white fixed bottom-0 left-0 w-full h-24 shadow-lg flex items-center z-50">
      <div className="max-w-7xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h1 className="text-xl font-bold mb-1">📊 ExcelAnalytics</h1>
          <p className="text-sm text-gray-400 max-w-md">
            Transform spreadsheets into stunning insights — effortless, powerful, and real-time.
          </p>
        </div>

        <div className="text-sm text-gray-400 text-center md:text-right mt-2 md:mt-0">
          &copy; {new Date().getFullYear()} ExcelAnalytics. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
