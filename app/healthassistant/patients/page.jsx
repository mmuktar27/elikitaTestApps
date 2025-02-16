import React from "react";
import { PatientsPage } from "../../../components/shared/";

const Patients = () => {
  const currentDashboard="healthcare assistant"
  return <PatientsPage currentDashboard={currentDashboard}/>;
};

export default Patients;
