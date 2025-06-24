
import { useRef } from "react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const ChartDownloadWrapper = ({ type, canvasId = "chart-canvas", children, onDownload }) => {
  const chartRef = useRef()

  const handleDownload = async () => {
    try {
      if (type === "2d") {
        if (!chartRef.current || !chartRef.current.toBase64Image) {
          console.error("Chart ref or toBase64Image missing")
          return
        }
        const image = chartRef.current.toBase64Image()
        const link = document.createElement("a")
        link.href = image
        link.download = "chart.png"
        link.click()
      } else {
        const canvas = document.getElementById(canvasId)
        if (!canvas) {
          console.error("3D canvas not found")
          return
        }
        const snapshot = await html2canvas(canvas)
        const image = snapshot.toDataURL("image/png")
        const pdf = new jsPDF()
        pdf.addImage(image, "PNG", 10, 10, 190, 0)
        pdf.save("chart.pdf")
      }
      if (onDownload && typeof onDownload === "function") {
        await onDownload()
      }
    } catch (error) {
      console.error("Error downloading chart:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Download Chart
        </button>
      </div>
      <div id={canvasId}>
        {typeof children === "function" ? children(chartRef) : children}
      </div>
    </div>
  )
}

export default ChartDownloadWrapper
