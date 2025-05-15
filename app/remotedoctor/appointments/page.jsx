import React from "react";
import { AppointmentsPage } from "@/components/shared";

const Appointments = () => {
  const currentDashboard="remote doctor"

  return <AppointmentsPage  currentDashboard={currentDashboard}/>;
};

export default Appointments;
