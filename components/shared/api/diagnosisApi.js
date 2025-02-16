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

export const createDiagnosis = async (mergedData, resetForm, onTabChange, onSubmit, patient) => {
  try {
    console.log("Sending diagnosis data:", mergedData);

    const response = await axios.post(`${API_URL}`, mergedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Data successfully sent. Response:", response.data);

    const objectId = response.data?._id || response.data?.id;

    if (objectId) {
      console.log("Object ID found:", objectId);
      
      console.log("Patient data before updating history:", patient);
      
      if (!patient) {
        console.error("Error: patient is undefined before updating visit history!");
        return;
      }

      await handleAddVisitHistory(patient, objectId, "Diagnosis");
      console.log("Visit history updated successfully.");
    } else {
      console.warn("No ObjectId found in response. Skipping visit history update.");
    }

    resetForm();
    console.log("Form reset successful.");

    onTabChange("medications");
    console.log("Tab changed to 'medications'.");

    onSubmit("success", "Diagnosis added successfully");
    console.log("Success message sent.");
  } catch (error) {
    console.error(
      "Error sending data:",
      error.response ? error.response.data : error.message
    );

    onSubmit("error", "Failed to add diagnosis");
    console.log("Error message sent.");
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
