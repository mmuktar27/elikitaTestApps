import axios from "axios";
import { handleAddVisitHistory } from "../";
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
    await editMedication(medformData, onClose, onSubmit);
  } else {
    try {
      const response = await axios.post(`${API_URL}`, updatedMedFormData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Medication submitted successfully:", response.data);
      const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure

      if (objectId) {
        await handleAddVisitHistory(patient, objectId, "Medication");
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
