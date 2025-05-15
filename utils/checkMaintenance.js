"use client"
import { getSystemSettings } from "@/components/shared/api";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default async function checkMaintenanceMode(session) {
    
  try {
    const settings = await getSystemSettings();
    const isMaintenanceMode = settings?.data?.maintenanceMode || false;
  // Allow access if user has the "admin" role
  if (session.data.user.roles.includes("system admin")) {
    return;
  }
    if (isMaintenanceMode) {
      redirect("/maintenance");
    }
  } catch (error) {
    console.error("Error fetching system settings:", error);
  }
}
