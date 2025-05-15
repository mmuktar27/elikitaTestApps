import { api, ENDPOINTS } from './api'; 



//const API_URL = 'http://localhost:4000/api/v2/admin';


//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/admin";





export const getUserByEmail = async (email) => {
   // console.log(`[getUserByEmail] Attempting to fetch user with email: ${email}`);
    try {
     // console.log(`[getUserByEmail] Making API request to: ${API_URL}/users/email/${email}`);
      const response = await api.get(`${ENDPOINTS.admin}/users/email/${email}`);
     // console.log(`[getUserByEmail] Success! User data received:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[getUserByEmail] Error fetching user with email ${email}:`, error);
      if (error.response) {
        console.error(`[getUserByEmail] Server responded with status: ${error.response.status}`);
        console.error(`[getUserByEmail] Response data:`, error.response.data);
      } else if (error.request) {
        console.error(`[getUserByEmail] No response received from server`);
      } else {
        console.error(`[getUserByEmail] Error setting up request:`, error.message);
      }
      throw error;
    }
  };


  export const createUser = async (data) => {
    try {
      const response = await api.post(`${ENDPOINTS.admin}/createAUser`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };
  

