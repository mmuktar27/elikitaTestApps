import { api, ENDPOINTS } from './api'; 
import { createAuditLogEntry } from "./";

//const API_URL = "http://localhost:4000/api/v2/referral";


//const API_URL = "https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/referral";


//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/referral";

// Create a new referral

export const createReferral = async (referralData) => {
  if (!referralData) return { error: "Referral data is required." };

  let objectId = null; // Ensure objectId is available in both success & error handling

  try {
    const response = await api.post(`${ENDPOINTS.referral}`, referralData);
    objectId =
      response.data?.data.referral._id || response.data?.data.referral.id; // Capture objectId here

    const auditData = {
      userId: referralData?.referredBy,
      activityType: "Referral Creation",
      entityId: objectId,
      entityModel: "Referral",
      details: `New patient referral received`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
      // console.log(auditData);
      // console.log(response.data?.data.referral._id);
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);

    const auditData = {
      userId: referralData?.referredBy,
      activityType: "Referral Creation Failed",
      entityId: objectId, // Now objectId will exist if API call succeeded before failing
      entityModel: "Referral",
      details: `Failed to Add Referral`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    return { error: error.response?.data?.message || error.message };
  }
};

// Get all referrals
export const getReferrals = async () => {
  try {
    const response = await api.get(`${ENDPOINTS.referral}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};

// Get referrals by consultant ID
export const fetchReferralsByConsultant = async (consultId) => {
  try {
    const response = await api.get(`${ENDPOINTS.referral}/referredTo/${consultId}`);
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
    const response = await api.put(`${ENDPOINTS.referral}/${referralId}`, updateData);
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
    const response = await api.delete(`${ENDPOINTS.referral}/${referralId}`);

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
    const response = await api.patch(`${ENDPOINTS.referral}/${referralId}/status`, {
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
    const response = await api.get(`${ENDPOINTS.referral}/type/${type}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
};
