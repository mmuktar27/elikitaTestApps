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
import {

  HealthTips
} from "../../components/shared";
import { 
  Card , CardContent , CardHeader, CardTitle 
} from '@/components/ui/card';

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
     <Card className="bg-[#75C05B]/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
        <Stethoscope className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,234</div>
        <p className="text-xs text-muted-foreground">
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
    <Card className="bg-[#B24531]/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">42</div>
        <p className="text-xs text-muted-foreground">
          +15% from yesterday
        </p>
      </CardContent>
    </Card>
    <Card className="bg-[#007664]/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
        <UserPlus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">7</div>
        <p className="text-xs text-muted-foreground">
          3 new since last week
        </p>
      </CardContent>
    </Card>
          </div>
        <Card className="bg-[#A0FEFE]/10">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
               New Pending  Patient 
              </p>
              <p className="text-sm text-muted-foreground">
               john doe
              </p>
            </div>
            <div className="ml-auto font-medium">Just now</div>
          </div>
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                weekly meeting completed
              </p>
              <p className="text-sm text-muted-foreground">
                weekly meeting finished at 02:00
              </p>
            </div>
            <div className="ml-auto font-medium">2 hours ago</div>
          </div>
          <div className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                Patient Consultation Closed
              </p>
              <p className="text-sm text-muted-foreground">
             Sarah Johnson
              </p>
            </div>
            <div className="ml-auto font-medium">5 hours ago</div>
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="fixed bottom-6 right-6 z-50">
 <HealthTips />
</div>
  </div>
  );
};

export default DashboardComponent;
