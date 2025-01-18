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
import { SmartConsultation } from "../../components/shared";
// Charts
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
const consultationSteps = [
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
  const [showConsultationForm, setShowConsultationForm] = useState(false);
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
    // Add logic to update the consultation
    console.log("Updated Consultation:", newConsultation);

    // Close the dialog after submission
    setIsEditOpen(false);
  };
  const startEdit = (consultation) => {
    // Set the state with the consultation data to start editing
    setNewConsultation({
      id: consultation.id,
      patientName: consultation.subject.display,
      status: consultation.status,
      category: consultation.category,
      serviceType: consultation.serviceType,
      occurrenceDateTime: consultation.occurrenceDateTime,
      created: consultation.created,
      description: consultation.description,
      reasonCode: consultation.reasonCode,
      diagnosis: consultation.diagnosis,
      presentedProblem: consultation.presentedProblem,
      summary: consultation.summary,
    });
    // console.log(consultation)

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
  const RenderLabTests = ({ onTabChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [expandedLabTest, setExpandedLabTest] = React.useState(null);
    const handleClick = () => {
      onTabChange("diagnoses"); // Change tab to "consultations"
    };
    const renderLabTestHistory = () => {
      const labTests = [
        {
          id: 1,
          date: "2024-12-28",
          testName: "HbA1c Test",
          testDetails:
            "Measures average blood sugar levels over the past 3 months",
          testResult: "7.2%",
          severity: "Moderate",
          interpretation: "Indicates Type 2 Diabetes",
          followUpNeeded: true,
          specimenType: ["Blood"],
        },
        {
          id: 2,
          date: "2024-12-15",
          testName: "Blood Pressure Monitoring",
          testDetails: "Consistent elevated BP readings over 140/90 mmHg",
          testResult: "145/92 mmHg",
          severity: "Mild to Moderate",
          interpretation: "Suggests Hypertension",
          followUpNeeded: true,
          specimenType: ["N/A"],
        },
        {
          id: 3,
          date: "2024-11-30",
          testName: "Knee X-ray",
          testDetails: "Imaging study to confirm osteoarthritis",
          testResult: "Bilateral knee involvement",
          severity: "Mild",
          interpretation: "Indicates osteoarthritis",
          followUpNeeded: true,
          specimenType: ["N/A"],
        },
      ];

      const toggleLabTest = (id) => {
        setExpandedLabTest(expandedLabTest === id ? null : id);
      };

      const getSeverityColor = (severity) => {
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

      return (
        <div
          className="mx-auto max-w-4xl space-y-8 p-6"
          style={{ width: "65vw" }}
        >
          <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
            <CardHeader className="rounded-t-lg bg-teal-700 text-white">
              <CardTitle className="text-2xl">Lab Test History</CardTitle>
              <CardDescription className="text-gray-200">
                Comprehensive lab test tracking and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {labTests.map((test) => (
                  <div
                    key={test.id}
                    className="overflow-hidden rounded-lg border shadow-sm"
                  >
                    <button
                      onClick={() => toggleLabTest(test.id)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Activity className="text-teal-800" size={20} />
                        <div className="text-left">
                          <div className="font-medium text-teal-800">
                            {test.testName}
                          </div>
                          <div
                            className={`text-sm ${getSeverityColor(test.severity)}`}
                          >
                            {test.severity} Severity
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {new Date(test.date).toLocaleDateString()}
                        </span>
                        {expandedLabTest === test.id ? (
                          <ChevronUp className="text-teal-800" size={20} />
                        ) : (
                          <ChevronDown className="text-teal-800" size={20} />
                        )}
                      </div>
                    </button>

                    {expandedLabTest === test.id && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Test Details
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {test.testDetails}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Test Result
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {test.testResult}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Interpretation
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {test.interpretation}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Specimen Type
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {test.specimenType.map((specimen, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-1 rounded bg-white px-3 py-1 text-sm"
                                >
                                  <AlertCircle
                                    size={14}
                                    className="text-yellow-500"
                                  />
                                  <span className="text-gray-700">
                                    {specimen}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };
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
    const LabTests = () => {
      const handleAIComplete = () => {
        // AI-generated data for lab test form
        const aiData = {
          priority: "Urgent",
          diagnosis:
            "Suspected acute renal dysfunction with metabolic imbalance",
          icdCode: "N17.9",
          additionalNotes:
            "Patient presents with elevated creatinine levels and general fatigue. Requires comprehensive metabolic panel.",
          specimenType: ["Blood", "Urine"],
          collectionDateTime: new Date().toISOString().slice(0, 16),
          specialInstructions:
            "Fasting blood sample required. Please process STAT due to suspected acute condition.",
          collectedBy: "Dr. Who",
        };

        // Update form data with AI-generated data
        setlabtestFormData(aiData);

        // AI-generated test selections for different categories
        const aiTestSelections = [
          {
            id: 1,
            selectedCategory: "Advanced Diagnostics",
            selectedTests: ["Chest X-ray", "Ultrasound"],
            isSubsectionOpen: true,
            isOpen: false,
            priority: "Urgent",
            diagnosis:
              "Suspected acute renal dysfunction with metabolic imbalance",
            icdCode: "N17.9",
            additionalNotes:
              "Patient presents with elevated creatinine levels and general fatigue. Requires comprehensive metabolic panel.",
            specimenType: ["Blood", "Urine"],
            collectionDateTime: new Date().toISOString().slice(0, 16),
            specialInstructions:
              "Fasting blood sample required. Please process STAT due to suspected acute condition.",
            collectedBy: "Dr. Who",
          },
          {
            id: 2,
            selectedCategory: "General Health Screening",
            selectedTests: ["Lipid Panel", "Urinalysis"],
            isSubsectionOpen: true,
            isOpen: false,
            priority: "Urgent",
            diagnosis:
              "Suspected acute renal dysfunction with metabolic imbalance",
            icdCode: "N17.9",
            additionalNotes:
              "Patient presents with elevated creatinine levels and general fatigue. Requires comprehensive metabolic panel.",
            specimenType: ["Blood", "Urine"],
            collectionDateTime: new Date().toISOString().slice(0, 16),
            specialInstructions:
              "Fasting blood sample required. Please process STAT due to suspected acute condition.",
            collectedBy: "Dr. Who",
          },
        ];

        // Update test selections with AI-generated data
        setTestSelections(aiTestSelections);

        // Enable AI mode and disable editing
        setIsAIEnabled(true);
        setIsEditing(false);
      };

      const handleRegenerateAI = () => {
        handleAIComplete(); // Rerun AI completion with potentially different results
      };

      const toggleEditing = () => {
        setIsEditing(!isEditing);
      };

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
          if (name === "specimenType") {
            setlabtestFormData((prev) => ({
              ...prev,
              specimenType: checked
                ? [...prev.specimenType, value]
                : prev.specimenType.filter((type) => type !== value),
            }));
          }
        } else {
          setlabtestFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      };

      return (
        <div
          className="mx-auto max-w-4xl space-y-8 p-2"
          style={{ width: "65vw" }}
        >
          <div className=" bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 rounded-t-lg bg-teal-700 text-center text-white">
                <h1 className="rounded-t-lg bg-teal-700 text-2xl text-white">
                  Laboratory Test Request
                </h1>
                <p className="text-white ">
                  Select the required diagnostic tests for the patient
                </p>
                <div className="flex justify-end">
                  {!isAIEnabled ? (
                    <Button
                      onClick={handleAIComplete}
                      className="inline-flex items-end gap-2 rounded-md bg-gradient-to-r from-[#007664] to-[#75C05B] px-6 py-2 text-white transition-colors duration-200 hover:from-[#006054] hover:to-[#63a34d]"
                    >
                      <Lightbulb className="size-5" />
                      Complete with AI
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleRegenerateAI}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                      >
                        <RefreshCw className="size-5" />
                        Regenerate
                      </Button>
                      <Button
                        onClick={toggleEditing}
                        className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                      >
                        <Edit className="size-5" />
                        {isEditing ? "" : "Edit Manually"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="rounded-lg bg-white p-8 shadow-lg"
              >
                {/* Lab Test Information Section */}
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-6 border-b pb-2 text-2xl font-semibold text-gray-800">
                      Lab Test Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <div className="flex space-x-4">
                          {["Routine", "Urgent", "STAT"].map((priority) => (
                            <label
                              key={priority}
                              className="inline-flex items-center"
                            >
                              <input
                                type="radio"
                                name="priority"
                                value={priority}
                                checked={labtestFormData.priority === priority}
                                onChange={handleChange}
                                disabled={!isEditing && isAIEnabled}
                                className="form-radio text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">
                                {priority}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Selection Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Test(s) Requested
                    </h3>
                    <div className="w-full space-y-4">
                      {testSelections.map((selection) => (
                        <div
                          key={selection.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="relative">
                            <div
                              className={`rounded-lg border bg-white p-3 ${!isAIEnabled || isEditing ? "cursor-pointer" : ""} flex items-center justify-between`}
                              onClick={() => toggleDropdown(selection.id)}
                            >
                              <span>
                                {selection.selectedCategory ||
                                  "Select Category"}
                              </span>
                              {(!isAIEnabled || isEditing) &&
                                (selection.isOpen ? (
                                  <ChevronUp className="size-5" />
                                ) : (
                                  <ChevronDown className="size-5" />
                                ))}
                            </div>

                            {selection.isOpen &&
                              (!isAIEnabled || isEditing) && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                                  {testCategories.map((cat) => (
                                    <div
                                      key={cat.category}
                                      className="cursor-pointer p-3 hover:bg-gray-100"
                                      onClick={() =>
                                        handleCategorySelect(
                                          selection.id,
                                          cat.category,
                                        )
                                      }
                                    >
                                      {cat.category}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          {selection.selectedCategory &&
                            selection.isSubsectionOpen && (
                              <div className="mt-4 rounded-lg border p-4">
                                <h3 className="mb-3 font-medium">
                                  Select Tests:
                                </h3>
                                {testCategories
                                  .find(
                                    (cat) =>
                                      cat.category ===
                                      selection.selectedCategory,
                                  )
                                  ?.tests.map((test) => (
                                    <div
                                      key={test}
                                      className="mb-2 flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`${selection.id}-${test}`}
                                        checked={selection.selectedTests.includes(
                                          test,
                                        )}
                                        onChange={() =>
                                          handleTestSelect(selection.id, test)
                                        }
                                        disabled={isAIEnabled && !isEditing}
                                        className="mr-2"
                                      />
                                      <label
                                        htmlFor={`${selection.id}-${test}`}
                                      >
                                        {test}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}

                      {hasSelectedTests && (!isAIEnabled || isEditing) && (
                        <button
                          onClick={addNewTestSelection}
                          className="flex w-full items-center justify-center rounded-lg border bg-blue-50 p-3 transition-colors hover:bg-blue-100"
                        >
                          <Plus className="mr-2 size-5" />
                          Add Another Test
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Clinical Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Notes
                      </label>

                      <textarea
                        name="additionalNotes"
                        value={labtestFormData.additionalNotes}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Specimen Collection Section */}
                  <div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Collection Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            name="collectionDateTime"
                            value={labtestFormData.collectionDateTime}
                            onChange={handleChange}
                            disabled="disabled"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Collected By
                          </label>
                          <input
                            type="text"
                            name="collectedBy"
                            disabled="disabled"
                            value="Dr. Who"
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8"></div>
              </form>
            </div>
          </div>
        </div>
      );
    };
    const pages = [renderLabTestHistory, LabTests];

    const [isAddDOpen, setIsAddDOpen] = useState(false);

    const handleDialogDChange = (isOpen, action) => {
      if (action === "add") {
        setIsAddDOpen(isOpen);
      }
    };

    const handleSubmit = () => {
      // Add your submit logic here
      console.log("Submit button clicked");
      // setIsAddDOpen(false); // Optionally close the dialog after submit
    };

    return (
      <>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6">
          {/* Page number circles at the top */}
          <div className="mb-8 flex justify-center gap-2">
            {Array.from({ length: pages.length }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
              flex h-10 w-10 items-center justify-center rounded-full
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
          <div className="mb-8 flex-1 overflow-auto">
            {" "}
            {/* This makes the content take the available space */}
            {pages[currentPage - 1]()}
          </div>

          {/* Navigation footer */}
          <div className="border-t bg-white shadow-lg">
            <div className="mx-auto max-w-6xl px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
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
                      onClick={handleClick}
                      className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 hover:bg-teal-600"
                    >
                      Submit
                      <ChevronRight className="ml-2 size-5" />
                    </button>
                  </div>
                ) : currentPage === 3 ? (
                  <button
                    onClick={() => {
                      // Submit logic here
                    }}
                    className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors  duration-200 hover:bg-[#007664]/80"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(pages.length, prev + 1))
                    }
                    className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors  duration-200 hover:bg-[#007664]/80"
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
  };

  const Rendermedication = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [expandedLabTest, setExpandedLabTest] = React.useState(null);
    const [medformData, setmedFormData] = useState({
      medicationId: "",
      medicationName: "",
      dosage: "",
      treatmentDuration: "",
      followUpProtocol: "",
      additionalNotes: "",
    });
    const [expandedMedication, setExpandedMedication] = useState(null);
    const [interactionAlert, setInteractionAlert] = useState(null);
    const [isGeneratingId, setIsGeneratingId] = useState(true);
    const [isAICompleted, setIsAICompleted] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
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

    const RenderMedicationHistory = () => {
      const medications = [
        {
          id: 1,
          medicationDescription: "Anti-hypertensive medication",
          medicationNote: "Take with food",
          medicationCode: "MED123",
          medicationStatus: "active",
          medicationStartDate: "2024-12-01",
          medicationStartTime: "08:00 AM",
          medicationEndDate: "2025-12-01",
          medicationFrequency: { type: "daily", value: 1 },
          dosage: "50mg",
          name: "Amlodipine",
          administrationRoute: "Oral",
          treatmentDuration: "12 months",
          sideEffects: "Dizziness, headache",
          contraindications: "Severe hypotension",
          precautions: "Use cautiously in renal impairment",
          interactions: "N/A",
          specialInstructions: "Avoid grapefruit",
          followUpProtocol: "Visit doctor every 3 months",
        },
        {
          id: 2,
          medicationDescription: "Anti-hypertensive medication",
          medicationNote: "Take with food",
          medicationCode: "MED123",
          medicationStatus: "active",
          medicationStartDate: "2024-12-01",
          medicationStartTime: "08:00 AM",
          medicationEndDate: "2025-12-01",
          medicationFrequency: { type: "daily", value: 1 },
          dosage: "50mg",
          name: "Amlodipine",
          administrationRoute: "Oral",
          treatmentDuration: "12 months",
          sideEffects: "Dizziness, headache",
          contraindications: "Severe hypotension",
          precautions: "Use cautiously in renal impairment",
          interactions: "N/A",
          specialInstructions: "Avoid grapefruit",
          followUpProtocol: "Visit doctor every 3 months",
        },
      ];

      const toggleMedication = (id) => {
        setExpandedMedication(expandedMedication === id ? null : id);
      };

      const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
          case "active":
            return "text-green-600";
          case "inactive":
            return "text-red-600";
          default:
            return "text-gray-600";
        }
      };

      return (
        <div
          className="mx-auto max-w-4xl space-y-8 p-6"
          style={{ width: "65vw" }}
        >
          <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
            <CardHeader className="rounded-t-lg bg-teal-700 text-white">
              <CardTitle className="text-2xl">Medication History</CardTitle>
              <CardDescription className="text-gray-200">
                Comprehensive medication tracking and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="overflow-hidden rounded-lg border shadow-sm"
                  >
                    <button
                      onClick={() => toggleMedication(medication.id)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Activity className="text-teal-800" size={20} />
                        <div className="text-left">
                          <div className="font-medium text-teal-800">
                            {medication.name}
                          </div>
                          <div
                            className={`text-sm ${getStatusColor(medication.medicationStatus)}`}
                          >
                            {medication.medicationStatus} Status
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {new Date(
                            medication.medicationStartDate,
                          ).toLocaleDateString()}
                        </span>
                        {expandedMedication === medication.id ? (
                          <ChevronUp className="text-teal-800" size={20} />
                        ) : (
                          <ChevronDown className="text-teal-800" size={20} />
                        )}
                      </div>
                    </button>

                    {expandedMedication === medication.id && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid gap-4">
                          {/* Medication Description */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Description
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.medicationDescription}
                            </p>
                          </div>

                          {/* Medication Dosage */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Dosage
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.dosage}
                            </p>
                          </div>

                          {/* Medication Frequency */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Frequency
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.medicationFrequency.type}{" "}
                              {medication.medicationFrequency.value} times daily
                            </p>
                          </div>

                          {/* Treatment Duration */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Treatment Duration
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.treatmentDuration}
                            </p>
                          </div>

                          {/* Follow-Up Protocol */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Follow-Up Protocol
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.followUpProtocol}
                            </p>
                          </div>

                          {/* Additional Notes */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Additional Notes
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.medicationNote}
                            </p>
                          </div>

                          {/* Contraindications */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Contraindications
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.contraindications}
                            </p>
                          </div>

                          {/* Side Effects */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Side Effects
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.sideEffects}
                            </p>
                          </div>

                          {/* Drug Interactions */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Drug Interactions
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.interactions}
                            </p>
                          </div>

                          {/* Special Instructions */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Special Instructions
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.specialInstructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    const MedicationForm = () => {
      // Sample data for AI completion

      const sampleData = {
        medicationName: "Amoxicillin",
        dosage: "500mg twice daily",
        treatmentDuration: "7 days",
        followUpProtocol:
          "Follow-up visit after 7 days. Monitor for signs of allergic reaction. Contact immediately if rash or difficulty breathing occurs.",
        additionalNotes:
          "Take with food to minimize stomach upset. Complete full course of antibiotics even if symptoms improve.",
      };

      const handleAIComplete = () => {
        setIsAICompleted(true);
        setIsEditable(false);
        setmedFormData((prev) => ({
          ...prev,
          ...sampleData,
        }));
      };

      const handleEdit = () => {
        setIsEditable(true);
        setIsAICompleted(false);
      };

      const drugInteractions = {
        warfarin: ["aspirin", "ibuprofen", "naproxen"],
        metformin: ["furosemide", "nifedipine"],
        lisinopril: ["spironolactone", "potassium supplements"],
        amoxicillin: ["probenecid", "methotrexate"],
      };
      const generateMedicationId = () => {
        setIsGeneratingId(true);
        // Generate a random ID with prefix MED followed by timestamp and random number
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        const newId = `MED-${timestamp}-${random}`;

        setmedFormData((prev) => ({
          ...prev,
          medicationId: newId,
        }));
        setIsGeneratingId(false);
      };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setmedFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setInteractionAlert(null);
      };

      const checkInteractions = () => {
        const medName = medformData.medicationName.toLowerCase();

        if (drugInteractions[medName]) {
          setInteractionAlert({
            type: "warning",
            title: "Potential Drug Interactions Detected",
            message: `${medformData.medicationName} may interact with: ${drugInteractions[medName].join(", ")}`,
          });
        } else {
          setInteractionAlert({
            type: "success",
            title: "No Known Drug Interactions",
            message: "No known drug interactions found in database.",
          });
        }
      };

      return (
        <div
          className="mx-auto max-w-4xl space-y-8 p-6"
          style={{ width: "65vw" }}
        >
          <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
            <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-teal-700 text-white">
              <CardTitle className="text-2xl">New Medication Entry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-end space-x-2">
                {!isAICompleted ? (
                  <button
                    onClick={handleAIComplete}
                    className="flex justify-end bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d]"
                  >
                    <Lightbulb className="size-5" />
                    <span>Complete with AI</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 rounded-md bg-teal-100 px-3 py-2 text-teal-800 transition-colors hover:bg-teal-200"
                    >
                      <Edit2 size={16} />
                      <span>Enable Editing</span>
                    </button>
                  </div>
                )}
              </div>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-teal-700">
                    Medication ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={medformData.medicationId}
                      className="w-full rounded-md border bg-gray-50 p-2"
                      disabled="disbled"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-teal-700">
                    Medication Name
                    {!isEditable && (
                      <Lock className="ml-2 size-4 text-gray-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="medicationName"
                    value={medformData.medicationName}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border p-2 ${isEditable ? "focus:border-transparent focus:ring-2 focus:ring-teal-500" : "bg-gray-50"}`}
                    required
                    disabled={!isEditable}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-teal-700">
                      Dosage
                      {!isEditable && (
                        <Lock className="ml-2 size-4 text-gray-400" />
                      )}
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={medformData.dosage}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border p-2 ${isEditable ? "focus:border-transparent focus:ring-2 focus:ring-teal-500" : "bg-gray-50"}`}
                      required
                      disabled={!isEditable}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-teal-700">
                      Treatment Duration
                      {!isEditable && (
                        <Lock className="ml-2 size-4 text-gray-400" />
                      )}
                    </label>
                    <input
                      type="text"
                      name="treatmentDuration"
                      value={medformData.treatmentDuration}
                      onChange={handleInputChange}
                      className={`w-full rounded-md border p-2 ${isEditable ? "focus:border-transparent focus:ring-2 focus:ring-teal-500" : "bg-gray-50"}`}
                      required
                      disabled={!isEditable}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className=" flex items-center text-sm font-medium text-teal-700">
                    Follow-up Protocol
                    {!isEditable && (
                      <Lock className="ml-2 size-4 text-gray-400" />
                    )}
                  </label>
                  <textarea
                    name="followUpProtocol"
                    value={medformData.followUpProtocol}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border p-2 ${isEditable ? "focus:border-transparent focus:ring-2 focus:ring-teal-500" : "bg-gray-50"}`}
                    rows="3"
                    disabled={!isEditable}
                  />
                </div>

                <div className="space-y-2">
                  <label className=" flex items-center text-sm font-medium text-teal-700">
                    Additional Notes
                    {!isEditable && (
                      <Lock className="ml-2 size-4 text-gray-400" />
                    )}
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={medformData.additionalNotes}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border p-2 ${isEditable ? "focus:border-transparent focus:ring-2 focus:ring-teal-500" : "bg-gray-50"}`}
                    rows="3"
                    disabled={!isEditable}
                  />
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={checkInteractions}
                    className="w-full rounded-md bg-teal-600 p-2 text-white transition-colors hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    Check Drug Interactions
                  </button>

                  {interactionAlert && (
                    <Alert
                      className={
                        interactionAlert.type === "warning"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-green-200 bg-green-50"
                      }
                    >
                      {interactionAlert.type === "warning" ? (
                        <AlertCircle className="size-4 text-yellow-600" />
                      ) : (
                        <Check className="size-4 text-green-600" />
                      )}
                      <AlertTitle>{interactionAlert.title}</AlertTitle>
                      <AlertDescription>
                        {interactionAlert.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    };

    const pages = [RenderMedicationHistory, MedicationForm];

    const [isAddDOpen, setIsAddDOpen] = useState(false);

    const handleDialogDChange = (isOpen, action) => {
      if (action === "add") {
        setIsAddDOpen(isOpen);
      }
    };

    const handleSubmit = () => {
      // Add your submit logic here
      console.log("Submit button clicked");
      // setIsAddDOpen(false); // Optionally close the dialog after submit
    };

    return (
      <>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6">
          {/* Page number circles at the top */}
          <div className="mb-8 flex justify-center gap-2">
            {Array.from({ length: pages.length }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
              flex h-10 w-10 items-center justify-center rounded-full
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
          <div className="mb-8 flex-1 overflow-auto">
            {" "}
            {/* This makes the content take the available space */}
            {pages[currentPage - 1]()}
          </div>

          {/* Navigation footer */}
          <div className="border-t bg-white shadow-lg">
            <div className="mx-auto max-w-6xl px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
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
                      onClick={handleSubmit}
                      className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 hover:bg-teal-600"
                    >
                      Submit
                    </button>
                    <Dialog
                      open={isAddDOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogDChange(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="bg-[#007664] hover:bg-[#007664]/80"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="mb-0 text-center">
                              <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                New Diagnosis & Prognosis
                              </h2>
                            </div>
                          </DialogTitle>
                        </DialogHeader>

                        <NewDiagnosisForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : currentPage === 3 ? (
                  <button
                    onClick={() => {
                      // Submit logic here
                    }}
                    className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors  duration-200 hover:bg-[#007664]/80"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(pages.length, prev + 1))
                    }
                    className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors  duration-200 hover:bg-[#007664]/80"
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
  };

  const NewDiagnosisForm = ({ onTabChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [expandedDiagnosis, setExpandedDiagnosis] = React.useState(null);
    const handleClick = () => {
      onTabChange("medications"); // Change tab to "consultations"
    };
    const [formDatadiagnosis, setFormDatadiagnosis] = useState({
      diagnosisName: "",
      icdCode: "",
      severity: "",
      category: "",
      otherCategory: "",
      priority: "",
      chronicityStatus: "",
      progressionStage: "",
      symptoms: "",
      vitalSigns: "",
      labResults: "",
      differentialDiagnosis: "",
      treatment: "",
      precautions: "",
      contraindications: "",
      expectedOutcomes: "",
      followUpProtocol: "",
      evidenceBase: "",
    });

    const [formDataprog, setFormDataprog] = useState({
      diagnosisId: "",
      expectedOutcome: "",
      otherOutcome: "",
      timeframe: "",
      survivalRate: "",
      riskLevel: "",
      recoveryPotential: "",
      complications: "",
      longTermEffects: "",
      lifestyleModifications: "",
      monitoringRequirements: "",
      followUpSchedule: "",
      additionalNotes: "",
    });
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
                    label:
                      "Have you planned the timing of your next pregnancy?",
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

    const MultiSectionSymptomsForm = (selectedSymptoms) => {
      const handleInputChange = (mainSection, subsection, field, value) => {
        setFormData((prev) => ({
          ...prev,
          [mainSection]: {
            ...prev[mainSection],
            [subsection]: {
              ...prev[mainSection]?.[subsection],
              [field]: value,
            },
          },
        }));
      };

      const renderField = (field, mainSection, subsectionKey) => {
        const value =
          formData[mainSection]?.[subsectionKey]?.[field.name] || "";

        const baseInputStyles =
          "w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white";

        switch (field.type) {
          case "text":
          case "number":
            return (
              <input
                type={field.type}
                className={baseInputStyles}
                value={value}
                onChange={(e) =>
                  handleInputChange(
                    mainSection,
                    subsectionKey,
                    field.name,
                    e.target.value,
                  )
                }
                min={field.type === "number" ? "0" : undefined}
              />
            );
          case "radio":
            return (
              <div className={baseInputStyles}>
                {field.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-2 ${
                      value === option
                        ? "font-bold text-teal-800"
                        : "text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option}
                      checked={value === option}
                      onChange={(e) => {
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          field.name,
                          e.target.value,
                        );
                        if (field.requiresSpecify && option === "Yes") {
                          handleInputChange(
                            mainSection,
                            subsectionKey,
                            `${field.name}_specify`,
                            "",
                          ); // Initialize specify field
                        } else if (field.requiresSpecify) {
                          handleInputChange(
                            mainSection,
                            subsectionKey,
                            `${field.name}_specify`,
                            null,
                          ); // Clear specify field
                        }
                      }}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`size-4 rounded-full border-2 ${
                        value === option
                          ? "border-teal-800 bg-teal-800"
                          : "border-gray-400"
                      }`}
                    ></div>
                    <span>{option}</span>
                  </label>
                ))}

                {/* Conditionally render the "If Yes, specify" field */}
                {field.requiresSpecify && value === "Yes" && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-700">
                      If Yes, specify
                    </label>
                    <input
                      type="text"
                      onChange={(e) =>
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          `${field.name}_specify`,
                          e.target.value,
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-teal-800"
                    />
                  </div>
                )}
              </div>
            );

          case "select":
            const showConditions =
              value &&
              value !== "" &&
              field.conditions &&
              field.conditions[value];

            return (
              <div className={baseInputStyles}>
                <label className="mb-2 block">{field.label}</label>
                <select
                  className={baseInputStyles}
                  value={value || ""}
                  onChange={(e) =>
                    handleInputChange(
                      mainSection,
                      subsectionKey,
                      field.name,
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Only render the condition fields if the selected value matches a condition */}
                {showConditions && field.conditions[value] && (
                  <div className="mt-4">
                    {field.conditions[value].type === "select" ? (
                      <div>
                        <label className="mb-2 block">
                          {field.conditions[value].label}
                        </label>
                        <select
                          className="mt-1 w-full rounded border border-gray-300 p-2"
                          value={conditionValue || ""}
                          onChange={(e) =>
                            handleInputChange(
                              mainSection,
                              subsectionKey,
                              `${field.name}_details`,
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select...</option>
                          {field.conditions[value].options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : field.conditions[value].type === "text" ? (
                      <div>
                        <label className="mb-2 block">
                          {field.conditions[value].label}
                        </label>
                        <input
                          type="text"
                          value={conditionValue || ""}
                          onChange={(e) =>
                            handleInputChange(
                              mainSection,
                              subsectionKey,
                              `${field.name}_details`,
                              e.target.value,
                            )
                          }
                          className="mt-1 w-full rounded border border-gray-300 p-2"
                          placeholder="Please specify"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );

          case "multiselect":
            const selectedValues = Array.isArray(value) ? value : [];
            return (
              <div className="space-y-2">
                {field.options.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox rounded border-[#007664] text-[#75C05B] focus:ring-[#53FDFD]"
                      checked={selectedValues.includes(option)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option]
                          : selectedValues.filter((v) => v !== option);
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          field.name,
                          newValues,
                        );
                      }}
                    />
                    <span className="ml-2 text-[#007664]">{option}</span>
                  </label>
                ))}

                {/* Show the "Specify" text box if "Others" is selected */}
                {selectedValues.includes("Others") && (
                  <div className="mt-2">
                    <label className="mb-1 block text-[#007664]">
                      If Others, specify:
                    </label>
                    <input
                      type="text"
                      value={field.specifyValue || ""} // Use a state or value for "Others" input
                      onChange={(e) =>
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          `${field.name}_specify`,
                          e.target.value,
                        )
                      }
                      className="w-full rounded border-2 border-[#75C05B] p-2 text-[#007664] focus:ring-[#007664] focus:ring-offset-2"
                      placeholder="Please specify..."
                    />
                  </div>
                )}
              </div>
            );

          default:
            return null;
        }
      };

      const renderSubsection = (mainSection, subsectionKey, subsection) => (
        <div
          className="rounded-lg border border-[#75C05B] bg-white transition-all duration-200 hover:border-[#007664]"
          onMouseEnter={() => setActiveSection(subsectionKey)}
          onMouseLeave={() => setActiveSection(null)}
        >
          <div className="space-y-4 p-4">
            {subsection.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-[#007664]">
                  {field.label}
                </label>
                {renderField(field, mainSection, subsectionKey)}
              </div>
            ))}
          </div>
        </div>
      );

      const filtered = Object.keys(sicknessSections || {}).reduce(
        (acc, sectionKey) => {
          const section = sicknessSections[sectionKey];

          if (!section.subsections || typeof section.subsections !== "object") {
            return acc;
          }

          const filteredSubsections = Object.keys(section.subsections).reduce(
            (subAcc, subsectionKey) => {
              const subsection = section.subsections[subsectionKey];

              const isSelected =
                selectedComplaints.section === section.title &&
                selectedComplaints.subsection === subsection.title;

              console.log(isSelected);
              if (isSelected) {
                subAcc[subsectionKey] = subsection;
              }
              return subAcc;
            },
            {},
          );

          if (Object.keys(filteredSubsections).length > 0) {
            acc[sectionKey] = {
              title: section.title,
              subsections: filteredSubsections,
            };
          }

          return acc;
        },
        {},
      );
      console.log(filteredComplaints);
      //setFilteredComplaints(filtered);
      // Add dependencies that should trigger a re-filter

      return (
        <div className="mx-auto min-h-screen max-w-7xl bg-[#F7F7F7] p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-[#007664]">
              Medical Assessment Form
            </h1>
            <p className="text-[#B24531]">
              Please complete all relevant sections
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(filteredComplaints).map(
              ([mainSectionKey, mainSection]) => (
                <div
                  key={mainSectionKey}
                  className="overflow-hidden rounded-xl border border-[#75C05B] bg-white"
                >
                  {/* ... existing symptoms section rendering ... */}
                </div>
              ),
            )}
          </div>

          {renderDiagnosisSection()}
          {renderPrognosisSection()}

          <div className="sticky bottom-0 mt-8 border-t border-[#75C05B] bg-[#F7F7F7] py-4">
            {/* ... existing bottom section ... */}
          </div>
        </div>
      );
    };
    const renderDiagnosisHistory = () => {
      // Updated sample data structure focused on diagnosis and prognosis
      const diagnoses = [
        {
          id: 1,
          date: "2024-12-28",
          condition: "Type 2 Diabetes",
          diagnosisDetails:
            "Initial diagnosis based on HbA1c of 7.2% and fasting glucose levels",
          prognosis:
            "Good prognosis with lifestyle modifications and medication adherence",
          severity: "Moderate",
          treatmentPlan:
            "Metformin 500mg twice daily, dietary changes, regular exercise",
          expectedOutcome: "Blood sugar stabilization within 3-6 months",
          followUpNeeded: true,
          riskFactors: ["Family history", "Sedentary lifestyle", "Obesity"],
        },
        {
          id: 2,
          date: "2024-12-15",
          condition: "Hypertension",
          diagnosisDetails: "Consistent elevated BP readings over 140/90 mmHg",
          prognosis: "Favorable with medication and lifestyle changes",
          severity: "Mild to Moderate",
          treatmentPlan: "Lisinopril 10mg daily, reduced sodium intake",
          expectedOutcome: "BP control within 2-3 months",
          followUpNeeded: true,
          riskFactors: ["Age", "Family history", "High sodium diet"],
        },
        {
          id: 3,
          date: "2024-11-30",
          condition: "Osteoarthritis",
          diagnosisDetails: "Bilateral knee involvement confirmed by X-ray",
          prognosis: "Chronic condition requiring ongoing management",
          severity: "Mild",
          treatmentPlan: "Physical therapy, NSAIDs as needed",
          expectedOutcome: "Pain management and maintained mobility",
          followUpNeeded: true,
          riskFactors: ["Age", "Previous joint injury", "Obesity"],
        },
      ];

      const toggleDiagnosis = (id) => {
        setExpandedDiagnosis(expandedDiagnosis === id ? null : id);
      };

      const getSeverityColor = (severity) => {
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

      return (
        <div
          className="mx-auto max-w-4xl space-y-8 p-6  "
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
                {diagnoses.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className="overflow-hidden rounded-lg border shadow-sm"
                  >
                    <button
                      onClick={() => toggleDiagnosis(diagnosis.id)}
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
                          {new Date(diagnosis.date).toLocaleDateString()}
                        </span>
                        {expandedDiagnosis === diagnosis.id ? (
                          <ChevronUp className="text-teal-800" size={20} />
                        ) : (
                          <ChevronDown className="text-teal-800" size={20} />
                        )}
                      </div>
                    </button>

                    {expandedDiagnosis === diagnosis.id && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Diagnosis Details
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {diagnosis.diagnosisDetails}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Prognosis
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {diagnosis.prognosis}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Treatment Plan
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {diagnosis.treatmentPlan}
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
                              Risk Factors
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {diagnosis.riskFactors.map((factor, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-1 rounded bg-white px-3 py-1 text-sm"
                                >
                                  <AlertCircle
                                    size={14}
                                    className="text-yellow-500"
                                  />
                                  <span className="text-gray-700">
                                    {factor}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    const [formdiagnosisData, setFormdiagnosisData] = useState({
      severity: "",
      category: "",
      priority: "",
      chronicityStatus: "",
      primaryDiagnosis: "",
      secondaryDiagnoses: "",
      differentialDiagnoses: "",
      status: "",
      verificationStatus: "",
      symptoms: "",
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [showEditdiagnosisButton, setShowEditdiagnosisButton] =
      useState(false);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);
    const [primaryCategory, setPrimaryCategory] = useState("");
    const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
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
          verificationStatus: "confirmed",
          symptoms: "Chest pain, shortness of breath, dizziness",
        };
        setFormdiagnosisData(demoData);
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
        setFormdiagnosisData((prevData) => ({
          ...prevData,
          [field]: value,
        }));
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

      const updateAdditionalDiagnosis = (index, field, value) => {
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

      const handlePrimaryCategoryChange = (category) => {
        setPrimaryCategory(category);
        setPrimaryDiagnosis("");
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
        <div
          className="mx-auto max-w-4xl space-y-8 p-6  "
          style={{ width: "65vw" }}
        >
          <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
            <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
              <CardTitle className="text-center text-2xl font-bold">
                Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="mt-2 flex justify-end space-x-4">
                  {!showEditdiagnosisButton && (
                    <Button
                      onClick={handleAIComplete}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-[#007664]">
                      Severity Level
                    </Label>
                    <select
                      name="severity"
                      value={formdiagnosisData.severity}
                      disabled={isDisabled}
                      onChange={(e) =>
                        handleInputChange("severity", e.target.value)
                      }
                      className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    >
                      <option value="">Select severity</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Diagnosis Category */}
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-[#007664]">
                      Diagnosis Category
                    </Label>
                    <select
                      name="category"
                      value={formdiagnosisData.category}
                      disabled={isDisabled}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    >
                      <option value="">Select category</option>
                      <option value="cardiovascular">Cardiovascular</option>
                      <option value="respiratory">Respiratory</option>
                      <option value="neurological">Neurological</option>
                      <option value="gastrointestinal">Gastrointestinal</option>
                      <option value="musculoskeletal">Musculoskeletal</option>
                      <option value="endocrine">Endocrine</option>
                      <option value="psychiatric">Psychiatric</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Priority Level */}
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-[#007664]">
                      Priority Level
                    </Label>
                    <select
                      name="priority"
                      value={formdiagnosisData.priority}
                      disabled={isDisabled}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                      className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    >
                      <option value="">Select priority</option>
                      <option value="emergency">Emergency</option>
                      <option value="urgent">Urgent</option>
                      <option value="semi-urgent">Semi-Urgent</option>
                      <option value="non-urgent">Non-Urgent</option>
                    </select>
                  </div>

                  {/* Chronicity Status */}
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-[#007664]">
                      Chronicity Status
                    </Label>
                    <select
                      name="chronicityStatus"
                      value={formdiagnosisData.chronicityStatus}
                      disabled={isDisabled}
                      onChange={(e) =>
                        handleInputChange("chronicityStatus", e.target.value)
                      }
                      className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    >
                      <option value="">Select status</option>
                      <option value="acute">Acute</option>
                      <option value="subacute">Subacute</option>
                      <option value="chronic">Chronic</option>
                      <option value="recurrent">Recurrent</option>
                    </select>
                  </div>
                </div>
                {/* Primary Diagnosis */}

                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Primary Diagnosis
                  </label>
                  <div className="space-y-2">
                    <select
                      value={primaryCategory}
                      onChange={(e) =>
                        handlePrimaryCategoryChange(e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select Category</option>
                      {Object.entries(icdCategories).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>

                    {primaryCategory && (
                      <select
                        value={primaryDiagnosis}
                        onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="">Select Specific Diagnosis</option>
                        {icdSubcategories[primaryCategory]?.map(
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
                </div>

                {/* Additional Diagnoses Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
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
                    <div
                      key={index}
                      className="space-y-2 rounded-md border p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
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
                          updateAdditionalDiagnosis(
                            index,
                            "type",
                            e.target.value,
                          )
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

                {/* Diagnosis Status (FHIR: Condition.status) */}
                <div className="space-y-2">
                  <select
                    name="status"
                    value={formdiagnosisData.status}
                    className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    onChange={(e) =>
                      handleInputChange(
                        "diagnosis",
                        "status",
                        "status",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                    <option value="remission">Remission</option>
                    <option value="inactive">Inactive</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <select
                    name="verificationStatus"
                    value={formdiagnosisData.verificationStatus}
                    className="w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                    onChange={(e) =>
                      handleInputChange(
                        "diagnosis",
                        "verificationStatus",
                        "verificationStatus",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">Select verification status</option>
                    <option value="unconfirmed">Unconfirmed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="differential">Differential</option>
                    <option value="refuted">Refuted</option>
                    <option value="entered-in-error">Entered in Error</option>
                  </select>
                </div>

                {/* Key Symptoms and Clinical Markers */}
                <div className="space-y-2">
                  <label
                    htmlFor="symptoms"
                    className="block text-sm font-medium text-[#007664]"
                  >
                    Key Symptoms and Clinical Markers
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formdiagnosisData.symptoms}
                    onChange={handleInputChange}
                    placeholder="List symptoms with frequency and clinical significance"
                    className="h-24 w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                  />
                </div>

                <div className="flex justify-end space-x-4"></div>
              </form>
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

    const [showEditPrognosisButton, setShowEditPrognosisButton] =
      useState(false); // Initially false

    const renderPrognosisForm = () => {
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDataprog((prev) => ({
          ...prev,
          [name]: value,
        }));
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

        setFormDataprog(aiData);
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
        <div
          className="mx-auto max-w-4xl space-y-8 p-6  "
          style={{ width: "65vw" }}
        >
          <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
            <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
              <CardTitle className="text-center text-2xl font-bold">
                Prognosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="mt-2 grid grid-cols-1 gap-4">
                  {/* AI Complete Button */}
                  {!showEditPrognosisButton && (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAIComplete}
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
                    <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                    <select
                      id="expectedOutcome"
                      name="expectedOutcome"
                      value={formDataprog.expectedOutcome}
                      onChange={handleInputChange}
                      disabled={isDisabled}
                      className="w-full rounded border border-gray-300 p-2"
                    >
                      <option value="">Select expected outcome</option>
                      <option value="complete_recovery">
                        Complete Recovery
                      </option>
                      <option value="partial_recovery">Partial Recovery</option>
                      <option value="chronic_management">
                        Chronic Management Required
                      </option>
                      <option value="progressive_decline">
                        Progressive Decline
                      </option>
                      <option value="terminal">Terminal</option>
                      <option value="other">Other</option>
                    </select>
                    {formDataprog.expectedOutcome === "other" &&
                      !aiModes.expectedOutcome && (
                        <Input
                          name="otherOutcome"
                          value={formDataprog.otherOutcome}
                          onChange={handleInputChange}
                          placeholder="Please specify outcome"
                          className="mt-2"
                          disabled={isDisabled}
                        />
                      )}
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <select
                      id="timeframe"
                      name="timeframe"
                      value={formDataprog.timeframe}
                      onChange={handleInputChange}
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
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="riskLevel">Risk Level</Label>
                    <select
                      id="riskLevel"
                      name="riskLevel"
                      value={formDataprog.riskLevel}
                      onChange={handleInputChange}
                      disabled={isDisabled}
                      className="w-full rounded border border-gray-300 p-2"
                    >
                      <option value="">Select risk level</option>
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="recoveryPotential">
                      Recovery Potential
                    </Label>
                    <select
                      id="recoveryPotential"
                      name="recoveryPotential"
                      value={formDataprog.recoveryPotential}
                      onChange={handleInputChange}
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
                  </div>
                </div>
                <div className="mt-6 border-t pt-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Follow-up Appointments
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="appointmentDate"
                          className="text-sm font-medium text-gray-700"
                        >
                          Next Appointment Date
                        </Label>
                        <Input
                          type="date"
                          id="appointmentDate"
                          name="appointmentDate"
                          disabled={isDisabled}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="appointmentTime"
                          className="text-sm font-medium text-gray-700"
                        >
                          Appointment Time
                        </Label>
                        <Input
                          type="time"
                          id="appointmentTime"
                          name="appointmentTime"
                          disabled={isDisabled}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <select
                      id="appointmentType"
                      name="appointmentType"
                      disabled={isDisabled}
                      className="w-full rounded border border-gray-300 p-2"
                    >
                      <option value="">Select appointment type</option>
                      <option value="follow_up">Follow-up Check</option>
                      <option value="treatment">Treatment Session</option>
                      <option value="evaluation">Progress Evaluation</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>
                </div>
                {/* More fields can be added similarly */}
              </form>
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
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6">
          {/* Page number circles at the top */}
          <div className="mb-8 flex justify-center gap-2">
            {Array.from({ length: pages.length }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
              flex h-10 w-10 items-center justify-center rounded-full
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
          <div className="mb-8 flex-1 overflow-auto">
            {" "}
            {/* This makes the content take the available space */}
            {pages[currentPage - 1]()}
          </div>

          {/* Navigation footer */}
          <div className="border-t bg-white shadow-lg">
            <div className="mx-auto max-w-6xl px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
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
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pages.length, prev + 1),
                        )
                      }
                      className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600"
                    >
                      Next
                      <ChevronRight className="ml-2 size-5" />
                    </button>
                  </div>
                ) : currentPage === 3 ? (
                  <button
                    onClick={handleClick}
                    className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600"
                  >
                    Submit
                    <ChevronRight className="ml-2 size-5" />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(pages.length, prev + 1))
                    }
                    className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600"
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
  };

  const MedicalConsultationForm = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [conditionValue, setConditionValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(""); // Manage state for selected value

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
                    label:
                      "Have you planned the timing of your next pregnancy?",
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

    const MultiSectionSymptomsForm = (selectedComplaints) => {
      const handleInputChange = (mainSection, subsection, field, value) => {
        setFormData((prev) => ({
          ...prev,
          [mainSection]: {
            ...prev[mainSection],
            [subsection]: {
              ...prev[mainSection]?.[subsection],
              [field]: value,
            },
          },
        }));
      };

      const renderField = (field, mainSection, subsectionKey) => {
        const value =
          formData[mainSection]?.[subsectionKey]?.[field.name] || "";

        const baseInputStyles =
          "w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white";

        switch (field.type) {
          case "text":
          case "number":
            return (
              <input
                type={field.type}
                className={baseInputStyles}
                value={value}
                onChange={(e) =>
                  handleInputChange(
                    mainSection,
                    subsectionKey,
                    field.name,
                    e.target.value,
                  )
                }
                min={field.type === "number" ? "0" : undefined}
              />
            );
          case "radio":
            return (
              <div className={baseInputStyles}>
                {field.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-2 ${
                      value === option
                        ? "font-bold text-teal-800"
                        : "text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option}
                      checked={value === option}
                      onChange={(e) => {
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          field.name,
                          e.target.value,
                        );
                        if (field.requiresSpecify && option === "Yes") {
                          handleInputChange(
                            mainSection,
                            subsectionKey,
                            `${field.name}_specify`,
                            "",
                          ); // Initialize specify field
                        } else if (field.requiresSpecify) {
                          handleInputChange(
                            mainSection,
                            subsectionKey,
                            `${field.name}_specify`,
                            null,
                          ); // Clear specify field
                        }
                      }}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`size-4 rounded-full border-2 ${
                        value === option
                          ? "border-teal-800 bg-teal-800"
                          : "border-gray-400"
                      }`}
                    ></div>
                    <span>{option}</span>
                  </label>
                ))}

                {/* Conditionally render the "If Yes, specify" field */}
                {field.requiresSpecify && value === "Yes" && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-700">
                      If Yes, specify
                    </label>
                    <input
                      type="text"
                      onChange={(e) =>
                        handleInputChange(
                          mainSection,
                          subsectionKey,
                          `${field.name}_specify`,
                          e.target.value,
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-teal-800"
                    />
                  </div>
                )}
              </div>
            );

          case "select":
            const showConditions =
              selectedValue &&
              selectedValue !== "" &&
              field.conditions &&
              field.conditions[selectedValue];

            const handleSelectChange = (e) => {
              const selected = e.target.value;
              setSelectedValue(selected); // Update the selected value state
              handleInputChange(
                mainSection,
                subsectionKey,
                field.name,
                selected,
              ); // Trigger input change
            };

            return (
              <div className={baseInputStyles}>
                <label className="mb-2 block">{field.label}</label>
                <select
                  className={baseInputStyles}
                  value={selectedValue || ""}
                  onChange={handleSelectChange}
                >
                  <option value="">Select...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Only render the condition fields if the selected value matches a condition */}
                {showConditions && field.conditions[selectedValue] && (
                  <div className="mt-4">
                    {field.conditions[selectedValue].type === "select" ? (
                      <div>
                        <label className="mb-2 block">
                          {field.conditions[selectedValue].label}
                        </label>
                        <select
                          className="mt-1 w-full rounded border border-gray-300 p-2"
                          value={conditionValue || ""}
                          onChange={(e) => {
                            setConditionValue(e.target.value); // Update the conditionValue
                            handleInputChange(
                              mainSection,
                              subsectionKey,
                              `${field.name}_details`,
                              e.target.value,
                            );
                          }}
                        >
                          <option value="">Select...</option>
                          {field.conditions[selectedValue].options.map(
                            (option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    ) : field.conditions[selectedValue].type === "text" ? (
                      <div>
                        <label className="mb-2 block">
                          {field.conditions[selectedValue].label}
                        </label>
                        <input
                          type="text"
                          value={conditionValue || ""}
                          onChange={(e) => {
                            setConditionValue(e.target.value); // Update the conditionValue
                            handleInputChange(
                              mainSection,
                              subsectionKey,
                              `${field.name}_details`,
                              e.target.value,
                            );
                          }}
                          className="mt-1 w-full rounded border border-gray-300 p-2"
                          placeholder="Please specify"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );

          default:
            return null;
        }
      };

      const renderSubsection = (mainSection, subsectionKey, subsection) => (
        <div
          className="rounded-lg border border-[#75C05B] bg-white transition-all duration-200 hover:border-[#007664]"
          onMouseEnter={() => setActiveSection(subsectionKey)}
          onMouseLeave={() => setActiveSection(null)}
        >
          <div className="space-y-4 p-4">
            {subsection.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-[#007664]">
                  {field.label}
                </label>
                {renderField(field, mainSection, subsectionKey)}
              </div>
            ))}
          </div>
        </div>
      );

      const filtered = Object.keys(sicknessSections || {}).reduce(
        (acc, sectionKey) => {
          const section = sicknessSections[sectionKey];

          if (!section.subsections || typeof section.subsections !== "object") {
            return acc;
          }

          const filteredSubsections = Object.keys(section.subsections).reduce(
            (subAcc, subsectionKey) => {
              const subsection = section.subsections[subsectionKey];

              const isSelected =
                selectedComplaints.section === section.title &&
                selectedComplaints.subsection === subsection.title;

              console.log(isSelected);
              if (isSelected) {
                subAcc[subsectionKey] = subsection;
              }
              return subAcc;
            },
            {},
          );

          if (Object.keys(filteredSubsections).length > 0) {
            acc[sectionKey] = {
              title: section.title,
              subsections: filteredSubsections,
            };
          }

          return acc;
        },
        {},
      );
      console.log(filteredComplaints);
      //setFilteredComplaints(filtered);
      // Add dependencies that should trigger a re-filter
      //
      return (
        <div className="mx-auto min-h-screen max-w-7xl bg-[#F7F7F7] p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-[#007664]">
              Medical Assessment Form
            </h1>
            <p className="text-[#B24531]">
              Please complete all relevant sections
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(filteredComplaints).map(
              ([mainSectionKey, mainSection]) => (
                <div
                  key={mainSectionKey}
                  className="overflow-hidden rounded-xl border border-[#75C05B] bg-white"
                >
                  <div className="bg-[#007664] px-6 py-4">
                    <h2 className="flex items-center text-xl font-bold text-[#53FDFD]">
                      {mainSection.title}
                    </h2>
                  </div>

                  <div className="p-6">
                    {/* Calculate number of visible subsections */}
                    {(() => {
                      const visibleSubsections = Object.entries(
                        mainSection.subsections,
                      ).filter(
                        ([key, subsection]) =>
                          /* Your visibility condition here */ true,
                      );

                      const gridCols =
                        visibleSubsections.length > 1
                          ? "lg:grid-cols-2"
                          : "lg:grid-cols-1";

                      return (
                        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                          {Object.entries(mainSection.subsections).map(
                            ([subsectionKey, subsection]) => (
                              <div
                                key={subsectionKey}
                                className="rounded-xl border border-[#75C05B] bg-[#F7F7F7] p-6"
                              >
                                <h3
                                  className={`mb-4 border-b-2 pb-2 text-lg font-semibold ${
                                    activeSection === subsectionKey
                                      ? "border-[#B24531] text-[#B24531]"
                                      : "border-[#75C05B] text-[#007664]"
                                  }`}
                                >
                                  {subsection.title}
                                </h3>
                                {renderSubsection(
                                  mainSectionKey,
                                  subsectionKey,
                                  subsection,
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="sticky bottom-0 mt-8 border-t border-[#75C05B] bg-[#F7F7F7] py-4"></div>
        </div>
      );
    };

    const renderPatientVisitsList = () => {
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

      const toggleVisit = (id) => {
        setExpandedVisit(expandedVisit === id ? null : id);
      };

      return (
        <div
          className="bg-[#F7F7F7] p-4 "
          style={{
            width: "65vw",
            maxWidth: "87%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh", // Ensures it takes the full screen height
            margin: "0 auto",
          }}
        >
          <Card className="w-full  bg-white shadow-lg">
            <CardHeader className="rounded-t-lg bg-[#007664] text-white">
              <CardTitle className="text-2xl">Previous Visits</CardTitle>
              <CardDescription className="text-[#F7F7F7]">
                Click on a visit to view detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="overflow-hidden rounded-lg border shadow-sm"
                  >
                    <button
                      onClick={() => toggleVisit(visit.id)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-[#53FDFD]/10"
                      style={{
                        backgroundColor:
                          expandedVisit === visit.id ? "#53FDFD/20" : "white",
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <Calendar className="text-[#007664]" size={20} />
                        <div className="text-left">
                          <div className="font-medium text-[#007664]">
                            {new Date(visit.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-[#75C05B]">
                            {visit.reason}
                          </div>
                        </div>
                      </div>
                      {expandedVisit === visit.id ? (
                        <ChevronUp className="text-[#007664]" size={20} />
                      ) : (
                        <ChevronDown className="text-[#007664]" size={20} />
                      )}
                    </button>

                    {expandedVisit === visit.id && (
                      <div className="border-t bg-[#F7F7F7] p-4">
                        <div className="grid gap-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="text-[#75C05B]" size={16} />
                            <span className="text-sm text-[#007664]">
                              Time: {visit.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="text-[#75C05B]" size={16} />
                            <span className="text-sm text-[#007664]">
                              Doctor: {visit.doctor}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-[#B24531]">
                              Vitals
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm text-[#007664]">
                              <div className="rounded bg-white p-2">
                                BP: {visit.vitals.bp}
                              </div>
                              <div className="rounded bg-white p-2">
                                Temp: {visit.vitals.temp}
                              </div>
                              <div className="rounded bg-white p-2">
                                Pulse: {visit.vitals.pulse}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-[#B24531]">
                              Diagnosis
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-[#007664]">
                              {visit.diagnosis}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-[#B24531]">
                              Prescription
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-[#007664]">
                              {visit.prescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    const renderPreChecks = () => {
      const preCheckItems = [
        "I washed my hands",
        "I greeted the patient by name",
        "I verified patient identity",
        "I have asked the patient to sit/lie down comfortably, as necessary",
        "I observed the patient's gait",
        "I asked the patient if there was any pain anywhere",
        "There is a female chaperon in the room (for female patient)",
        "I have checked patients visit history",
      ];

      const vitalFields = [
        { label: "Temperature (°C)", name: "temperature", icon: "🌡️" },
        { label: "Blood Pressure (mmHg)", name: "bloodPressure", icon: "❤️" },
        { label: "Pulse (bpm)", name: "pulse", icon: "💓" },
        { label: "Height (cm)", name: "height", icon: "📏" },
        { label: "Weight (kg)", name: "weight", icon: "⚖️" },
        { label: "SpO2 (%)", name: "spo2", icon: "🫁" },
        {
          label: "Respiratory Rate (bpm)",
          name: "respiratoryRate",
          icon: "🫸",
        },
      ];

      return (
        <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Pre-Checks</h2>
            <p className="mt-1 text-gray-500">
              Complete all required checks before proceeding
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {preCheckItems.map((check) => (
                <div key={check} className="group flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={check}
                      name={check}
                      className="peer size-5 cursor-pointer appearance-none rounded border-2 border-gray-300 text-teal-500 transition-colors duration-200 checked:border-transparent checked:bg-teal-500 focus:ring-teal-500 focus:ring-offset-2"
                      onChange={handleChange}
                    />
                    <Check className="absolute left-1 top-1 size-3 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                  </div>
                  <label
                    htmlFor={check}
                    className="ml-3 cursor-pointer text-gray-700 group-hover:text-gray-900"
                  >
                    {check}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Vital Signs
              </h3>
              <div className="mx-4 h-1 grow rounded bg-gradient-to-r from-teal-500/20 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Appearance
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  name="appearance"
                  onChange={handleChange}
                >
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
                  Gait
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  name="gait"
                  onChange={handleChange}
                >
                  {[
                    "Walks Normally",
                    "Walk with Limp",
                    "Walk with a Bump",
                    "Cannot Walk",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {vitalFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="mr-2">{field.icon}</span>
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition-colors duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderChiefComplaints = ({
      selectedComplaints,
      setSelectedComplaints,
    }) => {
      const sections = [
        {
          title: "General Symptoms",
          icon: "🌡️",
          items: [
            "Fever",
            "General Weakness/Fatigue",
            "Specific Weakness",
            "Dizziness",
            "Fainting",
            "Headache",
          ],
        },
        {
          title: "Respiratory Issues",
          icon: "🫁",
          items: [
            "Cough/Throat Problem",
            "Difficulty in Breathing/Shortness of Breath",
            "Sore Throat",
          ],
        },
        {
          title: "Gastrointestinal Issues",
          icon: "🍽️",
          items: [
            "Acidity/Indigestion",
            "Diarrhea",
            "Vomiting",
            "Abdominal Pain",
            "Bleeding with Stool",
            "Ulcer",
          ],
        },
        {
          title: "Urinary and Reproductive Health",
          icon: "⚕️",
          items: [
            "Yellow Urine",
            "Urinary Issues (e.g., Painful Urination, Frequent Urination)",
            "Menstrual Issues (e.g., Period Problem, Menstruation)",
            "Sexual Health Issues (e.g., Intercourse Problem, Private Part Problem)",
            "Prenatal Issues",
            "Pregnancy",
            "Family Planning/Contraceptives",
          ],
        },
        {
          title: "Skin and External Conditions ",
          icon: "🧴",
          items: [
            "Boils",
            "Skin Rash",
            "Injury",
            "Cardiovascular Issues",
            "Palpitations",
          ],
        },
        {
          title: "Others",
          icon: "❓",
          items: [""],
        },
      ];
      // let selectedComplaints = []; // Local variable to track selected complaints
      //setSelectedComplaints(selectedComplaints)

      const handleChangeChiefcomplain = (sectionTitle, item, isChecked) => {
        const updatedComplaints = isChecked
          ? [
              ...selectedComplaints,
              {
                section: sectionTitle,
                subsection: item,
                timestamp: new Date().toISOString(),
              },
            ]
          : selectedComplaints.filter(
              (complaint) =>
                !(
                  complaint.section === sectionTitle &&
                  complaint.subsection === item
                ),
            );
        console.log(updatedComplaints);

        setSelectedComplaints(updatedComplaints); // Update the state in the main component
      };

      const isComplaintSelected = (sectionTitle, item) => {
        // Check if a complaint exists in the local variable
      };

      return (
        <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-[#F7F7F7] p-6 shadow-sm">
          {/* Alert Banner */}
          <div className="flex items-start space-x-3 rounded-lg border border-[#007664]/20 bg-[#007664]/10 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#007664]" />
            <p className="text-sm text-[#007664]">
              Please review the patients medical history before proceeding with
              the new consultation to ensure comprehensive and personalized
              care.
            </p>
          </div>

          {/* Header */}
          <div className="border-b border-[#007664]/20 pb-4">
            <h2 className="text-2xl font-bold text-[#007664]">
              Chief Complaints
            </h2>
            <p className="mt-1 text-[#007664]/70">
              Select all applicable symptoms
            </p>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.title}
                className="space-y-4 rounded-lg border border-[#007664]/20 bg-white p-6 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-[#007664]">
                    {section.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item} className="group flex items-center">
                      <div className="relative">
                        {/* Check if the item is 'Others' */}
                        {section.title === "Others" ? (
                          // If item is "Others", render a text area or input box instead of checkbox
                          <textarea
                            id={`${section.title}-${item}`}
                            name={item}
                            value={
                              isComplaintSelected(section.title, item) || ""
                            }
                            className="h-24 w-full rounded-md border-2 border-[#75C05B] p-2 text-[#007664] transition-colors duration-200 focus:ring-[#007664] focus:ring-offset-2"
                            onChange={(event) =>
                              handleChangeChiefcomplain(
                                section.title,
                                item,
                                event.target.value,
                              )
                            }
                            placeholder="Please specify..."
                          />
                        ) : (
                          // If item is not "Others", render the checkbox as usual
                          <input
                            type="checkbox"
                            id={`${section.title}-${item}`}
                            name={item}
                            checked={isComplaintSelected(section.title, item)}
                            className="peer size-5 cursor-pointer appearance-none rounded border-2 border-[#75C05B] text-[#007664] transition-colors duration-200 checked:border-transparent checked:bg-[#007664] focus:ring-[#007664] focus:ring-offset-2"
                            onChange={(event) =>
                              handleChangeChiefcomplain(
                                section.title,
                                item,
                                event.target.checked,
                              )
                            }
                          />
                        )}
                      </div>
                      <label
                        htmlFor={`${section.title}-${item}`}
                        className="ml-3 cursor-pointer text-sm text-[#007664]/80 group-hover:text-[#007664]"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderPhysicalExam = () => {
      const handleChange = (e) => {
        // Handle form changes here
        console.log(e.target.name, e.target.value);
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
                    options: ["Normal", "Clubbing", "None"],
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
                    <div
                      key={section.name}
                      className="grid gap-6 md:grid-cols-2"
                    >
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
                                value={option}
                                className="size-4 text-blue-600"
                                onChange={handleChange}
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
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

    const pages = [
      renderPatientVisitsList,
      renderPreChecks,
      () =>
        renderChiefComplaints({ selectedComplaints, setSelectedComplaints }),
      () => MultiSectionSymptomsForm({ selectedComplaints }),
      renderPhysicalExam,
    ];

    return (
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6">
        {/* Page number circles at the top */}
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: pages.length }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`
              flex h-10 w-10 items-center justify-center rounded-full
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
        <div className="mb-8 flex-1 overflow-auto">
          {" "}
          {/* This makes the content take the available space */}
          {pages[currentPage - 1]()}
        </div>

        {/* Navigation footer */}
        <div className="border-t bg-white shadow-lg">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
              >
                <ChevronLeft className="mr-2 size-5" />
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">
                Page {currentPage} of {pages.length}
              </span>
              <button
                onClick={() => {
                  if (currentPage === pages.length) {
                    // "Continue" logic
                    startSmartConsult();
                  } else {
                    // "Next" logic
                    setCurrentPage((prev) => Math.min(pages.length, prev + 1));
                  }
                }}
                disabled={false} // Ensure the button is always active
                className="flex items-center rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500"
              >
                {currentPage === pages.length ? "Continue" : "Next"}
                <ChevronRight className="ml-2 size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LabResultDetailsModal = ({ result, isOpen, onClose }) => {
    const isAbnormal = result.flags && result.flags.length > 0;
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-[#F7F7F7] p-0">
          <DialogHeader className="rounded-t-lg bg-[#007664] p-6 text-white">
            <DialogTitle className="text-2xl font-bold">
              Lab Result Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 p-6">
            {/* Basic Test Information */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Basic Test Information
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                  <InfoItem label="Test Name" value={result.testName} />
                  <InfoItem label="Description" value={result.description} />
                  <InfoItem label="LOINC Code" value={result.code} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Result Value and Reference Ranges */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#B24531]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Result and Reference Range
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">
                        Result Value
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {result.value} {result.unit}
                        </span>
                        {isAbnormal && (
                          <AlertTriangle className="size-5 text-[#B24531]" />
                        )}
                      </div>
                    </div>
                    <InfoItem
                      label="Reference Range"
                      value={result.referenceRange}
                    />
                  </div>
                  {isAbnormal && (
                    <div className="rounded border-l-4 border-[#B24531] bg-red-50 p-4">
                      <h4 className="mb-1 text-sm font-medium text-[#B24531]">
                        Interpretive Comments
                      </h4>
                      <p className="text-sm text-gray-700">{result.flags}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Collection Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Collection Details
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                  <InfoItem
                    label="Collection Method"
                    value={result.collectionMethod}
                  />
                  <InfoItem label="Specimen Type" value={result.specimenType} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Timing and Ordering */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Timing and Ordering
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                  <InfoItem
                    label="Performed Date"
                    value={result.performedDate}
                  />
                  <InfoItem label="Ordered By" value={result.orderedBy} />
                  <InfoItem
                    label="Performing Lab"
                    value={result.performingLab}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Patient Information */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#B24531]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Patient Information
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                  <InfoItem label="Name" value={result.patientName} />
                  <InfoItem label="DOB" value={result.patientDOB} />
                  <InfoItem label="MRN" value={result.patientMRN} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Information */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Additional Information
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem label="Status" value={result.status} />
                  </div>
                  {result.comments && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-600">
                        Comments
                      </h4>
                      <p className="text-sm text-gray-700">{result.comments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const [newConsultation, setNewConsultation] = useState({
    id: "", // Unique identifier for the Consultation
    status: "", // Consultation status
    category: [], // Classification of consultation
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
    occurrenceDateTime: "", // Date/Time of the consultation
    created: "", // Creation date of consultation
    description: "", // Description of consultation
    reasonCode: [], // Codes for the consultation reason
    diagnosis: [], // Diagnosis associated with consultation
    appointment: {
      reference: "", // Reference to the appointment
    },
    period: {
      start: "", // Start date/time of consultation
      end: "", // End date/time of consultation
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
      value: 0, // Total cost of consultation
      currency: "", // Currency
    },
    presentedProblem: [], // Problems presented during consultation
    progress: [], // Progress notes
    summary: "", // High-level summary of consultation
  });
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const ConsultationDetailsModal = ({ consult, isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-[#F7F7F7] p-0">
          <DialogHeader className="rounded-t-lg bg-[#007664] p-6 text-white">
            <DialogTitle className="text-2xl font-bold">
              Consultation Details
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
                  <InfoItem label="Status" value={consult.status} />
                  <InfoItem
                    label="Category"
                    value={consult.category.join(", ")}
                  />
                  <InfoItem
                    label="Service Type"
                    value={consult.serviceType.join(", ")}
                  />
                  <InfoItem label="Patient" value={consult.subject.display} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Participant Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#B24531]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Participant Details
                </h2>
              </div>

              <Card className="border-none bg-white shadow-lg">
                <CardContent className="divide-y divide-gray-100">
                  {consult.participant.map((participant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2"
                    >
                      <InfoItem
                        label="Type"
                        value={participant.type.join(", ")}
                      />
                      <InfoItem
                        label="Name"
                        value={participant.individual.display}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Timing Information */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Timing Information
                </h2>
              </div>

              <Card className="border-none bg-white shadow-lg">
                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                  <InfoItem
                    label="Occurrence Date/Time"
                    value={consult.occurrenceDateTime}
                  />
                  <InfoItem label="Created" value={consult.created} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Additional Information
                </h2>
              </div>

              <Card className="border-none bg-white shadow-lg">
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem
                      label="Reason Code"
                      value={consult.reasonCode.join(", ")}
                    />
                    <InfoItem
                      label="Diagnosis"
                      value={consult.diagnosis.join(", ")}
                    />
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Summary</h4>
                    <p className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                      {consult.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
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

  const DiagnosisForm = ({ buttonText, onSubmit, diagnosesData }) => {
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
        reference: "", // Location reference
        display: "", // Location name
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

    // Pre-populate form for editing
    useEffect(() => {
      if (diagnosesData) {
        console.log(diagnosesData);
        setNewDiagnosis({
          id: diagnosesData.id || "",
          patient: {
            reference: diagnosesData.patient?.reference || "",
            display: diagnosesData.patient?.display || "",
          },
          status: diagnosesData.status || "",
          category: diagnosesData.category || [],
          serviceType: diagnosesData.serviceType || [],
          occurrenceDateTime: diagnosesData.occurrenceDateTime || "",
          created: diagnosesData.created || "",
          reasonCode: diagnosesData.reasonCode || [],
          description: diagnosesData.description || "",
          diagnosisDetails: diagnosesData.diagnosisDetails || [],
          appointment: {
            reference: diagnosesData.appointment?.reference || "",
          },
          period: {
            start: diagnosesData.period?.start || "",
            end: diagnosesData.period?.end || "",
          },
          location: {
            reference: diagnosesData.location?.reference || "",
            display: diagnosesData.location?.display || "",
          },
          hospitalization: {
            admitSource: diagnosesData.hospitalization?.admitSource || "",
            dischargeDisposition:
              diagnosesData.hospitalization?.dischargeDisposition || "",
          },
          totalCost: {
            value: diagnosesData.totalCost?.value || 0,
            currency: diagnosesData.totalCost?.currency || "",
          },
          presentedProblem: diagnosesData.presentedProblem || [],
          progress: diagnosesData.progress || [],
          summary: diagnosesData.summary || "",
        });
      }
    }, [diagnosesData]);

    const handleChange = (field, value) => {
      setNewDiagnosis((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Diagnosis ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Diagnosis ID</Label>
          <Input
            id="id"
            placeholder="Diagnosis ID"
            value={newDiagnosis.id}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({ ...prev, id: e.target.value }))
            }
          />
        </div>

        {/* Diagnosis Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Diagnosis Status</Label>
          <Select
            value={newDiagnosis.status}
            onValueChange={(value) =>
              setNewDiagnosis((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Diagnosis Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Patient Information */}
        <div className="space-y-2">
          <Label htmlFor="patientDisplay">Patient Name</Label>
          <Input
            id="patientDisplay"
            placeholder="Patient Name"
            value={newDiagnosis.patient.display}
            onChange={(e) =>
              updateNestedState("patient.display", e.target.value)
            }
          />
        </div>

        {/* Occurrence Date Time */}
        <div className="space-y-2">
          <Label>Occurrence Date</Label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={
              newDiagnosis.occurrenceDateTime
                ? new Date(newDiagnosis.occurrenceDateTime)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              updateNestedState("occurrenceDateTime", e.target.value)
            }
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Diagnosis Description</Label>
          <Textarea
            id="description"
            placeholder="Detailed diagnosis description"
            value={newDiagnosis.description}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="w-full resize-none"
          />
        </div>

        {/* Summary */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="summary">Diagnosis Summary</Label>
          <Textarea
            id="summary"
            placeholder="High-level summary of the diagnosis"
            value={newDiagnosis.summary}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({ ...prev, summary: e.target.value }))
            }
            rows={3}
            className="w-full resize-none"
          />
        </div>

        {/* Location Information */}
        <div className="space-y-2">
          <Label htmlFor="locationDisplay">Location</Label>
          <Input
            id="locationDisplay"
            placeholder="Diagnosis Location"
            value={newDiagnosis.location.display}
            onChange={(e) =>
              updateNestedState("location.display", e.target.value)
            }
          />
        </div>

        {/* Hospitalization Details */}
        <div className="space-y-2">
          <Label htmlFor="admitSource">Admit Source</Label>
          <Input
            id="admitSource"
            placeholder="Admission Source"
            value={newDiagnosis.hospitalization.admitSource}
            onChange={(e) =>
              updateNestedState("hospitalization.admitSource", e.target.value)
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 md:col-span-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(newDiagnosis)}
            disabled={isLoading}
            className="bg-teal-700 text-white hover:bg-teal-800"
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </div>
    );
  };

  const DiagnosisDetailsModal = ({ diagnosis, isOpen, onClose }) => {
    const getStatusColor = (status) => {
      const statusColors = {
        active: "bg-green-50 text-green-700 border-green-200",
        completed: "bg-blue-50 text-blue-700 border-blue-200",
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        default: "bg-gray-50 text-gray-700 border-gray-200",
      };
      return statusColors[status?.toLowerCase()] || statusColors.default;
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

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-[#F7F7F7] p-0">
          <DialogHeader className="rounded-t-lg bg-[#007664] p-6 text-white">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <Stethoscope className="size-6" />
              Diagnosis & Prognosis Details
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
                Current Status: {diagnosis.status}
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
                  <InfoItem
                    label="Category"
                    value={diagnosis.category.join(", ")}
                  />
                  <InfoItem
                    label="Service Type"
                    value={diagnosis.serviceType.join(", ")}
                  />
                  <InfoItem
                    label="Patient"
                    value={diagnosis.patient.display}
                    highlight
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Participant Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#B24531]" />
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#007664]">
                  <Users className="size-5" />
                  Participant Details
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="space-y-4 p-6">
                  {diagnosis.participant.map((participant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-6 border-b pb-4 last:border-0 md:grid-cols-2"
                    >
                      <InfoItem
                        label="Type"
                        value={participant.type.join(", ")}
                      />
                      <InfoItem
                        label="Name"
                        value={participant.individual.display}
                        highlight
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                    label="Occurrence Date/Time"
                    value={diagnosis.occurrenceDateTime}
                    icon={<Clock className="size-4 text-[#007664]" />}
                  />
                  <InfoItem
                    label="Created"
                    value={diagnosis.created}
                    icon={<Clock className="size-4 text-[#007664]" />}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#007664]">
                  <FileText className="size-5" />
                  Additional Information
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem
                      label="Reason Code"
                      value={diagnosis.reasonCode.join(", ")}
                    />
                    <InfoItem
                      label="Progress"
                      value={diagnosis.progress.join(", ")}
                    />
                    <InfoItem
                      label="Presented Problem"
                      value={diagnosis.presentedProblem}
                      highlight
                    />
                  </div>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {diagnosis.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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

  const MedicationDetailsModal = ({ medic, isOpen, onClose }) => {
    const isActive = medic.medicationStatus?.toLowerCase() === "active";
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

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-[#F7F7F7] p-0">
          <DialogHeader className="rounded-t-lg bg-[#007664] p-6 text-white">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <Pill className="size-6" />
              Medication Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 p-6">
            {/* Status Banner */}
            <motion.div
              {...fadeIn}
              className={`flex items-center gap-3 rounded-lg p-4 ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              <AlertCircle className="size-5" />
              <span className="font-medium">
                Status: {medic.medicationStatus}
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
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem
                      label="Medication Name"
                      value={medic.name}
                      highlight
                    />
                    <InfoItem label="Dosage" value={medic.dosage} highlight />
                    <InfoItem
                      label="Frequency"
                      value={medic.frequency}
                      icon={<Clock className="size-4 text-[#007664]" />}
                    />
                    <InfoItem
                      label="Description"
                      value={medic.medicationDescription}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timing Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Timing Details
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <InfoItem
                      label="Start Date"
                      value={medic.startDate}
                      icon={<Calendar className="size-4 text-[#007664]" />}
                    />
                    <InfoItem
                      label="End Date"
                      value={medic.endDate}
                      icon={<Calendar className="size-4 text-[#007664]" />}
                    />
                    <InfoItem
                      label="Start Time"
                      value={medic.medicationStartTime}
                      icon={<Clock className="size-4 text-[#007664]" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Frequency Details */}
            <motion.div {...fadeIn} className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-2 rounded-full bg-[#B24531]" />
                <h2 className="text-xl font-bold text-[#007664]">
                  Frequency Details
                </h2>
              </div>
              <Card className="border-none bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoItem
                      label="Frequency Type"
                      value={medic.medicationFrequency.type}
                    />
                    {medic.medicationFrequency.type === "daily" && (
                      <InfoItem
                        label="Times Per Day"
                        value={`${medic.medicationFrequency.value} times`}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
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

  const hasSelectedTests = testSelections.some(
    (selection) =>
      selection.selectedCategory &&
      (selection.selectedTests.length > 0 || selection.otherTest),
  );

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

  const ConsultationForm = ({ buttonText, onSubmit, consultationData }) => {
    const [newConsultation, setNewConsultation] = useState({
      id: "",
      patientName: "",
      status: "",
      category: [],
      serviceType: "",
      occurrenceDateTime: "",
      created: "",
      reasonCode: [],
      diagnosis: [],
      summary: "",
      participant: [], // Ensure participant data is included if needed
    });

    // Pre-populate form for editing
    useEffect(() => {
      if (consultationData) {
        console.log(consultationData);
        setNewConsultation({
          id: consultationData.id || "",
          patientName: consultationData.subject?.display || "",
          status: consultationData.status || "",
          category: consultationData.category || [],
          serviceType: consultationData.serviceType?.[0] || "",
          occurrenceDateTime: consultationData.occurrenceDateTime || "",
          created: consultationData.created || "",
          reasonCode: consultationData.reasonCode || [],
          diagnosis: consultationData.diagnosis || [],
          summary: consultationData.summary || "",
          participant: consultationData.participant || [], // Include participant info if required
        });
      }
    }, [consultationData]);

    const handleChange = (field, value) => {
      setNewConsultation((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(newConsultation);
    };
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="id">Consultation ID</Label>
          <Input
            disabled="disabled"
            id="id"
            placeholder="Consultation ID"
            value={newConsultation.id}
            onChange={(e) => handleChange("id", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            placeholder="Patient Name"
            value={newConsultation.patientName}
            disabled="disabled"
            onChange={(e) => handleChange("patientName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={newConsultation.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress">In-Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={newConsultation.category.join(", ")}
            onValueChange={(value) =>
              handleChange("category", value.split(", "))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="new-patient">New Patient</SelectItem>
              <SelectItem value="annual-checkup">Annual Checkup</SelectItem>
              <SelectItem value="specialist-consultation">
                Specialist Consultation
              </SelectItem>
              <SelectItem value="emergency-visit">Emergency Visit</SelectItem>
              <SelectItem value="routine-care">Routine Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            value={newConsultation.serviceType}
            onValueChange={(value) => handleChange("serviceType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
              <SelectItem value="mental-health-counseling">
                Mental Health Counseling
              </SelectItem>
              <SelectItem value="primary-care">Primary Care</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occurrenceDateTime">Consultation Date/Time</Label>
          <Input
            id="occurrenceDateTime"
            type="datetime-local"
            value={newConsultation.occurrenceDateTime}
            onChange={(e) => handleChange("occurrenceDateTime", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="created">Created Date/Time</Label>
          <Input
            id="created"
            type="datetime-local"
            value={newConsultation.created}
            onChange={(e) => handleChange("created", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Description"
            value={newConsultation.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonCode">Reason Code</Label>
          <Select
            value={newConsultation.reasonCode}
            onValueChange={(value) => handleChange("reasonCode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Reason Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chronic-condition">
                Chronic Condition
              </SelectItem>
              <SelectItem value="mental-health-counseling">
                Mental Health Counseling
              </SelectItem>
              <SelectItem value="acute-illness">Acute Illness</SelectItem>
              <SelectItem value="preventive-care">Preventive Care</SelectItem>
              <SelectItem value="post-op-follow-up">
                Post-op Follow-up
              </SelectItem>
              <SelectItem value="injury">Injury</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Input
            id="diagnosis"
            placeholder="Diagnosis"
            value={newConsultation.diagnosis.join(", ")}
            onChange={(e) =>
              handleChange("diagnosis", e.target.value.split(", "))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="presentedProblem">Presented Problem</Label>
          <Input
            id="presentedProblem"
            placeholder="Presented Problem"
            value={newConsultation.presentedProblem}
            onChange={(e) =>
              handleChange("presentedProblem", e.target.value.split(", "))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <textarea
            id="summary"
            placeholder="Summary"
            value={newConsultation.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1 mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(newConsultation)}
            disabled={isLoading}
            className="bg-teal-700 text-white hover:bg-teal-800"
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </div>
    );
  };
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
                    value="consultations"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Stethoscope className="size-4" />
                    Consultations
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

                <TabsContent value="consultations" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex flex-col justify-between sm:flex-row">
                    <h3 className="mb-4 text-lg font-semibold text-[#007664] sm:mb-0">
                      Recent Consultations
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
                            New Consultation
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                          <DialogHeader>
                            <div className="flex items-center justify-center ">
                              <DialogTitle className="text-teal-800">
                                <div className="mb-0 text-center">
                                  <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                    New Consultation
                                  </h2>
                                </div>
                              </DialogTitle>
                            </div>
                          </DialogHeader>

                          <MedicalConsultationForm />
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
                        {SelectedPatient.consultations?.map((consultation) => {
                          // Extract the doctor from the participants
                          const doctor = consultation.participant?.find((p) =>
                            p.type.includes("Doctor"),
                          );
                          const formattedDate = new Date(consultation.created)
                            .toISOString()
                            .split("T")[0];
                          return (
                            <tr key={consultation.id}>
                              <td className="px-4 py-2">{formattedDate}</td>
                              <td className="px-4 py-2">
                                {doctor?.individual?.display || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {consultation.reasonCode}
                              </td>
                              <td className="px-4 py-2">
                                {consultation.status}
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
                                          Consultation Details
                                        </DialogTitle>
                                      </DialogHeader>

                                      <ConsultationDetailsModal
                                        consult={consultation}
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
                                          Edit Consultation
                                        </DialogTitle>
                                      </DialogHeader>

                                      {/* Render the consultation form pre-filled for editing */}
                                      <ConsultationForm
                                        buttonText="Update"
                                        onSubmit={handleEditSubmit} // Handle form submission for edits
                                        consultationData={consultation}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-700 hover:text-red-800"
                                    onClick={() => startDelete(consultation)}
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

                                    <DiagnosisDetailsModal
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

                                    {/* Render the consultation form pre-filled for editing */}
                                    <DiagnosisForm
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
                        <RenderLabTests onTabChange={handleTabtriggerChange} />
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

                                    <LabResultDetailsModal
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

                        <Rendermedication />
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

                                    <MedicationDetailsModal
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

                                    {/* Render the consultation form pre-filled for editing */}
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
      {activeTab === "smartconsult" && (
        <SmartConsultation patientData={SelectedPatient} />
      )}
    </div>
  );
};

export default PatientDetailsView;
