"use client";

import React, { useState, useEffect } from "react";

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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// UI Components

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ViewMedication,
  NewMedicationForm,
} from "../../components/healthassistant";
import {
  NewDiagnosisForm,
  ViewDiagnosis,
  EditDiagnosisForm,
} from "../../components/healthassistant";
import { NewLabTestForm, ViewLabTest } from "../../components/healthassistant";
import {
  NewExamination,
  EditExamination,
  ViewExamination,
} from "../../components/healthassistant";

import Image from "next/image";
import eye from "./eye.png";
import leg from "./leg.png";
import pallor from "./pallor.png";
import curbing from "./curbbin.png";
import cybosis from "./cybosis.png";
import main from "./main.png";
// Third-party Modal
import Modal from "react-modal";
import { motion } from "framer-motion";
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
const PatientDetailsView = ({ patient, onClose, SelectedPatient }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [showexaminationForm, setShowexaminationForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
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
  const [isSubsectionOpen, setIsSubsectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddlabtestOpen, setIsAddlabtestOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddmOpen, setIsAddmOpen] = useState(false);
  const [isAddDOpen, setIsAddDOpen] = useState(false);
  const [isAddlabOpen, setIsAddlabOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [consult, setConsult] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [med, setMed] = useState(null);

  const [isViewConsultOpen, setIsViewConsultOpen] = useState(false);
  const [isViewDiagOpen, setIsViewDiagOpen] = useState(false);
  const [isViewMedOpen, setIsViewMedOpen] = useState(false);

  const closeModal = () => setIsAddlabOpen(false);

  const closeViewConsultModal = () => setIsViewConsultOpen(false);
  const closeViewMedModal = () => setIsViewMedOpen(false);
  const closeViewDiagnosisModal = () => setIsViewDiagOpen(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen for resize
    return () => window.removeEventListener("resize", checkScreenWidth); // Cleanup
  }, []);

  const viewlabDetails = (patient) => {
    setResult(patient.labResult);
    setIsAddlabOpen(true);
  };

  const viewConsultDetails = (consult) => {
    setConsult(consult);
    // console.log(consult) ;
    setIsViewConsultOpen(true);
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

    // Populate the list based on selection
    switch (value) {
      case "doctor":
        setList(doctors);
        break;
      case "labTech":
        setList(labTechnicians);
        break;
      case "pharmacy":
        setList(pharmacies);
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
    if (actionType === "add" && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddOpen(isOpen);
  };
  const handleDialogChangelabtest = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddlabtestOpen(isOpen);
  };
  const handleDialogDChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddDOpen(isOpen);
  };
  const handleDialogmChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddmOpen(isOpen);
  };
  const handleDialoglabChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddlabOpen(isOpen);
  };

  const handleDialogViewConsult = (isOpen) => {
    setIsViewConsultOpen(isOpen);
  };
  const handleCallClick = () => {};

  const handleDialogViewMed = (isOpen) => {
    setIsViewMedOpen(isOpen);
  };

  const handleDialogViewDiagnosis = (isOpen) => {
    setIsViewDiagOpen(isOpen);
  };
  const startDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = (item) => {
    console.log("Deleting item:", item);
    // Perform delete action here
    setShowDeleteDialog(false);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

  const MedicationForm = ({
    buttonText,
    onSubmit,
    initialMedicationData = [],
  }) => {
    const [medications, setMedications] = useState([
      {
        id: 1,
        isAICompleted: false,
        isDisabled: false,
        data: {
          medicationDescription: "",
          medicationNote: "",
          medicationCode: [],
          medicationStatus: "active",
          medicationStartDate: "",
          medicationStartTime: "",
          medicationEndDate: "",
          medicationFrequency: {
            type: "daily",
            value: 1,
          },
          dosage: "",
          name: "",
          administrationRoute: "",
          treatmentDuration: "",
          sideEffects: "",
          contraindications: "",
          precautions: "",
          interactions: "",
          specialInstructions: "",
          followUpProtocol: "",
        },
      },
    ]);

    useEffect(() => {
      if (initialMedicationData.length > 0) {
        setMedications(
          initialMedicationData.map((med, index) => ({
            id: index + 1,
            isAICompleted: false,
            isDisabled: false,
            data: {
              ...med,
              medicationFrequency: med.medicationFrequency || {
                type: "daily",
                value: 1,
              },
            },
          })),
        );
      }
    }, [initialMedicationData]);

    const handleAIComplete = (medicationId) => {
      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === medicationId) {
            const demoData = {
              medicationStatus: "active",
              medicationStartDate: "2025-01-13",
              medicationEndDate: "2025-02-13",
              medicationStartTime: "09:00",
              medicationFrequency: {
                type: "daily",
                value: 2,
              },
              medicationNote:
                "Take with food. Monitor blood pressure regularly.",
              dosage: "20mg twice daily",
              medicationDescription:
                "Anti-hypertensive medication used to control blood pressure.",
              name: "Amlodipine",
              administrationRoute: "Oral",
              treatmentDuration: "4 weeks",
              sideEffects:
                "May cause dizziness, headache, or mild nausea. Report severe side effects immediately.",
              contraindications:
                "Not recommended for patients with severe kidney disease or those taking MAO inhibitors.",
              precautions:
                "Monitor blood pressure regularly. Avoid sudden discontinuation.",
              interactions:
                "May interact with beta blockers, NSAIDs, and certain antidepressants.",
              specialInstructions:
                "Take on an empty stomach, 30 minutes before meals.",
              followUpProtocol: "Schedule follow-up appointment in 2 weeks.",
            };

            return {
              ...med,
              isAICompleted: true,
              isDisabled: true,
              data: { ...med.data, ...demoData },
            };
          }
          return med;
        }),
      );
    };

    const regenerateAI = (medicationId) => {
      // This would typically call an API to get new AI suggestions
      handleAIComplete(medicationId);
    };

    const toggleManualEdit = (medicationId) => {
      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === medicationId) {
            return {
              ...med,
              isDisabled: !med.isDisabled,
            };
          }
          return med;
        }),
      );
    };

    const addNewMedication = () => {
      setMedications((prev) => [
        ...prev,
        {
          id: Math.max(...prev.map((m) => m.id)) + 1,
          isAICompleted: false,
          isDisabled: false,
          data: {
            medicationDescription: "",
            medicationNote: "",
            medicationCode: [],
            medicationStatus: "active",
            medicationStartDate: "",
            medicationStartTime: "",
            medicationEndDate: "",
            medicationFrequency: {
              type: "daily",
              value: 1,
            },
            dosage: "",
            name: "",
            administrationRoute: "",
            treatmentDuration: "",
            sideEffects: "",
            contraindications: "",
            precautions: "",
            interactions: "",
            specialInstructions: "",
            followUpProtocol: "",
          },
        },
      ]);
    };

    const removeMedication = (medicationId) => {
      if (medications.length > 1) {
        setMedications((prev) => prev.filter((med) => med.id !== medicationId));
      }
    };

    const handleFieldChange = (medicationId, field, value) => {
      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === medicationId) {
            return {
              ...med,
              data: {
                ...med.data,
                [field]: value,
              },
            };
          }
          return med;
        }),
      );
    };

    const TextArea = ({
      id,
      label,
      value,
      onChange,
      placeholder,
      disabled,
    }) => (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 sm:text-sm"
        />
      </div>
    );

    return (
      <div className="space-y-8">
        {medications.map((medication, index) => (
          <Card key={medication.id} className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Medication {index + 1}
              </h3>
              <div className="flex gap-2">
                {medication.isAICompleted ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateAI(medication.id)}
                      className="inline-flex items-center gap-2 bg-teal-100 hover:bg-teal-200"
                    >
                      <RefreshCw className="size-4" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleManualEdit(medication.id)}
                      className="inline-flex items-center gap-2 bg-teal-100 hover:bg-teal-200"
                    >
                      <Edit className="size-4" />
                      {medication.isDisabled ? "Edit Manually" : "Disable Edit"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIComplete(medication.id)}
                    className="w-full bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] sm:w-auto"
                  >
                    <Lightbulb className="size-4" />
                    Complete with AI
                  </Button>
                )}
                {medications.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMedication(medication.id)}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Basic Fields */}
              <div className="space-y-2">
                <Label htmlFor={`medication-${medication.id}`}>
                  Medication ID
                </Label>
                <Input
                  id={`medication-${medication.id}`}
                  disabled
                  value={`dg-${String(medication.id).padStart(3, "0")}`}
                />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor={`name-${medication.id}`}>Medication Name</Label>
                <Input
                  id={`name-${medication.id}`}
                  value={medication.data.name}
                  onChange={(e) =>
                    handleFieldChange(medication.id, "name", e.target.value)
                  }
                  disabled={medication.isDisabled}
                />
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <Label htmlFor={`status-${medication.id}`}>Status</Label>
                <Select
                  value={medication.data.medicationStatus}
                  onValueChange={(value) =>
                    handleFieldChange(medication.id, "medicationStatus", value)
                  }
                  disabled={medication.isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Other Fields */}
              {Object.entries(medication.data).map(([field, value]) => {
                if (
                  [
                    "medicationCode",
                    "medicationFrequency",
                    "medicationStatus",
                    "name",
                  ].includes(field)
                )
                  return null;
                return (
                  <TextArea
                    key={`${field}-${medication.id}`}
                    id={`${field}-${medication.id}`}
                    label={
                      field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")
                    }
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(medication.id, field, e.target.value)
                    }
                    placeholder={`Enter ${field.toLowerCase().replace(/([A-Z])/g, " $1")}`}
                    disabled={medication.isDisabled}
                  />
                );
              })}
            </div>
          </Card>
        ))}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={addNewMedication}
            className="inline-flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Another Medication
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(medications.map((med) => med.data))}
              disabled={isLoading}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              {isLoading ? "Submitting..." : buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const testCategories = [
    {
      category: "General Health Screening",
      tests: [
        "Complete Blood Count (CBC)",
        "Basic Metabolic Panel (BMP)",
        "Comprehensive Metabolic Panel (CMP)",
        "Lipid Panel",
        "Urinalysis",
      ],
    },
    {
      category: "Diabetes and Endocrine Function",
      tests: [
        "Fasting Blood Glucose",
        "Hemoglobin A1c (HbA1c)",
        "Thyroid Function Tests (TSH, T3, T4)",
      ],
    },
    {
      category: "Cardiovascular Health",
      tests: ["Electrocardiogram (ECG)", "Troponin Test"],
    },
    {
      category: "Advanced Diagnostics",
      tests: ["Chest X-ray", "MRI Scan", "CT Scan", "Ultrasound"],
    },
    {
      category: "Infectious Diseases",
      tests: [
        "Rapid Strep Test",
        "Influenza Test",
        "HIV Test",
        "Hepatitis Panel",
        "Tuberculosis (TB) Test",
      ],
    },
    {
      category: "Kidney Function",
      tests: ["Serum Creatinine", "Blood Urea Nitrogen (BUN)"],
    },
    {
      category: "Liver Function",
      tests: ["Liver Function Tests (LFTs)"],
    },
    {
      category: "Reproductive Health",
      tests: [
        "Sexually Transmitted Infection (STI) Tests",
        "Pap Smear",
        "Pregnancy Test",
      ],
    },
    {
      category: "Respiratory Health",
      tests: ["Chest X-ray", "Sputum Culture"],
    },
    {
      category: "Gastrointestinal Health",
      tests: ["Stool Culture", "Helicobacter pylori Test"],
    },
    {
      category: "Nutritional Status",
      tests: ["Iron Studies", "Vitamin B12 and Folate Levels"],
    },
    {
      category: "Inflammatory and Autoimmune Conditions",
      tests: ["Erythrocyte Sedimentation Rate (ESR)", "Reactive Protein (CRP)"],
    },
  ];

  const specimenOptions = ["Blood", "Urine", "Stool", "Saliva"];

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

  const doctors = [
    { id: 1, name: "Dr. Alice" },
    { id: 2, name: "Dr. Bob" },
  ];
  const labTechnicians = [
    { id: 1, name: "Tech Anne" },
    { id: 2, name: "Tech Max" },
  ];
  const pharmacies = [
    { id: 1, name: "Pharmacy A" },
    { id: 2, name: "Pharmacy B" },
  ];

  const visitHistory = [
    {
      date: "April 15, 2023",
      doctor: "Dr. Jane Doe",
      purpose: "Annual Checkup",
    },
    {
      date: "June 2, 2023",
      doctor: "Dr. John Smith",
      purpose: "Follow-up Appointment",
    },
    {
      date: "August 20, 2023",
      doctor: "Dr. Sarah Lee",
      purpose: "Flu Vaccination",
    },
    {
      date: "October 10, 2023",
      doctor: "Dr. David Kim",
      purpose: "Routine Blood Work",
    },
    {
      date: "December 5, 2023",
      doctor: "Dr. Emily Chen",
      purpose: "Medication Review",
    },
  ];
  const preCheckTasks = [
    { id: "verify-identity", label: "Verify patient identity" },
    { id: "check-vitals", label: "Check patient vitals" },
    { id: "review-history", label: "Review medical history" },
  ];
  const [selectedLabTest, setSelectedLabTest] = useState("cholesterol");
  const startSmartConsult = () => {
    // Set the selected user for the call
    ///setSelectedUser(patient);
    // Switch to the callsetup tab
    if (activeTab === "summary") {
      setActiveTab("smartconsult");
    } else {
      setActiveTab("summary");
    }
  };
  const handleSendReport = () => {
    console.log("Sending report...");
  };

  const handlePrintReport = () => {
    console.log("Printing report...");
  };

  const PatientInfoSection = () => {
    return (
      <div className="mb-6 rounded-lg bg-gradient-to-r from-[#007664]/5 to-[#75C05B]/5 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Demographics Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#007664]/10 p-3">
                <User className="size-6 text-[#007664]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-lg font-semibold text-[#007664]">
                  Alice Johnson
                </p>
                <p id="patient-id" className="text-sm text-gray-500">
                  ID: PT-001
                </p>
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-600">
                    35 years, Female
                  </span>
                  <div className="ml-2 rounded-full bg-[#75C05B]/10 px-2 py-0.5">
                    <span className="text-xs font-medium text-[#75C05B]">
                      Pregnant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#007664]/10 p-3">
                <Phone className="size-6 text-[#007664]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-lg font-semibold text-[#007664]">
                  +1 (555) 123-4567
                </p>
                <p className="text-sm text-gray-600">
                  <span className="inline-block rounded-full bg-[#B24531]/10 px-2 py-0.5 text-xs text-[#B24531]">
                    Emergency: +1 (555) 987-6543
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-[#007664]/10 p-3">
                <MapPin className="size-6 text-[#007664]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-lg font-semibold text-[#007664]">
                  123 Healthcare Ave
                </p>
                <p className="text-sm text-gray-600">San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [activeTabtrigger, setActiveTabtrigger] = React.useState("summary");
  const handleTabtriggerChange = (tab) => {
    setActiveTabtrigger(tab);
    setIsAddlabtestOpen(false);
    setIsAddmOpen(false);
    setIsAddOpen(false);
    setIsAddDOpen(false);
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
              <div className="grow">
                <CardTitle className="text-white">
                  Alices Johnson Profile
                </CardTitle>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-teal-800 hover:bg-teal-800/10"
                  onClick={handleCallClick}
                >
                  <Video className="size-4 text-teal-800" />
                </Button>
                <Button
                  onClick={handlePrintReport}
                  variant="outline"
                  size="sm"
                  className="bg-white text-[#007664] hover:bg-[#F7F7F7]"
                >
                  <Printer className="mr-2 size-4" />
                  Print Report
                </Button>
                <Button
                  className="flex w-full items-center gap-2 bg-[#007664] text-white hover:bg-[#007664]/80 sm:w-auto"
                  onClick={openrefModal}
                >
                  <Share2 className="size-4" />
                  <span>Refer Patient</span>
                </Button>
              </div>
            </CardHeader>
            {/* Modal for selection */}
            <Modal isOpen={refmodalIsOpen} onRequestClose={closerefModal}>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-[#007664]">
                  Select Referral Type
                </h2>
                <select
                  value={selectedrefOption}
                  onChange={handleSelectrefChange}
                  className="mb-4 w-full rounded-md border border-[#75C05B] p-2"
                >
                  <option value="">Select an option</option>
                  <option value="doctor">Doctor</option>
                  <option value="labTech">Lab Technician</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
                {/* Display the list based on selected option */}
                {selectedrefOption && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium text-[#007664]">
                      {`Select ${
                        selectedrefOption === "doctor"
                          ? "Referring Doctor"
                          : selectedrefOption === "labTech"
                            ? "Lab Technician"
                            : "Pharmacy"
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
                    {selectedrefOption === "doctor" && (
                      <div className="mb-4">
                        <label
                          htmlFor="referralReason"
                          className="mb-2 block font-medium text-[#007664]"
                        >
                          Referral Reason:
                        </label>
                        <input
                          type="text"
                          id="referralReason"
                          name="referralReason"
                          placeholder="Enter the reason for the referral"
                          className="w-full rounded-md border border-[#75C05B] p-2"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  {/* Button to close modal */}
                  <button
                    onClick={closerefModal}
                    className="mr-2 rounded-md bg-[#B24531] px-4 py-2 text-white hover:bg-[#a13d2a]"
                  >
                    Close
                  </button>
                  {/* Submit button */}
                  <button className="rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#00654f]">
                    Submit
                  </button>
                </div>
              </div>
            </Modal>
            <CardContent>
              <PatientInfoSection />
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
                        <div className="mb-4 flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder.svg?height=40&width=40"
                              alt="Alice"
                            />
                            <AvatarFallback>AL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#007664]">Alice</p>
                            <p className="text-sm text-[#75C05B]">
                              35 years, Female, Pregnant
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2 text-lg font-medium text-[#007664]">
                              Vital Signs Over Time
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={vitalSigns}>
                                <XAxis dataKey="date" />
                                <YAxis
                                  yAxisId="left"
                                  label={{
                                    value:
                                      "Heart Rate (bpm) / Blood Pressure (mmHg)",
                                    angle: -90,
                                    position: "insideLeft",
                                  }}
                                />
                                <YAxis
                                  yAxisId="right"
                                  orientation="right"
                                  label={{
                                    value: "Temperature (°F)",
                                    angle: 90,
                                    position: "insideRight",
                                  }}
                                />
                                <Tooltip />
                                <Legend />
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="heartRate"
                                  stroke="#007664"
                                  name="Heart Rate"
                                />
                                <Line
                                  yAxisId="left"
                                  type="monotone"
                                  dataKey="bloodPressure"
                                  stroke="#75C05B"
                                  name="Blood Pressure"
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="temperature"
                                  stroke="#B24531"
                                  name="Temperature"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          {/* Rest of the component remains structurally the same, just updating colors */}
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
                          </div>
                        </div>
                        <div className="mt-6"></div>
                      </CardContent>
                    </Card>
                    {/* Visit History Section */}
                    <div className="mx-auto rounded-lg bg-[#F7F7F7] p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <h2 className="mb-4 text-center text-2xl font-bold text-[#007664]">
                          Visit History
                        </h2>
                        {visitHistory.map((visit, index) => (
                          <div
                            key={index}
                            className="flex w-full items-center border-b border-[#007664] pb-4"
                          >
                            <div className="mr-4">
                              <Calendar className="size-4 text-[#007664]" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-[#007664]">
                                {visit.date}
                              </div>
                              <div className="flex items-center text-sm text-[#B24531]">
                                <User className="mr-2 size-4 text-[#B24531]" />{" "}
                                {visit.doctor}
                              </div>
                              <div className="flex items-center text-sm text-[#B24531]">
                                <Clipboard className="mr-2 size-4 text-[#B24531]" />{" "}
                                {visit.purpose}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="examination" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex flex-col justify-between sm:flex-row">
                    <h3 className="mb-4 text-lg font-semibold text-[#007664] sm:mb-0">
                      Recent Examinations
                    </h3>
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-x-4">
                      <Dialog
                        open={isAddOpen}
                        onOpenChange={(isOpen) =>
                          handleDialogChange(isOpen, "add")
                        }
                      >
                        <DialogTrigger asChild>
                          <Button className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto">
                            <Plus className="size-4" />
                            New Examination
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                          <DialogHeader>
                            <div className="flex items-center justify-center ">
                              <DialogTitle className="text-teal-800">
                                <div className="mb-0 text-center">
                                  <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                    New Examination
                                  </h2>
                                </div>
                              </DialogTitle>
                            </div>
                          </DialogHeader>

                          <NewExamination
                            onTabChange={handleTabtriggerChange}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg  border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Doctor</th>
                          <th className="px-4 py-2 text-left">Reason</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.examinations?.map((examination) => {
                          // Extract the doctor from the participants
                          const doctor = examination.participant?.find((p) =>
                            p.type.includes("Doctor"),
                          );
                          const formattedDate = new Date(examination.created)
                            .toISOString()
                            .split("T")[0];
                          return (
                            <tr key={examination.id}>
                              <td className="px-4 py-2">{formattedDate}</td>
                              <td className="px-4 py-2">
                                {doctor?.individual?.display || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {examination.reasonCode}
                              </td>
                              <td className="px-4 py-2">
                                {examination.status}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => viewConsultDetails(patient)}
                                  >
                                    <Eye className="size-4" />
                                  </Button>
                                  <Dialog
                                    open={isViewConsultOpen}
                                    onOpenChange={(isOpen) =>
                                      handleDialogViewConsult(isOpen)
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
                                        consult={examination}
                                        isOpen={isViewConsultOpen}
                                        onClose={closeViewConsultModal}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Dialog
                                    open={isEditOpen}
                                    onOpenChange={(isOpen) =>
                                      setIsEditOpen(isOpen)
                                    } // Control dialog state
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                      >
                                        <Edit className="size-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Examination
                                        </DialogTitle>
                                      </DialogHeader>

                                      {/* Render the examination form pre-filled for editing */}
                                      <EditExamination
                                        buttonText="Update"
                                        onSubmit={handleEditSubmit} // Handle form submission for edits
                                        examinationData={examination}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-700 hover:text-red-800"
                                    onClick={() => startDelete(examination)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="diagnoses" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Diagnoses History
                    </h3>
                    <Dialog
                      open={isAddDOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogDChange(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#007664] hover:bg-[#007664]/80">
                          <Plus className="size-4" />
                          New Diagnosis
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="mb-0 text-center">
                              <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                New Diagnosis
                              </h2>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        <NewDiagnosisForm
                          onTabChange={handleTabtriggerChange}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Condition</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Doctor</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.diagnoses?.map((diagnosis) => (
                          <tr key={diagnosis.id}>
                            <td className="px-4 py-2">{diagnosis.created}</td>
                            <td className="px-4 py-2">{diagnosis.condition}</td>
                            <td className="px-4 py-2">{diagnosis.status}</td>
                            <td className="px-4 py-2">{diagnosis.doctor}</td>
                            <td className="px-4 py-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() =>
                                    viewDiagnosisDetails(diagnosis)
                                  }
                                >
                                  <Eye className="size-4" />
                                </Button>
                                <Dialog
                                  open={isViewDiagOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialogViewDiagnosis(isOpen)
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
                                      diagnosis={diagnosis}
                                      isOpen={isViewDiagOpen}
                                      onClose={closeViewDiagnosisModal}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Dialog
                                  open={isEditOpen}
                                  onOpenChange={(isOpen) =>
                                    setIsEditOpen(isOpen)
                                  } // Control dialog state
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-[#007664] hover:text-[#007664]/80"
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Diagnosis</DialogTitle>
                                    </DialogHeader>

                                    {/* Render the examination form pre-filled for editing */}
                                    <EditDiagnosisForm
                                      buttonText="Update"
                                      onSubmit={handleEditSubmit} // Handle form submission for edits
                                      diagnosesData={diagnosis}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-700 hover:text-red-800"
                                  onClick={() => startDelete(diagnosis)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="labresult" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Lab Test
                    </h3>

                    <Dialog
                      open={isAddlabtestOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogChangelabtest(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto">
                          <Plus className="size-4" />
                          New Lab Test
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                        <NewLabTestForm onTabChange={handleTabtriggerChange} />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Code</th>
                          <th className="px-4 py-2 text-left">Value</th>
                          <th className="px-4 py-2 text-left">Unit</th>
                          <th className="px-4 py-2 text-left">
                            Performed Date
                          </th>
                          <th className="px-4 py-2 text-left">Ordered By</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.labResults?.map((result) => (
                          <tr key={result.id}>
                            <td className="px-4 py-2">{result.code}</td>
                            <td className="px-4 py-2">{result.value}</td>
                            <td className="px-4 py-2">{result.unit}</td>
                            <td className="px-4 py-2">
                              {result.performedDate}
                            </td>
                            <td className="px-4 py-2">{result.orderedBy}</td>
                            <td>
                              <div className="flex space-x-2">
                                <Dialog
                                  open={isAddlabOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialoglabChange(isOpen, "add")
                                  }
                                >
                                  <DialogTrigger asChild></DialogTrigger>

                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Lab Result</DialogTitle>
                                    </DialogHeader>

                                    <ViewLabTest
                                      result={result}
                                      isOpen={isAddlabOpen}
                                      onClose={closeModal}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => viewlabDetails(patient)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Recent Medications
                    </h3>
                    <Dialog
                      open={isAddmOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogmChange(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#007664] hover:bg-[#007664]/80">
                          <Plus className="size-4" />
                          Add Medication
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="mb-0 text-center">
                              <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                New Medication
                              </h2>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        <NewMedicationForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Medication</th>
                          <th className="px-4 py-2 text-left">Dosage</th>
                          <th className="px-4 py-2 text-left">Frequency</th>
                          <th className="px-4 py-2 text-left">Start Date</th>
                          <th className="px-4 py-2 text-left">End Date</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.medications?.map((medication) => (
                          <tr key={medication.id}>
                            <td className="px-4 py-2">{medication.name}</td>
                            <td className="px-4 py-2">{medication.dosage}</td>
                            <td className="px-4 py-2">
                              {medication.frequency}
                            </td>
                            <td className="px-4 py-2">
                              {medication.startDate}
                            </td>
                            <td className="px-4 py-2">2024-01-11</td>
                            <td>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => viewMedtDetails(medication)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                                <Dialog
                                  open={isViewMedOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialogViewMed(isOpen)
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
                                      medic={medication}
                                      isOpen={isViewMedOpen}
                                      onClose={closeViewMedModal}
                                    />
                                  </DialogContent>
                                </Dialog>

                                <Dialog
                                  open={isEditOpen}
                                  onOpenChange={(isOpen) =>
                                    setIsEditOpen(isOpen)
                                  } // Control dialog state
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-[#007664] hover:text-[#007664]/80"
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Medication</DialogTitle>
                                    </DialogHeader>

                                    {/* Render the examination form pre-filled for editing */}
                                    <MedicationForm
                                      buttonText="Update"
                                      onSubmit={handleEditSubmit} // Handle form submission for edits
                                      medicationData={medication}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-700 hover:text-red-800"
                                  onClick={() => startDelete(medication)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
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
