import { api, ENDPOINTS } from './api'; 
import { handleAddVisitHistory } from "../";
import { createAuditLogEntry } from "./";

//const API_URL = 'http://localhost:4000/api/v2/lab';


//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/lab';

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/lab";


export const createLabtest = async (
  mergedData,
  resetForm,
  onSubmit,
  onTabChange,
  requestedBy,
  currentDashboard,
) => {
  const updatedLabData = {
    ...mergedData,
    requestedBy: requestedBy,
    requestedByAccType: currentDashboard,
    // Default to "Dr. John Doe" if not provided
  };

  try {
    const response = await api.post(`${ENDPOINTS.lab}`, updatedLabData);

   // console.log("Lab test data successfully sent:", response.data);
    const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure

    if (objectId) {
      const auditData = {
        userId: requestedBy,
        activityType: "Labtest Creation",
        entityId: objectId,
        entityModel: "Lab",
        details: `Labtest request successfully`,
      };
      await handleAddVisitHistory(mergedData.patient, objectId, "Labtest");
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
    } else {
      console.warn(
        "No ObjectId found in response. Using medicationId instead.",
      );
      // await handleAddVisitHistory(patient, updatedMedFormData.medicationId, "Medication");
    }
    resetForm();
    onSubmit("success", "Lab test  submitted successfully!");
    onTabChange("diagnoses");
  } catch (error) {
    console.error(
      "Error sending data:",
      error.response ? error.response.data : error.message,
    );

    const auditData = {
      userId: requestedBy,
      activityType: "Failed",
      entityId: "12345678900000",
      entityModel: "Lab",
      details: `Failed to add Labtest`,
    };
    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to add lab test");
  }
};

export const updateLabtestData = async (
  data,
  resetForm,
  onTabChange,
  onSubmit,
  onClose,
) => {
  try {
    const response = await api.put(`${ENDPOINTS.lab}/${data._id}`, data);
    const auditData = {
      userId: data?.requestedBy,
      activityType: "Labtest Update",
      entityId: data._id,
      entityModel: "Lab",
      details: `Lab test updated successfully`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    console.log("Lab test  successfully updated:", response.data);
    resetForm();
    onTabChange("labresult");
    onClose();
    onSubmit("success", "Lab test updated successfully");
  } catch (error) {
    console.error(
      "Error updating data:",
      error.response ? error.response.data : error.message,
    );
    const auditData = {
      userId: data?.requestedBy,
      activityType: "Failed",
      entityId: data._id,
      entityModel: "Lab",
      details: `Lab test updated Failed`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to update lab test");
  }
};

export const deleteLabtest = async (labtestid) => {
  if (!labtestid) {
    return { error: "Lab test ID is required." };
  }

  try {
    const response = await api.delete(`${ENDPOINTS.lab}/${labtestid}`);

    return response.data; // Return success response
  } catch (error) {
    console.error("API error:", error);

    // Handle api errors properly
    return {
      error:
        error.response?.data?.message || error.message || "An error occurred",
    };
  }
};
