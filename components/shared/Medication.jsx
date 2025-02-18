"use client";
import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

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

import { editMedication, submitMedication } from "../shared/api";
import { handleAddVisitHistory } from "../shared";

export function NewMedicationForm({
  medications,
  patient,
  onClose,
  onSubmit,
  initialMedication,
}) {
  //console.log(medication)
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

  const [errors, setErrors] = useState({});

  const [filteredMedications, setFilteredMedications] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [medformData, setmedFormData] = useState(() => {
    if (initialMedication !== null) {
      return initialMedication; // If initialMedication is provided, use it as the state
    } else {
      return {
        medicationId: generateMedicationId(), // Default medication ID (you can replace it with a dynamic ID generator)
        requestedBy: session.data.user.id, // Default requestedBy (can be dynamic based on the user)
        medicationName: " j", // Initially empty, to be filled in by the user
        dosage: "", // Initially empty, to be filled in by the user
        treatmentDuration: "", // Initially empty, to be filled in by the user
        followUpProtocol: "", // Initially empty, to be filled in by the user
        additionalNotes: "", // Initially empty, to be filled in by the user
        patient: patient, // Default to the patient object passed as prop or state
      };
    }
  });

  const [expandedVisit, setExpandedVisit] = useState(null);
  const [expandedLabTest, setExpandedLabTest] = React.useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: "", message: "" });
  const [isEditMode, setIsEditMode] = useState(!!initialMedication);
  console.log("initialMedication");
  console.log(initialMedication);
  console.log("initialMedication");

  const generateMedicationId = () => {
    const now = new Date();
    const year = now.getFullYear();

    // Get unix timestamp and take last 4 digits
    const timestamp = Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4);

    // Combine elements with prefix
    const medicationId = `MED-${year}-${timestamp}`;

    return medicationId;
  };

  const [medId, setMedid] = useState(generateMedicationId());
  const [expandedMedication, setExpandedMedication] = useState(null);
  const [interactionAlert, setInteractionAlert] = useState(null);
  const [isGeneratingId, setIsGeneratingId] = useState(true);
  const [isreadyForSubmit, setIsreadyForSubmit] = useState(false);
  const [isAICompleted, setIsAICompleted] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  /*
  const editMedication = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/medications/${medformData._id}`,
        {
          method: "PUT", // Use PUT for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medformData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update medication");
      }

      const data = await response.json();
      console.log("Medication updated successfully:", data);

      onClose();
      onSubmit("success", "Medication successfully updated!");
    } catch (error) {
      console.error("Error updating medication:", error);
      onSubmit("error", "Failed to update medication");
    }
  };

  const submitMedication = async () => {
    const updatedMedFormData = {
      ...medformData,
      medicationId: medformData?.medicationId ?? generateMedicationId(), // Generate medicationId if null/undefined
      requestedBy: medformData?.requestedBy ?? "Dr. John Doe", // Default to "Dr. John Doe" if null/undefined
      patient: medformData?.patient ?? patient, // Use `patient` if medformData.patient is null/undefined
    };
    
    if (isEditMode) {
      await editMedication(medformData, onClose, onSubmit);
    } else {
      try {
        const response = await fetch("http://localhost:4000/api/medications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMedFormData), // Convert medformData to JSON
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to submit medication");
        }

        // Parse the response body as JSON
        const data = await response.json();
        console.log("Medication submitted successfully:", data);

        // Show success modal
        onClose();
        onSubmit("success", "Medication successfully added!");

        // You can handle the response here, like clearing the form or showing a success message
        setmedFormData({
          medicationId: generateMedicationId(),
          requestedBy: "",
          medicationName: "",
          dosage: "",
          treatmentDuration: "",
          followUpProtocol: "",
          additionalNotes: "",
          patient: "",
        });
      } catch (error) {
        console.error("Error submitting medication:", error);
        // Show error modal
        onSubmit("error", "Failed to add medication");
      }
    }
  };
  */
  const RenderMedicationHistory = () => {
    const toggleMedication = (id) => {
      setExpandedMedication(expandedMedication === id ? null : id);
    };
    const recentMedications = [...medications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);

    console.log(recentMedications);
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
              {recentMedications.map((medication) => (
                <div
                  key={medication.medicationId}
                  className="overflow-hidden rounded-lg border shadow-sm"
                >
                  <button
                    onClick={() => toggleMedication(medication.medicationId)}
                    className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Activity className="text-teal-800" size={20} />
                      <div className="text-left">
                        <div className="font-medium text-teal-800">
                          {medication.medicationName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Requested by:
                          <p className="text-sm opacity-80">
                            <span>
                              {`${medication.requestedBy?.firstName || ""} ${medication.requestedBy?.lastName || ""}`.trim() ||
                                "Not specified"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {new Date(medication.createdAt).toLocaleDateString()}
                      </span>
                      {expandedMedication === medication.medicationId ? (
                        <ChevronUp className="text-teal-800" size={20} />
                      ) : (
                        <ChevronDown className="text-teal-800" size={20} />
                      )}
                    </div>
                  </button>

                  {expandedMedication === medication.medicationId && (
                    <div className="border-t bg-gray-50 p-4">
                      <div className="grid gap-4">
                        {/* Medication Dosage */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">Dosage</h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {medication.dosage}
                          </p>
                        </div>

                        {/* Treatment Duration */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-teal-800">
                            Treatment Duration(In days)
                          </h4>
                          <p className="rounded bg-white p-2 text-sm text-gray-700">
                            {medication.treatmentDuration}
                          </p>
                        </div>

                        {/* Follow-Up Protocol */}
                        {medication.followUpProtocol && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Follow-Up Protocol
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.followUpProtocol}
                            </p>
                          </div>
                        )}

                        {/* Additional Notes */}
                        {medication.additionalNotes && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-teal-800">
                              Additional Notes
                            </h4>
                            <p className="rounded bg-white p-2 text-sm text-gray-700">
                              {medication.additionalNotes}
                            </p>
                          </div>
                        )}
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
  const validateForm = () => {
    let newErrors = {};

    // Validate Medication Name
    if (!medformData?.medicationName?.trim()) {
      newErrors.medicationName = "Medication Name is required.";
    }

    // Validate Dosage (must be a positive number)
    if (
      !medformData?.dosage ||
      isNaN(medformData.dosage) ||
      Number(medformData.dosage) <= 0
    ) {
      newErrors.dosage = "Dosage must be a valid positive number.";
    }

    // Validate Treatment Duration (must be a positive number)
    if (
      !medformData?.treatmentDuration ||
      isNaN(medformData.treatmentDuration) ||
      Number(medformData.treatmentDuration) <= 0
    ) {
      newErrors.treatmentDuration =
        "Treatment Duration must be a valid positive number.";
    }

    // Validate Follow-Up Protocol
    if (!medformData?.followUpProtocol?.trim()) {
      newErrors.followUpProtocol = "Follow-up Protocol is required.";
    }

    // Debugging log to check errors
    console.log("Validation Errors:", newErrors);

    // Set errors in state
    setErrors(newErrors);

    // Return false if errors exist
    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    // Return true if no errors
    return true;
  };

  const MedicationForm = () => {
    // Sample data for AI completion
    console.log(patient);
    console.log("dpppp");
    console.log(patient);
    const medicationList = [
      "Paracetamol",
      "Ibuprofen",
      "Amoxicillin",
      "Ciprofloxacin",
      "Metformin",
      "Aspirin",
    ]; // Example medication list

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

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setmedFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", // Clear the error message
      }));

      setInteractionAlert(null);

      if (name === "medicationName") {
        setInteractionAlert(null); // Reset the interaction alert

        if (value.length > 0) {
          const suggestions = medicationList.filter((med) =>
            med.toLowerCase().includes(value.toLowerCase()),
          );
          setFilteredMedications(suggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false); // Hide suggestions for other fields
      }
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
    const contraindications = {
      aspirin: ["Bleeding disorders", "Asthma"],
      ibuprofen: ["Kidney disease", "Stomach ulcers"],
      warfarin: ["Pregnancy", "Liver disease"],
    };
    const handleContradictionCheck = () => {
      const medName = medformData.medicationName.toLowerCase();

      if (contraindications[medName]) {
        setInteractionAlert({
          type: "warning",
          title: "Potential Contraindications Detected",
          message: `${medformData.medicationName} may be contraindicated for: ${contraindications[medName].join(", ")}`,
        });
      } else {
        setInteractionAlert({
          type: "success",
          title: "No Known Contraindications",
          message: "No known contraindications found in database.",
        });
      }
    };

    const handleSuggestionClick = (medication) => {
      setmedFormData((prev) => ({ ...prev, medicationName: medication }));
      setShowSuggestions(false);
    };

    return (
      <div className="mx-auto mt-0 max-w-4xl p-6" style={{ width: "65vw" }}>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-teal-700">
                  Medication ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={medformData?.medicationId || medId}
                    className="w-full rounded-md border bg-gray-50 p-2"
                    disabled
                  />
                </div>
              </div>

              <div className=" relative">
                <label className="block text-sm font-medium text-teal-700">
                  Medication Name
                </label>
                <input
                  type="text"
                  name="medicationName"
                  value={medformData?.medicationName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                  required
                />
                {showSuggestions && (
                  <ul className="absolute inset-x-0 z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-md">
                    {filteredMedications.length > 0 ? (
                      filteredMedications.map((medication, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(medication)}
                          className="cursor-pointer px-3 py-2 hover:bg-teal-100"
                        >
                          {medication}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-500">
                        No matches found
                      </li>
                    )}
                  </ul>
                )}
                {errors.medicationName && (
                  <p className="text-sm text-red-500">
                    {errors.medicationName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-teal-700">
                    Dosage
                  </label>
                  <input
                    type="number"
                    name="dosage"
                    value={medformData?.dosage}
                    onChange={handleInputChange}
                    className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  {errors.dosage && (
                    <p className="text-sm text-red-500">{errors.dosage}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-teal-700">
                    Treatment Duration
                  </label>
                  <input
                    type="number"
                    name="treatmentDuration"
                    value={medformData?.treatmentDuration}
                    onChange={handleInputChange}
                    className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  {errors.treatmentDuration && (
                    <p className="text-sm text-red-500">
                      {errors.treatmentDuration}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-teal-700">
                  Follow-up Protocol
                </label>
                <textarea
                  name="followUpProtocol"
                  value={medformData?.followUpProtocol}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  required
                />
                {errors.followUpProtocol && (
                  <p className="text-sm text-red-500">
                    {errors.followUpProtocol}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-teal-700">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={medformData?.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                  rows="3"
                />
              </div>
              <div className="space-y-4">
                {/* Buttons for checking interactions and contraindications */}
                <div className="flex space-x-4">
                  <button
                    onClick={checkInteractions}
                    className="rounded-md bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                  >
                    Check Drug Interactions
                  </button>

                  <button
                    onClick={handleContradictionCheck}
                    className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Check Contraindications
                  </button>
                </div>

                {/* Display alert for interactions or contraindications */}
                {interactionAlert && (
                  <div
                    className={`mt-4 rounded-md p-4 ${
                      interactionAlert.type === "warning"
                        ? "border-l-4 border-yellow-500 bg-yellow-100 text-yellow-700"
                        : "border-l-4 border-green-500 bg-green-100 text-green-700"
                    }`}
                  >
                    <strong className="block">{interactionAlert.title}</strong>
                    <p>{interactionAlert.message}</p>
                  </div>
                )}
              </div>
            </div>
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

  const handleSubmitMedication = async () => {
    try {
      await submitMedication({
        medformData,
        isEditMode,
        patient,
        onClose,
        onSubmit,
        setmedFormData,
        generateMedicationId,
      });
    } catch (error) {
      console.error("Error in handleSubmitMedication:", error);
    }
  };
  const handleSubmitClick = async () => {
    const isValid = validateForm();
    console.log("Validation Result:", isValid);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      await handleSubmitMedication();
    } catch (error) {
      console.error('Error submitting medication:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="mx-auto !mt-0 flex !min-h-0 max-w-6xl flex-col  p-6">
        <div className="mb-0 text-center">
         
        </div>
        <div className="my-0 flex justify-center gap-2">
          {Array.from({ length: pages.length }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                // onClick={() => setCurrentPage(pageNum)}
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
        <div className="mb-0 flex-1 overflow-auto">
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
                    className="flex items-center gap-2 rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#007664]/80 disabled:bg-[#007664]/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Submitting..."}
                      </>
                    ) : isEditMode ? (
                      "Update Medication"
                    ) : (
                      "Submit Medication"
                    )}
                  </button>
                </div>
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

export function ViewMedication({ medic, isOpen, onClose }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
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
                    value={medic.medicationName}
                    highlight
                  />
                  <InfoItem label="Dosage" value={medic.dosage} highlight />

                  <InfoItem
                    label="Medication Duration"
                    value={medic.treatmentDuration}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#B24531]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Follow Up Protocol
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InfoItem
                    label="Follow Up Protocol"
                    value={medic.followUpProtocol}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeIn} className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-2 rounded-full bg-[#007669]" />
              <h2 className="text-xl font-bold text-[#007664]">
                Additional Notes
              </h2>
            </div>
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InfoItem
                    label="Adiitional Notes"
                    value={medic.additionalNotes}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
