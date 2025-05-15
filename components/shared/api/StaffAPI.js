import { api, ENDPOINTS } from './api'; 

//const API_URL = 'http://localhost:4000/api/v2/staff';


//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/staff';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/staff";



export const getCurrentUser = async (userId) => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/currentuser/${userId}`);
   // console.log("User Data:", response.data);
   // console.log(userId);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const getAllStaff = async () => {
  try {
    const response = await api.get(ENDPOINTS.staff);
    //console.log("User Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
export const fetchHealthWorkerStatistics = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/healthworkerstatistic`);
    return response.data;
  } catch (error) {
    console.error("Error fetching health worker statistics:", error);
    return {};
  }
};
export const fetchAnalyticsData = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/analytics`);
    return response.data; // Return the analytics data
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return []; // Return an empty array in case of an error
  }
};

export const getTotalUserConsultations = async (userId) => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/consultations/${userId}`);
   // console.log("Total consult:", response.data);
    //  console.log(userId);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
export const updateStaff = async (id, updateData) => {
 // console.log("Attempting to update user...");
  //console.log("User ID:", id);
  //console.log("Update Data:", updateData);

  try {
    const response = await api.patch(`${ENDPOINTS.staff}/${id}`, updateData);
    //console.log("API Response Status:", response.status);
   // console.log("User updated successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    console.error(
      "Error Response Data:",
      error.response?.data || "No response data",
    );
    console.error("Error Status:", error.response?.status || "Unknown status");

    throw error; // Ensure the error propagates to the caller
  }
};

export const fetchPendingConsultations = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/pendingconsultations`);

    // Check if response contains expected data
   // console.log("Pending patients:", response.data.pendingPatients);

    // Return the pending patients data
    return response.data.pendingPatients;
  } catch (error) {
    console.error("Error fetching pending consultations:", error.message);
    return []; // Return an empty array in case of an error
  }
};

export const getActiveConsultations = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/activeconsultations`);
    return response.data; // Returns the list of patients
  } catch (error) {
    console.error("Error fetching active patients without records:", error);
    throw error;
  }
};

export const getActiveUsers = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.staff}/activeusersstat`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};
