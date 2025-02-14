import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/api/api";
import { useSession } from "next-auth/react";

const URL = "/upload/images";

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (response) => {
      console.log("Image uploaded successfully:", response);
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
    enabled: !!session?.user?.name,
  });
};
