
    
export {deleteDiagnosis,updateDiagnosisData,createDiagnosis } from "./diagnosisApi";
export {deleteLabtest,updateLabtestData,createLabtest } from "./labtestApi";
export {deleteExamination,createExamination,updateExam } from "./examinationApi";
export {deleteMedication,editMedication,submitMedication } from "./medicationApi";

export {createPatient, updatePatient, deletePatient,fetchPatients,fetchPatientData } from "./patientsApi";

export {fetchVisitsByPatient , addVisitHistory } from "./patientVisitHistoryTrackerApi";

export {createReferral , fetchReferralsByConsultant,updateReferral,deleteReferral } from "./referralApi";

export { availabilityService } from "./availabilityRegisterApi"
export { getCurrentUser,getAllStaff } from "./StaffAPI"



export  { createBookingUrlConfig, updateBookingUrlConfig, getCurrentBookingUrlConfig } from "./bookingurlApi";
