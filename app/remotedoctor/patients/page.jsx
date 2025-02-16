import React from "react";
import { PatientsPage } from "@/components/shared";

const Patients = () => {
  const currentDashboard="remote doctor"
   return <PatientsPage currentDashboard={currentDashboard}/>;
};

export default Patients;
