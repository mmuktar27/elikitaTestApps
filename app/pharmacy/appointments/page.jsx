import React from "react";
import { AppointmentsPage } from "@/components/shared";

const Appointments = () => {
  const currentDashboard="doctor"

  return <AppointmentsPage  currentDashboard={currentDashboard}/>;
};

export default Appointments;
