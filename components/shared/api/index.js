
    
export {deleteDiagnosis,updateDiagnosisData,createDiagnosis } from "./diagnosisApi";
export {deleteLabtest,updateLabtestData,createLabtest } from "./labtestApi";
export {deleteExamination,createExamination,updateExam } from "./examinationApi";
export {deleteMedication,editMedication,submitMedication } from "./medicationApi";

export {createPatient, updatePatient, deletePatient,fetchPatients,fetchPatientData } from "./patientsApi";

export {fetchVisitsByPatient , addVisitHistory } from "./patientVisitHistoryTrackerApi";

export {createReferral , fetchReferralsByConsultant,updateReferral,deleteReferral } from "./referralApi";

export { getCurrentUser,getAllStaff,fetchHealthWorkerStatistics ,getTotalUserConsultations ,
     updateStaff, fetchPendingConsultations,fetchAnalyticsData,getActiveConsultations,getActiveUsers} from "./StaffAPI"

export  { createBookingUrlConfig, updateBookingUrlConfig, getCurrentBookingUrlConfig } from "./bookingurlApi";

export {getSystemSettings, updatetSystemSettings } from "./systemSettingsApi";

export {getUserByEmail ,createUser} from "./adminApi";


export {createAuditLogEntry,getAllAuditLogs,getAuditLogById} from "./auditLogActivityApi";

export {fetchHealthAdminRecenAlerts,fetchHealthAssistantRecenAlerts,fetchAdminRecenAlerts,fetchRemoteDoctorRecenAlerts,fetchDoctorRecenAlerts
} from "./recentAlertsApi";


export {createAppointment,getAppointment,getAllAppointments,getAppointmentsByPatientOrPractitioner,updateAppointment,deleteAppointment
} from "./apppointmentApi";

export {createHealthyTip,
    getAllHealthyTips,
    updateHealthyTip,
    deleteHealthyTip,getHealthyTipsByCategory } from "./healthytipsApi";
 export { createUtility,
        getAllUtility,
        updateUtility,
        deleteUtility  } from "./utilityApi";

        export {updateSurveyResponse,fetchAllSurveyResponses,
          createSurveyResponse,deleteSurvey,updateSurvey,createSurvey,getSurveyById,getAllSurveys,fetchEligibleSurveys
        } from "./surveyApi"

export {  updateHeartbeat,createSession,checkInactiveUsers,getActiveSessionUsers
} from './heartbitApi'


