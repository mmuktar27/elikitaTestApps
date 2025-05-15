import React from "react";
import { AppointmentsPage } from "@/components/shared";

const Appointments = () => {
  const currentDashboard="healthcare assistant"

  return <AppointmentsPage  currentDashboard={currentDashboard}/>;
};

export default Appointments;
