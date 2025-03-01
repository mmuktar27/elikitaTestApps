import axios from 'axios';
//const API_URL = 'http://localhost:4000/api/v2/admin';

const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/admin';

export const getSystemSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/systemsettings/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};


export const updatetSystemSettings = async (settingsData) => {
  try {
    const response = await axios.put(`${API_URL}/systemsettings/`, settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};
