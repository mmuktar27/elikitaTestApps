"use client";
import { useEffect, useState } from "react";

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
import { formatDistanceToNow } from 'date-fns';

import { Bar, ResponsiveContainer } from "recharts";
import { useHealthcareAdminDashboard } from "@/hooks/dashboard.hook";
import {fetchHealthAdminRecenAlerts} from "../shared/api"

const activityTypeColors = {
  'Patient Creation': 'bg-green-500',
  'Patient Archive': 'bg-red-500',
  'Patient Update': 'bg-yellow-500',
  'Appointment Creation': 'bg-blue-500',
  'Appointment Update': 'bg-purple-500',
  'Appointment Deletion': 'bg-gray-500',
};

const HealthcareAdminDashboard = ({currentDashboard}) => {
  const { data, isLoading, isError, isSuccess } = useHealthcareAdminDashboard();
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAlerts = async () => {
      try {
        const data = await fetchHealthAdminRecenAlerts(5);
        setAlerts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getAlerts();
  }, []);




 const cardData = [
    {
      title: "Total Consultations",
      value: 0 || 0,
      /*   description: "+20.1% from last month", */
      icon: <Stethoscope className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#75C05B]/10",
    },
    {
      title: "Pending Consultations",
      value: 0 || 0,
      /*   description: "+15% from yesterday", */
      icon: <Activity className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#B24531]/10",
    },
    {
      title: "Pending Patient",
      value: 0 || 0,
      /*       description: "3 new since last week", */
      icon: <UserPlus className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#007664]/10",
    },
  ];

   if (isLoading) {
     return (
       <div className="space-y-6">
         {/* Metrics Cards Skeleton */}
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
           {cardData.map((card, index) => (
             <Card key={index} className={`${card.bgColor} animate-pulse`}>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <div className="h-4 w-32 rounded bg-gray-200" />
                 <div className="size-4 rounded bg-gray-200" />
               </CardHeader>
               <CardContent>
                 <div className="mt-2 h-8 w-16 rounded bg-gray-200" />
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Recent Alerts Skeleton */}
         <Card className="animate-pulse bg-[#A0FEFE]/10">
           <CardHeader>
             <div className="h-6 w-28 rounded bg-gray-200" />
           </CardHeader>
           <CardContent>
             <div className="space-y-8">
               {[1, 2, 3].map((_, index) => (
                 <div className="flex items-center" key={index}>
                   <span className="relative mr-2 flex size-3">
                     <div className="size-3 rounded-full bg-gray-200" />
                   </span>
                   <div className="ml-4 flex-1 space-y-1">
                     <div className="h-4 w-32 rounded bg-gray-200" />
                     <div className="h-4 w-48 rounded bg-gray-200" />
                   </div>
                   <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
       </div>
     );
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
          {error && <p>Error: {error}</p>}
          {alerts.map((alert, index) => (
            <div className="flex items-center" key={index}>
              <span className="relative mr-2 flex size-3">
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full ${
                    activityTypeColors[alert.activityType] || 'bg-gray-400'
                  } opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex size-3 rounded-full ${
                    activityTypeColors[alert.activityType] || 'bg-gray-400'
                  }`}
                ></span>
              </span>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {alert.activityType}
                </p>
                <p className="text-sm text-muted-foreground">
                  {alert.details}
                </p>
              </div>
              <div className="ml-auto font-medium">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</div>
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
