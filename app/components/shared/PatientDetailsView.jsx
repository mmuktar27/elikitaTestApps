

import React, { useState, useEffect } from 'react';

// Lucide Icons
import { 
  ChevronLeft, 
  TemperatureIcon, 
  HeartIcon, 
  PulseIcon, 
  RulerIcon, 
  ScaleIcon, 
  AlertCircle, 
  OxygenIcon, 
  LungsIcon, 
  ChevronRight, 
  Beaker, 
  Activity, 
  Heart, 
  FlaskConical, 
  Check, 
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
  Users, Printer,ChevronUp ,TrendingUp ,
  X, 
} from 'lucide-react';
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// UI Components

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

import { 
  Avatar, AvatarFallback, AvatarImage 
} from '@/components/ui/avatar';

import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Alert, AlertDescription, AlertTitle 
} from '@/components/ui/alert';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {

  SmartConsultation
} from "../../components/shared";
// Charts
import Image from 'next/image';
import eye from './eye.png';
import leg from './leg.png';
import pallor from './pallor.png';
import curbing from './curbbin.png';
import cybosis from './cybosis.png';
import main from './main.png';
// Third-party Modal
import Modal from 'react-modal';

const consultationSteps = [
  { key: 'chiefcomplaint', label: 'Chief Complaint' },
  { key: 'symptoms', label: 'Symptoms' },
  { key: 'examination', label: 'Examination' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'treatmentplan', label: 'Treatment Plan' }
]

