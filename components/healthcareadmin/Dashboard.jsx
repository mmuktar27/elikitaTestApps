"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart,
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
import { Bar, ResponsiveContainer } from "recharts";
import { useHealthcareAdminDashboard } from "@/hooks/dashboard.hook";

const HealthcareAdminDashboard = ({currentDashboard}) => {
  const { data, isLoading, isError, isSuccess } = useHealthcareAdminDashboard();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  if (isSuccess && data) {
    const {
      totalPatients,
      pendingAppointments,
      upcomingEvents,
      analyticsData,
      recentAlerts,
    } = data?.data;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#75C05B]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#B24531]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Appointment{" "}
              </CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments}</div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>

          <Card className="bg-[#8FD573]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              {/* Change icon here */}
              <Calendar className="size-4 text-muted-foreground" />{" "}
              {/* Use Calendar or Clock */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                {/* Additional content */}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#007664]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <Zap className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 80 }}>
                <ResponsiveContainer>
                  <BarChart data={analyticsData}>
                    <Bar dataKey="consultations" fill="#A5D1CB" />
                    <Bar dataKey="responseTime" fill="#B5D99C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                New Patients Added over the last week
              </p>
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

  return null; // If no data is available yet
};

export default HealthcareAdminDashboard;
