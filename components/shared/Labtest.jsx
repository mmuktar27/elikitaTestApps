"use client";

import React, { useState, useEffect } from "react";
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

import { updateLabtestData,createLabtest } from "../shared/api";;
// Charts

// Third-party Modal
import Modal from "react-modal";
import { motion } from "framer-motion";
import axios from 'axios';




export function NewLabTestForm({ onTabChange , patient, onSubmit, initialLabtest= null ,buttonText,labTests}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(initialLabtest || {});
  const [errors,setErrors]= useState({});
      const [isLoading, setIsLoading] = useState(false);
  
    const session = useSession();


  const resetForm = () => {
    // Reset labtestFormData
    setlabtestFormData({
      priority: 'Routine',
      additionalNotes: '',
      collectionDateTime: new Date().toISOString().slice(0, 16),
      requestedBy: session?.data?.user?.id
    });
  
    // Reset test selections
    setTestSelections([
      {
        id: 1,
        selectedCategory: null,
        selectedTests: [],
        otherTest: '',
        isOpen: false,
        isSubsectionOpen: false
      }
    ]);
  
    // Reset AI-related states if applicable
    setIsAIEnabled(false);
    setIsEditing(false);
  };
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState({});
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [expandedLabTest, setExpandedLabTest] = React.useState(null);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    const newId = testSelections.length > 0 ? Math.max(...testSelections.map((s) => s.id)) + 1 : 1;
  
    setTestSelections((prev) => [
      ...prev.map((item) => ({ ...item })), // Preserve existing `isOpen` state
      {
        id: newId,
        selectedCategory: "",
        selectedTests: [],
        otherTest: "",
        isOpen: true,  // Keep the new selection open
        isSubsectionOpen: false,
      },
    ]);
  };
  
  const [testSelection, setTestSelection] = useState(testSelections);
  const hasSelectedTests = testSelections.some(
    (selection) =>
      selection.selectedCategory &&
      (selection.selectedTests.length > 0 || selection.otherTest),
  );
  const handleClick = () => {
    onTabChange("diagnoses"); // Change tab to "consultations"
  };
  const renderLabTestHistory = () => {
  

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
        className="mx-auto max-w-4xl  p-6"
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
              {labTests
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by most recent date
                .slice(0, 4) // Limit to the most recent 5 tests
                .map((test) => (
                  <div
                    key={test.labtestID || Math.random()} // Fallback key if `labtestID` is missing
                    className="overflow-hidden rounded-lg border shadow-sm"
                  >
                    <button
                      onClick={() => toggleLabTest(test.labtestID)}
                      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Activity className="text-teal-800" size={20} />
                        <div className="text-left">
                          <div className="font-medium text-teal-800">
                            Priority: {test.priority || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Lab Test ID: {test.labtestID || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {expandedLabTest === test.labtestID ? (
                          <ChevronUp className="text-teal-800" size={20} />
                        ) : (
                          <ChevronDown className="text-teal-800" size={20} />
                        )}
                      </div>
                    </button>
    
                    {expandedLabTest === test.labtestID && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid gap-4">
                          {/* Test Selections */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">Test Selections</h4>
                            {test.testSelections && test.testSelections.length > 0 ? (
                              test.testSelections.map((selection, index) => (
                                <div key={index} className="rounded bg-white p-2 text-sm text-gray-700">
                                  <strong>Category:</strong> {selection.category || "N/A"}
                                  <br />
                                  <strong>Tests:</strong> {selection.tests.length > 0 ? selection.tests.join(", ") : "N/A"}
                                  {selection.otherTest && (
                                    <div>
                                      <strong>Other Test:</strong> {selection.otherTest}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="rounded bg-white p-2 text-sm text-gray-700">No test selections available.</p>
                            )}
                          </div>
    
                          {/* Requested By */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">Requested By</h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {test.requestedBy
  ? `${test.requestedBy.firstName || ""} ${test.requestedBy.lastName || ""}`.trim() || "N/A"
  : "N/A"}

                            </p>
                          </div>
    
                          {/* Additional Notes */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">Additional Notes</h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {test.additionalNotes || "No additional notes"}
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
  const generatelabtestId = () => {
    const now = new Date();
    const year = now.getFullYear();

    // Get unix timestamp and take last 4 digits
    const timestamp = Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4);

    // Combine elements with prefix
    const labtestId = `LBT-${year}-${timestamp}`;

    return labtestId;
  };
  const [labtestFormData, setlabtestFormData] = useState(() => {
    if (initialLabtest !== null) {
      return initialLabtest;  // If initial is not null, use it as the state
    } else {
      return {
        labtestID: generatelabtestId(),
        patient: patient,
        priority: "",
        additionalNotes: "",
       
        requestedBy: session?.data?.user?.id
      };  // Default values if initial is null
    }
  });
  
  const validateLabTestForm = () => {
    let newErrors = {};
  
    // Validate Priority (must be selected)
    if (!labtestFormData?.priority) {
      newErrors.priority = "Priority selection is required.";
    }
  
    // Validate Test(s) Requested (at least one test should be selected)
    const hasSelectedTests = testSelections.some(selection => selection.selectedTests.length > 0);
    if (!hasSelectedTests) {
      newErrors.testsRequested = "At least one test must be selected.";
    }
  
    // Validate Additional Notes (must not be empty)
    if (!labtestFormData?.additionalNotes?.trim()) {
      newErrors.additionalNotes = "Additional Notes are required.";
    }
  
  
    // Validate Requested By (must not be empty)

  
    // Debugging output
    console.log("Validation Errors:", newErrors);
  
    // Set errors in state
    setErrors(newErrors);
  
    // Return false if there are validation errors
    return Object.keys(newErrors).length === 0;
  };
  


  const LabTests = () => {
    const handleAIComplete = () => {
      // AI-generated data for lab test form
      const aiData = {
        priority: "Urgent",
        diagnosis: "Suspected acute renal dysfunction with metabolic imbalance",
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
      handleAIComplete(); // Rerun AI completion with potentially different labtests
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
            <div className="mb-3 rounded-t-lg bg-teal-700 text-center text-white">
              <h1 className="rounded-t-lg bg-teal-700 text-2xl text-white">
                Laboratory Test Request
              </h1>
              <p className="text-white ">
                Select the required diagnostic tests for the patient
              </p>
            </div>
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
            <div
            
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
  <label key={priority} className="inline-flex items-center">
    <input
      type="radio"
      name="priority"
      value={priority} // ✅ Each radio button should have its own value
      checked={labtestFormData.priority === priority} // ✅ Ensure the correct one is selected
      onChange={handleChange}
      disabled={!isEditing && isAIEnabled}
      className=" text-blue-600"
    />
    <span className="ml-2 text-gray-700">{priority}</span>
  </label>
  
))} 
                      </div>
                      {errors.priority && (
  <p className="text-sm text-red-500">{errors.priority}</p>
)}
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
                      <div key={selection.id} className="rounded-lg border p-4">
                        <div className="relative">
                          <div
                            className={`rounded-lg border bg-white p-3 ${!isAIEnabled || isEditing ? "cursor-pointer" : ""} flex items-center justify-between`}
                            onClick={() => toggleDropdown(selection.id)}
                          >
                            <span>
                              {selection.selectedCategory || "Select Category"}
                            </span>
                            {(!isAIEnabled || isEditing) &&
                              (selection.isOpen ? (
                                <ChevronUp className="size-5" />
                              ) : (
                                <ChevronDown className="size-5" />
                              ))}
                          </div>

                          {selection.isOpen && (!isAIEnabled || isEditing) && (
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
                                    cat.category === selection.selectedCategory,
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
                                    <label htmlFor={`${selection.id}-${test}`}>
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
                  {errors.priority && (
  <p className="text-sm text-red-500">{errors.testsRequested}</p>
)}
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
                  
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8"></div>
            </div>
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


  const handleSubmit = async () => {
    if (!buttonText) return;
  
    setIsLoading(true); // Start loading before async operations
  
    const mergeLabTestData = (labtestFormData, testSelections) => ({
      ...labtestFormData,
      testSelections: testSelections.map(selection => ({
        category: selection.selectedCategory,
        tests: selection.selectedTests,
        otherTest: selection.otherTest || '',
      })),
    });
  
    try {
      if (buttonText === "Submit") {
        await createLabtest(
          mergeLabTestData(labtestFormData, testSelections),
          resetForm,
          onSubmit,
          onTabChange,
          session.data.user.id
        );
      } else if (buttonText === "Update") {
        await updateLabtestData(
          mergeLabTestData(labtestFormData, testSelections),
          resetForm,
          onTabChange,
          onSubmit
        );
      }
    } catch (error) {
      console.error("Error submitting lab test data:", error);
    } finally {
      setIsLoading(false); // Ensure loading state resets after operation
    }
  };
  
  const handleSubmitClick = async () => {
    const isValid = validateLabTestForm();
    console.log("Validation Result:", isValid);
  
    if (!isValid) return;
  
    setIsLoading(true);
    try {
      await handleSubmit(); // Await this to ensure proper loading state handling
    } catch (error) {
      console.error("Error submitting medication:", error);
    }
  };
  


  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6">
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
        <div className="mb-1 flex-1 overflow-auto">
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
}
export function ViewLabTest({ labtest, isOpen, onClose }) {

  console.log(labtest)
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
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
          <DialogTitle className="text-2xl font-bold">
            Lab Test Request Details
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
                <InfoItem label="Lab Test ID" value={labtest.labtestID} />
                <InfoItem label="Test Category" value={labtest.testCategory} />
                <InfoItem label="Priority" value={labtest.priority} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Tests */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#B24531]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Selected Tests
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
    {labtest.testSelections && labtest.testSelections.length > 0 ? (
      labtest.testSelections.map((selection, index) => (
        <div key={index} className="space-y-2">
          <p className="text-sm font-bold text-gray-700">{selection.category}</p>
          {selection.tests && selection.tests.length > 0 ? (
            selection.tests.map((test, testIndex) => (
              <p key={`${index}-${testIndex}`} className="text-sm text-gray-700">
                • {test}
              </p>
            ))
          ) : (
            <p key={index} className="text-sm text-gray-700">
              No tests available.
            </p>
          )}
        </div>
      ))
    ) : (
      <p>No test selections available.</p>
    )}
  </div>
              </CardContent>
            </Card>
            
          </motion.div>
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#75C05B]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Additional Information
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="space-y-6 p-6">
                {labtest.additionalNotes && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-600">
                      Notes
                    </h4>
                    <p className="text-sm text-gray-700">{labtest.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* Request Details */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#53FDFD]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Request Details
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <InfoItem
  label="Requested By"
  value={
    labtest.requestedBy
      ? `${labtest.requestedBy.firstName || ""} ${labtest.requestedBy.lastName || ""}`.trim() || "N/A"
      : "N/A"
  }
/>

                <InfoItem label="Requested At" value={labtest.requestedAt} />
                <InfoItem 
                  label="Requested On" 
                  value={new Date(labtest.createdAt).toLocaleDateString()} 
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Information */}
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
