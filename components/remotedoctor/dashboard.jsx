"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState,useCallback  } from "react";
import { SurveyPopup } from '../shared';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Stethoscope, UserPlus } from "lucide-react";
import { HealthyTips } from "../shared";

import { formatDistanceToNow } from 'date-fns';
import {
  fetchPatients,
  fetchPendingConsultations,
  fetchReferralsByConsultant,
  fetchRemoteDoctorRecenAlerts,
  getTotalUserConsultations,
} from "../shared/api"; // Adjust the import path as needed

const activityTypeColors = { 
  'Patient Creation': 'bg-green-500',
  'Referral Creation': 'bg-teal-500',
  'Medication Creation': 'bg-indigo-500',
  'Appointment Creation': 'bg-blue-500',
  'Appointment Update': 'bg-purple-500',
  'Labtest Creation': 'bg-orange-500',
  'Examination Creation': 'bg-pink-500',
  'Diagnosis Creation': 'bg-cyan-500',
  'Patient Update': 'bg-yellow-500',
};
const RemoteDoctorDashboard = ({currentDashboard}) => {
    const session = useSession();
    const [referrals, setReferrals] = useState([]);
    const [patients, setPatients] = useState(null);

    const [consultations, setConsultations] = useState(null);
    const [pendindConsultations, setPendingConsultations] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const getAlerts = async () => {
      try {
        const data = await fetchRemoteDoctorRecenAlerts(5);
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
  

  useEffect(() => {
    let isMounted = true;
    const userId = session?.data?.user?.id;

    if (!userId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [consultations, pendingPatients, referralsData] =
          await Promise.all([
            getTotalUserConsultations(userId),
            fetchPendingConsultations(),
            fetchReferralsByConsultant(userId),
          ]);

        if (!isMounted) return;
//console.log(consultations)
        setConsultations(consultations);
        setPendingConsultations(pendingPatients);
        setReferrals(referralsData.data.referrals);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load data:", error);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [session?.data?.user?.id]);

  const [pendingReferalCount, setPendingreferralCount] = useState(0);

useEffect(() => { 
    if (!Array.isArray(referrals)) {
      console.error("Referrals data is not an array:", referrals);
      return;
    }
  
    // Normalize `currentDashboard` (remove spaces, lowercase)
    const normalizedDashboard = currentDashboard.replace(/\s+/g, "").toLowerCase();
   // console.log('normalizedDashboard')

  //console.log(normalizedDashboard)

  //console.log(referrals)
  // Filter referrals based on status and normalized referralType
    const count = referrals.filter(
      (referral) => 
        referral.status === "pending" &&
        referral.referralType.replace(/\s+/g, "").toLowerCase() === normalizedDashboard
    ).length;
  

    setPendingreferralCount(count);
  
   // console.log("Filtered Pending Referrals:", count);
  
  }, [referrals, currentDashboard]); // Re-run when referrals or currentDashboard changes
  



  const [totalFilteredConsultations, setTotalFilteredConsultations] = useState(0);

  useEffect(() => {
    if (!consultations || typeof consultations !== "object") {
      console.error("Consultations data is invalid:", consultations);
      return;
    }
    const normalizedDashboard = currentDashboard.replace(/\s+/g, "").toLowerCase();


    // Extract arrays from the object
    const { medications = [], labTests = [], diagnoses = [], examinations = [] } = consultations;
  
    const uniquePatients = new Set();

    // Collect unique patient IDs while filtering by account type and user ID
    medications
      .filter(med => med.requestedByAccType === normalizedDashboard && med.requestedBy === session?.data?.user?.id)
      .forEach(med => uniquePatients.add(med.patient));
    
    labTests
      .filter(lab => lab.requestedByAccType === normalizedDashboard && lab.requestedBy === session?.data?.user?.id)
      .forEach(lab => uniquePatients.add(lab.patient));
    
    diagnoses
      .filter(diag => diag.diagnosedByAccType === normalizedDashboard && diag.diagnosedBy === session?.data?.user?.id)
      .forEach(diag => uniquePatients.add(diag.patient));
    
    examinations
      .filter(exam => exam.examinedByAccType === normalizedDashboard && exam.examinedBy === session?.data?.user?.id)
      .forEach(exam => uniquePatients.add(exam.patient));
    
    // The size of the Set gives the number of unique patient consultations
    setTotalFilteredConsultations(uniquePatients.size);
    
  
  }, [consultations, currentDashboard, session?.data?.user?.id]);


  const [totalPendingConsultations, setTotalPendingConsultations] = useState(0);
  

  
  useEffect(() => {
    if (!consultations || !referrals) return;
  
    const normalizedDashboard = currentDashboard.replace(/\s+/g, "").toLowerCase();

    // Extract patient IDs from ALL consultation categories
    const consultedPatientIds = new Set([
      ...(consultations.medications || [])
          .filter(med => med.requestedByAccType === normalizedDashboard && med.requestedBy === session?.data?.user?.id)
          .map(med => med.patient),
      ...(consultations.labTests || [])
          .filter(lab => lab.requestedByAccType === normalizedDashboard && lab.requestedBy === session?.data?.user?.id)
          .map(lab => lab.patient),
      ...(consultations.diagnoses || [])
          .filter(diag => diag.diagnosedByAccType === normalizedDashboard && diag.diagnosedBy === session?.data?.user?.id)
          .map(diag => diag.patient),
      ...(consultations.examinations || [])
          .filter(exam => exam.examinedByAccType === normalizedDashboard && exam.examinedBy === session?.data?.user?.id)
          .map(exam => exam.patient),
  ]);
  
  // Filter referrals: Keep only those where the patient does NOT exist in consultations
  const pendingConsultations = referrals.filter(referral => 
    !consultedPatientIds.has(referral.patient?._id) &&
    referral.referredTo === session?.data?.user?.id &&
    referral.referralType === normalizedDashboard
);

  
    // Update the pending consultations count
    setTotalPendingConsultations(pendingConsultations.length);
  
    //console.log("Total Pending Consultations:", pendingConsultations.length);
  }, [consultations, currentDashboard, referrals, session?.data?.user?.id]);
  
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
        const data = await fetchEligibleSurveys('remote doctor', session.data.user.id);
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

  const timeout = setTimeout(loadSurvey, 1000); // Show survey after 1 second

  return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-run
}, [surveys]);




  const cardData = [
    {
      title: "Total Consultations",
      value: totalFilteredConsultations || 0,
      /*   description: "+20.1% from last month", */
      icon: <Stethoscope className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#75C05B]/10",
    },
    {
      title: "Pending Consultations",
      value: totalPendingConsultations || 0,
      /*   description: "+15% from yesterday", */
      icon: <Activity className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#B24531]/10",
    },
    {
      title: "Pending Patient",
      value: pendingReferalCount || 0,
      /*       description: "3 new since last week", */
      icon: <UserPlus className="size-4 text-muted-foreground" />,
      bgColor: "bg-[#007664]/10",
    },
  ];

  if (loading) {
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
          <strong>{eventAlert?.subject}</strong> at <strong>{eventAlert?.time}</strong>
        </p>
      </div>
      <div className="ml-auto text-sm font-medium text-blue-700">⏰</div>
    </div>
  )}
      {alerts
        .filter((alert) => {
          // Check for Referral Creation first
          if (
            alert.activityType === "Referral Creation" &&
            alert.entityId?.referredTo === session?.data?.user?.id &&
            alert.entityId?.referralType.toLowerCase().replace(/\s+/g, '') === currentDashboard.toLowerCase().replace(/\s+/g, '')
          ) {
            return true;
          }

          // For Labtest Creation
          if (
            alert.activityType === "Labtest Creation" &&
            alert.entityId?.requestedByAccType.toLowerCase().replace(/\s+/g, '') === currentDashboard.toLowerCase().replace(/\s+/g, '') &&
            alert.entityId?.requestedBy === session?.data?.user?.id
          ) {
            return true;
          }

          // For Medication Creation
          if (
            alert.activityType === "Medication Creation" &&
            alert.entityId?.requestedByAccType.toLowerCase().replace(/\s+/g, '') === currentDashboard.toLowerCase().replace(/\s+/g, '') &&
            alert.entityId?.requestedBy === session?.data?.user?.id
          ) {
            return true;
          }

          // For Diagnosis Creation
          if (
            alert.activityType === "Diagnosis Creation" &&
            alert.entityId?.diagnosedByAccType.toLowerCase().replace(/\s+/g, '') === currentDashboard.toLowerCase().replace(/\s+/g, '') &&
            alert.entityId?.diagnosedBy === session?.data?.user?.id
          ) {
            return true;
          }

          // For Examination Creation
          if (
            alert.activityType === "Examination Creation" &&
            alert.entityId?.examinedByAccType.toLowerCase().replace(/\s+/g, '') === currentDashboard.toLowerCase().replace(/\s+/g, '') &&
            alert.entityId?.examinedBy === session?.data?.user?.id
          ) {
            return true;
          }

          // If none of the conditions match, filter out this alert
          return false;
        })
        .map((alert, index) => {
          const patient = patients.find(p => p._id === alert.entityId?.patient);
          const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";

          // Generate dynamic alert message based on activity type
          let alertMessage = alert.details;
          if (alert.activityType.toLowerCase().includes("medication")) {
            alertMessage = `Medication dispensed for ${patientName}`;
          } else if (alert.activityType.toLowerCase().includes("diagnosis")) {
            alertMessage = `Diagnosis recorded for ${patientName}`;
          } else if (alert.activityType.toLowerCase().includes("examination")) {
            alertMessage = `Examination conducted for ${patientName}`;
          } else if (alert.activityType.toLowerCase().includes("labtest")) {
            alertMessage = `Lab test requested for ${patientName} `;
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
                    activityTypeColors[alert.activityType] || "bg-gray-400"
                  }`}
                ></span>
              </span>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {alert.activityType}
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
    userId={user?.id}
    onClose={() => setActiveSurvey(null)}
    onSubmit={handleSubmitSurvey}
  />
)}

      {/* Health Tips Section */}
      <div className="fixed bottom-6 right-6 z-50">
        <HealthyTips currentDashboard={currentDashboard}/>
      </div>
    </div>
  );
};

export default RemoteDoctorDashboard;
