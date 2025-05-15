"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity, BarChart2, CalendarCheck, Users, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState,useCallback  } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSystemAdminDashboard } from "../../hooks/dashboard.hook";
import { PatientIcon, StaffIcon } from "../icons";
import { SurveyPopup } from '../shared';
import {
  fetchAdminRecenAlerts, fetchHealthWorkerStatistics, fetchPatients,
  getActiveConsultations, getActiveUsers
} from "../shared/api";
import { createWebSocket } from "../shared/api/websocket";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SkeletonCard from "../ui/skeletoncard";
const activityTypeColors = {
  "Patient Creation": "bg-green-500",
  "Patient Archive": "bg-red-500",
  "Patient Update": "bg-yellow-500",
  "Appointment Creation": "bg-blue-500",
  "Appointment Update": "bg-purple-500",
  "Appointment Deletion": "bg-gray-500",
  "Default Creation": "bg-green-400",
  "Default Update": "bg-yellow-400",
  "Default Deletion": "bg-red-400",
};

const PlatformUsageCard = ({ activeUsers, chartData }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [wsActiveUsers, setwsActiveUsers] = useState(0);

  useEffect(() => {
    const connection = createWebSocket((data) => {
      if (data.type === "activeUsers") {
        setwsActiveUsers(data.data.activeUsers);
      }
    });
  
    return () => connection.close();

  }, []);
  const chartData1 = Array.from({ length: wsActiveUsers }, (_, i) => ({ id: i + 1, total: 1 }));
    

  return (
    <>
      {/* Card */}
      <div 
        className="cursor-pointer rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
        onClick={openModal}
      >
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-2xl font-medium">Platform Usage Report</h3>
          <BarChart2 className="size-4 text-gray-500" />
        </div>
        <div className="text-lg font-bold">
          {wsActiveUsers} Active Users
        </div>
        {/*<p className="text-xs text-gray-500"> N/A</p>*/}
        <div className="mt-4 h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-11/12 max-w-4xl rounded-lg bg-white p-6">
                 
          <button onClick={closeModal} 
     className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
     >
              <X size={20} />
            </button>
            <CardHeader className="flex items-center justify-center rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
  <span className="flex items-center gap-2">
    <CalendarCheck className="size-6" />
    <h2 className="text-2xl font-bold">Monthly User Login Activity</h2>
  </span>
</CardHeader>
            
            <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={chartData}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis 
      dataKey="name" 
      tick={{ fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: '#E0E0E0' }}
    />
    <YAxis 
      tick={{ fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: '#E0E0E0' }}
      tickFormatter={(value) => value.toLocaleString()}
      domain={[0, 'auto']}
      allowDecimals={false}
    />
    <Tooltip 
      formatter={(value) => [`${value.toLocaleString()} logins`, "Monthly Logins"]}
      labelFormatter={(label) => `Month: ${label}`}
      cursor={{ fill: 'rgba(173, 250, 29, 0.1)' }}
    />
    <Legend verticalAlign="top" height={36} />
    <Bar
      name="Monthly User Logins"
      dataKey="total"
      radius={[4, 4, 0, 0]}
    >
      {chartData.map((entry, index) => (
        <Cell 
          key={`cell-${index}`} 
          fill={entry.total > 30 ? "#004d40" : "#b7410e"} 
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>This chart shows the total number of user logins per month.</p>
              <p className="mt-2">Current active users: <span className="font-medium">{wsActiveUsers}</span></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
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
  const session = useSession();



  const [wsRalert, setwsRalert] = useState(0);

  useEffect(() => {
    // Create the WebSocket connection
    const socket = createWebSocket((data) => {
      if (data.type === "recentAlerts") {
        setAlerts(data?.data?.recentAlerts);
      }
    });
  
    // For cleanup, check if socket exists and is a WebSocket object
    return () => socket.close();

  }, []);



  const [activeConsult, setConsult] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});
  const [activeSessionUsers, setActiveSessionUsers] = useState({});


  useEffect(() => {
    const fetchConsult = async () => {
      try {
        const data = await getActiveConsultations();
        setConsult(data);
      } catch (error) {
        console.error("Failed to load patients.");
      } finally {
        // setLoading(false);
      }
    };

    fetchConsult();
  }, []);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchHealthWorkerStatistics();
      setStats(data);
    };
    loadStats();
  }, []);

  useEffect(() => {
    const getAlerts = async () => {
      try {
        const data = await fetchAdminRecenAlerts(5);
        setAlerts(data);
      } catch (err) {
        setError(err.message);
      }
    };

   // getAlerts();
  }, []);
  // console.log(alerts)

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await getActiveUsers(); // Replace with your actual API URL
        setActiveUsers(response);
      } catch (error) {
        console.error("Error fetching active users:", error);
      } finally {
        //  setLoading(false);
      }
    };

    fetchActiveUsers();
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

  const fetchUpcomingEvents = useCallback(async () => {
    if (!session || !session.data?.user?.workEmail) {
      console.error("No valid session or user email found");
      return [];
    }
  
    try {
      const accessToken =
        session.accessToken ||
        session.user?.accessToken ||
        session.data?.accessToken;
  
      if (!accessToken) {
        throw new Error("Access token not found in session");
      }
  
      const now = new Date().toISOString(); // Current date-time
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // 3 months into the future
      const end = endDate.toISOString();
  
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now}&endDateTime=${end}&$select=subject,start,end,attendees`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching upcoming events: ${errorText}`);
      }
  
      const data = await response.json();
  
      // Filter for future events where current user is an attendee
      // and subject does not include "Cancelled"
      const upcomingEvents = data.value.filter(event => {
        const eventStart = new Date(event.start?.dateTime);
        const isFuture = eventStart > new Date();
        const isUserAttendee = event.attendees?.some(att =>
          att.emailAddress?.address?.toLowerCase() === session.data.user.workEmail.toLowerCase()
        );
        const isNotCancelled = !event.subject.includes("Canceled:");
  
        return isFuture && isUserAttendee && isNotCancelled;
      });
  
      console.log("Upcoming Events Count:", upcomingEvents.length);
      return upcomingEvents;
    } catch (err) {
      console.error("Failed to fetch upcoming events:", err);
      return [];
    }
  }, [session]);
  
  const [upcomingCount, setUpcomingCount] = useState(0);
