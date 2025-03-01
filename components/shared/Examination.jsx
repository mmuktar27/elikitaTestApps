"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {useSession } from "next-auth/react";

// Lucide Icons
import {
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  Check,
  Loader2,
  Bot,
  Lock,
  OxygenIcon,
  LungsIcon,
  ChevronRight,
  VolumeIcon,
  Beaker,
  Activity,
  Heart,
  FlaskConical,
  Camera,
  LightbulbOff,
  Brain,
  Sparkles,
  Lightbulb,
  MinusCircle,
  PlusCircle,
  Plus,
  Clock,
  Video,
  UserRound,
  Share2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  AlertTriangle,
  Bed,
  Bell,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarCheck,
  CameraOff,
  CheckCircle,
  ChevronDown,
  Clipboard,
  ClockIcon,
  Database,
  Edit,
  Edit2,
  Eye,
  FileBarChart,
  FileText,
  Filter,
  Home,
  Info,
  Layers,
  LogOut,
  Mail,
  MapPin,
  Mic,
  MicOff,
  Phone,
  Pill,
  QrCode,
  Search,
  Settings,
  Speaker,
  Stethoscope,
  TestTube,
  Thermometer,
  Trash2,
  User,
  UserCog,
  UserPlus,
  Users,
  Printer,
  ChevronUp,
  TrendingUp,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createExamination, updateExam } from "../shared/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SmartExaminationation } from "../../components/shared";
import { ViewMedication, NewMedicationForm } from "../../components/shared";
import {
  NewDiagnosisForm,
  ViewDiagnosis,
  EditDiagnosisForm,
} from "../../components/shared";
// Charts
import Image from "next/image";
import eye from "../shared/images/eye.png";
import leg from "../shared/images/leg.png";
import pallor from "../shared/images/pallor.png";
import curbing from "../shared/images/curbbin.png";
import cybosis from "../shared/images/cybosis.png";
import main from "../shared/images/main.png";
// Third-party Modal
import Modal from "react-modal";
import { motion } from "framer-motion";




