import React from "react";
import { RemoteDoctorDashboard } from "@/components/remotedoctor";

const RemoteDoctorPage = () => {
  const currentDashboard="remote doctor"

  return <RemoteDoctorDashboard currentDashboard={currentDashboard} />;
};

export default RemoteDoctorPage;
