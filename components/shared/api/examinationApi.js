import axios from "axios";
import { handleAddVisitHistory } from "../";
import {createAuditLogEntry} from "./"


//const API_URL = 'http://localhost:4000/api/v2/examination';
const API_URL = "https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/examination";

export const createExamination = async (data, onSubmit, onTabChange) => {
  try {
    console.log("Sending examination data:", data); // Log request data

    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Examination submitted successfully:", response.data); // Log successful response
    const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure

    if (objectId) {
      const auditData = {
        userId: data?.examinedBy,
        activityType: "Examination Creation",
        entityId: objectId,
        entityModel: "Examination",
        details: `Examination Added successfully`,
      };
  
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
      await handleAddVisitHistory(data.patient, objectId, "Examination");
    } else {
      console.warn(
        "No ObjectId found in response. Using medicationId instead.",
      );
      // await handleAddVisitHistory(patient, updatedMedFormData.medicationId, "Medication");
    }
    onSubmit("success", "Examination submitted successfully");
    onTabChange("labresult");
  } catch (error) {
    console.error(
      "Error submitting examination:",
      error.response ? error.response.data : error.message,
    ); // Log error message

    const auditData = {
      userId: data?.examinedBy,
      activityType: "Failed",
      entityId: 123456789000000,
      entityModel: "Examination",
      details: `Failed to add Examination`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to add examination");
  }
};

// Function to update existing examination data
export const updateExam = async (data, onSubmit, onTabChange) => {
  const { _id, examinationID, ...updateData } = data; // Extract `_id` and exclude `examinationID`

  const examId = _id; // Use `_id` if available; fallback to `examinationID`

  if (!examId) {
    console.error("Error: Examination ID is required for update.");
    return;
  }

  try {
    console.log("Updating examination data:", updateData);

    const response = await axios.put(`${API_URL}/${examId}`, updateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  const auditData = {
      userId: updateData?.examinedBy,
      activityType: "Examination Update",
      entityId: examId,
      entityModel: "Examination",
      details: `Examination updated successfully`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    console.log("Examination updated successfully:", response.data);

    onSubmit("success", "Examination updated successfully");
    onTabChange("labresult");
  } catch (error) {
    console.error(
      "Error updating examination:",
      error.response ? error.response.data : error.message,
    );

    const auditData = {
      userId: updateData?.examinedBy,
      activityType: "Failed",
      entityId: examId,
      entityModel: "Examination",
      details: `Failed to update Examination`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to update examination");
  }
};

export const deleteExamination = async (examinationId) => {
  if (!examinationId) {
    return { error: "Examination ID is required." };
  }

  try {
    const response = await axios.delete(`${API_URL}/${examinationId}`, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data; // Return success response
  } catch (error) {
    console.error("API error:", error);
    return { error: error.response?.data?.message || error.message }; // Return error object
  }
};