const MultiSectionSymptomsForm = ({
  selectedComplaints = [],
  sicknessSections = {},
  onNext,
  currentInnerPage, // Now represents current section instead of subsection
  formData,
  setFormData,
  onPrevious,
  onComplete,
  validationErrors = {},
  isSubmitting = false,
  otherValues,
  setOtherValues,
  setTouchedFields,
  touchedFields,
  setErrors
}) => {
 

  const handleFieldChange = useCallback(
    (sectionName, subsectionName, fieldName, value) => {
      setFormData((prev) => {
        const existingChiefComplain = prev.chiefComplain || {};
        const existingSection = existingChiefComplain[sectionName] || {};
  
        return {
          ...prev,
          chiefComplain: {
            ...existingChiefComplain,
            [sectionName]: {
              ...existingSection,
              ...(subsectionName
                ? {
                    [subsectionName]: {
                      ...existingSection[subsectionName],
                      [fieldName]: value,
                    },
                  }
                : { [fieldName]: value }),
            },
          },
        };
      });
  
      setTouchedFields((prev) => ({
        ...prev,
        [`${sectionName}-${subsectionName}-${fieldName}`]: true,
      }));
  
      // Clear error for the changed field
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        const fieldId = `${sectionName}-${subsectionName}-${fieldName}`;
        delete newErrors[fieldId]; // Remove error for the updated field
        return newErrors;
      });
    },
    [setFormData, setTouchedFields, setErrors]
  );
  

  const getCurrentValue = useCallback(
    (sectionName, subsectionName, fieldName) => {
      if (subsectionName) {
        return formData?.chiefComplain?.[sectionName]?.[subsectionName]?.[fieldName] || "";
      }
      return formData?.chiefComplain?.[sectionName]?.[fieldName] || "";
    },
    [formData]
  );

  const handleOtherChange = useCallback(
    (sectionName, subsectionName, fieldName, value) => {
      setOtherValues((prev) => ({
        ...prev,
        [`${sectionName}-${subsectionName}-${fieldName}`]: value,
      }));

      handleFieldChange(sectionName, subsectionName, fieldName, "Others");
    },
    [handleFieldChange, setOtherValues]
  );

  const handleBlur = useCallback((fieldId) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldId]: true,
    }));
  }, [setTouchedFields]);


 
    
  const renderField = useCallback(
    (field, sectionName, subsectionName) => {
     const fieldId = `${sectionName}-${subsectionName}-${field.name}`;
    // const fieldId = `generalSymptoms-fever-${field.name}`;
      const currentValue = getCurrentValue(sectionName, subsectionName, field.name);
      const otherValue = otherValues[fieldId] || "";
     
      const hasError = validationErrors[fieldId];
      
              const errorClass = hasError
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "focus:ring-teal-500 focus:border-teal-500 hover:border-teal-300";

      const baseInputStyles = `w-full rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 ${errorClass} hover:shadow-md focus:shadow-lg`;
     
      return (
        <div className="space-y-3">
          {field.type === "select" && (
            <>
              <select
                value={currentValue}
                className={`${baseInputStyles} cursor-pointer bg-right`}
                onChange={(e) => {
                  handleFieldChange(sectionName, subsectionName, field.name, e.target.value);
                  if (e.target.value !== "Others") {
                    setOtherValues((prev) => ({ ...prev, [fieldId]: "" }));
                  }
                }}
                onBlur={() => handleBlur(fieldId)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {hasError && <p className="text-sm text-red-500">{validationErrors[fieldId]}</p>}

              {currentValue === "Others" && (
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => handleOtherChange(sectionName, subsectionName, field.name, e.target.value)}
                  onBlur={() => handleBlur(fieldId)}
                  className={baseInputStyles}
                  placeholder={`Specify other ${field.label.toLowerCase()}`}
                />
              )}
            </>
          )}

          {field.type === "radio" && (
            <>
              <RadioGroup
                value={currentValue}
                onValueChange={(value) => {
                  handleFieldChange(sectionName, subsectionName, field.name, value);
                  if (value !== "Others") {
                    setOtherValues((prev) => ({ ...prev, [fieldId]: "" }));
                  }
                }}
                className="grid gap-3 md:grid-cols-2"
                onBlur={() => handleBlur(fieldId)}
              >
                {field.options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 rounded-lg border bg-white p-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
                  >
                    <RadioGroupItem value={option} id={`${fieldId}-${option}`} className="text-[#007664]" />
                    <Label htmlFor={`${fieldId}-${option}`} className="grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {hasError && <p className="text-sm text-red-500">{validationErrors[fieldId]}</p>}

              {currentValue === "Others" && (
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => handleOtherChange(sectionName, subsectionName, field.name, e.target.value)}
                  onBlur={() => handleBlur(fieldId)}
                  className={baseInputStyles}
                  placeholder={`Specify other ${field.label.toLowerCase()}`}
                />
              )}
            </>
          )}

          {field.type === "text" && (
            <>
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleFieldChange(sectionName, subsectionName, field.name, e.target.value)}
                onBlur={() => handleBlur(fieldId)}
                className={baseInputStyles}
                placeholder={field.label}
              />
{hasError && <p className="text-sm text-red-500">{validationErrors[fieldId]}</p>}

            </>
          )}
          {field.type === "number" && (
  <>
    <input
      type="number"
      value={currentValue}
      onChange={(e) => handleFieldChange(sectionName, subsectionName, field.name, e.target.value)}
      onBlur={() => handleBlur(fieldId)}
      className={baseInputStyles}
      placeholder={field.label}
      min="0" // Ensures only non-negative numbers
    />
    {hasError && <p className="text-sm text-red-500">{validationErrors[fieldId]}</p>}
  </>
)}

        </div>
      );
    },
    [getCurrentValue, otherValues, validationErrors, handleFieldChange, setOtherValues, handleBlur, handleOtherChange]
  );

  
  // Get unique sections from selectedComplaints
  const uniqueSections = Array.from(new Set(selectedComplaints.map(complaint => complaint.section)));
  const currentSection = uniqueSections[currentInnerPage];
  const progress = ((currentInnerPage + 1) / uniqueSections.length) * 100;

  return (
    <div className="w-full min-w-full max-w-full bg-[#F9F9F9]">
      <div className="w-full min-w-full p-4 md:p-6">
        <div className="mb-6 rounded-lg bg-white p-3 shadow-md">
          <Progress 
            value={progress} 
             className="h-2 rounded-full bg-[#007664]/20"
            indicatorClassName="bg-[#007664]"
          />
          <p className="mt-2 text-right text-sm text-gray-600">
            Section {currentInnerPage + 1} of {uniqueSections.length}
          </p>
        </div>

        {currentSection && (
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="space-y-4 border-b bg-[#007664] px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white">
                  {sicknessSections[currentSection].title}
                </CardTitle>
                <span className="rounded-full bg-[#53FDFD] px-4 py-1 text-sm font-medium text-[#007664]">
                  {currentInnerPage + 1} of {uniqueSections.length}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={(e) => e.preventDefault()} className="flex size-full flex-col space-y-8">
                {Object.entries(sicknessSections[currentSection].subsections).map(([subsectionName, subsection]) => {
                  const isSubsectionSelected = selectedComplaints.some(
                    complaint => complaint.section === currentSection && complaint.subsection === subsectionName
                  );

                  if (!isSubsectionSelected) return null;

                  return (
                    <div key={subsectionName} className="rounded-lg bg-white p-6 shadow-md">
                      <h2 className="mb-6 text-lg font-semibold text-[#007664]">
                        {subsection.title}
                      </h2>

                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {subsection.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              {field.label} {field.required && <span className="text-[#B24531]">*</span>}
                            </label>
                            {renderField(field, currentSection, subsectionName)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export function NewExamination({
  onTabChange,
  patient,
  onClose,
  onSubmit,
  initialExamination = null,
  examinations,
  buttonText,
  currentDashboard,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (initialExamination !== null) {
      return { ...initialExamination }; // Spread the initial object if initial is not null
    } else {
      return {}; // Default empty object if initial is null
    }
  });
  const [multisectionValErros, setmultisectionValErros] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState({});
  const [expandedExamination, setexpandedExamination] = useState(null);
  const [conditionValue, setConditionValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(""); // Manage state for selected value
  const [currentmultisimPage, setCurrenmultisimtPage] = useState(0);
     const session = useSession();
  
  const [errors, setErrors] = useState();

  const validatePreCheckAndVitalsForm = (formData = {}) => {
    let newErrors = {};

    // Ensure preChecks exists to avoid errors
    const preChecks = formData.preChecks || {};

    if (
      preChecks.patientComfort != null &&
      isNaN(Number(preChecks.patientComfort))
    ) {
      newErrors.patientComfort = "PatientComfort must be  checked.";
    }
    if (
      preChecks.patientComfort != null &&
      isNaN(Number(preChecks.patientComfort))
    ) {
      newErrors.patientComfort = "PatientComfort must be  checked.";
    }
    if (preChecks.observeGait != null && isNaN(Number(preChecks.observeGait))) {
      newErrors.observeGait = "ObserveGait must be  checked.";
    }
    if (preChecks.checkPain != null && isNaN(Number(preChecks.checkPain))) {
      newErrors.checkPain = "CheckPain must be  checked.";
    }
    if (
      preChecks.femaleChaperone != null &&
      isNaN(Number(preChecks.femaleChaperone))
    ) {
      newErrors.femaleChaperone = "femaleChaperone must be  checked.";
    }

    if (
      preChecks.visitHistory != null &&
      isNaN(Number(preChecks.visitHistory))
    ) {
      newErrors.visitHistory = "visitHistory must be checked.";
    }

    // ✅ Validate Temperature (must be a valid number)
    if (preChecks.temperature != null && isNaN(Number(preChecks.temperature))) {
      newErrors.temperature = "Temperature must be a valid number.";
    }

    // ✅ Validate Blood Pressure (must follow systolic/diastolic format)
    if (
      preChecks.bloodPressure != null &&
      !/^\d+\/\d+$/.test(preChecks.bloodPressure)
    ) {
      newErrors.bloodPressure =
        "Blood Pressure must be in the format '120/80'.";
    }

    // ✅ Validate Pulse (must be a number)
    if (preChecks.pulse != null && isNaN(Number(preChecks.pulse))) {
      newErrors.pulse = "Pulse must be a valid number.";
    }

    // ✅ Validate Height (must be a number)
    if (preChecks.height != null && isNaN(Number(preChecks.height))) {
      newErrors.height = "Height must be a valid number.";
    }

    // ✅ Validate Weight (must be a number)
    if (preChecks.weight != null && isNaN(Number(preChecks.weight))) {
      newErrors.weight = "Weight must be a valid number.";
    }

    // ✅ Validate SpO2 (must be a percentage between 0-100)
    if (
      preChecks.spo2 != null &&
      (isNaN(Number(preChecks.spo2)) ||
        Number(preChecks.spo2) < 0 ||
        Number(preChecks.spo2) > 100)
    ) {
      newErrors.spo2 = "SpO2 must be a valid percentage (0-100).";
    }

    // ✅ Validate Respiratory Rate (must be a number)
    if (
      preChecks.respiratoryRate != null &&
      isNaN(Number(preChecks.respiratoryRate))
    ) {
      newErrors.respiratoryRate = "Respiratory Rate must be a valid number.";
    }

    // ✅ Debugging output
    console.log("Validation Errors:", newErrors);

    // ✅ Return errors object
    return newErrors;
  };

  const requiredFieldsConfig = {
    generalSymptoms: {
      fever: [
          "feverDuration", 
          "feverNature", 
          "feverType", 
          "feverIntensity", 
          "shivers", 
          "associatedSymptoms", 
          "cough", 
          "coughWithBleeding", 
          "pain", 
          "generalWeakness", 
          "lossOfWeight", 
          "burningInUrine", 
          "causes", 
          "reliefs", 
          "bodyTemperature", 
          "chillsSweating", 
          "fatigueWeakness", 
          "bodyAches"
      ],
      generalWeakness: [
          "weaknessDuration", 
          "appetite", 
          "weightChange", 
          "abdominalPain", 
          "chestPain", 
          "fever", 
          "cough", 
          "diarrhea", 
          "constipation"
      ],
      specificWeakness: [
          "specificWeaknessDuration",
          "weaknessLocation",
          "historyOfInjury",
          "startCause",
          "progress"
      ],
      dizziness: [
          "dizzinessDuration",
          "dizzinessNature",
          "dizzinessType",
          "dizzinessCause",
          "dizzinessRelief",
          "relationWithPosition",
          "historyOfFainting",
          "historyOfFall",
          "associatedSymptoms",
          "vision",
          "hearing"
      ],
      fainting: [
          "faintingEpisodes",
          "intervalBetweenEpisodes",
          "consciousnessLost",
          "associatedFits",
          "fall",
          "dizziness",
          "faintingCause",
          "faintingRelief"
      ],
      headache: [
          "painLocation",
          "painIntensity",
          "durationOfHeadache",
          "associatedSymptoms"
      ]
  },
    gastrointestinalIssues: {
        acidityIndigestion: [
          "duration",
          "abdominalPain",
          "vomiting",
          "nausea",
          "bowelHabitChange",
          "appetite",
          "constipation",
          "diarrhea",
          "cause",
          "worsens",
          "jaundiceHistory",
          "alcohol",
          "smoking",
          "weightChange"
        ],
        diarrhea: [
          "duration",
          "stoolType",
          "nature",
          "frequency",
          "blood",
          "associatedSymptoms",
          "relationWithFood",
          "currentMedications"
        ],
        vomiting: [
          "duration",
          "nature",
          "frequency",
          "appetite",
          "cause",
          "relief",
          "blood",
          "associatedSymptoms",
          "nausea"
        ],
        abdominalPain: [
          "duration",
          "startLocation",
          "currentLocation",
          "painStart",
          "intensity",
          "nature",
          "triggers",
          "relief",
          "associatedSymptoms"
        ],
        bleedingWithStool: [
          "duration",
          "stoolColor",
          "amount",
          "painDuringPassing",
          "bowelHabitChange",
          "constipation",
          "diarrhea"
        ],
        ulcer: [
          "duration",
          "location",
          "startCause",
          "pain",
          "surface",
          "edges",
          "size"
        ]
      },
    
    cardiovascularIssues: {
      palpitations: [
        "palpitationDuration",
        "palpitationType",
        "palpitationDurationDetail",
        "palpitationAssociatedSymptoms",
        "palpitationFainting",
        "palpitationFall",
        "palpitationDizziness",
        "palpitationTriggers",
        "palpitationRelief",
      ],
    },
    otherSymptoms: {
      symptoms: [
        "otherSpecify",
        "otherDuration",
        "otherLocation",
        "otherType",
        "otherSeverity",
        "otherFrequency",
        "otherAssociatedSymptoms",
        "otherTriggers",
        "otherAlleviatingFactors",
      ],
    },
    skinAndExternalConditions: {
      boils: ["boilLocation", "boilDuration", "boilWhere", "boilStart", "boilPain", "boilSkinColor"],
      skinRash: ["rashDuration", "rashLocation", "rashSize", "rashCount", "rashSurface", "rashColor"],
      injury: ["injuryDuration", "injuryLocation", "injuryCause", "injuryProblem", "injuryBleeding"],
    },
    urinaryAndReproductiveHealth: {
      yellowUrine: ["duration", "abdominalPain", "fever", "stoolColor", "burningWithUrine", "generalWeakness"],
      urinaryIssues: [
        "symptomsDuration",
        "frequencyPerDay",
        "frequencyNature",
        "burningNature",
        "burningColor",
        "fever",
        "bloodInUrine",
        "urineHolding",
        "urineStream",
      ],
      menstrualIssues: [
        "hadPeriod",
        "firstPeriod",
        "periodFrequency",
        "menstrualFlow",
        "daysWithFlow",
        "painDuringPeriod",
        "otherSymptoms",
        "symptomsDisappear",
      ],
      sexualHealthIssues: [
        "married",
        "lmp",
        "periodDuration",
        "durationRegular",
        "intervalBetweenPeriods",
        "intervalRegular",
        "flow",
        "numberOfChildren",
        "numberOfPregnancies",
        "firstChildbirthAge",
        "lastChildbirthAge",
        "contraceptionPractice",
        "discharge",
        "bleedingBetweenPeriods",
        "pain",
        "itching",
      ],
      prenatalIssues: [
        "married",
        "lmp",
        "duration",
        "durationRegular",
        "interval",
        "intervalRegular",
        "flow",
        "painDuringIntercourse",
      ],
      pregnancy: [
        "sexuallyActive",
        "lastIntercourse",
        "lastMenstrualPeriod",
        "menstrualCyclesRegular",
        "previousPregnancy",
        "pregnancyOutcome",
        "forcedSexualEvent",
      ],
      familyPlanning: [
        "contraceptiveMethod",
        "menstrualCycles",
        "pregnancyHistory",
        "children",
        "planningChildren",
        "previousCondition",
      ],
    },
    respiratoryIssues: {
    coughThroatProblem: [
      "duration",
      "frequency",
      "sputum",
      "sputumColor",
      "sputumAmount",
      "fever",
      "difficultySwallowing",
      "throatPain",
      "breathingDifficulty"
    ],
    shortnessOfBreath: [
      "duration",
      "progression",
      "triggers",
      "relief",
      "wakesAtNight",
      "chestPain",
      "cough",
      "associatedSymptoms"
    ],
    soreThroat: [
      "duration",
      "severity",
      "painLevel",
      "painLocation",
      "difficultySwallowing",
      "voiceChanges",
      "associatedSymptoms",
      "recentIllness"
    ]
  }
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
              type: "number",
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
              type: "select",
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
              type: "select",
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
              type: "select",
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
              type: "select",
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
              type: "select",
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
              type: "select",
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
              type: "select",
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
            { name: "duration", label: "Duration (Days)", type: "text" },
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
              options: ["Can't walk", "Can't move", "Pain", "Others"],
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
  const handleSubmit = () => {
    //onTabChange("labresult"); // Change tab to "Examinationations"

    console.log(formData);
  };

  const [otherValues, setOtherValues] = useState({});
  const [currentsPage, setCurrentsPage] = useState(0);

  const [formValues, setFormValues] = useState({});
  const [currentInnerPage, setCurrentInnerPage] = useState(0);

  const validateFormMedicalAssesment = (
    currentComplaint,
    sicknessSections,
    formData,
  ) => {
    const errors = {};

    if (!currentComplaint) return errors; // If no complaint, skip validation

    const section = sicknessSections[currentComplaint.section];
    const subsection = section?.subsections?.[currentComplaint.subsection];

    if (section && subsection) {
      subsection.fields.forEach((field) => {
        const value = currentComplaint.subsection
          ? formData?.chiefComplain?.[currentComplaint.section]?.[
              currentComplaint.subsection
            ]?.[field.name]
          : formData?.chiefComplain?.[currentComplaint.section]?.[field.name];

        if (!value) {
          if (!errors[currentComplaint.section])
            errors[currentComplaint.section] = {};
          errors[currentComplaint.section][field.name] =
            `${field.label} is required`;
        }
      });
    }

    return errors; // Returns an object containing field-specific errors
  };

  const renderPatientVisitsList = () => {
    console.log(examinations);

    // Sample data
    const visits = [
      {
        id: 1,
        date: "2024-12-28",
        time: "09:30",
        doctor: "Dr. Smith",
        reason: "Regular Checkup",
        diagnosis: "Healthy, no concerns",
        prescription: "None",
        vitals: {
          bp: "120/80",
          temp: "98.6°F",
          pulse: "72",
        },
      },
      {
        id: 2,
        date: "2024-12-15",
        time: "14:45",
        doctor: "Dr. Johnson",
        reason: "Fever and Cough",
        diagnosis: "Upper Respiratory Infection",
        prescription: "Amoxicillin 500mg",
        vitals: {
          bp: "118/78",
          temp: "101.2°F",
          pulse: "88",
        },
      },
      {
        id: 3,
        date: "2024-11-30",
        time: "11:15",
        doctor: "Dr. Smith",
        reason: "Follow-up",
        diagnosis: "Recovery progressing well",
        prescription: "Continue previous medication",
        vitals: {
          bp: "122/82",
          temp: "98.8°F",
          pulse: "76",
        },
      },
    ];

    const toggleExamination = (id) => {
      setexpandedExamination(expandedExamination === id ? null : id);
    };
    console.log(initialExamination);
    return (
      <div
        className="mx-auto max-w-4xl space-y-8 p-6"
        style={{ width: "65vw" }}
      >
        <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
          <CardHeader className="rounded-t-lg bg-[#007664] text-white">
            <CardTitle className="text-2xl">Previous Examinations</CardTitle>
            <CardDescription className="text-[#F7F7F7]">
              Click on an examination to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {examinations ??
              (Array.isArray(initialExamination)
                ? initialExamination
                : [initialExamination]) ? (
                (examinations
                  ? examinations
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                      )
                      .slice(0, 4)
                  : [initialExamination]
                ) // Ensure it's an array
                  .map((exam) => (
                    <div
                      key={exam?._id}
                      className="overflow-hidden rounded-lg border shadow-sm"
                    >
                      <button
                        onClick={() => toggleExamination(exam?._id)}
                        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#53FDFD]/10"
                        style={{
                          backgroundColor:
                            expandedExamination === exam?._id
                              ? "#53FDFD/20"
                              : "white",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <Calendar className="text-[#007664]" size={20} />
                          <div className="text-left">
                            <div className="font-medium text-[#007664]">
                              {exam?.createdAt
                                ? new Date(exam.createdAt).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-sm text-[#75C05B]">
                              {exam?.examinationID || "N/A"}
                            </div>
                          </div>
                        </div>
                        {expandedExamination === exam?._id ? (
                          <ChevronUp className="text-[#007664]" size={20} />
                        ) : (
                          <ChevronDown className="text-[#007664]" size={20} />
                        )}
                      </button>

                      {expandedExamination === exam?._id && (
                        <div className="border-t bg-[#F7F7F7] p-4">
                          <div className="grid gap-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="text-[#75C05B]" size={16} />
                              <span className="text-sm text-[#007664]">
                                Location: {exam?.examinedAt || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="text-[#75C05B]" size={16} />
                              <span className="text-sm text-[#007664]">
                                Doctor: {exam?.examinedBy || "N/A"}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-[#B24531]">
                                Vitals
                              </h4>
                              <div className="grid grid-cols-3 gap-4 text-sm text-[#007664]">
                                <div className="rounded bg-white p-2">
                                  BP: {exam?.vitals?.bloodPressure || "N/A"}
                                </div>
                                <div className="rounded bg-white p-2">
                                  Temp: {exam?.vitals?.temperature || "N/A"}
                                </div>
                                <div className="rounded bg-white p-2">
                                  Pulse: {exam?.vitals?.pulse || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-[#B24531]">
                                Additional Metrics
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm text-[#007664]">
                                <div className="rounded bg-white p-2">
                                  Spo2: {exam?.vitals?.spo2 || "N/A"}
                                </div>
                                <div className="rounded bg-white p-2">
                                  Blood Pressure:{" "}
                                  {exam?.vitals?.bloodPressure || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-[#B24531]">
                                Chief Complaints
                              </h4>
                              <p className="rounded bg-white p-2 text-sm text-[#007664]">
                                {exam?.chiefComplain &&
                                Object.keys(exam.chiefComplain).length > 0
                                  ? JSON.stringify(exam.chiefComplain)
                                  : "No specific complaints recorded"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">
                  No previous examinations available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const [refresh, setRefresh] = useState(false);

  const validatePrechecks = () => {
    const newErrors = {
      preChecks: {},
      vitals: {},
    };
    let isValid = true;

    // Validate preChecks
    const requiredPreChecks = [
      "washedHands",
      "greetedPatientByName",
      "verifiedPatientIdentity",
      "askedToSitLieComfortably",
      "observedGait",
      "askedAboutPain",
      "femaleChaperonePresent",
      "checkedVisitHistory",
    ];

    requiredPreChecks.forEach((key) => {
      const value = formData?.preChecks?.[key];
      if (value === undefined || value === null || value === "") {
        newErrors.preChecks[key] = "This field is required";
        isValid = false;
      } else if (typeof value === "boolean" && !value) {
        newErrors.preChecks[key] = "This check must be completed";
        isValid = false;
      }
    });

    // Validate vitals
    const requiredVitals = [
      "temperature",
      "bloodPressure",
      "pulse",
      "height",
      "weight",
      "spo2",
      "respiratoryRate",
    ];

    requiredVitals.forEach((key) => {
      const value = formData?.vitals?.[key];
      if (value === undefined || value === null || value === "") {
        newErrors.vitals[key] = "This field is required";
        isValid = false;
      } else {
        const error = validateField("vitals", key, value);
        if (error) {
          newErrors.vitals[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateField = (section, name, value) => {
    if (!value && value !== false) {
      return "This field is required";
    }

    // Vital signs specific validation
    if (section === "vitals") {
      switch (name) {
        case "temperature":
          if (value < 35 || value > 42)
            return "Temperature must be between 35-42°C";
          break;
        case "bloodPressure":
          if (value < 70 || value > 200)
            return "Blood pressure must be between 70-200 mmHg";
          break;
        case "pulse":
          if (value < 40 || value > 200)
            return "Pulse must be between 40-200 bpm";
          break;
        case "spo2":
          if (value < 0 || value > 100) return "SpO2 must be between 0-100%";
          break;
        case "respiratoryRate":
          if (value < 8 || value > 40)
            return "Respiratory rate must be between 8-40 bpm";
          break;
      }
    }
    return "";
  };

  const renderPreChecks = () => {
    const handleChange = (e) => {
      if (!e || !e.target) return;

      const { name, value, type, checked } = e.target;
      if (!name) return;

      const fieldValue = type === "checkbox" ? checked : value;
      const section = vitalFields.some((field) => field.name === name)
        ? "vitals"
        : "preChecks";

      // Validate the changed field
      const error = validateField(section, name, fieldValue);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: fieldValue,
        },
      }));

      // Update validation errors
      setErrors((prev) => {
        const newErrors = { ...prev };

        if (error) {
          newErrors[section] = {
            ...newErrors[section],
            [name]: error,
          };
        } else {
          // Clear error if field is valid
          if (newErrors[section]) {
            delete newErrors[section][name];
          }
        }

        return newErrors;
      });
    };

    const preCheckItems = [
      { name: "washedHands", text: "I washed my hands", icon: "🧼" },
      {
        name: "greetedPatientByName",
        text: "I greeted the patient by name",
        icon: "👋",
      },
      {
        name: "verifiedPatientIdentity",
        text: "I verified patient identity",
        icon: "🪪",
      },
      {
        name: "askedToSitLieComfortably",
        text: "I have asked the patient to sit/lie down comfortably",
        icon: "🛏️",
      },
      {
        name: "observedGait",
        text: "I observed the patient's gait",
        icon: "🚶",
      },
      { name: "askedAboutPain", text: "I asked about any pain", icon: "🤕" },
      {
        name: "femaleChaperonePresent",
        text: "Female chaperone present (if required)",
        icon: "👥",
      },
      {
        name: "checkedVisitHistory",
        text: "I checked patient's visit history",
        icon: "📋",
      },
    ];

    const vitalFields = [
      {
        label: "Temperature",
        name: "temperature",
        icon: "🌡️",
        unit: "°C",
        min: 35,
        max: 42,
      },
      {
        label: "Blood Pressure",
        name: "bloodPressure",
        icon: "❤️",
        unit: "mmHg",
        min: 70,
        max: 200,
      },
      {
        label: "Pulse",
        name: "pulse",
        icon: "💓",
        unit: "bpm",
        min: 40,
        max: 200,
      },
      {
        label: "Height",
        name: "height",
        icon: "📏",
        unit: "cm",
        min: 0,
        max: 300,
      },
      {
        label: "Weight",
        name: "weight",
        icon: "⚖️",
        unit: "kg",
        min: 0,
        max: 500,
      },
      { label: "SpO2", name: "spo2", icon: "🫁", unit: "%", min: 0, max: 100 },
      {
        label: "Respiratory Rate",
        name: "respiratoryRate",
        icon: "🫸",
        unit: "bpm",
        min: 8,
        max: 40,
      },
    ];
    return (
      <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-6 shadow-md">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Pre-Examination Checklist
          </h2>
          <p className="mt-1 text-gray-500">
            Please complete all required checks before proceeding
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {preCheckItems.map((check) => (
              <div
                key={check.name}
                className="group flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-50"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id={check.name}
                    name={check.name}
                    className="peer size-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-transparent checked:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    onChange={handleChange}
                    checked={formData?.preChecks?.[check.name] ?? false}
                  />
                  <Check className="absolute left-1 top-1 size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                </div>
                <span className="text-xl">{check.icon}</span>
                <label
                  htmlFor={check.name}
                  className="cursor-pointer text-gray-700 group-hover:text-gray-900"
                >
                  {check.text} <span className="text-red-500">*</span>
                </label>
                {errors?.preChecks?.[check.name] && (
                  <p className="ml-10 text-sm text-red-500">
                    {errors.preChecks[check.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6 border-t pt-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Vital Signs
              </h3>
              <div className="h-0.5 grow rounded bg-gradient-to-r from-teal-500/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="mr-2">👤</span>
                  Appearance <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  name="appearance"
                  onChange={handleChange}
                  value={formData?.preChecks?.appearance ?? ""}
                >
                  <option value="">Select appearance...</option>
                  {[
                    "Well",
                    "Unwell",
                    "Pale",
                    "Flushed",
                    "Icteric",
                    "Lethargic",
                    "Active",
                    "Agitated",
                    "Calm",
                    "Compliant",
                    "Combative",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="mr-2">🚶</span>
                  Gait <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  name="gait"
                  onChange={handleChange}
                  value={formData?.preChecks?.gait ?? ""}
                >
                  <option value="">Select gait...</option>
                  {[
                    "Walks Normally",
                    "Walks with Limp",
                    "Walks with Support",
                    "Unable to Walk",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors?.preChecks?.appearance && (
                  <p className="text-sm text-red-500">
                    {errors.preChecks.appearance}
                  </p>
                )}
              </div>

              {vitalFields.map((field) => (
                <div key={field.name} className="relative space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="mr-2">{field.icon}</span>
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name={field.name}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 pr-12 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                      onChange={handleChange}
                      value={formData?.vitals?.[field.name] ?? ""}
                      min={field.min}
                      max={field.max}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      {field.unit}
                    </span>
                  </div>
                  {errors?.vitals?.[field.name]?.length > 0 && (
                    <p className="text-sm text-red-500">
                      {errors.vitals[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const validateChiefComplaints = () => {
    // Check if at least one complaint is selected
    const hasSelectedComplaints = selectedComplaints.length > 0;

    if (!hasSelectedComplaints) {
      setErrors((prev) => ({
        ...prev,
        chiefComplaints:
          "Please select at least one chief complaint before proceeding",
      }));
      return false;
    }

    // Clear the error if validation passes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.chiefComplaints;
      return newErrors;
    });

    return true;
  };

  const renderChiefComplaints = ({
    selectedComplaints,
    setSelectedComplaints,
  }) => {
    // Ensure you have access to the sickness data structure.

    const handleChangeChiefcomplain = (
      sectionKey,
      subsectionKey,
      isChecked,
    ) => {
      // Check if the subsection already exists in the selectedComplaints array
      const exists = selectedComplaints.some(
        (complaint) => complaint.subsection === subsectionKey,
      );

      if (isChecked && !exists) {
        // Only add the subsection if it doesn't already exist
        setSelectedComplaints((prev) => [
          ...prev,
          { section: sectionKey, subsection: subsectionKey },
        ]);
      } else if (!isChecked) {
        // Remove the subsection if unchecked
        setSelectedComplaints((prev) =>
          prev.filter((complaint) => complaint.subsection !== subsectionKey),
        );
      }
    };

    // Check if a complaint is selected
    const isComplaintSelected = (sectionKey, subsectionKey, item) => {
      // Check if the item is in the selected complaints list
      return selectedComplaints.some(
        (complaint) =>
          complaint.section === sectionKey &&
          complaint.subsection === subsectionKey &&
          complaint.item === item,
      );
    };
    //console.log(selectedComplaints)
    return (
      <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-[#F7F7F7] p-6 shadow-sm">
        {/* Alert Banner */}
        <div className="flex items-start space-x-3 rounded-lg border border-[#007664]/20 bg-[#007664]/10 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#007664]" />
          <p className="text-sm text-[#007664]">
            Please review the patients medical history before proceeding with
            the new Examination to ensure comprehensive and personalized care.
          </p>
        </div>

        {/* Header */}
        <div className="border-b border-[#007664]/20 pb-4">
          <h2 className="text-2xl font-bold text-[#007664]">
            Chief Complaints
          </h2>
          <p className="mt-1 text-[#007664]/70">
            Select all applicable symptoms (at least one required)
          </p>
        </div>
        {/* Error Display */}
        {errors?.chiefComplaints && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
              <span className="text-sm text-red-600">
                {errors.chiefComplaints}
              </span>
            </div>
          </div>
        )}
        {/* Sections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Iterate over sickness sections */}
          {Object.keys(sicknessSections).map((sectionKey) => {
            const section = sicknessSections[sectionKey];
            return (
              <div key={sectionKey} className="space-y-3">
                <h3 className="font-semibold text-[#007664]">
                  {section.title}
                </h3>
                {Object.keys(section.subsections).map((subsectionKey) => {
                  const subsection = section.subsections[subsectionKey];

                  const hasData =
                  formData?.chiefComplain?.[sectionKey]?.[subsectionKey] &&
    Object.values(formData?.chiefComplain[sectionKey][subsectionKey]).some(
      (value) => value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)
    );
                  return (
                    <div key={subsectionKey} className="space-y-3">
                      <h4 className="font-semibold text-[#007664]"></h4>
                      {/* Skip rendering fields, only display subsection titles */}
                      {/* Add a checkbox for selecting each subsection */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${sectionKey}-${subsectionKey}`}
                          checked={hasData} 
                          className="peer cursor-pointer appearance-none rounded border-2 border-[#75C05B] text-[#007664] transition-colors duration-200 checked:bg-[#007664] focus:ring-[#007664] focus:ring-offset-2"
                          
                          onChange={(e) =>
                            handleChangeChiefcomplain(
                              sectionKey,
                              subsectionKey,
                              e.target.checked,
                            )
                          }
                        />
                        <label
                          htmlFor={`${sectionKey}-${subsectionKey}`}
                          className="ml-3 cursor-pointer text-sm text-[#007664]/80 group-hover:text-[#007664]"
                        >
                          {subsection.title}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const validatePhysicalExam = () => {
    const newErrors = {};

    [
      { title: "Eye", sections: ["Jaundice", "Pallor"] },
      { title: "Hand", sections: ["Cyanosis", "Clubbing"] },
      { title: "Leg", sections: ["Oedema"] },
    ].forEach((area) => {
      area.sections.forEach((section) => {
        if (!formData?.physicalExam?.[area.title]?.[section]) {
          if (!newErrors[area.title]) newErrors[area.title] = {};
          newErrors[area.title][section] = `${section} is required`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns `true` if no errors
  };

  const renderPhysicalExam = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      const [area, section] = name.split("-");

      // Safely update physical exam data while preserving all other form data
      setFormData((prev) => {
        // Keep all existing form data
        const updatedData = { ...prev };

        // If physicalExam key doesn't exist, create it while preserving other data
        if (!updatedData.physicalExam) {
          updatedData.physicalExam = {};
        }

        // If the area doesn't exist, create it
        if (!updatedData.physicalExam[area]) {
          updatedData.physicalExam[area] = {};
        }

        // Update the specific section value
        updatedData.physicalExam[area][section] = value;

        return updatedData;
      });

      setErrors((prevErrors) => {
        if (prevErrors[area]?.[section]) {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[area][section];
          return updatedErrors;
        }
        return prevErrors;
      });
    };
    return (
      <div className="mx-auto max-w-4xl space-y-8 bg-gray-50 p-6">
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Physical Examination
          </h2>
          <Image
            src={main}
            alt="Description of the image"
            width={500}
            height={300}
          />
          {[
            {
              title: "Eye",
              sections: [
                {
                  name: "Jaundice",
                  image: eye,
                  options: ["Yes", "No"],
                },
                {
                  name: "Pallor",
                  image: pallor,
                  options: ["Mild", "Moderate", "Severe", "None"],
                },
              ],
            },
            {
              title: "Hand",
              sections: [
                {
                  name: "Cyanosis",
                  image: cybosis,
                  options: ["Yes", "No"],
                },
                {
                  name: "Clubbing",
                  image: curbing,
                  options: ["Normal", "Moderate", "None"],
                },
              ],
            },
            {
              title: "Leg",
              sections: [
                {
                  name: "Oedema",
                  image: leg,
                  options: ["Mild", "Moderate", "Severe", "None"],
                },
              ],
            },
          ].map((area) => (
            <div
              key={area.title}
              className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {area.title}
              </h3>

              <div className="space-y-6">
                {area.sections.map((section) => (
                  <div key={section.name} className="grid gap-6 md:grid-cols-2">
                    <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={section.image}
                        alt={section.name}
                        className="size-full object-cover"
                        width={300}
                        height={256}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium text-gray-700">
                        {section.name}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {section.options.map((option) => (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center space-x-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                           <input
      type="radio"
      name={`${area.title}-${section.name}`} 
      checked={formData?.physicalExam?.[area.title]?.[section.name] === option}
      value={option}
      className="size-4 text-blue-600"
      onChange={handleChange}
    />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {errors[area.title]?.[section.name] && (
                        <p className="text-sm text-red-500">
                          {errors[area.title][section.name]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };






  const validateFieldsmulti = (formData, selectedComplain) => {
    let errors = {};
    const chiefComplain = formData?.chiefComplain || {};
  
    selectedComplain.forEach(({ section, subsection }) => {
      const requiredFields = requiredFieldsConfig?.[section]?.[subsection] || [];
  
      requiredFields.forEach((field) => {
        const subsectionData = chiefComplain?.[section]?.[subsection] || {};
        const fieldValue = subsectionData[field];
        const fieldId = `${section}-${subsection}-${field}`;
  
        // Validate required fields
        if (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "")) {
          errors[fieldId] = `Please provide a valid value for ${field.replace(/([A-Z])/g, " $1")}`;
        }
  
        // Ensure duration fields are positive numbers
        if (field.toLowerCase().includes("duration") && (isNaN(fieldValue) || fieldValue <= 0)) {
          errors[fieldId] = "Duration must be a positive number";
        }
      });
    });
  
    return errors;
  };
  
  

  const validateMultiSectionSymptoms = () => {
    // Get the current section and subsection from selectedComplaints
    const currentComplaint = selectedComplaints[currentInnerPage]; // Get only the current inner section
    if (!currentComplaint) return true; // If no complaints, allow navigation
  
    const { section, subsection } = currentComplaint;
    const errors = validateFieldsmulti(formData, [currentComplaint]); // Validate only the current inner section
  
    setValidationErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      console.log("Current inner page is valid. Moving to next page...");
      return true;
    } else {
      console.log("Errors in current inner page:", errors);
      return false;
    }
  };
  







  const handleNextMedassesmentVal = () => {
    const validationErrors = validateFormMedicalAssesment(
      selectedComplaints[currentInnerPage],
      sicknessSections,
      formData,
    );

    if (Object.keys(validationErrors).length === 0) {
      setCurrentInnerPage((prev) => prev + 1); // Move to next page
      return false;
    } else {
      setErrors(validationErrors); // Pass errors to the form
      return true;
    }
  };

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = (pageIndex) => {
    const currentComplaint = selectedComplaints[pageIndex];
    const fields =
      sicknessSections[currentComplaint.section]?.subsections?.[
        currentComplaint.subsection
      ]?.fields || [];

    const errors = {};
    fields.forEach((field) => {
      if (field.required) {
        const value =
          formData?.chiefComplain?.[currentComplaint.section]?.[
            currentComplaint.subsection
          ]?.[field.name];
        if (!value || value.trim() === "") {
          errors[field.name] = "This field is required";
        }
      }
      // Add other validation rules as needed
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateFields(currentInnerPage);
    if (isValid) {
      setCurrentInnerPage((prev) => prev + 1);
      setValidationErrors({}); // Clear errors when moving to next page
    }
  };

  const handleComplete = async () => {
    const isValid = validateFields(currentInnerPage);
    if (isValid) {
      setIsSubmitting(true);
      try {
        // Submit your form data
        await submitFormData(formData);
        // Handle success
      } catch (error) {
        // Handle error
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  const handleNavigation = (direction) => {
    if (currentPage === 4) {
      const totalInnerPages = selectedComplaints.length;
  
      if (direction === "next") {
        // Only validate when navigating within inner pages or moving to the next outer page
        if (!validateMultiSectionSymptoms()) {
          return; // Stop navigation if validation fails
        }
  
        if (currentInnerPage < totalInnerPages - 1) {
          setCurrentInnerPage((prev) => prev + 1); // Move to next inner page
        } else {
          setCurrentPage(5); // Move to next outer page
          setCurrentInnerPage(0);
        }
      } else {
        // Previous navigation
        if (currentInnerPage > 0) {
          setCurrentInnerPage((prev) => prev - 1); // Move to previous inner page
        } else {
          setCurrentPage(3); // Move to previous outer page
          setCurrentInnerPage(0);
        }
      }
    } else {
      // Moving from page 3 to page 4 should NOT trigger validation
      if (currentPage === 3 && direction === "next") {
        setCurrentPage(4); // Allow moving to symptoms page without validation
        return;
      }
  
      // Normal outer page navigation with validation
      if (direction === "next" && !validateMultiSectionSymptoms()) {
        return; // Stop navigation if validation fails
      }
  
      setCurrentPage((prev) =>
        direction === "next"
          ? Math.min(pages.length, prev + 1)
          : Math.max(1, prev - 1)
      );
    }
  };
  
  
  
  const pages = [
    renderPatientVisitsList,
    renderPreChecks,
    () => renderChiefComplaints({ selectedComplaints, setSelectedComplaints }),
    () => (
      <MultiSectionSymptomsForm
        selectedComplaints={selectedComplaints}
        sicknessSections={sicknessSections}
        currentInnerPage={currentInnerPage}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        validationErrors={validationErrors}
        isSubmitting={isSubmitting}
        otherValues={otherValues}
        setOtherValues={setOtherValues}
        setTouchedFields={setTouchedFields}
        touchedFields={touchedFields}
        setErrors={setValidationErrors}
      />
    ),
    renderPhysicalExam,
  ];









  const updateGeneralInfo = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(newData).filter(([key, value]) => !(key in prev)),
      ), // Add only if the key doesn't already exist
    }));
  };
  const generateExaminationID = () => {
    const now = new Date();
    const year = now.getFullYear();

    // Get unix timestamp and take last 4 digits
    const timestamp = Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4);
    return `EXA-${year}-${timestamp}`; // Generates ID like EXA-1707070707070
  };
  const examinationID = generateExaminationID();

  const [manualUpdateTrigger, setManualUpdateTrigger] = useState(false);

  useEffect(() => {
    const handleExamination = async () => {
      if (!buttonText) return; // Ensure buttonText is available
  
      setIsLoading(true); // Start loading
  
      if (buttonText === "Submit") {
        await createExamination(formData, onSubmit, onTabChange);
      } else if (buttonText === "Update") {
        await updateExam(formData, onSubmit, onTabChange);
      }
  
      setIsLoading(false); // Stop loading after completion
    };
  
    if (manualUpdateTrigger) {
      handleExamination();
      setManualUpdateTrigger(false); // Reset trigger
    }
  }, [manualUpdateTrigger, formData, buttonText, onSubmit, onTabChange]);
  
  
  const handleSubmitExamination = () => {
    if (buttonText === "Submit") {
      setFormData((prevData) => ({
        ...prevData,
        patient: patient,
        examinedBy: session?.data?.user?.id,
        examinedByAccType:currentDashboard,
        examinationID: examinationID,
        examinedAt: "Gembu Center",
      }));
    }
  
    if (buttonText === "Update") {
      setFormData((prevData) => ({
        ...prevData,
        patient: patient,
        examinedBy: session?.data?.user?.id,
        examinedAt: "Gembu Center",
      }));
    }
  
    setManualUpdateTrigger(true);
  };
  

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Upper content container */}
      <div className="flex w-full flex-1 flex-col p-6">
        {/* Page number circles */}
        <div className="mx-auto mb-0 w-full max-w-6xl">
          <div className="flex justify-center gap-2">
            {Array.from({ length: pages.length }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  //onClick={() => {setCurrentPage(pageNum);setCurrentInnerPage(0);}}
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
        </div>

        {/* Content area */}
        <div className="mx-auto w-full max-w-6xl flex-1">
          <div className="size-full">{pages[currentPage - 1]()}</div>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="w-full border-t bg-white shadow-lg">
        <div className="mx-auto w-full max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation("previous")}
              disabled={currentPage === 1}
              className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
            >
              <ChevronLeft className="mr-2 size-5" />
              Previous
            </button>
            <span className="text-sm font-medium text-gray-500">
              {currentPage === 4
                ? `Page ${currentPage} (${currentInnerPage + 1}/${selectedComplaints.length})`
                : `Page ${currentPage} of ${pages.length}`}
            </span>
            <button 
                 disabled={isLoading}
  onClick={() => {
    let isValid = true;

    if (currentPage === 2) {
      isValid = validatePrechecks();
    } else if (currentPage === 3) {
      isValid = validateChiefComplaints();
      console.log(isValid); // Logging validation result
    } else if (currentPage === 5) {
      isValid = validatePhysicalExam();
    }

    if (!isValid) return; // Stop execution if validation fails

    if (currentPage === pages.length) {
      handleSubmitExamination(); // No need for setIsLoading since it's in useEffect
    } else {
      handleNavigation("next");
    }
  }}
  className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
>
  {isLoading ? (
    <>
      <Loader2 className="size-4 animate-spin" />
      {currentPage === pages.length ? (buttonText === "Update" ? "Updating..." : "Submitting...") : "Next"}
    </>
  ) : (
    <>
      {currentPage === pages.length ? (buttonText === "Update" ? "Update" : "Submit") : "Next"}
      <ChevronRight className="ml-2 size-5" />
    </>
  )}
</button>


          </div>
        </div>
      </div>
    </div>
  );
}

export function ViewExamination({ examination, isOpen, onClose }) {
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
  // console.log(examination);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-[#F7F7F7] p-0">
        <DialogHeader className="rounded-t-lg bg-[#007664] p-6 text-white">
          <DialogTitle className="text-2xl font-bold">
            Examination Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-6">
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
                <InfoItem label="Examined By" value={examination.examinedBy} />
                <InfoItem
                  label="Examination ID"
                  value={examination.examinationID}
                />
                <InfoItem label="Examined At" value={examination.examinedAt} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Pre-checks */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#B24531]" />
              <h2 className="text-xl font-bold text-[#007664]">Pre-checks</h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                {examination?.preChecks ? (
                  Object.entries(examination.preChecks).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg bg-gray-50 p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#007664]">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(" ")
                            .trim()}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            value
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {value ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center italic text-gray-500">
                    No Pre-checks Available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Chief Complaints 
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Chief Complaints
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                {Object.entries(examination.chiefComplaints).map(
                  ([category, symptoms]) => (
                    <div key={category}>
                      <h4 className="font-bold text-[#007664]">
                        {category.replace(/([A-Z])/g, " $1")}
                      </h4>
                      <ul className="list-disc pl-4">
                        {Object.entries(symptoms).map(([symptom, value]) =>
                          value ? (
                            <li key={symptom}>
                              {symptom.replace(/([A-Z])/g, " $1")}
                            </li>
                          ) : null,
                        )}
                      </ul>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </motion.div>
*/}

          {/* Chief Complaints */}
          {/* Chief Complaints */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Chief Complaints
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                {examination?.chiefComplain ? (
                  Object.entries(examination.chiefComplain).map(
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
                                                {capitalize(String(value))}
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
              </CardContent>
            </Card>
          </motion.div>
          {/* Physical Examination */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Physical Examination
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                {examination?.physicalExam ? (
                  Object.entries(examination.physicalExam).map(
                    ([bodyPart, conditions]) => {
                      const hasValidConditions = Object.values(conditions).some(
                        (value) => value,
                      );

                      const capitalize = (str) => {
                        return str
                          .replace(/([A-Z])/g, " $1")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(" ")
                          .trim();
                      };

                      return hasValidConditions ? (
                        <div
                          key={bodyPart}
                          className="rounded-lg bg-gray-50 p-4"
                        >
                          <h4 className="mb-3 text-lg font-bold text-[#007664]">
                            {capitalize(bodyPart)}
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(conditions).map(
                              ([condition, severity]) => (
                                <div
                                  key={`${bodyPart}-${condition}`}
                                  className="rounded-md bg-white p-3 shadow-sm"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-[#007664]">
                                      {capitalize(condition)}
                                    </span>
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                      {capitalize(severity)}
                                    </span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null;
                    },
                  )
                ) : (
                  <div className="col-span-2 text-center italic text-gray-500">
                    No Physical Examination Data Available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
