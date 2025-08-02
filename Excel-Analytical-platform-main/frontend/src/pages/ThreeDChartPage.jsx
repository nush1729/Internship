// frontend/src/pages/ThreeDChartPage.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const ThreeDChartPage = () => {
  const { excelData, columnHeaders } = useOutletContext();
  const mountRef = useRef(null);
  const [selectedLabelColumn, setSelectedLabelColumn] = useState('');
  const [selectedDataColumn, setSelectedDataColumn] = useState('');
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [font, setFont] = useState(null);

  // Load font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json',
      loadedFont => setFont(loadedFont),
      undefined,
      error => {
        console.error('Font loading error:', error);
        alert("Failed to load 3D font. Place it in /public/fonts.");
      }
    );
  }, []);

  // Auto-select initial columns if available
  useEffect(() => {
      if (columnHeaders && columnHeaders.length > 1) {
          // Attempt to pre-select a text column for labels and a numerical for data
          const textColumn = columnHeaders.find(header => {
              if (excelData && excelData.length > 1) {
                   // Check the type of data in the second row (after header)
                   const sampleValue = excelData[1][header];
                   return typeof sampleValue === 'string';
              }
              return false;
          });
           const numberColumn = columnHeaders.find(header => {
              if (excelData && excelData.length > 1) {
                   const sampleValue = excelData[1][header];
                   return typeof sampleValue === 'number' || parseFloat(sampleValue); // Check if parsable to number
              }
              return false;
          });

          setSelectedLabelColumn(textColumn || columnHeaders[0]);
          setSelectedDataColumn(numberColumn || (columnHeaders.length > 1 ? columnHeaders[1] : ''));

      } else if (columnHeaders && columnHeaders.length > 0) {
           setSelectedLabelColumn(columnHeaders[0]);
           setSelectedDataColumn('');
      }


  }, [columnHeaders, excelData]); // Re-run when data or headers change


  const renderThreeDChart = () => {
    console.log("Attempting to render 3D chart...");
    console.log("excelData:", excelData);
    console.log("columnHeaders:", columnHeaders);
    console.log("Selected Label Column:", selectedLabelColumn);
    console.log("Selected Data Column:", selectedDataColumn);
    console.log("Chart Type:", chartType);
    console.log("Font loaded:", !!font);


    // Ensure essential data and font are loaded before rendering
    if (!excelData || excelData.length === 0 || !font || !mountRef.current || !selectedLabelColumn || !selectedDataColumn) {
        console.log("Missing data, font, mount point, or selected columns. Aborting render.");
        if (!font) console.warn("Font not loaded, skipping text labels.");
        return; // Exit if essential data/font is missing
    }


    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xaaaaaa));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    scene.add(light);

    // --- Data Processing for Bar/Line Charts ---
    const chartData = excelData.slice(1).map(row => ({
      label: row[selectedLabelColumn],
      value: parseFloat(row[selectedDataColumn]),
    })).filter(item => item.label !== undefined && item.label !== null && !isNaN(item.value));

    console.log("Processed chartData for rendering:", chartData);

    if (!chartData.length) {
        console.log("No valid chart data points found after processing.");
        return; // Exit if no valid points
    }

    // Get unique labels and data values
    const labels = chartData.map(item => item.label);
    const values = chartData.map(item => item.value);

    const [minValue, maxValue] = [Math.min(...values), Math.max(...values)];
    const valueRange = maxValue - minValue;
     const labelCount = labels.length; // Number of labels

     // --- Declare totalBarWidth here to be accessible outside the if blocks ---
     let totalBarWidth = 0;


    // --- 3D Chart Rendering based on chartType ---

     const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
     // Adjust text size and height based on the range and number of labels
     const textSize = valueRange * 0.05;
     const textHeight = valueRange * 0.01;


     // Create label function using loaded font
     const createLabel = (text, x, y, z) => {
       if (!font) return null; // Don't create label if font not loaded
       const geometry = new TextGeometry(text, { font, size: textSize, height: textHeight });
       const mesh = new THREE.Mesh(geometry, labelMaterial);
       mesh.position.set(x, y, z);
       // Center the text geometry's origin
       geometry.computeBoundingBox();
       const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
       mesh.position.x -= textWidth / 2;

       scene.add(mesh);
       return mesh;
     };


    // Axis Helper
    // Increased size slightly and moved origin to make space for labels
     const axesHelper = new THREE.AxesHelper(valueRange * 1.5);
     axesHelper.position.set(0, 0, 0); // Keep origin at 0,0,0
     scene.add(axesHelper);


    if (chartType === 'bar') {
        console.log("Rendering 3D Bar Chart");
        // --- 3D Bar Chart Rendering ---

        // Adjust bar width and spacing based on number of labels and range
        const barWidth = valueRange * 0.05;
        const barSpacing = valueRange * 0.02;
         // --- Calculate totalBarWidth inside the if block ---
         totalBarWidth = labelCount * (barWidth + barSpacing);


        // Add a Grid Helper on the XZ plane
        const gridHelper = new THREE.GridHelper(totalBarWidth * 1.2, labelCount, 0x888888, 0xcccccc); // Size, Divisions, CenterLineColor, GridColor
         gridHelper.position.y = minValue; // Position the grid at the minimum value
         scene.add(gridHelper);


        labels.forEach((label, index) => {
            const value = values[index];

            // Create bar geometry
            const geometry = new THREE.BoxGeometry(barWidth, value - minValue, barWidth); // Height is value relative to min value
            const material = new THREE.MeshStandardMaterial({ color: 0x00aaff }); // Example color
            const bar = new THREE.Mesh(geometry, material);

            // Position the bar - center it on the XZ plane for its label
             const xPosition = index * (barWidth + barSpacing) - totalBarWidth / 2 + barWidth / 2;
            const yPosition = minValue + (value - minValue) / 2; // Position the base of the bar at minValue
            const zPosition = 0;

            bar.position.set(xPosition, yPosition, zPosition);
            scene.add(bar);

             // Add label below the bar, adjusted position
            if (font) {
                 const labelMesh = createLabel(label.toString(), xPosition, minValue - valueRange * 0.1, zPosition); // Position below the base
                 if (labelMesh) {
                      // Rotate the label to face the camera better
                      labelMesh.rotation.x = -Math.PI / 4; // Rotate slightly on X axis
                       labelMesh.rotation.y = Math.PI / 4; // Rotate slightly on Y axis
                 }
            }
        });

         // Add value labels on the Y axis
         if (font) {
              const valueLabelCount = 5; // Number of labels on the value axis
              const valueLabelSpacing = valueRange / valueLabelCount;
              for(let i = 0; i <= valueLabelCount; i++) {
                   const value = minValue + i * valueLabelSpacing;
                   createLabel(value.toFixed(0), -totalBarWidth / 2 - valueRange * 0.1, value, 0)?.lookAt(camera.position); // Position on the left of the chart
              }
               // Y-axis label for data values
              createLabel(selectedDataColumn, -totalBarWidth / 2 - valueRange * 0.1, maxValue + valueRange * 0.1, 0)?.lookAt(camera.position);
         }


    } else if (chartType === 'line') {
        console.log("Rendering 3D Line Chart");
        // --- 3D Line Chart Rendering ---

        // Adjust dimensions for line chart based on valueRange and labelCount
         const lineChartWidth = labelCount * (valueRange * 0.05 + valueRange * 0.02); // Estimate line chart width


        const points3D = chartData.map((item, index) => {
            const xPosition = index * (valueRange * 0.05 + valueRange * 0.02) - lineChartWidth / 2;
            const yPosition = item.value;
            const zPosition = 0; // For a simple line on the XZ plane
            return new THREE.Vector3(xPosition, yPosition, zPosition);
        });

        if (points3D.length > 1) {
            const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
            const material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue line
            const line = new THREE.Line(geometry, material);
            scene.add(line);
        }

         // Add points (spheres) on the line
         points3D.forEach(point => {
             const geometry = new THREE.SphereGeometry(valueRange * 0.005, 16, 16); // Smaller spheres
             const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red spheres
             const sphere = new THREE.Mesh(geometry, material);
             sphere.position.copy(point);
             scene.add(sphere);

             // Add label for each point (optional and can clutter the view)
             // if (font) {
             //      createLabel(point.y.toFixed(2), point.x, point.y + valueRange * 0.02, point.z)?.lookAt(camera.position);
             // }
         });


         // Add label below each point on the XZ plane
         if (font) {
              chartData.forEach((item, index) => {
                  const xPosition = index * (valueRange * 0.05 + valueRange * 0.02) - lineChartWidth / 2;
                  const zPosition = 0;
                  createLabel(item.label.toString(), xPosition, -valueRange * 0.05, zPosition)?.lookAt(camera.position);
              });
         }

         // Y-axis label for data values
         if (font) {
             createLabel(selectedDataColumn, -lineChartWidth / 2 - valueRange * 0.1, maxValue + valueRange * 0.1, 0)?.lookAt(camera.position);
         }

          // Use lineChartWidth for camera positioning in line chart mode
         totalBarWidth = lineChartWidth; // Assign lineChartWidth to totalBarWidth for consistent camera positioning


    }


    // Adjust camera position based on the chart data range and number of labels
    // Use a default value for totalBarWidth if it's still 0 (e.g., if no data points)
    const effectiveChartWidth = totalBarWidth > 0 ? totalBarWidth : valueRange * labelCount * 0.1; // Fallback width if totalBarWidth is 0
    const chartCenterY = (minValue + maxValue) / 2;
     const cameraDistance = Math.max(valueRange, effectiveChartWidth) * 1.5; // Adjust distance based on range and total width
     camera.position.set(effectiveChartWidth * 0.5, chartCenterY + cameraDistance * 0.3, cameraDistance); // Position camera looking towards the chart

    camera.lookAt(effectiveChartWidth / 2, chartCenterY, 0); // Look at the center of the chart
    controls.target.set(effectiveChartWidth / 2, chartCenterY, 0);


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
       console.log("Three.js scene and renderer cleaned up.");
    };
  }; // <--- Correct closing brace for renderThreeDChart


  // Effect to render the chart when data, columns, or font change
  useEffect(() => {
      renderThreeDChart();
  }, [excelData, selectedLabelColumn, selectedDataColumn, chartType, font]); // Dependencies


  return ( // <--- Return statement for the ThreeDChartPage component
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">3D Chart Visualization</h1>

      {excelData && excelData.length > 0 && columnHeaders && columnHeaders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Chart Type Selection */}
              <div>
                  <label className="block text-sm font-medium text-gray-700">Chart Type</label>
                  <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      value={chartType}
                      onChange={e => setChartType(e.target.value)}
                  >
                      <option value="bar">3D Bar Chart</option>
                      <option value="line">3D Line Chart</option>
                  </select>
              </div>

              {/* Label Column Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Label Column (X/Z Axis)</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={selectedLabelColumn}
                  onChange={e => { setSelectedLabelColumn(e.target.value); }}
                >
                   <option value="">-- Select Column --</option>
                  {columnHeaders?.map(header => <option key={header}>{header}</option>)}
                </select>
              </div>

               {/* Data Column Selection (Single Series) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Column (Y Axis)</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={selectedDataColumn}
                  onChange={e => { setSelectedDataColumn(e.target.value); }}
                >
                   <option value="">-- Select Column --</option>
                  {columnHeaders?.map(header => <option key={header}>{header}</option>)}
                </select>
              </div>
            </div>

             {/* Display loading message if font is not loaded but data is available */}
            {excelData && excelData.length > 0 && columnHeaders && columnHeaders.length > 0 && !font && (
                 <p>Loading font for axis labels...</p>
            )}

            {(selectedLabelColumn && selectedDataColumn) ? (
                 <div ref={mountRef} className="w-full h-[600px] bg-gray-100 rounded-lg border border-gray-300"></div>
            ) : (
                 <p>Please select Label and Data columns to generate the 3D chart.</p>
            )}


          </>
      ) : (
         <p>Please upload an Excel file on the Dashboard Home page to generate a 3D chart.</p>
      )}
    </div>
  );
}; // <--- Closing brace for the ThreeDChartPage component

export default ThreeDChartPage;
