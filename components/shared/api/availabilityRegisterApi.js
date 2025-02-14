import axios from "axios";

//const API_BASE_URL = "http://localhost:4000/api/v2/availability";

const API_BASE_URL = "http://localhost:4000/api/v2/availability";



export const availabilityService = {
  async setAvailability(availabilityData) {
    try {
      const response = await axios.post(`${API_BASE_URL}`, availabilityData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error setting availability:", error);
      throw error;
    }
  },

  async getAvailability(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        params: { startDate, endDate },
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error getting availability:", error);
      throw error;
    }
  },
};
