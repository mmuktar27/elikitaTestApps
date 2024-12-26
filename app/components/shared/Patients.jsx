

import React, { useState, useEffect } from 'react';

// Lucide Icons
import { 
  Heart, Camera, LightbulbOff, Brain, Sparkles, Lightbulb, Activity, 
  MinusCircle, PlusCircle, Plus, Clock, Video, UserRound, Share2, 
  ArrowRight, ChevronLeft, ChevronRight, Volume2, VolumeX, AlertTriangle, 
  ArrowLeft, Beaker, Bed, Bell, Briefcase, Building, Building2, Calculator, 
  Calendar, CalendarCheck, CameraOff, Check, CheckCircle, ChevronDown, 
  Clipboard, ClockIcon, Database, Edit, Edit2, Eye, FileBarChart, FileText, 
  Filter, Home, Info, Layers, LogOut, Mail, MapPin, Mic, MicOff, Phone, 
  Pill, QrCode, Search, Settings, Speaker, Stethoscope, TestTube, Thermometer, 
  Trash2, User, UserCog, UserPlus, Users, Zap, Send, Copy, Check as CheckIcon, Globe, Printer 
} from 'lucide-react';
import {
  PatientDetailsView
  } from "../../components/shared";
// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Avatar, AvatarFallback, AvatarImage 
} from '@/components/ui/avatar';
import { 
  Collapsible, CollapsibleContent, CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Alert, AlertDescription, AlertTitle 
} from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';



