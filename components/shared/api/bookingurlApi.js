import axios from "axios";

//const API_URL = "http://localhost:4000/api/v2/bookingurl";
const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/bookingurl'


// ✅ Create Booking URL Config (POST)
export const createBookingUrlConfig = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking URL:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update Booking URL Config (PUT)
export const updateBookingUrlConfig = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating booking URL:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Current Booking URL Config (GET)
export const getCurrentBookingUrlConfig = async () => {
  try {
    const response = await axios.get(`${API_URL}/current`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current booking URL:", error.response?.data || error.message);
    throw error;
  }
};
