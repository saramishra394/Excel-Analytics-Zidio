import Plot from "react-plotly.js"

const Chart3D = ({ chartType = "bar3d", x = [], y = [], z = [] }) => {
  if (!x.length || !y.length || !z.length) {
    return <div className="text-gray-600 p-4">No chart data to display.</div>
  }

  const reshapeTo2D = (arr, rows, cols) => {
    const reshaped = []
    for (let i = 0; i < rows; i++) {
      reshaped.push(arr.slice(i * cols, i * cols + cols))
    }
    return reshaped
  }

  const total = z.length
  const cols = Math.ceil(Math.sqrt(total))
  const rows = Math.floor(total / cols)
  const reshapedZ = reshapeTo2D(z.slice(0, rows * cols), rows, cols)
  const xGrid = x.slice(0, cols)
  const yGrid = y.slice(0, rows)

  let plotData = []

  if (chartType === "line3d") {
    plotData = [
      {
        type: "scatter3d",
        mode: "lines+markers",
        x: x,
        y: y,
        z: z,
        marker: {
          size: 4,
          color: z,
          colorscale: "Viridis",
          opacity: 0.8,
        },
        line: {
          width: 4,
          color: z,
          colorscale: "Viridis",
        },
      },
    ]
  } else if (chartType === "scatter3d") {
    plotData = [
      {
        type: "scatter3d",
        mode: "markers",
        x: x,
        y: y,
        z: z,
        marker: {
          size: 5,
          color: z,
          colorscale: "Viridis",
          opacity: 0.8,
        },
      },
    ]
  } else if (chartType === "bar3d") {
    plotData = [
      {
        type: "mesh3d",
        x: x,
        y: y,
        z: z,
        intensity: z,
        colorscale: "Viridis",
        opacity: 0.9,
      },
    ]
  } else if (chartType === "surface3d") {
    plotData = [
      {
        type: "surface",
        x: xGrid,
        y: yGrid,
        z: reshapedZ,
        colorscale: "Viridis",
      },
    ]
  } else if (chartType === "heatmap3d") {
    plotData = [
      {
        type: "heatmap",
        x: xGrid,
        y: yGrid,
        z: reshapedZ,
        colorscale: "Viridis",
      },
    ]
  }

  return (
    <div id="three-canvas">
      <Plot
        data={plotData}
        layout={{
          title: `${chartType.toUpperCase()} Chart`,
          scene: {
            xaxis: { title: "X Axis" },
            yaxis: { title: "Y Axis" },
            zaxis: { title: "Z Axis" },
          },
          margin: { l: 40, r: 40, b: 40, t: 40 },
          height: 500,
        }}
        config={{ responsive: true }}
      />
    </div>
  )
}

export default Chart3D
