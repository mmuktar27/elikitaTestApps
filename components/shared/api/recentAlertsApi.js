import { api, ENDPOINTS } from './api'; 

//const API_URL = "http://localhost:4000/api/v2/recentalerts";

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/recentalerts';


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/recentalerts";



/**
 * Fetches recent patient alerts from the API
 * @param limit Optional number of alerts to retrieve (default: 5)
 * @returns Promise resolving to an array of alerts
 */
export const fetchHealthAdminRecenAlerts = async (limit = 5) => {
  try {
    const response = await api.get(`${ENDPOINTS.recentalerts}/healthadmin`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent patient alerts:", error);
    throw error; // Re-throw to allow handling by the component
  }
};

export const fetchHealthAssistantRecenAlerts = async (limit = 5) => {
  try {
    const response = await api.get(`${ENDPOINTS.recentalerts}/healthassistant`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent patient alerts:", error);
    throw error; // Re-throw to allow handling by the component
  }
};

export const fetchDoctorRecenAlerts = async (limit = 5) => {
  try {
    const response = await api.get(`${ENDPOINTS.recentalerts}/doctors`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent patient alerts:", error);
    throw error; // Re-throw to allow handling by the component
  }
};
export const fetchRemoteDoctorRecenAlerts = async (limit = 5) => {
  try {
    const response = await api.get(`${ENDPOINTS.recentalerts}/remotedoctors`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent patient alerts:", error);
    throw error; // Re-throw to allow handling by the component
  }
};

export const fetchAdminRecenAlerts = async (limit = 5) => {
  try {
    const response = await api.get(`${ENDPOINTS.recentalerts}/admin`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent patient alerts:", error);
    throw error; // Re-throw to allow handling by the component
  }
};
