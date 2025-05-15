
export { default as PatientsPage } from "./PatientsPage";
export { default as ProfilePage } from "./profile";
export { default as Logout } from "./logout";

export { default as PatientDetailsView } from "./PatientDetailsView";
export { default as ReferralsPage } from "./Referrals";

export { NewExamination, ViewExamination } from "./Examination";
export { NewDiagnosisForm, ViewDiagnosis } from "./Diagnosis";
export { NewLabTestForm, ViewLabTest } from "./Labtest";

export { ViewMedication, NewMedicationForm } from "./Medication";

export { PatientFilter } from "./PatientFilter";

export { handlePrintReport } from "./reports";

export { default as VitalsChart } from "./vitalsChart";

export { default as StatusDialog } from "./statusDialog";

export { handleAddVisitHistory } from "./visitHistoryTrackerFunction";
export { default as SessionManager } from "./SessionManager";

export { PageProvider, useReferralsPage, usePatientsPage,useNavbar,useCurrentUserDefaultRole,useUserPageNav,useAppointmentPage } from "./PageContext";

export { default as AppointmentsPage } from "./Appointments";

export {CreateNewAppointmentModal } from "./create-appointments";


export {default as HealthyTips } from "./HealthyTips";

export {default as SurveyModal} from "./SurveyModal";

export {default as SurveyPopup} from "./SurveyPopup";


export {default as SurveyResponsesModal} from './SurveyResponseModal'

export {default as HeartbeatManager} from './HeartBeatManager'


export {default as Event } from "./Event";
