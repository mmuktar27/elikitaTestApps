export const config = {
  runtime: "nodejs",
};
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
export { PageProvider, usePage } from "./PageContext";
export { default as SessionManager } from "./SessionManager";
