import { api, ENDPOINTS } from './api'; 

//const API_URL = 'http://localhost:4000/api/v2/survey';


//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/survey';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/survey";



export const getAllSurveys = async () => {
  try {
    const response = await api.get(ENDPOINTS.survey);
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }
};

export const getSurveyById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINTS.survey}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching survey with ID ${id}:`, error);
    throw error;
  }
};

export const createSurvey = async (surveyData) => {
  try {
    const response = await api.post(ENDPOINTS.survey, surveyData);
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

export const updateSurvey = async (id, surveyData) => {
  try {
    const response = await api.put(`${ENDPOINTS.survey}/${id}`, surveyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating survey with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSurvey = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINTS.survey}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting survey with ID ${id}:`, error);
    throw error;
  }
};

export const createSurveyResponse = async (body) => {
  try {
    const response = await api.post(`${ENDPOINTS.survey}/surveyresponse`, body); // Fix: Proper string interpolation
    return response.data;
  } catch (error) {
    console.error("Error creating survey response:", error);
    throw error;
  }
};
export const fetchAllSurveyResponses = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.survey}/surveyresponse`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching survey responses:",
      error?.response?.data || error.message,
    );
    return []; // Return empty array to prevent breaking the UI
  }
};

// Update an existing survey response
export const updateSurveyResponse = async (id, body) => {
  try {
    const response = await api.put(`${ENDPOINTS.survey}/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error updating survey response:", error);
    throw error;
  }
};

export const fetchEligibleSurveys = async (surveyFor, userId) => {
  try {
    const response = await api.get(`${ENDPOINTS.survey}/eligiblesurvey`, {
      params: { surveyFor, userId },
    });

    return response.data; // Returns the list of eligible surveys
  } catch (error) {
    console.error("Error fetching eligible surveys:", error);
    throw error;
  }
};
