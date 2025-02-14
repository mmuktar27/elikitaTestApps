import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";
import { useSession } from "next-auth/react";

const URL = "/publicevents";

export const useGetEvents = () => {
  return useQuery({
    queryFn: () => API.get(`${URL}/`),
    queryKey: ["events"],
    onSuccess: (res) => {
      console.log("orange", res);
    },
    onError: (err) => {
      console.error("pineapples", err);
    },
  });
};

export const useGetEventsByParticipant = () => {
  const session = useSession();
  const roles = session.data?.user?.roles || ["public"];
  return useQuery({
    queryFn: () => API.post(`${URL}/by-participants`, { participants: roles }),
    queryKey: ["events", "participants", roles],
    onSuccess: (res) => {
      console.log("Events by participants fetched:", res);
    },
    enabled: roles.length > 0,
    onError: (err) => {
      console.error("Error fetching events by participants:", err);
    },
  });
};

export const useGetEventsByParticipants = () => {
  const session = useSession();
  const roles = session.data?.user?.roles || [];

  const queryParams = roles.includes("system admin") ? {} : { roles };

  return useQuery({
    queryFn: () => API.get(`${URL}/participant/one`, { params: queryParams }),
    queryKey: ["events", roles],
    onSuccess: (res) => {
      console.log("Events fetched successfully", res);
    },
    onError: (err) => {
      console.error("Error fetching events", err);
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (eventData) => API.post(`${URL}/`, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    enabled: !!session?.user?.name,
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, ...eventData }) => API.put(`${URL}/${id}`, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    enabled: !!session?.user?.name,
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id) => API.delete(`${URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    enabled: !!session?.user?.name,
  });
};
