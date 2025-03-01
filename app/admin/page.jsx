"use client"; // Required for useEffect in Next.js app router
import { getSystemSettings } from "@/components/shared/api";

import { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/admin";

const Dashboard = () => {

  return( 
  <>
  <AdminDashboard />
</>
);
};

export default Dashboard;
