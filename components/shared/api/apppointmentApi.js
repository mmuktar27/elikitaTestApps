import { api, ENDPOINTS } from './api'; 

//const API_URL = "http://localhost:4000/api/v2/appointments";

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/appointments'


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/appointments";

// Create an appointment
export const createAppointment = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.appointments, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating appointment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get a single appointment by ID
export const getAppointment = async (id) => {
  try {
    const response = await api.get(`${ENDPOINTS.appointments}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching appointment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
// Get all appointments
export const getAllAppointments = async () => {
  try {
    const response = await api.get(ENDPOINTS.appointments);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching appointments:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Get appointments by patient or practitioner reference
export const getAppointmentsByPatientOrPractitioner = async (params) => {
  try {
    const response = await api.get(
      `${ENDPOINTS.appointments}/appointmentsbypatientorpractitioner`,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching filtered appointments:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (data) => {
  try {
    const response = await api.put(ENDPOINTS.appointments, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating appointment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Delete an appointment by ID
export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINTS.appointments}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting appointment:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
