"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ReportAnalytics = () => {
  const healthworkerData = [
    { role: "Doctors", consultations: 150, avgResponseTime: 10 },
    { role: "Nurses", consultations: 200, avgResponseTime: 8 },
    { role: "Lab Technicians", consultations: 100, avgResponseTime: 15 },
    { role: "Pharmacists", consultations: 80, avgResponseTime: 12 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Report/Analytics</h2>
      <div className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-xl font-semibold">
          Telehealth Usage Analysis
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={healthworkerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="consultations"
                stroke="#8884d8"
                name="Consultations"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgResponseTime"
                stroke="#82ca9d"
                name="Avg Response Time (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-[#75C05B]/10 p-4">
          <h3 className="mb-4 text-xl font-semibold">
            Healthworker Statistics
          </h3>
          <p>Total Active Healthworkers: 158</p>
          <p>Total Consultations: 530</p>
          <p>Average Consultation Duration: 22 minutes</p>
        </div>
        <div className="rounded-lg bg-[#007664]/10 p-4">
          <h3 className="mb-4 text-xl font-semibold">Performance Metrics</h3>
          <p>Average Response Time: 11 minutes</p>
          <p>Health Worker Satisfaction Rate: 94%</p>
          <p>Consultation Completion Rate: 98%</p>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalytics;
