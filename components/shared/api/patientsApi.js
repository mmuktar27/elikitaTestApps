import { api, ENDPOINTS } from './api'; 
// This file contains the functions for making API calls related to patients

//const API_URL = 'http://localhost:4000/api/v2/patients';


//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/patients';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/patients";



export const fetchPatientData = async (patientId) => {
  try {
    //console.log(`Making API request to: ${API_URL}/${patientId}/details`);

    const response = await api.get(`${ENDPOINTS.patients}/${patientId}/details`);

   // console.log("API Response:", response.data);
    return response.data; // api automatically parses JSON
  } catch (error) {
    console.error("Error in fetchPatientData:", error);

    return {
      patient: null,
      examinations: [],
      diagnoses: [],
      labTests: [],
      medications: [],
    };
  }
};

export const fetchPatients = async () => {
  try {
    const response = await api.get(ENDPOINTS.patients);

    // If the response is valid but has no data
    if (!response.data || response.data.length === 0) {
      console.warn("No patients found.");
      return []; // Return empty array instead of throwing
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);

    // Only throw if it's actually an error (e.g. 4xx/5xx)
    throw new Error(
      error.response?.data?.message || "Failed to fetch patients"
    );
  }
};


// Create a new patient
export const createPatient = async (patientData) => {
  //console.log("Creating patient with data:", patientData);

  try {
    const response = await api.post(ENDPOINTS.patients, patientData);

  //  console.log("Patient created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating patient:", error);
    console.error("Error details:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create patient",
    );
  }
};

// Update an existing patient
export const updatePatient = async (id, patientData) => {
  try {
    const response = await api.patch(`${ENDPOINTS.patients}/${id}`, patientData);
    return response.data;
  } catch (error) {
    console.error("Error updating patient:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update patient",
    );
  }
};

// Delete a patient
export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINTS.patients}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete patient",
    );
  }
};