const Patients = ({setSelectedUser = () => {}}) => {
  const [isDetailsViewOpen , setIsDetailsViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener('resize', checkScreenWidth); // Listen for resize
    return () => window.removeEventListener('resize', checkScreenWidth); // Cleanup
  }, []);

  const [patients, setPatients] = useState([
  {
     id: 1, 
      identifier: "PT001",
      name: "Alice Brown",
      birthDate: "1988-05-15",
      gender: "female",
      address: "123 Main St",
      phone: "(555) 123-4567",
      email: "alice@email.com",
      condition: "Hypertension",
      status: "active",
      progress: "Stable",
      language: "English",
      maritalStatus: "Married",
      emergencyContact: "John Brown",
      insuranceProvider: "HealthCare Plus",
    vitals: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 98.6
    },
    consultations: [
      {
        id: "1",
        date: "2024-01-01",
        doctor: "Dr. Smith",
        reason: "Regular checkup",
        status: "completed"
      }
    ],
    diagnoses: [
      {
        id: "1",
        date: "2024-01-01",
        condition: "Hypertension",
        status: "Stable",
        doctor: "Dr. Smith"
      }
    ],
    medications: [
      {
        id: "1",
        name: "Amlodipine",
        dosage: "5 mg",
        frequency: "once daily",
        startDate: "2024-01-01",
        endDate: "2024-01-11"
      }
    ],
     labResults: [
       {
    id: 1,
    testName: 'Glucose',
    description: 'Measures the glucose level in the blood',
    code: '15074-8',
    value: 120,
    unit: 'mg/dL',
    referenceRange: '70-99 mg/dL',
    flags: 'High',
    collectionMethod: 'Venipuncture',
    specimenType: 'Blood',
    performedDate: '2023-04-15',
    orderedBy: 'Dr. Jane Smith',
    performingLab: 'deichi clinic gembu',
    patientName: 'John Doe',
    patientDOB: '1990-05-12',
    patientMRN: '123456',
    status: 'Completed',
    comments: 'Patient is advised to monitor blood glucose levels closely.'
  },
  {
    id: 2,
    testName: 'Cholesterol',
    description: 'Evaluates total cholesterol levels in the blood',
    code: '2345-7',
    value: 4.2,
    unit: 'mmol/L',
    referenceRange: 'Less than 5.0 mmol/L',
    flags: 'Normal',
    collectionMethod: 'Venipuncture',
    specimenType: 'Blood',
    performedDate: '2023-03-30',
    orderedBy: 'Dr. John Doe',
    performingLab: 'Deichi clinic gembu',
    patientName: 'Jane Doe',
    patientDOB: '1985-09-23',
    patientMRN: '654321',
    status: 'Completed',
    comments: 'Levels are within the normal range.'
  }
    ],
    consultations: [
      {
        id: "2",                        // Unique consultation identifier
        status: "completed",            // Status of the consultation
        category: ["General Checkup"],  // Categories of the consultation
        serviceType: ["In-Person"],     // Types of service offered
        subject: {
          display: "Alice Brown",          // Patient's name
        },
        participant: [                  // Details of participants
          {
            type: ["Doctor"],           // Role of the participant
            individual: {
              display: "Dr. Smith",     // Participant's name
            },
          },
          {
            type: ["Nurse"],            // Another role
            individual: {
              display: "Nurse Alice",   // Name of the participant
            },
          },
        ],
        occurrenceDateTime: "2024-01-01T10:00:00Z", // Date and time of the consultation
        created: "2023-12-31T14:00:00Z",           // Timestamp when the consultation was created
        reasonCode: ["Routine Checkup"],           // Reason for the consultation
        diagnosis: ["Healthy"],                    // Diagnosis outcome
        summary: "Patient is in good health.",     // Summary of the consultation
      },
    ],
    diagnoses: [
      {
        id: "23",
        status: "active",
        category: ["Chronic", "Endocrine"],
        serviceType: ["Outpatient", "Consultation"],
        patient: { "reference": "patient123", "display": "John Doe" },
        participant: [
          {
            type: ["Primary Care Physician"],
            individual: { "reference": "doctor456", "display": "Dr. Jane Doe" }
          }
        ],
        occurrenceDateTime: "2024-11-30T08:30:00",
        created: "2024-11-01T10:00:00",
        description: "Management of chronic condition, routine check-up",
        reasonCode: ["Routine Check-up", "Chronic Condition Monitoring"],
        doctor: "Dr. John Smith",
        condition: "Diabetes",
        appointment: { "reference": "appointment789" },
        period: { "start": "2024-02-01", "end": "2024-12-31" },
        location: { "location": { "reference": "clinic123", "display": "HealthCare Clinic" } },
        hospitalization: { "admitSource": "Emergency", "dischargeDisposition": "Home" },
        totalCost: { "value": 1200, "currency": "USD" },
        presentedProblem: ["Blood Sugar Monitoring", "Weight Management"],
        progress: ["Patient shows improvement in blood sugar levels", "Requires ongoing monitoring"],
        summary: "Patient's condition is stable and under control with periodic check-ups scheduled."
      }
    ],
    medications: [
      {
        id: "2",
        name: "Metformin",
        dosage: "500 mg",
        frequency: "twice daily",
        startDate: "2023-05-01",
        endDate: "2023-11-01",
        medicationNote: "",  // Add any medication-specific notes if needed
        medicationCode: [],  // Add any relevant medication codes
        medicationStatus: "active",  // Can be 'active', 'inactive', 'resolved'
        medicationStartDate: "2023-05-01",  // Start date of the medication
        medicationEndDate: "2023-11-01",  // End date of the medication
        medicationStartTime: "",  // Add start time for the medication if relevant
        medicationDescription: "",  // Description of the medication or its effects
        medicationFrequency: {
          type: "daily",  // Frequency type: daily, weekly, etc.
          value: 2  // Frequency value (e.g., 2 times per day)
        },
      },
    ],
    referrals: [
      {
        id: "12345",
        requester: { display: "Dr. John Smith" },
        authoredOn: "2023-04-15",
        status: "Open",
        details: "Referred for routine check-up and medication management",
      
      },
    ],
  }
]);
const [activepage, setIsactivepage] = useState('patient');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const emptyPatient = {
    identifier: "",
    name: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    condition: "",
    status: "active",
    progress: "",
    language: "",
    maritalStatus: "",
    emergencyContact: "",
    insuranceProvider: ""
  };

  const [newPatient, setNewPatient] = useState(emptyPatient);

  const resetDialogStates = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsLoading(false);
    setNewPatient(emptyPatient);
  };

 const viewDetails = (patient) => {
  setSelectedPatient(patient);
  console.log(selectedPatient)
  setIsactivepage('patientdetails');
  
};
 const CloseviewDetails = () => {
  setIsactivepage('patient');
 
};
  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetDialogStates();
  };
  const handleSubmit = async (type) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (type === 'add') {
        setPatients([...patients, { 
          id: patients.length + 1,
          ...newPatient 
        }]);
      } else if (type === 'edit') {
        setPatients(patients.map(p => p.id === selectedPatient.id ? newPatient : p));
        setSelectedPatient(null);
      }
      
      setShowSuccess(true);
      setIsLoading(false);
    }, 1000);
  };

  const startDelete = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteOpen(true);
  };


  const confirmDelete = () => {
    setPatients(patients.filter(p => p.id !== patientToDelete.id));
    setIsDeleteOpen(false);
    setPatientToDelete(null);
  };

  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setNewPatient(patient);
    setIsEditOpen(true);
  };

  
  const handleDialogChange = (isOpen, type) => {
    if (type === 'add') {
      setIsAddOpen(isOpen);
    } else if (type === 'edit') {
      setIsEditOpen(isOpen);
    }
    
    if (!isOpen) {
      setNewPatient(emptyPatient);
      setIsLoading(false);
    }
  };

  const PatientForm = ({ buttonText, onSubmit }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Patient ID</Label>
        <Input disabled="disabled"
          id="identifier"
          placeholder="Patient ID"
          value="PT097"
          onChange={(e) => setNewPatient({ ...newPatient, identifier: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Full Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={newPatient.birthDate}
          onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={newPatient.gender}
          onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Address"
          value={newPatient.address}
          onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="condition">Medical Condition</Label>
        <Input
          id="condition"
          placeholder="Medical Condition"
          value={newPatient.condition}
          onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="progress">Progress</Label>
        <Select
          value={newPatient.progress}
          onValueChange={(value) => setNewPatient({ ...newPatient, progress: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select progress" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Improving">Improving</SelectItem>
            <SelectItem value="Stable">Stable</SelectItem>
            <SelectItem value="Declining">Declining</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Preferred Language</Label>
        <Input
          id="language"
          placeholder="Preferred Language"
          value={newPatient.language}
          onChange={(e) => setNewPatient({ ...newPatient, language: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maritalStatus">Marital Status</Label>
        <Select
          value={newPatient.maritalStatus}
          onValueChange={(value) => setNewPatient({ ...newPatient, maritalStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
            <SelectItem value="Divorced">Divorced</SelectItem>
            <SelectItem value="Widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          placeholder="Emergency Contact"
          value={newPatient.emergencyContact}
          onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
        <Input
          id="insuranceProvider"
          placeholder="Insurance Provider"
          value={newPatient.insuranceProvider}
          onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
        />
      </div>
      <div className="col-span-2 flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => handleDialogChange(false, buttonText.includes('Add') ? 'add' : 'edit')}>
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

  const SuccessModal = ({ isOpen, onClose, isUpdate }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Success!
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            Patient information has been successfully {isUpdate ? 'updated' : 'added'}.
          </p>
          <Button 
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  
return (
  <div className="space-y-4">
    {/* Success Modal */}
    <SuccessModal 
      isOpen={showSuccess}
      onClose={handleSuccessClose}
      isUpdate={Boolean(selectedPatient)}
    />

    {/* Conditionally Render Patient Views */}
    {activepage === "patientdetails" && selectedPatient && (
      <PatientDetailsView 
        patient={selectedPatient} 
        onClose={() => setIsDetailsViewOpen(false)} 
        SelectedPatient={selectedPatient}
      />
    )}

    {activepage === "patient" && (
      <>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#007664]"></h2>
         
        </div>

        {/* Patients Table */}
        <Card className="bg-[#75C05B]/10"
        style={{
        width: isMobile ? '100vw' : 'auto', // Full width only on mobile
        margin: '0',
        padding: '0',
      }}
        >
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="shadow-sm whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#007664] text-white">ID</TableHead>
                    <TableHead className="bg-[#007664] text-white">Name</TableHead>
                    <TableHead className="bg-[#007664] text-white">DOB</TableHead>
                    <TableHead className="bg-[#007664] text-white">Contact</TableHead>
                    <TableHead className="bg-[#007664] text-white">Condition</TableHead>
                    <TableHead className="bg-[#007664] text-white">Progress</TableHead>
                    <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-green-50 transition-colors duration-200">
                      <TableCell>{patient.identifier}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.birthDate}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{patient.phone}</div>
                          <div className="text-gray-500">{patient.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>{patient.progress}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => viewDetails(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-[#007664] hover:text-[#007664]/80"
                            onClick={() => startEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                         
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </>
    )}
  </div>
);

};







export default Patients;