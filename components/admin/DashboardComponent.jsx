"use client";

import { useGetStaffMetrics } from "@/hooks/admin";
import { Activity, BarChart2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { PatientIcon, StaffIcon } from "../icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SkeletonCard from "../ui/skeletoncard";
import { useSystemAdminDashboard } from "../../hooks/dashboard.hook";
import { formatDistanceToNow } from 'date-fns';
import {fetchAdminRecenAlerts} from "../shared/api"
import {fetchPatients} from "../shared/api"


const activityTypeColors = {
  'Patient Creation': 'bg-green-500',
  'Patient Archive': 'bg-red-500',
  'Patient Update': 'bg-yellow-500',
  'Appointment Creation': 'bg-blue-500',
  'Appointment Update': 'bg-purple-500',
  'Appointment Deletion': 'bg-gray-500',
  'Default Creation': 'bg-green-400',
  'Default Update': 'bg-yellow-400',
  'Default Deletion': 'bg-red-400',
};


const SystemAdminDashboard = () => {
  const {
    data: systemAdminData,
    isLoading: systemAdminLoading,
    isSuccess: systemAdminSuccess,
    isError: systemAdminError,
  } = useSystemAdminDashboard();

    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState(null);
  const [patients, setPatients] = useState(null);
  
    useEffect(() => {
      const getAlerts = async () => {
        try {
          const data = await fetchAdminRecenAlerts(5);
          setAlerts(data);
        } catch (err) {
          setError(err.message);
        }
      };
  
      getAlerts();
    }, []);
  
 useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getPatients();
  }, []);

  console.log('alerts')
  console.log(alerts)

  
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
            <div className="text-2xl font-bold">{patients?.length}</div>
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
      {alerts
        .map((alert, index) => {
          // Find patient associated with the alert
          const patient = patients.find(p => p._id === alert.entityId?.patient);
          const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";

          // Define a dynamic alert title and message
          let alertTitle = alert.activityType;
          let alertMessage = alert.details;

          if (alert.activityType === "Referral Creation") {
            alertTitle = "New Patient Referral";
            alertMessage = `${patientName} has been referred`;
          } else if (alert.activityType.toLowerCase().includes("medication")) {
            alertMessage = `Medication dispensed for ${patientName} is requested`;
          } else if (alert.activityType.toLowerCase().includes("diagnosis")) {
            alertMessage = `Diagnosis recorded for ${patientName} is diagnosed`;
          } else if (alert.activityType.toLowerCase().includes("examination")) {
            alertMessage = `Examination conducted for ${patientName} is examined`;
          } else if (alert.activityType.toLowerCase().includes("labtest")) {
            alertMessage = `Lab test requested for ${patientName} is requested`;
          }

          return (
            <div className="flex items-center" key={index}>
              <span className="relative mr-2 flex size-3">
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full ${
                    activityTypeColors[alert.activityType] || "bg-gray-400"
                  } opacity-75`}
                ></span>
                        <span
              className={`relative inline-flex size-3 rounded-full ${
                activityTypeColors[alert.activityType] ||
                (alert.activityType.includes('Creation') ? 'bg-green-400' :
                alert.activityType.includes('Update') ? 'bg-yellow-400' :
                (alert.activityType.includes('Delete') || alert.activityType.includes('Deletion')) ? 'bg-red-400' : 'bg-gray-400')
              }`}
            ></span>

              </span>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {alertTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {alertMessage}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {formatDistanceToNow(new Date(alert.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          );
        })}
    </div>
  </CardContent>
</Card>

      </div>
    );
  }

  return null;
};

export default SystemAdminDashboard;
