import React from "react";
import { Dashboard } from "@/components/remotedoctor";

const RemoteDoctorPage = () => {
  const currentDashboard="remote doctor"

  return <Dashboard currentDashboard={currentDashboard} />;
};

export default RemoteDoctorPage;
