"use client";

import { useGetStaffMetrics } from "@/hooks/admin";
import { Activity, BarChart2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { PatientIcon, StaffIcon } from "../icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SkeletonCard from "../ui/skeletoncard";
import { useSystemAdminDashboard } from "../../hooks/dashboard.hook";

const SystemAdminDashboard = () => {
  const {
    data: systemAdminData,
    isLoading: systemAdminLoading,
    isSuccess: systemAdminSuccess,
    isError: systemAdminError,
  } = useSystemAdminDashboard();

  if (systemAdminLoading) {
    return <SkeletonCard />;
  }

  if (systemAdminError) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  if (systemAdminSuccess && systemAdminData) {
    const { totalStaff, activeConsultations, staffByRole, recentAlerts } =
      systemAdminData?.data;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-[#75C05B]/10 p-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-2xl font-medium">Total Staff</h3>
              <Users className="size-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{totalStaff}</div>
            {/*             <p className="text-xs text-gray-500"> N/A</p> */}
          </div>
          <div className="rounded-lg bg-[#B24531]/10 p-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-2xl font-medium">Active Consultations</h3>
              <Activity className="size-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{activeConsultations || 0}</div>
            {/*             <p className="text-xs text-gray-500"> N/A</p> */}
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-2xl font-medium">Platform Usage Report</h3>
              <BarChart2 className="size-4 text-gray-500" />
            </div>
            <div className="text-lg font-bold">0 Active Users</div>
            {/*             <p className="text-xs text-gray-500"> N/A</p> */}
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
          {staffByRole.map((role) => (
            <Card
              key={role.role}
              className="col-span-1 cursor-pointer bg-[#75C05B]/10 transition-shadow hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-lg font-medium capitalize">
                  {role.role === "healthcareadmin"
                    ? "healthcare admin"
                    : role.role === "systemadmin"
                      ? "system admin"
                      : role.role === "labtechnicians"
                        ? "lab technicians"
                        : role.role}
                </CardTitle>
                <StaffIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{role.count}</div>
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

        {/* Recent Alerts Section */}
        <Card className="bg-[#A0FEFE]/10">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentAlerts ||
                [].map((alert, index) => (
                  <div className="flex items-center" key={index}>
                    <span className={`relative mr-2 flex size-3`}>
                      <span
                        className={`absolute inline-flex size-full animate-ping rounded-full ${
                          alert.type === "error"
                            ? "bg-red-400"
                            : alert.type === "warning"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                        } opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex size-3 rounded-full ${
                          alert.type === "error"
                            ? "bg-red-500"
                            : alert.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></span>
                    </span>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {alert.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{alert.timeAgo}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default SystemAdminDashboard;
