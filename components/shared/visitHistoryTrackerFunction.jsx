import {addVisitHistory} from '../shared/api'



export const handleAddVisitHistory = async (patientId, serviceId, serviceType) => {
    try {
        const result = await addVisitHistory({ 
            patient_id: patientId, 
            serviceId, 
            serviceType 
        });
  
        if (result.error) {
            console.error("Error adding visit history:", result.error);
        } else {
            console.log("Visit history added successfully:", result);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
  };