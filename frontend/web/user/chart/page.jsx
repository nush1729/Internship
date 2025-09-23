"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Share2, CuboidIcon as Cube, Settings, Save } from "lucide-react"
import toast from "react-hot-toast"

// Define color themes for chart customization (copied from ChartCreationDialog)
const colorThemes = [
  {
    name: "Default",
    colors: ["#00FFFF", "#66D9EF", "#FF6B6B", "#FFD700", "#8B5CF6"], // Greenish-cyan as primary
  },
  {
    name: "Ocean",
    colors: ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"],
  },
  {
    name: "Forest",
    colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"],
  },
  {
    name: "Sunset",
    colors: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c"],
  },
  {
    name: "Purple",
    colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"],
  },
  {
    name: "Yellow",
    colors: ["#f1c40f", "#f39c12", "#e67e22", "#d35400", "#c0392b"],
  },
]

const fontFamilies = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Lucida Console",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "sans-serif",
  "serif",
  "monospace",
]

export default function ChartPage() {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const plotlyInstance = useRef(null)

  const [chartConfig, setChartConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCustomization, setShowCustomization] = useState(false)

  // States for customizable properties
  const [currentChartTitle, setCurrentChartTitle] = useState("")
  const [currentSelectedTheme, setCurrentSelectedTheme] = useState("Default")
  const [currentShowLegend, setCurrentShowLegend] = useState(true)
  const [currentShowGrid, setCurrentShowGrid] = useState(true)
  const [currentPlotBgColor, setCurrentPlotBgColor] = useState("#1C1C1C") // Dark background
  const [currentPaperBgColor, setCurrentPaperBgColor] = useState("#1C1C1C") // Dark background
  const [currentFontColor, setCurrentFontColor] = useState("#E0E0E0") // Soft white
  const [currentGlobalFontSize, setCurrentGlobalFontSize] = useState(14) // New global font size
  const [currentGlobalFontFamily, setCurrentGlobalFontFamily] = useState("Roboto") // New global font family
  const [currentLegendFontSize, setCurrentLegendFontSize] = useState(12)
  const [currentLegendFontColor, setCurrentLegendFontColor] = useState("#E0E0E0")
  const [currentLegendFontFamily, setCurrentLegendFontFamily] = useState("Roboto")
  const [currentXAxisLabelFontSize, setCurrentXAxisLabelFontSize] = useState(12)
  const [currentXAxisLabelFontColor, setCurrentXAxisLabelFontColor] = useState("#E0E0E0")
  const [currentXAxisLabelFontFamily, setCurrentXAxisLabelFontFamily] = useState("Roboto")
  const [currentYAxisLabelFontSize, setCurrentYAxisLabelFontSize] = useState(12)
  const [currentYAxisLabelFontColor, setCurrentYAxisLabelFontColor] = useState("#E0E0E0")
  const [currentYAxisLabelFontFamily, setCurrentYAxisLabelFontFamily] = useState("Roboto")
  const [currentZAxisLabelFontSize, setCurrentZAxisLabelFontSize] = useState(12)
  const [currentZAxisLabelFontColor, setCurrentZAxisLabelFontColor] = useState("#E0E0E0")
  const [currentZAxisLabelFontFamily, setCurrentZAxisLabelFontFamily] = useState("Roboto")

  const { id } = useParams()
  const chartId = id

  // Load chart config from localStorage and initialize customization states
  useEffect(() => {
    if (!chartId) {
      setError("No chart ID provided")
      setLoading(false)
      return
    }

    try {
      const config = localStorage.getItem(`chartConfig_${chartId}`)
      if (!config) {
        setError("Chart configuration not found")
        setLoading(false)
        return
      }

      const parsedConfig = JSON.parse(config)
      setChartConfig(parsedConfig)

      // Initialize customization states from loaded config
      setCurrentChartTitle(parsedConfig.chartTitle || "")
      setCurrentSelectedTheme(parsedConfig.selectedTheme || "Default")
      setCurrentShowLegend(parsedConfig.showLegend !== undefined ? parsedConfig.showLegend : true)
      setCurrentShowGrid(parsedConfig.showGrid !== undefined ? parsedConfig.showGrid : true)
      setCurrentPlotBgColor(parsedConfig.plotBgColor || "#1C1C1C")
      setCurrentPaperBgColor(parsedConfig.paperBgColor || "#1C1C1C")
      setCurrentFontColor(parsedConfig.fontColor || "#E0E0E0") // Softer default
      setCurrentGlobalFontSize(parsedConfig.globalFontSize || 14)
      setCurrentGlobalFontFamily(parsedConfig.globalFontFamily || "Roboto")
      setCurrentLegendFontSize(parsedConfig.legendFontSize || 12)
      setCurrentLegendFontColor(parsedConfig.legendFontColor || "#E0E0E0")
      setCurrentLegendFontFamily(parsedConfig.legendFontFamily || "Roboto")
      setCurrentXAxisLabelFontSize(parsedConfig.xAxisLabelFontSize || 12)
      setCurrentXAxisLabelFontColor(parsedConfig.xAxisLabelFontColor || "#E0E0E0")
      setCurrentXAxisLabelFontFamily(parsedConfig.xAxisLabelFontFamily || "Roboto")
      setCurrentYAxisLabelFontSize(parsedConfig.yAxisLabelFontSize || 12)
      setCurrentYAxisLabelFontColor(parsedConfig.yAxisLabelFontColor || "#E0E0E0")
      setCurrentYAxisLabelFontFamily(parsedConfig.yAxisLabelFontFamily || "Roboto")
      if (parsedConfig.is3D) {
        setCurrentZAxisLabelFontSize(parsedConfig.zAxisLabelFontSize || 12)
        setCurrentZAxisLabelFontColor(parsedConfig.zAxisLabelFontColor || "#E0E0E0")
        setCurrentZAxisLabelFontFamily(parsedConfig.zAxisLabelFontFamily || "Roboto")
      }

      setLoading(false)
    } catch (err) {
      console.error("Error loading chart config:", err)
      setError("Failed to load chart configuration")
      setLoading(false)
    }
  }, [chartId])

  // Render/re-render chart when config or customization states change
  useEffect(() => {
    if (chartConfig && chartRef.current) {
      renderChart()
    }
    return () => {
      if (plotlyInstance.current && chartRef.current) {
        try {
          window.Plotly?.purge(chartRef.current)
        } catch (e) {
          console.log("Plotly cleanup error:", e)
        }
        plotlyInstance.current = null
      }
    }
  }, [
    chartConfig,
    currentChartTitle,
    currentSelectedTheme,
    currentShowLegend,
    currentShowGrid,
    currentPlotBgColor,
    currentPaperBgColor,
    currentFontColor,
    currentGlobalFontSize,
    currentGlobalFontFamily,
    currentLegendFontSize,
    currentLegendFontColor,
    currentLegendFontFamily,
    currentXAxisLabelFontSize,
    currentXAxisLabelFontColor,
    currentXAxisLabelFontFamily,
    currentYAxisLabelFontSize,
    currentYAxisLabelFontColor,
    currentYAxisLabelFontFamily,
    currentZAxisLabelFontSize,
    currentZAxisLabelFontColor,
    currentZAxisLabelFontFamily,
  ])

  const renderChart = async () => {
    if (!chartRef.current || !chartConfig) return

    // Load Plotly dynamically
    if (!window.Plotly) {
      try {
        const Plotly = await import("plotly.js-dist")
        window.Plotly = Plotly.default
      } catch (error) {
        console.error("Failed to load Plotly:", error)
        setError("Failed to load chart library")
        return
      }
    }

    try {
      const { type, xData, yData, zData, xAxis, yAxis, zAxis, is3D } = chartConfig

      const themeColors = colorThemes.find((t) => t.name === currentSelectedTheme)?.colors || colorThemes[0].colors
      const primaryColor = themeColors[0]

      let plotData = []
      let layout = {
        title: {
          text: currentChartTitle,
          font: {
            color: currentFontColor,
            size: currentGlobalFontSize,
            family: currentGlobalFontFamily,
          },
        },
        showlegend: currentShowLegend,
        margin: { l: 60, r: 60, b: 60, t: 80, pad: 4 },
        paper_bgcolor: currentPaperBgColor,
        plot_bgcolor: currentPlotBgColor,
        font: {
          color: currentFontColor,
          size: currentGlobalFontSize,
          family: currentGlobalFontFamily,
        },
        legend: {
          font: {
            size: currentLegendFontSize,
            color: currentLegendFontColor,
            family: currentLegendFontFamily,
          },
        },
        colorway: themeColors, // Use the selected theme colors
      }

      // Configure chart based on type
      if (is3D) {
        // 3D chart configuration
        switch (type) {
          case "bar3d":
          case "scatter3d":
            plotData = [
              {
                type: "scatter3d",
                mode: type === "bar3d" ? "markers" : "markers",
                x: xData,
                y: yData,
                z: zData,
                marker: {
                  size: type === "bar3d" ? 8 : 6,
                  color: primaryColor,
                  opacity: 0.8,
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
                },
                name: `${yAxis} vs ${xAxis} vs ${zAxis}`,
              },
            ]
            break
          case "surface3d":
            // For surface plots, organize data into a grid
            const uniqueX = [...new Set(xData)].sort((a, b) => a - b)
            const uniqueY = [...new Set(yData)].sort((a, b) => a - b)

            const zValues = Array(uniqueY.length)
              .fill()
              .map(() => Array(uniqueX.length).fill(0))

            xData.forEach((x, index) => {
              const y = yData[index]
              const z = zData[index]
              const xIndex = uniqueX.indexOf(x)
              const yIndex = uniqueY.indexOf(y)
              if (xIndex >= 0 && yIndex >= 0) {
                zValues[yIndex][xIndex] = z
              }
            })

            plotData = [
              {
                type: "surface",
                x: uniqueX,
                y: uniqueY,
                z: zValues,
                colorscale: [
                  [0, currentPlotBgColor], // Use plot background for lowest color
                  [0.5, themeColors[1] || "#777777"],
                  [1, primaryColor],
                ],
                name: `${zAxis} by ${xAxis} and ${yAxis}`,
              },
            ]
            break
        }
        // 3D layout settings
        layout = {
          ...layout,
          scene: {
            xaxis: {
              title: xAxis,
              showgrid: currentShowGrid,
              gridcolor: "#333333", // Darker gray grid
              linecolor: "#444444",
              zerolinecolor: "#555555",
              font: {
                size: currentXAxisLabelFontSize,
                color: currentXAxisLabelFontColor,
                family: currentXAxisLabelFontFamily,
              },
            },
            yaxis: {
              title: yAxis,
              showgrid: currentShowGrid,
              gridcolor: "#333333",
              linecolor: "#444444",
              zerolinecolor: "#555555",
              font: {
                size: currentYAxisLabelFontSize,
                color: currentYAxisLabelFontColor,
                family: currentYAxisLabelFontFamily,
              },
            },
            zaxis: {
              title: zAxis,
              showgrid: currentShowGrid,
              gridcolor: "#333333",
              linecolor: "#444444",
              zerolinecolor: "#555555",
              font: {
                size: currentZAxisLabelFontSize,
                color: currentZAxisLabelFontColor,
                family: currentZAxisLabelFontFamily,
              },
            },
          },
        }
      } else {
        // 2D chart configuration
        switch (type) {
          case "bar":
            plotData = [
              {
                type: "bar",
                x: xData,
                y: yData,
                marker: {
                  color: primaryColor,
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
                },
                name: yAxis,
              },
            ]
            break
          case "line":
            plotData = [
              {
                type: "scatter",
                mode: "lines+markers",
                x: xData,
                y: yData,
                line: {
                  color: primaryColor,
                  width: 3,
                },
                marker: {
                  color: themeColors[1] || primaryColor,
                  size: 8,
                },
                name: yAxis,
              },
            ]
            break
          case "pie":
            plotData = [
              {
                type: "pie",
                labels: xData,
                values: yData,
                marker: { colors: themeColors },
                textinfo: "label+percent",
                textfont: {
                  color: "#ffffff", // White text for better contrast on colored pie slices
                  family: currentGlobalFontFamily,
                  size: currentGlobalFontSize,
                },
                name: yAxis,
              },
            ]
            break
          case "area":
            plotData = [
              {
                type: "scatter",
                mode: "lines",
                x: xData,
                y: yData,
                fill: "tozeroy",
                fillcolor: `${primaryColor}33`, // Add transparency
                line: {
                  color: primaryColor,
                  width: 3,
                },
                name: yAxis,
              },
            ]
            break
          case "scatter":
            plotData = [
              {
                type: "scatter",
                mode: "markers",
                x: xData,
                y: yData,
                marker: {
                  color: primaryColor,
                  size: 10,
                  line: {
                    color: themeColors[1] || primaryColor,
                    width: 1,
                  },
                },
                name: yAxis,
              },
            ]
            break
        }
        // 2D layout settings
        if (type !== "pie") {
          layout = {
            ...layout,
            xaxis: {
              title: xAxis,
              showgrid: currentShowGrid,
              gridcolor: "#333333",
              linecolor: "#444444",
              zerolinecolor: "#555555",
              font: {
                size: currentXAxisLabelFontSize,
                color: currentXAxisLabelFontColor,
                family: currentXAxisLabelFontFamily,
              },
            },
            yaxis: {
              title: yAxis,
              showgrid: currentShowGrid,
              gridcolor: "#333333",
              linecolor: "#444444",
              zerolinecolor: "#555555",
              font: {
                size: currentYAxisLabelFontSize,
                color: currentYAxisLabelFontColor,
                family: currentYAxisLabelFontFamily,
              },
            },
          }
        }
      }

      // Use Plotly.react for updates, or newPlot for initial render
      if (plotlyInstance.current) {
        await window.Plotly.react(chartRef.current, plotData, layout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
          modeBarStyle: {
            color: currentFontColor,
            backgroundColor: currentPlotBgColor,
          },
        })
      } else {
        await window.Plotly.newPlot(chartRef.current, plotData, layout, {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
          modeBarStyle: {
            color: currentFontColor,
            backgroundColor: currentPlotBgColor,
          },
        })
        plotlyInstance.current = true
      }
    } catch (err) {
      console.error("Error rendering chart:", err)
      setError("Failed to render chart")
    }
  }

  const downloadChart = async () => {
    if (plotlyInstance.current && chartRef.current) {
      try {
        const imgData = await window.Plotly.toImage(chartRef.current, {
          format: "png",
          width: 1200,
          height: 800,
        })
        const link = document.createElement("a")
        link.download = `${currentChartTitle || "chart"}.png`
        link.href = imgData
        link.click()
        toast.success("Chart downloaded successfully!")
      } catch (err) {
        console.error("Error downloading chart:", err)
        toast.error("Failed to download chart")
      }
    }
  }

  const shareChart = () => {
    const shareUrl = `${window.location.origin}/chart/${chartId}`
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Chart link copied to clipboard!")
      })
      .catch(() => {
        toast.error("Failed to copy link")
      })
  }

  const saveCustomization = () => {
    if (!chartConfig) return

    const updatedConfig = {
      ...chartConfig,
      chartTitle: currentChartTitle,
      selectedTheme: currentSelectedTheme,
      showLegend: currentShowLegend,
      showGrid: currentShowGrid,
      plotBgColor: currentPlotBgColor,
      paperBgColor: currentPaperBgColor,
      fontColor: currentFontColor,
      globalFontSize: currentGlobalFontSize,
      globalFontFamily: currentGlobalFontFamily,
      legendFontSize: currentLegendFontSize,
      legendFontColor: currentLegendFontColor,
      legendFontFamily: currentLegendFontFamily,
      xAxisLabelFontSize: currentXAxisLabelFontSize,
      xAxisLabelFontColor: currentXAxisLabelFontColor,
      xAxisLabelFontFamily: currentXAxisLabelFontFamily,
      yAxisLabelFontSize: currentYAxisLabelFontSize,
      yAxisLabelFontColor: currentYAxisLabelFontColor,
      yAxisLabelFontFamily: currentYAxisLabelFontFamily,
      zAxisLabelFontSize: chartConfig.is3D ? currentZAxisLabelFontSize : null,
      zAxisLabelFontColor: chartConfig.is3D ? currentZAxisLabelFontColor : null,
      zAxisLabelFontFamily: chartConfig.is3D ? currentZAxisLabelFontFamily : null,
    }

    localStorage.setItem(`chartConfig_${chartId}`, JSON.stringify(updatedConfig))
    toast.success("Chart customizations saved!")
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1C1C1C" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
              <p style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(3, 218, 198, 0.7)" }}>Loading your chart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1C1C1C" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(3, 218, 198, 0.7)" }}
            >
              Error
            </h1>
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-transparent hover:bg-[#00FFFF] text-[#00FFFF] hover:text-black border border-[#00FFFF]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!chartConfig) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#1C1C1C" }}>
        <div className="container mx-auto py-10 px-4">
          <div className="text-center">
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: "#00FFFF", textShadow: "0 0 5px rgba(3, 218, 198, 0.7)" }}
            >
              Chart not found
            </h1>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-transparent hover:bg-[#00FFFF] text-[#00FFFF] hover:text-black border border-[#00FFFF]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#1C1C1C" }}>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto border-[#00FFFF] text-[#00FFFF] hover:bg-[#1C1C1C] hover:border-[#66D9EF] bg-transparent"
            style={{ borderColor: "#00FFFF", color: "#00FFFF" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={downloadChart}
              className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#1C1C1C] hover:border-[#66D9EF] bg-transparent"
              style={{ borderColor: "#00FFFF", color: "#00FFFF" }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={shareChart}
              className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#1C1C1C] hover:border-[#66D9EF] bg-transparent"
              style={{ borderColor: "#00FFFF", color: "#00FFFF" }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCustomization(!showCustomization)}
              className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#1C1C1C] hover:border-[#66D9EF] bg-transparent"
              style={{ borderColor: "#00FFFF", color: "#00FFFF" }}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showCustomization ? "Hide" : "Customize"}
            </Button>
          </div>
        </div>

        <div className={`grid ${showCustomization ? "grid-cols-1 lg:grid-cols-3 gap-6" : "grid-cols-1"}`}>
          {showCustomization && (
            <Card
              className="lg:col-span-1 text-white border border-[#333333] rounded-xl py-4 px-6 relative overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto"
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.8)", // Slightly transparent dark gray
                borderColor: "#00FFFF", // Primary accent border
                boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)", // Primary accent shadow
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-[#00FFFF]">
                  <Settings className="h-5 w-5" />
                  Chart Customization
                </CardTitle>
                <CardDescription className="text-[#66D9EF]">
                  Adjust the appearance of your chart in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chart-title" className="text-sm text-[#66D9EF]">
                      Chart Title
                    </Label>
                    <Input
                      id="chart-title"
                      value={currentChartTitle}
                      onChange={(e) => setCurrentChartTitle(e.target.value)}
                      placeholder="Enter chart title"
                      className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-theme" className="text-sm text-[#66D9EF]">
                      Color Theme
                    </Label>
                    <Select value={currentSelectedTheme} onValueChange={setCurrentSelectedTheme}>
                      <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                        {colorThemes.map((theme) => (
                          <SelectItem key={theme.name} value={theme.name}>
                            <div className="flex items-center gap-2">
                              <span>{theme.name}</span>
                              <div className="flex gap-1">
                                {theme.colors.slice(0, 3).map((color, idx) => (
                                  <div key={idx} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                ))}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legend-toggle" className="text-sm text-[#66D9EF]">
                      Show Legend
                    </Label>
                    <Switch id="legend-toggle" checked={currentShowLegend} onCheckedChange={setCurrentShowLegend} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-toggle" className="text-sm text-[#66D9EF]">
                      Show Grid Lines
                    </Label>
                    <Switch id="grid-toggle" checked={currentShowGrid} onCheckedChange={setCurrentShowGrid} />
                  </div>
                </div>

                <Separator className="my-4 bg-[#333333]" />

                {/* Background & Global Font Colors */}
                <h5 className="text-md font-medium text-[#00FFFF]">Background & Global Colors</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plot-bg-color" className="text-sm text-[#66D9EF]">
                      Plot Background
                    </Label>
                    <Input
                      id="plot-bg-color"
                      type="color"
                      value={currentPlotBgColor}
                      onChange={(e) => setCurrentPlotBgColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paper-bg-color" className="text-sm text-[#66D9EF]">
                      Paper Background
                    </Label>
                    <Input
                      id="paper-bg-color"
                      type="color"
                      value={currentPaperBgColor}
                      onChange={(e) => setCurrentPaperBgColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-color" className="text-sm text-[#66D9EF]">
                      Global Font Color
                    </Label>
                    <Input
                      id="font-color"
                      type="color"
                      value={currentFontColor}
                      onChange={(e) => setCurrentFontColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="global-font-size" className="text-sm text-[#66D9EF]">
                      Global Font Size
                    </Label>
                    <Input
                      id="global-font-size"
                      type="number"
                      value={currentGlobalFontSize}
                      onChange={(e) => setCurrentGlobalFontSize(Number(e.target.value))}
                      min="8"
                      max="32"
                      className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-font-family" className="text-sm text-[#66D9EF]">
                      Global Font Family
                    </Label>
                    <Select value={currentGlobalFontFamily} onValueChange={setCurrentGlobalFontFamily}>
                      <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4 bg-[#333333]" />

                {/* Font Customization */}
                <h5 className="text-md font-medium text-[#00FFFF]">Legend Font</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="legend-font-size" className="text-sm text-[#66D9EF]">
                      Size
                    </Label>
                    <Input
                      id="legend-font-size"
                      type="number"
                      value={currentLegendFontSize}
                      onChange={(e) => setCurrentLegendFontSize(Number(e.target.value))}
                      min="8"
                      max="32"
                      className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legend-font-color" className="text-sm text-[#66D9EF]">
                      Color
                    </Label>
                    <Input
                      id="legend-font-color"
                      type="color"
                      value={currentLegendFontColor}
                      onChange={(e) => setCurrentLegendFontColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="legend-font-family" className="text-sm text-[#66D9EF]">
                      Font Family
                    </Label>
                    <Select value={currentLegendFontFamily} onValueChange={setCurrentLegendFontFamily}>
                      <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4 bg-[#333333]" />

                <h5 className="text-md font-medium text-[#00FFFF]">X-Axis Label Font</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="xaxis-font-size" className="text-sm text-[#66D9EF]">
                      Size
                    </Label>
                    <Input
                      id="xaxis-font-size"
                      type="number"
                      value={currentXAxisLabelFontSize}
                      onChange={(e) => setCurrentXAxisLabelFontSize(Number(e.target.value))}
                      min="8"
                      max="32"
                      className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="xaxis-font-color" className="text-sm text-[#66D9EF]">
                      Color
                    </Label>
                    <Input
                      id="xaxis-font-color"
                      type="color"
                      value={currentXAxisLabelFontColor}
                      onChange={(e) => setCurrentXAxisLabelFontColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="xaxis-font-family" className="text-sm text-[#66D9EF]">
                      Font Family
                    </Label>
                    <Select value={currentXAxisLabelFontFamily} onValueChange={setCurrentXAxisLabelFontFamily}>
                      <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4 bg-[#333333]" />

                <h5 className="text-md font-medium text-[#00FFFF]">Y-Axis Label Font</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yaxis-font-size" className="text-sm text-[#66D9EF]">
                      Size
                    </Label>
                    <Input
                      id="yaxis-font-size"
                      type="number"
                      value={currentYAxisLabelFontSize}
                      onChange={(e) => setCurrentYAxisLabelFontSize(Number(e.target.value))}
                      min="8"
                      max="32"
                      className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yaxis-font-color" className="text-sm text-[#66D9EF]">
                      Color
                    </Label>
                    <Input
                      id="yaxis-font-color"
                      type="color"
                      value={currentYAxisLabelFontColor}
                      onChange={(e) => setCurrentYAxisLabelFontColor(e.target.value)}
                      className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="yaxis-font-family" className="text-sm text-[#66D9EF]">
                      Font Family
                    </Label>
                    <Select value={currentYAxisLabelFontFamily} onValueChange={setCurrentYAxisLabelFontFamily}>
                      <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {chartConfig.is3D && (
                  <>
                    <Separator className="my-4 bg-[#333333]" />
                    <h5 className="text-md font-medium text-[#00FFFF]">Z-Axis Label Font</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zaxis-font-size" className="text-sm text-[#66D9EF]">
                          Size
                        </Label>
                        <Input
                          id="zaxis-font-size"
                          type="number"
                          value={currentZAxisLabelFontSize}
                          onChange={(e) => setCurrentZAxisLabelFontSize(Number(e.target.value))}
                          min="8"
                          max="32"
                          className="mt-1 border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zaxis-font-color" className="text-sm text-[#66D9EF]">
                          Color
                        </Label>
                        <Input
                          id="zaxis-font-color"
                          type="color"
                          value={currentZAxisLabelFontColor}
                          onChange={(e) => setCurrentZAxisLabelFontColor(e.target.value)}
                          className="mt-1 h-10 w-full border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] cursor-pointer p-0.5 rounded-md"
                        />
                      </div>
                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="zaxis-font-family" className="text-sm text-[#66D9EF]">
                          Font Family
                        </Label>
                        <Select value={currentZAxisLabelFontFamily} onValueChange={setCurrentZAxisLabelFontFamily}>
                          <SelectTrigger className="border-[#333333] bg-[#1C1C1C] text-[#E0E0E0] focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF]">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1C1C1C] border-[#333333] text-[#E0E0E0]">
                            {fontFamilies.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={saveCustomization}
                    className="flex items-center gap-2 bg-[#00FFFF] hover:bg-[#66D9EF] text-black"
                  >
                    <Save className="h-4 w-4" />
                    Save Customization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className={`${showCustomization ? "lg:col-span-2" : "col-span-1"} min-w-0`}>
            <Card
              style={{
                backgroundColor: "rgba(28, 28, 28, 0.8)",
                borderColor: "#00FFFF",
                boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)",
              }}
            >
              <CardHeader style={{ borderBottomColor: "rgba(3, 218, 198, 0.3)" }}>
                <CardTitle className="flex items-center gap-2" style={{ color: "#00FFFF" }}>
                  {chartConfig.is3D && <Cube className="h-5 w-5" style={{ color: "#00FFFF" }} />}
                  {currentChartTitle}
                </CardTitle>
                <CardDescription style={{ color: "rgba(102, 217, 239, 0.7)" }}>
                  Generated from {chartConfig.fileName} • {chartConfig.type} chart • {currentSelectedTheme} theme
                  {chartConfig.is3D && " • 3D Visualization"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full p-4">
                  <div ref={chartRef} className="w-full h-full"></div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.8)",
                  borderColor: "#00FFFF",
                  boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)",
                }}
              >
                <CardContent className="p-4">
                  <p style={{ color: "rgba(102, 217, 239, 0.7)", fontSize: "0.875rem" }}>Chart Type</p>
                  <p style={{ color: "#00FFFF", fontWeight: "600", textTransform: "capitalize" }}>{chartConfig.type}</p>
                </CardContent>
              </Card>
              <Card
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.8)",
                  borderColor: "#00FFFF",
                  boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)",
                }}
              >
                <CardContent className="p-4">
                  <p style={{ color: "rgba(102, 217, 239, 0.7)", fontSize: "0.875rem" }}>X-Axis</p>
                  <p style={{ color: "#00FFFF", fontWeight: "600" }}>{chartConfig.xAxis}</p>
                </CardContent>
              </Card>
              <Card
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.8)",
                  borderColor: "#00FFFF",
                  boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)",
                }}
              >
                <CardContent className="p-4">
                  <p style={{ color: "rgba(102, 217, 239, 0.7)", fontSize: "0.875rem" }}>Y-Axis</p>
                  <p style={{ color: "#00FFFF", fontWeight: "600" }}>{chartConfig.yAxis}</p>
                </CardContent>
              </Card>
              <Card
                style={{
                  backgroundColor: "rgba(28, 28, 28, 0.8)",
                  borderColor: "#00FFFF",
                  boxShadow: "0 0 10px rgba(3, 218, 198, 0.3)",
                }}
              >
                <CardContent className="p-4">
                  <p style={{ color: "rgba(102, 217, 239, 0.7)", fontSize: "0.875rem" }}>
                    {chartConfig.is3D ? "Z-Axis" : "Data Points"}
                  </p>
                  <p style={{ color: "#00FFFF", fontWeight: "600" }}>
                    {chartConfig.is3D ? chartConfig.zAxis : chartConfig.xData?.length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
