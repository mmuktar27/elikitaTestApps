import { api, ENDPOINTS } from './api'; 

//const API_URL = "http://localhost:4000/api/v2/auditlogs";

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/auditlogs'

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/auditlogs";

// ✅ Create Audit Log Entry (POST)
export const createAuditLogEntry = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.auditlogs, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating audit log entry:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
// ✅ Get All Audit Logs (GET)
export const getAllAuditLogs = async () => {
  try {
    const response = await api.get(ENDPOINTS.auditlogs);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching audit logs:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ✅ Get Audit Log by ID (GET)
export const getAuditLogById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINTS.auditlogs}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching audit log with ID ${id}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};
