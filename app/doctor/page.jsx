"use client";

import { DashboardComponent } from "@/components/doctor";

function Dashboard() {
  const currentDashboard="doctor"

  return <DashboardComponent currentDashboard={currentDashboard}/>;
}

export default Dashboard;
