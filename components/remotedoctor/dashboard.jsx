"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Stethoscope, UserPlus } from "lucide-react";
import HealthTips from "./HealthTips";
import { useDoctorDashboard } from "@/hooks/dashboard.hook";
import SkeletonCard from "../ui/skeletoncard";
import {
  getTotalUserConsultations,
  fetchPendingConsultations,
} from "../shared/api"; // Adjust the import path as needed
import { fetchReferralsByConsultant } from "../shared/api";
const Dashboard = ({currentDashboard}) => {
    const session = useSession();
    const [referrals, setReferrals] = useState([]);
  
    const [consultations, setConsultations] = useState(null);
    const [pendindConsultations, setPendingConsultations] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  const { data, isLoading, isError, isSuccess } = useDoctorDashboard();

  

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
  
    // Filter referrals based on status and normalized referralType
    const count = referrals.filter(
      (referral) => 
        referral.status === "pending" &&
        referral.referralType.replace(/\s+/g, "").toLowerCase() === normalizedDashboard
    ).length;
  
    setPendingreferralCount(count);
  
    console.log("Filtered Pending Referrals:", count);
  
  }, [referrals, currentDashboard]); // Re-run when referrals or currentDashboard changes
  



  const [totalFilteredConsultations, setTotalFilteredConsultations] = useState(0);

  useEffect(() => {
    if (!consultations || typeof consultations !== "object") {
      console.error("Consultations data is invalid:", consultations);
      return;
    }
  
    // Extract arrays from the object
    const { medications = [], labTests = [], diagnoses = [], examinations = [] } = consultations;
  
    // Filtering each array based on the requestedByAccType / diagnosedByAccType / examinedByAccType
    const filteredMedications = medications.filter(med => med.requestedByAccType === currentDashboard);
    const filteredLabTests = labTests.filter(lab => lab.requestedByAccType === currentDashboard);
    const filteredDiagnoses = diagnoses.filter(diag => diag.diagnosedByAccType === currentDashboard);
    const filteredExaminations = examinations.filter(exam => exam.examinedByAccType === currentDashboard);
  
    // Calculate total filtered consultations
    const totalFiltered = filteredMedications.length + filteredLabTests.length + filteredDiagnoses.length + filteredExaminations.length;
    setTotalFilteredConsultations(totalFiltered);
 
  
  }, [consultations, currentDashboard]);


  const [totalPendingConsultations, setTotalPendingConsultations] = useState(0);
  

  
  useEffect(() => {
    if (!consultations || !referrals) return;
  
    // Extract patient IDs from ALL consultation categories
    const consultedPatientIds = new Set([
      ...(consultations.medications || []).map((med) => med.patient),
      ...(consultations.labTests || []).map((lab) => lab.patient),
      ...(consultations.diagnoses || []).map((diag) => diag.patient),
      ...(consultations.examinations || []).map((exam) => exam.patient),
    ]);
  
    // Filter referrals: Keep only those where the patient does NOT exist in consultations
    const pendingConsultations = referrals.filter(
      (referral) => !consultedPatientIds.has(referral.patient?._id)
    );
  
    // Update the pending consultations count
    setTotalPendingConsultations(pendingConsultations.length);
  
    console.log("Total Pending Consultations:", pendingConsultations.length);
  }, [consultations, referrals]);
  


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

  
  console.log('referrals')
  console.log(referrals)
  console.log(consultations)

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
