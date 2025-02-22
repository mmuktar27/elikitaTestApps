
import axios from "axios";
import {handleAddVisitHistory} from '../'

//const API_URL = 'http://localhost:4000/api/v2/lab';

const API_URL = 'https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/lab';



export const createLabtest = async (mergedData, resetForm, onSubmit, onTabChange,requestedBy,  currentDashboard) => {

  
  const updatedLabData = {
    ...mergedData,
    requestedBy: requestedBy,
    requestedByAccType: currentDashboard,
    // Default to "Dr. John Doe" if not provided
  };

  try {
    const response = await axios.post(`${API_URL}`, updatedLabData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Lab test data successfully sent:", response.data);
     const objectId = response.data?._id || response.data?.id; // Adjust based on API response structure
    
          if (objectId) {
            await handleAddVisitHistory(mergedData.patient, objectId, "Labtest");
          } else {
            console.warn("No ObjectId found in response. Using medicationId instead.");
           // await handleAddVisitHistory(patient, updatedMedFormData.medicationId, "Medication");
          }
    resetForm();
    onSubmit("success", "Lab test data submitted successfully!");
    onTabChange("diagnoses");
  } catch (error) {
    console.error("Error sending data:", error.response ? error.response.data : error.message);
    onSubmit("error", "Failed to add lab test");
  }
};

export const updateLabtestData = async (data, resetForm, onTabChange, onSubmit) => {
  try {
    const response = await axios.put(`${API_URL}/${data._id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Lab test data successfully updated:", response.data);
    resetForm();
    //onTabChange("diagnoses");
    onSubmit("success", "Lab test updated successfully");
  } catch (error) {
    console.error("Error updating data:", error.response ? error.response.data : error.message);
    onSubmit("error", "Failed to update lab test");
  }
};

export const deleteLabtest = async (labtestid) => {
    if (!labtestid) {
      return { error: "Lab test ID is required." };
    }
  
    try {
      const response = await axios.delete(`${API_URL}/${labtestid}`, {
        headers: { "Content-Type": "application/json" },
      });
  
      return response.data; // Return success response
    } catch (error) {
      console.error("API error:", error);
  
      // Handle Axios errors properly
      return {
        error: error.response?.data?.message || error.message || "An error occurred",
      };
    }
  };
  

