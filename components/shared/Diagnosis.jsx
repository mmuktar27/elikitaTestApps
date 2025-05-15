"use client";
import React, { useEffect, useState } from "react";

// Lucide Icons
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  Edit,
  Lightbulb,
  Loader2,
  Plus,
  RefreshCw,
  Stethoscope,
  TrendingUp
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createDiagnosis, updateDiagnosisData } from "../shared/api";

// Third-party Modal
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export function NewDiagnosisForm({
  onTabChange,
  onClose,
  diagnoses,
  patient,
  diagnosesid = null,
  onSubmit,
  initialDiagnosis = null,
  buttonText,
 currentDashboard,

}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(initialDiagnosis || {});
  const [errors, setErrors] = useState({});
  const session = useSession();
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState({});
  const [expandedVisit, setExpandedVisit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
  const [expandedDiagnosis, setExpandedDiagnosis] = React.useState(null);

  const [manualUpdateTrigger, setManualUpdateTrigger] = useState(false);

  const resetForm = () => {
    setFormData([
      {
        severity: "2",
        category: "",
        priority: "",
        chronicityStatus: "",
        diagnosisType: "",
        differentialDiagnoses: "",
        status: "",
        description: "",
        verificationStatus: "",
        diagnosesisadditionalNotes: "",
        expectedOutcome: "",
        otherOutcome: "",
        timeframe: "",
        riskLevel: "",
        recoveryPotential: "",
        appointmentType: "",
        appointmentDate: "",
        appointmentTime: "",
        prognosisadditionalNotes: "",
      },
    ]);

    setAdditionalDiagnoses([]);
  };



  const generateDiagnosisId = () => {
    const now = new Date();
    const year = now.getFullYear();

    // Get unix timestamp and take last 4 digits
    const timestamp = Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4);

    // Combine elements with prefix
    const diagnosisId = `DIA-${year}-${timestamp}`;

    return diagnosisId;
  };

  useEffect(() => {
    const handleDiagnosisData = async () => {
      if (!formData) {
        console.warn("No form data available. Exiting function.");
        return;
      }
    
      console.log("Handling diagnosis data:", formData);
      setIsLoading(true); // Set loading state at the start
    
      try {
        if (formData._id) {
          console.log("Existing diagnosis found. Updating...");
          await updateDiagnosisData(formData, resetForm, onTabChange,onClose, onSubmit);
          console.log("Diagnosis update process completed.");
        } else {
          console.log("No existing diagnosis found. Creating new diagnosis...");
    
          if (!patient) {
            console.error("Error: patient is undefined before calling createDiagnosis!");
            return;
          }
    
          //console.log("Patient data before sending:", patient);
          await createDiagnosis(formData, resetForm, onTabChange,onClose, onSubmit, patient);
          //console.log("Diagnosis creation process completed.");
        }
      } catch (error) {
        console.error("Error handling diagnosis data:", error);
      } finally {
        setIsLoading(false); // Ensure loading state resets after operation
      }
    };
    
    if (manualUpdateTrigger) {
      // Only run if trigger is true
      handleDiagnosisData();
      setManualUpdateTrigger(false);
    //  console.log(formData)
    }
  }, [formData, manualUpdateTrigger, onClose, onSubmit, onTabChange, patient]);




  function filterFormData(formData) {
    // Handle null or undefined input
    if (formData === null || formData === undefined) {
      return {};
    }
    
    // Handle non-object inputs
    if (typeof formData !== 'object') {
      return formData;
    }
    
    // Handle arrays
    if (Array.isArray(formData)) {
      const filteredArray = formData
        .map(item => filterFormData(item)) // Recursively filter each item
        .filter(item => {
          // Remove empty objects, arrays, null, undefined, or empty strings
          if (item === null || item === undefined || item === '') {
            return false;
          }
          
          if (Array.isArray(item) && item.length === 0) {
            return false;
          }
          
          if (typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0) {
            return false;
          }
          
          return true;
        });
      
      // Only return the array if it has content
      return filteredArray.length > 0 ? filteredArray : undefined;
    }
    
    // Handle objects
    const result = {};
    let hasValidProperties = false;
    
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const value = formData[key];
        
        // Recursively filter the value
        const filteredValue = filterFormData(value);
        
        // Skip null, undefined, empty strings
        if (filteredValue === null || filteredValue === undefined || filteredValue === '') {
          continue;
        }
        
        // Skip empty arrays
        if (Array.isArray(filteredValue) && filteredValue.length === 0) {
          continue;
        }
        
        // Skip empty objects
        if (typeof filteredValue === 'object' && !Array.isArray(filteredValue) && Object.keys(filteredValue).length === 0) {
          continue;
        }
        
        // Add valid values to result
        result[key] = filteredValue;
        hasValidProperties = true;
      }
    }
    
    // Only return the object if it has valid properties
    return hasValidProperties ? result : undefined;
  }
  const handlesubmitDiagnosis = () => {
    const finalOutcome =
    formData.expectedOutcome === "other"
      ? otherExpectedOutcome
      : formData.expectedOutcome; 
  
     if (buttonText === "Update") {
      const updatedData = {
        patient: patient,
        _id: initialDiagnosis._id,
        diagnosisId: initialDiagnosis.diagnosisId,
        diagnosedBy: session?.data?.user?.id,
        diagnosedAt: "Gembu Center",
        primaryDiagnosis: primaryDiagnosis,
        additionalDiagnoses: additionalDiagnoses,
        expectedOutcome:finalOutcome,
      };
    
      
      const filteredfomdatad = filterFormData(formData);
      const filteredupdatedData = filterFormData(updatedData);
      setFormData({
        ...filteredfomdatad,
        ...filteredupdatedData
      });
    }
  

  if (buttonText == "Submit") {
    setFormData((prevData) => ({
      ...prevData,
      patient: patient,
      diagnosisId: generateDiagnosisId(),
      diagnosedBy: session?.data?.user?.id,
      diagnosedByAccType: currentDashboard,
      diagnosedAt: "Gembu Center",
      primaryDiagnosis: primaryDiagnosis,
      additionalDiagnoses: additionalDiagnoses,
      expectedOutcome:finalOutcome,

    }));
  }
 
  setManualUpdateTrigger(true)
  };
  



  const handleSubmitClick = async () => {
    const isValid = buttonText === "Update" ? true : validatePrognosisForm();
    console.log("Validation Result:", isValid);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      handlesubmitDiagnosis();
    } catch (error) {
      console.error("Error submitting Diagnosis:", error);
    
      // Log stack trace if available
      if (error instanceof Error) {
        console.error("Stack Trace:", error.stack);
      }
    
      // Log additional details if it's an API or validation error
      if (error.response) {
        console.error("Server Response:", error.response.data);
      } else if (error.message) {
        console.error("Error Message:", error.message);
      } else {
        console.error("Unknown Error:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
    
  };

  const validatePrognosisForm = () => {
    let newErrors = {};

    // Validate Severity (must be selected)

    // Validate Expected Outcome
    if (!formData?.expectedOutcome?.trim()) {
      newErrors.expectedOutcome = "Expected outcome is required.";
    }

    // Validate Risk Level
    if (!formData?.riskLevel?.trim()) {
      newErrors.riskLevel = "Risk level is required.";
    }

    // Validate Recovery Potential
    if (!formData?.recoveryPotential?.trim()) {
      newErrors.recoveryPotential = "Recovery potential is required.";
    }
    if (!formData?.timeframe?.trim()) {
      newErrors.timeframe = "TimeFrame is required.";
    }

    // Validate Appointment Type
    if (
      !formData?.appointmentType?.trim() &&
      (formData?.appointmentDate || formData?.appointmentTime)
    ) {
      newErrors.appointmentType =
        "Appointment type is required if date or time is set.";
    }

    // Validate Appointment Date (must be in YYYY-MM-DD format)
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Validate Appointment Date (Optional, but must be in the future or today)
    if (formData?.appointmentDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.appointmentDate)) {
        newErrors.appointmentDate = "Invalid date format (YYYY-MM-DD).";
      } else if (
        new Date(formData.appointmentDate) < now.setHours(0, 0, 0, 0)
      ) {
        newErrors.appointmentDate = "Appointment date cannot be in the past.";
      }
    }

    // Validate Appointment Time (Optional, but must be in the future if set)
    if (formData?.appointmentTime) {
      if (!/^\d{2}:\d{2}$/.test(formData.appointmentTime)) {
        newErrors.appointmentTime = "Invalid time format (HH:MM).";
      } else if (formData.appointmentDate === today) {
        const [hours, minutes] = formData.appointmentTime
          .split(":")
          .map(Number);
        const appointmentDateTime = new Date();
        appointmentDateTime.setHours(hours, minutes, 0, 0);

        if (appointmentDateTime < now) {
          newErrors.appointmentTime = "Appointment time cannot be in the past.";
        }
      } else if (!formData.appointmentDate) {
        newErrors.appointmentTime =
          "Appointment date must be set if specifying time.";
      }
    }

    // Debugging output
    console.log("Validation Errors:", newErrors);

    // Set errors in state
    setErrors(newErrors);

    // Return false if there are validation errors
    return Object.keys(newErrors).length === 0;
  };

  const validateDiagnosisForm = () => {
    let newErrors = {};
   // pimaryDiagnosis
    // Validate Severity (must be selected)
   

    if (!primaryDiagnosis?.category) {
      newErrors.primaryDiagnosis = "Primary diagnosis is required.";
      
    }
    if (!formData?.severity) {
      newErrors.severity = "Severity selection is required.";
    }



    // Validate Priority (must be selected)
    if (!formData?.priority) {
      newErrors.priority = "Priority selection is required.";
    }

    // Validate Chronicity Status
    if (!formData?.chronicityStatus?.trim()) {
      newErrors.chronicityStatus = "Chronicity status is required.";
    }





    // Debugging output
    console.log("Validation Errors:", newErrors);

    // Set errors in state
    setErrors(newErrors);

    // Return false if there are validation errors
    return Object.keys(newErrors).length === 0;
  };

  const [sicknessSections, setSicknessSection] = useState({
    generalSymptoms: {
      title: "General Symptoms",
      subsections: {
        fever: {
          title: "Fever",
          fields: [
            { name: "feverDuration", label: "Duration (Days)", type: "text" },
            {
              name: "feverNature",
              label: "Nature",
              type: "select",
              options: ["Everyday", "Alternative", "Irregular", "Others"],
            },
            {
              name: "feverType",
              label: "Type",
              type: "select",
              options: ["All day", "Morning", "Evening", "Night", "Others"],
            },
            {
              name: "feverIntensity",
              label: "Intensity",
              type: "select",
              options: ["High", "Low", "High and Low", "None", "Others"],
            },
            {
              name: "shivers",
              label: "Shivers?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms?",
              type: "radio",
              options: ["Yes", "No"],
              requiresSpecify: true,
            },

            {
              name: "cough",
              label: "Cough?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "coughWithBleeding",
              label: "Cough with bleeding?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "pain",
              label: "Any Pain?",
              type: "radio",
              options: ["Yes", "No"],
              requiresSpecify: true,
            },

            {
              name: "generalWeakness",
              label: "General Weakness?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "lossOfWeight",
              label: "Loss of weight?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "burningInUrine",
              label: "Burning in urine?",
              type: "radio",
              options: ["Yes", "No"],
            },
            { name: "causes", label: "What causes it?", type: "text" },
            { name: "reliefs", label: "What relieves it?", type: "text" },
            {
              name: "bodyTemperature",
              label: "Body temperature",
              type: "autofilled",
            },
            {
              name: "chillsSweating",
              label: "Chills or sweating",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "fatigueWeakness",
              label: "Fatigue or weakness",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "bodyAches",
              label: "Body aches",
              type: "radio",
              options: ["Yes", "No"],
            },
          ],
        },
        generalWeakness: {
          title: "General Weakness/Fatigue",
          fields: [
            {
              name: "weaknessDuration",
              label: "Duration (Days)",
              type: "text",
            },
            {
              name: "appetite",
              label: "Appetite",
              type: "select",
              options: ["Normal", "Decreased", "Others"],
            },
            {
              name: "weightChange",
              label: "Change in Weight",
              type: "select",
              options: ["Increased", "Decreased", "No Change", "Others"],
            },
            {
              name: "abdominalPain",
              label: "Abdominal Pain?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "chestPain",
              label: "Chest Pain?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "fever",
              label: "Fever?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "cough",
              label: "Cough?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "diarrhea",
              label: "Diarrhea?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "constipation",
              label: "Constipation?",
              type: "radio",
              options: ["Yes", "No"],
            },
          ],
        },
        specificWeakness: {
          title: "Specific Weakness",
          fields: [
            {
              name: "specificWeaknessDuration",
              label: "Duration (Days)",
              type: "text",
            },
            {
              name: "weaknessLocation",
              label: "Location of Weakness",
              type: "text",
            },
            {
              name: "historyOfInjury",
              label: "History of Injury (H/O injury)?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            { name: "startCause", label: "How did it start?", type: "text" },
            {
              name: "progress",
              label: "Progress",
              type: "select",
              options: ["Same as Before", "Improving", "Worsening", "Others"],
            },
          ],
        },
        dizziness: {
          title: "Dizziness",
          fields: [
            {
              name: "dizzinessDuration",
              label: "Duration (Days)",
              type: "text",
            },
            {
              name: "dizzinessNature",
              label: "Nature",
              type: "select",
              options: ["Everyday", "Some Days", "Others"],
            },
            {
              name: "dizzinessType",
              label: "Type",
              type: "select",
              options: ["Whole Day", "Morning", "Evening", "Others"],
            },
            {
              name: "dizzinessCause",
              label: "What causes it?",
              type: "text",
            },
            {
              name: "dizzinessRelief",
              label: "What relieves it?",
              type: "text",
            },
            {
              name: "relationWithPosition",
              label: "Relation with Position",
              type: "select",
              options: [
                "Lying Down",
                "Standing Up",
                "Moving Neck",
                "Opening Eyes",
                "None",
                "Others",
              ],
            },
            {
              name: "historyOfFainting",
              label: "History of Fainting?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "historyOfFall",
              label: "History of Fall?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: [
                "Vomiting",
                "Chest Pain",
                "Breathlessness",
                "Pain in Ear",
                "None",
                "Others",
              ],
            },
            {
              name: "vision",
              label: "Vision",
              type: "select",
              options: ["All Right", "Diminished", "Others"],
            },
            {
              name: "hearing",
              label: "Hearing",
              type: "select",
              options: ["Normal", "Less", "Others"],
            },
          ],
        },
        fainting: {
          title: "Fainting",
          fields: [
            {
              name: "faintingEpisodes",
              label: "Number of Episodes",
              type: "text",
            },
            {
              name: "intervalBetweenEpisodes",
              label: "Interval Between Episodes",
              type: "text",
            },
            {
              name: "consciousnessLost",
              label: "Is Consciousness Lost?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedFits",
              label: "Any Associated Fits?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "fall",
              label: "Fall?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "dizziness",
              label: "Dizziness?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "faintingCause",
              label: "What Brings It On?",
              type: "text",
            },
            {
              name: "faintingRelief",
              label: "How Is It Relieved?",
              type: "text",
            },
          ],
        },
        headache: {
          title: "Headache",
          fields: [
            {
              name: "painLocation",
              label: "Pain Location",
              type: "select",
              options: [
                "Forehead",
                "Temples",
                "Behind the Eyes",
                "Top of the Head",
                "Back of the Head",
                "One Side of the Head",
                "Neck",
                "Other (Specify)",
              ],
            },
            {
              name: "painIntensity",
              label: "Intensity",
              type: "select",
              options: ["Mild", "Moderate", "Severe", "Others"],
            },
            {
              name: "durationOfHeadache",
              label: "Duration of Headache",
              type: "select",
              options: [
                "Less than 1 Hour",
                "1-3 Hours",
                "3-6 Hours",
                "6-12 Hours",
                "More than 12 Hours",
                "Intermittent",
                "Continuous",
                "Other (Specify)",
              ],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: [
                "Nausea",
                "Sensitivity to Light",
                "Sensitivity to Sound",
                "Others",
              ],
            },
          ],
        },
      },
    },
    gastrointestinalIssues: {
      title: "Gastrointestinal Issues",
      subsections: {
        acidityIndigestion: {
          title: "Acidity/Indigestion",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "abdominalPain",
              label: "Any Abdominal Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "vomiting",
              label: "Any Vomiting?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "nausea",
              label: "Nausea?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "bowelHabitChange",
              label: "Change in Bowel Habit?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "appetite",
              label: "Appetite",
              type: "select",
              options: ["Normal", "Less", "Others"],
            },
            {
              name: "constipation",
              label: "Constipation?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "diarrhea",
              label: "Diarrhea?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            { name: "cause", label: "What causes it?", type: "text" },
            { name: "worsens", label: "What worsens it?", type: "text" },
            {
              name: "jaundiceHistory",
              label: "History of Jaundice?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "alcohol",
              label: "Alcohol Ingestion?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "smoking",
              label: "History of Smoking?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "weightChange",
              label: "Change in Weight?",
              type: "select",
              options: ["Increased", "Decreased", "Did Not Change", "Others"],
            },
          ],
        },
        diarrhea: {
          title: "Diarrhea",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "stoolType",
              label: "Stool Type",
              type: "select",
              options: ["Watery", "Soft", "Ill-formed", "Others"],
            },
            {
              name: "nature",
              label: "Nature",
              type: "select",
              options: ["Everyday", "Some Days", "Others"],
            },
            { name: "frequency", label: "Frequency", type: "text" },
            {
              name: "blood",
              label: "With Blood?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Any Associated Symptoms?",
              type: "multi-select",
              options: [
                "Vomiting",
                "Abdominal Pain",
                "Fever",
                "None",
                "Others",
              ],
            },
            {
              name: "relationWithFood",
              label: "Any Relation with Food?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "currentMedications",
              label: "Any Current Medications?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        vomiting: {
          title: "Vomiting",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "nature",
              label: "Nature",
              type: "select",
              options: ["Everyday", "Some Days", "Others"],
            },
            { name: "frequency", label: "Frequency", type: "text" },
            {
              name: "appetite",
              label: "Appetite",
              type: "select",
              options: ["Normal", "Less", "Others"],
            },
            { name: "cause", label: "What causes it?", type: "text" },
            { name: "relief", label: "What relieves it?", type: "text" },
            {
              name: "blood",
              label: "With Blood?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: [
                "Abdominal Pain",
                "Headache",
                "Diarrhea",
                "Constipation",
                "None",
                "Others",
              ],
            },
            {
              name: "nausea",
              label: "Nausea?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        abdominalPain: {
          title: "Abdominal Pain",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "startLocation",
              label: "Where did it start?",
              type: "select",
              options: [
                "Upper (R)",
                "Upper (C)",
                "Upper (L)",
                "Middle (R)",
                "Middle (C)",
                "Middle (L)",
                "Lower (R)",
                "Lower (C)",
                "Lower (L)",
                "All Over",
                "Others",
              ],
            },
            {
              name: "currentLocation",
              label: "Where is it now?",
              type: "select",
              options: [
                "Upper (R)",
                "Upper (C)",
                "Upper (L)",
                "Middle (R)",
                "Middle (C)",
                "Middle (L)",
                "Lower (R)",
                "Lower (C)",
                "Lower (L)",
                "All Over",
                "Others",
              ],
            },
            {
              name: "painStart",
              label: "How did the pain start?",
              type: "select",
              options: ["Sudden", "Gradual", "Others"],
            },
            {
              name: "intensity",
              label: "Intensity",
              type: "select",
              options: ["Mild", "Moderate", "Severe", "Varies", "Others"],
            },
            {
              name: "nature",
              label: "Nature",
              type: "select",
              options: [
                "Continuous",
                "Comes and Goes",
                "Sometimes Worse",
                "Others",
              ],
            },
            {
              name: "triggers",
              label: "What brings it on?",
              type: "select",
              options: ["Food", "Empty Stomach", "Period", "None", "Others"],
            },
            {
              name: "relief",
              label: "What relieves it?",
              type: "select",
              options: ["Food", "Vomiting", "None", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: [
                "Constipation",
                "Diarrhea",
                "Vomiting",
                "Loss of Appetite",
                "None",
                "Others",
              ],
            },
          ],
        },
        bleedingWithStool: {
          title: "Bleeding with Stool",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "stoolColor",
              label: "Color of Stool",
              type: "select",
              options: ["Bright Red", "Dark Red", "Others"],
            },
            {
              name: "amount",
              label: "Amount of Stool",
              type: "select",
              options: ["Lot", "Drops", "Others"],
            },
            {
              name: "painDuringPassing",
              label: "Pain During Passing Stool?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "bowelHabitChange",
              label: "Change in Bowel Habit?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "constipation",
              label: "Constipation?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "diarrhea",
              label: "Diarrhea?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        ulcer: {
          title: "Ulcer",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            { name: "location", label: "Where?", type: "text" },
            {
              name: "startCause",
              label: "How did it start?",
              type: "select",
              options: ["Injury", "On its Own", "Others"],
            },
            {
              name: "pain",
              label: "Any Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "surface",
              label: "Surface",
              type: "select",
              options: [
                "Clean",
                "Dirty",
                "Pink",
                "Black",
                "Green",
                "Mixed",
                "Others",
              ],
            },
            {
              name: "edges",
              label: "Edges",
              type: "select",
              options: ["Raised", "Flat", "Others"],
            },
            { name: "size", label: "Size", type: "text" },
          ],
        },
      },
    },
    respiratoryIssues: {
      title: "Respiratory Issues",
      subsections: {
        coughThroatProblem: {
          title: "Cough/Throat Problem",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "frequency",
              label: "How Often?",
              type: "select",
              options: [
                "All Day",
                "In the Morning",
                "At Night",
                "Sometimes",
                "Others",
              ],
            },
            {
              name: "sputum",
              label: "Is there any Sputum?",
              type: "radio",
              options: ["Yes", "No"],
            },
            {
              name: "sputumColor",
              label: "Color of the Sputum",
              type: "select",
              options: ["Yellow", "Green", "Others"],
            },
            {
              name: "sputumAmount",
              label: "Amount of Sputum",
              type: "select",
              options: ["Lot", "Medium", "Small", "Others"],
            },
            {
              name: "fever",
              label: "Is there any Fever?",
              type: "radio",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "difficultySwallowing",
              label: "Is there any Difficulty in Swallowing?",
              type: "radio",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "throatPain",
              label: "Is there any Pain in the Throat?",
              type: "radio",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "breathingDifficulty",
              label: "Is there any Difficulty in Breathing?",
              type: "radio",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        shortnessOfBreath: {
          title: "Difficulty in Breathing/Shortness of Breath",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "progression",
              label: "How has it progressed?",
              type: "select",
              options: [
                "Same as Before",
                "Worsening",
                "Improving",
                "Varies with Reason",
                "Others",
              ],
            },
            {
              name: "triggers",
              label: "What brings it on?",
              type: "select",
              options: ["Exertion", "Climbing Stairs", "None", "Others"],
            },
            {
              name: "relief",
              label: "What relieves it?",
              type: "select",
              options: ["Rest", "Sitting Up", "None", "Others"],
            },
            {
              name: "wakesAtNight",
              label: "Does it wake you up at night?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "chestPain",
              label: "Any Chest Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "cough",
              label: "Any Cough?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: ["General Weakness", "Fever", "Others"],
            },
          ],
        },
        soreThroat: {
          title: "Sore Throat",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "text" },
            {
              name: "severity",
              label: "Severity",
              type: "select",
              options: ["Mild", "Moderate", "Severe", "Others"],
            },
            {
              name: "painLevel",
              label: "Pain Level",
              type: "select",
              options: ["Mild", "Moderate", "Severe", "Others"],
            },
            {
              name: "painLocation",
              label: "Pain Location",
              type: "select",
              options: [
                "Left Side",
                "Right Side",
                "Both Sides",
                "Back of Throat",
                "Others",
              ],
            },
            {
              name: "difficultySwallowing",
              label: "Difficulty Swallowing?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "voiceChanges",
              label: "Voice Changes?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "associatedSymptoms",
              label: "Associated Symptoms",
              type: "multi-select",
              options: [
                "Fever",
                "Cough",
                "Runny Nose",
                "Ear Pain",
                "Swollen Glands",
                "Others",
              ],
            },
            {
              name: "recentIllness",
              label: "Recent Illness or Exposure to Illness?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
      },
    },

    urinaryAndReproductiveHealth: {
      title: "Urinary and Reproductive Health",
      subsections: {
        yellowUrine: {
          title: "Yellow Urine",
          fields: [
            { name: "duration", label: "Duration (Days)", type: "number" },
            {
              name: "abdominalPain",
              label: "Abdominal Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "fever",
              label: "Fever?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "stoolColor",
              label: "Color of Stool?",
              type: "select",
              options: ["Normal", "Others"],
            },
            {
              name: "burningWithUrine",
              label: "Burning with Urine?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "generalWeakness",
              label: "General Weakness?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        urinaryIssues: {
          title: "Urinary Issues",
          fields: [
            {
              name: "symptomsDuration",
              label: "How long have you felt the symptoms?",
              type: "number",
            },
            {
              name: "frequencyPerDay",
              label: "Number of times/day?",
              type: "number",
            },
            {
              name: "frequencyNature",
              label: "Nature of frequency?",
              type: "select",
              options: ["All day", "More at night", "Others"],
            },
            {
              name: "burningNature",
              label: "Nature of burning?",
              type: "select",
              options: [
                "Only at the beginning",
                "All through passing urine",
                "Others",
              ],
            },
            {
              name: "burningColor",
              label: "Color of burning?",
              type: "select",
              options: ["Normal", "Dark Yellow", "Others"],
            },
            {
              name: "fever",
              label: "Is there any fever?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "bloodInUrine",
              label: "Any blood in urine?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "urineHolding",
              label: "Can you hold urine?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "urineStream",
              label: "How is the stream?",
              type: "select",
              options: ["As before", "Weak", "Others"],
            },
          ],
        },
        menstrualIssues: {
          title: "Menstrual Issues",
          fields: [
            {
              name: "hadPeriod",
              label: "Did you have period ever?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "firstPeriod",
              label: "When was your first period?",
              type: "date",
            },
            {
              name: "periodFrequency",
              label: "How often do your periods take place?",
              type: "select",
              options: ["Regular", "Irregular", "Others"],
            },
            {
              name: "menstrualFlow",
              label: "How much is your menstrual flow?",
              type: "select",
              options: ["Light", "Moderate", "Heavy", "Don't know", "Others"],
            },
            {
              name: "daysWithFlow",
              label: "Number of days with active menstrual flow",
              type: "number",
            },
            {
              name: "painDuringPeriod",
              label: "Do you experience lower abdominal pain or cramps?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "otherSymptoms",
              label:
                "Any other symptoms during menstruation or 2 days before it?",
              type: "select",
              options: [
                "Mood swing",
                "Tiredness",
                "Trouble sleeping",
                "Upset stomach",
                "Headache",
                "Acne",
                "None",
                "Others",
              ],
            },
            {
              name: "symptomsDisappear",
              label: "Do these symptoms disappear after menstruation?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        sexualHealthIssues: {
          title: "Sexual Health Issues",
          fields: [
            {
              name: "married",
              label: "Married?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            { name: "lmp", label: "Date of LMP?", type: "date" },
            {
              name: "periodDuration",
              label: "Duration of period",
              type: "number",
            },
            {
              name: "durationRegular",
              label: "Duration Regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "intervalBetweenPeriods",
              label: "Interval between periods",
              type: "number",
            },
            {
              name: "intervalRegular",
              label: "Interval Regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "flow",
              label: "Flow",
              type: "select",
              options: ["Normal", "Heavy", "Low", "Varies", "Others"],
            },
            {
              name: "numberOfChildren",
              label: "Number of children",
              type: "number",
            },
            {
              name: "numberOfPregnancies",
              label: "Number of pregnancies",
              type: "number",
            },
            {
              name: "firstChildbirthAge",
              label: "Age at first childbirth",
              type: "number",
            },
            {
              name: "lastChildbirthAge",
              label: "Age at last childbirth",
              type: "number",
            },
            {
              name: "contraceptionPractice",
              label: "Contraception practice?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "discharge",
              label: "Any discharge?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "bleedingBetweenPeriods",
              label: "Bleeding between periods?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "pain",
              label: "Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "itching",
              label: "Itching?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        prenatalIssues: {
          title: "Prenatal Issues",
          fields: [
            {
              name: "married",
              label: "Married?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            { name: "lmp", label: "Date of LMP?", type: "date" },
            {
              name: "duration",
              label: "Duration of period (days)",
              type: "number",
            },
            {
              name: "durationRegular",
              label: "Duration Regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "interval",
              label: "Interval between periods (days)",
              type: "number",
            },
            {
              name: "intervalRegular",
              label: "Interval Regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "flow",
              label: "Flow",
              type: "select",
              options: ["Normal", "Heavy", "Low", "Varies", "Others"],
            },
            {
              name: "painDuringIntercourse",
              label: "Pain during intercourse?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        pregnancy: {
          title: "Pregnancy",
          fields: [
            {
              name: "sexuallyActive",
              label: "Are you sexually active?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "lastIntercourse",
              label:
                "When was the last sexual intercourse(s) that may have caused the pregnancy?",
              type: "date",
            },
            {
              name: "lastMenstrualPeriod",
              label: "When was your last menstrual period?",
              type: "date",
            },
            {
              name: "menstrualCyclesRegular",
              label: "Are your menstrual cycles generally regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "previousPregnancy",
              label: "Have you been pregnant before?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "pregnancyOutcome",
              label: "If YES to the above, what was the pregnancy outcome?",
              type: "select",
              options: ["Childbirth", "Abortion/Medical", "Others"],
            },
            {
              name: "forcedSexualEvent",
              label: "Was there any forced sexual event?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
        familyPlanning: {
          title: "Family Planning/Contraceptives",
          fields: [
            {
              name: "contraceptiveMethod",
              label: "Have you ever used a contraceptive method?",
              type: "select",
              options: ["Yes", "No", "Others"],
              conditions: {
                Yes: {
                  type: "select",
                  label: "Which method have you used?",
                  options: [
                    "Pill",
                    "Injection",
                    "IUD (Mirena)",
                    "IUD CU",
                    "Implant",
                    "Male Condom",
                    "Female Condom",
                    "Natural Awareness Method (specify)",
                    "Tube Litigation",
                    "Vasectomy (Male surgery)",
                    "Others",
                  ],
                },
                No: {
                  type: "select",
                  label: "Would you like to adopt a method?",
                  options: ["Yes", "No", "Others"],
                },
                Others: {
                  type: "text",
                  label: "If Others, specify",
                },
              },
            },
            {
              name: "menstrualCycles",
              label: "Are your menstrual cycles generally regular?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "pregnancyHistory",
              label: "Have you been pregnant before?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "children",
              label: "Do you have children?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "planningChildren",
              label: "Are you planning to have any more children?",
              type: "select",
              options: ["Yes", "No", "Others"],
              conditions: {
                Yes: {
                  type: "select",
                  label: "Have you planned the timing of your next pregnancy?",
                  options: ["Yes", "No", "Others"],
                },
              },
            },
            {
              name: "previousCondition",
              label: "Do you have any previous condition?",
              type: "select",
              options: ["Yes", "No", "Others"],
              conditions: {
                Yes: {
                  type: "select",
                  label: "Specify the condition",
                  options: [
                    "Diabetes",
                    "Hypertension",
                    "Regular headache/Migraine",
                    "Stroke",
                    "Blood Clot, or Blood Problems",
                    "Others",
                  ],
                },
              },
            },
          ],
        },
      },
    },

    skinAndExternalConditions: {
      title: "Skin and External Conditions",
      subsections: {
        boils: {
          title: "Boils",
          fields: [
            {
              name: "boilLocation",
              label:
                "Where are the boils located, and have you had similar issues in the past?",
              type: "text",
            },
            {
              name: "boilDuration",
              label: "Duration (Days)",
              type: "number",
            },
            { name: "boilWhere", label: "Where?", type: "text" },
            {
              name: "boilStart",
              label: "How did it start?",
              type: "select",
              options: ["Injury", "On its own", "Others"],
            },
            {
              name: "boilPain",
              label: "Any Pain?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "boilSkinColor",
              label: "Color of Skin Over the Boil",
              type: "select",
              options: ["Normal", "Red", "Others"],
            },
          ],
        },
        skinRash: {
          title: "Skin Rash",
          fields: [
            {
              name: "rashDuration",
              label: "Duration (Days)",
              type: "number",
            },
            { name: "rashLocation", label: "Where?", type: "text" },
            { name: "rashSize", label: "Size", type: "text" },
            {
              name: "rashCount",
              label: "How many?",
              type: "select",
              options: ["Single", "Multiple", "Many", "Others"],
            },
            {
              name: "rashSurface",
              label: "Surface",
              type: "select",
              options: ["Smooth", "Rough", "Others"],
            },
            {
              name: "rashColor",
              label: "Color",
              type: "select",
              options: ["Red", "Pink", "Brown", "White", "Yellow", "Others"],
            },
          ],
        },
        injury: {
          title: "Injury",
          fields: [
            {
              name: "injuryDuration",
              label: "Duration (Days)",
              type: "number",
            },
            { name: "injuryLocation", label: "Where is it?", type: "text" },
            {
              name: "injuryCause",
              label: "How sustained?",
              type: "select",
              options: [
                "Fall (at home)",
                "Fall (on road)",
                "Fall (from height)",
                "Hit by car",
                "Hit by bike",
                "Hit by cycle",
                "Crushed in machine",
                "Cut",
                "Violence",
                "Others",
              ],
            },
            {
              name: "injuryProblem",
              label: "Problem",
              type: "select",
              options: ["Cant walk", "Cant move", "Pain", "Others"],
            },
            {
              name: "injuryBleeding",
              label: "Any bleeding?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
          ],
        },
      },
    },
    cardiovascularIssues: {
      title: "Cardiovascular Issues",
      subsections: {
        palpitations: {
          title: "Palpitations",
          fields: [
            {
              name: "palpitationDuration",
              label: "Duration (Days)",
              type: "number",
            },
            {
              name: "palpitationType",
              label: "Type",
              type: "select",
              options: ["Intermittent", "Always", "Others"],
            },
            {
              name: "palpitationDurationDetail",
              label: "How long does it last?",
              type: "text",
            },
            {
              name: "palpitationAssociatedSymptoms",
              label: "Associated symptoms",
              type: "select",
              options: [
                "Dizziness",
                "Shortness of breath",
                "Chest pain",
                "Fatigue",
                "Others",
              ],
            },
            {
              name: "palpitationFainting",
              label: "Fainting?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "palpitationFall",
              label: "Fall?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "palpitationDizziness",
              label: "Dizziness?",
              type: "select",
              options: ["Yes", "No", "Others"],
            },
            {
              name: "palpitationTriggers",
              label: "What brings it on?",
              type: "text",
            },
            {
              name: "palpitationRelief",
              label: "How is it relieved?",
              type: "text",
            },
          ],
        },
      },
    },
    otherSymptoms: {
      title: "Other",
      subsections: {
        symptoms: {
          title: "Other Symptoms",
          fields: [
            { name: "otherSpecify", label: "Other (Specify)", type: "text" },
            {
              name: "otherDuration",
              label: "Duration (Days)",
              type: "number",
            },
            {
              name: "otherLocation",
              label: "Location of symptoms",
              type: "text",
            },
            { name: "otherType", label: "Type of symptoms", type: "text" },
            {
              name: "otherSeverity",
              label: "Severity of symptoms",
              type: "select",
              options: ["Mild", "Moderate", "Severe", "Others"],
            },
            {
              name: "otherFrequency",
              label: "Frequency of symptoms",
              type: "select",
              options: ["Intermittent", "Constant", "Others"],
            },
            {
              name: "otherAssociatedSymptoms",
              label: "Associated symptoms",
              type: "text",
            },
            { name: "otherTriggers", label: "Triggers", type: "text" },
            {
              name: "otherAlleviatingFactors",
              label: "Alleviating factors",
              type: "text",
            },
          ],
        },
      },
    },
  });
  useEffect(() => {
    const newFilteredComplaints = {};

    selectedComplaints.forEach((complaint) => {
      // Find the section key (e.g., 'generalSymptoms')
      const sectionKey = Object.keys(sicknessSections).find(
        (key) => sicknessSections[key].title === complaint.section,
      );

      if (!sectionKey) return;

      // Find the subsection key (e.g., 'fever')
      const subsectionKey = Object.keys(
        sicknessSections[sectionKey].subsections,
      ).find(
        (key) =>
          sicknessSections[sectionKey].subsections[key].title ===
          complaint.subsection,
      );

      if (!subsectionKey) return;

      // Initialize section if it doesn't exist
      if (!newFilteredComplaints[sectionKey]) {
        newFilteredComplaints[sectionKey] = {
          title: sicknessSections[sectionKey].title,
          subsections: {},
        };
      }

      // Add the subsection with all its fields
      newFilteredComplaints[sectionKey].subsections[subsectionKey] = {
        ...sicknessSections[sectionKey].subsections[subsectionKey],
      };
    });

    setFilteredComplaints(newFilteredComplaints);
  }, [selectedComplaints, sicknessSections]);

  const [activeSection, setActiveSection] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderDiagnosisHistory = () => {
    // Updated sample data structure focused on diagnosis and prognosis

    const toggleDiagnosis = (id) => {
      setExpandedDiagnosis(expandedDiagnosis === id ? null : id);
    };

    const getSeverityColor = (severity) => {
      if (!severity || typeof severity !== "string") {
        return "text-gray-600"; // Default for undefined, null, or non-string
      }
    
      switch (severity.toLowerCase()) {
        case "mild":
          return "text-green-600";
        case "moderate":
          return "text-yellow-600";
        case "severe":
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    };
    
    //console.log(diagnoses);
    return (
      <div
        className="mx-auto max-w-4xl space-y-8 p-6"
        style={{ width: "65vw" }}
      >
        <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
          <CardHeader className="rounded-t-lg bg-teal-700 text-white">
            <CardTitle className="text-2xl">Diagnosis History</CardTitle>
            <CardDescription className="text-gray-200">
              Comprehensive medical condition tracking and outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
            {diagnoses.length > 0 ? (
              diagnoses.map((diagnosis) => (
                <div
                  key={diagnosis._id}
                  className="overflow-hidden rounded-lg border shadow-sm"
                >
                  <button
                    onClick={() => toggleDiagnosis(diagnosis._id)}
                    className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Activity className="text-teal-800" size={20} />
                      <div className="text-left">
                        <div className="font-medium text-teal-800">
                          {diagnosis.condition}
                        </div>
                        <div
                          className={`text-sm ${getSeverityColor(diagnosis.severity)}`}
                        >
                          {diagnosis.severity} Severity
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {new Date(diagnosis.createdAt).toLocaleDateString()}
                      </span>
                      {expandedDiagnosis === diagnosis._id ? (
                        <ChevronUp className="text-teal-800" size={20} />
                      ) : (
                        <ChevronDown className="text-teal-800" size={20} />
                      )}
                    </div>
                  </button>

                  {expandedDiagnosis === diagnosis._id && (
                    <div className="border-t bg-gray-50 p-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Diagnosis Status
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.status}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Category
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.category}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Chronicity Status
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.chronicityStatus}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Priority
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.priority}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Expected Outcome
                          </h4>
                          <div className="flex items-center space-x-2 rounded bg-white p-2">
                            <TrendingUp className="text-teal-500" size={16} />
                            <span className="text-sm text-gray-700">
                              {diagnosis.expectedOutcome}
                            </span>
                          </div>
                        </div>

                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Timeframe
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.timeframe}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Additional Note
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.diagnosesisadditionalNotes}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Recovery Potential
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {diagnosis.recoveryPotential}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
           ))
          ) : (
            <p className="text-center text-gray-500">No records found</p>
          )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const [isDisabled, setIsDisabled] = useState(false);
  const [showEditdiagnosisButton, setShowEditdiagnosisButton] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState({
    category: "",
    categoryDescription: "",
    code: "",
    codeDescription: "",
  });
  
  const [additionalDiagnoses, setAdditionalDiagnoses] = useState([]);
  const renderDiagnosisForm = () => {
    const handleAIComplete = () => {
      const demoData = {
        severity: "severe",
        category: "cardiovascular",
        priority: "urgent",
        chronicityStatus: "acute",
        primaryDiagnosis: "Acute myocardial infarction",
        secondaryDiagnoses: "Hypertension, Hyperlipidemia",
        differentialDiagnoses: "Aortic dissection, Pulmonary embolism",
        status: "active",
        diagnosesisadditionalNotes: "Chest pain, shortness of breath, dizziness",
      };
      setFormData(demoData);
      setIsDisabled(true);
      setShowEditdiagnosisButton(true);
    };

    const handleManualEdit = () => {
      setIsDisabled(false);
      setShowEditdiagnosisButton(false);
    };

    const handleRegenerate = () => {
      handleAIComplete(); // Regenerate demo data
    };

    const handleInputChange = (field, value) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value, // Either updates the existing field or adds the new one
      }));
      if (errors[field]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "", // Clear the error message
        }));
      }
    };

    const icdCategories = {
      1: "Certain Infectious or Parasitic Diseases",
      2: "Neoplasms",
      3: "Diseases of the Blood or Blood-Forming Organs",
      4: "Diseases of the Immune System",
      5: "Endocrine, Nutritional or Metabolic Diseases",
      6: "Mental, Behavioural or Neurodevelopmental Disorders",
      8: "Diseases of the Nervous System",
      B: "Diseases of the Circulatory System",
      C: "Diseases of the Respiratory System",
      D: "Diseases of the Digestive System",
    };

    const icdSubcategories = {
      1: [
        { code: "1A00", description: "Cholera" },
        { code: "1B10", description: "Tuberculosis of lung" },
        {
          code: "1C60",
          description: "Human immunodeficiency virus (HIV) disease",
        },
      ],
      2: [
        { code: "2A00", description: "Malignant neoplasm of lip" },
        { code: "2B20", description: "Malignant neoplasm of breast" },
        { code: "2C30", description: "Malignant neoplasm of prostate" },
      ],
      3: [
        { code: "3A00", description: "Iron deficiency anemia" },
        { code: "3B10", description: "Hemophilia A" },
        { code: "3C20", description: "Sickle-cell disease" },
      ],
      4: [
        { code: "4A00", description: "Systemic lupus erythematosus" },
        { code: "4B10", description: "Rheumatoid arthritis" },
        { code: "4C20", description: "Multiple sclerosis" },
      ],
      5: [
        { code: "5A00", description: "Type 1 diabetes mellitus" },
        { code: "5B10", description: "Hyperthyroidism" },
        { code: "5C20", description: "Obesity" },
      ],
      6: [
        { code: "6A00", description: "Schizophrenia" },
        { code: "6B10", description: "Bipolar disorder" },
        { code: "6C20", description: "Autism spectrum disorder" },
      ],
      8: [
        { code: "8A00", description: "Alzheimer's disease" },
        { code: "8B10", description: "Parkinson's disease" },
        { code: "8C20", description: "Epilepsy" },
      ],
      B: [
        { code: "BA00", description: "Hypertensive heart disease" },
        { code: "BB10", description: "Ischemic heart disease" },
        { code: "BC20", description: "Cerebrovascular disease" },
      ],
      C: [
        {
          code: "CA00",
          description: "Chronic obstructive pulmonary disease (COPD)",
        },
        { code: "CB10", description: "Asthma" },
        { code: "CC20", description: "Pneumonia" },
      ],
      D: [
        { code: "DA00", description: "Gastric ulcer" },
        { code: "DB10", description: "Crohn's disease" },
        { code: "DC20", description: "Liver cirrhosis" },
      ],
    };

    const diagnosisTypes = [
      { value: "secondary", label: "Secondary" },
      { value: "alternative", label: "Alternative" },
      { value: "differential", label: "Differential" },
    ];

    const handleAddDiagnosis = (e) => {
      e.preventDefault(); // Prevent form submission
      setAdditionalDiagnoses((prev) => [
        ...prev,
        {
          type: "",
          category: "",
          code: "",
        },
      ]);
    };

    /*  const updateAdditionalDiagnosis = (index, field, value) => {
      
      setAdditionalDiagnoses((prev) => {
        const updated = [...prev];
        if (field === "category") {
          updated[index] = { ...updated[index], category: value, code: "" };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
      });
    };
*/

    const updateAdditionalDiagnosis = (index, field, value) => {
      setAdditionalDiagnoses((prev) => {
        const updated = [...prev];

        if (field === "category") {
          updated[index] = {
            ...updated[index],
            category: value,
            categoryDescription: icdCategories[value] || "Unknown Category", // Fetch category description
            code: "",
            codeDescription: "", // Reset code and its description when category changes
          };
        } else if (field === "code") {
          const category = updated[index].category;
          const subcategoryList = icdSubcategories[category] || []; // Get the list of codes for the category
          const codeData = subcategoryList.find((item) => item.code === value); // Find matching code description

          updated[index] = {
            ...updated[index],
            code: value,
            codeDescription: codeData ? codeData.description : "Unknown Code", // Store code description
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }

        return updated;
      });
    };

    const handlePrimaryCategoryChange = (category) => {
        setPrimaryDiagnosis({
          category: category,
          categoryDescription: icdCategories[category] || "Unknown Category", // Fetch category description
          code: "",
          codeDescription: "", // Reset code and description when category changes
        });
       // 
       if (errors["primaryDiagnosis"]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          primaryDiagnosis: "", // Clear the error message
        }));
      }
      
    };

    const removeDiagnosis = (index, e) => {
      e.preventDefault(); // Prevent form submission
      setAdditionalDiagnoses((prev) => prev.filter((_, i) => i !== index));
    };

    // Don't render until we're on the client
    if (!isClient) {
      return null;
    }

    return (
<div className="mx-auto mt-0 w-full max-w-5xl p-2">
<Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
          <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
                  <div className="w-full text-center">
              <CardTitle className="text-2xl">
                {buttonText === "Update" ? "Update Diagnosis Entry" : "New Diagnosis Entry"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mt-2 flex justify-end space-x-4">
                {!showEditdiagnosisButton && (
                  <Button
                   // onClick={handleAIComplete}
                    variant="outline"
                    size="sm"
                    disabled={isDisabled}
                    className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d]"
                  >
                    <Lightbulb className="mr-2 size-4" />
                    Complete with AI
                  </Button>
                )}
                {showEditdiagnosisButton && (
                  <>
                    <Button
                      onClick={handleManualEdit}
                      variant="outline"
                      size="sm"
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <Edit className="mr-2 size-4" />
                      Manual Edit
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      size="sm"
                      className="bg-blue-200 text-blue-700 hover:bg-blue-300"
                    >
                      <RefreshCw className="mr-2 size-4" />
                      Regenerate
                    </Button>
                  </>
                )}
              </div>

              {/* Severity Level */}

              {/* Primary Diagnosis */}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#007664]">
                  Primary Diagnosis <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                <select
  value={primaryDiagnosis.category}
  onChange={(e) => handlePrimaryCategoryChange(e.target.value)}
  className="peer w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
>
  <option value="">Select Category</option>
  {Object.entries(icdCategories).map(([key, value]) => (
    <option key={key} value={key}>
      {value}
    </option>
  ))}
</select>


{primaryDiagnosis.category && (
  <select
    value={primaryDiagnosis.code}
    onChange={(e) => {
      const selectedCode = e.target.value;
      const selectedSubcategory = icdSubcategories[primaryDiagnosis.category]?.find(
        (sub) => sub.code === selectedCode
      );

      setPrimaryDiagnosis((prev) => ({
        ...prev,
        code: selectedCode,
        codeDescription: selectedSubcategory ? selectedSubcategory.description : "Unknown Code",
      }));
    }}
    className="w-full rounded-md border border-gray-300 p-2"
  >
    <option value="">Select Specific Diagnosis</option>
    {icdSubcategories[primaryDiagnosis.category]?.map((subcategory) => (
      <option key={subcategory.code} value={subcategory.code}>
        {subcategory.code} - {subcategory.description}
      </option>
    ))}
  </select>
)}

                </div>

                {errors.primaryDiagnosis && (
                  <p className="text-sm text-red-500">{errors.primaryDiagnosis}</p>
                )}
              </div>
              <div className="space-y-2">
                  <Label className="block text-sm font-medium text-[#007664]">
                    Severity Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    name="severity"
                    value={formData.severity}
                    disabled={isDisabled}
                    onChange={(e) =>
                      handleInputChange("severity", e.target.value)
                    }
                    className="w-full rounded-md border bg-white p-2 focus:border-[#007664]"
                  >
                    <option value="">Select severity</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.severity}</p>
                  )}
                </div>
          
              <div className="grid grid-cols-2 gap-4">
               

   
                {/* Priority Level */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-[#007664]">
                    Priority Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    name="priority"
                    value={formData.priority}
                    disabled={isDisabled}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="w-full rounded-md border bg-white p-2 focus:border-[#007664] "
                  >
                    <option value="">Select priority</option>
                    <option value="emergency">Emergency</option>
                    <option value="urgent">Urgent</option>
                    <option value="semi-urgent">Semi-Urgent</option>
                    <option value="non-urgent">Non-Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="text-sm text-red-500">{errors.priority}</p>
                  )}
                </div>

                {/* Chronicity Status */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-[#007664]">
                    Chronicity Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    name="chronicityStatus"
                    value={formData.chronicityStatus}
                    disabled={isDisabled}
                    onChange={(e) =>
                      handleInputChange("chronicityStatus", e.target.value)
                    }
                    className="w-full rounded-md border bg-white p-2 focus:border-[#007664] "
                  >
                    <option value="">Select status</option>
                    <option value="acute">Acute</option>
                    <option value="subacute">Subacute</option>
                    <option value="chronic">Chronic</option>
                    <option value="recurrent">Recurrent</option>
                  </select>
                  {errors.chronicityStatus && (
                    <p className="text-sm text-red-500">
                      {errors.chronicityStatus}
                    </p>
                  )}
                </div>
              </div>
     

              {/* Additional Note */}
              <div className="space-y-2">
                <label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium text-[#007664]"
                >
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.diagnosesisadditionalNotes}
                  onChange={(e) =>
                    handleInputChange(
                      "diagnosesisadditionalNotes",
                      e.target.value,
                    )
                  }
                  placeholder="Addition Details"
                  className="h-24 w-full rounded-md border bg-white p-2 focus:border-[#007664]"
                />
              </div>
    {/* Additional Diagnoses Section */}
    <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#007664]">
                    Additional Diagnoses
                  </h3>
                  <Button
                    onClick={handleAddDiagnosis}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-teal-600 bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <Plus className="size-4" />
                    Add Diagnosis
                  </Button>
                </div>

                {additionalDiagnoses.map((diagnosis, index) => (
                  <div key={index} className="space-y-2 rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#007664]">
                        Additional Diagnosis {index + 1}
                      </span>
                      <Button
                        onClick={(e) => removeDiagnosis(index, e)}
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2 border-red-600 bg-red-600 text-white hover:bg-red-700"
                      >
                        Remove
                      </Button>
                    </div>

                    <select
                      value={diagnosis.type}
                      onChange={(e) =>
                        updateAdditionalDiagnosis(index, "type", e.target.value)
                      }
                      className="mb-2 w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select Diagnosis Type</option>
                      {diagnosisTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={diagnosis.category}
                      onChange={(e) =>
                        updateAdditionalDiagnosis(
                          index,
                          "category",
                          e.target.value,
                        )
                      }
                      className="mb-2 w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select Category</option>
                      {Object.entries(icdCategories).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>

                    {diagnosis.category && (
                      <select
                        value={diagnosis.code}
                        onChange={(e) =>
                          updateAdditionalDiagnosis(
                            index,
                            "code",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="">Select Specific Diagnosis</option>
                        {icdSubcategories[diagnosis.category]?.map(
                          (subcategory) => (
                            <option
                              key={subcategory.code}
                              value={subcategory.code}
                            >
                              {subcategory.code} - {subcategory.description}
                            </option>
                          ),
                        )}
                      </select>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const [aiModes, setAiModes] = useState({
    expectedOutcome: false,
    timeframe: false,
    riskLevel: false,
    recoveryPotential: false,
  });

  const [loadingStates, setLoadingStates] = useState({
    expectedOutcome: false,
    timeframe: false,
    riskLevel: false,
    recoveryPotential: false,
  });

  const [showEditPrognosisButton, setShowEditPrognosisButton] = useState(false); // Initially false
  const [otherExpectedOutcome, setOtherExpectedOutcome] = useState("");
  const renderPrognosisForm = () => {
    const handleInputChange = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "", // Clear the error message
        }));
      }
    };

    const handleAIComplete = () => {
      const aiData = {
        expectedOutcome: "partial_recovery",
        timeframe: "months",
        riskLevel: "moderate",
        recoveryPotential: "good",
        survivalRate: "75",
        complications: "High risk of cardiovascular issues",
        longTermEffects: "Potential for reduced mobility",
        lifestyleModifications: "Increase physical activity, improve diet",
        monitoringRequirements: "Monthly check-ups, blood tests",
        followUpSchedule: "3 months follow-up, then bi-annually",
        additionalNotes: "Patient requires support for daily tasks.",
      };

      setFormData(aiData);
      setIsDisabled(true);
      setShowEditPrognosisButton(true);
    };

    const handleManualEdit = () => {
      setIsDisabled(false);
      setShowEditPrognosisButton(false);
    };

    const handleRegenerate = () => {
      handleAIComplete(); // Regenerate the AI data
    };



        
    return (
      <div className="mx-auto mt-0 w-full max-w-5xl p-2">

        <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
          <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
          <div className="w-full text-center">
              <CardTitle className="text-2xl">
                {buttonText === "Update" ? "Update Prognosis Entry" : "New Prognosis Entry"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mt-2 grid grid-cols-1 gap-4">
                {/* AI Complete Button */}
                {!showEditPrognosisButton && (
                  <div className="flex justify-end">
                    <Button
                     // onClick={handleAIComplete}
                      variant="outline"
                      size="sm"
                      disabled={isDisabled}
                      className="w-auto bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d]"
                    >
                      <Lightbulb className="mr-2 size-4" />
                      Complete with AI
                    </Button>
                  </div>
                )}

                {/* Displayed once AI Complete button is clicked */}
                {showEditPrognosisButton && (
                  <>
                    <div className="flex justify-end space-x-4">
                      <Button
                        onClick={handleManualEdit}
                        variant="outline"
                        size="sm"
                        className="w-auto bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        <Edit className="mr-2 size-4" />
                        Manual Edit
                      </Button>
                      <Button
                        onClick={handleRegenerate}
                        variant="outline"
                        size="sm"
                        className="w-auto bg-teal-200 text-blue-700 hover:bg-teal-300"
                      >
                        <RefreshCw className="mr-2 size-4" />
                        Regenerate
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
  <Label htmlFor="expectedOutcome" className="text-[#007664]">
    Expected Outcome <span className="text-red-500">*</span>
  </Label>
  <select
    id="expectedOutcome"
    name="expectedOutcome"
    value={formData.expectedOutcome}
    onChange={(e) => handleInputChange("expectedOutcome", e.target.value)}
    disabled={isDisabled}
    className="w-full rounded border border-gray-300 p-2"
  >
    <option value="">Select expected outcome</option>
    <option value="complete_recovery">Complete Recovery</option>
    <option value="partial_recovery">Partial Recovery</option>
    <option value="chronic_management">Chronic Management Required</option>
    <option value="progressive_decline">Progressive Decline</option>
    <option value="terminal">Terminal</option>
    <option value="other">Other</option>
  </select>

  {formData.expectedOutcome === "other" && !aiModes.expectedOutcome && (
    <Input
      name="otherExpectedOutcome"
      value={otherExpectedOutcome}
      onChange={(e) => setOtherExpectedOutcome(e.target.value)}
      placeholder="Please specify outcome"
      className="mt-2"
      disabled={isDisabled}
    />
  )}

  {errors.expectedOutcome && (
    <p className="text-sm text-red-500">{errors.expectedOutcome}</p>
  )}
</div>

                <div>
                  <Label htmlFor="timeframe" className="text-[#007664]">
                    Timeframe <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="timeframe"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={(e) =>
                      handleInputChange("timeframe", e.target.value)
                    }
                    disabled={isDisabled}
                    className="w-full rounded border border-gray-300 p-2"
                  >
                    <option value="">Select timeframe</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                  {errors.timeframe && (
                    <p className="text-sm text-red-500">{errors.timeframe}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskLevel" className="text-[#007664]">
                    Risk Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="riskLevel"
                    name="riskLevel"
                    value={formData.riskLevel}
                    onChange={(e) =>
                      handleInputChange("riskLevel", e.target.value)
                    }
                    disabled={isDisabled}
                    className="w-full rounded border border-gray-300 p-2"
                  >
                    <option value="">Select risk level</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="severe">Severe</option>
                  </select>
                  {errors.riskLevel && (
                    <p className="text-sm text-red-500">{errors.riskLevel}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recoveryPotential" className="text-[#007664]">
                    Recovery Potential <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="recoveryPotential"
                    name="recoveryPotential"
                    value={formData.recoveryPotential}
                    onChange={(e) =>
                      handleInputChange("recoveryPotential", e.target.value)
                    }
                    disabled={isDisabled}
                    className="w-full rounded border border-gray-300 p-2"
                  >
                    <option value="">Select recovery potential</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="uncertain">Uncertain</option>
                  </select>
                  {errors.recoveryPotential && (
                    <p className="text-sm text-red-500">
                      {errors.recoveryPotential}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="additionalNotes"
                  className="block text-sm font-medium text-[#007664]"
                >
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.prognosisAdditionalNotes}
                  onChange={(e) =>
                    handleInputChange(
                      "prognosisAdditionalNotes",
                      e.target.value,
                    )
                  }
                  placeholder="Addition Details"
                  className="h-24 w-full rounded-md border bg-white p-2 focus:border-[#007664] "
                />
              </div>
              <div className="mt-6 border-t pt-6">
  <h3 className="mb-4 text-lg font-semibold text-[#007664]">
    Follow-up Appointments
  </h3>
  
  {/* Single row on PC, stacked on mobile */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div className="space-y-2">
      <Label
        htmlFor="appointmentDate"
        className="text-sm font-medium text-[#007664]"
      >
        Next Appointment Date
      </Label>
      <input
        type="date"
        id="appointmentDate"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={(e) =>
          handleInputChange("appointmentDate", e.target.value)
        }
        disabled={isDisabled}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
      {errors.appointmentDate && (
        <p className="text-sm text-red-500">
          {errors.appointmentDate}
        </p>
      )}
    </div>
    
    <div className="space-y-2">
      <Label
        htmlFor="appointmentTime"
        className="text-sm font-medium text-[#007664]"
      >
        Appointment Time
      </Label>
      <input
        type="time"
        id="appointmentTime"
        name="appointmentTime"
        value={formData.appointmentTime}
        onChange={(e) =>
          handleInputChange("appointmentTime", e.target.value)
        }
        disabled={isDisabled}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
      {errors.appointmentTime && (
        <p className="text-sm text-red-500">
          {errors.appointmentTime}
        </p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="appointmentType" className="text-sm font-medium text-[#007664]">
        Appointment Type
      </Label>
      <select
        id="appointmentType"
        name="appointmentType"
        value={formData.appointmentType}
        onChange={(e) =>
          handleInputChange("appointmentType", e.target.value)
        }
        disabled={isDisabled}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="">Select appointment type</option>
        <option value="follow_up">Follow-up Check</option>
        <option value="treatment">Treatment Session</option>
        <option value="evaluation">Progress Evaluation</option>
        <option value="consultation">Consultation</option>
      </select>
      {errors.appointmentType && (
        <p className="text-sm text-red-500">
          {errors.appointmentType}
        </p>
      )}
    </div>
  </div>
</div>
              {/* More fields can be added similarly */}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  const pages = [
    renderDiagnosisHistory,

    renderDiagnosisForm,
    renderPrognosisForm,
  ];

  return (
    <>
    <div className="mx-auto !mt-0 flex size-full min-h-[500px] max-w-full flex-col justify-between px-4 sm:px-6 md:px-8">
    {/* Page number circles at the top */}
        <div className="mb-0 flex justify-center gap-2">
          {Array.from({ length: pages.length }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                // onClick={() => setCurrentPage(pageNum)}
                className={`
            flex size-10 items-center justify-center rounded-full
            border-2 border-teal-500 text-sm font-medium
            ${
              currentPage === pageNum
                ? "bg-teal-500 text-white"
                : "bg-white text-teal-500 hover:bg-teal-50"
            }
            transition-colors duration-200
          `}
              >
                {pageNum}
              </button>
            ),
          )}
        </div>

        {/* Content area */}
        <div className="w-full grow">{pages[currentPage - 1]()}</div>


        {/* Navigation footer */}
        <div className="mt-auto w-full border-t bg-white">
        <div className="mx-auto w-full max-w-full p-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
    className="flex min-w-[120px] items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
  >
    <ChevronLeft className="mr-2 size-5" />
    Previous
  </button>

  <span className="text-sm font-medium text-gray-500">
    Page {currentPage} of {pages.length}
  </span>

  {currentPage === 2 ? (
    <div className="flex items-center gap-4">
      <button
        onClick={() => {
          const isValid = buttonText === "Update" ? true : validateDiagnosisForm();
          console.log("Validation Result:", isValid); // Debugging output

          if (!isValid) {
            console.warn("Form validation failed. Submission blocked.");
            return; // Stop execution if validation fails
          }

          console.log("Form validation passed. Proceeding to next page...");
          setCurrentPage((prev) => Math.min(pages.length, prev + 1));
        }}
        className="flex min-w-[120px] items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600"
      >
        Next
        <ChevronRight className="ml-2 size-5" />
      </button>
    </div>
  ) : currentPage === 3 ? (
    <button
      disabled={isLoading}
      onClick={handleSubmitClick}
      className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 disabled:bg-[#007664]/50"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {buttonText === "Update" ? "Updating..." : "Submitting..."}
        </>
      ) : (
        <>{buttonText}</>
      )}
    </button>
  ) : (
    <button
      onClick={() => setCurrentPage((prev) => Math.min(pages.length, prev + 1))}
      className="flex min-w-[120px] items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600"
    >
      Next
      <ChevronRight className="ml-2 size-5" />
    </button>
  )}
</div>

          </div>
        </div>
      </div>
    </>
  );
}

export function ViewDiagnosis({ diagnosis, isOpen, onClose }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    };
  
    if (!status || typeof status !== "string") {
      return statusColors.default;
    }
  
    return statusColors[status.toLowerCase()] || statusColors.default;
  };
  

  const InfoItem = ({ label, value, icon, highlight }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      </div>
      <p
        className={`${
          highlight
            ? "text-lg font-semibold text-[#007664]"
            : "text-sm text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );

  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}  //
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-h-[90vh] w-[90%] overflow-y-auto bg-[#F7F7F7] p-0 sm:max-w-4xl">
        <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
  <DialogTitle className="flex w-full items-center justify-center gap-3 text-2xl font-bold">
            <Stethoscope className="size-6" />
            Diagnosis Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-6">
          {/* Status Banner */}
          <motion.div
            {...fadeIn}
            className={`rounded-lg border p-4 ${getStatusColor(diagnosis.status)} flex items-center gap-2`}
          >
            <Activity className="size-5" />
            <span className="font-medium">
              Current Status: {capitalizeFirstLetter(diagnosis.status)}
            </span>
          </motion.div>

          {/* Basic Information */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Basic Information
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                <InfoItem label="Diagnosis ID" value={diagnosis.diagnosisId} />
                <InfoItem label="Category" value={diagnosis.primaryDiagnosis?.categoryDescription} />
                <InfoItem
                  label="Diagnosed By"
                  value={
                    diagnosis.diagnosedBy
                      ? `${diagnosis.diagnosedBy.firstName || ""} ${diagnosis.diagnosedBy.lastName || ""}`.trim()
                      : "Not specified"
                  }
                />
                <InfoItem label="Diagnosed At" value={diagnosis.diagnosedAt} />
                <InfoItem label="Severity" value={capitalizeFirstLetter(diagnosis.severity)} />
                <InfoItem label="Priority" value={capitalizeFirstLetter(diagnosis.priority)} />
                <InfoItem
                  label="Chronicity Status"
                  value={capitalizeFirstLetter(diagnosis.chronicityStatus)}
                />
  
               
                <InfoItem
                  label="Diagnosis Additional Notes"
                  value={capitalizeFirstLetter(diagnosis.diagnosesisadditionalNotes)}
                />
          
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Diagnoses */}
          <motion.div
            {...fadeIn}
            className="space-y-4 rounded-lg bg-gray-50 p-4"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-2.5 rounded-full bg-[#75C05B] shadow-md" />
              <h2 className="text-2xl font-extrabold tracking-tight text-[#007664]">
                Additional Diagnoses
              </h2>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-xl">
              <div className="space-y-6 p-6">
                {diagnosis.additionalDiagnoses &&
                diagnosis.additionalDiagnoses.length > 0 ? (
                  diagnosis.additionalDiagnoses.map((ad, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg bg-gray-100 p-4 transition-all last:mb-0 hover:bg-gray-200/50"
                    >
                      <InfoItem label="Type" value={ad.type} />
                      <InfoItem label="Category" value={ad.category} />
                      <InfoItem label="Code" value={ad.code} />
                      <InfoItem
                        label="Category Description"
                        value={ad.categoryDescription}
                      />
                      <InfoItem
                        label="Code Description"
                        value={ad.codeDescription}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center italic text-gray-500">
                    No additional diagnoses available
                  </div>
                )}
              </div>
            </div>
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#FFA500]" />
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#007664]">
                  <Clipboard className="size-5" />
                  Prognosis Information
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                  <InfoItem
                    label="Expected Outcome"
                    value={capitalizeFirstLetter(diagnosis.expectedOutcome)}
                  />
                 
                  <InfoItem label="Timeframe" value={diagnosis.timeframe} />
                  <InfoItem
                    label="Recovery Potential"
                    value={capitalizeFirstLetter(diagnosis.recoveryPotential)}
                  />
                  <InfoItem
                    label="Prognosis Additional Notes"
                    value={capitalizeFirstLetter(diagnosis.prognosisAdditionalNotes)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          {/* Timing Information */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#007664]">
                <Clock className="size-5" />
                Timing Information
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                <InfoItem
                  label="Created"
                  value={diagnosis.createdAt}
                  icon={<Clock className="size-4 text-[#007664]" />}
                />
                <InfoItem
                  label="Updated"
                  value={diagnosis.updatedAt}
                  icon={<Clock className="size-4 text-[#007664]" />}
                />
                <InfoItem
                  label="Follow-Up Appointment Date"
                  value={diagnosis.appointmentDate}
                  icon={<Clock className="size-4 text-[#007664]" />}
                />
                <InfoItem
                  label="Follow-Up Appointment Time"
                  value={diagnosis.appointmentTime}
                  icon={<Clock className="size-4 text-[#007664]" />}
                />
                <InfoItem
                  label="Follow-Up Appointment Type"
                  value={capitalizeFirstLetter(diagnosis.appointmentType)}
                  icon={<Clock className="size-4 text-[#007664]" />}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Prognosis Information */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
