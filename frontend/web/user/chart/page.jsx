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

const colorThemes = [
  { name: "Default", colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"] },
  { name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"] },
  { name: "Forest", colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"] },
  { name: "Sunset", colors: ["#f59e0b", "#f97316", "#ef4444", "#dc2626", "#b91c1c"] },
  { name: "Purple", colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"] },
];

const fontFamilies = [
  "Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Georgia",
  "Times New Roman", "Courier New", "Lucida Console", "Roboto", "Open Sans",
  "Lato", "Montserrat", "sans-serif", "serif", "monospace",
];

export default function ChartPage() {
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const plotlyInstance = useRef(null)

  const [chartConfig, setChartConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCustomization, setShowCustomization] = useState(false)

  // Customizable properties
  const [currentChartTitle, setCurrentChartTitle] = useState("")
  const [currentSelectedTheme, setCurrentSelectedTheme] = useState("Default")
  const [currentShowLegend, setCurrentShowLegend] = useState(true)
  const [currentShowGrid, setCurrentShowGrid] = useState(true)
  const [currentPlotBgColor, setCurrentPlotBgColor] = useState("#f1f5f9") // Light Slate
  const [currentPaperBgColor, setCurrentPaperBgColor] = useState("#ffffff") // White
  const [currentFontColor, setCurrentFontColor] = useState("#334155") // Dark Slate
  const [currentGlobalFontSize, setCurrentGlobalFontSize] = useState(14)
  const [currentGlobalFontFamily, setCurrentGlobalFontFamily] = useState("Roboto")
  const [currentLegendFontSize, setCurrentLegendFontSize] = useState(12)
  const [currentLegendFontColor, setCurrentLegendFontColor] = useState("#475569")
  const [currentLegendFontFamily, setCurrentLegendFontFamily] = useState("Roboto")
  const [currentXAxisLabelFontSize, setCurrentXAxisLabelFontSize] = useState(12)
  const [currentXAxisLabelFontColor, setCurrentXAxisLabelFontColor] = useState("#475569")
  const [currentXAxisLabelFontFamily, setCurrentXAxisLabelFontFamily] = useState("Roboto")
  const [currentYAxisLabelFontSize, setCurrentYAxisLabelFontSize] = useState(12)
  const [currentYAxisLabelFontColor, setCurrentYAxisLabelFontColor] = useState("#475569")
  const [currentYAxisLabelFontFamily, setCurrentYAxisLabelFontFamily] = useState("Roboto")
  const [currentZAxisLabelFontSize, setCurrentZAxisLabelFontSize] = useState(12)
  const [currentZAxisLabelFontColor, setCurrentZAxisLabelFontColor] = useState("#475569")
  const [currentZAxisLabelFontFamily, setCurrentZAxisLabelFontFamily] = useState("Roboto")

  const { id } = useParams()
  const chartId = id

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
      // Initialize states from loaded config
      setCurrentChartTitle(parsedConfig.chartTitle || "")
      setCurrentSelectedTheme(parsedConfig.selectedTheme || "Default")
      setCurrentShowLegend(parsedConfig.showLegend !== undefined ? parsedConfig.showLegend : true)
      setCurrentShowGrid(parsedConfig.showGrid !== undefined ? parsedConfig.showGrid : true)
      setCurrentPlotBgColor(parsedConfig.plotBgColor || "#f1f5f9")
      setCurrentPaperBgColor(parsedConfig.paperBgColor || "#ffffff")
      setCurrentFontColor(parsedConfig.fontColor || "#334155")
      setCurrentGlobalFontSize(parsedConfig.globalFontSize || 14)
      setCurrentGlobalFontFamily(parsedConfig.globalFontFamily || "Roboto")
      setCurrentLegendFontSize(parsedConfig.legendFontSize || 12)
      setCurrentLegendFontColor(parsedConfig.legendFontColor || "#475569")
      setCurrentLegendFontFamily(parsedConfig.legendFontFamily || "Roboto")
      setCurrentXAxisLabelFontSize(parsedConfig.xAxisLabelFontSize || 12)
      setCurrentXAxisLabelFontColor(parsedConfig.xAxisLabelFontColor || "#475569")
      setCurrentXAxisLabelFontFamily(parsedConfig.xAxisLabelFontFamily || "Roboto")
      setCurrentYAxisLabelFontSize(parsedConfig.yAxisLabelFontSize || 12)
      setCurrentYAxisLabelFontColor(parsedConfig.yAxisLabelFontColor || "#475569")
      setCurrentYAxisLabelFontFamily(parsedConfig.yAxisLabelFontFamily || "Roboto")
      if (parsedConfig.is3D) {
        setCurrentZAxisLabelFontSize(parsedConfig.zAxisLabelFontSize || 12)
        setCurrentZAxisLabelFontColor(parsedConfig.zAxisLabelFontColor || "#475569")
        setCurrentZAxisLabelFontFamily(parsedConfig.zAxisLabelFontFamily || "Roboto")
      }
      setLoading(false)
    } catch (err) {
      console.error("Error loading chart config:", err)
      setError("Failed to load chart configuration")
      setLoading(false)
    }
  }, [chartId])

  useEffect(() => {
    if (chartConfig && chartRef.current) {
      renderChart()
    }
    return () => {
      if (plotlyInstance.current && chartRef.current) {
        try {
          window.Plotly?.purge(chartRef.current)
        } catch (e) { console.log("Plotly cleanup error:", e) }
        plotlyInstance.current = null
      }
    }
  }, [
    chartConfig, currentChartTitle, currentSelectedTheme, currentShowLegend, currentShowGrid,
    currentPlotBgColor, currentPaperBgColor, currentFontColor, currentGlobalFontSize,
    currentGlobalFontFamily, currentLegendFontSize, currentLegendFontColor, currentLegendFontFamily,
    currentXAxisLabelFontSize, currentXAxisLabelFontColor, currentXAxisLabelFontFamily,
    currentYAxisLabelFontSize, currentYAxisLabelFontColor, currentYAxisLabelFontFamily,
    currentZAxisLabelFontSize, currentZAxisLabelFontColor, currentZAxisLabelFontFamily,
  ])

  const renderChart = async () => {
    if (!chartRef.current || !chartConfig) return;
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
        title: { text: currentChartTitle, font: { color: '#334155', size: currentGlobalFontSize, family: currentGlobalFontFamily }},
        showlegend: currentShowLegend,
        margin: { l: 60, r: 60, b: 60, t: 80, pad: 4 },
        paper_bgcolor: 'rgba(255, 255, 255, 0.8)',
        plot_bgcolor: 'rgba(241, 245, 249, 0.8)',
        font: { color: '#475569', size: currentGlobalFontSize, family: currentGlobalFontFamily },
        legend: { font: { size: currentLegendFontSize, color: currentLegendFontColor, family: currentLegendFontFamily }},
        colorway: themeColors,
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
    if (!chartConfig) return;
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
    };
    localStorage.setItem(`chartConfig_${chartId}`, JSON.stringify(updatedConfig));
    setChartConfig(updatedConfig); // This will trigger a re-render
    toast.success("Chart customizations saved!");
  };
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-800">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard/charts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Charts
          </Button>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={downloadChart}><Download className="h-4 w-4 mr-2" />Download PNG</Button>
            <Button variant="outline" onClick={shareChart}><Share2 className="h-4 w-4 mr-2" />Share</Button>
            <Button onClick={() => setShowCustomization(!showCustomization)}>
              <Settings className="h-4 w-4 mr-2" />
              {showCustomization ? "Hide" : "Customize"}
            </Button>
          </div>
        </div>
        
        <div className={`grid ${showCustomization ? "grid-cols-1 lg:grid-cols-3 gap-6" : "grid-cols-1"}`}>
            {showCustomization && (
                <Card className="lg:col-span-1 bg-white/80 backdrop-blur-lg max-h-[calc(100vh-150px)] overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" /> Chart Customization
                        </CardTitle>
                        <CardDescription>Adjust the appearance of your chart.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="chart-title">Chart Title</Label>
                            <Input id="chart-title" value={currentChartTitle} onChange={(e) => setCurrentChartTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color-theme">Color Theme</Label>
                            <Select value={currentSelectedTheme} onValueChange={setCurrentSelectedTheme}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{colorThemes.map(theme => <SelectItem key={theme.name} value={theme.name}>{theme.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border"><Label>Show Legend</Label><Switch checked={currentShowLegend} onCheckedChange={setCurrentShowLegend} /></div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border"><Label>Show Grid Lines</Label><Switch checked={showGrid} onCheckedChange={setShowGrid} /></div>
                        <Separator />
                        <div className="flex justify-end pt-4">
                            <Button onClick={saveCustomization}><Save className="h-4 w-4 mr-2" />Save Customization</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
            <div className={`${showCustomization ? "lg:col-span-2" : "col-span-1"} min-w-0`}>
                <Card className="bg-white/80 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {chartConfig.is3D && <Cube className="h-5 w-5" />} {currentChartTitle}
                        </CardTitle>
                        <CardDescription>
                            Generated from {chartConfig.fileName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[600px] w-full p-4">
                            <div ref={chartRef} className="w-full h-full"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  )
}