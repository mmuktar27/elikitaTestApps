import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";
import { useSession } from "next-auth/react";

const URL = "/patients";

export const useCreatePatient = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.post(`${URL}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
    enabled: !!session?.user?.name,
  });
};

export const useGetPatients = () => {
  const { data: session } = useSession();
  return useQuery({
    queryFn: () => API.get(`${URL}/`),
    queryKey: ["patients"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
    enabled: !!session?.user?.name,
  });
};

export const useGetPatient = (patientId) => {
  const { data: session } = useSession();
  return useQuery({
    queryFn: () => API.get(`${URL}/${patientId}`),
    queryKey: ["patients", patientId],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
    enabled: !!patientId && session?.user?.name,
  });
};

export const useUpdatePatient = (patientId) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.patch(`${URL}/${patientId}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId) => API.delete(`${URL}/${patientId}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
