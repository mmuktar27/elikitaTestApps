import React from "react";
import { PatientsPage } from "../../../components/shared/";

const Patients = () => {
  const currentDashboard = "healthcare admin";
  return <PatientsPage currentDashboard={currentDashboard} />;
};

export default Patients;
