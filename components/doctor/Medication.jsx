'use client'
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
import { motion } from "framer-motion";
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



export function NewMedicationForm() {
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
                          <h4 className="font-medium text-teal-800">Dosage</h4>
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
                <div className="flex items-center justify-start gap-4 ">
                  <button
                    type="button"
                    onClick={checkInteractions}
                    className="w-auto rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    Check Drug Interactions
                  </button>

                  <button
                    type="button"
                    onClick={handleContradictionCheck} // Add this function for contradiction checking
                    className="w-auto rounded-md bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Check Contradictions
                  </button>
                </div>

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
                    onClick={() => {
                      // Submit logic here
                    }}
                    className="flex items-center rounded-lg bg-[#007664] px-6 py-3 text-sm font-medium text-white transition-colors  duration-200 hover:bg-[#007664]/80"
                  >
                    Submit
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



export  function ViewMedication({ medic, isOpen, onClose }) {
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
                  value="This a Follow Up Protocol"
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
                  value="This is an Adiitional notes"
                />
                
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DialogContent>
  </Dialog>
  )
}

