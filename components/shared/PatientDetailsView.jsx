"use client";


import React, { useEffect, useState } from "react";
import Modal from "react-modal";
// Lucide Icons
import { getSystemSettings } from "./api"
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  MapPin,
  Phone,
  Pill,
  Plus,
  Printer,
  ScrollText,
  Share2,
  Stethoscope,
  TestTubes,
  Thermometer,
  Trash2,
  User,
  XCircle
} from "lucide-react";

// UI Components

import { Button } from "@/components/ui/button";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  NewDiagnosisForm,
  NewExamination,
  NewLabTestForm,
  NewMedicationForm,
  ViewDiagnosis,
  ViewExamination,
  ViewLabTest,
  ViewMedication
} from "../shared";

import { fetchVisitsByPatient } from "../shared/api";
//loading and sening data to api

import { VitalsChart } from "../shared";
import { createAuditLogEntry, deleteDiagnosis, deleteExamination, deleteLabtest, deleteMedication } from "../shared/api";



import {
  createReferral,
  fetchPatientData,
  getAllStaff
} from "../shared/api";

import { getCurrentBookingUrlConfig } from "../shared/api";

import { handlePrintReport } from "../shared";


//import {useSession } from "next-auth/react";

const examinationSteps = [
  { key: "chiefcomplaint", label: "Chief Complaint" },
  { key: "symptoms", label: "Symptoms" },
  { key: "examination", label: "Examination" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "treatmentplan", label: "Treatment Plan" },
];

