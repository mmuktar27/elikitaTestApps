import { api, ENDPOINTS } from './api'; 

//const API_URL = "http://localhost:4000/api/v2/visithistory";

//const API_URL = "https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/visithistory";


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/visithistory";

// Fetch visits by patient ID
export const fetchVisitsByPatient = async (patientId) => {
  if (!patientId) return { error: "Patient ID is required." };

  try {
    const response = await api.get(`${ENDPOINTS.visithistory}`, {
      params: { patient_id: patientId }
  
    });

    return response.data; // Return visit history data
  } catch (error) {
    console.error("Error fetching visit history:", error);
    return {
      error: error.response?.data?.message || "Failed to fetch visit history",
    };
  }
};

export const addVisitHistory = async ({
  patient_id,
  serviceId,
  serviceType,
}) => {
  if (!patient_id || !serviceId || !serviceType) {
    return {
      error: "All fields (patient_id, serviceId, serviceType) are required.",
    };
  }

  try {
    const response = await api.post(`${ENDPOINTS.visithistory}`, {
      patient_id,
      serviceId,
      serviceType,
    });

    return response.data; // Return success response
  } catch (error) {
    console.error("API error:", error);
    return { error: error.response?.data?.message || error.message }; // Return error object
  }
};
