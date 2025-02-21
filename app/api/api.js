import axios from "axios";
import { getSession } from "next-auth/react";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});
//baseURL: process.env.NEXT_PUBLIC_API_URL,
//baseURL: "http://localhost:4000/api/v2/",
API.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();

      if (session) {
        config.headers.Authorization = `Bearer ${session?.idToken}`;
        config.headers.userCred = session?.user;
        config.headers.userid = session?.user?.id;
        config.headers.userroles = session?.user?.roles;
      }
    } catch (error) {
      console.error("Error retrieving session:", error);
    }

    return config;
  },
  (error) => {
    // Handle errors before the request is sent
    return Promise.reject(error);
  },
);

export default API;