const vitalSigns = [
  { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
  { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
  { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 },
];

const labResults = [
  { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
  { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
  { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
  { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 },
];

const StatusDialog = ({ isOpen, onClose, status, message }) => {
  const isSuccess = status === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-sm rounded-lg border-2 transition-all duration-200${
          isSuccess
            ? "border-[#75C05B] bg-[#007664]"
            : "border-[#B24531]/50 bg-[#B24531]"
        }`}
      >
        <div className="p-6 text-white">
          <div className="mb-4 flex items-center justify-center">
            {isSuccess ? (
              <div className="rounded-full bg-[#75C05B] p-3">
                <Check className="size-8 text-white" />
              </div>
            ) : (
              <div className="rounded-full bg-[#B24531]/80 p-3">
                <AlertCircle className="size-8 text-white" />
              </div>
            )}
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold">
            {isSuccess ? "Success!" : "Error"}
          </h2>

          <p className="text-center text-white/90">{message}</p>

          <button
            onClick={onClose}
            className={`mt-6 w-full rounded-lg px-4 py-2 font-semibold transition-colors duration-200
              ${
                isSuccess
                  ? "bg-[#75C05B] hover:bg-[#75C05B]/80"
                  : "bg-white/20 hover:bg-white/30"
              }`}
          >
            {isSuccess ? "Continue" : "Try Again"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PatientDetailsView = ({ patient, onClose, SelectedPatient,currentUser, currentDashboard}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [manualRefresh, setManualRefresh] = useState(false);
  const [showexaminationForm, setShowexaminationForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDeleteType, setItemToDeleteType] = useState(null);
  const [isVideoMeeting, setIsVideoMeeting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isvisithistory, setIsvisithistory] = useState({});
  const [mergedVisitHistory, setmergedVisitHistory] = useState({});
  //const session = useSession();
 const [bookingUrls, setBookingUrls] = useState({});

  const [allStaff, setAllStaff] = useState({});

  const [settings, setSettings] = useState(null);




  useEffect(() => {
    const fetchAndHandleSystemSettings = async () => {
      try {
        const data = await getSystemSettings();
        console.log("System Settings:", data);
        setSettings(data); // Store settings in state
      } catch (error) {
        console.error("Failed to fetch system settings:", error);
      }
    };

    fetchAndHandleSystemSettings(); // Call the function inside useEffect
  }, []);

  useEffect(() => {
    const fetchallStaff = async () => {
        try {
            const staff = await getAllStaff();
            setAllStaff(staff);
        } catch (error) {
            console.error('Failed to fetch user data');
        }
    };

    fetchallStaff();
   
}, []);


useEffect(() => {
  const fetchUrls = async () => {
    try {
      const urls = await getCurrentBookingUrlConfig();
      
      if (urls) {
        setBookingUrls({ internal: urls.internalBookingUrl, external: urls.externalBookingUrl });
      } else {
        console.warn("No existing configuration found.");
      }
    } catch (error) {
      console.error("Error fetching booking URLs:", error);
    }
  };

  fetchUrls();
}, []);




  const generateReferralId = () => {
    const now = new Date();
    const year = now.getFullYear();

    // Get unix timestamp and take last 4 digits
    const timestamp = Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4);

    // Combine elements with prefix
    const medicationId = `REF-${year}-${timestamp}`;

    return medicationId;
  };

  const [referralData, setReferralData] = useState({
    patient:patient?._id,
    referralID:generateReferralId(),
    referredBy: currentUser?._id,
    referralType: "",
    referredTo: "",
    referralReason: "",
    status:"pending",
  });

  const [isVideoMeetingOpen, setIsVideoMeetingOpen] = useState(false);

  const handleStartCall = () => {
    setIsDialogOpen(true);
    //setIsVideoMeetingOpen(true);
  };

  const handleStartMeeting = () => {
    setIsDialogOpen(false);
    setIsVideoMeetingOpen(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
  };
  const [completedTasks, setCompletedTasks] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [medications, setMedications] = useState([]);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });

  const PVisitHistoryModal = ({ visit, open, onClose}) => {
    if (!visit) return null;
    function formatDate(isoString) {
      const date = new Date(isoString);
      return date.toLocaleString("en-GB", { 
          day: "2-digit", month: "2-digit", year: "numeric", 
          hour: "2-digit", minute: "2-digit", second: "2-digit", 
          hour12: false 
      });
  }
  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}  // Convert object values to string if needed
let bmiValue = null;
let bmiCategory = '';
if (visit?.details?.vitals) {
  const { height, weight } = visit?.details?.vitals;
  
  if (height && weight) {
    const heightInMeters = height / 100; // convert cm to m
    bmiValue = weight / (heightInMeters * heightInMeters);
    bmiValue = bmiValue.toFixed(1);

    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmiValue < 25) {
      bmiCategory = 'Normal weight';
    } else if (bmiValue < 30) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }
  }
}
function checkForDuration(fieldName, fieldValue) {
  if (typeof fieldName === 'string' && /duration/i.test(fieldName)) {
    const trimmed = String(fieldValue).trim();
    // Check if the value is only numbers (after trimming)
    if (/^\d+$/.test(trimmed)) {
      return 'days';
    }
  }
  return null;
}
    return (

      <div 
      className="w-full max-w-full bg-white transition-all duration-300 ease-in-out sm:w-full md:w-full lg:w-full"
    >
      <div className="relative w-full">
        
        <div className="max-h-[80vh] w-full  p-4">
          {/* Content remains the same, but ensure all container divs have w-full */}
          <div className="mb-4 w-full border-b pb-4">
            <div className="flex w-full items-center gap-3 text-2xl font-bold text-[#007664]">
              <Calendar className="size-7 text-[#009882]" />
              Visit Details - {formatDate(visit.date)}
            </div>
          </div>
  
          <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 ">
            <div className="rounded-xl bg-gradient-to-br from-[#00a98e] to-[#007664] p-4 text-white shadow-md">
                <User className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Attended By</h3>
                <p className="text-sm opacity-80">  <p className="text-sm opacity-80">
         
  
                <p className="text-sm opacity-80">
  {(() => {
    const staff = visit.details.examinedBy || visit.details.requestedBy || visit.details.diagnosedBy;
    
    // If no staff data, return default message
    if (!staff) return 'Not specified';
    
    // If staff is a string, return it directly (for backward compatibility)
    if (typeof staff === 'string') return staff;
    
    // If staff is an array, map through it and combine names
    if (Array.isArray(staff)) {
      return staff
        .filter(person => person?.firstName && person?.lastName)
        .map(person => `${person.firstName} ${person.lastName}`)
        .join(', ') || 'Not specified';
    }
    
    // If staff is a single user object
    if (staff?.firstName && staff?.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    
    return 'Not specified';
  })()}
</p>
</p>
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-md">
                <Stethoscope className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Purpose</h3>
                <p className="text-sm opacity-80">{capitalizeFirstLetter(visit.type)}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-4 text-white shadow-md">
                <Calendar className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Status</h3>
                <p className="text-sm opacity-80">{capitalizeFirstLetter(visit.details.status) || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-6 ">
            {visit.type === "examination" && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                    <Stethoscope className="size-6" />
                    Examination Details
                  </h3>
                  {visit?.details?.vitals && (
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(visit?.details?.vitals).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg bg-white p-4 shadow-md transition-all hover:scale-105"
                          >
                            <div className="mb-1 text-sm capitalize text-gray-500">
                              {key.replace(/([A-Z])/g, " $1")}
                            </div>
                            <div className="text-lg font-bold text-[#007664]">
                              {value}
                            </div>
                          </div>
                        ),
                      )}

{bmiValue && (
        <div className="mt-6 rounded-lg bg-teal-50 p-4 shadow">
          <p className="text-lg font-semibold text-teal-900">BMI</p>
          <p className="text-2xl font-bold text-teal-800">{bmiValue}</p>
          <p className="text-md text-teal-700">{bmiCategory}</p>
        </div>
      )}
                    </div>
                  )}

{visit?.details?.chiefComplain ? (
                  Object.entries(visit?.details?.chiefComplain).map(
                    ([category, symptoms]) => {
                      // Function to check if a value is empty, null, or undefined
                      const isEmpty = (value) => {
                        if (Array.isArray(value)) return value.length === 0;
                        if (typeof value === "object" && value !== null)
                          return Object.keys(value).length === 0;
                        return (
                          value === null || value === undefined || value === ""
                        );
                      };

                      // Check if the category has any valid symptoms
                      const hasValidSymptoms = Object.values(symptoms).some(
                        (value) =>
                          !isEmpty(value) &&
                          (!(typeof value === "object") ||
                            Object.values(value).some((v) => !isEmpty(v))),
                      );

                      const capitalize = (str) =>
                        str
                          .replace(/([A-Z])/g, " $1")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(" ")
                          .trim();

                      return hasValidSymptoms ? (
                        <div
                          key={category}
                          className="rounded-lg bg-gray-50 p-4"
                        >
                          <h4 className="mb-3 text-lg font-bold text-[#007664]">
                            {capitalize(category)}
                          </h4>
                          <ul className="space-y-4">
                            {Object.entries(symptoms)
                              .filter(
                                ([, value]) =>
                                  !isEmpty(value) &&
                                  (!(typeof value === "object") ||
                                    Object.values(value).some(
                                      (v) => !isEmpty(v),
                                    )),
                              )
                              .reduce((acc, [symptomKey, symptomValue]) => {
                                // If symptomValue is an object, group all its fields together
                                if (
                                  typeof symptomValue === "object" &&
                                  symptomValue !== null
                                ) {
                                  const details = Object.entries(
                                    symptomValue,
                                  ).filter(
                                    ([, value]) =>
                                      !isEmpty(value) && value !== "No",
                                  );

                                  if (details.length > 0) {
                                    acc.push(
                                      <li
                                        key={symptomKey}
                                        className="rounded-md bg-white p-3 shadow-sm"
                                      >
                                        <div className="font-medium text-[#007664]">
                                          {capitalize(symptomKey)}
                                        </div>
                                        <ul className="mt-2 space-y-1">
                                          {details.map(([key, value]) => (
                                            <li
                                              key={key}
                                              className="flex items-baseline text-sm"
                                            >
                                              <span className="mr-2 font-medium text-gray-600">
                                                {capitalize(key)}:
                                              </span>
                                              <span className="text-gray-700">
                                                {capitalize(String(value))} {checkForDuration(key, value)}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      </li>,
                                    );
                                  }
                                } else {
                                  // Group simple key-value pairs under the same subsection
                                  if (
                                    !acc[acc.length - 1] ||
                                    acc[acc.length - 1].key !== category
                                  ) {
                                    acc.push(
                                      <li
                                        key={category}
                                        className="rounded-md bg-white p-3 shadow-sm"
                                      >
                                        <div className="font-medium text-[#007664]">
                                          {capitalize(symptomKey)}
                                        </div>
                                        <div className="text-gray-700">
                                          {capitalize(String(symptomValue))} 
                                        </div>
                                      </li>,
                                    );
                                  } else {
                                    acc[acc.length - 1].props.children.push(
                                      <div
                                        key={symptomKey}
                                        className="flex items-baseline text-sm"
                                      >
                                        <span className="mr-2 font-medium text-gray-600">
                                          {capitalize(symptomKey)}:
                                        </span>
                                        <span className="text-gray-700">
                                          {capitalize(String(symptomValue))} 
                                        </span>
                                      </div>,
                                    );
                                  }
                                }

                                return acc;
                              }, [])}
                          </ul>
                        </div>
                      ) : null;
                    },
                  )
                ) : (
                  <div className="italic text-gray-500">
                    No Chief Complaints Recorded
                  </div>
                )}
                </div>
              )}
</div>  
{visit.type === "diagnosis" && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                    <ScrollText className="size-6" />
                    Diagnosis Details
                  </h3>
                  <div className="space-y-4">
                    {/* Primary Info */}
                    <div className="rounded-lg bg-white p-4 shadow-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Diagnosis ID</p>
                          <p className="text-gray-700">{visit.details.diagnosisId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Category</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.category)}</p>
                        </div>
                      </div>
                    </div>
            
                    {/* Clinical Assessment */}
                    <div className="rounded-lg bg-white p-4 shadow-md">
                      <h4 className="mb-3 font-medium text-gray-700">Clinical Assessment</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Severity</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.severity)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Priority</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.priority)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.status)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Chronicity</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.chronicityStatus)}</p>
                        </div>
                      </div>
                    </div>
            
                    {/* Provider Info */}
                    <div className="rounded-lg bg-white p-4 shadow-md">
                      <h4 className="mb-3 font-medium text-gray-700">Provider Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Diagnosed By</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.diagnosedBy.firstName)} {capitalizeFirstLetter(visit.details.diagnosedBy.lastName)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Facility</p>
                          <p className="text-gray-700">{visit.details.diagnosedAt}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Appointment Date</p>
                          <p className="text-gray-700">{visit.details.appointmentDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Appointment Time</p>
                          <p className="text-gray-700">{visit.details.appointmentTime}</p>
                        </div>
                      </div>
                    </div>
            
                    {/* Additional Notes */}
                    {visit.details.diagnosesisadditionalNotes && (
                      <div className="rounded-lg bg-white p-4 shadow-md">
                        <h4 className="mb-3 font-medium text-gray-700">Additional Notes</h4>
                        <p className="text-gray-700">{capitalizeFirstLetter(visit.details.diagnosesisadditionalNotes)}</p>
                      </div>
                    )}
            
                    {/* Prognosis */}
                    <div className="rounded-lg bg-white p-4 shadow-md">
                      <h4 className="mb-3 font-medium text-gray-700">Prognosis</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Expected Outcome</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.expectedOutcome)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Timeframe</p>
                          <p className="text-gray-700">{capitalizeFirstLetter(visit.details.timeframe)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
{visit.type === "medication" && (

<div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
<h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
  <ScrollText className="size-6" />
  Medication Details
</h3>
<div className="space-y-4">
  {/* Primary Info */}
  <div className="rounded-lg bg-white p-4 shadow-md">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Medication ID</p>
        <p className="text-gray-700">{visit.details.medicationId}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Medication Name</p>
        <p className="text-gray-700">{visit.details.medicationName}</p>
      </div>
    </div>
  </div>

  {/* Prescription Details */}
  <div className="rounded-lg bg-white p-4 shadow-md">
    <h4 className="mb-3 font-medium text-gray-700">Prescription Details</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Dosage</p>
        <p className="text-gray-700">{visit.details.dosage}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Treatment Duration</p>
        <p className="text-gray-700">{visit.details.treatmentDuration}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Requested By</p>
        <p className="text-gray-700">{capitalizeFirstLetter( visit.details.requestedBy.firstName)} {capitalizeFirstLetter( visit.details.requestedBy.lastName)}</p>
      </div>
    </div>
  </div>

  {/* Follow-up Protocol */}
  <div className="rounded-lg bg-white p-4 shadow-md">
    <h4 className="mb-3 font-medium text-gray-700">Follow-up Protocol</h4>
    <p className="text-gray-700">{visit.details.followUpProtocol}</p>
  </div>

  {/* Additional Notes */}
  {visit.details.additionalNotes && (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h4 className="mb-3 font-medium text-gray-700">Additional Notes</h4>
      <p className="text-gray-700">{capitalizeFirstLetter(visit.details.additionalNotes)}</p>
    </div>
  )}

  {/* Metadata */}
  <div className="rounded-lg bg-white p-4 shadow-md">
    <h4 className="mb-3 font-medium text-gray-700">Record Information</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Created</p>
        <p className="text-gray-700">{formatDate(visit.details.createdAt)}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Last Updated</p>
        <p className="text-gray-700">{formatDate(visit.details.updatedAt)}</p>
      </div>
    </div>
  </div>
</div>
</div>
)}
{visit.type  === "labTest" && (
                   <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                   <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                     <ScrollText className="size-6" />
                     Laboratory Test Details
                   </h3>
                   <div className="space-y-4">
                     {/* Primary Info */}
                     <div className="rounded-lg bg-white p-4 shadow-md">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-sm font-medium text-gray-500">Lab Test ID</p>
                           <p className="text-gray-700">{visit.details.labtestID}</p>
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-500">Test Priority</p>
                           <p className="text-gray-700">{capitalizeFirstLetter(visit.details.priority)}</p>
                         </div>
                       </div>
                     </div>
             
                     {/* Test Details */}
                     <div className="rounded-lg bg-white p-4 shadow-md">
                       <h4 className="mb-3 font-medium text-gray-700">Selected Tests</h4>
                       <ul className="list-inside list-disc space-y-1">
                       {visit.details.testSelections.map((test, index) => (
  <li key={index} className="space-y-1 text-gray-700">
    <div className="font-semibold">{test.category}</div>
    <div className="pl-4">
      Tests: {test.tests.join(', ')}
      {test.otherTest && (
        <div>Additional Test: {test.otherTest}</div>
      )}
    </div>
  </li>
))}
                       </ul>
                     </div>
             
                     {/* Request Information */}
                     <div className="rounded-lg bg-white p-4 shadow-md">
                       <h4 className="mb-3 font-medium text-gray-700">Request Information</h4>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-sm font-medium text-gray-500">Requested By</p>
  <p className="text-gray-700">
    {typeof visit.details.requestedBy === 'object' && visit.details.requestedBy !== null
      ? `${visit.details.requestedBy.firstName} ${visit.details.requestedBy.lastName}`
      : visit.details.requestedBy || 'Not specified'}
  </p>
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-500">Requested At</p>
                           <p className="text-gray-700">{visit.details.requestedAt}</p>
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-500">Priority</p>
                           <p className="text-gray-700">{capitalizeFirstLetter(visit.details.priority)}</p>
                         </div>
                       </div>
                     </div>
             
                     {/* Additional Notes */}
                     {visit.details.additionalNotes && (
                       <div className="rounded-lg bg-white p-4 shadow-md">
                         <h4 className="mb-3 font-medium text-gray-700">Special Instructions</h4>
                         <p className="text-gray-700">{visit.details.additionalNotes}</p>
                       </div>
                     )}
             
                     {/* Metadata */}
                     <div className="rounded-lg bg-white p-4 shadow-md">
                       <h4 className="mb-3 font-medium text-gray-700">Record Information</h4>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-sm font-medium text-gray-500">Created</p>
                           <p className="text-gray-700">{formatDate(visit.details.createdAt)}</p>
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-500">Last Updated</p>
                           <p className="text-gray-700">{formatDate(visit.details.updatedAt)}</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
              )}
            </div>
          </div>
        </div>
   
    );
  };
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);



  const Patientvisit = ({patientvisitHistory}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const openVisitDetails = (visit) => {
      setSelectedVisit(visit);
      setModalOpen(true);

      //  console.log(visit)
    };
    function formatDate(isoString) {
      const date = new Date(isoString);
      return date.toLocaleString("en-GB", { 
          day: "2-digit", month: "2-digit", year: "numeric", 
          hour: "2-digit", minute: "2-digit", second: "2-digit", 
          hour12: false 
      });
  }
  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = patientvisitHistory.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(patientvisitHistory.length / itemsPerPage);

const paginate = (pageNumber) => setCurrentPage(pageNumber);
//console.log('test visit1')

//console.log(patientvisitHistory)

//console.log('test visit2')
return (
  <div className="flex items-center justify-center border-none bg-transparent shadow-none">
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#007664] to-[#009882] p-6 text-white">
        <h2 className="text-2xl font-bold">Patient Visit History</h2>
      </div>

      {currentItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No records found</div>
      ) : (
        currentItems.map((visit,index) => {

          const key = visit._id || `visit-${index}`;
          return(
          <div
            key={key}
            onClick={() => openVisitDetails(visit)}
            className="group flex cursor-pointer items-center justify-between border-b border-gray-200 p-4 transition-all duration-300 hover:bg-gray-50"
          >
            <div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-[#007664] transition-transform group-hover:rotate-12" />
                <span className="font-semibold text-[#007664] transition-colors group-hover:text-[#009882]">
                  {formatDate(visit.date)}
                </span>
              </div>
              <div className="ml-8 mt-1 text-sm text-gray-600">
                {visit.doctor}
              </div>
              <div className="ml-8 mt-1 text-xs italic text-gray-500">
                {capitalizeFirstLetter(visit.type)}
              </div>
            </div>
            <ChevronRight className="text-[#007664] transition-transform group-hover:translate-x-1" />
          </div>
        )})
      )}

      {/* Pagination Controls */}
      {patientvisitHistory.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="rounded p-2 text-[#007664] hover:bg-gray-100 disabled:text-gray-300"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded p-2 text-[#007664] hover:bg-gray-100 disabled:text-gray-300"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
              key={`page-${index + 1}`}
                onClick={() => paginate(index + 1)}
                className={`size-8 rounded ${
                  currentPage === index + 1
                    ? 'bg-[#007664] text-white'
                    : 'text-[#007664] hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded p-2 text-[#007664] hover:bg-gray-100 disabled:text-gray-300"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded p-2 text-[#007664] hover:bg-gray-100 disabled:text-gray-300"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
    {modalOpen && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="relative max-h-screen min-h-min w-[95vw] max-w-4xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
  

  <button
  className="pointer-events-auto absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
  onClick={() => setModalOpen(false)}
>
  <XCircle className="size-6" />
</button>


    
                      
    <PVisitHistoryModal
      visit={selectedVisit}
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    />

  
    </div>
    </div>  )}
  </div>
);

  };

  // Add these styles to your global CSS or Tailwind config
  const styles = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  
    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }
  
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;


  const [viewMedState, setViewMedState] = useState({
    isOpen: false,
    selectedMedication: null,
  });

  const [editMedState, setEditMedState] = useState({
    isOpen: false,
    selectedMedication: null,
  });

  const [viewLabState, setViewLabState] = useState({
    isOpen: false,
    selectedLabtest: null,
  });

  const [editLabState, setEditLabState] = useState({
    isOpen: false,
    selectedLabtest: null,
  });

  const [viewExamState, setViewExamState] = useState({
    isOpen: false,
    selectedExamination: null,
  });

  const [editExamState, setEditExamState] = useState({
    isOpen: false,
    selectedExamination: null,
  });

  const [viewDiagState, setViewDiagState] = useState({
    isOpen: false,
    selectedDiagnoses: null,
  });

  const [editDiagState, setEditDiagState] = useState({
    isOpen: false,
    selectedDiagnoses: null,
  });

  const handleMedSubmit = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Medication added successfully!"
          : "Failed to add medication"),
    });
  };

  const handleExamSubmit = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Examination added successfully!"
          : "Failed to add Examination"),
    });
  };

  const handleDiagnosisSubmit = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Diagnosis added successfully!"
          : "Failed to add Diagnoosis"),
    });
  };

  const mergeMedicalData = (data) => {
    const { examinations, diagnoses, labTests, medications } = data;
    
    // Create arrays of standardized objects from each data source
    const examinationRecords = examinations.map(exam => ({
      type: 'examination',
      date: exam.createdAt,
      details: exam,
    
    }));
  
    const diagnosisRecords = diagnoses.map(diagnosis => ({
      type: 'diagnosis',
      date: diagnosis.createdAt,
      details: diagnosis,
  
    }));
  
    const labTestRecords = labTests.map(test => ({
      type: 'labTest',
      date: test.createdAt,
 
      details: test,
      
    }));
  
    const medicationRecords = medications.map(med => ({
      type: 'medication',
      date: med.createdAt,
  
      details: med,
  
    }));
  
    // Combine all records
    const mergedRecords = [
      ...examinationRecords,
      ...diagnosisRecords,
      ...labTestRecords,
      ...medicationRecords
    ];
  
    // Sort by date (most recent first)
    return mergedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  };



  useEffect(() => {
    if (!SelectedPatient?._id) {
      console.log("No SelectedPatient or missing _id, skipping fetch.");
      return;
    }
  
    console.log(`Fetching data for patient ID: ${SelectedPatient._id}`);
  
    let isMounted = true; // Prevents state updates on unmounted components
  
    const fetchData = async () => {
      try {
        console.log("Fetching patient data...");
        const data = await fetchPatientData(SelectedPatient._id);
  
        if (!data) {
          console.warn("fetchPatientData returned no data!");
        } else {
          console.log("Received data:", data);
        }
  
        if (isMounted) {
          setExaminations(data?.examinations || []);
          setDiagnoses(data?.diagnoses || []);
          setLabTests(data?.labTests || []);
          setMedications(data?.medications || []);
          setmergedVisitHistory(mergeMedicalData(data));
  
          console.log("Updated state with new data.");
        }
      } catch (error) {
        console.error("Error fetching patient data in useEffect:", error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
      console.log("Cleanup: Component unmounted, fetch aborted.");
    };
  }, [SelectedPatient]);
  
  

  useEffect(() => {
    if (!manualRefresh || !SelectedPatient?._id) return;
  
    let isMounted = true;
  
    const fetchData = async () => {
      const data = await fetchPatientData(SelectedPatient._id);
  
      if (isMounted) {
      //  console.log('data');
       // console.log(data);
        //console.log('data');
        setExaminations(data.examinations || []);
        setDiagnoses(data.diagnoses || []);
        setLabTests(data.labTests || []);
        setMedications(data.medications || []);
        setManualRefresh(false); // ✅ Ensures manual refresh is reset only if component is still mounted
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false; // Prevent state updates on unmounted components
    };
  }, [SelectedPatient, manualRefresh]);
  

  const triggerRefresh = () => {
    setManualRefresh(true);
  };

  useEffect(() => {
    const handleFetchPatientVisitshistory = async () => {
      if (!SelectedPatient) {
        console.log("⚠️ SelectedPatient is undefined or null");
        return; // Ensure patient ID is valid before fetching
      }
  
      console.log(
        "ℹ️ Fetching visit history for patient ID:",
        SelectedPatient._id,
      ); // Log Patient ID
  
      try {
        console.log("🔄 Initiating fetch request...");
        const result = await fetchVisitsByPatient(SelectedPatient._id);
  
        console.log("📩 Fetch result received:", result); // Log full result
  
        if (!result) {
          console.error("❌ Fetch returned null or undefined.");
          return;
        }
  
        if (result.error) {
          console.error("❌ Error fetching visits:", result.error);
          return;
        }
  
        if (typeof result !== "object") {
          console.error("⚠️ Unexpected response format:", result);
          return;
        }
  
        console.log("✅ Valid response received, processing data...");
  
        setIsvisithistory(result);
  
        console.log("✅ Visit history updated successfully");
      } catch (error) {
        console.error("🚨 Fetch failed:", error);
      }
    };
    if (!SelectedPatient || !SelectedPatient._id) return;

    console.log("Fetching visit history for:", SelectedPatient._id); // Debugging

    handleFetchPatientVisitshistory();
  }, [SelectedPatient]);

  // console.log(examinations);
  const [testSelections, setTestSelections] = useState([
    {
      id: 1,
      selectedCategory: "",
      selectedTests: [],
      otherTest: "",
      isOpen: false,
      isSubsectionOpen: false,
    },
  ]);
  const [labtestFormData, setlabtestFormData] = useState({
    dateOfRequest: "",
    priority: "",
    testsRequested: {},
    diagnosis: "",
    icdCode: "",
    additionalNotes: "",
    specimenType: [],
    collectionDateTime: "",
    collectedBy: "",
    specialInstructions: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [otherTest, setOtherTest] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [isnotificationmodalOpen, setnotificationModaOpen] = useState(false);

  const [isSubsectionOpen, setIsSubsectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [iseditExamOpen, setIsEditexamOpen] = useState(false);

  const [iseditDiagnosesOpen, setIsEditDiagnosisOpen] = useState(false);
  const [iseditMedicationOpen, setIsEditMedicationOpen] = useState(false);
  const [iseditLabtestOpen, setIsEditLabtestOpen] = useState(false);

  const [isAddlabtestOpen, setIsAddlabtestOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddmOpen, setIsAddmOpen] = useState(false);
  const [isAddDOpen, setIsAddDOpen] = useState(false);
  const [isAddlabOpen, setIsAddlabOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [med, setMed] = useState(null);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isViewExamOpen, setIsViewExamOpen] = useState(false);
  const [isViewDiagOpen, setIsViewDiagOpen] = useState(false);
  const [isViewMedOpen, setIsViewMedOpen] = useState(false);

  const closeModal = () => setIsAddlabOpen(false);

  const closeViewExamModal = () => setIsViewExamOpen(false);
  const closeViewMedModal = () => setIsViewMedOpen(false);
  const closeViewDiagnosisModal = () => setIsViewDiagOpen(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen for resize
    return () => window.removeEventListener("resize", checkScreenWidth); // Cleanup
  }, []);

  const viewlabDetails = (test) => {
    setResult(test);
    setIsAddlabOpen(true);
    // console.log(test)
  };

  const viewexaminationdetails = (examination) => {
    setExam(examination);
    //console.log(examination) ;
    setIsViewExamOpen(true);
  };
  const viewMedtDetails = (medication) => {
    setMed(medication);
    setIsViewMedOpen(true);
  };
  const viewDiagnosisDetails = (diagnoses) => {
    setDiagnosis(diagnosis);
    setIsViewDiagOpen(true);
  };
  const [refmodalIsOpen, setrefModalIsOpen] = useState(false);
  const [selectedrefOption, setSelectedrefOption] = useState("");
  const [list, setList] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");

  // Open modal handler
  const openrefModal = () => setrefModalIsOpen(true);
  const handleRefChange = (event) => {
    setSelectedRef(event.target.value);
   
    setReferralData(prev => ({
      ...prev,
      referredTo: event.target.value
    }));
  };
  // Close modal handler
  const closerefModal = () => {
    setrefModalIsOpen(false);
    setSelectedrefOption("");
    setSelectedRef("");
    setList([]);
  };

  // Handle option selection and update list based on selection
  const handleSelectrefChange = (event) => {
    const value = event.target.value;
    setSelectedrefOption(value);
 
    setReferralData(prev => ({
      ...prev,
      referralType: event.target.value
    }));
    // Populate the list based on selection
    switch (value) {
      case "doctor":
        setList(doctors);
        break;
        case "remotedoctor":
          setList(remotedoctor);
          break;
        case "healthcareassistant":
            setList(healthcareassistant);
            break;
      case "labTech":
        setList(labTechnicians);
        
        setReferralData(prev => ({
          ...prev,
          referralReason: ""
        }));
        break;
      case "pharmacy":
        setList(pharmacies);
        setReferralData(prev => ({
          ...prev,
          referralReason: ""
        }));
        break;
      default:
        setList([]);
        break;
    }
  };
  const handleFormSubmit = async (actionType) => {
    setIsLoading(true);

    setIsLoading(false);
    setIsAddOpen(false); // Close dialog after submission
  };
  const handleDialogChange = (isOpen, actionType) => {
    if (actionType === "add") {
      setIsAddOpen(isOpen);
    } else if (actionType === "edit") {
      setIsEditexamOpen(isOpen);
    }
  };
  const handleDialogChangelabtest = (isOpen, actionType) => {
    if (actionType === "add") {
      setIsAddlabtestOpen(isOpen);
    } else if (actionType === "edit") {
      setIsEditLabtestOpen(isOpen);
    }
  };

  const handleDialogDChange = (isOpen, actionType) => {
    if (actionType === "add") {
      setIsAddDOpen(isOpen);
    } else if (actionType === "edit") {
      setIsEditDiagnosisOpen(isOpen);
    }
  };
  const handleDialogmChange = (isOpen, actionType) => {
    if (actionType === "add") {
      setIsAddmOpen(isOpen);
    } else if (actionType === "edit") {
      setIsEditMedicationOpen(isOpen);
    }
  };
  const handleDialoglabChange = (isOpen, actionType) => {
    if (actionType === "add") {
      setIsAddlabOpen(isOpen);
    } else if (actionType === "edit") {
      setIsEditLabtestOpen(isOpen);
    }
  };

  const handleDialogViewExam = (isOpen) => {
    setIsViewExamOpen(isOpen);
  };
  const handleCallClick = () => {
    setIsVideoMeeting(true);
  };

  const handleDialogViewMed = (isOpen) => {
    setIsViewMedOpen(isOpen);
  };

  const handleDialogViewDiagnosis = (isOpen) => {
    setIsViewDiagOpen(isOpen);
  };
  const startDelete = (item, type) => {
    setItemToDelete(item);
    setItemToDeleteType(type);
    setShowDeleteDialog(true);
  };

  const confirmationDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
  };

  const confirmDelete = async (itemid) => {
    if (!itemid) {
      confirmationDialog("error", "Invalid  ID.");
      return;
    }
    if (itemToDeleteType === "Diagnoses") {
      try {
        const response = await deleteDiagnosis(itemid);

        if (!response || response.error) {
          throw new Error(response?.error || "Unknown error occurred.");
        }
        const auditData = {
          userId:  currentUser._id,
          activityType: "Diagnosis Delete",
          entityId: itemid,
          entityModel: "Diagnosis",
          details: `Diagnosis deleted successfully`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
        confirmationDialog("success", "Diagnosis deleted successfully!");
        triggerRefresh();
      } catch (error) {
        confirmationDialog(
          "error",
          `Failed to delete diagnosis: ${error.message}`,
        );
        console.error("Error deleting diagnosis:", error);

        const auditData = {
          userId:  currentUser._id,
          activityType: "Diagnosis Deletion Failed",
          entityId: itemid,
          entityModel: "Diagnosis",
          details: `Failed to Delete Diagnosis  `,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
      } finally {
        setShowDeleteDialog(false);
      }
    }

    if (itemToDeleteType === "LabTest")
      try {
        const response = await deleteLabtest(itemid);

        if (!response || response.error) {
          throw new Error(response?.error || "Unknown error occurred.");
        }
        const auditData = {
          userId:  currentUser._id,
          activityType: "Labtest Delete",
          entityId: itemid,
          entityModel: "Lab",
          details: `Labtest deleted successfully`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
        confirmationDialog("success", "Labtest deleted successfully!");
        triggerRefresh();
      } catch (error) {
        confirmationDialog(
          "error",
          `Failed to delete Labtest: ${error.message}`,
        );
        console.error("Error deleting Labtest:", error);
        const auditData = {
          userId:  currentUser._id,
          activityType: "Labtest Deletion Failed",
          entityId: itemid,
          entityModel: "Lab",
          details: `Failed to delete Labtest`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
      } finally {
        setShowDeleteDialog(false);
      }

    if (itemToDeleteType === "Examination")
      try {
        const response = await deleteExamination(itemid);

        if (!response || response.error) {
          throw new Error(response?.error || "Unknown error occurred.");
        }
        const auditData = {
          userId:  currentUser._id,
          activityType: "Examination Delete",
          entityId: itemid,
          entityModel: "Examination",
          details: `Examination deleted successfully`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
        confirmationDialog("success", "Examination deleted successfully!");
        triggerRefresh();
      } catch (error) {
        confirmationDialog(
          "error",
          `Failed to delete Examination: ${error.message}`,
        );
        console.error("Error deleting Examination:", error);

        const auditData = {
          userId:  currentUser._id,
          activityType: "Examination Deletion Failed ",
          entityId: itemid,
          entityModel: "Examination",
          details: `Failed to Delete Examination`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
      } finally {
        setShowDeleteDialog(false);
      }

    if (itemToDeleteType === "Medication")
      try {
        const response = await deleteMedication(itemid);

        if (!response || response.error) {
          throw new Error(response?.error || "Unknown error occurred.");
        }
        const auditData = {
          userId:  currentUser._id,
          activityType: "Medication Delete",
          entityId: itemid,
          entityModel: "Medication",
          details: `Medication deleted successfully`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
        confirmationDialog("success", "Medication deleted successfully!");
        triggerRefresh();
      } catch (error) {
        confirmationDialog(
          "error",
          `Failed to delete Medication: ${error.message}`,
        );
        console.error("Error deleting Medication:", error);
        const auditData = {
          userId:  currentUser._id,
          activityType: "Failed",
          entityId: itemid,
          entityModel: "Medication",
          details: `Failed to Delete Medication`,
        };
    
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully.");
        } catch (auditError) {
          console.error("Audit log failed:", auditError);
        }
      } finally {
        setShowDeleteDialog(false);
      }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteDialog(false);
  };
  const handleEditSubmit = () => {
    // Add logic to update the examination
    console.log("Updated examination:", newexamination);

    // Close the dialog after submission
    setIsEditOpen(false);
  };
  const startEdit = (examination) => {
    // Set the state with the examination data to start editing
    setNewexamination({
      id: examination.id,
      patientName: examination.subject.display,
      status: examination.status,
      category: examination.category,
      serviceType: examination.serviceType,
      occurrenceDateTime: examination.occurrenceDateTime,
      created: examination.created,
      description: examination.description,
      reasonCode: examination.reasonCode,
      diagnosis: examination.diagnosis,
      presentedProblem: examination.presentedProblem,
      summary: examination.summary,
    });
    // console.log(examination)

    // Optionally, you may open a dialog or modal here to show the form
    //setDialogOpen(true);
    setIsAddOpen(true);
  };

  const ConfirmationDialog = ({ show, onConfirm, onCancel, item }) => {
    if (!show) return null;

    return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="rounded bg-white p-6 shadow-md">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <p className="mt-2">Are you sure you want to delete this item?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              className="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
              onClick={() => onConfirm(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [newexamination, setNewexamination] = useState({
    id: "", // Unique identifier for the examination
    status: "", // examination status
    category: [], // Classification of examination
    serviceType: [], // Type of service provided
    subject: {
      reference: "", // Reference to the patient
      display: "", // Patient's name
    },
    participant: [
      {
        type: [], // Participant type
        individual: {
          reference: "", // Reference to participant
          display: "", // Participant's name
        },
      },
    ],
    occurrenceDateTime: "", // Date/Time of the examination
    created: "", // Creation date of examination
    description: "", // Description of examination
    reasonCode: [], // Codes for the examination reason
    diagnosis: [], // Diagnosis associated with examination
    appointment: {
      reference: "", // Reference to the appointment
    },
    period: {
      start: "", // Start date/time of examination
      end: "", // End date/time of examination
    },
    location: {
      location: {
        reference: "", // Location reference
        display: "", // Location name
      },
    },
    hospitalization: {
      admitSource: "", // Source of admission
      dischargeDisposition: "", // Disposition at discharge
    },
    totalCost: {
      value: 0, // Total cost of examination
      currency: "", // Currency
    },
    presentedProblem: [], // Problems presented during examination
    progress: [], // Progress notes
    summary: "", // High-level summary of examination
  });
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const InfoItem = ({ label, value }) => (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );

  const [newDiagnosis, setNewDiagnosis] = useState({
    id: "", // Unique identifier for the Diagnosis
    status: "", // Diagnosis status
    category: [], // Classification of diagnosis
    serviceType: [], // Type of service related to diagnosis
    patient: {
      reference: "", // Reference to the patient
      display: "", // Patient's name
    },
    participant: [
      {
        type: [], // Participant type (e.g., doctor, specialist)
        individual: {
          reference: "", // Reference to participant
          display: "", // Participant's name
        },
      },
    ],
    occurrenceDateTime: "", // Date/Time of the diagnosis
    created: "", // Creation date of diagnosis
    description: "", // Description of diagnosis
    reasonCode: [], // Codes for the diagnosis reason
    diagnosisDetails: [], // Specific details of diagnosis
    appointment: {
      reference: "", // Reference to the associated appointment
    },
    period: {
      start: "", // Start date/time of diagnosis
      end: "", // End date/time of diagnosis, if applicable
    },
    location: {
      location: {
        reference: "", // Location reference
        display: "", // Location name
      },
    },
    hospitalization: {
      admitSource: "", // Source of admission
      dischargeDisposition: "", // Disposition at discharge, if relevant
    },
    totalCost: {
      value: 0, // Total cost of diagnosis-related services
      currency: "", // Currency
    },
    presentedProblem: [], // Problems presented leading to diagnosis
    progress: [], // Progress notes related to diagnosis
    summary: "", // High-level summary of diagnosis
  });
  const [newMedication, setNewMedication] = useState({
    medicationDescription: "",
    medicationNote: "",
    medicationCode: "",
    medicationStatus: "active",
    medicationStartDate: "",
    medicationStartTime: "",
    medicationEndDate: "",
    medicationFrequency: {
      type: "daily",
      value: 1,
    },
  });


  const handleCheckboxChange = (category, test) => {
    setlabtestFormData((prevData) => {
      const updatedTests = { ...prevData.testsRequested };
      if (!updatedTests[category]) {
        updatedTests[category] = [];
      }
      if (updatedTests[category].includes(test)) {
        updatedTests[category] = updatedTests[category].filter(
          (t) => t !== test,
        );
      } else {
        updatedTests[category].push(test);
      }
      return { ...prevData, testsRequested: updatedTests };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlabtestFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", labtestFormData);
    // Here you can handle the form submission (e.g., send to an API)
  };

  const handleCategorySelect = (id, category) => {
    setTestSelections((prev) =>
      prev.map((selection) =>
        selection.id === id
          ? {
              ...selection,
              selectedCategory: category,
              isSubsectionOpen: true,
              isOpen: false,
            }
          : selection,
      ),
    );
  };

  const handleTestSelect = (id, test) => {
    setTestSelections((prev) =>
      prev.map((selection) =>
        selection.id === id
          ? {
              ...selection,
              selectedTests: selection.selectedTests.includes(test)
                ? selection.selectedTests.filter((t) => t !== test)
                : [...selection.selectedTests, test],
            }
          : selection,
      ),
    );
  };

  const handleOtherTestChange = (id, value) => {
    setTestSelections((prev) =>
      prev.map((selection) =>
        selection.id === id ? { ...selection, otherTest: value } : selection,
      ),
    );
  };

  const toggleDropdown = (id) => {
    setTestSelections((prev) =>
      prev.map((selection) =>
        selection.id === id
          ? { ...selection, isOpen: !selection.isOpen }
          : selection,
      ),
    );
  };

  const addNewTestSelection = () => {
    const newId = Math.max(...testSelections.map((s) => s.id)) + 1;
    setTestSelections((prev) => [
      ...prev,
      {
        id: newId,
        selectedCategory: "",
        selectedTests: [],
        otherTest: "",
        isOpen: false,
        isSubsectionOpen: false,
      },
    ]);
  };

  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [testSelection, setTestSelection] = useState(testSelections);

  const doctors = [];
  const labTechnicians = [];
  const pharmacies = [];
  const healthcareassistant = [];
  const remotedoctor = [];
  // Function to categorize staff
 
  const categorizeStaff = (allStaff) => {
    Object.values(allStaff).forEach((staff) => {
      // Check each role independently without else statements
      if (staff.roles.includes("doctor")) {
        doctors.push({
          id: staff.id,
          name: `Dr. ${staff.firstName} ${staff.lastName}` // Append "Dr." to doctors
        });
      }
      
      if (staff.roles.includes("remote doctor")) {
        remotedoctor.push({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`
        });
      }
      
      if (staff.roles.includes("healthcare assistant")) {
        healthcareassistant.push({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`
        });
      }
      
      if (staff.roles.includes("lab technician")) {
        labTechnicians.push({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`
        });
      }
      
      if (staff.roles.includes("pharmacist")) {
        pharmacies.push({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`
        });
      }
    });
  };
  categorizeStaff(allStaff);


  const [selectedLabTest, setSelectedLabTest] = useState("cholesterol");
  const startSmartExam = () => {
    // Set the selected user for the call
    ///setSelectedUser(patient);
    // Switch to the callsetup tab
    if (activeTab === "summary") {
      setActiveTab("smartExam");
    } else {
      setActiveTab("summary");
    }
  };
 

  const PatientInfoSection = ({ SelectedPatient }) => {
    const calculateAge = (birthDate) => {
      const birth = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const isBirthdayPassed =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
          today.getDate() >= birth.getDate());
      return isBirthdayPassed ? age : age - 1;
    };

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    return (
      <div className="mb-6 rounded-lg bg-gradient-to-r from-[#007664]/5 to-[#75C05B]/5 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Demographics Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#007664]/10">
                <User className="size-6 text-[#007664]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="max-w-full break-words text-lg font-semibold text-[#007664]">
                  {`${capitalize(SelectedPatient?.firstName)} ${capitalize(SelectedPatient?.lastName)}`}
                </p>
                <p id="patient-id" className="text-sm text-gray-500">
                  ID: {SelectedPatient?.patientReference}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="text-sm text-gray-600">
                    {calculateAge(SelectedPatient?.birthDate)} years,{" "}
                    {SelectedPatient?.gender}
                  </span>
                  <div className="rounded-full bg-[#75C05B]/10 px-2 py-0.5">
                    <span className="text-xs font-medium text-[#75C05B]">
                      {SelectedPatient?.medicalCondition}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#007664]/10">
          <Phone className="size-6 text-[#007664]" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium text-gray-500">Contact</p>
          <div className="w-full break-words text-lg font-semibold text-[#007664]">
            <p className="mb-1">{SelectedPatient?.phone}</p>
           
          </div>
          <p className="text-base text-[#007664]">
              {SelectedPatient?.email}
            </p>
          <p className="mt-2 text-sm text-gray-600">
            <span className="inline-block rounded-full bg-[#B24531]/10 px-2 py-0.5 text-xs text-[#B24531]">
              {SelectedPatient?.emergencyContact}
            </span>
          </p>
        </div>
      </div>
    </div>

          {/* Address Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
    <div className="flex size-12 items-center justify-center rounded-full bg-[#007664]/10">
      <MapPin className="size-6 text-[#007664]" />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <p className="text-sm font-medium text-gray-500">Address</p>
      <p className="max-w-full break-words text-sm font-semibold text-[#007664]">
        {SelectedPatient?.address}
      </p>
      {SelectedPatient?.preferredLanguage && (  
        <p className="mt-2 text-sm font-medium text-gray-500">Preferred Language</p>
      )}
      {SelectedPatient?.preferredLanguage && (
        <p className="text-sm font-semibold text-[#007664]">
          {capitalize(SelectedPatient?.preferredLanguage)}
        </p>
      )}
    </div>
  </div>
</div>

        </div>
      </div>
    );
  };

  const handleViewMed = (medication) => {
    setViewMedState({
      isOpen: true,
      selectedMedication: medication,
    });
  };
  const handleEditMed = (medication) => {
    setEditMedState({
      isOpen: true,
      selectedMedication: medication,
    });
  };

  const handleEditLab = (labtest) => {
    setEditLabState({
      isOpen: true,
      selectedLabtest: labtest,
    });
  };

  const handleViewLab = (labtest) => {
    setViewLabState({
      isOpen: true,
      selectedLabtest: labtest,
    });
  };

  const handleEditExam = (examination) => {
    setEditExamState({
      isOpen: true,
      selectedExamination: examination,
    });
  };

  const handleViewExam = (examination) => {
    setViewExamState({
      isOpen: true,
      selectedExamination: examination,
    });
  };

  const handleViewDiag = (diagnoses) => {
    setViewDiagState({
      isOpen: true,
      selectedDiagnoses: diagnoses,
    });
  };

  const handleEditDiag = (diagnoses) => {
    setEditDiagState({
      isOpen: true,
      selectedDiagnoses: diagnoses,
    });
  };
  const [activeTabtrigger, setActiveTabtrigger] = React.useState("summary");
  const handleTabtriggerChange = (tab) => {
    setActiveTabtrigger(tab);
    setIsAddlabtestOpen(false);
    setIsAddmOpen(false);
    setIsAddOpen(false);
    setIsAddDOpen(false);
  };
  const handleDialogClose = () => {
    setIsAddlabtestOpen(false);
    setIsAddmOpen(false);
    setIsAddOpen(false);
    setIsAddDOpen(false);
    setIsEditMedicationOpen(false);

    setViewMedState({ isOpen: false, selectedMedication: {} });
    setEditMedState({ isOpen: false, selectedMedication: null });
    setViewExamState({ isOpen: false, selectedExamination: {} });
    setEditExamState({ isOpen: false, selectedExamination: null });
    setViewDiagState({ isOpen: false, selectedDiagnoses: {} });
    setEditDiagState({ isOpen: false, selectedDiagnoses: null });
    setViewLabState({ isOpen: false, selectedLabtest: {} });
    setEditLabState({ isOpen: false, selectedLabtest: null });
  };

  const VisitHistoryModal = ({ visit, open, onClose }) => {
    if (!visit) return null;

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out">
          <div className="relative">
            <div className="absolute -top-10 right-0 flex space-x-2">
              <div className="rounded-full bg-green-100 p-2 text-green-700">
                <CheckCircle className="size-5" />
              </div>
              <div className="rounded-full bg-red-100 p-2 text-red-700">
                <XCircle className="size-5" />
              </div>
            </div>
            <DialogHeader className="mb-4 border-b pb-4">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-[#007664]">
                <Calendar className="size-7 text-[#009882]" />
                Visit Details - {visit.date}
              </DialogTitle>
            </DialogHeader>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-[#00a98e] to-[#007664] p-4 text-white shadow-md">
                <User className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Doctor</h3>
                <p className="text-sm opacity-80">{visit.doctor}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow-md">
                <Stethoscope className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Purpose</h3>
                <p className="text-sm opacity-80">{visit.purpose}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-4 text-white shadow-md">
                <Calendar className="mb-2 size-6" />
                <h3 className="text-lg font-semibold">Status</h3>
                <p className="text-sm opacity-80">Completed</p>
              </div>
            </div>

            <div className="space-y-6">
              {visit.examination && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                    <Stethoscope className="size-6" />
                    Examination Details
                  </h3>
                  {visit.examination.vitalSigns && (
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(visit.examination.vitalSigns).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="rounded-lg bg-white p-4 shadow-md transition-all hover:scale-105"
                          >
                            <div className="mb-1 text-sm capitalize text-gray-500">
                              {key.replace(/([A-Z])/g, " $1")}
                            </div>
                            <div className="text-lg font-bold text-[#007664]">
                              {value}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {visit.examination.findings && (
                    <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
                      <h4 className="mb-2 font-semibold text-[#009882]">
                        Clinical Findings
                      </h4>
                      <p className="text-gray-700">
                        {visit.examination.findings}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {visit.diagnosis && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                    <ScrollText className="size-6" />
                    Diagnosis
                  </h3>
                  <div className="rounded-lg bg-white p-4 shadow-md">
                    <p className="text-gray-700">{visit.diagnosis}</p>
                  </div>
                </div>
              )}

              {visit.labTests && visit.labTests.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold text-[#009882]">
                    <TestTubes className="size-6" />
                    Laboratory Tests
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {visit.labTests.map((test, idx) => (
                      <div
                        key={idx}
                        className="flex items-center rounded-full bg-white px-4 py-2 text-sm text-[#007664] shadow-md"
                      >
                        {test}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const filterByVisitHistory = (items, visitHistory) => {
    // Ensure visitHistory is an array

   /// console.log('this is itmw1')
    //console.log(items)
    //console.log('this is itmw1')
    if (!Array.isArray(visitHistory)) {
      console.warn('visitHistory is not an array');
      return [];
    }
  
    // Handle empty arrays
    if (!visitHistory.length || !items.length) {
      return [];
    }
  
    // Extract serviceIds from visit history
    const visitHistoryIds = visitHistory.map(visit => visit.serviceId);
    
    // Filter items where details._id exists in visitHistoryIds
    return items.filter(item => {
      // Check if item has details and details._id
      if (item?.details?._id) {
        return visitHistoryIds.includes(item.details._id);
      }
      return false;
    });
  };
  console.log("test1");
const patientvisitHistory = (filterByVisitHistory(mergedVisitHistory,isvisithistory))
  //console.log(isvisithistory);

  const vitalsData = examinations[0]?.vitals ? [{
    temperature: Number(examinations[0].vitals.temperature),
    bloodPressure: Number(examinations[0].vitals.bloodPressure),
    pulse: Number(examinations[0].vitals.pulse),
    timestamp: new Date().toISOString()
  }] : [];



  const handleReferralInputChange = (e) => {
    const { name, value } = e.target;
    setReferralData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [loadingReferalSubmit, setLoadingReferalSubmit] = useState(false);

  const submitReferral = async () => {
    setLoadingReferalSubmit(true); // Start loading
    const fallbackReferredBy = currentUser?._id;
    const referralPayload = {
      ...referralData,
      referredBy: referralData.referredBy || fallbackReferredBy
    };

   // console.log('fallbackReferredBy')
   // console.log(referralPayload)

    try {
        const result = await createReferral(referralPayload);
        if (result.error) {
            console.error("Referral creation failed:", result.error);
            return;
        }

        setStatusDialog({
          isOpen: true,
          status:  "success",
          message: "Patient Referred successfully"
            
        });
        closerefModal();
        // Reset the state but preserve patient ID and generate a new referralID
        setReferralData(prevState => ({
            patient: prevState.patient,
            referralID: generateReferralId(),
            referredBy: currentUser._id,
            referralType: "",
            referredTo: "",
            referralReason: "",
            status: "pending"
        }));
        
    } catch (error) {
        console.error("Unexpected error:", error);
        setStatusDialog({
          isOpen: true,
          status:  "error",
          message:"Failed to Refer Patient"
        });
    } finally {
      setLoadingReferalSubmit(false); // Stop loading
    }
};


  const handleSubmitReferral = () => {
    submitReferral()
  };
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
 
 //diagnosis table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // Calculate pagination indices
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = diagnoses?.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Calculate total pages
  const totalPages = Math.ceil((diagnoses?.length || 0) / recordsPerPage);

 
 //examination table pagination
  const [examCurrentPage, setExamCurrentPage] = useState(1);
const examRecordsPerPage = 10;

// Calculate index range for slicing the data
const examIndexOfLastRecord = examCurrentPage * examRecordsPerPage;
const examIndexOfFirstRecord = examIndexOfLastRecord - examRecordsPerPage;
const examCurrentRecords = examinations.slice(examIndexOfFirstRecord, examIndexOfLastRecord);

// Calculate total pages
const examTotalPages = Math.ceil(examinations.length / examRecordsPerPage);


//labtest table paginations
const [labTestCurrentPage, setLabTestCurrentPage] = useState(1);
const labTestRecordsPerPage = 10;

// Calculate index range for slicing the data
const labTestIndexOfLastRecord = labTestCurrentPage * labTestRecordsPerPage;
const labTestIndexOfFirstRecord = labTestIndexOfLastRecord - labTestRecordsPerPage;
const labTestCurrentRecords = labTests.slice(labTestIndexOfFirstRecord, labTestIndexOfLastRecord);

// Calculate total pages
const labTestTotalPages = Math.ceil(labTests.length / labTestRecordsPerPage);

//medication table pagination

const [medCurrentPage, setMedCurrentPage] = useState(1);
const medRecordsPerPage = 10;

// Calculate index range for slicing the data
const medIndexOfLastRecord = medCurrentPage * medRecordsPerPage;
const medIndexOfFirstRecord = medIndexOfLastRecord - medRecordsPerPage;
const medCurrentRecords = medications.slice(medIndexOfFirstRecord, medIndexOfLastRecord);

// Calculate total pages
const medTotalPages = Math.ceil(medications.length / medRecordsPerPage);




const BookingButton = ({ externalUrl }) => {
  const openUrl = (url) => {
    if (!url) return;
    
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(formattedUrl, "_blank");
  };

  return (
    <Button 

      onClick={() => openUrl(externalUrl)}
      title="Use this when you need to escalate the patient to a senior doctor or specialist"
      className="flex items-center justify-center gap-2 bg-[#007664] px-4 py-2 text-white transition-all duration-300 hover:bg-[#007664]/90"
      >
      <Calendar className="size-4" />
      <span>Book Expert Consultation</span>
    </Button>
  );
};










const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState('basic');
  /*
  // Sample data structure - focused on current visit
  const data = {
    clinic: {
      name: 'E-Likita Medical Center',
      address: '123 Healthcare Avenue',
      phone: '+234 123 456 7890',
      email: 'info@e-likita.com'
    },
    patient: {
      id: 'PT001',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      phone: '+234 098 765 4321',
      address: '456 Patient Street, Lagos'
    },
    currentVisit: {
      date: '2025-02-23',
      time: '14:30',
      chiefComplaint: 'Persistent headache and fever',
      duration: '5 days',
      examination: {
        vitals: {
          bp: '130/85',
          temperature: '37.8°C',
          pulse: '82 bpm',
          weight: '75 kg',
          height: '175 cm',
          bmi: '24.5'
        },
        findings: {
          generalAppearance: 'Alert and oriented',
          respiratory: 'Clear breath sounds bilaterally',
          cardiovascular: 'Regular rate and rhythm',
          gastrointestinal: 'Soft, non-tender',
          musculoskeletal: 'Normal range of motion',
          neurological: 'No focal deficits'
        }
      },
      diagnosis: {
        primary: 'Acute Migraine',
        secondary: 'Stress-induced hypertension',
        notes: 'Patient shows typical migraine symptoms with added stress factors'
      },
      labTests: [
        { name: 'Complete Blood Count', result: 'Normal' },
        { name: 'Blood Pressure Monitoring', result: 'Slightly Elevated' }
      ],
      currentMedications: [
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed' },
        { name: 'Propranolol', dosage: '40mg', frequency: 'Once daily' }
      ]
    }
  };
  const colors = {
    primary: '#007664',    // Dark Teal
    secondary: '#75C05B',  // Light Green
    accent: '#B24531',     // Rust Red
    highlight: '#53FDFD',  // Bright Cyan
    background: '#F5F5F5', // Off-White
    white: '#FFFFFF'
  };
  const calculateAge = (birthDate) =>{
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
  const birthDate = new Date(SelectedPatient.birthDate).toISOString().split('T')[0];
  console.log('examinations?.physicalExam');
  console.log(examinations);
  const formatSectionName = (name) => name.replace(/([A-Z])/g, ' $1').trim();

  // Helper function to check if an object has valid data
  const hasValidData = (obj) => {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    if (typeof obj === 'object') {
      return Object.keys(obj).length > 0 && 
             Object.values(obj).some(value => 
               value && 
               (typeof value !== 'object' || hasValidData(value))
             );
    }
    return true;
  };
  
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Medical Report - E-Likita</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                background-color: ${colors.background};
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                background-color: ${colors.primary};
                color: white;
                padding: 20px;
                border-radius: 8px;
              }
              .header h1 {
                margin: 0;
                color: ${colors.highlight};
              }
              .header p {
                margin: 5px 0;
                opacity: 0.9;
              }
              .section { 
                margin-bottom: 25px;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .section h2 {
                color: ${colors.primary};
                margin-top: 0;
                padding-bottom: 10px;
                border-bottom: 2px solid ${colors.secondary};
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 15px;
                background: white;
              }
              th { 
                background-color: ${colors.primary}; 
                color: white;
                padding: 12px 8px;
              }
              td { 
                padding: 12px 8px;
                border: 1px solid #ddd;
              }
              tr:nth-child(even) {
                background-color: ${colors.background};
              }
              .footer { 
                margin-top: 50px; 
                text-align: center;
                color: ${colors.primary};
                font-size: 0.9em;
              }
              .visit-header { 
                background-color: ${colors.secondary}; 
                color: white;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .vitals-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 15px;
              }
              .vital-card {
                background: white;
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                border: 1px solid ${colors.highlight};
              }
              .vital-value {
                font-size: 1.2em;
                color: ${colors.primary};
                font-weight: bold;
              }
              .vital-label {
                color: #666;
                font-size: 0.9em;
                margin-top: 5px;
              }
              @media print {
                body {
                  background-color: white;
                }
                .section {
                  box-shadow: none;
                  border: 1px solid #ddd;
                }
                .visit-header {
                  box-shadow: none;
                  border: 1px solid ${colors.secondary};
                }
              }
            </style>
            
          </head>
          <body>
            <div class="header">
              <h1>${data.clinic.name}</h1>
              <p>${data.clinic.address}</p>
              <p>Phone: ${data.clinic.phone} | Email: ${data.clinic.email}</p>
            </div>

         <div class="section"> 
  <h2>Patient Information</h2>
  <table>
    <tr>
      <td><strong>First Name:</strong> ${capitalize(SelectedPatient.firstName)}</td>
      <td><strong>Last Name:</strong> ${capitalize(SelectedPatient.lastName)}</td>
    </tr>
    <tr>
      <td><strong>ID:</strong> ${SelectedPatient.patientReference}</td>
      <td><strong>Gender:</strong> ${SelectedPatient.gender}</td>
    </tr>
    <tr>
      <td><strong>Birth Date:</strong> ${birthDate}</td>
      <td><strong>Age:</strong> ${calculateAge(birthDate)}</td>
    </tr>
    <tr>
      <td><strong>Phone:</strong> ${SelectedPatient.phone}</td>
      <td><strong>Email:</strong> ${SelectedPatient.email}</td>
    </tr>
    <tr>
      <td><strong>Address:</strong> ${SelectedPatient.address}</td>
      <td><strong>Medical Condition:</strong> ${SelectedPatient.medicalCondition}</td>
    </tr>
    <tr>
      <td><strong>Progress:</strong> ${SelectedPatient.progress}</td>
      <td><strong>Status:</strong> ${SelectedPatient.status}</td>
    </tr>
    <tr>
      <td><strong>Emergency Contact:</strong> ${SelectedPatient.emergencyContact}</td>
      <td><strong>Insurance Provider:</strong> ${SelectedPatient.insuranceProvider}</td>
    </tr>
  </table>
</div>


            ${reportType === 'detailed' ? `
              <div class="visit-header">
                <strong>Visit Date:</strong> ${data.currentVisit.date} | 
                <strong>Time:</strong> ${data.currentVisit.time}<br>
                <strong>Chief Complaint:</strong> ${data.currentVisit.chiefComplaint}
              </div>

             <div class="section"> 
  <h2>Vital Signs</h2>
  <div class="vitals-grid">
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            // Get the latest examination entry
            const latestExam = examinations[examinations.length - 1];

            // Ensure the latest examination has vitals data
            if (!latestExam?.vitals) {
              return "<div>No vital signs recorded</div>";
            }

   const { weight, height, bloodPressure, temperature, pulse } = latestExam.vitals;

            // Calculate BMI (Ensure height is in meters)
            const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(2) : "N/A";

            return `
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.bloodPressure || "N/A"}</div>
                <div class="vital-label">Blood Pressure</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.temperature ?? "N/A"}</div>
                <div class="vital-label">Temperature</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.pulse ?? "N/A"}</div>
                <div class="vital-label">Pulse</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.weight ?? "N/A"}</div>
                <div class="vital-label">Weight</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.height ?? "N/A"}</div>
                <div class="vital-label">Height</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${bmi ?? "N/A"}</div>
                <div class="vital-label">BMI</div>
              </div>
            `;
          })()
        : "<div>No vital signs recorded</div>"
    }
  </div>
</div>




<div class="section">
  <h2>Chief Complaint</h2>
  <div class="complaints-list">
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            const latestExam = examinations[examinations.length - 1];

            if (!latestExam?.chiefComplain || Object.keys(latestExam.chiefComplain).length === 0) {
              return "<div>No chief complaints recorded</div>";
            }

            const formatName = (name) => {
              return name
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            };

            const nonEmptySections = Object.entries(latestExam.chiefComplain)
              .map(([sectionName, issues]) => {
                const validIssues = Object.entries(issues || {})
                  .filter(([_, details]) => {
                    if (!details) return false;
                    if (Array.isArray(details)) return details.length > 0;
                    if (typeof details === 'object') {
                      return Object.values(details).some(val => 
                        val && 
                        ((Array.isArray(val) && val.length > 0) || 
                         (typeof val === 'object' && Object.keys(val).length > 0) ||
                         val.toString().trim() !== '')
                      );
                    }
                    return details.toString().trim() !== '';
                  })
                  .map(([issueName, details]) => {
                    const formattedIssueName = formatName(issueName);
                    return `<li style="color: #006666; margin: 5px 0; font-size: 15px;">${formattedIssueName}</li>`;
                  })
                  .join('');

                if (!validIssues) return '';
                
                const formattedSectionName = formatName(sectionName);
                return `
                  <div class="complaint-category" style="margin-bottom: 15px;">
                    <strong style="color: #004d4d; font-size: 16px;">${formattedSectionName}:</strong>
                    <ul style="list-style-type: disc; margin-top: 8px; padding-left: 25px;">${validIssues}</ul>
                  </div>
                `;
              })
              .filter(Boolean)
              .join('');

            return nonEmptySections || "<div>No significant complaints recorded</div>";
          })()
        : "<div>No chief complaints recorded</div>"
    }
  </div>
</div>



<div class="section"> 
  <h2>Physical Examination</h2>
  <table>
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            // Get the latest examination entry
            const latestExam = examinations[examinations.length - 1]; 

            // Ensure the latest examination has physical exam data
            if (!latestExam?.physicalExam || Object.keys(latestExam.physicalExam).length === 0) {
              return "<tr><td colspan='2'>No physical exam findings recorded</td></tr>";
            }
         
            return Object.entries(latestExam.physicalExam).map(([examPart, subFindings]) => `
              <tr>
                <td><strong>${examPart}:</strong></td>
                <td>
                  <table>
                    ${Object.entries(subFindings || {}).map(([subCategory, result]) => `
                      <tr>
                        <td><strong>${subCategory}:</strong></td>
                        <td>${result || "Not Examined"}</td>
                      </tr>
                    `).join('')}
                  </table>
                </td>
              </tr>
            `).join('');
          })()
        : "<tr><td colspan='2'>No physical exam findings recorded</td></tr>"
    }
  </table>
</div>





           <div class="section"> 
  <h2>Diagnosis</h2>
  <table>
    ${diagnoses.length > 0 ? (() => {
      const latestDiagnosis = diagnoses[diagnoses.length - 1]; // Get the most recent diagnosis

      return `
        <tr>
          <th>Diagnosis ID</th>
          <td>${latestDiagnosis.diagnosisId}</td>
        </tr>
        <tr>
        <th>Primary Diagnosis</th>
        <td>${latestDiagnosis.primaryDiagnosis?.category} - ${latestDiagnosis.primaryDiagnosis?.code} (${latestDiagnosis.primaryDiagnosis?.codeDescription})</td>
      </tr>

        <tr>
          <th>Severity</th>
          <td>${latestDiagnosis.severity || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>${latestDiagnosis.status}</td>
        </tr>
        <tr>
          <th>Priority</th>
          <td>${latestDiagnosis.priority}</td>
        </tr>
        <tr>
          <th>Verification Status</th>
          <td>${latestDiagnosis.verificationStatus || 'Pending'}</td>
        </tr>
        <tr>
          <th>Chronicity Status</th>
          <td>${latestDiagnosis.chronicityStatus || 'Not specified'}</td>
        </tr>
        ${latestDiagnosis.additionalDiagnoses.length > 0 ? `
          <tr>
            <th>Additional Diagnoses</th>
            <td>
              <ul>
                ${latestDiagnosis.additionalDiagnoses.map(d => `
                  <li>
                    <strong>Type:</strong> ${d.type} | <strong>Category:</strong> ${d.category} <br>
                    <strong>Code:</strong> ${d.code} (${d.codeDescription}) <br>
                    <strong>Category Description:</strong> ${d.categoryDescription}
                  </li>
                `).join('')}
              </ul>
            </td>
          </tr>
        ` : ''}
        <tr>
          <th>Expected Outcome</th>
          <td>${latestDiagnosis.expectedOutcome || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Other Outcomes</th>
          <td>${latestDiagnosis.otherOutcome || 'None'}</td>
        </tr>
        <tr>
          <th>Timeframe</th>
          <td>${latestDiagnosis.timeframe || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Prognosis Notes</th>
          <td>${latestDiagnosis.prognosisAdditionalNotes || 'None'}</td>
        </tr>
        ${latestDiagnosis.appointmentDate ? `
          <tr>
            <th>Follow-up Appointment</th>
            <td>${latestDiagnosis.appointmentDate} at ${latestDiagnosis.appointmentTime} (${latestDiagnosis.appointmentType})</td>
          </tr>
        ` : ''}
        <tr>
          <th>Additional Notes</th>
          <td>${latestDiagnosis.diagnosesisadditionalNotes || 'None'}</td>
        </tr>
      `;

    })() : `<tr><td colspan="2">No diagnosis recorded</td></tr>`}
  </table>
</div>


           <div class="section"> 
  <h2>Latest Laboratory Tests</h2>
  <table>
    <tr>
      <th>Lab Test ID</th>
      <th>Test Name</th>
      <th>Result</th>
    </tr>
    ${labTests.length > 0 ? (() => {
      const latestTestEntry = labTests[labTests.length - 1]; // Get the most recent entry
      const allTests = latestTestEntry.testSelections.flatMap(testCategory => 
        testCategory.tests.map(test => ({
          name: test,
          result: latestTestEntry?.result || 'Pending'
        }))
      );

      // Add "otherTest" if it exists
      latestTestEntry.testSelections.forEach(testCategory => {
        if (testCategory.otherTest) {
          allTests.push({ name: testCategory.otherTest, result: latestTestEntry?.result || 'Pending' });
        }
      });

      return allTests.map((test, index) => `
        <tr>
          ${index === 0 ? `<td rowspan="${allTests.length}">${latestTestEntry.labtestID}</td>` : ''}
          <td>${test.name}</td>
          <td>${test.result}</td>
        </tr>
      `).join('');

    })() : `<tr><td colspan="3">No laboratory tests recorded</td></tr>`}
  </table>
</div>



             <div class="section"> 
  <h2>Current Medication</h2>
  <table>
    <tr>
       <th>Medication ID</th>
      <th>Medication</th>
      <th>Dosage</th>
    
      <th>Duration (Days)</th>
      <th>Follow-Up</th>
    </tr>
    ${medications?.length > 0 ? (() => {
      const latestMed = medications[medications?.length - 1]; // Get the most recent entry
      return `
        <tr>
          <td>${latestMed?.medicationId}</td>
          <td>${latestMed?.medicationName}</td>
          <td>${latestMed?.dosage}</td>
          <td>${latestMed?.treatmentDuration}</td>
          <td>${latestMed?.followUpProtocol || 'N/A'}</td>
        </tr>
      `;
    })() : `<tr><td colspan="5">No medications recorded</td></tr>`}
  </table>
</div>

            ` : ''}

            <div class="footer">
              <p>Report generated on ${new Date().toLocaleDateString()}</p>
              <p>This is a computer-generated document and does not require a signature.</p>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    }
    setIsModalOpen(false);
  };
*/


const handleReportPrint = () => {
  
  handlePrintReport({
    setIsModalOpen,
    diagnoses,
    medications,
    labTests,
    examinations,
    SelectedPatient,
    reportType,
    settings,
    currentUser,
    currentDashboard
  });
};

  return (
    <div>
      {activeTab === "summary" && (
        <div className="flex items-center justify-between">
          <Card
            className="w-full bg-[#75C05B]/10"
            style={{
              width: isMobile ? "100vw" : "80vw", // Full width only on mobile
              margin: "0",
              padding: "0",
            }}
          >
            <h2 className="text-2xl font-bold text-[#007664]"> </h2>

            <CardHeader className="mb-4 flex flex-row items-center justify-between bg-gradient-to-r from-[#007664] to-[#75C05B]">
              {/* Patient Info */}
           {/* Wrapper for proper responsive layout */}
<div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  
  {/* Patient Name Section */}
  <div className="grow">
    <CardTitle className="text-white">
      {`${capitalize(SelectedPatient?.firstName)} ${capitalize(SelectedPatient?.lastName)} (${SelectedPatient?.patientReference}) Profile`}
    </CardTitle>
  </div>

  {/* Action Buttons Group */}
  <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
    {!isInCall && (
      <>
        <BookingButton externalUrl={bookingUrls.external} />
      </>
    )}

    <Button
      onClick={() => setIsModalOpen(true)} 
      className="flex w-full items-center justify-center gap-2 border border-[#007664] bg-white text-[#007664] hover:bg-[#F7F7F7] sm:w-40"
    >
      <Printer className="size-4" />
      <span>Print Report</span>
    </Button>

    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="w-full max-w-sm sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Select Report Type</DialogTitle>
    </DialogHeader>

    <div className="py-6">
      <RadioGroup 
        value={reportType} 
        onValueChange={setReportType}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="basic" 
            id="basic"
            className="border-teal-800 text-teal-800 focus:ring-teal-800"
          />
          <Label htmlFor="basic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Basic Report
            <p className="text-sm text-gray-500">Includes patient information only</p>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="detailed" 
            id="detailed"
            className="border-teal-800 text-teal-800 focus:ring-teal-800"
          />
          <Label htmlFor="detailed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Detailed Report
            <p className="text-sm text-gray-500">Includes current visit details and findings</p>
          </Label>
        </div>
      </RadioGroup>
    </div>

    <DialogFooter className="flex justify-end space-x-2">
      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
        Cancel
      </Button>
      <Button 
        onClick={handleReportPrint}
        className="bg-teal-800 text-white hover:bg-teal-900"
      >
        Proceed
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


    <Button
      onClick={openrefModal}
      className="flex w-full items-center justify-center gap-2 bg-[#007664] text-white hover:bg-[#007664]/80 sm:w-40"
    >
      <Share2 className="size-4" />
      <span>Refer Patient</span>
    </Button>
  </div>
</div>


            </CardHeader>
            {/* Modal for selection */}
            <Modal
  isOpen={refmodalIsOpen}
  onRequestClose={closerefModal}
  className="fixed inset-0 flex items-center justify-center bg-black/50"
>
  <div className="mx-auto w-[90%] max-w-sm rounded-lg bg-white p-6 shadow-md md:max-w-lg">
    <h2 className="mb-4 text-2xl font-bold text-[#007664]">Select Referral Type</h2>

    <select
      value={selectedrefOption}
      onChange={handleSelectrefChange}
      className="mb-4 w-full rounded-md border border-[#75C05B] p-2"
    >
      <option value="">Select an option</option>
      <option value="doctor">Doctor</option>
      <option value="remotedoctor">Remote Doctor</option>
      <option value="healthcareassistant">Healthcare Assistant</option>
      <option value="labTech">Lab Technician</option>
      <option value="pharmacy">Pharmacy</option>
    </select>

    {selectedrefOption && (
      <div>
        <h3 className="mb-2 text-lg font-medium text-[#007664]">
        {`Select ${
  selectedrefOption === "doctor"
    ? "Referring Doctor"
    : selectedrefOption === "labTech"
    ? "Lab Technician"
    : selectedrefOption === "pharmacy"
    ? "Pharmacy"
    : selectedrefOption === "remotedoctor"
    ? "Remote Doctor"
    : selectedrefOption === "healthcareassistant"
    ? "Healthcare Assistant"
    : "Role"
}`}
        </h3>
        <select
          value={selectedRef}
          onChange={handleRefChange}
          className="mb-4 w-full rounded-md border border-[#75C05B] p-2"
        >
          <option value="">Select {selectedrefOption}</option>
          {list.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        {(selectedrefOption === "doctor" || selectedrefOption === "remotedoctor" ||
  selectedrefOption === "healthcareassistant") && (
          <div className="mb-4">
            <label htmlFor="referralReason" className="mb-2 block font-medium text-[#007664]">
              Referral Reason:
            </label>
            <input
              type="text"
              id="referralReason"
              name="referralReason"
              value={referralData.referralReason}
              onChange={handleReferralInputChange}
              placeholder="Enter the reason for the referral"
              className="w-full rounded-md border border-[#75C05B] p-2"
            />
          </div>
        )}
      </div>
    )}

    <div className="flex justify-end">
      <button
        onClick={closerefModal}
        className="mr-2 rounded-md bg-[#B24531] px-4 py-2 text-white hover:bg-[#a13d2a]"
      >
        Close
      </button>
      <button
        onClick={handleSubmitReferral}
        className={`rounded-md px-4 py-2 text-white transition-colors ${
          loadingReferalSubmit ? "cursor-not-allowed bg-gray-400" : "bg-[#007664] hover:bg-[#00654f]"
        }`}
      >
        {loadingReferalSubmit ? "Submitting..." : "Submit"}
      </button>
    </div>
  </div>
</Modal>

<StatusDialog
                        isOpen={statusDialog.isOpen}
                        onClose={() => {
                          setStatusDialog((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                          if (statusDialog.status === "success") {
                            triggerRefresh();
                          }
                        }}
                        status={statusDialog.status}
                        message={statusDialog.message}
                      />
<div>
                  

                    
                    </div>
            <CardContent>
              <PatientInfoSection SelectedPatient={SelectedPatient} />
              <Tabs
                value={activeTabtrigger}
                onValueChange={setActiveTabtrigger}
                className="w-full"
              >
                <TabsList className="mb-4 grid w-full grid-cols-2 gap-4 sm:mb-6 sm:grid-cols-2 md:grid-cols-5">
                  <TabsTrigger
                    value="summary"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <FileText className="size-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="examination"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Stethoscope className="size-4" />
                    Examination
                  </TabsTrigger>
                  <TabsTrigger
                    value="labresult"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Thermometer className="size-4" />
                    Lab Test
                  </TabsTrigger>
                  <TabsTrigger
                    value="diagnoses"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <FileText className="size-4" />
                    Diagnosis
                  </TabsTrigger>

                  <TabsTrigger
                    value="medications"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Pill className="size-4" />
                    Medications
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="summary"
                  className="mt-32 sm:mt-6"
                  style={{
                    width: isMobile ? "75vw" : "70vw", // Full width only on mobile
                    margin: "6",
                    padding: "0",
                  }}
                >
                  <div className="space-y-6">
                    {/* Top row with Demographics, Vitals, and Call Button */}
                    
                    <Card className="flex h-full flex-col bg-[#F7F7F7]">
                      <CardContent className="flex-1 overflow-auto">
                        <div className="mt-3 space-y-4">
                          <div>
                     

                            <VitalsChart  vitals={patientvisitHistory} />
                          </div>

                          {/* Rest of the component remains structurally the same, just updating colors 
                          <div>
                            <h3 className="mb-2 text-lg font-medium text-[#007664]">
                              Previous Lab Test
                            </h3>
                            <div className="mb-2">
                              <Select
                                onValueChange={setSelectedLabTest}
                                value={selectedLabTest}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select lab test" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cholesterol">
                                    Cholesterol
                                  </SelectItem>
                                  <SelectItem value="bloodSugar">
                                    Blood Sugar
                                  </SelectItem>
                                  <SelectItem value="creatinine">
                                    Creatinine
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={labResults}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey={selectedLabTest}
                                  stroke="#007664"
                                  name={selectedLabTest}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>*/}
                        </div>
                        <div className="mt-6"></div>
                      </CardContent>
                    </Card>
                    {/* Visit History Section */}
                    <Patientvisit  patientvisitHistory={patientvisitHistory}/>

                  </div>
                </TabsContent>

                <TabsContent value="examination" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex flex-col justify-between sm:flex-row">
                    <h3 className="mb-4 text-lg font-semibold text-[#007664] sm:mb-0">
                       Examinations History
                    </h3>
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-x-4">
                     
                    <Button className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto"
                     onClick={() =>  handleDialogChange ('true', "add")}
                    >
                            <Plus className="size-4" />
                            New Examination
                          </Button>
                     
                   
                    {isAddOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() =>  handleDialogClose()}
      >
        ✕
      </button>
                      
                     
                     
                     

                          <NewExamination
                            onTabChange={handleTabtriggerChange}
                            patient={patient._id}
                            onClose={handleDialogClose}
                            onSubmit={(status, message) =>
                              handleExamSubmit(status, message)
                            }
                            examinations={examinations}
                             buttonText="Submit"
                             currentDashboard={currentDashboard}

                          />
                      </div></div>)}
                      





                      <StatusDialog
                        isOpen={statusDialog.isOpen}
                        onClose={() => {
                          setStatusDialog((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                          if (statusDialog.status === "success") {
                            triggerRefresh();
                          }
                        }}
                        status={statusDialog.status}
                        message={statusDialog.message}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg  border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Time</th>
                          <th className="px-4 py-2 text-left">Examined By</th>
                          <th className="px-4 py-2 text-left">Examined At</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                      {examCurrentRecords.length > 0 ? (
    examCurrentRecords?.slice()
    .reverse() 
    .map((examination) => {
    const formatDateTime = (dateTimeString) => {
      const dateObj = new Date(dateTimeString);
      const date = dateObj.toISOString().split("T")[0];
      let hours = dateObj.getHours();
      let minutes = dateObj.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      minutes = minutes.toString().padStart(2, "0");
      const time = `${hours}:${minutes} ${amPm}`;
      return { date, time };
    };

    const formatted = formatDateTime(examination.createdAt);

    return (
      <tr key={examination._id}>
        <td className="px-4 py-2">{examination.examinationID}</td>
        <td className="px-4 py-2">{formatted.date}</td>
        <td className="px-4 py-2">{formatted.time}</td>
      
        <td className="px-4 py-2">
  {["doctor", "remote doctor"].includes(examination.examinedByAccType) ? "Dr. " : ""}
  {examination?.examinedBy?.firstName} {examination?.examinedBy?.lastName}
</td>
        <td className="px-4 py-2">{examination.examinedAt}</td>
        <td className="px-4 py-2">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => handleViewExam(examination)}
            >
              <Eye className="size-4" />
            </Button>
            <Dialog
                                    open={viewExamState.isOpen}
                                    onOpenChange={(isOpen) =>
                                      !isOpen && handleDialogClose()
                                    }
                                  >
                                    <DialogTrigger asChild></DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Examination Details
                                        </DialogTitle>
                                      </DialogHeader>

                                      <ViewExamination
                                        examination={
                                          viewExamState.selectedExamination
                                        }
                                        isOpen={viewExamState.isOpen}
                                        onClose={handleDialogClose}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                        onClick={() =>
                                          handleEditExam(examination)
                                        }
                                      >
                                        <Edit className="size-4" />
                                      </Button>


                                  {editExamState.isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() =>  handleDialogClose()}
      >
        ✕
      </button>
                                 

                                      <NewExamination
                                        onTabChange={handleTabtriggerChange}
                                        patient={patient._id}
                                        initialExamination={
                                          editExamState.selectedExamination
                                        }
                                        onClose={handleDialogClose}
                                        onSubmit={(status, message) =>
                                          handleExamSubmit(status, message)
                                        }
                                         buttonText="Update"
                                         currentDashboard={currentDashboard}
                                         examinations={examinations}


                                      />
                             </div></div>)}


            <Button
              variant="ghost"
              size="icon"
              className="text-red-700 hover:text-red-800"
              onClick={() => startDelete(examination._id, "Examination")}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  })): (
    <tr>
      <td colSpan="6" className="p-4 text-center text-gray-500">
        No records found
      </td>
    </tr>
  )}
</tbody>

{/* Pagination Controls */}
{examinations.length > 10 && (
  <div className="mt-4 flex items-center justify-between">
    <button
      onClick={() => setExamCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={examCurrentPage === 1}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-gray-700">
      Page {examCurrentPage} of {examTotalPages}
    </span>
    <button
      onClick={() => setExamCurrentPage((prev) => Math.min(prev + 1, examTotalPages))}
      disabled={examCurrentPage === examTotalPages}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="diagnoses" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Diagnoses History
                    </h3>
                    <Button className="bg-[#007664] hover:bg-[#007664]/80"
                     onClick={() => handleDialogDChange(true, "add")}
                    >
                          <Plus className="size-4" />
                          New Diagnosis
                        </Button>

                    {isAddDOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() =>  handleDialogDChange(isOpen, "add")}
      >
        ✕
      </button>
                   

                        <NewDiagnosisForm
                          onTabChange={handleTabtriggerChange}
                          diagnoses={diagnoses}
                          onClose={handleDialogClose}

                          patient={patient._id}
                          onSubmit={(status, message) =>
                            handleDiagnosisSubmit(status, message)
                          }
                          buttonText="Submit"
                          currentDashboard={currentDashboard}
                        />
                
</div></div> )}




                    <StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        if (statusDialog.status === "success") {
                          triggerRefresh();
                        }
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Severity</th>
                          <th className="px-4 py-2 text-left">Diagnosed By</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                      {currentRecords.length > 0 ? (

currentRecords
  ?.slice()
  .reverse() 
  .map((diagnosis) => {
    if (!diagnosis) return null;

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return { date: "N/A", time: "N/A" };
      const dateObj = new Date(dateTimeString);
      if (isNaN(dateObj.getTime())) return { date: "Invalid Date", time: "Invalid Time" };

      const date = dateObj.toISOString().split("T")[0];
      let hours = dateObj.getUTCHours();
      let minutes = dateObj.getUTCMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      minutes = minutes.toString().padStart(2, "0");
      const time = `${hours}:${minutes} ${amPm}`;

      return { date, time };
    };

    const formatted = formatDateTime(diagnosis?.createdAt || "");

    return (
      <tr key={diagnosis.id}>
        <td className="px-4 py-2">{diagnosis.diagnosisId}</td>
        <td className="px-4 py-2">{formatted.date} {formatted.time}</td>
        <td className="px-4 py-2">{capitalize( diagnosis.status)}</td>
        <td className="px-4 py-2">{capitalize( diagnosis.severity)}</td>
        <td className="px-4 py-2">
  {["doctor", "remote doctor"].includes(diagnosis.diagnosedByAccType) ? "Dr. " : ""}
  {diagnosis.diagnosedBy.firstName} {diagnosis.diagnosedBy.lastName}
</td>
        <td className="px-4 py-2">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => handleViewDiag(diagnosis)}
            >
              <Eye className="size-4" />
            </Button>
            <Dialog
                                    open={viewDiagState.isOpen}
                                    onOpenChange={(isOpen) =>
                                      !isOpen && handleDialogClose()
                                    }
                                  >
                                    <DialogTrigger asChild></DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Diagnosis Details
                                        </DialogTitle>
                                      </DialogHeader>

                                      <ViewDiagnosis
                                        diagnosis={
                                          viewDiagState.selectedDiagnoses
                                        }
                                        isOpen={viewDiagState.isOpen}
                                        onClose={handleDialogClose}
                                      />
                                    </DialogContent>
                                  </Dialog>


                                  <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                        onClick={() =>
                                          handleEditDiag(diagnosis)
                                        }
                                      >
                                        <Edit className="size-4" />
                                      </Button>
                                  {editDiagState.isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() =>  handleDialogClose()}
      >
        ✕
      </button>


                                      <NewDiagnosisForm
                                        onTabChange={handleTabtriggerChange}
                                        onClose={handleDialogClose}

                                        diagnoses={diagnoses}
                                        patient={patient._id}
                                        onSubmit={(status, message) =>
                                          handleDiagnosisSubmit(status, message)
                                        }
                                        initialDiagnosis={
                                          editDiagState.selectedDiagnoses
                                        }
                                        buttonText="Update"
                                        currentDashboard={currentDashboard}

                                      />
                                </div>  </div>
                              )}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-700 hover:text-red-800"
              onClick={() => startDelete(diagnosis._id, "Diagnoses")}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </td>
      </tr>
    ) })): (
      <tr>
        <td colSpan="6" className="p-4 text-center text-gray-500">
          No records found
        </td>
      </tr>
    )}
</tbody>

{/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex items-center justify-between p-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600 disabled:opacity-50"
    >
      Previous
    </button>

    <span className="text-sm font-medium text-gray-700">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600 disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="labresult" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Lab Test History
                    </h3>
                    <Button className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto"
                    onClick={() => handleDialogChangelabtest (true, "add")}
                    >
                          <Plus className="size-4" />
                          New Lab Test
                        </Button>
                    {isAddlabtestOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() => handleDialogChangelabtest(isOpen, "add")}
      >
        ✕
      </button>
                   
                        <NewLabTestForm
                          onTabChange={handleTabtriggerChange}
                          patient={patient._id}
                          onSubmit={(status, message) =>
                            handleDiagnosisSubmit(status, message)
                          }
                          buttonText="Submit"
                          labTests={labTests}
                          currentDashboard={currentDashboard}
                          onClose={handleDialogClose}

                        />
               </div> </div>)}




                    <StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        if (statusDialog.status === "success") {
                          triggerRefresh();
                        }
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
                  </div>

                  <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full table-auto border-collapse">
  <thead className="bg-[#007664] text-white">
    <tr>
      <th className="px-4 py-2 text-left">ID</th>
      <th className="px-4 py-2 text-left">Date</th>
      <th className="px-4 py-2 text-left">Time</th>
      <th className="px-4 py-2 text-left">Priority</th>
      <th className="px-4 py-2 text-left">Requested By</th>
      <th className="px-4 py-2 text-left">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y">
  {labTestCurrentRecords.length > 0 ? (

    labTestCurrentRecords?.slice()
    .reverse() 
    .map((test) => {
      if (!test) return null;

      const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return { date: "N/A", time: "N/A" };

        const dateObj = new Date(dateTimeString);
        if (isNaN(dateObj.getTime())) return { date: "Invalid Date", time: "Invalid Time" };

        const date = dateObj.toISOString().split("T")[0];
        let hours = dateObj.getUTCHours();
        let minutes = dateObj.getUTCMinutes();
        const amPm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        minutes = minutes.toString().padStart(2, "0");

        return { date, time: `${hours}:${minutes} ${amPm}` };
      };

      const formatted = formatDateTime(test?.createdAt || "");

      return (
        <tr key={test?._id}>
          <td className="px-4 py-2">{test.labtestID}</td>
          <td className="px-4 py-2">{formatted.date}</td>
          <td className="px-4 py-2">{formatted.time}</td>
          <td className="px-4 py-2">{test.priority}</td>
          <td className="px-4 py-2">
  {["doctor", "remote doctor"].includes(test.requestedByAccType) ? "Dr. " : ""}
  {test.requestedBy.firstName} {test.requestedBy.lastName}
</td>
          <td>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => handleViewLab(test)}
              >
                <Eye className="size-4" />
              </Button>

              <Dialog
                                    open={viewLabState.isOpen}
                                    onOpenChange={(isOpen) =>
                                      !isOpen && handleDialogClose()
                                    }
                                  >
                                    <DialogTrigger asChild></DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Lab Test</DialogTitle>
                                      </DialogHeader>

                                      <ViewLabTest
                                        labtest={viewLabState.selectedLabtest}
                                        isOpen={viewLabState.isOpen}
                                        onClose={handleDialogClose}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                        onClick={() => handleEditLab(test)}
                                      >
                                        <Edit className="size-4" />
                                      </Button>


                                  {editLabState.isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() => handleDialogClose()}
      >
        ✕
      </button>


                                   
                                      <NewLabTestForm
                                        onTabChange={handleTabtriggerChange}
                                        patient={patient._id}
                                        onSubmit={(status, message) =>
                                          handleDiagnosisSubmit(status, message)
                                        }
                                        initialLabtest={
                                          editLabState.selectedLabtest
                                        }
                                        buttonText="Update"
                                        labTests={labTests}
                                        currentDashboard={currentDashboard}
                                        onClose={handleDialogClose}

                                      />
                               </div>  </div>)}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-700 hover:text-red-800"
                onClick={() => startDelete(test._id, "LabTest")}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </td>
        </tr>
      ) })): (
        <tr>
          <td colSpan="6" className="p-4 text-center text-gray-500">
            No records found
          </td>
        </tr>
      )}
  </tbody>
</table>

{/* Pagination Controls */}
{labTests.length > 10 && (
  <div className="mt-4 flex items-center justify-between">
    <button
      onClick={() => setLabTestCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={labTestCurrentPage === 1}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-gray-700">
      Page {labTestCurrentPage} of {labTestTotalPages}
    </span>
    <button
      onClick={() => setLabTestCurrentPage((prev) => Math.min(prev + 1, labTestTotalPages))}
      disabled={labTestCurrentPage === labTestTotalPages}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Recent Medications
                    </h3>
                    <>
  <Button
    className="bg-[#007664] hover:bg-[#007664]/80"
    onClick={() => handleDialogmChange(true, "add")}
  >
    <Plus className="size-4" />
    Add Medication
  </Button>

  {isAddmOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() => handleDialogmChange(false, "add")}
      >
        ✕
      </button>

      <NewMedicationForm
        medications={medications}
        patient={patient._id}
        onClose={handleDialogClose}
        onSubmit={(status, message) => handleMedSubmit(status, message)}
        currentDashboard={currentDashboard}
        buttonText="Submit"
      />
    </div>
  </div>
)}

</>

                    <StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        if (statusDialog.status === "success") {
                          triggerRefresh();
                        }
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">
                            Medication Name
                          </th>
                          <th className="px-4 py-2 text-left">Duration (Days)</th>
                          <th className="px-4 py-2 text-left">Requested By</th>

                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                      {medCurrentRecords.length > 0 ? (

  medCurrentRecords?.slice()
  .reverse() 
  .map((medication) => {
    if (!medication) return null;

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return { date: "N/A", time: "N/A" };

      const dateObj = new Date(dateTimeString);
      if (isNaN(dateObj.getTime())) return { date: "Invalid Date", time: "Invalid Time" };

      const date = dateObj.toISOString().split("T")[0];
      let hours = dateObj.getUTCHours();
      let minutes = dateObj.getUTCMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      minutes = minutes.toString().padStart(2, "0");

      return { date, time: `${hours}:${minutes} ${amPm}` };
    };

    const formatted = formatDateTime(medication?.createdAt || "");
 //console.log(medication?.createdAt )
 const key = medication.id || medication._id || medication.medicationId || index;

    return (
      <tr key={key}>
        <td className="px-4 py-2">{medication.medicationId}</td>
        <td className="px-4 py-2">{formatted.date} {formatted.time}</td>
        <td className="px-4 py-2">{capitalize(medication.medicationName)}</td>
        <td className="px-4 py-2">{medication.treatmentDuration}</td>
        <td className="px-4 py-2">
  {["doctor", "remote doctor"].includes(medication.requestedByAccType) ? "Dr. " : ""}
  {medication?.requestedBy?.firstName || "N/A"} {medication?.requestedBy?.lastName || "N/A"}

</td>
        <td>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => handleViewMed(medication)}
            >
              <Eye className="size-4" />
            </Button>
            <Dialog
                                    open={viewMedState.isOpen}
                                    onOpenChange={(isOpen) =>
                                      !isOpen && handleDialogClose()
                                    }
                                  >
                                    <DialogTrigger asChild></DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Medication Details
                                        </DialogTitle>
                                      </DialogHeader>

                                      <ViewMedication
                                        medic={viewMedState.selectedMedication}
                                        isOpen={viewMedState.isOpen}
                                        onClose={handleDialogClose}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                        onClick={() =>
                                          handleEditMed(medication)
                                        }
                                      >
                                        <Edit className="size-4" />
                                      </Button>

                                      {editMedState.isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
        onClick={() => handleDialogClose()}
      >
        ✕
      </button>
                                  
                                      <NewMedicationForm
                                        medications={medications}
                                        patient={patient._id}
                                        onClose={handleDialogClose}
                                        onSubmit={(status, message) =>
                                          handleMedSubmit(status, message)
                                        }
                                        initialMedication={
                                          editMedState.selectedMedication
                                        }
                                        currentDashboard={currentDashboard}
                                        buttonText="Update"

                                      />
                                      </div>  </div>
                                    )}

                                  
            <Button
              variant="ghost"
              size="icon"
              className="text-red-700 hover:text-red-800"
              onClick={() => startDelete(medication._id, "Medication")}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </td>
      </tr>
    ) })): (
      <tr>
        <td colSpan="6" className="p-4 text-center text-gray-500">
          No records found
        </td>
      </tr>
    )}
</tbody>

{/* Pagination Controls */}
{medications.length > 10 && (
  <div className="mt-4 flex items-center justify-between">
    <button
      onClick={() => setMedCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={medCurrentPage === 1}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-gray-700">
      Page {medCurrentPage} of {medTotalPages}
    </span>
    <button
      onClick={() => setMedCurrentPage((prev) => Math.min(prev + 1, medTotalPages))}
      disabled={medCurrentPage === medTotalPages}
      className="rounded bg-teal-500 px-4 py-2 text-white disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <ConfirmationDialog
            show={showDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            item={itemToDelete}
          />
        </div>
      )}
    </div>
  );
};

export default PatientDetailsView;
