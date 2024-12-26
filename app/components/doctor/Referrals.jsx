
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

// Charts
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';

// Third-party Modal
import Modal from 'react-modal';
import {
PatientDetailsView
} from "../../components/shared";

const  ReferralsPage = () => {
  const [referralData, setReferralData] = useState([
    {
      id: "12345",
      requester: { display: "Dr. John Smith" },
      authoredOn: "2023-04-15",
      status: "Open",
      patient: {
        name: "Jane Doe",
        dob: "1985-06-20",
        condition: "Diabetes",
        progress: "75%",
        phone: "555-1234",
        email: "jane.doe@example.com",
      },
      details: "Referred for routine check-up and medication management",
    },
    {
      id: "67890",
      requester: { display: "Dr. Sarah Lee" },
      authoredOn: "2023-06-01",
      status: "Closed",
      patient: {
        name: "Michael Johnson",
        dob: "1992-09-12",
        condition: "Hypertension",
        progress: "90%",
        phone: "555-5678",
        email: "michael.johnson@example.com",
      },
      details:
        "Referred for follow-up after hospitalization for high blood pressure",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activepage, setIsactivepage] = useState("referral");
  const [showDetails, setShowDetails] = useState(false);
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
        temperature: 98.6,
      },
      consultations: [
        {
          id: "1",
          date: "2024-01-01",
          doctor: "Dr. Smith",
          reason: "Regular checkup",
          status: "completed",
        },
      ],
      diagnoses: [
        {
          id: "1",
          date: "2024-01-01",
          condition: "Hypertension",
          status: "Stable",
          doctor: "Dr. Smith",
        },
      ],
      medications: [
        {
          id: "1",
          name: "Amlodipine",
          dosage: "5 mg",
          frequency: "once daily",
          startDate: "2024-01-01",
          endDate: "2024-01-11",
        },
      ],
      labResults: [
        {
          id: 1,
          testName: "Glucose",
          description: "Measures the glucose level in the blood",
          code: "15074-8",
          value: 120,
          unit: "mg/dL",
          referenceRange: "70-99 mg/dL",
          flags: "High",
          collectionMethod: "Venipuncture",
          specimenType: "Blood",
          performedDate: "2023-04-15",
          orderedBy: "Dr. Jane Smith",
          performingLab: "deichi clinic gembu",
          patientName: "John Doe",
          patientDOB: "1990-05-12",
          patientMRN: "123456",
          status: "Completed",
          comments:
            "Patient is advised to monitor blood glucose levels closely.",
        },
      ],
      referrals: [
        {
          id: "67890",
          requester: { display: "Dr. Jane Smith" },
          authoredOn: "2023-03-20",
          status: "Pending",
          details: "Referred for blood pressure monitoring and lifestyle counseling",
        
        },
      ],
    },
    {
      id: 2,
      identifier: "PT002",
      name: "Jane Doe",
      birthDate: "1985-06-20",
      gender: "female",
      address: "456 Maple Ave",
      phone: "555-1234",
      email: "jane.doe@example.com",
      condition: "Diabetes",
      status: "active",
      progress: "75%",
      language: "English",
      maritalStatus: "Single",
      emergencyContact: "N/A",
      insuranceProvider: "Wellness Care",
      vitals: {
        bloodPressure: "130/85",
        heartRate: 75,
        temperature: 98.7,
      },
      consultations: [{
        id: "2",
        date: "2024-01-01",
        doctor: "Dr. Smith",
        reason: "Regular checkup",
        status: "completed",
      },],
      diagnoses: [
        {
          id: "2",
          date: "2024-02-01",
          condition: "Diabetes",
          status: "Under Control",
          doctor: "Dr. John Smith",
        },
      ],
      medications: [
        {
          id: "2",
          name: "Metformin",
          dosage: "500 mg",
          frequency: "twice daily",
          startDate: "2023-05-01",
          endDate: "2023-11-01",
        },
      ],
      labResults: [{
        id: 2,
        testName: "Glucose",
        description: "Measures the glucose level in the blood",
        code: "15074-8",
        value: 120,
        unit: "mg/dL",
        referenceRange: "70-99 mg/dL",
        flags: "High",
        collectionMethod: "Venipuncture",
        specimenType: "Blood",
        performedDate: "2023-04-15",
        orderedBy: "Dr. Jane Smith",
        performingLab: "deichi clinic gembu",
        patientName: "John Doe",
        patientDOB: "1990-05-12",
        patientMRN: "123456",
        status: "Completed",
        comments:
          "Patient is advised to monitor blood glucose levels closely.",
      },],
      referrals: [
        {
          id: "12345",
          requester: { display: "Dr. John Smith" },
          authoredOn: "2023-04-15",
          status: "Open",
          details: "Referred for routine check-up and medication management",
        
        },
      ],
    },
  ]);
