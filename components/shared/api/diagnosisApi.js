import axios from "axios";
import {handleAddVisitHistory} from '../'
//const API_URL = 'http://localhost:4000/api/v2/diagnosis';
const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/diagnosis'

export const updateDiagnosisData = async (mergedData, resetForm, onTabChange, onSubmit) => {
  try {
    const response = await axios.put(
      `${API_URL}/${mergedData._id}`,
      mergedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Data successfully updated:", response.data);
    resetForm();
  //onTabChange("medications");
  
    onSubmit("success", "Diagnosis updated successfully");
  } catch (error) {
    console.error("Error updating data:", error.response ? error.response.data : error.message);
    onSubmit("error", "Failed to update diagnosis");
  }
};

export const createDiagnosis = async (mergedData, resetForm, onTabChange, onSubmit) => {
  try {
    const response = await axios.post(`${API_URL}`, mergedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Data successfully sent:", response.data);
     const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure
    
          if (objectId) {
            await handleAddVisitHistory(patient, objectId, "Diagnosis");
          } else {
            console.warn("No ObjectId found in response. Using medicationId instead.");
           // await handleAddVisitHistory(patient, updatedMedFormData.medicationId, "Medication");
          }
    resetForm();
    onTabChange("medications");
    onSubmit("success", "Diagnosis added successfully");
  } catch (error) {
    console.error("Error sending data:", error.response ? error.response.data : error.message);
    onSubmit("error", "Failed to add diagnosis");
  }
};


export const deleteDiagnosis = async (diagnosisId) => {
  if (!diagnosisId) {
    return { error: "Diagnosis ID is required." };
  }

  try {
    const response = await axios.delete(`${API_URL}/${diagnosisId}`, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data; // Return success response
  } catch (error) {
    console.error("API error:", error.response ? error.response.data : error.message);
    return { error: error.response?.data?.message || error.message }; // Return error object
  }
};
