"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Stethoscope, UserPlus } from "lucide-react";
import HealthTips from "./HealthTips";
import { useDoctorDashboard } from "@/hooks/dashboard.hook";
import SkeletonCard from "../ui/skeletoncard";

const Dashboard = () => {
  const { data, isLoading, isError, isSuccess } = useDoctorDashboard();

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">Failed to load dashboard data.</p>
    );
  }

  const metrics = data?.data?.data;

  const cardData = [
    {
      title: "Total Consultations",
      value: metrics?.totalConsultations || 0,
      /*   description: "+20.1% from last month", */
      icon: <Stethoscope className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#75C05B]/10",
    },
    {
      title: "Pending Consultations",
      value: metrics?.pendingConsultations || 0,
      /*   description: "+15% from yesterday", */
      icon: <Activity className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#B24531]/10",
    },
    {
      title: "Pending Referrals",
      value: metrics?.pendingReferrals || 0,
      /*       description: "3 new since last week", */
      icon: <UserPlus className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#007664]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <Card key={index} className={card.bgColor}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {/*    <p className="text-xs text-muted-foreground">
                {card.description}
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Alerts Section */}
      <Card className="bg-[#A0FEFE]/10">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {metrics?.recentAlerts.map((alert, index) => (
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

      {/* Health Tips Section */}
      <div className="fixed bottom-6 right-6 z-50">
        <HealthTips />
      </div>
    </div>
  );
};

export default Dashboard;