const vitalSigns = [
  { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
  { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
  { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 }
]

const labResults = [
  { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
  { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
  { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
  { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 }
]
const PatientDetailsView = ({ patient, onClose , SelectedPatient }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [showConsultationForm, setShowConsultationForm] = useState(false);
   const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [itemToDelete, setItemToDelete] = useState(null);
   const [completedTasks, setCompletedTasks] = useState([]);
 const [labtestFormData, setlabtestFormData]=useState([]);
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
         window.addEventListener('resize', checkScreenWidth); // Listen for resize
         return () => window.removeEventListener('resize', checkScreenWidth); // Cleanup
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
  }
    const handleFormSubmit = async (actionType) => {
    setIsLoading(true);
   
    setIsLoading(false);
    setIsAddOpen(false); // Close dialog after submission
  };
   const handleDialogChange = (isOpen, actionType) => {
    if (actionType === 'add' && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddOpen(isOpen);
  };
  const handleDialogChangelabtest = (isOpen, actionType) => {
    if (actionType === 'add' && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddlabtestOpen(isOpen);
  };
  const handleDialogDChange = (isOpen, actionType) => {
    if (actionType === 'add' && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddDOpen(isOpen);
  };
   const handleDialogmChange = (isOpen, actionType) => {
    if (actionType === 'add' && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddmOpen(isOpen);
  };
   const handleDialoglabChange= (isOpen, actionType) => {
    if (actionType === 'add' && isOpen) {
      // Handle any logic when the dialog opens (e.g., reset form, etc.)
    }
    setIsAddlabOpen(isOpen);
  }

  const handleDialogViewConsult= (isOpen) => {
   
    setIsViewConsultOpen(isOpen);
  }
  const handleCallClick =()=>{

  }

  const handleDialogViewMed= (isOpen) => {
   
    setIsViewMedOpen(isOpen);
  }

  const handleDialogViewDiagnosis= (isOpen) => {
   
    setIsViewDiagOpen(isOpen);
  }
  const startDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = (item) => {
    console.log('Deleting item:', item);
    // Perform delete action here
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteDialog(false);
  };
  const handleEditSubmit = () => {
    // Add logic to update the consultation
    console.log('Updated Consultation:', newConsultation);
  
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <p className="mt-2">Are you sure you want to delete this item?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              className="px-4 py-2 text-white bg-teal-700 hover:bg-teal-800 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white bg-red-700 hover:bg-red-800 rounded"
              onClick={() => onConfirm(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };


  const NewDiagnosisForm = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]); 
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [expandedDiagnosis, setExpandedDiagnosis] = React.useState(null);
    const [formDatadiagnosis, setFormDatadiagnosis] = useState({
      diagnosisName: '',
      icdCode: '',
      severity: '',
      category: '',
      otherCategory: '',
      priority: '',
      chronicityStatus: '',
      progressionStage: '',
      symptoms: '',
      vitalSigns: '',
      labResults: '',
      differentialDiagnosis: '',
      treatment: '',
      precautions: '',
      contraindications: '',
      expectedOutcomes: '',
      followUpProtocol: '',
      evidenceBase: ''
    });
  
    const [formDataprog, setFormDataprog] = useState({
      diagnosisId: '',
      expectedOutcome: '',
      otherOutcome: '',
      timeframe: '',
      survivalRate: '',
      riskLevel: '',
      recoveryPotential: '',
      complications: '',
      longTermEffects: '',
      lifestyleModifications: '',
      monitoringRequirements: '',
      followUpSchedule: '',
      additionalNotes: ''
    });
    const [sicknessSections, setSicknessSection] =useState({
    
      generalSymptoms: {
        title: "General Symptoms",
        subsections: {
          fever: {
            title: "Fever",
            fields: [
              { name: "feverDuration", label: "Duration (Days)", type: "text" },
              { name: "feverNature", label: "Nature", type: "select", options: ["Everyday", "Alternative", "Irregular", "Others"] },
              { name: "feverType", label: "Type", type: "select", options: ["All day", "Morning", "Evening", "Night", "Others"] },
              { name: "feverIntensity", label: "Intensity", type: "select", options: ["High", "Low", "High and Low", "None", "Others"] },
              { name: "shivers", label: "Shivers?", type: "radio", options: ["Yes", "No"] },
              { name: "associatedSymptoms", label: "Associated Symptoms?", type: "radio", options: ["Yes", "No"], requiresSpecify:true },

              { name: "cough", label: "Cough?", type: "radio", options: ["Yes", "No"] },
              { name: "coughWithBleeding", label: "Cough with bleeding?", type: "radio", options: ["Yes", "No"] },
              { name: "pain", label: "Any Pain?", type: "radio", options: ["Yes", "No"], requiresSpecify: true },

              { name: "generalWeakness", label: "General Weakness?", type: "radio", options: ["Yes", "No"] },
              { name: "lossOfWeight", label: "Loss of weight?", type: "radio", options: ["Yes", "No"] },
              { name: "burningInUrine", label: "Burning in urine?", type: "radio", options: ["Yes", "No"] },
              { name: "causes", label: "What causes it?", type: "text" },
              { name: "reliefs", label: "What relieves it?", type: "text" },
              { name: "bodyTemperature", label: "Body temperature", type: "autofilled" },
              { name: "chillsSweating", label: "Chills or sweating", type: "radio", options: ["Yes", "No"] },
              { name: "fatigueWeakness", label: "Fatigue or weakness", type: "radio", options: ["Yes", "No"] },
              { name: "bodyAches", label: "Body aches", type: "radio", options: ["Yes", "No"] }
            ]
          },
          generalWeakness: {
            title: "General Weakness/Fatigue",
            fields: [
              { name: "weaknessDuration", label: "Duration (Days)", type: "text" },
              { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Decreased", "Others"] },
              { name: "weightChange", label: "Change in Weight", type: "select", options: ["Increased", "Decreased", "No Change", "Others"] },
              { name: "abdominalPain", label: "Abdominal Pain?", type: "radio", options: ["Yes", "No"] },
              { name: "chestPain", label: "Chest Pain?", type: "radio", options: ["Yes", "No"] },
              { name: "fever", label: "Fever?", type: "radio", options: ["Yes", "No"] },
              { name: "cough", label: "Cough?", type: "radio", options: ["Yes", "No"] },
              { name: "diarrhea", label: "Diarrhea?", type: "radio", options: ["Yes", "No"] },
              { name: "constipation", label: "Constipation?", type: "radio", options: ["Yes", "No"] }
            ]
          },
          specificWeakness: {
            title: "Specific Weakness",
            fields: [
              { name: "specificWeaknessDuration", label: "Duration (Days)", type: "text" },
              { name: "weaknessLocation", label: "Location of Weakness", type: "text" },
              { name: "historyOfInjury", label: "History of Injury (H/O injury)?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "startCause", label: "How did it start?", type: "text" },
              { name: "progress", label: "Progress", type: "select", options: ["Same as Before", "Improving", "Worsening", "Others"] }
            ]
          },
          dizziness: {
            title: "Dizziness",
            fields: [
              { name: "dizzinessDuration", label: "Duration (Days)", type: "text" },
              { name: "dizzinessNature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
              { name: "dizzinessType", label: "Type", type: "select", options: ["Whole Day", "Morning", "Evening", "Others"] },
              { name: "dizzinessCause", label: "What causes it?", type: "text" },
              { name: "dizzinessRelief", label: "What relieves it?", type: "text" },
              { name: "relationWithPosition", label: "Relation with Position", type: "select", options: ["Lying Down", "Standing Up", "Moving Neck", "Opening Eyes", "None", "Others"] },
              { name: "historyOfFainting", label: "History of Fainting?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "historyOfFall", label: "History of Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Vomiting", "Chest Pain", "Breathlessness", "Pain in Ear", "None", "Others"] },
              { name: "vision", label: "Vision", type: "select", options: ["All Right", "Diminished", "Others"] },
              { name: "hearing", label: "Hearing", type: "select", options: ["Normal", "Less", "Others"] }
            ]
          },
          fainting: {
            title: "Fainting",
            fields: [
              { name: "faintingEpisodes", label: "Number of Episodes", type: "text" },
              { name: "intervalBetweenEpisodes", label: "Interval Between Episodes", type: "text" },
              { name: "consciousnessLost", label: "Is Consciousness Lost?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "associatedFits", label: "Any Associated Fits?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "fall", label: "Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "dizziness", label: "Dizziness?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "faintingCause", label: "What Brings It On?", type: "text" },
              { name: "faintingRelief", label: "How Is It Relieved?", type: "text" }
            ]
          },
          headache: {
            title: "Headache",
            fields: [
              { name: "painLocation", label: "Pain Location", type: "select", options: ["Forehead", "Temples", "Behind the Eyes", "Top of the Head", "Back of the Head", "One Side of the Head", "Neck", "Other (Specify)"] },
              { name: "painIntensity", label: "Intensity", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
              { name: "durationOfHeadache", label: "Duration of Headache", type: "select", options: ["Less than 1 Hour", "1-3 Hours", "3-6 Hours", "6-12 Hours", "More than 12 Hours", "Intermittent", "Continuous", "Other (Specify)"] },
              { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Nausea", "Sensitivity to Light", "Sensitivity to Sound", "Others"] }
            ]
          }
        }
      },
            gastrointestinalIssues: {
          title: "Gastrointestinal Issues",
          subsections: {
            acidityIndigestion: {
              title: "Acidity/Indigestion",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "abdominalPain", label: "Any Abdominal Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "vomiting", label: "Any Vomiting?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "nausea", label: "Nausea?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bowelHabitChange", label: "Change in Bowel Habit?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Less", "Others"] },
                { name: "constipation", label: "Constipation?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "diarrhea", label: "Diarrhea?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "cause", label: "What causes it?", type: "text" },
                { name: "worsens", label: "What worsens it?", type: "text" },
                { name: "jaundiceHistory", label: "History of Jaundice?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "alcohol", label: "Alcohol Ingestion?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "smoking", label: "History of Smoking?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "weightChange", label: "Change in Weight?", type: "select", options: ["Increased", "Decreased", "Did Not Change", "Others"] }
              ]
            },
            diarrhea: {
              title: "Diarrhea",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "stoolType", label: "Stool Type", type: "select", options: ["Watery", "Soft", "Ill-formed", "Others"] },
                { name: "nature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
                { name: "frequency", label: "Frequency", type: "text" },
                { name: "blood", label: "With Blood?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Any Associated Symptoms?", type: "multi-select", options: ["Vomiting", "Abdominal Pain", "Fever", "None", "Others"] },
                { name: "relationWithFood", label: "Any Relation with Food?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "currentMedications", label: "Any Current Medications?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            vomiting: {
              title: "Vomiting",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "nature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
                { name: "frequency", label: "Frequency", type: "text" },
                { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Less", "Others"] },
                { name: "cause", label: "What causes it?", type: "text" },
                { name: "relief", label: "What relieves it?", type: "text" },
                { name: "blood", label: "With Blood?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Abdominal Pain", "Headache", "Diarrhea", "Constipation", "None", "Others"] },
                { name: "nausea", label: "Nausea?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            abdominalPain: {
              title: "Abdominal Pain",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "startLocation", label: "Where did it start?", type: "select", options: ["Upper (R)", "Upper (C)", "Upper (L)", "Middle (R)", "Middle (C)", "Middle (L)", "Lower (R)", "Lower (C)", "Lower (L)", "All Over", "Others"] },
                { name: "currentLocation", label: "Where is it now?", type: "select", options: ["Upper (R)", "Upper (C)", "Upper (L)", "Middle (R)", "Middle (C)", "Middle (L)", "Lower (R)", "Lower (C)", "Lower (L)", "All Over", "Others"] },
                { name: "painStart", label: "How did the pain start?", type: "select", options: ["Sudden", "Gradual", "Others"] },
                { name: "intensity", label: "Intensity", type: "select", options: ["Mild", "Moderate", "Severe", "Varies", "Others"] },
                { name: "nature", label: "Nature", type: "select", options: ["Continuous", "Comes and Goes", "Sometimes Worse", "Others"] },
                { name: "triggers", label: "What brings it on?", type: "select", options: ["Food", "Empty Stomach", "Period", "None", "Others"] },
                { name: "relief", label: "What relieves it?", type: "select", options: ["Food", "Vomiting", "None", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Constipation", "Diarrhea", "Vomiting", "Loss of Appetite", "None", "Others"] }
              ]
            },
            bleedingWithStool: {
              title: "Bleeding with Stool",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "stoolColor", label: "Color of Stool", type: "select", options: ["Bright Red", "Dark Red", "Others"] },
                { name: "amount", label: "Amount of Stool", type: "select", options: ["Lot", "Drops", "Others"] },
                { name: "painDuringPassing", label: "Pain During Passing Stool?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bowelHabitChange", label: "Change in Bowel Habit?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "constipation", label: "Constipation?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "diarrhea", label: "Diarrhea?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            ulcer: {
              title: "Ulcer",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "location", label: "Where?", type: "text" },
                { name: "startCause", label: "How did it start?", type: "select", options: ["Injury", "On its Own", "Others"] },
                { name: "pain", label: "Any Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "surface", label: "Surface", type: "select", options: ["Clean", "Dirty", "Pink", "Black", "Green", "Mixed", "Others"] },
                { name: "edges", label: "Edges", type: "select", options: ["Raised", "Flat", "Others"] },
                { name: "size", label: "Size", type: "text" }
              ]
            }
          }
        },
          respiratoryIssues: {
          title: "Respiratory Issues",
          subsections: {
            coughThroatProblem: {
              title: "Cough/Throat Problem",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "frequency", label: "How Often?", type: "select", options: ["All Day", "In the Morning", "At Night", "Sometimes", "Others"] },
                { name: "sputum", label: "Is there any Sputum?", type: "radio", options: ["Yes", "No"] },
                { name: "sputumColor", label: "Color of the Sputum", type: "select", options: ["Yellow", "Green", "Others"] },
                { name: "sputumAmount", label: "Amount of Sputum", type: "select", options: ["Lot", "Medium", "Small", "Others"] },
                { name: "fever", label: "Is there any Fever?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "difficultySwallowing", label: "Is there any Difficulty in Swallowing?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "throatPain", label: "Is there any Pain in the Throat?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "breathingDifficulty", label: "Is there any Difficulty in Breathing?", type: "radio", options: ["Yes", "No", "Others"] }
              ]
            },
            shortnessOfBreath: {
              title: "Difficulty in Breathing/Shortness of Breath",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "progression", label: "How has it progressed?", type: "select", options: ["Same as Before", "Worsening", "Improving", "Varies with Reason", "Others"] },
                { name: "triggers", label: "What brings it on?", type: "select", options: ["Exertion", "Climbing Stairs", "None", "Others"] },
                { name: "relief", label: "What relieves it?", type: "select", options: ["Rest", "Sitting Up", "None", "Others"] },
                { name: "wakesAtNight", label: "Does it wake you up at night?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "chestPain", label: "Any Chest Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "cough", label: "Any Cough?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["General Weakness", "Fever", "Others"] }
              ]
            },
            soreThroat: {
              title: "Sore Throat",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "severity", label: "Severity", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
                { name: "painLevel", label: "Pain Level", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
                { name: "painLocation", label: "Pain Location", type: "select", options: ["Left Side", "Right Side", "Both Sides", "Back of Throat", "Others"] },
                { name: "difficultySwallowing", label: "Difficulty Swallowing?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "voiceChanges", label: "Voice Changes?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Fever", "Cough", "Runny Nose", "Ear Pain", "Swollen Glands", "Others"] },
                { name: "recentIllness", label: "Recent Illness or Exposure to Illness?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            }
          }
        },
        
         urinaryAndReproductiveHealth: {
          title: "Urinary and Reproductive Health",
          subsections: {
            yellowUrine: {
              title: "Yellow Urine",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "number" },
                { name: "abdominalPain", label: "Abdominal Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "fever", label: "Fever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "stoolColor", label: "Color of Stool?", type: "select", options: ["Normal", "Others"] },
                { name: "burningWithUrine", label: "Burning with Urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "generalWeakness", label: "General Weakness?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            urinaryIssues: {
              title: "Urinary Issues",
              fields: [
                { name: "symptomsDuration", label: "How long have you felt the symptoms?", type: "number" },
                { name: "frequencyPerDay", label: "Number of times/day?", type: "number" },
                { name: "frequencyNature", label: "Nature of frequency?", type: "select", options: ["All day", "More at night", "Others"] },
                { name: "burningNature", label: "Nature of burning?", type: "select", options: ["Only at the beginning", "All through passing urine", "Others"] },
                { name: "burningColor", label: "Color of burning?", type: "select", options: ["Normal", "Dark Yellow", "Others"] },
                { name: "fever", label: "Is there any fever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bloodInUrine", label: "Any blood in urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "urineHolding", label: "Can you hold urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "urineStream", label: "How is the stream?", type: "select", options: ["As before", "Weak", "Others"] }
              ]
            },
            menstrualIssues: {
              title: "Menstrual Issues",
              fields: [
                { name: "hadPeriod", label: "Did you have period ever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "firstPeriod", label: "When was your first period?", type: "date" },
                { name: "periodFrequency", label: "How often do your periods take place?", type: "select", options: ["Regular", "Irregular", "Others"] },
                { name: "menstrualFlow", label: "How much is your menstrual flow?", type: "select", options: ["Light", "Moderate", "Heavy", "Don't know", "Others"] },
                { name: "daysWithFlow", label: "Number of days with active menstrual flow", type: "number" },
                { name: "painDuringPeriod", label: "Do you experience lower abdominal pain or cramps?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "otherSymptoms", label: "Any other symptoms during menstruation or 2 days before it?", type: "select", options: ["Mood swing", "Tiredness", "Trouble sleeping", "Upset stomach", "Headache", "Acne", "None", "Others"] },
                { name: "symptomsDisappear", label: "Do these symptoms disappear after menstruation?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            sexualHealthIssues: {
              title: "Sexual Health Issues",
              fields: [
                { name: "married", label: "Married?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lmp", label: "Date of LMP?", type: "date" },
                { name: "periodDuration", label: "Duration of period", type: "number" },
                { name: "durationRegular", label: "Duration Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "intervalBetweenPeriods", label: "Interval between periods", type: "number" },
                { name: "intervalRegular", label: "Interval Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "flow", label: "Flow", type: "select", options: ["Normal", "Heavy", "Low", "Varies", "Others"] },
                { name: "numberOfChildren", label: "Number of children", type: "number" },
                { name: "numberOfPregnancies", label: "Number of pregnancies", type: "number" },
                { name: "firstChildbirthAge", label: "Age at first childbirth", type: "number" },
                { name: "lastChildbirthAge", label: "Age at last childbirth", type: "number" },
                { name: "contraceptionPractice", label: "Contraception practice?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "discharge", label: "Any discharge?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bleedingBetweenPeriods", label: "Bleeding between periods?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "pain", label: "Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "itching", label: "Itching?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            prenatalIssues: {
              title: "Prenatal Issues",
              fields: [
                { name: "married", label: "Married?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lmp", label: "Date of LMP?", type: "date" },
                { name: "duration", label: "Duration of period (days)", type: "number" },
                { name: "durationRegular", label: "Duration Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "interval", label: "Interval between periods (days)", type: "number" },
                { name: "intervalRegular", label: "Interval Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "flow", label: "Flow", type: "select", options: ["Normal", "Heavy", "Low", "Varies", "Others"] },
                { name: "painDuringIntercourse", label: "Pain during intercourse?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            pregnancy: {
              title: "Pregnancy",
              fields: [
                { name: "sexuallyActive", label: "Are you sexually active?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lastIntercourse", label: "When was the last sexual intercourse(s) that may have caused the pregnancy?", type: "date" },
                { name: "lastMenstrualPeriod", label: "When was your last menstrual period?", type: "date" },
                { name: "menstrualCyclesRegular", label: "Are your menstrual cycles generally regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "previousPregnancy", label: "Have you been pregnant before?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "pregnancyOutcome", label: "If YES to the above, what was the pregnancy outcome?", type: "select", options: ["Childbirth", "Abortion/Medical", "Others"] },
                { name: "forcedSexualEvent", label: "Was there any forced sexual event?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            familyPlanning: {
              title: "Family Planning/Contraceptives",
              fields: [
                { name: "contraceptiveMethod", label: "Have you ever used a contraceptive method?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "methodUsed", label: "If YES, which method have you used?", type: "select", options: ["Pill", "Injection", "IUD (Mirena)", "IUD CU", "Implant", "Male Condom", "Female Condom", "Natural Awareness Method", "Tube Litigation", "Vasectomy (Male surgery)", "Others"] },
                { name: "adoptMethod", label: "If NO, would you like to adopt a method?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "planningChildren", label: "Are you planning to have any more children?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            }
          }
        },
        
      skinAndExternalConditions: {
        title: "Skin and External Conditions",
        subsections: {
          boils: {
            title: "Boils",
            fields: [
              { name: "boilLocation", label: "Where are the boils located, and have you had similar issues in the past?", type: "text" },
              { name: "boilDuration", label: "Duration (Days)", type: "number" },
              { name: "boilWhere", label: "Where?", type: "text" },
              { name: "boilStart", label: "How did it start?", type: "select", options: ["Injury", "On its own", "Others"] },
              { name: "boilPain", label: "Any Pain?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "boilSkinColor", label: "Color of Skin Over the Boil", type: "select", options: ["Normal", "Red", "Others"] }
            ]
          },
          skinRash: {
            title: "Skin Rash",
            fields: [
              { name: "rashDuration", label: "Duration (Days)", type: "number" },
              { name: "rashLocation", label: "Where?", type: "text" },
              { name: "rashSize", label: "Size", type: "text" },
              { name: "rashCount", label: "How many?", type: "select", options: ["Single", "Multiple", "Many", "Others"] },
              { name: "rashSurface", label: "Surface", type: "select", options: ["Smooth", "Rough", "Others"] },
              { name: "rashColor", label: "Color", type: "select", options: ["Red", "Pink", "Brown", "White", "Yellow", "Others"] }
            ]
          },
          injury: {
            title: "Injury",
            fields: [
              { name: "injuryDuration", label: "Duration (Days)", type: "number" },
              { name: "injuryLocation", label: "Where is it?", type: "text" },
              { name: "injuryCause", label: "How sustained?", type: "select", options: ["Fall (at home)", "Fall (on road)", "Fall (from height)", "Hit by car", "Hit by bike", "Hit by cycle", "Crushed in machine", "Cut", "Violence", "Others"] },
              { name: "injuryProblem", label: "Problem", type: "select", options: ["Cant walk", "Cant move", "Pain", "Others"] },
              { name: "injuryBleeding", label: "Any bleeding?", type: "select", options: ["Yes", "No", "Others"] }
            ]
          }
        }
      },
      cardiovascularIssues: {
        title: "Cardiovascular Issues",
        subsections: {
          palpitations: {
            title: "Palpitations",
            fields: [
              { name: "palpitationDuration", label: "Duration (Days)", type: "number" },
              { name: "palpitationType", label: "Type", type: "select", options: ["Intermittent", "Always", "Others"] },
              { name: "palpitationDurationDetail", label: "How long does it last?", type: "text" },
              { name: "palpitationAssociatedSymptoms", label: "Associated symptoms", type: "select", options: ["Dizziness", "Shortness of breath", "Chest pain", "Fatigue", "Others"] },
              { name: "palpitationFainting", label: "Fainting?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationFall", label: "Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationDizziness", label: "Dizziness?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationTriggers", label: "What brings it on?", type: "text" },
              { name: "palpitationRelief", label: "How is it relieved?", type: "text" }
            ]
          }
        }
      },
      otherSymptoms: {
        title: "Other",
        subsections: {
          symptoms: {
            title: "Other Symptoms",
            fields: [
              { name: "otherSpecify", label: "Other (Specify)", type: "text" },
              { name: "otherDuration", label: "Duration (Days)", type: "number" },
              { name: "otherLocation", label: "Location of symptoms", type: "text" },
              { name: "otherType", label: "Type of symptoms", type: "text" },
              { name: "otherSeverity", label: "Severity of symptoms", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
              { name: "otherFrequency", label: "Frequency of symptoms", type: "select", options: ["Intermittent", "Constant", "Others"] },
              { name: "otherAssociatedSymptoms", label: "Associated symptoms", type: "text" },
              { name: "otherTriggers", label: "Triggers", type: "text" },
              { name: "otherAlleviatingFactors", label: "Alleviating factors", type: "text" }
            ]
          }
        }
      }
      
        })
        useEffect(() => {
          const newFilteredComplaints = {};
          
          selectedComplaints.forEach(complaint => {
            // Find the section key (e.g., 'generalSymptoms')
            const sectionKey = Object.keys(sicknessSections).find(
              key => sicknessSections[key].title === complaint.section
            );
            
            if (!sectionKey) return;
            
            // Find the subsection key (e.g., 'fever')
            const subsectionKey = Object.keys(sicknessSections[sectionKey].subsections).find(
              key => sicknessSections[sectionKey].subsections[key].title === complaint.subsection
            );
            
            if (!subsectionKey) return;
            
            // Initialize section if it doesn't exist
            if (!newFilteredComplaints[sectionKey]) {
              newFilteredComplaints[sectionKey] = {
                title: sicknessSections[sectionKey].title,
                subsections: {}
              };
            }
            
            // Add the subsection with all its fields
            newFilteredComplaints[sectionKey].subsections[subsectionKey] = {
              ...sicknessSections[sectionKey].subsections[subsectionKey]
            };
          });
          
          setFilteredComplaints(newFilteredComplaints);
        }, [selectedComplaints, sicknessSections]);


  const [activeSection, setActiveSection] = useState(null);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
   
  
const MultiSectionSymptomsForm = (selectedSymptoms) => {


  const handleInputChange = (mainSection, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [mainSection]: {
        ...prev[mainSection],
        [subsection]: {
          ...prev[mainSection]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const renderField = (field, mainSection, subsectionKey) => {
    const value = formData[mainSection]?.[subsectionKey]?.[field.name] || "";

    const baseInputStyles = "w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            className={baseInputStyles}
            value={value}
            onChange={(e) => handleInputChange(mainSection, subsectionKey, field.name, e.target.value)}
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
            value === option ? "text-teal-800 font-bold" : "text-gray-700"
          }`}
        >
          <input
            type="radio"
            name={field.name}
            value={option}
            checked={value === option}
            onChange={(e) => {
              handleInputChange(mainSection, subsectionKey, field.name, e.target.value);
              if (field.requiresSpecify && option === "Yes") {
                handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, ""); // Initialize specify field
              } else if (field.requiresSpecify) {
                handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, null); // Clear specify field
              }
            }}
            className="hidden" // Hide the default radio button
          />
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              value === option ? "border-teal-800 bg-teal-800" : "border-gray-400"
            }`}
          ></div>
          <span>{option}</span>
        </label>
      ))}

      {/* Conditionally render the "If Yes, specify" field */}
      {field.requiresSpecify && value === "Yes" && (
        <div className="mt-2">
          <label className="block text-sm text-gray-700">If Yes, specify</label>
          <input
            type="text"
          
            onChange={(e) =>
              handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-teal-800"
          />
        </div>
      )}
    </div>
  );

        
  case "select":
    return (
      <div className={baseInputStyles}>
        <select
          className={baseInputStyles}
          value={value}
          onChange={(e) => handleInputChange(mainSection, subsectionKey, field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
  
        {/* Conditionally render the "If Others, specify" field when 'Others' is selected */}
        {value === "Others" && (
          <div className="mt-2">
            <label>If Others, specify</label>
            <input
              type="text"
              onChange={(e) => handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        )}
      </div>
    );
  
    case "multiselect":
  const selectedValues = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {field.options.map(option => (
        <label key={option} className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox text-[#75C05B] rounded border-[#007664] focus:ring-[#53FDFD]"
            checked={selectedValues.includes(option)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...selectedValues, option]
                : selectedValues.filter(v => v !== option);
              handleInputChange(mainSection, subsectionKey, field.name, newValues);
            }}
          />
          <span className="ml-2 text-[#007664]">{option}</span>
        </label>
      ))}

      {/* Show the "Specify" text box if "Others" is selected */}
      {selectedValues.includes("Others") && (
        <div className="mt-2">
          <label className="text-[#007664] block mb-1">If Others, specify:</label>
          <input
            type="text"
            value={field.specifyValue || ""} // Use a state or value for "Others" input
            onChange={(e) =>
              handleInputChange(
                mainSection,
                subsectionKey,
                `${field.name}_specify`,
                e.target.value
              )
            }
            className="w-full p-2 border-2 border-[#75C05B] rounded text-[#007664] focus:ring-[#007664] focus:ring-offset-2"
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
      className="bg-white rounded-lg border border-[#75C05B] hover:border-[#007664] transition-all duration-200"
      onMouseEnter={() => setActiveSection(subsectionKey)}
      onMouseLeave={() => setActiveSection(null)}
    >
      <div className="p-4 space-y-4">
        {subsection.fields.map(field => (
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

  ;
 
    const filtered = Object.keys(sicknessSections || {}).reduce((acc, sectionKey) => {
      const section = sicknessSections[sectionKey];
      
      if (!section.subsections || typeof section.subsections !== 'object') {
        return acc;
      }
  
      const filteredSubsections = Object.keys(section.subsections).reduce((subAcc, subsectionKey) => {
        const subsection = section.subsections[subsectionKey];
        
        const isSelected =selectedComplaints.section === section.title && selectedComplaints.subsection === subsection.title
    
        console.log(isSelected)
        if (isSelected) {
          subAcc[subsectionKey] = subsection;
        }
        return subAcc;
      }, {});
  
      if (Object.keys(filteredSubsections).length > 0) {
        acc[sectionKey] = {
          title: section.title,
          subsections: filteredSubsections,
        };
      }
      
      return acc;
    }, {});
    console.log(filteredComplaints)
   //setFilteredComplaints(filtered);
// Add dependencies that should trigger a re-filter
//
const renderDiagnosisSection = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-[#75C05B] mt-8">
    <div className="bg-[#007664] px-6 py-4">
      <h2 className="text-xl font-bold text-[#53FDFD]">Diagnosis</h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {/* Primary Diagnosis (FHIR: Condition.code) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Primary Diagnosis
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
   
            onChange={(e) => handleInputChange("diagnosis", "primary", "diagnosis", e.target.value)}
          />
        </div>

        {/* Secondary Diagnoses (FHIR: Condition.code) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Secondary Diagnoses
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
           
            onChange={(e) => handleInputChange("diagnosis", "secondary", "diagnosis", e.target.value)}
          />
        </div>

        {/* Differential Diagnoses (FHIR: Condition.code) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Differential Diagnoses
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
           
            onChange={(e) => handleInputChange("diagnosis", "differential", "diagnosis", e.target.value)}
          />
        </div>

        {/* Diagnosis Date (FHIR: Condition.onsetDateTime) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Diagnosis Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
    
            onChange={(e) => handleInputChange("diagnosis", "diagnosisDate", "date", e.target.value)}
          />
        </div>

        {/* Diagnosis Status (FHIR: Condition.status) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Diagnosis Status
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
           
            onChange={(e) => handleInputChange("diagnosis", "status", "status", e.target.value)}
          >
            <option value="">Select status...</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="remission">Remission</option>
            <option value="inactive">Inactive</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Diagnosis Verification Status (FHIR: Condition.verificationStatus) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Verification Status
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
      
            onChange={(e) => handleInputChange("diagnosis", "verificationStatus", "verificationStatus", e.target.value)}
          >
            <option value="">Select verification status...</option>
            <option value="unconfirmed">Unconfirmed</option>
            <option value="confirmed">Confirmed</option>
            <option value="differential">Differential</option>
            <option value="refuted">Refuted</option>
            <option value="entered-in-error">Entered in Error</option>
          </select>
        </div>

        {/* Diagnosis Category (FHIR: Condition.category) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Diagnosis Category
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
          
            onChange={(e) => handleInputChange("diagnosis", "category", "category", e.target.value)}
          >
            <option value="">Select category...</option>
            <option value="diagnosis">Diagnosis</option>
            <option value="problem-list-item">Problem List Item</option>
            <option value="health-concern">Health Concern</option>
          </select>
        </div>

        {/* Diagnosis Severity (FHIR: Condition.severity) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Diagnosis Severity
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
         
            onChange={(e) => handleInputChange("diagnosis", "severity", "severity", e.target.value)}
          >
            <option value="">Select severity...</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
            <option value="fatal">Fatal</option>
          </select>
        </div>

        
      </div>
    </div>
  </div>
);


const renderPrognosisSection = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-[#75C05B] mt-8">
    <div className="bg-[#007664] px-6 py-4">
      <h2 className="text-xl font-bold text-[#53FDFD]">Prognosis</h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {/* Expected Outcome */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Expected Outcome
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            value={formData.prognosis?.outcome || ""}
            onChange={(e) => handleInputChange("prognosis", "outcome", "outcome", e.target.value)}
          >
            <option value="">Select outcome...</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="guarded">Guarded</option>
          </select>
        </div>

        {/* Estimated Recovery Time */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Estimated Recovery Time
          </label>
          <div className="flex space-x-4">
            <input
              type="number"
              className="w-24 p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
              min="0"
              value={formData.prognosis?.recoveryTime?.duration || ""}
              onChange={(e) => handleInputChange("prognosis", "recoveryTime", "duration", e.target.value)}
            />
            <select
              className="w-40 p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
              value={formData.prognosis?.recoveryTime?.unit || ""}
              onChange={(e) => handleInputChange("prognosis", "recoveryTime", "unit", e.target.value)}
            >
              <option value="">Select unit</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Treatment Plan
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={4}
            value={formData.prognosis?.treatmentPlan || ""}
            onChange={(e) => handleInputChange("prognosis", "treatmentPlan", "plan", e.target.value)}
          />
        </div>

        {/* Follow-up Requirements */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Follow-up Requirements
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
            value={formData.prognosis?.followUp || ""}
            onChange={(e) => handleInputChange("prognosis", "followUp", "requirements", e.target.value)}
          />
        </div>

        {/* Prognosis Description (FHIR field: CarePlan.description) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Prognosis Description
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={4}
            value={formData.prognosis?.description || ""}
            onChange={(e) => handleInputChange("prognosis", "description", "description", e.target.value)}
          />
        </div>

        {/* Prognosis Date (FHIR field: CarePlan.activity.detail.scheduled) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Prognosis Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            value={formData.prognosis?.prognosisDate || ""}
            onChange={(e) => handleInputChange("prognosis", "prognosisDate", "date", e.target.value)}
          />
        </div>

        {/* Risk or Complications (FHIR field: Condition or CarePlan.activity.detail.risk) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Risk or Complications
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
            value={formData.prognosis?.risks || ""}
            onChange={(e) => handleInputChange("prognosis", "risks", "risk", e.target.value)}
          />
        </div>

        {/* Care Team Involved (FHIR field: CarePlan.careTeam) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Care Team Involved
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            value={formData.prognosis?.careTeam || ""}
            onChange={(e) => handleInputChange("prognosis", "careTeam", "team", e.target.value)}
          />
        </div>

        {/* Prognostic Score or Assessment (FHIR field: Observation.valueQuantity) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Prognostic Score (if applicable)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            value={formData.prognosis?.prognosticScore || ""}
            onChange={(e) => handleInputChange("prognosis", "prognosticScore", "score", e.target.value)}
          />
        </div>

        {/* Prognosis Source (FHIR field: CarePlan.derivedFrom or Observation.source) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Prognosis Source (e.g., physicians notes)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            value={formData.prognosis?.prognosisSource || ""}
            onChange={(e) => handleInputChange("prognosis", "prognosisSource", "source", e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);



return (
  <div className="max-w-7xl mx-auto p-6 bg-[#F7F7F7] min-h-screen">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#007664] mb-2">Medical Assessment Form</h1>
      <p className="text-[#B24531]">Please complete all relevant sections</p>
    </div>

    <div className="space-y-8">
      {Object.entries(filteredComplaints).map(([mainSectionKey, mainSection]) => (
        <div key={mainSectionKey} className="rounded-xl overflow-hidden bg-white border border-[#75C05B]">
          {/* ... existing symptoms section rendering ... */}
        </div>
      ))}
    </div>

    {renderDiagnosisSection()}
    {renderPrognosisSection()}

    <div className="sticky bottom-0 bg-[#F7F7F7] pt-4 mt-8 border-t border-[#75C05B] pb-4">
      {/* ... existing bottom section ... */}
    </div>
  </div>
);
}
const renderDiagnosisHistory = () => {


  // Updated sample data structure focused on diagnosis and prognosis
  const diagnoses = [
    {
      id: 1,
      date: '2024-12-28',
      condition: 'Type 2 Diabetes',
      diagnosisDetails: 'Initial diagnosis based on HbA1c of 7.2% and fasting glucose levels',
      prognosis: 'Good prognosis with lifestyle modifications and medication adherence',
      severity: 'Moderate',
      treatmentPlan: 'Metformin 500mg twice daily, dietary changes, regular exercise',
      expectedOutcome: 'Blood sugar stabilization within 3-6 months',
      followUpNeeded: true,
      riskFactors: ['Family history', 'Sedentary lifestyle', 'Obesity']
    },
    {
      id: 2,
      date: '2024-12-15',
      condition: 'Hypertension',
      diagnosisDetails: 'Consistent elevated BP readings over 140/90 mmHg',
      prognosis: 'Favorable with medication and lifestyle changes',
      severity: 'Mild to Moderate',
      treatmentPlan: 'Lisinopril 10mg daily, reduced sodium intake',
      expectedOutcome: 'BP control within 2-3 months',
      followUpNeeded: true,
      riskFactors: ['Age', 'Family history', 'High sodium diet']
    },
    {
      id: 3,
      date: '2024-11-30',
      condition: 'Osteoarthritis',
      diagnosisDetails: 'Bilateral knee involvement confirmed by X-ray',
      prognosis: 'Chronic condition requiring ongoing management',
      severity: 'Mild',
      treatmentPlan: 'Physical therapy, NSAIDs as needed',
      expectedOutcome: 'Pain management and maintained mobility',
      followUpNeeded: true,
      riskFactors: ['Age', 'Previous joint injury', 'Obesity']
    }
  ];

  const toggleDiagnosis = (id) => {
    setExpandedDiagnosis(expandedDiagnosis === id ? null : id);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'severe':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8  " style={{ width: '65vw' }}>
      <Card className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-white shadow-lg">
        <CardHeader className="bg-teal-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Diagnosis & Prognosis History</CardTitle>
          <CardDescription className="text-gray-200">
            Comprehensive medical condition tracking and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {diagnoses.map((diagnosis) => (
              <div 
                key={diagnosis.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleDiagnosis(diagnosis.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Activity className="text-teal-800" size={20} />
                    <div className="text-left">
                      <div className="font-medium text-teal-800">
                        {diagnosis.condition}
                      </div>
                      <div className={`text-sm ${getSeverityColor(diagnosis.severity)}`}>
                        {diagnosis.severity} Severity
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {new Date(diagnosis.date).toLocaleDateString()}
                    </span>
                    {expandedDiagnosis === diagnosis.id ? 
                      <ChevronUp className="text-teal-800" size={20} /> : 
                      <ChevronDown className="text-teal-800" size={20} />
                    }
                  </div>
                </button>
                
                {expandedDiagnosis === diagnosis.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Diagnosis Details</h4>
                        <p className="text-sm text-gray-700 p-2 bg-white rounded">
                          {diagnosis.diagnosisDetails}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Prognosis</h4>
                        <p className="text-sm text-gray-700 p-2 bg-white rounded">
                          {diagnosis.prognosis}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Treatment Plan</h4>
                        <p className="text-sm text-gray-700 p-2 bg-white rounded">
                          {diagnosis.treatmentPlan}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Expected Outcome</h4>
                        <div className="flex items-center space-x-2 p-2 bg-white rounded">
                          <TrendingUp className="text-teal-500" size={16} />
                          <span className="text-sm text-gray-700">
                            {diagnosis.expectedOutcome}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-teal-800">Risk Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.riskFactors.map((factor, index) => (
                            <div 
                              key={index}
                              className="flex items-center space-x-1 text-sm bg-white rounded px-3 py-1"
                            >
                              <AlertCircle size={14} className="text-yellow-500" />
                              <span className="text-gray-700">{factor}</span>
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

    const renderPreChecks = () => {
      const preCheckItems = [
        'I washed my hands',
        'I greeted the patient by name',
        'I verified patient identity',
        'I have asked the patient to sit/lie down comfortably, as necessary',
        'I observed the patients gait',
        'I asked the patient if there was any pain anywhere',
        'There is a female chaperon in the room (for female patient)',
        'I have checked patients diagnosis history',
      ];
  

  
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-sm">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Pre-Checks</h2>
            <p className="text-gray-500 mt-1">Complete all required checks before proceeding</p>
          </div>
  
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preCheckItems.map((check) => (
                <div key={check} className="flex items-center group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={check}
                      name={check}
                      className="peer h-5 w-5 rounded border-2 border-gray-300 text-teal-500 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer appearance-none checked:bg-teal-500 checked:border-transparent"
                      onChange={handleChange}
                    />
                    <Check className="absolute top-1 left-1 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                  <label htmlFor={check} className="ml-3 text-gray-700 group-hover:text-gray-900 cursor-pointer">
                    {check}
                  </label>
                </div>
              ))}
            </div>
          </div>
  </div>
       
  
              
  
      );
    }
    const RenderDiagnosticAssessment = ({ selectedSymptoms, setSelectedSymptoms }) => {
      const diagnosticSections = [
        {
          title: 'Constitutional Symptoms',
          icon: '🌡️',
          items: [
            'Fever',
            'Fatigue/Malaise',
            'Weight Loss/Gain',
            'Night Sweats',
            'Changes in Appetite',
            'Sleep Disturbances'
          ]
        },
        {
          title: 'Cardiopulmonary',
          icon: '❤️',
          items: [
            'Chest Pain/Pressure',
            'Dyspnea',
            'Orthopnea',
            'Palpitations',
            'Cough',
            'Hemoptysis',
            'Wheezing'
          ]
        },
        {
          title: 'Neurological',
          icon: '🧠',
          items: [
            'Headache',
            'Dizziness/Vertigo',
            'Syncope',
            'Focal Weakness',
            'Sensory Changes',
            'Vision Changes',
            'Speech Changes',
            'Gait Disturbance'
          ]
        },
        {
          title: 'Gastrointestinal',
          icon: '🔄',
          items: [
            'Abdominal Pain',
            'Nausea/Vomiting',
            'Diarrhea/Constipation',
            'GI Bleeding',
            'Dysphagia',
            'Jaundice',
            'Changes in Bowel Habits'
          ]
        },
        {
          title: 'Genitourinary',
          icon: '⚕️',
          items: [
            'Dysuria',
            'Frequency/Urgency',
            'Hematuria',
            'Incontinence',
            'Flank Pain',
            'Menstrual Irregularities',
            'Pregnancy Symptoms'
          ]
        },
        {
          title: 'Musculoskeletal',
          icon: '🦴',
          items: [
            'Joint Pain/Swelling',
            'Muscle Pain/Weakness',
            'Back Pain',
            'Limited Range of Motion',
            'Morning Stiffness',
            'Trauma-related Symptoms'
          ]
        },
        {
          title: 'Skin/Integumentary',
          icon: '🧴',
          items: [
            'Rash',
            'Pruritus',
            'Skin Lesions',
            'Changes in Pigmentation',
            'Wound/Ulcer',
            'Skin Infections'
          ]
        },
        {
          title: 'Psychiatric',
          icon: '🧠',
          items: [
            'Mood Changes',
            'Anxiety',
            'Depression',
            'Sleep Disturbances',
            'Memory Issues',
            'Suicidal Ideation'
          ]
        },
        {
          title: 'Additional Symptoms',
          icon: '📝',
          items: ['']
        }
      ];
    
      const handleSymptomChange = (sectionTitle, item, isChecked) => {
        const updatedSymptoms = isChecked
          ? [
              ...selectedSymptoms,
              {
                category: sectionTitle,
                symptom: item,
                onset: null,
                severity: null,
                details: ''
              }
            ]
          : selectedSymptoms.filter(
              (symptom) => !(symptom.category === sectionTitle && symptom.symptom === item)
            );
    
        setSelectedSymptoms(updatedSymptoms);
      };
    
      const handleSymptomDetailsChange = (sectionTitle, item, field, value) => {
        const updatedSymptoms = selectedSymptoms.map(symptom => {
          if (symptom.category === sectionTitle && symptom.symptom === item) {
            return { ...symptom, [field]: value };
          }
          return symptom;
        });
    
        setSelectedSymptoms(updatedSymptoms);
      };
    
      const isSymptomSelected = (sectionTitle, item) => {
        return selectedSymptoms.some(
          symptom => symptom.category === sectionTitle && symptom.symptom === item
        );
      };
    
      return (
<div className="p-6 space-y-8 bg-gray-50 rounded-xl shadow-sm" style={{ width: '65vw' }}>          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-teal-700 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-teal-700">
                Please document all relevant symptoms for accurate diagnosis and prognosis assessment.
              </p>
              <p className="text-xs text-teal-600">
                Include onset, duration, severity, and any associated factors for each symptom.
              </p>
            </div>
          </div>
    
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Diagnostic Assessment</h2>
            <p className="text-gray-600 mt-1">Select all applicable symptoms and provide relevant details</p>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {diagnosticSections.map(section => (
              <div
                key={section.title}
                className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
    
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item} className="flex items-center group">
                      {section.title === "Additional Symptoms" ? (
                        <textarea
                          className="w-full p-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                          placeholder="Enter additional symptoms and their characteristics..."
                          value={selectedSymptoms.find(s => s.category === section.title)?.details || ''}
                          onChange={(e) => handleSymptomDetailsChange(section.title, 'additional', 'details', e.target.value)}
                        />
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            id={`${section.title}-${item}`}
                            checked={isSymptomSelected(section.title, item)}
                            onChange={(e) => handleSymptomChange(section.title, item, e.target.checked)}
                            className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`${section.title}-${item}`}
                            className="ml-3 text-gray-700 group-hover:text-gray-900 cursor-pointer text-sm"
                          >
                            {item}
                          </label>
    
                          {isSymptomSelected(section.title, item) && (
                            <div className="mt-2 space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Onset</label>
                                <input
                                  type="date"
                                  value={selectedSymptoms.find(s => s.category === section.title && s.symptom === item)?.onset || ''}
                                  onChange={(e) => handleSymptomDetailsChange(section.title, item, 'onset', e.target.value)}
                                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Severity</label>
                                <select
                                  value={selectedSymptoms.find(s => s.category === section.title && s.symptom === item)?.severity || ''}
                                  onChange={(e) => handleSymptomDetailsChange(section.title, item, 'severity', e.target.value)}
                                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Severity</option>
                                  <option value="mild">Mild</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="severe">Severe</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
  
const renderDiagnosisForm = () => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDatadiagnosis(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormDatadiagnosis(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl" style={{ width: '65vw' }}>
      <Card>
        <CardHeader className="text-2xl font-bold text-center bg-teal-700 text-white rounded-t-lg" > 
          <CardTitle className="text-2xl font-bold text-center " >Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Previous fields remain the same */}
            <div className="grid grid-cols-2 gap-4">
           
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity Level</Label>
                <Select onValueChange={(value) => handleSelectChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diagnosis Category</Label>
                <div className="space-y-2">
                  <Select onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                      <SelectItem value="neurological">Neurological</SelectItem>
                      <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                      <SelectItem value="musculoskeletal">Musculoskeletal</SelectItem>
                      <SelectItem value="endocrine">Endocrine</SelectItem>
                      <SelectItem value="psychiatric">Psychiatric</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formDatadiagnosis.category === 'other' && (
                    <Input
                      name="otherCategory"
                      value={formData.otherCategory}
                      onChange={handleInputChange}
                      placeholder="Please specify category"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="semi-urgent">Semi-Urgent</SelectItem>
                    <SelectItem value="non-urgent">Non-Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chronicity Status</Label>
                <Select onValueChange={(value) => handleSelectChange('chronicityStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acute">Acute</SelectItem>
                    <SelectItem value="subacute">Subacute</SelectItem>
                    <SelectItem value="chronic">Chronic</SelectItem>
                    <SelectItem value="recurrent">Recurrent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Primary Diagnosis
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
   
            onChange={(e) => handleInputChange("diagnosis", "primary", "diagnosis", e.target.value)}
          />
        </div>

        {/* Secondary Diagnoses (FHIR: Condition.code) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Secondary Diagnoses
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
           
            onChange={(e) => handleInputChange("diagnosis", "secondary", "diagnosis", e.target.value)}
          />
        </div>

        {/* Differential Diagnoses (FHIR: Condition.code) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Differential Diagnoses
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
           
            onChange={(e) => handleInputChange("diagnosis", "differential", "diagnosis", e.target.value)}
          />
        </div>

     

        {/* Diagnosis Status (FHIR: Condition.status) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Diagnosis Status
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
           
            onChange={(e) => handleInputChange("diagnosis", "status", "status", e.target.value)}
          >
            <option value="">Select status...</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="remission">Remission</option>
            <option value="inactive">Inactive</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Diagnosis Verification Status (FHIR: Condition.verificationStatus) */}
        <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Verification Status
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
      
            onChange={(e) => handleInputChange("diagnosis", "verificationStatus", "verificationStatus", e.target.value)}
          >
            <option value="">Select verification status...</option>
            <option value="unconfirmed">Unconfirmed</option>
            <option value="confirmed">Confirmed</option>
            <option value="differential">Differential</option>
            <option value="refuted">Refuted</option>
            <option value="entered-in-error">Entered in Error</option>
          </select>
        </div>

    

             
   
    
            {/* Rest of the form remains the same */}
            <div className="space-y-2">
              <Label htmlFor="symptoms">Key Symptoms and Clinical Markers</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="List symptoms with frequency and clinical significance"
                className="h-24"
              />
            </div>

            <div className="flex justify-end space-x-4">
            
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const renderPrognosisForm = () => {
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataprog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormDataprog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl" style={{ width: '65vw' }}>
      <Card>
      <CardHeader className="text-2xl font-bold text-center bg-teal-700 text-white rounded-t-lg" > 
          <CardTitle className="text-2xl font-bold text-center">Prognosis</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Outcome</Label>
                <div className="space-y-2">
                  <Select onValueChange={(value) => handleSelectChange('expectedOutcome', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expected outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete_recovery">Complete Recovery</SelectItem>
                      <SelectItem value="partial_recovery">Partial Recovery</SelectItem>
                      <SelectItem value="chronic_management">Chronic Management Required</SelectItem>
                      <SelectItem value="progressive_decline">Progressive Decline</SelectItem>
                      <SelectItem value="terminal">Terminal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formDataprog.expectedOutcome === 'other' && (
                    <Input
                      name="otherOutcome"
                      value={formData.otherOutcome}
                      onChange={handleInputChange}
                      placeholder="Please specify outcome"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select onValueChange={(value) => handleSelectChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select onValueChange={(value) => handleSelectChange('riskLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Recovery Potential</Label>
                <Select onValueChange={(value) => handleSelectChange('recoveryPotential', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recovery potential" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="uncertain">Uncertain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>5-Year Survival Rate (%)</Label>
              <Input
                type="number"
                name="survivalRate"
                value={formDataprog.survivalRate}
                onChange={handleInputChange}
                placeholder="Enter percentage"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label>Potential Complications</Label>
              <Textarea
                name="complications"
                value={formDataprog.complications}
                onChange={handleInputChange}
                placeholder="List potential complications and their likelihood"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Long-term Effects</Label>
              <Textarea
                name="longTermEffects"
                value={formDataprog.longTermEffects}
                onChange={handleInputChange}
                placeholder="Describe expected long-term effects and their impact"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Lifestyle Modifications</Label>
              <Textarea
                name="lifestyleModifications"
                value={formData.lifestyleModifications}
                onChange={handleInputChange}
                placeholder="Required lifestyle changes and recommendations"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Monitoring Requirements</Label>
              <Textarea
                name="monitoringRequirements"
                value={formDataprog.monitoringRequirements}
                onChange={handleInputChange}
                placeholder="Specify monitoring and testing requirements"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Follow-up Schedule</Label>
              <Textarea
                name="followUpSchedule"
                value={formDataprog.followUpSchedule}
                onChange={handleInputChange}
                placeholder="Outline recommended follow-up schedule and milestones"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                name="additionalNotes"
                value={formDataprog.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional relevant information"
                className="h-24"
              />
            </div>

            <div className="flex justify-end space-x-4">
           
        
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
    const pages = [
      renderDiagnosisHistory,
      renderPreChecks,
      () => RenderDiagnosticAssessment({  selectedSymptoms, setSelectedSymptoms }),
      renderDiagnosisForm,
      renderPrognosisForm,
  
  
      
    ];
  
    return (
      <div className="flex flex-col min-h-screen max-w-6xl mx-auto p-6">
      {/* Page number circles at the top */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: pages.length }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              border-2 border-teal-500 font-medium text-sm
              ${currentPage === pageNum 
                ? 'bg-teal-500 text-white' 
                : 'bg-white text-teal-500 hover:bg-teal-50'
              }
              transition-colors duration-200
            `}
          >
            {pageNum}
          </button>
        ))}
      </div>
    
      {/* Content area */}
      <div className="flex-1 overflow-auto mb-8"> {/* This makes the content take the available space */}
        {pages[currentPage - 1]()}
      </div>
    
      {/* Navigation footer */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
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
      setCurrentPage(prev => Math.min(pages.length, prev + 1));
    }
  }}
  disabled={false} // Ensure the button is always active
  className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors duration-200"
>
  {currentPage === pages.length ? "Continue" : "Next"}
  <ChevronRight className="w-5 h-5 ml-2" />
</button>


          </div>
        </div>
      </div>
    </div>
    
    );
  };

  const MedicalConsultationForm = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({});
    const [selectedComplaints, setSelectedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState({});
    const [expandedVisit, setExpandedVisit] = useState(null);
    const [sicknessSections, setSicknessSection] =useState({
    
      generalSymptoms: {
        title: "General Symptoms",
        subsections: {
          fever: {
            title: "Fever",
            fields: [
              { name: "feverDuration", label: "Duration (Days)", type: "text" },
              { name: "feverNature", label: "Nature", type: "select", options: ["Everyday", "Alternative", "Irregular", "Others"] },
              { name: "feverType", label: "Type", type: "select", options: ["All day", "Morning", "Evening", "Night", "Others"] },
              { name: "feverIntensity", label: "Intensity", type: "select", options: ["High", "Low", "High and Low", "None", "Others"] },
              { name: "shivers", label: "Shivers?", type: "radio", options: ["Yes", "No"] },
              { name: "associatedSymptoms", label: "Associated Symptoms?", type: "radio", options: ["Yes", "No"], requiresSpecify:true },

              { name: "cough", label: "Cough?", type: "radio", options: ["Yes", "No"] },
              { name: "coughWithBleeding", label: "Cough with bleeding?", type: "radio", options: ["Yes", "No"] },
              { name: "pain", label: "Any Pain?", type: "radio", options: ["Yes", "No"], requiresSpecify: true },

              { name: "generalWeakness", label: "General Weakness?", type: "radio", options: ["Yes", "No"] },
              { name: "lossOfWeight", label: "Loss of weight?", type: "radio", options: ["Yes", "No"] },
              { name: "burningInUrine", label: "Burning in urine?", type: "radio", options: ["Yes", "No"] },
              { name: "causes", label: "What causes it?", type: "text" },
              { name: "reliefs", label: "What relieves it?", type: "text" },
              { name: "bodyTemperature", label: "Body temperature", type: "autofilled" },
              { name: "chillsSweating", label: "Chills or sweating", type: "radio", options: ["Yes", "No"] },
              { name: "fatigueWeakness", label: "Fatigue or weakness", type: "radio", options: ["Yes", "No"] },
              { name: "bodyAches", label: "Body aches", type: "radio", options: ["Yes", "No"] }
            ]
          },
          generalWeakness: {
            title: "General Weakness/Fatigue",
            fields: [
              { name: "weaknessDuration", label: "Duration (Days)", type: "text" },
              { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Decreased", "Others"] },
              { name: "weightChange", label: "Change in Weight", type: "select", options: ["Increased", "Decreased", "No Change", "Others"] },
              { name: "abdominalPain", label: "Abdominal Pain?", type: "radio", options: ["Yes", "No"] },
              { name: "chestPain", label: "Chest Pain?", type: "radio", options: ["Yes", "No"] },
              { name: "fever", label: "Fever?", type: "radio", options: ["Yes", "No"] },
              { name: "cough", label: "Cough?", type: "radio", options: ["Yes", "No"] },
              { name: "diarrhea", label: "Diarrhea?", type: "radio", options: ["Yes", "No"] },
              { name: "constipation", label: "Constipation?", type: "radio", options: ["Yes", "No"] }
            ]
          },
          specificWeakness: {
            title: "Specific Weakness",
            fields: [
              { name: "specificWeaknessDuration", label: "Duration (Days)", type: "text" },
              { name: "weaknessLocation", label: "Location of Weakness", type: "text" },
              { name: "historyOfInjury", label: "History of Injury (H/O injury)?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "startCause", label: "How did it start?", type: "text" },
              { name: "progress", label: "Progress", type: "select", options: ["Same as Before", "Improving", "Worsening", "Others"] }
            ]
          },
          dizziness: {
            title: "Dizziness",
            fields: [
              { name: "dizzinessDuration", label: "Duration (Days)", type: "text" },
              { name: "dizzinessNature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
              { name: "dizzinessType", label: "Type", type: "select", options: ["Whole Day", "Morning", "Evening", "Others"] },
              { name: "dizzinessCause", label: "What causes it?", type: "text" },
              { name: "dizzinessRelief", label: "What relieves it?", type: "text" },
              { name: "relationWithPosition", label: "Relation with Position", type: "select", options: ["Lying Down", "Standing Up", "Moving Neck", "Opening Eyes", "None", "Others"] },
              { name: "historyOfFainting", label: "History of Fainting?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "historyOfFall", label: "History of Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Vomiting", "Chest Pain", "Breathlessness", "Pain in Ear", "None", "Others"] },
              { name: "vision", label: "Vision", type: "select", options: ["All Right", "Diminished", "Others"] },
              { name: "hearing", label: "Hearing", type: "select", options: ["Normal", "Less", "Others"] }
            ]
          },
          fainting: {
            title: "Fainting",
            fields: [
              { name: "faintingEpisodes", label: "Number of Episodes", type: "text" },
              { name: "intervalBetweenEpisodes", label: "Interval Between Episodes", type: "text" },
              { name: "consciousnessLost", label: "Is Consciousness Lost?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "associatedFits", label: "Any Associated Fits?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "fall", label: "Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "dizziness", label: "Dizziness?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "faintingCause", label: "What Brings It On?", type: "text" },
              { name: "faintingRelief", label: "How Is It Relieved?", type: "text" }
            ]
          },
          headache: {
            title: "Headache",
            fields: [
              { name: "painLocation", label: "Pain Location", type: "select", options: ["Forehead", "Temples", "Behind the Eyes", "Top of the Head", "Back of the Head", "One Side of the Head", "Neck", "Other (Specify)"] },
              { name: "painIntensity", label: "Intensity", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
              { name: "durationOfHeadache", label: "Duration of Headache", type: "select", options: ["Less than 1 Hour", "1-3 Hours", "3-6 Hours", "6-12 Hours", "More than 12 Hours", "Intermittent", "Continuous", "Other (Specify)"] },
              { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Nausea", "Sensitivity to Light", "Sensitivity to Sound", "Others"] }
            ]
          }
        }
      },
            gastrointestinalIssues: {
          title: "Gastrointestinal Issues",
          subsections: {
            acidityIndigestion: {
              title: "Acidity/Indigestion",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "abdominalPain", label: "Any Abdominal Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "vomiting", label: "Any Vomiting?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "nausea", label: "Nausea?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bowelHabitChange", label: "Change in Bowel Habit?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Less", "Others"] },
                { name: "constipation", label: "Constipation?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "diarrhea", label: "Diarrhea?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "cause", label: "What causes it?", type: "text" },
                { name: "worsens", label: "What worsens it?", type: "text" },
                { name: "jaundiceHistory", label: "History of Jaundice?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "alcohol", label: "Alcohol Ingestion?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "smoking", label: "History of Smoking?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "weightChange", label: "Change in Weight?", type: "select", options: ["Increased", "Decreased", "Did Not Change", "Others"] }
              ]
            },
            diarrhea: {
              title: "Diarrhea",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "stoolType", label: "Stool Type", type: "select", options: ["Watery", "Soft", "Ill-formed", "Others"] },
                { name: "nature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
                { name: "frequency", label: "Frequency", type: "text" },
                { name: "blood", label: "With Blood?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Any Associated Symptoms?", type: "multi-select", options: ["Vomiting", "Abdominal Pain", "Fever", "None", "Others"] },
                { name: "relationWithFood", label: "Any Relation with Food?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "currentMedications", label: "Any Current Medications?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            vomiting: {
              title: "Vomiting",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "nature", label: "Nature", type: "select", options: ["Everyday", "Some Days", "Others"] },
                { name: "frequency", label: "Frequency", type: "text" },
                { name: "appetite", label: "Appetite", type: "select", options: ["Normal", "Less", "Others"] },
                { name: "cause", label: "What causes it?", type: "text" },
                { name: "relief", label: "What relieves it?", type: "text" },
                { name: "blood", label: "With Blood?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Abdominal Pain", "Headache", "Diarrhea", "Constipation", "None", "Others"] },
                { name: "nausea", label: "Nausea?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            abdominalPain: {
              title: "Abdominal Pain",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "startLocation", label: "Where did it start?", type: "select", options: ["Upper (R)", "Upper (C)", "Upper (L)", "Middle (R)", "Middle (C)", "Middle (L)", "Lower (R)", "Lower (C)", "Lower (L)", "All Over", "Others"] },
                { name: "currentLocation", label: "Where is it now?", type: "select", options: ["Upper (R)", "Upper (C)", "Upper (L)", "Middle (R)", "Middle (C)", "Middle (L)", "Lower (R)", "Lower (C)", "Lower (L)", "All Over", "Others"] },
                { name: "painStart", label: "How did the pain start?", type: "select", options: ["Sudden", "Gradual", "Others"] },
                { name: "intensity", label: "Intensity", type: "select", options: ["Mild", "Moderate", "Severe", "Varies", "Others"] },
                { name: "nature", label: "Nature", type: "select", options: ["Continuous", "Comes and Goes", "Sometimes Worse", "Others"] },
                { name: "triggers", label: "What brings it on?", type: "select", options: ["Food", "Empty Stomach", "Period", "None", "Others"] },
                { name: "relief", label: "What relieves it?", type: "select", options: ["Food", "Vomiting", "None", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Constipation", "Diarrhea", "Vomiting", "Loss of Appetite", "None", "Others"] }
              ]
            },
            bleedingWithStool: {
              title: "Bleeding with Stool",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "stoolColor", label: "Color of Stool", type: "select", options: ["Bright Red", "Dark Red", "Others"] },
                { name: "amount", label: "Amount of Stool", type: "select", options: ["Lot", "Drops", "Others"] },
                { name: "painDuringPassing", label: "Pain During Passing Stool?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bowelHabitChange", label: "Change in Bowel Habit?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "constipation", label: "Constipation?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "diarrhea", label: "Diarrhea?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            ulcer: {
              title: "Ulcer",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "location", label: "Where?", type: "text" },
                { name: "startCause", label: "How did it start?", type: "select", options: ["Injury", "On its Own", "Others"] },
                { name: "pain", label: "Any Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "surface", label: "Surface", type: "select", options: ["Clean", "Dirty", "Pink", "Black", "Green", "Mixed", "Others"] },
                { name: "edges", label: "Edges", type: "select", options: ["Raised", "Flat", "Others"] },
                { name: "size", label: "Size", type: "text" }
              ]
            }
          }
        },
          respiratoryIssues: {
          title: "Respiratory Issues",
          subsections: {
            coughThroatProblem: {
              title: "Cough/Throat Problem",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "frequency", label: "How Often?", type: "select", options: ["All Day", "In the Morning", "At Night", "Sometimes", "Others"] },
                { name: "sputum", label: "Is there any Sputum?", type: "radio", options: ["Yes", "No"] },
                { name: "sputumColor", label: "Color of the Sputum", type: "select", options: ["Yellow", "Green", "Others"] },
                { name: "sputumAmount", label: "Amount of Sputum", type: "select", options: ["Lot", "Medium", "Small", "Others"] },
                { name: "fever", label: "Is there any Fever?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "difficultySwallowing", label: "Is there any Difficulty in Swallowing?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "throatPain", label: "Is there any Pain in the Throat?", type: "radio", options: ["Yes", "No", "Others"] },
                { name: "breathingDifficulty", label: "Is there any Difficulty in Breathing?", type: "radio", options: ["Yes", "No", "Others"] }
              ]
            },
            shortnessOfBreath: {
              title: "Difficulty in Breathing/Shortness of Breath",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "progression", label: "How has it progressed?", type: "select", options: ["Same as Before", "Worsening", "Improving", "Varies with Reason", "Others"] },
                { name: "triggers", label: "What brings it on?", type: "select", options: ["Exertion", "Climbing Stairs", "None", "Others"] },
                { name: "relief", label: "What relieves it?", type: "select", options: ["Rest", "Sitting Up", "None", "Others"] },
                { name: "wakesAtNight", label: "Does it wake you up at night?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "chestPain", label: "Any Chest Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "cough", label: "Any Cough?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["General Weakness", "Fever", "Others"] }
              ]
            },
            soreThroat: {
              title: "Sore Throat",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "text" },
                { name: "severity", label: "Severity", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
                { name: "painLevel", label: "Pain Level", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
                { name: "painLocation", label: "Pain Location", type: "select", options: ["Left Side", "Right Side", "Both Sides", "Back of Throat", "Others"] },
                { name: "difficultySwallowing", label: "Difficulty Swallowing?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "voiceChanges", label: "Voice Changes?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "associatedSymptoms", label: "Associated Symptoms", type: "multi-select", options: ["Fever", "Cough", "Runny Nose", "Ear Pain", "Swollen Glands", "Others"] },
                { name: "recentIllness", label: "Recent Illness or Exposure to Illness?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            }
          }
        },
        
         urinaryAndReproductiveHealth: {
          title: "Urinary and Reproductive Health",
          subsections: {
            yellowUrine: {
              title: "Yellow Urine",
              fields: [
                { name: "duration", label: "Duration (Days)", type: "number" },
                { name: "abdominalPain", label: "Abdominal Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "fever", label: "Fever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "stoolColor", label: "Color of Stool?", type: "select", options: ["Normal", "Others"] },
                { name: "burningWithUrine", label: "Burning with Urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "generalWeakness", label: "General Weakness?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            urinaryIssues: {
              title: "Urinary Issues",
              fields: [
                { name: "symptomsDuration", label: "How long have you felt the symptoms?", type: "number" },
                { name: "frequencyPerDay", label: "Number of times/day?", type: "number" },
                { name: "frequencyNature", label: "Nature of frequency?", type: "select", options: ["All day", "More at night", "Others"] },
                { name: "burningNature", label: "Nature of burning?", type: "select", options: ["Only at the beginning", "All through passing urine", "Others"] },
                { name: "burningColor", label: "Color of burning?", type: "select", options: ["Normal", "Dark Yellow", "Others"] },
                { name: "fever", label: "Is there any fever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bloodInUrine", label: "Any blood in urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "urineHolding", label: "Can you hold urine?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "urineStream", label: "How is the stream?", type: "select", options: ["As before", "Weak", "Others"] }
              ]
            },
            menstrualIssues: {
              title: "Menstrual Issues",
              fields: [
                { name: "hadPeriod", label: "Did you have period ever?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "firstPeriod", label: "When was your first period?", type: "date" },
                { name: "periodFrequency", label: "How often do your periods take place?", type: "select", options: ["Regular", "Irregular", "Others"] },
                { name: "menstrualFlow", label: "How much is your menstrual flow?", type: "select", options: ["Light", "Moderate", "Heavy", "Don't know", "Others"] },
                { name: "daysWithFlow", label: "Number of days with active menstrual flow", type: "number" },
                { name: "painDuringPeriod", label: "Do you experience lower abdominal pain or cramps?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "otherSymptoms", label: "Any other symptoms during menstruation or 2 days before it?", type: "select", options: ["Mood swing", "Tiredness", "Trouble sleeping", "Upset stomach", "Headache", "Acne", "None", "Others"] },
                { name: "symptomsDisappear", label: "Do these symptoms disappear after menstruation?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            sexualHealthIssues: {
              title: "Sexual Health Issues",
              fields: [
                { name: "married", label: "Married?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lmp", label: "Date of LMP?", type: "date" },
                { name: "periodDuration", label: "Duration of period", type: "number" },
                { name: "durationRegular", label: "Duration Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "intervalBetweenPeriods", label: "Interval between periods", type: "number" },
                { name: "intervalRegular", label: "Interval Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "flow", label: "Flow", type: "select", options: ["Normal", "Heavy", "Low", "Varies", "Others"] },
                { name: "numberOfChildren", label: "Number of children", type: "number" },
                { name: "numberOfPregnancies", label: "Number of pregnancies", type: "number" },
                { name: "firstChildbirthAge", label: "Age at first childbirth", type: "number" },
                { name: "lastChildbirthAge", label: "Age at last childbirth", type: "number" },
                { name: "contraceptionPractice", label: "Contraception practice?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "discharge", label: "Any discharge?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "bleedingBetweenPeriods", label: "Bleeding between periods?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "pain", label: "Pain?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "itching", label: "Itching?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            prenatalIssues: {
              title: "Prenatal Issues",
              fields: [
                { name: "married", label: "Married?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lmp", label: "Date of LMP?", type: "date" },
                { name: "duration", label: "Duration of period (days)", type: "number" },
                { name: "durationRegular", label: "Duration Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "interval", label: "Interval between periods (days)", type: "number" },
                { name: "intervalRegular", label: "Interval Regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "flow", label: "Flow", type: "select", options: ["Normal", "Heavy", "Low", "Varies", "Others"] },
                { name: "painDuringIntercourse", label: "Pain during intercourse?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            pregnancy: {
              title: "Pregnancy",
              fields: [
                { name: "sexuallyActive", label: "Are you sexually active?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "lastIntercourse", label: "When was the last sexual intercourse(s) that may have caused the pregnancy?", type: "date" },
                { name: "lastMenstrualPeriod", label: "When was your last menstrual period?", type: "date" },
                { name: "menstrualCyclesRegular", label: "Are your menstrual cycles generally regular?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "previousPregnancy", label: "Have you been pregnant before?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "pregnancyOutcome", label: "If YES to the above, what was the pregnancy outcome?", type: "select", options: ["Childbirth", "Abortion/Medical", "Others"] },
                { name: "forcedSexualEvent", label: "Was there any forced sexual event?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            },
            familyPlanning: {
              title: "Family Planning/Contraceptives",
              fields: [
                { name: "contraceptiveMethod", label: "Have you ever used a contraceptive method?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "methodUsed", label: "If YES, which method have you used?", type: "select", options: ["Pill", "Injection", "IUD (Mirena)", "IUD CU", "Implant", "Male Condom", "Female Condom", "Natural Awareness Method", "Tube Litigation", "Vasectomy (Male surgery)", "Others"] },
                { name: "adoptMethod", label: "If NO, would you like to adopt a method?", type: "select", options: ["Yes", "No", "Others"] },
                { name: "planningChildren", label: "Are you planning to have any more children?", type: "select", options: ["Yes", "No", "Others"] }
              ]
            }
          }
        },
        
      skinAndExternalConditions: {
        title: "Skin and External Conditions",
        subsections: {
          boils: {
            title: "Boils",
            fields: [
              { name: "boilLocation", label: "Where are the boils located, and have you had similar issues in the past?", type: "text" },
              { name: "boilDuration", label: "Duration (Days)", type: "number" },
              { name: "boilWhere", label: "Where?", type: "text" },
              { name: "boilStart", label: "How did it start?", type: "select", options: ["Injury", "On its own", "Others"] },
              { name: "boilPain", label: "Any Pain?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "boilSkinColor", label: "Color of Skin Over the Boil", type: "select", options: ["Normal", "Red", "Others"] }
            ]
          },
          skinRash: {
            title: "Skin Rash",
            fields: [
              { name: "rashDuration", label: "Duration (Days)", type: "number" },
              { name: "rashLocation", label: "Where?", type: "text" },
              { name: "rashSize", label: "Size", type: "text" },
              { name: "rashCount", label: "How many?", type: "select", options: ["Single", "Multiple", "Many", "Others"] },
              { name: "rashSurface", label: "Surface", type: "select", options: ["Smooth", "Rough", "Others"] },
              { name: "rashColor", label: "Color", type: "select", options: ["Red", "Pink", "Brown", "White", "Yellow", "Others"] }
            ]
          },
          injury: {
            title: "Injury",
            fields: [
              { name: "injuryDuration", label: "Duration (Days)", type: "number" },
              { name: "injuryLocation", label: "Where is it?", type: "text" },
              { name: "injuryCause", label: "How sustained?", type: "select", options: ["Fall (at home)", "Fall (on road)", "Fall (from height)", "Hit by car", "Hit by bike", "Hit by cycle", "Crushed in machine", "Cut", "Violence", "Others"] },
              { name: "injuryProblem", label: "Problem", type: "select", options: ["Can't walk", "Can't move", "Pain", "Others"] },
              { name: "injuryBleeding", label: "Any bleeding?", type: "select", options: ["Yes", "No", "Others"] }
            ]
          }
        }
      },
      cardiovascularIssues: {
        title: "Cardiovascular Issues",
        subsections: {
          palpitations: {
            title: "Palpitations",
            fields: [
              { name: "palpitationDuration", label: "Duration (Days)", type: "number" },
              { name: "palpitationType", label: "Type", type: "select", options: ["Intermittent", "Always", "Others"] },
              { name: "palpitationDurationDetail", label: "How long does it last?", type: "text" },
              { name: "palpitationAssociatedSymptoms", label: "Associated symptoms", type: "select", options: ["Dizziness", "Shortness of breath", "Chest pain", "Fatigue", "Others"] },
              { name: "palpitationFainting", label: "Fainting?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationFall", label: "Fall?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationDizziness", label: "Dizziness?", type: "select", options: ["Yes", "No", "Others"] },
              { name: "palpitationTriggers", label: "What brings it on?", type: "text" },
              { name: "palpitationRelief", label: "How is it relieved?", type: "text" }
            ]
          }
        }
      },
      otherSymptoms: {
        title: "Other",
        subsections: {
          symptoms: {
            title: "Other Symptoms",
            fields: [
              { name: "otherSpecify", label: "Other (Specify)", type: "text" },
              { name: "otherDuration", label: "Duration (Days)", type: "number" },
              { name: "otherLocation", label: "Location of symptoms", type: "text" },
              { name: "otherType", label: "Type of symptoms", type: "text" },
              { name: "otherSeverity", label: "Severity of symptoms", type: "select", options: ["Mild", "Moderate", "Severe", "Others"] },
              { name: "otherFrequency", label: "Frequency of symptoms", type: "select", options: ["Intermittent", "Constant", "Others"] },
              { name: "otherAssociatedSymptoms", label: "Associated symptoms", type: "text" },
              { name: "otherTriggers", label: "Triggers", type: "text" },
              { name: "otherAlleviatingFactors", label: "Alleviating factors", type: "text" }
            ]
          }
        }
      }
      
        })
        useEffect(() => {
          const newFilteredComplaints = {};
          
          selectedComplaints.forEach(complaint => {
            // Find the section key (e.g., 'generalSymptoms')
            const sectionKey = Object.keys(sicknessSections).find(
              key => sicknessSections[key].title === complaint.section
            );
            
            if (!sectionKey) return;
            
            // Find the subsection key (e.g., 'fever')
            const subsectionKey = Object.keys(sicknessSections[sectionKey].subsections).find(
              key => sicknessSections[sectionKey].subsections[key].title === complaint.subsection
            );
            
            if (!subsectionKey) return;
            
            // Initialize section if it doesn't exist
            if (!newFilteredComplaints[sectionKey]) {
              newFilteredComplaints[sectionKey] = {
                title: sicknessSections[sectionKey].title,
                subsections: {}
              };
            }
            
            // Add the subsection with all its fields
            newFilteredComplaints[sectionKey].subsections[subsectionKey] = {
              ...sicknessSections[sectionKey].subsections[subsectionKey]
            };
          });
          
          setFilteredComplaints(newFilteredComplaints);
        }, [selectedComplaints, sicknessSections]);


  const [activeSection, setActiveSection] = useState(null);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
   
  
const MultiSectionSymptomsForm = (selectedComplaints) => {


  const handleInputChange = (mainSection, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [mainSection]: {
        ...prev[mainSection],
        [subsection]: {
          ...prev[mainSection]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const renderField = (field, mainSection, subsectionKey) => {
    const value = formData[mainSection]?.[subsectionKey]?.[field.name] || "";

    const baseInputStyles = "w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            className={baseInputStyles}
            value={value}
            onChange={(e) => handleInputChange(mainSection, subsectionKey, field.name, e.target.value)}
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
            value === option ? "text-teal-800 font-bold" : "text-gray-700"
          }`}
        >
          <input
            type="radio"
            name={field.name}
            value={option}
            checked={value === option}
            onChange={(e) => {
              handleInputChange(mainSection, subsectionKey, field.name, e.target.value);
              if (field.requiresSpecify && option === "Yes") {
                handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, ""); // Initialize specify field
              } else if (field.requiresSpecify) {
                handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, null); // Clear specify field
              }
            }}
            className="hidden" // Hide the default radio button
          />
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              value === option ? "border-teal-800 bg-teal-800" : "border-gray-400"
            }`}
          ></div>
          <span>{option}</span>
        </label>
      ))}

      {/* Conditionally render the "If Yes, specify" field */}
      {field.requiresSpecify && value === "Yes" && (
        <div className="mt-2">
          <label className="block text-sm text-gray-700">If Yes, specify</label>
          <input
            type="text"
          
            onChange={(e) =>
              handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-teal-800"
          />
        </div>
      )}
    </div>
  );

        
  case "select":
    return (
      <div className={baseInputStyles}>
        <select
          className={baseInputStyles}
          value={value}
          onChange={(e) => handleInputChange(mainSection, subsectionKey, field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
  
        {/* Conditionally render the "If Others, specify" field when 'Others' is selected */}
        {value === "Others" && (
          <div className="mt-2">
            <label>If Others, specify</label>
            <input
              type="text"
              onChange={(e) => handleInputChange(mainSection, subsectionKey, `${field.name}_specify`, e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        )}
      </div>
    );
  
    case "multiselect":
  const selectedValues = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {field.options.map(option => (
        <label key={option} className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox text-[#75C05B] rounded border-[#007664] focus:ring-[#53FDFD]"
            checked={selectedValues.includes(option)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...selectedValues, option]
                : selectedValues.filter(v => v !== option);
              handleInputChange(mainSection, subsectionKey, field.name, newValues);
            }}
          />
          <span className="ml-2 text-[#007664]">{option}</span>
        </label>
      ))}

      {/* Show the "Specify" text box if "Others" is selected */}
      {selectedValues.includes("Others") && (
        <div className="mt-2">
          <label className="text-[#007664] block mb-1">If Others, specify:</label>
          <input
            type="text"
            value={field.specifyValue || ""} // Use a state or value for "Others" input
            onChange={(e) =>
              handleInputChange(
                mainSection,
                subsectionKey,
                `${field.name}_specify`,
                e.target.value
              )
            }
            className="w-full p-2 border-2 border-[#75C05B] rounded text-[#007664] focus:ring-[#007664] focus:ring-offset-2"
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
      className="bg-white rounded-lg border border-[#75C05B] hover:border-[#007664] transition-all duration-200"
      onMouseEnter={() => setActiveSection(subsectionKey)}
      onMouseLeave={() => setActiveSection(null)}
    >
      <div className="p-4 space-y-4">
        {subsection.fields.map(field => (
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
 
    const filtered = Object.keys(sicknessSections || {}).reduce((acc, sectionKey) => {
      const section = sicknessSections[sectionKey];
      
      if (!section.subsections || typeof section.subsections !== 'object') {
        return acc;
      }
  
      const filteredSubsections = Object.keys(section.subsections).reduce((subAcc, subsectionKey) => {
        const subsection = section.subsections[subsectionKey];
        
        const isSelected =selectedComplaints.section === section.title && selectedComplaints.subsection === subsection.title
    
        console.log(isSelected)
        if (isSelected) {
          subAcc[subsectionKey] = subsection;
        }
        return subAcc;
      }, {});
  
      if (Object.keys(filteredSubsections).length > 0) {
        acc[sectionKey] = {
          title: section.title,
          subsections: filteredSubsections,
        };
      }
      
      return acc;
    }, {});
    console.log(filteredComplaints)
   //setFilteredComplaints(filtered);
// Add dependencies that should trigger a re-filter
//
return (
  <div className="max-w-7xl mx-auto p-6 bg-[#F7F7F7] min-h-screen">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#007664] mb-2">Medical Assessment Form</h1>
      <p className="text-[#B24531]">Please complete all relevant sections</p>
    </div>

    <div className="space-y-8">
      {Object.entries(filteredComplaints).map(([mainSectionKey, mainSection]) => (
        <div key={mainSectionKey} className="rounded-xl overflow-hidden bg-white border border-[#75C05B]">
          <div className="bg-[#007664] px-6 py-4">
            <h2 className="text-xl font-bold text-[#53FDFD] flex items-center">
              {mainSection.title}
            </h2>
          </div>
          
          <div className="p-6">
            {/* Calculate number of visible subsections */}
            {(() => {
              const visibleSubsections = Object.entries(mainSection.subsections).filter(
                ([key, subsection]) => /* Your visibility condition here */true
              );
              
              const gridCols = visibleSubsections.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1";
              
              return (
                <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                  {Object.entries(mainSection.subsections).map(([subsectionKey, subsection]) => (
                    <div key={subsectionKey} className="bg-[#F7F7F7] p-6 rounded-xl border border-[#75C05B]">
                      <h3 className={`text-lg font-semibold mb-4 pb-2 border-b-2 ${
                        activeSection === subsectionKey ? 'text-[#B24531] border-[#B24531]' : 'text-[#007664] border-[#75C05B]'
                      }`}>
                        {subsection.title}
                      </h3>
                      {renderSubsection(mainSectionKey, subsectionKey, subsection)}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>

    <div className="sticky bottom-0 bg-[#F7F7F7] pt-4 mt-8 border-t border-[#75C05B] pb-4">
    </div>
  </div>
);
};

const renderPatientVisitsList = () => {
 
  
  // Sample data
  const visits = [
    {
      id: 1,
      date: '2024-12-28',
      time: '09:30',
      doctor: 'Dr. Smith',
      reason: 'Regular Checkup',
      diagnosis: 'Healthy, no concerns',
      prescription: 'None',
      vitals: {
        bp: '120/80',
        temp: '98.6°F',
        pulse: '72'
      }
    },
    {
      id: 2,
      date: '2024-12-15',
      time: '14:45',
      doctor: 'Dr. Johnson',
      reason: 'Fever and Cough',
      diagnosis: 'Upper Respiratory Infection',
      prescription: 'Amoxicillin 500mg',
      vitals: {
        bp: '118/78',
        temp: '101.2°F',
        pulse: '88'
      }
    },
    {
      id: 3,
      date: '2024-11-30',
      time: '11:15',
      doctor: 'Dr. Smith',
      reason: 'Follow-up',
      diagnosis: 'Recovery progressing well',
      prescription: 'Continue previous medication',
      vitals: {
        bp: '122/82',
        temp: '98.8°F',
        pulse: '76'
      }
    }
  ];

  const toggleVisit = (id) => {
    setExpandedVisit(expandedVisit === id ? null : id);
  };

  return (
    <div className="bg-[#F7F7F7] p-4 " style={{ width: '65vw', maxWidth: '87%' , display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Ensures it takes the full screen height
    margin: '0 auto', }}>
      <Card className="w-full  bg-white shadow-lg">
        <CardHeader className="bg-[#007664] text-white rounded-t-lg">
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
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleVisit(visit.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#53FDFD]/10 transition-colors"
                  style={{ backgroundColor: expandedVisit === visit.id ? '#53FDFD/20' : 'white' }}
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
                  {expandedVisit === visit.id ? 
                    <ChevronUp className="text-[#007664]" size={20} /> : 
                    <ChevronDown className="text-[#007664]" size={20} />
                  }
                </button>
                
                {expandedVisit === visit.id && (
                  <div className="p-4 bg-[#F7F7F7] border-t">
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-[#75C05B]" size={16} />
                        <span className="text-sm text-[#007664]">Time: {visit.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="text-[#75C05B]" size={16} />
                        <span className="text-sm text-[#007664]">Doctor: {visit.doctor}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#B24531]">Vitals</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm text-[#007664]">
                          <div className="p-2 bg-white rounded">BP: {visit.vitals.bp}</div>
                          <div className="p-2 bg-white rounded">Temp: {visit.vitals.temp}</div>
                          <div className="p-2 bg-white rounded">Pulse: {visit.vitals.pulse}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#B24531]">Diagnosis</h4>
                        <p className="text-sm text-[#007664] p-2 bg-white rounded">{visit.diagnosis}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-[#B24531]">Prescription</h4>
                        <p className="text-sm text-[#007664] p-2 bg-white rounded">{visit.prescription}</p>
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
        'I washed my hands',
        'I greeted the patient by name',
        'I verified patient identity',
        'I have asked the patient to sit/lie down comfortably, as necessary',
        'I observed the patient\'s gait',
        'I asked the patient if there was any pain anywhere',
        'There is a female chaperon in the room (for female patient)',
        'I have checked patients visit history',
      ];
  
   const vitalFields = [
      { label: 'Temperature (°C)', name: 'temperature', icon: '🌡️' },
      { label: 'Blood Pressure (mmHg)', name: 'bloodPressure', icon: '❤️' },
      { label: 'Pulse (bpm)', name: 'pulse', icon: '💓' },
      { label: 'Height (cm)', name: 'height', icon: '📏' },
      { label: 'Weight (kg)', name: 'weight', icon: '⚖️' },
      { label: 'SpO2 (%)', name: 'spo2', icon: '🫁' },
      { label: 'Respiratory Rate (bpm)', name: 'respiratoryRate', icon: '🫸' }
    ];
  
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-xl shadow-sm">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Pre-Checks</h2>
            <p className="text-gray-500 mt-1">Complete all required checks before proceeding</p>
          </div>
  
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preCheckItems.map((check) => (
                <div key={check} className="flex items-center group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={check}
                      name={check}
                      className="peer h-5 w-5 rounded border-2 border-gray-300 text-teal-500 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer appearance-none checked:bg-teal-500 checked:border-transparent"
                      onChange={handleChange}
                    />
                    <Check className="absolute top-1 left-1 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                  <label htmlFor={check} className="ml-3 text-gray-700 group-hover:text-gray-900 cursor-pointer">
                    {check}
                  </label>
                </div>
              ))}
            </div>
          </div>
  
          <div className="space-y-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Vital Signs</h3>
              <div className="h-1 flex-grow mx-4 bg-gradient-to-r from-teal-500/20 to-transparent rounded"></div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Appearance</label>
                <select
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                  name="appearance"
                  onChange={handleChange}
                >
                  {['Well', 'Unwell', 'Pale', 'Flushed', 'Icteric', 'Lethargic', 'Active', 'Agitated', 'Calm', 'Compliant', 'Combative'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gait</label>
                <select
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                  name="gait"
                  onChange={handleChange}
                >
                  {['Walks Normally', 'Walk with Limp', 'Walk with a Bump', 'Cannot Walk'].map((option) => (
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
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
   
  const renderChiefComplaints = ({selectedComplaints, setSelectedComplaints}) => {
   
    
      const sections = [
        {
          title: 'General Symptoms',
          icon: '🌡️',
          items: ['Fever', 'General Weakness/Fatigue', 'Specific Weakness', 'Dizziness', 'Fainting', 'Headache']
        },
        {
          title: 'Respiratory Issues',
          icon: '🫁',
          items: ['Cough/Throat Problem', 'Difficulty in Breathing/Shortness of Breath', 'Sore Throat']
        },
        {
          title: 'Gastrointestinal Issues',
          icon: '🍽️',
          items: ['Acidity/Indigestion', 'Diarrhea', 'Vomiting', 'Abdominal Pain', 'Bleeding with Stool', 'Ulcer']
        },
        {
          title: 'Urinary and Reproductive Health',
          icon: '⚕️',
          items: ['Yellow Urine', 'Urinary Issues (e.g., Painful Urination, Frequent Urination)', 'Menstrual Issues (e.g., Period Problem, Menstruation)', 'Sexual Health Issues (e.g., Intercourse Problem, Private Part Problem)','Prenatal Issues','Pregnancy','Family Planning/Contraceptives']
        },
        {
          title: 'Skin and External Conditions ',
          icon: '🧴',
          items: ['Boils', 'Skin Rash', 'Injury', 'Cardiovascular Issues','Palpitations']
        },
        {
          title: 'Others',
          icon: '❓',
          items: ['']
        }
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
                !(complaint.section === sectionTitle && complaint.subsection === item)
            );
            console.log(updatedComplaints)
    
        setSelectedComplaints(updatedComplaints); // Update the state in the main component
      };
      
      const isComplaintSelected = (sectionTitle, item) => {
        // Check if a complaint exists in the local variable
      
      };
      
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 bg-[#F7F7F7] rounded-xl shadow-sm">
          {/* Alert Banner */}
          <div className="bg-[#007664]/10 border border-[#007664]/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-[#007664] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#007664]">
              Please review the patients medical history before proceeding with the new consultation to ensure comprehensive and personalized care.
            </p>
          </div>
    
          {/* Header */}
          <div className="border-b border-[#007664]/20 pb-4">
            <h2 className="text-2xl font-bold text-[#007664]">Chief Complaints</h2>
            <p className="text-[#007664]/70 mt-1">Select all applicable symptoms</p>
          </div>
    
          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map(section => (
              <div 
                key={section.title} 
                className="space-y-4 bg-white p-6 rounded-lg border border-[#007664]/20 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-[#007664]">{section.title}</h3>
                </div>
    
                <div className="space-y-3">
                {section.items.map(item => (
  <div key={item} className="flex items-center group">
    <div className="relative">
      {/* Check if the item is 'Others' */}
      {section.title === "Others" ? (
        // If item is "Others", render a text area or input box instead of checkbox
        <textarea
          id={`${section.title}-${item}`}
          name={item}
          value={isComplaintSelected(section.title, item) || ""}
          className="h-24 w-full p-2 border-2 border-[#75C05B] text-[#007664] focus:ring-[#007664] focus:ring-offset-2 rounded-md transition-colors duration-200"
          onChange={(event) => handleChangeChiefcomplain(section.title, item, event.target.value)}
          placeholder="Please specify..."
        />
      ) : (
        // If item is not "Others", render the checkbox as usual
        <input
          type="checkbox"
          id={`${section.title}-${item}`}
          name={item}
          checked={isComplaintSelected(section.title, item)}
          className="peer h-5 w-5 rounded border-2 border-[#75C05B] text-[#007664] focus:ring-[#007664] focus:ring-offset-2 transition-colors duration-200 cursor-pointer appearance-none checked:bg-[#007664] checked:border-transparent"
          onChange={(event) => handleChangeChiefcomplain(section.title, item, event.target.checked)}
        />
      )}
    </div>
    <label
      htmlFor={`${section.title}-${item}`}
      className="ml-3 text-[#007664]/80 group-hover:text-[#007664] cursor-pointer text-sm"
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
      );}
  
  const renderPhysicalExam= () => {
    const handleChange = (e) => {
      // Handle form changes here
      console.log(e.target.name, e.target.value);
    };
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Physical Examination</h2>
          <Image src={main} alt="Description of the image" width={500} height={300} />
          {[
            {
              title: 'Eye',
              sections: [
                {
                  name: 'Jaundice',
                  image: eye,
                  options: ['Yes', 'No']
                },
                {
                  name: 'Pallor',
                  image: pallor,
                  options: ['Mild', 'Moderate', 'Severe', 'None']
                }
              ]
            },
            {
              title: 'Hand',
              sections: [
                {
                  name: 'Cyanosis',
                  image: cybosis,
                  options: ['Yes', 'No']
                },
                {
                  name: 'Clubbing',
                  image: curbing,
                  options: ['Normal', 'Clubbing', 'None']
                }
              ]
            },
            {
              title: 'Leg',
              sections: [
                {
                  name: 'Oedema',
                  image: leg,
                  options: ['Mild', 'Moderate', 'Severe', 'None']
                }
              ]
            }
          ].map(area => (
            <div key={area.title} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">{area.title}</h3>
              
              <div className="space-y-6">
                {area.sections.map(section => (
                  <div key={section.name} className="grid md:grid-cols-2 gap-6">
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <Image 
                        src={section.image}
                        alt={section.name}
                        className="w-full h-full object-cover"
                        width={300}
                        height={256}
                      />
                    </div>
  
                    <div className="space-y-3">
                      <p className="font-medium text-gray-700">{section.name}</p>
                      <div className="grid grid-cols-2 gap-4">
                        {section.options.map(option => (
                          <label
                            key={option}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name={`${area.title}-${section.name}`}
                              value={option}
                              className="h-4 w-4 text-blue-600"
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
      () => renderChiefComplaints({ selectedComplaints, setSelectedComplaints }),
      () => MultiSectionSymptomsForm({ selectedComplaints }),
      renderPhysicalExam,
      
      
    ];
  
    return (
      <div className="flex flex-col min-h-screen max-w-6xl mx-auto p-6">
      {/* Page number circles at the top */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: pages.length }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              border-2 border-teal-500 font-medium text-sm
              ${currentPage === pageNum 
                ? 'bg-teal-500 text-white' 
                : 'bg-white text-teal-500 hover:bg-teal-50'
              }
              transition-colors duration-200
            `}
          >
            {pageNum}
          </button>
        ))}
      </div>
    
      {/* Content area */}
      <div className="flex-1 overflow-auto mb-8"> {/* This makes the content take the available space */}
        {pages[currentPage - 1]()}
      </div>
    
      {/* Navigation footer */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
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
      setCurrentPage(prev => Math.min(pages.length, prev + 1));
    }
  }}
  disabled={false} // Ensure the button is always active
  className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors duration-200"
>
  {currentPage === pages.length ? "Continue" : "Next"}
  <ChevronRight className="w-5 h-5 ml-2" />
</button>


          </div>
        </div>
      </div>
    </div>
    
    );
  };














 const LabResultDetailsModal = ({ result, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lab Result Details</DialogTitle>
        </DialogHeader>
        <Card className="space-y-4">
          {/* Basic Test Information */}
          <CardHeader>
            <CardTitle>Basic Test Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium">Test Name</h4>
                <p>{result.testName}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p>{result.description}</p>
              </div>
              <div>
                <h4 className="font-medium">LOINC Code</h4>
                <p>{result.code}</p>
              </div>
            </div>
          </CardContent>

          {/* Result Value and Reference Ranges */}
          <CardHeader>
            <CardTitle>Result and Reference Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium">Result Value</h4>
                <p>{result.value} {result.unit}</p>
              </div>
              <div>
                <h4 className="font-medium">Reference Range</h4>
                <p>{result.referenceRange}</p>
              </div>
            </div>
          </CardContent>

          {/* Flags or Alerts */}
          <CardHeader>
            <CardTitle>Interpretive Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="border-b pb-4">{result.flags}</p>
          </CardContent>

          {/* Collection Details */}
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium">Collection Method</h4>
                <p>{result.collectionMethod}</p>
              </div>
              <div>
                <h4 className="font-medium">Specimen Type</h4>
                <p>{result.specimenType}</p>
              </div>
            </div>
          </CardContent>

          {/* Timing and Ordering Information */}
          <CardHeader>
            <CardTitle>Timing and Ordering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium">Performed Date</h4>
                <p>{result.performedDate}</p>
              </div>
              <div>
                <h4 className="font-medium">Ordered By</h4>
                <p>{result.orderedBy}</p>
              </div>
              <div>
                <h4 className="font-medium">Performing Lab</h4>
                <p>{result.performingLab}</p>
              </div>
            </div>
          </CardContent>

          {/* Patient Details */}
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <p>{result.patientName}</p>
              </div>
              <div>
                <h4 className="font-medium">DOB</h4>
                <p>{result.patientDOB}</p>
              </div>
              <div>
                <h4 className="font-medium">MRN</h4>
                <p>{result.patientMRN}</p>
              </div>
            </div>
          </CardContent>

          {/* Additional Information */}
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Status</h4>
                <p>{result.status}</p>
              </div>
              <div>
                <h4 className="font-medium">Comments</h4>
                <p>{result.comments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};




 const [newConsultation, setNewConsultation] = useState({
  id: '',                           // Unique identifier for the Consultation
  status: '',                       // Consultation status
  category: [],                     // Classification of consultation
  serviceType: [],                  // Type of service provided
  subject: {
    reference: '',                  // Reference to the patient
    display: ''                     // Patient's name
  },
  participant: [
    {
      type: [],                     // Participant type
      individual: {
        reference: '',              // Reference to participant
        display: ''                 // Participant's name
      }
    }
  ],
  occurrenceDateTime: '',           // Date/Time of the consultation
  created: '',                      // Creation date of consultation
  description: '',                  // Description of consultation
  reasonCode: [],                   // Codes for the consultation reason
  diagnosis: [],                    // Diagnosis associated with consultation
  appointment: {
    reference: ''                   // Reference to the appointment
  },
  period: {
    start: '',                      // Start date/time of consultation
    end: ''                         // End date/time of consultation
  },
  location: {
    location: {
      reference: '',                // Location reference
      display: ''                   // Location name
    }
  },
  hospitalization: {
    admitSource: '',                // Source of admission
    dischargeDisposition: ''        // Disposition at discharge
  },
  totalCost: {
    value: 0,                       // Total cost of consultation
    currency: ''                    // Currency
  },
  presentedProblem: [],             // Problems presented during consultation
  progress: [],                     // Progress notes
  summary: ''                       // High-level summary of consultation
});

const ConsultationDetailsModal = ({ consult, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Consultation Details</DialogTitle>
        </DialogHeader>
        <Card className="space-y-6">
          {/* Basic Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Status</h4>
                <p className="text-sm md:text-base">{consult.status}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Category</h4>
                <p className="text-sm md:text-base">{consult.category.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Service Type</h4>
                <p className="text-sm md:text-base">{consult.serviceType.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Patient</h4>
                <p className="text-sm md:text-base">{consult.subject.display}</p>
              </div>
            </div>
          </CardContent>

          {/* Participant Details */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Participant Details</CardTitle>
          </CardHeader>
          <CardContent>
            {consult.participant.map((participant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium text-sm md:text-base">Type</h4>
                  <p className="text-sm md:text-base">{participant.type.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base">Name</h4>
                  <p className="text-sm md:text-base">{participant.individual.display}</p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Timing Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Timing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Occurrence Date/Time</h4>
                <p className="text-sm md:text-base">{consult.occurrenceDateTime}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Created</h4>
                <p className="text-sm md:text-base">{consult.created}</p>
              </div>
            </div>
          </CardContent>

          {/* Additional Details */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Reason Code</h4>
                <p className="text-sm md:text-base">{consult.reasonCode.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Diagnosis</h4>
                <p className="text-sm md:text-base">{consult.diagnosis.join(', ')}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-medium text-sm md:text-base">Summary</h4>
                <p className="text-sm md:text-base">{consult.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

const [newDiagnosis, setNewDiagnosis] = useState({
  id: '',                           // Unique identifier for the Diagnosis
  status: '',                       // Diagnosis status
  category: [],                     // Classification of diagnosis
  serviceType: [],                  // Type of service related to diagnosis
  patient: {
    reference: '',                  // Reference to the patient
    display: ''                     // Patient's name
  },
  participant: [
    {
      type: [],                     // Participant type (e.g., doctor, specialist)
      individual: {
        reference: '',              // Reference to participant
        display: ''                 // Participant's name
      }
    }
  ],
  occurrenceDateTime: '',           // Date/Time of the diagnosis
  created: '',                      // Creation date of diagnosis
  description: '',                  // Description of diagnosis
  reasonCode: [],                   // Codes for the diagnosis reason
  diagnosisDetails: [],             // Specific details of diagnosis
  appointment: {
    reference: ''                   // Reference to the associated appointment
  },
  period: {
    start: '',                      // Start date/time of diagnosis
    end: ''                         // End date/time of diagnosis, if applicable
  },
  location: {
    location: {
      reference: '',                // Location reference
      display: ''                   // Location name
    }
  },
  hospitalization: {
    admitSource: '',                // Source of admission
    dischargeDisposition: ''        // Disposition at discharge, if relevant
  },
  totalCost: {
    value: 0,                       // Total cost of diagnosis-related services
    currency: ''                    // Currency
  },
  presentedProblem: [],             // Problems presented leading to diagnosis
  progress: [],                     // Progress notes related to diagnosis
  summary: ''                       // High-level summary of diagnosis
});
const [newMedication, setNewMedication] = useState({
    medicationDescription: '',
    medicationNote: '',
    medicationCode: '',
    medicationStatus: 'active',
    medicationStartDate: '',
    medicationStartTime: '',
    medicationEndDate: '',
    medicationFrequency: {
      type: 'daily',
      value: 1
    }
  });


const DiagnosisForm = ({ buttonText, onSubmit, diagnosesData}) => {
  const [newDiagnosis, setNewDiagnosis] = useState({
    id: '',                           // Unique identifier for the Diagnosis
    status: '',                       // Diagnosis status
    category: [],                     // Classification of diagnosis
    serviceType: [],                  // Type of service related to diagnosis
    patient: {
      reference: '',                  // Reference to the patient
      display: ''                     // Patient's name
    },
    participant: [
      {
        type: [],                     // Participant type (e.g., doctor, specialist)
        individual: {
          reference: '',              // Reference to participant
          display: ''                 // Participant's name
        }
      }
    ],
    occurrenceDateTime: '',           // Date/Time of the diagnosis
    created: '',                      // Creation date of diagnosis
    description: '',                  // Description of diagnosis
    reasonCode: [],                   // Codes for the diagnosis reason
    diagnosisDetails: [],             // Specific details of diagnosis
    appointment: {
      reference: ''                   // Reference to the associated appointment
    },
    period: {
      start: '',                      // Start date/time of diagnosis
      end: ''                         // End date/time of diagnosis, if applicable
    },
    location: {
      reference: '',                  // Location reference
      display: ''                     // Location name
    },
    hospitalization: {
      admitSource: '',                // Source of admission
      dischargeDisposition: ''        // Disposition at discharge, if relevant
    },
    totalCost: {
      value: 0,                       // Total cost of diagnosis-related services
      currency: ''                    // Currency
    },
    presentedProblem: [],             // Problems presented leading to diagnosis
    progress: [],                     // Progress notes related to diagnosis
    summary: ''                       // High-level summary of diagnosis
  });
  
  // Pre-populate form for editing
  useEffect(() => {
    if (diagnosesData) {
      console.log(diagnosesData)
      setNewDiagnosis({
        id: diagnosesData.id || '',
        patient: {
          reference: diagnosesData.patient?.reference || '',
          display: diagnosesData.patient?.display || ''
        },
        status: diagnosesData.status || '',
        category: diagnosesData.category || [],
        serviceType: diagnosesData.serviceType || [],
        occurrenceDateTime: diagnosesData.occurrenceDateTime || '',
        created: diagnosesData.created || '',
        reasonCode: diagnosesData.reasonCode || [],
        description: diagnosesData.description || '',
        diagnosisDetails: diagnosesData.diagnosisDetails || [],
        appointment: {
          reference: diagnosesData.appointment?.reference || ''
        },
        period: {
          start: diagnosesData.period?.start || '',
          end: diagnosesData.period?.end || ''
        },
        location: {
          reference: diagnosesData.location?.reference || '',
          display: diagnosesData.location?.display || ''
        },
        hospitalization: {
          admitSource: diagnosesData.hospitalization?.admitSource || '',
          dischargeDisposition: diagnosesData.hospitalization?.dischargeDisposition || ''
        },
        totalCost: {
          value: diagnosesData.totalCost?.value || 0,
          currency: diagnosesData.totalCost?.currency || ''
        },
        presentedProblem: diagnosesData.presentedProblem || [],
        progress: diagnosesData.progress || [],
        summary: diagnosesData.summary || ''
      });
    }
  }, [diagnosesData]);
  
  const handleChange = (field, value) => {
    setNewDiagnosis((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Diagnosis ID */}
      <div className="space-y-2">
        <Label htmlFor="id">Diagnosis ID</Label>
        <Input
          id="id"
          placeholder="Diagnosis ID"
          value={newDiagnosis.id}
          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, id: e.target.value }))}
        />
      </div>

      {/* Diagnosis Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Diagnosis Status</Label>
        <Select
          value={newDiagnosis.status}
          onValueChange={(value) => setNewDiagnosis(prev => ({ ...prev, status: value }))}
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
          onChange={(e) => updateNestedState('patient.display', e.target.value)}
        />
      </div>

      {/* Occurrence Date Time */}
              <div className="space-y-2">
          <Label>Occurrence Date</Label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={newDiagnosis.occurrenceDateTime ? new Date(newDiagnosis.occurrenceDateTime).toISOString().split("T")[0] : ""}
            onChange={(e) => updateNestedState('occurrenceDateTime', e.target.value)}
          />
        </div>

      {/* Description */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Diagnosis Description</Label>
        <Textarea
          id="description"
          placeholder="Detailed diagnosis description"
          value={newDiagnosis.description}
          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, description: e.target.value }))}
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
          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, summary: e.target.value }))}
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
          onChange={(e) => updateNestedState('location.display', e.target.value)}
        />
      </div>

      {/* Hospitalization Details */}
      <div className="space-y-2">
        <Label htmlFor="admitSource">Admit Source</Label>
        <Input
          id="admitSource"
          placeholder="Admission Source"
          value={newDiagnosis.hospitalization.admitSource}
          onChange={(e) => updateNestedState('hospitalization.admitSource', e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="md:col-span-2 flex justify-end space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setIsEditOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(newDiagnosis)}
          disabled={isLoading}
          className="bg-teal-700 hover:bg-teal-800 text-white"
        >
          {isLoading ? 'Submitting...' : buttonText}
        </Button>
      </div>
    </div>
  );
};



const DiagnosisDetailsModal = ({ diagnosis, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Consultation Details</DialogTitle>
        </DialogHeader>
        <Card className="space-y-6">
          {/* Basic Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Status</h4>
                <p>{diagnosis.status}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Category</h4>
                <p>{diagnosis.category.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Service Type</h4>
                <p>{diagnosis.serviceType.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Patient</h4>
                <p>{diagnosis.patient.display}</p>
              </div>
            </div>
          </CardContent>

          {/* Participant Details */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Participant Details</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnosis.participant.map((participant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium text-sm md:text-base">Type</h4>
                  <p>{participant.type.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base">Name</h4>
                  <p>{participant.individual.display}</p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Timing Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Timing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Occurrence Date/Time</h4>
                <p>{diagnosis.occurrenceDateTime}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Created</h4>
                <p>{diagnosis.created}</p>
              </div>
            </div>
          </CardContent>

          {/* Additional Details */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Reason Code</h4>
                <p>{diagnosis.reasonCode.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Progress</h4>
                <p>{diagnosis.progress.join(', ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Presented Problem</h4>
                <p>{diagnosis.presentedProblem}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Presented Problem</h4>
                <p>{diagnosis.presentedProblem}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="font-medium text-sm md:text-base">Summary</h4>
                <p>{diagnosis.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};




const MedicationForm = ({ buttonText, onSubmit, medicationData}) => {
  const [newMedication, setNewMedication] = useState({
    medicationDescription: '',
    medicationNote: '',
    medicationCode: [],
    medicationStatus: 'active',
    medicationStartDate: '',
    medicationStartTime: '',
    medicationEndDate: '',
    medicationFrequency: {
      type: 'daily',
      value: 1,
    },
    dosage: '',
    name: '',
  });
  
  // Pre-populate form for editing
  useEffect(() => {
    if (medicationData) {
      console.log(medicationData);
      setNewMedication({
        medicationDescription: medicationData.medicationDescription || '',
        medicationNote: medicationData.medicationNote || '',
        medicationCode: medicationData.medicationCode || [],
        medicationStatus: medicationData.medicationStatus || 'active',
        medicationStartDate: medicationData.medicationStartDate || '',
        medicationStartTime: medicationData.medicationStartTime || '',
        medicationEndDate: medicationData.medicationEndDate || '',
        medicationFrequency: medicationData.medicationFrequency || { type: 'daily', value: 1 },
        dosage: medicationData.dosage || '',
        name: medicationData.name || '',
      });
    }
  }, [medicationData]); // Ensures the effect runs when `medicationData` changes
  
  const handleChange = (field, value) => {
    setNewMedication((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
      <div className="space-y-2">
        <Label htmlFor="medication">Medication ID</Label>
        <Input
          id="medication"
          disabled="disabled"
          placeholder="Medication"
          value="dg-001"
        />
      </div>
     
     
      <div className="space-y-2">
        <Label htmlFor="medicationNote">Medication Note</Label>
        <textarea
          id="medicationNote"
          placeholder="Medication Note"
          value={newMedication.medicationNote}
          onChange={(e) => setNewMedication({ ...newMedication, medicationNote: e.target.value })}
          rows={4}
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
 <div className="space-y-2">
        <Label htmlFor="medicationCode">Condition</Label>
        <Input
          id="medicationCode"
          placeholder="Medication Code"
          value={newMedication.medicationCode}
          onChange={(e) => setNewMedication({ ...newMedication, medicationCode: e.target.value.split(', ') })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationCode">Name</Label>
        <Input
          id="medname"
          placeholder="Medication name"
          value={newMedication.name}
          onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value.split(', ') })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationDosage">Dosage</Label>
        <Input
          id="medicationDosage"
          placeholder="Medication Dosage"
          value={newMedication.dosage}
          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value.split(', ') })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationStatus">Medication Status</Label>
        <Select
          value={newMedication.medicationStatus}
          onValueChange={(value) => setNewMedication({ ...newMedication, medicationStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Medication Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationStartDate">Start Date</Label>
        <Input
          id="medicationStartDate"
          type="date"
          value={newMedication.medicationStartDate}
          onChange={(e) => setNewMedication({ ...newMedication, medicationStartDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationEndDate">End Date</Label>
        <Input
          id="medicationEndDate"
          type="date"
          value={newMedication.medicationEndDate}
          onChange={(e) => setNewMedication({ ...newMedication, medicationEndDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationStartTime">Start Time</Label>
        <Input
          id="medicationStartTime"
          type="time"
          value={newMedication.medicationStartTime}
          onChange={(e) => setNewMedication({ ...newMedication, medicationStartTime: e.target.value })}
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="medicationDescription">Medication</Label>
        <textarea
          id="medicationDescription"
          placeholder="Medication Description"
          value={newMedication.medicationDescription}
          onChange={(e) => setNewMedication({ ...newMedication, medicationDescription: e.target.value })}
          rows={4} 
           className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
       
       />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationFrequencyType">Frequency Type</Label>
        <Select
          value={newMedication.medicationFrequency.type}
          onValueChange={(value) => setNewMedication({ ...newMedication, medicationFrequency: { ...newMedication.medicationFrequency, type: value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Frequency Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {newMedication.medicationFrequency.type === 'daily' && (
        <div className="space-y-2">
          <Label htmlFor="medicationFrequencyValue">Frequency Value</Label>
          <Input
            id="medicationFrequencyValue"
            type="number"
            value={newMedication.medicationFrequency.value}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setNewMedication({ ...newMedication, medicationFrequency: { ...newMedication.medicationFrequency, value } });
              }
            }}          />
        </div>
      )}
      
      <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-teal-700 hover:bg-teal-800 text-white"
        >
          {isLoading ? 'Submitting...' : buttonText}
        </Button>
      </div>
    </div>
  );
};

const MedicationDetailsModal = ({ medic, isOpen, onClose }) => { 
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Medication Details</DialogTitle>
        </DialogHeader>
        <Card className="space-y-6">
          {/* Basic Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Medication Name</h4>
                <p>{medic.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Dosage</h4>
                <p>{medic.dosage}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Frequency</h4>
                <p>{medic.frequency}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Start Date</h4>
                <p>{medic.startDate}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">End Date</h4>
                <p>{medic.endDate}</p>
              </div>
            </div>
          </CardContent>

          {/* Additional Information */}
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
              <div>
                <h4 className="font-medium text-sm md:text-base">Medication Status</h4>
                <p>{medic.medicationStatus}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Medication Description</h4>
                <p>{medic.medicationDescription}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base">Medication Frequency Type</h4>
                <p>{medic.medicationFrequency.type}</p>
              </div>
              {medic.medicationFrequency.type === "daily" && (
                <div>
                  <h4 className="font-medium text-sm md:text-base">Frequency Value</h4>
                  <p>{medic.medicationFrequency.value} times per day</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-sm md:text-base">Start Time</h4>
                <p>{medic.medicationStartTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setlabtestFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
const RenderLabTests = () => (
  <div className="space-y-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Laboratory Tests</h2>
      <p className="text-gray-600 mt-2">Select the required diagnostic tests for the patient</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          category: 'General Health Screening',
          icon: <Beaker className="w-6 h-6 text-blue-500" />,
          color: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-700',
          tests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel', 'Urinalysis']
        },
        {
          category: 'Diabetes and Endocrine Function',
          icon: <Activity className="w-6 h-6 text-purple-500" />,
          color: 'from-purple-50 to-purple-100',
          textColor: 'text-purple-700',
          tests: ['Fasting Blood Glucose', 'Hemoglobin A1c (HbA1c)', 'Thyroid Function Tests (TSH, T3, T4)']
        },
        {
          category: 'Cardiovascular Health',
          icon: <Heart className="w-6 h-6 text-red-500" />,
          color: 'from-red-50 to-red-100',
          textColor: 'text-red-700',
          tests: ['Electrocardiogram (ECG)', 'Troponin Test']
        },
        {
          category: 'Advanced Diagnostics',
          icon: <flask-conical className="w-6 h-6 text-emerald-500" />,
          color: 'from-emerald-50 to-emerald-100',
          textColor: 'text-emerald-700',
          tests: ['Chest X-ray', 'MRI Scan', 'CT Scan', 'Ultrasound']
        }
      ].map(category => (
        <Card key={category.category} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${category.color} p-4`}>
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <h3 className={`text-lg font-semibold ${category.textColor}`}>
                  {category.category}
                </h3>
              </div>
              <div className="space-y-3">
                {category.tests.map(test => (
                  <label key={test} className="flex items-center gap-3 bg-white rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={test}
                        name={test}
                        className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500"
                        onChange={handleChange}
                      />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{test}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
  

    </div>
    <div className="flex justify-end">
  <Button 
    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
    onClick={startSmartConsult}
  >
    Next
  </Button>
</div>

  </div>
);

const doctors = [{ id: 1, name: "Dr. Alice" }, { id: 2, name: "Dr. Bob" }];
const labTechnicians = [{ id: 1, name: "Tech Anne" }, { id: 2, name: "Tech Max" }];
const pharmacies = [{ id: 1, name: "Pharmacy A" }, { id: 2, name: "Pharmacy B" }];

const ConsultationForm = ({ buttonText, onSubmit, consultationData }) => {
  const [newConsultation, setNewConsultation] = useState({
    id: '',
    patientName: '',
    status: '',
    category: [],
    serviceType: '',
    occurrenceDateTime: '',
    created: '',
    reasonCode: [],
    diagnosis: [],
    summary: '',
    participant: [], // Ensure participant data is included if needed
  });

  // Pre-populate form for editing
  useEffect(() => {
    if (consultationData) {
      console.log(consultationData)
      setNewConsultation({
        id: consultationData.id || '',
        patientName: consultationData.subject?.display || '',
        status: consultationData.status || '',
        category: consultationData.category || [],
        serviceType: consultationData.serviceType?.[0] || '',
        occurrenceDateTime: consultationData.occurrenceDateTime || '',
        created: consultationData.created || '',
        reasonCode: consultationData.reasonCode || [],
        diagnosis: consultationData.diagnosis || [],
        summary: consultationData.summary || '',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="id">Consultation ID</Label>
        <Input
          disabled="disabled"
          id="id"
          placeholder="Consultation ID"
          value={newConsultation.id}
          onChange={(e) => handleChange('id', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientName">Patient Name</Label>
        <Input
          id="patientName"
          placeholder="Patient Name"
          value={newConsultation.patientName}
          disabled="disabled"
          onChange={(e) => handleChange('patientName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={newConsultation.status}
          onValueChange={(value) => handleChange('status', value)}
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
          value={newConsultation.category.join(', ')}
          onValueChange={(value) => handleChange('category', value.split(', '))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="new-patient">New Patient</SelectItem>
            <SelectItem value="annual-checkup">Annual Checkup</SelectItem>
            <SelectItem value="specialist-consultation">Specialist Consultation</SelectItem>
            <SelectItem value="emergency-visit">Emergency Visit</SelectItem>
            <SelectItem value="routine-care">Routine Care</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          value={newConsultation.serviceType}
          onValueChange={(value) => handleChange('serviceType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
            <SelectItem value="mental-health-counseling">Mental Health Counseling</SelectItem>
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
          onChange={(e) => handleChange('occurrenceDateTime', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="created">Created Date/Time</Label>
        <Input
          id="created"
          type="datetime-local"
          value={newConsultation.created}
          onChange={(e) => handleChange('created', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Description"
          value={newConsultation.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reasonCode">Reason Code</Label>
        <Select
          value={newConsultation.reasonCode}
          onValueChange={(value) => handleChange('reasonCode', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Reason Code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chronic-condition">Chronic Condition</SelectItem>
            <SelectItem value="mental-health-counseling">Mental Health Counseling</SelectItem>
            <SelectItem value="acute-illness">Acute Illness</SelectItem>
            <SelectItem value="preventive-care">Preventive Care</SelectItem>
            <SelectItem value="post-op-follow-up">Post-op Follow-up</SelectItem>
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
          value={newConsultation.diagnosis.join(', ')}
          onChange={(e) => handleChange('diagnosis', e.target.value.split(', '))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="presentedProblem">Presented Problem</Label>
        <Input
          id="presentedProblem"
          placeholder="Presented Problem"
          value={newConsultation.presentedProblem}
          onChange={(e) => handleChange('presentedProblem', e.target.value.split(', '))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <textarea
          id="summary"
          placeholder="Summary"
          value={newConsultation.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="col-span-1 flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(newConsultation)}
          disabled={isLoading}
          className="bg-teal-700 hover:bg-teal-800 text-white"
        >
          {isLoading ? 'Submitting...' : buttonText}
        </Button>
      </div>
    </div>
  );
};
 const visitHistory = [
    {
      date: 'April 15, 2023',
      doctor: 'Dr. Jane Doe',
      purpose: 'Annual Checkup'
    },
    {
      date: 'June 2, 2023',
      doctor: 'Dr. John Smith',
      purpose: 'Follow-up Appointment'
    },
    {
      date: 'August 20, 2023',
      doctor: 'Dr. Sarah Lee',
      purpose: 'Flu Vaccination'
    },
    {
      date: 'October 10, 2023',
      doctor: 'Dr. David Kim',
      purpose: 'Routine Blood Work'
    },
    {
      date: 'December 5, 2023',
      doctor: 'Dr. Emily Chen',
      purpose: 'Medication Review'
    }
  ];
  const preCheckTasks = [
    { id: "verify-identity", label: "Verify patient identity" },
    { id: "check-vitals", label: "Check patient vitals" },
    { id: "review-history", label: "Review medical history" }
  ]
  const [selectedLabTest, setSelectedLabTest] = useState('cholesterol')
    const startSmartConsult = () => {
      
    // Set the selected user for the call
   ///setSelectedUser(patient);
    // Switch to the callsetup tab
    if(activeTab==="summary"){
      setActiveTab("smartconsult")
    }else{
      setActiveTab("summary");
    }
  
  };
  const handleSendReport = () => {
    console.log('Sending report...')
  }

  const handlePrintReport = () => {
    console.log('Printing report...')
  }
  return (

<div>
{activeTab === "summary" && (
 <div className="flex justify-between items-center">
  
   <Card className="w-full bg-[#75C05B]/10" style={{
        width: isMobile ? '100vw' :'80vw',// Full width only on mobile
        margin: '0',
        padding: '0',
      }} >
   
     <h2 className="text-2xl font-bold text-[#007664]"> </h2>
     
   <CardHeader className="mb-4 bg-gradient-to-r from-[#007664] to-[#75C05B] flex flex-row justify-between items-center">
      {/* Patient Info */}
      <div className="flex-grow">
      <CardTitle className="text-white">Patient Information</CardTitle>
      </div>
      
      {/* Action Buttons Group */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      
  <Button
    variant="outline"
    size="icon"
    className="rounded-full w-10 h-10 border-teal-800 hover:bg-teal-800/10"
    onClick={handleCallClick}
  >
    <Video className="h-4 w-4 text-teal-800" />
  </Button>
  <Button onClick={handlePrintReport} variant="outline" size="sm" className="bg-white text-[#007664] hover:bg-[#F7F7F7]">
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
  <Button 
    className="bg-[#007664] text-white hover:bg-[#007664]/80 flex items-center gap-2 w-full sm:w-auto"
    onClick={openrefModal}
  >
    <Share2 className="h-4 w-4" />
    <span>Refer Patient</span>
  </Button>
</div>

    </CardHeader>
  {/* Modal for selection */}
     <Modal isOpen={refmodalIsOpen} onRequestClose={closerefModal}>
  <div className="p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-[#007664]">Select Referral Type</h2>
    <select
      value={selectedrefOption}
      onChange={handleSelectrefChange}
      className="mb-4 p-2 border rounded-md w-full border-[#75C05B]"
    >
      <option value="">Select an option</option>
      <option value="doctor">Doctor</option>
      <option value="labTech">Lab Technician</option>
      <option value="pharmacy">Pharmacy</option>
    </select>
    {/* Display the list based on selected option */}
    {selectedrefOption && (
      <div>
        <h3 className="text-lg font-medium mb-2 text-[#007664]">
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
          className="mb-4 p-2 border rounded-md w-full border-[#75C05B]"
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
            <label htmlFor="referralReason" className="block font-medium mb-2 text-[#007664]">
              Referral Reason:
            </label>
            <input
              type="text"
              id="referralReason"
              name="referralReason"
              placeholder="Enter the reason for the referral"
              className="p-2 border rounded-md w-full border-[#75C05B]"
            />
          </div>
        )}
      </div>
    )}
    <div className="flex justify-end">
      {/* Button to close modal */}
      <button
        onClick={closerefModal}
        className="bg-[#B24531] hover:bg-[#a13d2a] text-white px-4 py-2 rounded-md mr-2"
      >
        Close
      </button>
      {/* Submit button */}
      <button
        
        className="bg-[#007664] hover:bg-[#00654f] text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </div>
  </div>
</Modal>
  <CardContent>
    <Tabs defaultValue="summary" className="w-full">
    <TabsList className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-5 mb-4 sm:mb-6">
      <TabsTrigger value="summary" className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20">
        <FileText className="h-4 w-4" />
        Summary
      </TabsTrigger>
      <TabsTrigger value="consultations" className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20">
        <Stethoscope className="h-4 w-4" />
        Consultations
      </TabsTrigger>
      <TabsTrigger value="diagnoses" className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20">
        <FileText className="h-4 w-4" />
        Diagnosis &amp; Prognosis
      </TabsTrigger>
      <TabsTrigger value="labresult" className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20">
        <Thermometer className="h-4 w-4" />
        Lab Test
      </TabsTrigger>
      <TabsTrigger value="medications" className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20">
        <Pill className="h-4 w-4" />
        Medications
      </TabsTrigger >
</TabsList>

    <TabsContent value="summary" className="mt-32 sm:mt-6" style={{
        width: isMobile ? '75vw' :'70vw',// Full width only on mobile
        margin: '6',
        padding: '0',
      }}>
      <div className="space-y-6">
        {/* Top row with Demographics, Vitals, and Call Button */}
      
<Card className="h-full flex flex-col bg-[#F7F7F7]">
           
            <CardContent className="flex-1 overflow-auto">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alice" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-[#007664]">Alice</p>
                  <p className="text-sm text-[#75C05B]">35 years, Female, Pregnant</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-[#007664] mb-2">Vital Signs Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vitalSigns}>
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" label={{ value: 'Heart Rate (bpm) / Blood Pressure (mmHg)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Temperature (°F)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#007664" name="Heart Rate" />
                      <Line yAxisId="left" type="monotone" dataKey="bloodPressure" stroke="#75C05B" name="Blood Pressure" />
                      <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#B24531" name="Temperature" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Rest of the component remains structurally the same, just updating colors */}
                <div>
                  <h3 className="font-medium text-lg text-[#007664] mb-2">Previous Lab Test</h3>
                  <div className="mb-2">
                    <Select onValueChange={setSelectedLabTest} value={selectedLabTest}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select lab test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cholesterol">Cholesterol</SelectItem>
                        <SelectItem value="bloodSugar">Blood Sugar</SelectItem>
                        <SelectItem value="creatinine">Creatinine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={labResults}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={selectedLabTest} stroke="#007664" name={selectedLabTest} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium text-lg text-[#007664] mb-2">Pre-check Tasks</h3>
                {preCheckTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={task.id}
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <Label htmlFor={task.id} className="text-gray-700">{task.label}</Label>
                  </div>
                ))}
              </div>
              {completedTasks.length < preCheckTasks.length && (
                <Alert variant="warning" className="mt-4 bg-[#fff3e6] border-[#B24531]">
                  <AlertTitle className="text-[#B24531]">Attention</AlertTitle>
                  <AlertDescription className="text-[#B24531]">
                    Please complete all pre-check tasks before proceeding with the consultation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        {/* Visit History Section */}
        <div className="bg-[#F7F7F7] rounded-lg p-6 mx-auto">
          <div className="space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#007664]">Patient Visit History</h2>
            {visitHistory.map((visit, index) => (
              <div key={index} className="flex items-center border-b border-[#007664] pb-4 w-full">
                <div className="mr-4">
                  <Calendar className="w-4 h-4 text-[#007664]" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#007664]">{visit.date}</div>
                  <div className="flex items-center text-[#B24531] text-sm">
                    <User className="w-4 h-4 mr-2 text-[#B24531]" /> {visit.doctor}
                  </div>
                  <div className="flex items-center text-[#B24531] text-sm">
                    <Clipboard className="w-4 h-4 mr-2 text-[#B24531]" /> {visit.purpose}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
       
      </div>
    </TabsContent>

      <TabsContent value="consultations" className="mt-32 sm:mt-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
  <h3 className="text-lg font-semibold text-[#007664] mb-4 sm:mb-0">
    Recent Consultations
  </h3>
  <div className="flex flex-col gap-4 sm:flex-row sm:gap-x-4">
    <Dialog open={isAddOpen} onOpenChange={(isOpen) => handleDialogChange(isOpen, 'add')}>
      <DialogTrigger asChild>
        <Button className="bg-[#007664] hover:bg-[#007664]/80 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New Consultation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        <div className="flex justify-center items-center ">
  <DialogTitle className="text-teal-800">New Consultation</DialogTitle>
</div>
        </DialogHeader>

        <MedicalConsultationForm 
          
        />
      </DialogContent>
    </Dialog>

  
  </div>



        </div>
        <div className="border rounded-lg  overflow-x-auto">
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
            const doctor = consultation.participant?.find((p) => p.type.includes("Doctor"));
            const formattedDate = new Date(consultation.created).toISOString().split("T")[0];
            return (
                  <tr key={consultation.id}>
                  <td className="px-4 py-2">{formattedDate}</td>
                  <td className="px-4 py-2">{doctor?.individual?.display || "N/A"}</td>
                  <td className="px-4 py-2">{consultation.reasonCode}</td>
                  <td className="px-4 py-2">{consultation.status}</td>
                  <td className="px-4 py-2">
                     <div className="flex space-x-2">

                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => viewConsultDetails(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog open={isViewConsultOpen} onOpenChange={(isOpen) => handleDialogViewConsult(isOpen)}>
                            <DialogTrigger asChild>
                              
                            </DialogTrigger>

                            <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Consultation Details</DialogTitle>
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
                                onOpenChange={(isOpen) => setIsEditOpen(isOpen)} // Control dialog state
                              >
                                  <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-[#007664] hover:text-[#007664]/80"
                                    
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Consultation</DialogTitle>
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
                            <Trash2 className="h-4 w-4" />
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
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#007664]">Diagnoses History</h3>
        <Dialog open={isAddDOpen} onOpenChange={(isOpen) => handleDialogDChange (isOpen, 'add')}>
        <DialogTrigger asChild>
          <Button className="bg-[#007664] hover:bg-[#007664]/80">
           <Plus className="h-4 w-4" />
            New Diagnosis
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Diagnose</DialogTitle>
          </DialogHeader>

          <NewDiagnosisForm
           
          />
        </DialogContent>
      </Dialog>
          
        </div>
        <div className="border rounded-lg overflow-x-auto">
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
                            onClick={() => viewDiagnosisDetails(diagnosis)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog open={isViewDiagOpen} onOpenChange={(isOpen) => handleDialogViewDiagnosis(isOpen)}>
                            <DialogTrigger asChild>
                              
                            </DialogTrigger>

                            <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Diagnosis Details</DialogTitle>
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
                                onOpenChange={(isOpen) => setIsEditOpen(isOpen)} // Control dialog state
                              >
                                  <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-[#007664] hover:text-[#007664]/80"
                                    
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            <Trash2 className="h-4 w-4" />
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
 <div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold text-[#007664]">Lab Test</h3>
  
  <Dialog open={isAddlabtestOpen} onOpenChange={(isOpen) => handleDialogChangelabtest(isOpen, 'add')}>
    <DialogTrigger asChild>
      <Button className="bg-[#007664] hover:bg-[#007664]/80 w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        New Lab Test
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex justify-center items-center ">
          <DialogTitle className="text-teal-800">Lab Test</DialogTitle>
        </div>
      </DialogHeader>

      <RenderLabTests />
    </DialogContent>
  </Dialog>
</div>

  <div className="border rounded-lg overflow-x-auto">
          <table className="w-full table-auto border-collapse">
      <thead className="bg-[#007664] text-white">
        <tr>
          <th className="px-4 py-2 text-left">Code</th>
          <th className="px-4 py-2 text-left">Value</th>
          <th className="px-4 py-2 text-left">Unit</th>
          <th className="px-4 py-2 text-left">Performed Date</th>
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
            <td className="px-4 py-2">{result.performedDate}</td>
            <td className="px-4 py-2">{result.orderedBy}</td>
            <td>
              <div className="flex space-x-2">
                <Dialog open={isAddlabOpen} onOpenChange={(isOpen) => handleDialoglabChange(isOpen, 'add')}>
        <DialogTrigger asChild>
          
        </DialogTrigger>

        <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <Eye className="h-4 w-4" />
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
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#007664]">Recent Medications</h3>
          <Dialog open={isAddmOpen} onOpenChange={(isOpen) => handleDialogmChange(isOpen, 'add')}>
        <DialogTrigger asChild>
          <Button className="bg-[#007664] hover:bg-[#007664]/80">
          <Plus className="h-4 w-4" />
            Add Medication
            </Button>
        </DialogTrigger>

        <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Medication</DialogTitle>
          </DialogHeader>

          <MedicationForm 
            buttonText="Submit Consultation" 
            onSubmit={() => handleFormSubmit('add')}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
         
        </div>
        <div className="border rounded-lg overflow-x-auto">
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
                  <td className="px-4 py-2">{medication.frequency}</td>
                  <td className="px-4 py-2">{medication.startDate}</td>
                  <td className="px-4 py-2">2024-01-11</td>
                  <td>
                     <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => viewMedtDetails(medication)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog open={isViewMedOpen} onOpenChange={(isOpen) => handleDialogViewMed(isOpen)}>
                              <DialogTrigger asChild>
                                
                              </DialogTrigger>

                              <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Medication Details</DialogTitle>
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
                                onOpenChange={(isOpen) => setIsEditOpen(isOpen)} // Control dialog state
                              >
                                  <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-[#007664] hover:text-[#007664]/80"
                                    
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            <Trash2 className="h-4 w-4" />
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
   </div>  )}
   {activeTab === 'smartconsult' && <SmartConsultation patientData={SelectedPatient}/>}
   </div>
  
  ); 
};

export default PatientDetailsView