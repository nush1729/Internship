import React, { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import Select from 'react-select';
import { useOutletContext } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';

const Bar = ({ position, size, color }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const ThreeDChartComponent = ({ data, xAxisKey, yAxisKey, zAxisKey }) => {
  const validData = useMemo(() => data.filter(d =>
    !isNaN(parseFloat(d[yAxisKey])) && !isNaN(parseFloat(d[zAxisKey]))
  ), [data, yAxisKey, zAxisKey]);
  const yMax = Math.max(...validData.map(d => parseFloat(d[yAxisKey])));
  const zMax = Math.max(...validData.map(d => parseFloat(d[zAxisKey])));

  return (
    <Canvas camera={{ position: [10, 10, 15], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 5]} intensity={1.5} />
        {validData.map((d, i) => {
          const yHeight = (parseFloat(d[yAxisKey]) / yMax) * 8 || 0;
          const zDepth = (parseFloat(d[zAxisKey]) / zMax) * 8 || 1;
          return (
            <group key={i}>
              <Bar
                position={[i * 2 - validData.length, yHeight / 2, 0]}
                size={[1, yHeight, zDepth]}
                color={i % 2 === 0 ? '#4A90E2' : '#50E3C2'}
              />
              <Text position={[i * 2 - validData.length, -1, 0]} fontSize={0.5} color="white" anchorX="center">
                {d[xAxisKey]}
              </Text>
            </group>
          );
        })}
        <Text position={[0, -2, 0]} fontSize={0.6} color="white">{`X-Axis: ${xAxisKey}`}</Text>
        <Text position={[-validData.length - 2, 4, 0]} fontSize={0.6} color="white" rotation={[0, 0, Math.PI / 2]}>{`Y-Axis: ${yAxisKey}`}</Text>
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

const ThreeDChartPage = () => {
  const { excelData, columnHeaders } = useOutletContext();
  const [xAxisKey, setXAxisKey] = useState(null);
  const [yAxisKey, setYAxisKey] = useState(null);
  const [zAxisKey, setZAxisKey] = useState(null);

  const stringColumns = useMemo(() => columnHeaders.map(col => ({ label: col, value: col })), [columnHeaders]);
  const numericColumns = useMemo(() => columnHeaders.filter(col => excelData.length > 0 && !isNaN(parseFloat(excelData[0][col]))).map(col => ({ label: col, value: col })), [columnHeaders, excelData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FiBox className="mr-3 text-purple-600" />
        3D Chart Visualization
      </h2>
      <p className="mb-6 text-gray-600">Select columns to render a 3D chart. Interact by dragging to rotate and scrolling to zoom.</p>
      {excelData && excelData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select placeholder="Select X-Axis (Labels)" options={stringColumns} onChange={e => setXAxisKey(e.value)} />
            <Select placeholder="Select Y-Axis (Height)" options={numericColumns} onChange={e => setYAxisKey(e.value)} />
            <Select placeholder="Select Z-Axis (Depth)" options={numericColumns} onChange={e => setZAxisKey(e.value)} />
          </div>
          <div className="w-full h-[600px] bg-gray-800 rounded-lg mt-4">
            {xAxisKey && yAxisKey && zAxisKey ? (
              <ThreeDChartComponent data={excelData} xAxisKey={xAxisKey} yAxisKey={yAxisKey} zAxisKey={zAxisKey} />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-lg">Please select all three axes to generate the 3D chart.</div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">Please upload an Excel file on the Dashboard home page first to use this feature.</div>
      )}
    </div>
  );
};
export default ThreeDChartPage;