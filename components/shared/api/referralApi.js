import axios from "axios";
//const API_URL = "http://localhost:4000/api/v2/referral";

const API_URL = "https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/referral";

// Create a new referral
export const createReferral = async (referralData) => {
  if (!referralData) return { error: "Referral data is required." };
  try {
    const response = await axios.post(`${API_URL}`, referralData);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Get all referrals
export const getReferrals = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Get referrals by consultant ID
export const fetchReferralsByConsultant = async (consultId) => {
  try {
    const response = await axios.get(`${API_URL}/referredTo/${consultId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching referrals:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Update a referral
export const updateReferral = async (referralId, updateData) => {
  if (!referralId) return { error: "Referral ID is required." };
  try {
    const response = await axios.put(`${API_URL}/${referralId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Delete a referral
export const deleteReferral = async (referralId) => {
  if (!referralId) return { error: "Referral ID is required." };
  try {
    const response = await axios.delete(`${API_URL}/${referralId}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Update referral status
export const updateReferralStatus = async (referralId, status) => {
  if (!referralId) return { error: "Referral ID is required." };
  try {
    const response = await axios.patch(`${API_URL}/${referralId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Get referrals by type
export const getReferralsByType = async (type) => {
  if (!type) return { error: "Referral type is required." };
  try {
    const response = await axios.get(`${API_URL}/type/${type}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};
