import { api, ENDPOINTS } from './api'; 
//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/utility'

//const API_URL = "http://localhost:4000/api/v2/utility";


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/utility";




export const createUtility = async (data) => {
  try {
    const response = await api.post(`${ENDPOINTS.utility}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating Utility:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllUtility = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.utility}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all Utility :",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateUtility = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINTS.utility}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating Utility",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteUtility = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINTS.utility}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting Utility:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
