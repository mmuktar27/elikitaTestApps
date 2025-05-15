import { api, ENDPOINTS } from './api'; 
import { handleAddVisitHistory } from "../";
import { createAuditLogEntry } from "./";

//const API_URL = "http://localhost:4000/api/v2/diagnosis";

//const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/diagnosis'

//const API_URL = process.env.NEXT_PUBLIC_API_URL + "/diagnosis";

export const updateDiagnosisData = async (
  mergedData,
  resetForm,
  onTabChange,
  onClose,
  onSubmit,
) => {
  try {
    const response = await api.put(
      `${ENDPOINTS.diagnosis}/${mergedData._id}`,
      mergedData
    );

     console.log("Data successfully updated:", response.data);

    const auditData = {
      userId: mergedData?.diagnosedBy,
      activityType: "Diagnosis Update",
      entityId: mergedData._id,
      entityModel: "Diagnosis",
      details: `Diagnosis updated successfully`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    resetForm();
    onTabChange("diagnoses");
    onClose();
    onSubmit("success", "Diagnosis updated successfully");
  } catch (error) {
    console.error(
      "Error updating data:",
      error.response ? error.response.data : error.message,
    );

    const auditData = {
      userId: mergedData?.diagnosedBy,
      activityType: "Diagnosis Update Failed",
      entityId: mergedData._id,
      entityModel: "Diagnosis",
      details: `Failed to updated Diagnosis`,
    };

    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to update diagnosis");
  }
};

export const createDiagnosis = async (
  mergedData,
  resetForm,
  onTabChange,
  onClose,
  onSubmit,
  patient,
) => {
  try {
    //console.log("Sending diagnosis data:", mergedData);

    const response = await api.post(`${ENDPOINTS.diagnosis}`, mergedData);

   // console.log("Data successfully sent. Response:", response.data);

    const objectId = response.data?._id || response.data?.id;

    if (objectId) {
     // console.log("Object ID found:", objectId);

      //console.log("Patient data before updating history:", patient);

      if (!patient) {
        console.error(
          "Error: patient is undefined before updating visit history!",
        );
        return;
      }
      const auditData = {
        userId: mergedData?.diagnosedBy,
        activityType: "Diagnosis Creation",
        entityId: objectId,
        entityModel: "Diagnosis",
        details: `Diagnosis Created successfully`,
      };
      await handleAddVisitHistory(patient, objectId, "Diagnosis");
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
      console.log("Visit history updated successfully.");
    } else {
      console.warn(
        "No ObjectId found in response. Skipping visit history update.",
      );
    }

    resetForm();
    //console.log("Form reset successful.");

    onTabChange("medications");
   // console.log("Tab changed to 'medications'.");
    onClose();
    onSubmit("success", "Diagnosis added successfully");
    console.log("Success message sent.");
  } catch (error) {
    console.error(
      "Error sending data:",
      error.response ? error.response.data : error.message,
    );

    const auditData = {
      userId: mergedData?.diagnosedBy,
      activityType: "Daignosis Creation Failed",
      entityId: "123456789000000",
      entityModel: "Diagnosis",
      details: `Failed to Add Diagnosis`,
    };
    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    onSubmit("error", "Failed to add diagnosis");
    console.log("Error message sent.");
  }
};

export const deleteDiagnosis = async (diagnosisId) => {
  if (!diagnosisId) {
    return { error: "Diagnosis ID is required." };
  }

  try {
    const response = await api.delete(`${ENDPOINTS.diagnosis}/${diagnosisId}`);

    return response.data; // Return success response
  } catch (error) {
    console.error(
      "API error:",
      error.response ? error.response.data : error.message,
    );
    return { error: error.response?.data?.message || error.message }; // Return error object
  }
};
