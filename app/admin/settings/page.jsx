"use client";

import React from "react";
import SettingsComponent from "../../../components/admin/SettingsComponent";
import { useSession } from "next-auth/react";
const Settings = () => {
  const session = useSession();
const currenUserId = session?.data?.user?.id
  return <SettingsComponent currenUserId={currenUserId}/>;
};

export default Settings;
