import axios from "axios";

//const API_URL = "http://localhost:4000/api/v2/auditlogs";
const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/auditlogs'

// ✅ Create Audit Log Entry (POST)
export const createAuditLogEntry = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating audit log entry:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ Get All Audit Logs (GET)
export const getAllAuditLogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Audit Log by ID (GET)
export const getAuditLogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching audit log with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
