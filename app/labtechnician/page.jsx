"use client";

import { DoctorsDashboard } from "@/components/doctor";

function Dashboard() {
  const currentDashboard="doctor"

  return (
  <DoctorsDashboard currentDashboard={currentDashboard}/>

  );
}

export default Dashboard;
