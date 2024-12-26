"use client";

import { useGetStaffMetrics } from "@/hooks/admin";
import { Activity, BarChart2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { PatientIcon, StaffIcon } from "../icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SkeletonCard from "../ui/skeletoncard";

const DashboardComponent = () => {
  const {
    data: usersmetricsdata,
    isLoading: metricsLoading,
    isSuccess,
  } = useGetStaffMetrics();

  const [usersMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    if (!metricsLoading && isSuccess && usersmetricsdata?.data?.success) {
      setUserMetrics(usersmetricsdata.data.data);
    }
  }, [metricsLoading, isSuccess, usersmetricsdata]);

  if (metricsLoading || usersMetrics === null) {
    return <SkeletonCard />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-[#75C05B]/10 p-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-2xl font-medium">Total Staff</h3>
            <Users className="size-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{usersMetrics.staffCount}</div>
          <p className="text-xs text-gray-500"> N/A</p>
        </div>
        <div className="rounded-lg bg-[#B24531]/10 p-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-2xl font-medium">Active Consultations</h3>
            <Activity className="size-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-gray-500"> N/A</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-2xl font-medium">Platform Usage Report</h3>
            <BarChart2 className="size-4 text-gray-500" />
          </div>
          <div className="text-lg font-bold">0 Active Users</div>
          <p className="text-xs text-gray-500"> N/A</p>
          <div className="mt-4 h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Jan", total: 800 },
                  { name: "Feb", total: 900 },
                  { name: "Mar", total: 1000 },
                  { name: "Apr", total: 1100 },
                  { name: "May", total: 1234 },
                ]}
              >
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(usersMetrics.roleCounts).map(([role, count]) => (
          <Card
            key={role}
            className="col-span-1 cursor-pointer bg-[#75C05B]/10 transition-shadow hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-lg font-medium">{role}</CardTitle>
              <StaffIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
        <Card className="col-span-1 cursor-pointer bg-[#75C05B]/10 transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-lg font-medium">Patients</CardTitle>
            <PatientIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{0}</div>
          </CardContent>
        </Card>
      </div>
      {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {roleData.map((role) => (
          <div
            key={role.role}
            className="overflow-hidden rounded-lg bg-white shadow-md"
            style={{ backgroundColor: `${role.color}20` }}
          >
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">{role.role}</h3>
                <role.icon className="size-4 text-gray-500" />
              </div>
              <div className="text-2xl font-bold">{role.count}</div>
            </div>
          </div>
        ))}
      </div> */}
      <div className="rounded-lg bg-[#A0FEFE]/10 p-4">
        <h3 className="mb-4 text-xl font-semibold">Recent Alerts</h3>
        <div className="space-y-8">
          <div className="flex items-center">
            <span className="relative mr-2 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                High server load detected
              </p>
              <p className="text-sm text-gray-500">
                Server load reached 90% at 14:45
              </p>
            </div>
            <div className="ml-auto font-medium">Just now</div>
          </div>
          <div className="flex items-center">
            <span className="relative mr-2 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
            </span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                Database backup completed
              </p>
              <p className="text-sm text-gray-500">
                Daily backup finished at 02:00
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
              <p className="text-sm font-medium leading-none">
                New user registration
              </p>
              <p className="text-sm text-gray-500">
                Dr. Sarah Johnson joined the platform
              </p>
            </div>
            <div className="ml-auto font-medium">5 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
