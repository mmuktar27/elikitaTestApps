import axios from "axios";
import { handleAddVisitHistory } from "../";
import {createAuditLogEntry} from "./"

//const API_URL = "http://localhost:4000/api/v2/medication";

const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/medication';

export const submitMedication = async ({
  medformData,
  isEditMode,
  patient,
  onClose,
  onSubmit,
  setmedFormData,
  generateMedicationId,
  requestedBy,
  currentDashboard,
}) => {
  const updatedMedFormData = {
    ...medformData,
    medicationId: medformData?.medicationId ?? generateMedicationId(),
    requestedBy: requestedBy,
    requestedByAccType: currentDashboard,
    patient: patient,
  };

 

  if (isEditMode) {
    const auditData = {
      userId: requestedBy,
      activityType: "Medication Update",
      entityId: medformData.medicationId,
      entityModel: "Medication",
      details: `Medication requested updted for ${patient} successfully`,
    };
    await editMedication(medformData, onClose, onSubmit);
    try {
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }
    
  } else {
    try {
      const response = await axios.post(`${API_URL}`, updatedMedFormData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Medication submitted successfully:", response.data);
      const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure

      if (objectId) {
        const auditData = {
          userId: requestedBy,
          activityType: "Medication Creation",
          entityId: objectId,
          entityModel: "Medication",
          details: `Medication requested successfully`,
        };
        await handleAddVisitHistory(patient, objectId, "Medication");
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
      onClose();
      onSubmit("success", "Medication successfully added!");

      setmedFormData({
        medicationId: generateMedicationId(),
        requestedBy: "",
        medicationName: "",
        dosage: "",
        treatmentDuration: "",
        followUpProtocol: "",
        additionalNotes: "",
        patient: "",
      });
    } catch (error) {
      console.error("Error submitting medication:", error);
      const auditData = {
        userId: requestedBy,
        activityType: "Medication Creation Failed",
        entityId: objectId,
        entityModel: "Medication",
        details: `Medication requested for ${patient} Failed`,
      };
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
      onSubmit("error", "Failed to add medication");
    }
  }
};

export const editMedication = async (medformData, onClose, onSubmit) => {
  try {
    const response = await axios.put(
      `${API_URL}/${medformData._id}`,
      medformData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    console.log("Medication updated successfully:", response.data);

    onClose();
    onSubmit("success", "Medication successfully updated!");
  } catch (error) {
    console.error("Error updating medication:", error);
    onSubmit("error", "Failed to update medication");
  }
};

export const deleteMedication = async (medicationId) => {
  if (!medicationId) {
    return { error: "Medication ID is required." };
  }

  try {
    const response = await axios.delete(`${API_URL}/${medicationId}`);
    return response.data; // Return success response
  } catch (error) {
    console.error("API error:", error);
    return { error: error.response?.data?.message || error.message }; // Return error object
  }
};
