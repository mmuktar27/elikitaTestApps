
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
export function NewDiagnosisForm ({ onTabChange }) {
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

              {/* Primary Diagnosis */}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#007664]">
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
                  <div
                    key={index}
                    className="space-y-2 rounded-md border p-4"
                  >
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

              {/* Additional Note */}
              <div className="space-y-2">
                <label
                  htmlFor="symptoms"
                  className="block text-sm font-medium text-[#007664]"
                >
                  Additional Notes
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formdiagnosisData.symptoms}
                  onChange={handleInputChange}
                  placeholder="Addition Details"
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
                  <Label htmlFor="expectedOutcome" className="text-[#007664]">
                    Expected Outcome
                  </Label>
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
                  <Label htmlFor="timeframe" className="text-[#007664]">
                    Timeframe
                  </Label>
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
                  <Label htmlFor="riskLevel" className="text-[#007664]">
                    Risk Level
                  </Label>
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
                  <Label
                    htmlFor="recoveryPotential"
                    className="text-[#007664]"
                  >
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
              <div className="space-y-2">
                <label
                  htmlFor="symptoms"
                  className="block text-sm font-medium text-[#007664]"
                >
                  Additional Notes
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value=" "
                  onChange={handleInputChange}
                  placeholder="Addition Details"
                  className="h-24 w-full rounded-md border bg-white p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#53FDFD]"
                />
              </div>
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold text-[#007664]">
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
                        className="text-sm font-medium text-[#007664]"
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
                  <Label htmlFor="appointmentType" className="text-[#007664]">
                    Appointment Type
                  </Label>
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

export function ViewDiagnosis ({ diagnosis, isOpen, onClose }) {


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

export function EditDiagnosisForm ({ buttonText, onSubmit, diagnosesData }) {
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