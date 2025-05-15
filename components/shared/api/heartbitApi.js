import { api, ENDPOINTS } from './api'; 

//const API_URL = "http://localhost:4000/api/v2/heartbeat";

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/heartbeat'


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/heartbeat";


export const updateHeartbeat = async (data) => {
  try {
    const response = await api.put(ENDPOINTS.heartbeat, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating heartbeat:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Create a new session (POST request)
export const createSession = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.heartbeat, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating session:",
      error.response?.data || error.message,
    );
    throw error;
  }
};


export const checkInactiveUsers = async (apiKey) => {
  try {
    const response = await api.post(`${ENDPOINTS.heartbeat}/cron/heartbeat-check`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error running cron job:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get active users count (GET request)
export const getActiveSessionUsers = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.heartbeat}/users/active`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting active users count:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
