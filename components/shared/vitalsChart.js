"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, XAxis, Line,YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell  } from 'recharts';
;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VitalsChart = ({vitals}) => {


  const [selectedVital, setSelectedVital] = React.useState('bloodPressure');

  const theme = {
    normal: '#115e59',
    warning: '#f59e0b',
    critical: '#dc2626',
    low: '#3b82f6',
    high: '#7c2d12',
    neutral: '#134e4a',
    background: '#f0fdfa'
  };

  const referenceRanges = {
    bloodPressure: { min: 90, max: 140, unit: 'mmHg', label: 'Blood Pressure', interval: 10 },
    bloodPressureSystolic: { min: 90, max: 140, unit: 'mmHg', label: 'Systolic BP', interval: 10 },
    bloodPressureDiastolic: { min: 60, max: 90, unit: 'mmHg', label: 'Diastolic BP', interval: 10 },

    pulse: { min: 60, max: 100, unit: 'bpm', label: 'Pulse Rate', interval: 5 },
    respiratoryRate: { min: 12, max: 20, unit: '/min', label: 'Respiratory Rate', interval: 2 },
    spo2: { min: 95, max: 100, unit: '%', label: 'SpO2', interval: 1 },
    temperature: { min: 97, max: 99, unit: '°F', label: 'Temperature', interval: 0.5 },
    weight: { min: 0, max: 200, unit: 'kg', label: 'Weight', interval: 0.2 }

  };

  // Calculate latest BMI (based on last record with weight and height)
  let bmiValue = null;
  let bmiCategory = '';
  
  // Filter only examination type and sort descending by date
  const latestExamination = vitals
    .filter(item => item.type === 'examination' && item.details.vitals)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  if (latestExamination) {
    const { height, weight } = latestExamination.details.vitals;
    
    if (height && weight) {
      const heightInMeters = height / 100; // convert cm to m
      bmiValue = weight / (heightInMeters * heightInMeters);
      bmiValue = bmiValue.toFixed(1);
  
      if (bmiValue < 18.5) {
        bmiCategory = 'Underweight';
      } else if (bmiValue < 25) {
        bmiCategory = 'Normal weight';
      } else if (bmiValue < 30) {
        bmiCategory = 'Overweight';
      } else {
        bmiCategory = 'Obese';
      }
    }
  }
  

  const getStatus = (value, range) => {
    if (!range.min || !range.max) return { text: "No reference range", color: theme.normal };
    
    const criticalLow = range.min - (range.min * 0.1);
    const criticalHigh = range.max + (range.max * 0.1);
    
    if (value < criticalLow) return { text: "CRITICAL LOW", color: theme.critical };
    if (value < range.min) return { text: "Below Normal", color: theme.low };
    if (value > criticalHigh) return { text: "CRITICAL HIGH", color: theme.critical };
    if (value > range.max) return { text: "Above Normal", color: theme.high };
    return { text: "Normal", color: theme.normal };
  };

  // Format date for x-axis
  const formatXAxis = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Iterate through the payload to handle multiple lines (Systolic and Diastolic)
      return (
        <div className="rounded-lg border bg-white p-4 shadow-lg">
          {payload.map((entry, index) => {
            const value = entry.value;
            const dataKey = entry.dataKey;  // Get the dataKey to determine which line is hovered
            const range = referenceRanges[selectedVital];
            const status = getStatus(value, range);
  
            // Set tooltip text based on which line is hovered
            let tooltipValue = "";
            if (dataKey === "bloodPressureSystolic") {
              tooltipValue = `Systolic BP: ${value}`;
            } else if (dataKey === "bloodPressureDiastolic") {
              tooltipValue = `Diastolic BP: ${value}`;
            } else {
              tooltipValue = `${range.label}: ${value} ${range.unit}`;
            }
  
            return (
              <div key={index}>
                <p className="mb-2 text-lg font-bold text-teal-900">{range.label}</p>
                <p className="font-medium text-teal-800">{tooltipValue}</p>
                <p className="mt-1 text-sm text-teal-600">Date: {formatXAxis(label)}</p>
                {range.min && range.max && (
                  <>
                    <p className="text-sm text-teal-600">
                      Normal range: {range.min}-{range.max} {range.unit}
                    </p>
                    <p className="mt-2 font-semibold" style={{ color: status.color }}>
                      Status: {status.text}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  
  console.log('vitals')

console.log(vitals)
  // Calculate axis ticks based on selected vital
  const calculateYAxisTicks = () => {
    const range = referenceRanges[selectedVital];
    const data = examinationVitals.map(v => v[selectedVital]);
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const interval = range.interval;
    
    const ticks = [];
    let tick = Math.floor(minValue / interval) * interval;
    while (tick <= Math.ceil(maxValue / interval) * interval) {
      ticks.push(tick);
      tick += interval;
    }
    return ticks;
  };



  const examinationVitals = vitals
  .filter(item => item.type === 'examination' && item.details.vitals)
  .map(item => {
    const vitalsData = item.details.vitals;
    
    // Check if bloodPressure is available and in the "systolic/diastolic" format
    if (vitalsData.bloodPressure && typeof vitalsData.bloodPressure === 'string' && vitalsData.bloodPressure.includes('/')) {
      const [systolicStr, diastolicStr] = vitalsData.bloodPressure.split('/');
      vitalsData.bloodPressureSystolic = parseInt(systolicStr, 10);
      vitalsData.bloodPressureDiastolic = parseInt(diastolicStr, 10);
    }

    return {
      date: item.date.split('T')[0],  // Extract only the date (YYYY-MM-DD)
      ...vitalsData
    };
  });
/*
  console.log('visit history from chart')
  console.log();

  console.log('visit history from chart')
*/

return (
  <Card className="w-full border-none bg-transparent shadow-none">
    <CardHeader className="border-b border-teal-100">
      <CardTitle className="text-2xl font-bold text-teal-900">
        Vital Signs
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="mb-4">
        <Select onValueChange={setSelectedVital} value={selectedVital}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select vital sign" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(referenceRanges).map(([key, range]) => (
              <SelectItem key={key} value={key}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex h-[500px] w-full min-w-[320px] items-center justify-center p-4 sm:min-w-[480px] md:min-w-[600px]">
        {examinationVitals && examinationVitals.length > 0 ? (
     <ResponsiveContainer width="100%" height="100%">
     <LineChart
       data={examinationVitals}
       margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
     >
       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
       <XAxis
         dataKey="date"
         angle={-45}
         textAnchor="end"
         height={80}
         tick={{ fill: theme.neutral, fontSize: 12 }}
         tickFormatter={formatXAxis}
         label={{
           value: "Date",
           position: "bottom",
           offset: 40,
           fill: theme.neutral,
         }}
       />
       <YAxis
         ticks={calculateYAxisTicks()}
         tick={{ fill: theme.neutral, fontSize: 12 }}
         axisLine={{ stroke: theme.neutral }}
         label={{
           value: `${referenceRanges[selectedVital]?.label} (${referenceRanges[selectedVital]?.unit})`,
           angle: -90,
           position: "insideLeft",
           offset: 0,
           fill: theme.neutral,
         }}
       />
       <Tooltip
         content={<CustomTooltip />}
         cursor={{ stroke: theme.neutral, strokeWidth: 1 }}
       />
       {referenceRanges[selectedVital]?.min &&
         referenceRanges[selectedVital]?.max && (
           <>
             <ReferenceLine
               y={referenceRanges[selectedVital].min}
               stroke={theme.neutral}
               strokeDasharray="3 3"
               strokeWidth={2}
               opacity={0.5}
             />
             <ReferenceLine
               y={referenceRanges[selectedVital].max}
               stroke={theme.neutral}
               strokeDasharray="3 3"
               strokeWidth={2}
               opacity={0.5}
             />
           </>
         )}
   
       {/* Dual Line Chart for Blood Pressure (Systolic and Diastolic) */}
 
       
       {selectedVital === 'bloodPressure' && (
  <>
    <Line
      type="monotone"
      dataKey="bloodPressureSystolic"
      stroke={theme.normal}
      strokeWidth={2}
      name="Systolic BP"
      dot={{ fill: theme.normal, r: 4 }}
    />
    <Line
      type="monotone"
      dataKey="bloodPressureDiastolic"
      stroke={theme.high}
      strokeWidth={2}
      name="Diastolic BP"
      dot={{ fill: theme.high, r: 4 }}
    />
  </>
)}

      
   
       {/* For other vitals, just display their line chart */}
       {selectedVital !== 'bloodPressure' && (
         <Line
           type="monotone"
           dataKey={selectedVital}
           stroke={theme.normal}
           strokeWidth={2}
           dot={{ fill: theme.normal, r: 4 }}
         />
       )}
   
     </LineChart>
   </ResponsiveContainer>
   
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>


      {bmiValue && (
        <div className="mt-6 rounded-lg bg-teal-50 p-4 shadow">
          <p className="text-lg font-semibold text-teal-900">BMI</p>
          <p className="text-2xl font-bold text-teal-800">{bmiValue}</p>
          <p className="text-md text-teal-700">{bmiCategory}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

};

export default VitalsChart;;

