import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";
import { useSession } from "next-auth/react";

const URL = "/appointments";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.post(`${URL}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err) => {
      console.error("Error creating appointment:", err);
    },
  });
};

export const useGetAppointments = () => {
  const { data: session } = useSession();
  return useQuery({
    queryFn: () => API.get(`${URL}`),
    queryKey: ["appointments"],
    onSuccess: (res) => {
      console.log("Fetched appointments:", res);
    },
    onError: (err) => {
      console.error("Error fetching appointments:", err);
    },
    enabled: !!session?.user?.name,
  });
};

export const useGetPatientAppointments = (patientReference) => {
  const { data: session } = useSession();
  return useQuery({
    queryFn: () => API.get(`${URL}/patient/${patientReference}`),
    queryKey: ["appointments", patientReference],
    onSuccess: (res) => {
      console.log("Fetched patient appointments:", res);
    },
    onError: (err) => {
      console.error("Error fetching patient appointments:", err);
    },
    enabled: !!patientReference && !!session?.user?.name,
  });
};

export const useGetAppointmentById = (appointmentId) => {
  const { data: session } = useSession();
  return useQuery({
    queryFn: () => API.get(`${URL}/${appointmentId}`),
    queryKey: ["appointment", appointmentId],
    onSuccess: (res) => {
      console.log("Fetched appointment:", res);
    },
    onError: (err) => {
      console.error("Error fetching appointment:", err);
    },
    enabled: !!appointmentId && !!session?.user?.name,
  });
};

export const useUpdateAppointment = (appointmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.patch(`${URL}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointmentId],
      });
      console.log("Updated appointment:", res);
    },
    onError: (err) => {
      console.error("Error updating appointment:", err);
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId) => API.delete(`${URL}/${appointmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err) => {
      console.error("Error deleting appointment:", err);
    },
  });
};
