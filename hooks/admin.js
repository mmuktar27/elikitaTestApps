import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";

const URL = "/admin";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.post(`${URL}/createAUser`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useGetStaff = () => {
  return useQuery({
    queryFn: () => API.get(`${URL}/staff`),
    queryKey: ["staff"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useGetStaffMetrics = () => {
  return useQuery({
    queryFn: () => API.get(`${URL}/users-metrics`),
    queryKey: ["staffmetrics"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useGetADStaff = () => {
  return useQuery({
    queryFn: () => API.get(`${URL}/ad-staff`),
    queryKey: ["staff"],
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useGetAStaff = (userId) => {
  return useQuery({
    queryFn: () => API.get(`${URL}/user/${userId}`),
    queryKey: ["staff", userId],
    enabled: !!userId,
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useUpdateAStaff = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.patch(`${URL}/user/${userId}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff", userId] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.patch(`${URL}/staff/${data.id}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => API.delete(`${URL}/user/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useUpdateSystemSettings = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.put(`${URL}/systemsettings/`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["systemsettings", userId] });
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useGetSystemSettings = (userId) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryFn: () => API.get(`${URL}/systemsettings/`),
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
