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
import { ViewMedication, NewMedicationForm } from "../../components/shared";
import {
  NewDiagnosisForm,
  ViewDiagnosis,
  EditDiagnosisForm,
} from "../../components/shared";
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

export function NewLabTestForm({ onTabChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
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
}
export function ViewLabTest({ result, isOpen, onClose }) {
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
                <InfoItem label="Performed Date" value={result.performedDate} />
                <InfoItem label="Ordered By" value={result.orderedBy} />
                <InfoItem label="Performing Lab" value={result.performingLab} />
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
}
