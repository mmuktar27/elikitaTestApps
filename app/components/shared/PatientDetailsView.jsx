"use client";

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
  VolumeIcon,
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
import { motion } from 'framer-motion';
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
   const [testSelections, setTestSelections] = useState([
    { id: 1, selectedCategory: '', selectedTests: [], otherTest: '', isOpen: false, isSubsectionOpen: false }
  ]);
 const [labtestFormData, setlabtestFormData]=useState({
  dateOfRequest: '',
  priority: '',
  testsRequested: {},
  diagnosis: '',
  icdCode: '',
  additionalNotes: '',
  specimenType: [],
  collectionDateTime: '',
  collectedBy: '',
  specialInstructions: ''
});
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedTests, setSelectedTests] = useState([]);
const [otherTest, setOtherTest] = useState('');
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
    const showConditions =
    value && value !== "" && field.conditions && field.conditions[value];

return (
  <div className={baseInputStyles}>
    <label className="block mb-2">{field.label}</label>
    <select
      className={baseInputStyles}
      value={value || ""}
      onChange={(e) =>
        handleInputChange(mainSection, subsectionKey, field.name, e.target.value)
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
            <label className="block mb-2">{field.conditions[value].label}</label>
            <select
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={conditionValue || ""}
              onChange={(e) =>
                handleInputChange(
                  mainSection,
                  subsectionKey,
                  `${field.name}_details`,
                  e.target.value
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
            <label className="block mb-2">{field.conditions[value].label}</label>
            <input
              type="text"
              value={conditionValue || ""}
              onChange={(e) =>
                handleInputChange(
                  mainSection,
                  subsectionKey,
                  `${field.name}_details`,
                  e.target.value
                )
              }
              className="mt-1 p-2 border border-gray-300 rounded w-full"
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
    
const renderDiagnosisForm = () => {
  const handleSelectChange = (field, value) => {
    const newData = { ...formDatadiagnosis, [field]: value };
    setFormDatadiagnosis(newData);
    onValueChange?.(newData);
  };

  const handleInputChange = (e) => {
    const newData = { ...formDatadiagnosis, [e.target.name]: e.target.value };
    setFormDatadiagnosis(newData);
    onValueChange?.(newData);
  };

  const handleAISuggest = async (field) => {
    setLoadingStates(prev => ({ ...prev, [field]: true }));
    try {
      // Simulate AI suggestion - replace with actual AI call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example AI suggestions for each field
      const suggestions = {
        severity: 'mild',
        category: 'cardiovascular',
        priority: 'emergency',
        chronicityStatus: 'acute'
      };
      

      setFormDatadiagnosis(prev => ({ ...prev, [field]: suggestions[field] }));
      setAiModes(prev => ({ ...prev, [field]: true }));
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [field]: false }));
    }
  };

  const SelectWithAI = ({ field, label, options, placeholder }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          {!aiModes[field] ? (
             <button
             onClick={() => handleAISuggest(field)}
             disabled={loadingStates[field]}
             variant="outline"
             size="sm"
             className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
           >
             <Lightbulb className="h-4 w-4" />
             {loadingStates[field] ? 'Generating...' : 'AI Suggestions'}
           </button>
           
           
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAiModes(prev => ({ ...prev, [field]: false }));
                  setFormDatadiagnosis(prev => ({ ...prev, [field]: '' }));
                }}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Manual
              </button>
              <button
                onClick={() => handleAISuggest(field)}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <Sparkles className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          )}
        </div>
        
        {aiModes[field] ? (
          <div className="px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
            {formDatadiagnosis[field].split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        ) : (
          <Select
            value={formDatadiagnosis[field]}
            onValueChange={(value) => handleSelectChange(field, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
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
            <div className="space-y-2">
  <SelectWithAI
    field="severity"
    label="Severity Level"
    placeholder="Select severity"
    options={[
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' },
      { value: 'critical', label: 'Critical' }
    ]}
  />
</div>

<div className="space-y-2">
  <SelectWithAI
    field="category"
    label="Diagnosis Category"
    placeholder="Select category"
    options={[
      { value: 'cardiovascular', label: 'Cardiovascular' },
      { value: 'respiratory', label: 'Respiratory' },
      { value: 'neurological', label: 'Neurological' },
      { value: 'gastrointestinal', label: 'Gastrointestinal' },
      { value: 'musculoskeletal', label: 'Musculoskeletal' },
      { value: 'endocrine', label: 'Endocrine' },
      { value: 'psychiatric', label: 'Psychiatric' },
      { value: 'other', label: 'Other' }
    ]}
  />
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
<div className="grid grid-cols-2 gap-4">
  <SelectWithAI
    field="priority"
    label="Priority Level"
    placeholder="Select priority"
    options={[
      { value: 'emergency', label: 'Emergency' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'semi-urgent', label: 'Semi-Urgent' },
      { value: 'non-urgent', label: 'Non-Urgent' }
    ]}
  />

  <SelectWithAI
    field="chronicityStatus"
    label="Chronicity Status"
    placeholder="Select status"
    options={[
      { value: 'acute', label: 'Acute' },
      { value: 'subacute', label: 'Subacute' },
      { value: 'chronic', label: 'Chronic' },
      { value: 'recurrent', label: 'Recurrent' }
    ]}
  />
</div>

            <div>
          <label className="block text-sm font-medium text-[#007664] mb-2">
            Primary Diagnosis
          </label>
          <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
          <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
          <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#53FDFD] focus:border-[#007664] bg-white"
            rows={3}
           
            onChange={(e) => handleInputChange("diagnosis", "differential", "diagnosis", e.target.value)}
          />
        </div>

     

        {/* Diagnosis Status (FHIR: Condition.status) */}
        <div className="space-y-2">
  <SelectWithAI
    field="status"
    label="Diagnosis Status"
    placeholder="Select status"
    options={[
      { value: 'active', label: 'Active' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'remission', label: 'Remission' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'unknown', label: 'Unknown' }
    ]}
    onChange={(value) => handleInputChange("diagnosis", "status", "status", value)}
  />
</div>

<div className="space-y-2">
  <SelectWithAI
    field="verificationStatus"
    label="Verification Status"
    placeholder="Select verification status"
    options={[
      { value: 'unconfirmed', label: 'Unconfirmed' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'differential', label: 'Differential' },
      { value: 'refuted', label: 'Refuted' },
      { value: 'entered-in-error', label: 'Entered in Error' }
    ]}
    onChange={(value) => handleInputChange("diagnosis", "verificationStatus", "verificationStatus", value)}
  />
</div>


            {/* Rest of the form remains the same */}
            <div className="space-y-2">
              <Label htmlFor="symptoms">Key Symptoms and Clinical Markers</Label>
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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

const [aiModes, setAiModes] = useState({
  expectedOutcome: false,
  timeframe: false,
  riskLevel: false,
  recoveryPotential: false
});

const [loadingStates, setLoadingStates] = useState({
  expectedOutcome: false,
  timeframe: false,
  riskLevel: false,
  recoveryPotential: false
});
const renderPrognosisForm = () => {
 
  const handleSelectChange = (field, value) => {
    const newData = { ...formDataprog, [field]: value };
    setFormDataprog(newData);
    onValueChange?.(newData);
  };

  const handleInputChange = (e) => {
    const newData = { ...formDataprog, [e.target.name]: e.target.value };
    setFormDataprog(newData);
    onValueChange?.(newData);
  };

  const handleAISuggest = async (field) => {
    setLoadingStates(prev => ({ ...prev, [field]: true }));
    try {
      // Simulate AI suggestion - replace with actual AI call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example AI suggestions for each field
      const suggestions = {
        expectedOutcome: 'complete_recovery',
        timeframe: 'weeks',
        riskLevel: 'low',
        recoveryPotential: 'excellent'
      };

      setFormDataprog(prev => ({ ...prev, [field]: suggestions[field] }));
      setAiModes(prev => ({ ...prev, [field]: true }));
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [field]: false }));
    }
  };

  const SelectWithAI = ({ field, label, options, placeholder }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          {!aiModes[field] ? (
             <button
             onClick={() => handleAISuggest(field)}
             disabled={loadingStates[field]}
             variant="outline"
             size="sm"
             className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
           >
             <Lightbulb className="h-4 w-4" />
             {loadingStates[field] ? 'Generating...' : 'AI Suggestions'}
           </button>
           
           
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAiModes(prev => ({ ...prev, [field]: false }));
                  setFormDataprog(prev => ({ ...prev, [field]: '' }));
                }}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Manual
              </button>
              <button
                onClick={() => handleAISuggest(field)}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <Sparkles className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          )}
        </div>
        
        {aiModes[field] ? (
          <div className="px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
            {formDataprog[field].split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        ) : (
          <Select
            value={formDataprog[field]}
            onValueChange={(value) => handleSelectChange(field, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
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
          <SelectWithAI
            field="expectedOutcome"
            label="Expected Outcome"
            placeholder="Select expected outcome"
            options={[
              { value: 'complete_recovery', label: 'Complete Recovery' },
              { value: 'partial_recovery', label: 'Partial Recovery' },
              { value: 'chronic_management', label: 'Chronic Management Required' },
              { value: 'progressive_decline', label: 'Progressive Decline' },
              { value: 'terminal', label: 'Terminal' },
              { value: 'other', label: 'Other' }
            ]}
          />
          {formDataprog.expectedOutcome === 'other' && !aiModes.expectedOutcome && (
            <Input
              name="otherOutcome"
              value={formData.otherOutcome}
              onChange={handleInputChange}
              placeholder="Please specify outcome"
              className="mt-2"
            />
          )}
        </div>

        <SelectWithAI
          field="timeframe"
          label="Timeframe"
          placeholder="Select timeframe"
          options={[
            { value: 'days', label: 'Days' },
            { value: 'weeks', label: 'Weeks' },
            { value: 'months', label: 'Months' },
            { value: 'years', label: 'Years' },
            { value: 'lifetime', label: 'Lifetime' }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectWithAI
          field="riskLevel"
          label="Risk Level"
          placeholder="Select risk level"
          options={[
            { value: 'low', label: 'Low' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'high', label: 'High' },
            { value: 'severe', label: 'Severe' }
          ]}
        />

        <SelectWithAI
          field="recoveryPotential"
          label="Recovery Potential"
          placeholder="Select recovery potential"
          options={[
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'uncertain', label: 'Uncertain' }
          ]}
        />
      </div>
  
            <div className="space-y-2">
              <Label>5-Year Survival Rate (%)</Label>
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
              <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
      
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
         
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
        
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
           
        AI Suggestions
        </Button>
        </div>
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
     
      renderDiagnosisForm,
      renderPrognosisForm,
  
  
      
    ];
  
    return (
      <>
  
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

      {currentPage === 2 ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Submit logic here
            }}
            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            Submit
          </button>
          <button
                    onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}

            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-200"
          >
            Proceed with Prognosis
          </button>
        </div>
      ) : currentPage === 3 ? (
        <button
          onClick={() => {
            // Submit logic here
          }}
          className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-200"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
          className="flex items-center px-6 py-3 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors duration-200"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
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
    const showConditions =
    selectedValue && selectedValue !== "" && field.conditions && field.conditions[selectedValue];

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setSelectedValue(selected); // Update the selected value state
    handleInputChange(mainSection, subsectionKey, field.name, selected); // Trigger input change
  };

  return (
    <div className={baseInputStyles}>
      <label className="block mb-2">{field.label}</label>
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
              <label className="block mb-2">{field.conditions[selectedValue].label}</label>
              <select
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                value={conditionValue || ""}
                onChange={(e) => {
                  setConditionValue(e.target.value); // Update the conditionValue
                  handleInputChange(
                    mainSection,
                    subsectionKey,
                    `${field.name}_details`,
                    e.target.value
                  );
                }}
              >
                <option value="">Select...</option>
                {field.conditions[selectedValue].options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : field.conditions[selectedValue].type === "text" ? (
            <div>
              <label className="block mb-2">{field.conditions[selectedValue].label}</label>
              <input
                type="text"
                value={conditionValue || ""}
                onChange={(e) => {
                  setConditionValue(e.target.value); // Update the conditionValue
                  handleInputChange(
                    mainSection,
                    subsectionKey,
                    `${field.name}_details`,
                    e.target.value
                  );
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
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
  const isAbnormal = result.flags && result.flags.length > 0;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-[#F7F7F7]">
      <DialogHeader className="bg-[#007664] text-white p-6 rounded-t-lg">
        <DialogTitle className="text-2xl font-bold">Lab Result Details</DialogTitle>
      </DialogHeader>

      <div className="p-6 space-y-8">
        {/* Basic Test Information */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Basic Test Information</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <InfoItem label="Test Name" value={result.testName} />
              <InfoItem label="Description" value={result.description} />
              <InfoItem label="LOINC Code" value={result.code} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Result Value and Reference Ranges */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#B24531] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Result and Reference Range</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Result Value</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{result.value} {result.unit}</span>
                    {isAbnormal && <AlertTriangle className="text-[#B24531] h-5 w-5" />}
                  </div>
                </div>
                <InfoItem label="Reference Range" value={result.referenceRange} />
              </div>
              {isAbnormal && (
                <div className="bg-red-50 border-l-4 border-[#B24531] p-4 rounded">
                  <h4 className="text-sm font-medium text-[#B24531] mb-1">Interpretive Comments</h4>
                  <p className="text-sm text-gray-700">{result.flags}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Collection Details */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#53FDFD] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Collection Details</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <InfoItem label="Collection Method" value={result.collectionMethod} />
              <InfoItem label="Specimen Type" value={result.specimenType} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Timing and Ordering */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Timing and Ordering</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <InfoItem label="Performed Date" value={result.performedDate} />
              <InfoItem label="Ordered By" value={result.orderedBy} />
              <InfoItem label="Performing Lab" value={result.performingLab} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Information */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#B24531] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Patient Information</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <InfoItem label="Name" value={result.patientName} />
              <InfoItem label="DOB" value={result.patientDOB} />
              <InfoItem label="MRN" value={result.patientMRN} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Information */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#53FDFD] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Additional Information</h2>
          </div>
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 gap-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Status" value={result.status} />
              </div>
              {result.comments && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Comments</h4>
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
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const ConsultationDetailsModal = ({ consult, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-[#F7F7F7]">
      <DialogHeader className="bg-[#007664] text-white p-6 rounded-t-lg">
        <DialogTitle className="text-2xl font-bold">Consultation Details</DialogTitle>
      </DialogHeader>

      <div className="p-6 space-y-8">
        {/* Basic Information */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Basic Information</h2>
          </div>
          
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <InfoItem label="Status" value={consult.status} />
              <InfoItem label="Category" value={consult.category.join(', ')} />
              <InfoItem label="Service Type" value={consult.serviceType.join(', ')} />
              <InfoItem label="Patient" value={consult.subject.display} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Participant Details */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#B24531] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Participant Details</h2>
          </div>
          
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="divide-y divide-gray-100">
              {consult.participant.map((participant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <InfoItem label="Type" value={participant.type.join(', ')} />
                  <InfoItem label="Name" value={participant.individual.display} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Timing Information */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#53FDFD] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Timing Information</h2>
          </div>
          
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <InfoItem label="Occurrence Date/Time" value={consult.occurrenceDateTime} />
              <InfoItem label="Created" value={consult.created} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Details */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
            <h2 className="text-xl font-bold text-[#007664]">Additional Information</h2>
          </div>
          
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Reason Code" value={consult.reasonCode.join(', ')} />
                <InfoItem label="Diagnosis" value={consult.diagnosis.join(', ')} />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Summary</h4>
                <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">
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
  const getStatusColor = (status) => {
    const statusColors = {
      active: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      default: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return statusColors[status?.toLowerCase()] || statusColors.default;
  };
  const InfoItem = ({ label, value, icon, highlight }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      </div>
      <p className={`${
        highlight 
          ? "text-lg font-semibold text-[#007664]" 
          : "text-sm text-gray-900"
      }`}>
        {value}
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-[#F7F7F7]">
        <DialogHeader className="bg-[#007664] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Stethoscope className="h-6 w-6" />
            Diagnosis & Prognosis Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Status Banner */}
          <motion.div {...fadeIn} 
            className={`rounded-lg p-4 border ${getStatusColor(diagnosis.status)} flex items-center gap-2`}
          >
            <Activity className="h-5 w-5" />
            <span className="font-medium">Current Status: {diagnosis.status}</span>
          </motion.div>

          {/* Basic Information */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664]">Basic Information</h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Category" value={diagnosis.category.join(', ')} />
                <InfoItem label="Service Type" value={diagnosis.serviceType.join(', ')} />
                <InfoItem label="Patient" value={diagnosis.patient.display} highlight />
              </CardContent>
            </Card>
          </motion.div>

          {/* Participant Details */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#B24531] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664] flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participant Details
              </h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6 space-y-4">
                {diagnosis.participant.map((participant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b last:border-0">
                    <InfoItem label="Type" value={participant.type.join(', ')} />
                    <InfoItem label="Name" value={participant.individual.display} highlight />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Timing Information */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#53FDFD] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664] flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timing Information
              </h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem 
                  label="Occurrence Date/Time" 
                  value={diagnosis.occurrenceDateTime} 
                  icon={<Clock className="h-4 w-4 text-[#007664]" />}
                />
                <InfoItem 
                  label="Created" 
                  value={diagnosis.created} 
                  icon={<Clock className="h-4 w-4 text-[#007664]" />}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Details */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Reason Code" value={diagnosis.reasonCode.join(', ')} />
                  <InfoItem label="Progress" value={diagnosis.progress.join(', ')} />
                  <InfoItem label="Presented Problem" value={diagnosis.presentedProblem} highlight />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Summary</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{diagnosis.summary}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};




const MedicationForm = ({ buttonText, onSubmit, medicationData}) => {
  const [aiModes, setAiModes] = useState({
    expectedOutcome: false,   // Captures AI mode for expected outcome
    timeframe: false,         // Captures AI mode for timeframe
    riskLevel: false,         // Captures AI mode for risk level
    recoveryPotential: false, // Captures AI mode for recovery potential
  });
  const [formDatamedication, setFormDatamedication] = useState({
    medicationName: '',
    dosage: '',
    administrationRoute: '',
    medicationFrequency: '',
    medicationStatus: '',
    startDate: '',
    endDate: '',
    treatmentDuration: '',
    sideEffects: '',
    contraindications: '',
    precautions: '',
    interactions: '',
    specialInstructions: '',
    expectedOutcome: '',
    followUpProtocol: '',
    evidenceBase: ''
  });
  const [loadingStates, setLoadingStates] = useState({
    expectedOutcome: false,
    timeframe: false,
    riskLevel: false,
    recoveryPotential: false
  });
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
  
  const SelectWithAI = ({ field, label, options, placeholder }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          {!aiModes[field] ? (
             <button
             onClick={() => handleAISuggest(field)}
             disabled={loadingStates[field]}
             variant="outline"
             size="sm"
             className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
           >
             <Lightbulb className="h-4 w-4" />
             {loadingStates[field] ? 'Generating...' : 'AI Suggestions'}
           </button>
           
           
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAiModes(prev => ({ ...prev, [field]: false }));
                  setFormDatamedication(prev => ({ ...prev, [field]: '' }));
                }}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Manual
              </button>
              <button
                onClick={() => handleAISuggest(field)}
                className="mt-4 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                <Sparkles className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          )}
        </div>
        
        {aiModes[field] ? (
          <div className="px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
            {formDatamedication[field].split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
        ) : (
          <Select
            value={formDatamedication[field]}
            onValueChange={(value) => handleSelectChange(field, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
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
  <Label htmlFor="medicationFrequencyType">Frequency Type</Label>
  <SelectWithAI
    field="medicationFrequencyType"
    value={newMedication.medicationFrequency.type}
    onChange={(value) => setNewMedication({ ...newMedication, medicationFrequency: { ...newMedication.medicationFrequency, type: value } })}
    label="Select Frequency Type"
    placeholder="Select Frequency Type"
    options={[
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'custom', label: 'Custom' }
    ]}
  />
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
      }}
      placeholder="Enter frequency value"
    />
  </div>
)}
    <div className="space-y-2">
        <label>Administration Route</label>
        <Input
          type="text"
          value={formDatamedication.administrationRoute}
          onChange={(e) => handleFieldChange('administrationRoute', e.target.value)}
          placeholder="Enter Administration Route (e.g., Oral, IV)"
        />
      </div>
      <div className="space-y-2">
        <label>Treatment Duration</label>
        <Input
          type="text"
          value={formDatamedication.treatmentDuration}
          onChange={(e) => handleFieldChange('treatmentDuration', e.target.value)}
          placeholder="(e.g., 2 weeks)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationNote">Medication Note</Label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
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
        <Label htmlFor="medicationDosage">Dosage</Label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          id="medicationDosage"
          placeholder="Medication Dosage"
          value={newMedication.dosage}
          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value.split(', ') })}
          rows={4}
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
   
        />
      </div>
     
    
       <div className="space-y-2">
        <Label htmlFor="medicationDescription">Medication</Label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          id="medicationDescription"
          placeholder="Medication Description"
          value={newMedication.medicationDescription}
          onChange={(e) => setNewMedication({ ...newMedication, medicationDescription: e.target.value })}
          rows={4} 
           className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
       
       />
      </div>
  
      <div>
        <label>Side Effects</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.sideEffects}
          onChange={(e) => handleFieldChange('sideEffects', e.target.value)}
          placeholder="Enter potential side effects"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
      </div>

      {/* Contraindications */}
      <div>
        <label>Contraindications</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.contraindications}
          onChange={(e) => handleFieldChange('contraindications', e.target.value)}
          placeholder="Enter contraindications"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
      </div>

      {/* Precautions */}
      <div>
        <label>Precautions</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.precautions}
          onChange={(e) => handleFieldChange('precautions', e.target.value)}
          placeholder="Enter any precautions"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
      </div>

      {/* Drug Interactions */}
      <div>
        <label>Drug Interactions</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.interactions}
          onChange={(e) => handleFieldChange('interactions', e.target.value)}
          placeholder="Enter possible drug interactions"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <label>Special Instructions</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.specialInstructions}
          onChange={(e) => handleFieldChange('specialInstructions', e.target.value)}
          placeholder="Enter any special instructions"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
        
        <div className="space-y-2"> 
        <label>Follow-Up Protocol</label>
        <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
        <textarea
          value={formDatamedication.followUpProtocol}
          onChange={(e) => handleFieldChange('followUpProtocol', e.target.value)}
          placeholder="Enter follow-up protocol"
          rows={4} 
          className="resize-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      
        />
      </div>
      </div>

     

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
  const isActive = medic.medicationStatus?.toLowerCase() === 'active';
  const InfoItem = ({ label, value, icon, highlight }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      </div>
      <p className={`${
        highlight 
          ? "text-lg font-semibold text-[#007664]" 
          : "text-sm text-gray-900"
      }`}>
        {value}
      </p>
    </div>
  );
   
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-[#F7F7F7]">
        <DialogHeader className="bg-[#007664] text-white p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Pill className="h-6 w-6" />
            Medication Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Status Banner */}
          <motion.div {...fadeIn} className={`rounded-lg p-4 flex items-center gap-3 ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
          }`}>
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              Status: {medic.medicationStatus}
            </span>
          </motion.div>

          {/* Basic Information */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#75C05B] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664]">Basic Information</h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem 
                    label="Medication Name" 
                    value={medic.name}
                    highlight
                  />
                  <InfoItem 
                    label="Dosage" 
                    value={medic.dosage}
                    highlight
                  />
                  <InfoItem 
                    label="Frequency" 
                    value={medic.frequency}
                    icon={<Clock className="h-4 w-4 text-[#007664]" />}
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
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#53FDFD] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664]">Timing Details</h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoItem 
                    label="Start Date" 
                    value={medic.startDate}
                    icon={<Calendar className="h-4 w-4 text-[#007664]" />}
                  />
                  <InfoItem 
                    label="End Date" 
                    value={medic.endDate}
                    icon={<Calendar className="h-4 w-4 text-[#007664]" />}
                  />
                  <InfoItem 
                    label="Start Time" 
                    value={medic.medicationStartTime}
                    icon={<Clock className="h-4 w-4 text-[#007664]" />}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Frequency Details */}
          <motion.div {...fadeIn} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-2 bg-[#B24531] rounded-full" />
              <h2 className="text-xl font-bold text-[#007664]">Frequency Details</h2>
            </div>
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    category: 'General Health Screening',
    tests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel', 'Urinalysis']
  },
  {
    category: 'Diabetes and Endocrine Function',
    tests: ['Fasting Blood Glucose', 'Hemoglobin A1c (HbA1c)', 'Thyroid Function Tests (TSH, T3, T4)']
  },
  {
    category: 'Cardiovascular Health',
    tests: ['Electrocardiogram (ECG)', 'Troponin Test']
  },
  {
    category: 'Advanced Diagnostics',
    tests: ['Chest X-ray', 'MRI Scan', 'CT Scan', 'Ultrasound']
  },
  {
    category: 'Infectious Diseases',
    tests: ['Rapid Strep Test', 'Influenza Test', 'HIV Test', 'Hepatitis Panel', 'Tuberculosis (TB) Test']
  },
  {
    category: 'Kidney Function',
    tests: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)']
  },
  {
    category: 'Liver Function',
    tests: ['Liver Function Tests (LFTs)']
  },
  {
    category: 'Reproductive Health',
    tests: ['Sexually Transmitted Infection (STI) Tests', 'Pap Smear', 'Pregnancy Test']
  },
  {
    category: 'Respiratory Health',
    tests: ['Chest X-ray', 'Sputum Culture']
  },
  {
    category: 'Gastrointestinal Health',
    tests: ['Stool Culture', 'Helicobacter pylori Test']
  },
  {
    category: 'Nutritional Status',
    tests: ['Iron Studies', 'Vitamin B12 and Folate Levels']
  },
  {
    category: 'Inflammatory and Autoimmune Conditions',
    tests: ['Erythrocyte Sedimentation Rate (ESR)', 'Reactive Protein (CRP)']
  }
];

const specimenOptions = ['Blood', 'Urine', 'Stool', 'Saliva'];

const handleCheckboxChange = (category, test) => {
  setlabtestFormData((prevData) => {
    const updatedTests = { ...prevData.testsRequested };
    if (!updatedTests[category]) {
      updatedTests[category] = [];
    }
    if (updatedTests[category].includes(test)) {
      updatedTests[category] = updatedTests[category].filter((t) => t !== test);
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
  console.log('Form Data Submitted:', labtestFormData);
  // Here you can handle the form submission (e.g., send to an API)
};

const handleCategorySelect = (id, category) => {
  setTestSelections(prev => prev.map(selection => 
    selection.id === id 
      ? { ...selection, selectedCategory: category, isSubsectionOpen: true, isOpen: false }
      : selection
  ));
};

const handleTestSelect = (id, test) => {
  setTestSelections(prev => prev.map(selection => 
    selection.id === id
      ? {
          ...selection,
          selectedTests: selection.selectedTests.includes(test)
            ? selection.selectedTests.filter(t => t !== test)
            : [...selection.selectedTests, test]
        }
      : selection
  ));
};

const handleOtherTestChange = (id, value) => {
  setTestSelections(prev => prev.map(selection => 
    selection.id === id
      ? { ...selection, otherTest: value }
      : selection
  ));
};

const toggleDropdown = (id) => {
  setTestSelections(prev => prev.map(selection => 
    selection.id === id
      ? { ...selection, isOpen: !selection.isOpen }
      : selection
  ));
};

const addNewTestSelection = () => {
  const newId = Math.max(...testSelections.map(s => s.id)) + 1;
  setTestSelections(prev => [...prev, {
    id: newId,
    selectedCategory: '',
    selectedTests: [],
    otherTest: '',
    isOpen: false,
    isSubsectionOpen: false
  }]);
};

const hasSelectedTests = testSelections.some(selection => 
  selection.selectedCategory && (selection.selectedTests.length > 0 || selection.otherTest)
);


const RenderLabTests = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratory Test Request</h1>
      <p className="text-gray-600">Select the required diagnostic tests for the patient</p>
    </div>

    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
      {/* Lab Test Information Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b">Lab Test Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <div className="flex space-x-4">
                {['Routine', 'Urgent', 'STAT'].map((priority) => (
                  <label key={priority} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      onChange={handleChange}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{priority}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Selection Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Test(s) Requested</h3>
          <div className="w-full space-y-4">
          {testSelections.map((selection) => (
        <div key={selection.id} className="border rounded-lg p-4">
          <div className="relative">
            {/* Main Category Dropdown */}
            <div 
              className="p-3 border rounded-lg bg-white cursor-pointer flex justify-between items-center"
              onClick={() => toggleDropdown(selection.id)}
            >
              <span>{selection.selectedCategory || 'Select Category'}</span>
              {selection.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>

            {/* Category Options */}
            {selection.isOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                {testCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(selection.id, cat.category)}
                  >
                    {cat.category}
                  </div>
                ))}
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategorySelect(selection.id, 'Other')}
                >
                  Other
                </div>
              </div>
            )}
          </div>

          {/* Subsection Tests */}
          {selection.selectedCategory && selection.selectedCategory !== 'Other' && selection.isSubsectionOpen && (
            <div className="mt-4 border rounded-lg p-4">
              <h3 className="font-medium mb-3">Select Tests:</h3>
              {testCategories
                .find(cat => cat.category === selection.selectedCategory)
                ?.tests.map(test => (
                  <div key={test} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`${selection.id}-${test}`}
                      checked={selection.selectedTests.includes(test)}
                      onChange={() => handleTestSelect(selection.id, test)}
                      className="mr-2"
                    />
                    <label htmlFor={`${selection.id}-${test}`}>{test}</label>
                  </div>
                ))}
            </div>
          )}

          {/* Other Input */}
          {selection.selectedCategory === 'Other' && (
            <div className="mt-4">
              <input
                type="text"
                value={selection.otherTest}
                onChange={(e) => handleOtherTestChange(selection.id, e.target.value)}
                placeholder="Please specify the test"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}

          {/* Selected Tests Display */}
       
        </div>
      ))}

      {/* Add Test Button */}
      {hasSelectedTests && (
        <button
          onClick={addNewTestSelection}
          className="flex items-center justify-center w-full p-3 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Test
        </button>
      )}
    
   </div>    </div>

        {/* Clinical Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinical Diagnosis / Reason for Test</label>
            <input
              type="text"
              name="diagnosis"
              value={labtestFormData.diagnosis}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ICD-10 Code (if applicable)</label>
            <input
              type="text"
              name="icdCode"
              value={labtestFormData.icdCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b">Specimen Collection Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specimen Type</label>
              <div className="grid grid-cols-2 gap-4">
                {specimenOptions.map((specimen) => (
                  <label key={specimen} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="specimenType"
                      value={specimen}
                      onChange={handleChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{specimen}</span>
                  </label>
                ))}
                <div className="col-span-2">
                  <input
                    type="text"
                    name="otherSpecimen"
                    onChange={handleChange}
                    placeholder="Other (please specify)"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Collection Date & Time</label>
                <input
                  type="datetime-local"
                  name="collectionDateTime"
                  value={labtestFormData.collectionDateTime}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Collected By</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Special Instructions for Lab</label>
                <div>
                <Button
      
      variant="outline"
      size="sm"
      className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
    >
      <Mic className="h-4 w-4 mr-2" />
      Voice Input
    </Button>
    <Button
         
         variant="outline"
         size="sm"
         className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
       >
         <VolumeIcon className="h-4 w-4 mr-2" />
         Read Aloud
       </Button>
       <Button
        
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
         
      AI Suggestions
      </Button>


                </div>
              <textarea
                name="specialInstructions"
                value={labtestFormData.specialInstructions}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Submit Request
        </button>
      </div>
    </form>
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
               
              </div>
              
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
  <DialogTitle className="text-teal-800">
  <div className="text-center mb-0">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">New Consultation</h2>
    </div>
  </DialogTitle>
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
            <DialogTitle>
            <div className="text-center mb-0">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">New Diagnosis & Prognosis</h2>
    </div>
            </DialogTitle>
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

        <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
            <div className="text-center mb-0">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">New Medication</h2>
    </div>
            </DialogTitle>
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