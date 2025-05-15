import { api, ENDPOINTS } from './api'; 

//const API_URL = 'http://localhost:4000/api/v2/admin';

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/admin";



export const getSystemSettings = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.admin}/systemsettings/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching system settings:", error);
    throw error;
  }
};

export const updatetSystemSettings = async (settingsData) => {
  try {
    const response = await api.put(
      `${ENDPOINTS.admin}/systemsettings/`,
      settingsData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating system settings:", error);
    throw error;
  }
};
