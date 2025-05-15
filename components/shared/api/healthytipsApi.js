import { api, ENDPOINTS } from './api'; 

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/healthytips'

//const API_URL = "http://localhost:4000/api/v2/healthytips";

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/healthytips";


export const createHealthyTip = async (data) => {
  try {
    const response = await api.post(`${ENDPOINTS.healthytips}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating healthy tip:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllHealthyTips = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.healthytips}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all healthy tips:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getHealthyTipsByCategory = async (userRole) => {
  try {
    const response = await api.get(`${ENDPOINTS.healthytips}/category`, {
      params: { userRole },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching healthy tips by category:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateHealthyTip = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINTS.healthytips}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating healthy tip:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteHealthyTip = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINTS.healthytips}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting healthy tip:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
