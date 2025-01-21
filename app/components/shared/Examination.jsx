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
import { ViewMedication,NewMedicationForm } from "../../components/shared";
import { NewDiagnosisForm ,ViewDiagnosis,EditDiagnosisForm} from "../../components/shared";
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

export function EditExamination ({ buttonText, onSubmit, consultationData }) {
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

  
export function NewExamination ({ onTabChange }) {
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
    const handleClick = () => {
      onTabChange("labresult"); // Change tab to "consultations"
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
                 className="mx-auto max-w-4xl space-y-8 p-6"
                 style={{ width: "65vw" }}
               >
                 <Card className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1">
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
                    handleClick();
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

export function ViewExamination  ({ consult, isOpen, onClose }) {
  const InfoItem = ({ label, value }) => (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
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
  