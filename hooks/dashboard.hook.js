import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";
import { getServerSession } from "next-auth";
const DASHBOARD_URL = "/dashboard";
import { useSession } from "next-auth/react";

export const useSystemAdminDashboard = () => {
  const { data: session } = useSession();
  const role = session?.user?.roles;
  return useQuery({
    queryKey: ["dashboard", "systemAdmin"],
    queryFn: () => API.get(`${DASHBOARD_URL}/system-admin`),
    onSuccess: (res) => {
      console.log("System Admin Dashboard Data:", res);
    },
    onError: (err) => {
      console.error("Error fetching System Admin Dashboard:", err);
    },
    enabled: !!session,
  });
};

export const useHealthcareAdminDashboard = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["dashboard", "healthcareAdmin"],
    queryFn: () => API.get(`${DASHBOARD_URL}/healthcare-admin`),
    onSuccess: (res) => {
      console.log("Healthcare Admin Dashboard Data:", res);
    },
    onError: (err) => {
      console.error("Error fetching Healthcare Admin Dashboard:", err);
    },
    enabled: !!session,
  });
};

export const useDoctorDashboard = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["dashboard", "doctor"],
    queryFn: () => API.get(`${DASHBOARD_URL}/doctor`),
    onSuccess: (res) => {
      console.log("Doctor Dashboard Data:", res);
    },
    onError: (err) => {
      console.error("Error fetching Doctor Dashboard:", err);
    },
    enabled: !!session,
  });
};