/*
  const filteredReferrals = patients.referrals.filter((referral) => {
    const searchFields = [
      referral.id,
      referral.requester.display,
      referral.authoredOn,
      referral.status,
      referral.patient.name,
      referral.patient.condition,
    ];
    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
*/
const filteredReferrals = patients
  .flatMap((patient) => 
    (patient.referrals || []).map((referral) => ({
      ...referral,
      patientName: patient.name,
      patientCondition: patient.condition,
      patientProgress: patient.progress,
    }))
  )
  .filter((referral) => {
    const searchFields = [
      referral.id,
      referral.requester.display,
      referral.authoredOn,
      referral.status,
      referral.patientName,
      referral.patientCondition,
      referral.patientProgress,
    ];
    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  const handleClose = () => {
    setShowDetails(false);
    setSelectedPatient(null);
  };
  const getPatientByReferral = (referralId) => {
    // Iterate through patients and find the one containing the referral ID
    return patients.find((patient) =>
      (patient.referrals || []).some((referral) => referral.id === referralId)
    );
  };
  const handleViewReferralDetails = (referral) => {
    setSelectedReferral(referral);
   // console.log(referral);
    setIsReferralModalOpen(true);
  };

  const handleCloseReferralModal = () => {
    setSelectedReferral(null);
    setIsReferralModalOpen(false);
  };

  const handleViewMoreInfo = (patient) => {
    setSelectedPatient(patient);
    setIsReferralModalOpen(false);
    console.log(patient);
    console.log(selectedPatient);
    setIsactivepage("patientdetails");
  };

  return (
    <div>
      {activepage === "referral" && (
        <div className="bg-[#75C05B]/10 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                placeholder="Search referrals..."
                className="pl-8 bg-white rounded-md p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="bg-[#007664] text-white p-2 text-left">Referral ID</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Source</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Date</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Status</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Patient</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Condition</th>
                  <th className="bg-[#007664] text-white p-2 text-left">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr
                    key={referral.id}
                    className="hover:bg-green-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleViewReferralDetails(referral)}
                  >
                    <td className="p-2">{referral.id}</td>
                    <td className="p-2">{referral.requester.display}</td>
                    <td className="p-2">{referral.authoredOn}</td>
                    <td className="p-2">{referral.status}</td>
                    <td className="p-2">{referral.patientName}</td>
                    <td className="p-2">{referral.patientCondition}</td>
                    <td className="p-2">{referral.patientProgress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dialog (Modal) */}
          {isReferralModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={handleCloseReferralModal}
            >
              <div
                className="bg-white p-6 rounded-md shadow-lg max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium" style={{ color: "#007664" }}>
                    Referral Details
                  </h2>
                </div>

                {selectedReferral && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Info size={24} color="#007664" />
                        <div>
                          <h3 className="text-lg font-medium text-black">Referral ID</h3>
                          <p className="text-[#007664]">{selectedReferral.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User size={24} color="#007664" />
                        <div>
                          <h3 className="text-lg font-medium text-black">Referral Source</h3>
                          <p className="text-[#007664]">
                            {selectedReferral.requester.display}
                          </p>
                        </div>
                      </div>
                      {/* Other patient details */}
                      <div className="flex items-center space-x-3">
            <Calendar size={24} color="#007664" className="text-white" />
            <div>
              <h3 className="text-lg font-medium" style={{ color: '#000' }}>Referral Date</h3>
              <p style={{ color: '#007664' }}>12/10/2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} color="#007664" className="text-white" />
            <div>
              <h3 className="text-lg font-medium" style={{ color: '#000' }}>Referral Status</h3>
              <p style={{ color: '#007664' }}>Open</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User size={24} color="#007664" className="text-white" />
            <div>
              <h3 className="text-lg font-medium" style={{ color: '#000' }}>Patient</h3>
              <p style={{ color: '#007664' }}>{selectedReferral.patientName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Info size={24} color="#007664" className="text-white" />
            <div>
              <h3 className="text-lg font-medium" style={{ color: '#000' }}>Condition</h3>
              <p style={{ color: '#007664' }}>{selectedReferral.patientCondition}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} color="#007664" className="text-white" />
            <div>
              <h3 className="text-lg font-medium" style={{ color: '#000' }}>Progress</h3>
              <p style={{ color: '#007664' }}>{selectedReferral.patientProgress}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-3">
              <Info size={24} color="#007664" className="text-white" />
              <div>
                <h3 className="text-lg font-medium" style={{ color: '#000' }}>Referral Details</h3>
                <p style={{ color: '#007664' }}>{selectedReferral.details}</p>
              </div>
            </div>
          </div>
        </div>
      
    
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handleViewMoreInfo(getPatientByReferral(selectedReferral.id))}
            className="px-4 py-2 bg-[#007664] text-white rounded-md hover:bg-[#006054] transition-colors flex items-center space-x-2"
          >
            <span>View More Information</span>
          </button>
        </div>
                    </div>
                 
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Patient Details View */}
      {activepage === "patientdetails" && (
        <PatientDetailsView onClose={handleClose} SelectedPatient={selectedPatient} />
      )}
    </div>
  );
};

export default  ReferralsPage;
