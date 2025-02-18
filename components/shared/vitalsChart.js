"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar,LineChart, XAxis, Line,YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell  } from 'recharts';
;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VitalsChart = ({vitals}) => {
  // Sample data with multiple dates
  /*
  const sampleVitals = [
    {
      date: '2024-02-01',
      bloodPressure: 120,
      pulse: 75,
      respiratoryRate: 16,
      spo2: 98,
      temperature: 98.2,
      weight: 68.5
    },
    {
      date: '2024-02-05',
      bloodPressure: 135,
      pulse: 82,
      respiratoryRate: 18,
      spo2: 97,
      temperature: 98.6,
      weight: 68.7
    },
    {
      date: '2024-02-10',
      bloodPressure: 128,
      pulse: 78,
      respiratoryRate: 15,
      spo2: 99,
      temperature: 98.4,
      weight: 68.4
    },
    {
      date: '2024-02-15',
      bloodPressure: 142,
      pulse: 88,
      respiratoryRate: 19,
      spo2: 96,
      temperature: 99.1,
      weight: 68.9
    }
  ];
*/
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
    pulse: { min: 60, max: 100, unit: 'bpm', label: 'Pulse Rate', interval: 5 },
    respiratoryRate: { min: 12, max: 20, unit: '/min', label: 'Respiratory Rate', interval: 2 },
    spo2: { min: 95, max: 100, unit: '%', label: 'SpO2', interval: 1 },
    temperature: { min: 97, max: 99, unit: '°F', label: 'Temperature', interval: 0.5 },
    weight: { min: 0, max: 200, unit: 'kg', label: 'Weight', interval: 0.2 }
  };

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
      const value = payload[0].value;
      const range = referenceRanges[selectedVital];
      const status = getStatus(value, range);
      
      return (
        <div className="rounded-lg border bg-white p-4 shadow-lg">
          <p className="mb-2 text-lg font-bold text-teal-900">{range.label}</p>
          <p className="font-medium text-teal-800">
            Value: {value} {range.unit}
          </p>
          <p className="mt-1 text-sm text-teal-600">
            Date: {formatXAxis(label)}
          </p>
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
    }
    return null;
  };

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
  .map(item => ({
    date: item.date.split('T')[0],  // Extract only the date (YYYY-MM-DD)
    ...item.details.vitals
  }));

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
      <div className="flex h-[500px] items-center justify-center p-4">
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
                  value: `${referenceRanges[selectedVital].label} (${referenceRanges[selectedVital].unit})`,
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
              {referenceRanges[selectedVital].min &&
                referenceRanges[selectedVital].max && (
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
              <Line
                type="monotone"
                dataKey={selectedVital}
                stroke={theme.normal}
                strokeWidth={2}
                dot={{
                  fill: theme.normal,
                  stroke: theme.normal,
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: theme.normal,
                  stroke: theme.background,
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </CardContent>
  </Card>
);

};

export default VitalsChart;;

