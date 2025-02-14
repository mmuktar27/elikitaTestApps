import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";

const URL = "/staff";

export const useGetCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await API.get(`${URL}/currentUser/${options.userId}`);
      return response.data;
    },
    enabled: options.enabled,
  });
};