const [upcomingList, setUpcomingList] = useState([]);


useEffect(() => {
  const loadUpcomingEvents = async () => {
    const events = await fetchUpcomingEvents();
    setUpcomingCount(events.length);
    setUpcomingList(events);
  };

  loadUpcomingEvents();
}, [fetchUpcomingEvents]);

const [eventAlert, setEventAlert] = useState(null);


useEffect(() => {
  if (upcomingList.length === 0) {
    setEventAlert(null);
    return;
  }

  const now = new Date();

  // Sort by the closest start time
  const sortedEvents = [...upcomingList].sort((a, b) => {
    const aStart = new Date(a.start.dateTime);
    const bStart = new Date(b.start.dateTime);
    return aStart - bStart;
  });

  const closestEvent = sortedEvents.find(event => new Date(event.start.dateTime) > now);

  if (closestEvent) {
    const startDate = new Date(closestEvent.start.dateTime);

    // Format: e.g. "Thursday, 12 PM"
    const formattedTime = startDate.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setEventAlert({
      subject: closestEvent.subject || "No Title",
      time: formattedTime,
    });
  } else {
    setEventAlert(null);
  }
}, [upcomingList]);



 const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const loadSurveys = async () => {
      if (!session?.data?.user?.id) return; // Ensure session exists before fetching
  
      try {
        const data = await fetchEligibleSurveys('system admin', session.data.user.id);
        setSurveys(data);
      } catch (err) {
        console.log('Failed to fetch surveys');
      }
    };
  
    loadSurveys();
  }, [session?.data?.user?.id]);

  const [activeSurvey, setActiveSurvey] = useState(null);
  
  useEffect(() => {
    // Fetch active survey or set from props
    const loadSurvey = () => {
      if (!surveys || !Array.isArray(surveys) || surveys.length === 0) {
        console.warn("No surveys available to set as active.");
        return;
      }
  
      const firstSurvey = surveys[0]; // Get the first survey from the list
  
      setActiveSurvey({
        _id: firstSurvey._id,
        title: firstSurvey.title,
        questions: firstSurvey.questions?.map((q) => ({
          id: q._id,
          question: q.question,
          type: q.type,
          options: q.options || [],
        })) || [],
      });
    };
  
    const timeout = setTimeout(loadSurvey, 10000); // Show survey after 1 second
  
    return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-run
  }, [surveys]);
  






  //console.log("stats");

  //console.log(alerts);
  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  } // Convert object values to string if needed

  if (systemAdminLoading) {
    return <SkeletonCard />;
  }

  if (systemAdminError) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  if (systemAdminSuccess && systemAdminData) {
    const { totalStaff, activeConsultations, staffByRole, recentAlerts } =
      systemAdminData?.data;

    //  console.log(staffByRole)

  // Dynamic count of active users
   // const chartData = Array.from({ length: activeUsers?.activeUsers }, (_, i) => ({ id: i + 1, total: 1 }));
    
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
            <div className="text-2xl font-bold">
              {activeConsult?.length || 0}
            </div>
            {/*             <p className="text-xs text-gray-500"> N/A</p> */}
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
          <PlatformUsageCard 
    activeUsers={activeSessionUsers?.data?.activeUsers || 0} 
    chartData={activeUsers?.monthlyLogins} 
  />
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
              {eventAlert && (
    <div className="flex items-center rounded-md border border-blue-200 bg-blue-50 p-3 shadow-sm">
      <span className="relative mr-2 flex size-3">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-blue-600"></span>
      </span>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-semibold leading-none text-blue-900">
          Upcoming Event
        </p>
        <p className="text-sm text-blue-800">
          <strong>{eventAlert.subject}</strong> at <strong>{eventAlert.time}</strong>
        </p>
      </div>
      <div className="ml-auto text-sm font-medium text-blue-700">⏰</div>
    </div>
  )}
              {alerts.map((alert, index) => {
                // Find patient associated with the alert
                const patient = patients?.find(
                  (p) => p._id === alert.entityId?.patient,
                );
                const patientName = patient
                  ? `${capitalizeFirstLetter(patient.firstName)} ${capitalizeFirstLetter(patient.lastName)}`
                  : "Unknown Patient";

                // Define a dynamic alert title and message
                let alertTitle = alert.activityType;
                let alertMessage = alert.details;

                if (alert.activityType === "Referral Creation") {
                  alertTitle = "New Patient Referral";
                  alertMessage = `${patientName} has been referred`;
                } else if (
                  alert.activityType.toLowerCase().includes("medication")
                ) {
                  alertMessage = `Medication dispensed for ${patientName} `;
                } else if (
                  alert.activityType.toLowerCase().includes("diagnosis")
                ) {
                  alertMessage = `Diagnosis recorded for ${patientName} `;
                } else if (
                  alert.activityType.toLowerCase().includes("examination")
                ) {
                  alertMessage = `Examination conducted for ${patientName}`;
                } else if (
                  alert.activityType.toLowerCase().includes("labtest")
                ) {
                  alertMessage = `Lab test requested for ${patientName}`;
                } else if (alert.activityType.toLowerCase().includes("login")) {
                  alertMessage = `User ${alert?.entityId?.firstName} ${alert?.entityId?.lastName} Login Successfully`;
                } else if (alert.details.toLowerCase().includes("timeout")) {
                  alertMessage = `User ${alert?.entityId?.firstName} ${alert?.entityId?.lastName}  was force logout by session timeout`;
                }else if (alert.activityType.toLowerCase().includes("logout")) {
                  alertMessage = `User ${alert?.entityId?.firstName} ${alert?.entityId?.lastName} Logout Successfully`;
                }else if (alert.activityType.toLowerCase().includes("inactive")) {
                  alertMessage = `User ${alert?.entityId?.firstName} ${alert?.entityId?.lastName} Marked as inactive`;
                }

                return (
                  <div className="flex items-center" key={index}>
                    <span className="relative mr-2 flex size-3">
                      <span
                        className={`absolute inline-flex size-full animate-ping rounded-full ${
                          activityTypeColors[alert.activityType] ||
                          "bg-gray-400"
                        } opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex size-3 rounded-full ${
                          activityTypeColors[alert.activityType] ||
                          (alert.activityType.includes("Creation")
  ? "bg-green-400"
  : alert.activityType.includes("Update")
    ? "bg-yellow-400"
    : alert.activityType.includes("Delete") || alert.activityType.includes("Deletion")
      ? "bg-red-400"
      : alert.activityType.includes("Login")
        ? "bg-blue-400"
        : alert.activityType.includes("Logout")
          ? "bg-purple-400"
          : "bg-gray-400")
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

        {activeSurvey?.questions?.length > 0 && (
  <SurveyPopup 
    survey={activeSurvey}
    userId={session?.data?.user?.id}
    onClose={() => setActiveSurvey(null)}
    onSubmit={handleSubmitSurvey}
  />
)}

      </div>
    );
  }

  return null;
};

export default SystemAdminDashboard;
