"use client";
import {
  Activity,
  Beaker,
  Briefcase,
  Calculator,
  Calendar,
  Stethoscope,
  TestTube,
  UserCog,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

import { Bar, BarChart, ResponsiveContainer } from "recharts";

const DashboardComponent = () => {
  const analyticsData = [
    { name: "Mon", consultations: 45, responseTime: 10 },
    { name: "Tue", consultations: 52, responseTime: 9 },
    { name: "Wed", consultations: 49, responseTime: 11 },
    { name: "Thu", consultations: 58, responseTime: 8 },
    { name: "Fri", consultations: 60, responseTime: 10 },
    { name: "Sat", consultations: 39, responseTime: 12 },
    { name: "Sun", consultations: 35, responseTime: 11 },
  ];
  const roleData = [
    {
      role: "Healthcare Assistant",
      count: 45,
      color: "#8FD573",
      icon: Stethoscope,
    },
    { role: "Lab Technician", count: 23, color: "#C95A42", icon: TestTube },
    { role: "Healthcare Admin", count: 12, color: "#008F7A", icon: UserCog },
    { role: "Accountant", count: 8, color: "#A0FEFE", icon: Calculator },
    { role: "Healthcare Manager", count: 7, color: "#A63D20", icon: Briefcase },
    { role: "Volunteer Doctor", count: 30, color: "#00664E", icon: UserPlus },
    { role: "Pharmacy Technician", count: 18, color: "#7FFFD4", icon: Beaker },
  ];

  const totalUsers = roleData.reduce((sum, role) => sum + role.count, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-[#75C05B]/10 p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Total Patients</h3>
            <Users className="size-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold">{totalUsers}</p>
          <p className="text-xs text-gray-500">+20.1% from last month</p>
        </div>
        <div className="rounded-lg bg-[#B24531]/10 p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Pending Appointment</h3>
            <Activity className="size-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="rounded-lg bg-[#8FD573]/10 p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Upcoming Events</h3>
            <Calendar className="size-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="col-span-full rounded-lg bg-[#007664]/10 p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Analytics</h3>
            <Zap className="size-4 text-gray-500" />
          </div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={analyticsData}>
                <Bar dataKey="consultations" fill="#A5D1CB" />
                <Bar dataKey="responseTime" fill="#B5D99C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            New Patients Added over the last week
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-[#A0FEFE]/10 p-4 shadow">
        <h3 className="mb-4 text-xl font-semibold">Recent Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="relative mr-2 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">Patient Record Archived</p>
              <p className="text-sm text-gray-500">John Doe</p>
            </div>
            <div className="ml-auto font-medium">Just now</div>
          </div>
          <div className="flex items-center">
            <span className="relative mr-2 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">Weekly meeting completed</p>
              <p className="text-sm text-gray-500">
                Weekly meeting finished at 02:00
              </p>
            </div>
            <div className="ml-auto font-medium">2 hours ago</div>
          </div>
          <div className="flex items-center">
            <span className="relative mr-2 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">New Patient Added</p>
              <p className="text-sm text-gray-500">Sarah Johnson added</p>
            </div>
            <div className="ml-auto font-medium">5 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
