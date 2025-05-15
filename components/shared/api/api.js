
import axios from 'axios';
import { getSession } from "next-auth/react";






const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Secret': 'hello',
  },
});




api.interceptors.request.use(
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
    return Promise.reject(error);
  },
);



const ENDPOINTS = {
    heartbeat: '/heartbeat',
    staff:'/staff',
    appointments:'/appointments',
    auditlogs:'/auditlogs',
    bookingurl:'/bookingurl',
    diagnosis:'/diagnosis',
    examination:'/examination',
    healthytips:'healthytips',
    auditlogs:'/auditlogs',
    admin:'/admin',
    utility:'/utility',
    survey:'/survey',
    referral:'/referral',
    recentalerts:'/recentalerts',
    visithistory:'/visithistory',
    patients:'/patients',
    medication:'/medication',
    lab:'/lab'

    // You can add more endpoints here as needed, e.g., /auth, /users, etc.
  };
  
  export { api, ENDPOINTS };