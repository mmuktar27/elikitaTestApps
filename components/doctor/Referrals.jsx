'use client'
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
import {createReferral , fetchReferralsByConsultant,updateReferral,deleteReferral } from '../shared/api'

// Charts
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';

// Third-party Modal
import Modal from 'react-modal';
import {
PatientDetailsView
} from "../shared";
import {useSession } from "next-auth/react";
import {getCurrentUser} from '../shared/api'
const  ReferralsPage = ({currentUser, currentDashboard}) => {

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    const getReferrals = async () => {
      console.log("Fetching referrals for consultant: 65c4e8b2d5f43a8e29b86f12");
      console.log(currentUser);
      try {
        const data = await fetchReferralsByConsultant(currentUser._id);
  //console.log(currentUser._id)
        console.log("API Response:", data);
        //console.log("Referrals Data:", data.data.referrals);
  
        setReferrals(data.data.referrals);
      } catch (err) {
        console.error("Error fetching referrals:", err.message, err.response?.data);
        setError(err.message);
      } finally {
        console.log("Fetching process completed.");
        setLoading(false);
      }
    };
  
    getReferrals();
  }, [currentUser]);
  


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activepage, setIsactivepage] = useState("referral");
  const [showDetails, setShowDetails] = useState(false);


  const filteredReferrals = referrals
  .map((referral) => ({
    ...referral,
    patientName: `${referral.patient.firstName} ${referral.patient.lastName}`,
    patientCondition: referral.patient.medicalCondition || "N/A",
    patientProgress: referral.patient.progress || "N/A",
    referredToName: referral.referredTo 
      ? `${referral.referredTo.firstName} ${referral.referredTo.lastName}` 
      : "N/A",
  }))
  .filter((referral) => {
    const searchFields = [
      referral._id,
      referral.referralType,
      referral.referredToName, // Use the formatted string instead of the object
      referral.referralReason,
      referral.status,
      referral.patientName,
      referral.patientCondition,
      referral.patientProgress,
    ];

    return searchFields.some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });



  const handleClose = () => {
    setShowDetails(false);
    setSelectedPatient(null);
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
console.log(filteredReferrals)
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
const isdoctor = () => {
  return currentDashboard === "doctor" && currentUser?.roles?.includes("doctor");
};

  return (
    
    <div>
      
      {activepage === "referral" && (
        <div className="rounded-md bg-[#75C05B]/10 p-4 shadow-md">
          <div className="flex w-full items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <input
                placeholder="Search referrals..."
                className="rounded-md bg-white p-2 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="bg-[#007664] p-2 text-left text-white">Referral ID</th>
                  <th className="bg-[#007664] p-2 text-left text-white">Source</th>
                  <th className="bg-[#007664] p-2 text-left text-white">Date</th>
                  <th className="bg-[#007664] p-2 text-left text-white">Status</th>
                  <th className="bg-[#007664] p-2 text-left text-white">Patient</th>
                  <th className="bg-[#007664] p-2 text-left text-white">Condition</th>
                </tr>
              </thead>
              <tbody>
              {filteredReferrals.map((referral) => (
  <tr
    key={referral._id}
    className="cursor-pointer transition-colors duration-200 hover:bg-green-50"
    onClick={() => handleViewReferralDetails(referral)}
  >
    <td className="p-2">{referral.referralID}</td>
    <td className="p-2">{capitalize(referral.referredBy.firstName)} {capitalize(referral.referredBy.lastName)}</td> {/* Use the formatted name */}
    <td className="p-2">
      {new Date(referral.createdAt).toLocaleString("en-GB", { 
        dateStyle: "medium", 
        timeStyle: "short" 
      })}
    </td>
    <td>{referral.status}</td>
    <td>{referral.patientName}</td>
    <td>{referral.patientProgress}</td>
  </tr>
))}

              </tbody>
            </table>
          </div>
         
                   
          {/* Dialog (Modal) */}
          {isReferralModalOpen && (
            
   <div
   className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
   onClick={handleCloseReferralModal}
 >
   <div
     className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white p-6 shadow-lg"
     onClick={(e) => e.stopPropagation()}
   >
     <div className="mb-6 flex justify-center">
       <h2 className="text-xl font-semibold text-[#007664]">Referral Details</h2>
     </div>

     {selectedReferral && (
       <div className="items-center space-y-6">
         {/* Grid Layout for Referral Info */}
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
           <div className="flex items-center justify-center space-x-3">
             <Info size={24} color="#007664" />
             <div>
               <h3 className="font-medium text-black">Referral ID</h3>
               <p className="text-[#007664]">{selectedReferral.referralID}</p>
             </div>
           </div>
           <div className="flex items-center justify-center space-x-3">
             <User size={24} color="#007664" />
             <div>
               <h3 className=" font-medium text-black">Referral Source</h3>
               <p className="text-[#007664]">{capitalize(selectedReferral.referredBy.firstName)} {capitalize(selectedReferral.referredBy.lastName)}</p>
             </div>
           </div>
           <div className="flex items-center justify-center space-x-3">
             <Calendar size={24} color="#007664" />
             <div>
               <h3 className=" font-medium text-black">Referral Date</h3>
               <p className="text-[#007664]">
                 {new Date(selectedReferral.createdAt).toLocaleString("en-GB", {
                   dateStyle: "medium",
                   timeStyle: "short",
                 })}
               </p>
             </div>
           </div>
           <div className="flex items-center justify-center space-x-3">
             <CheckCircle size={24} color="#007664" />
             <div>
               <h3 className="font-medium text-black">Referral Status</h3>
               <p className="text-[#007664]">{selectedReferral.status}</p>
             </div>
           </div>
           <div className="flex items-center justify-center space-x-3">
             <User size={24} color="#007664" />
             <div>
               <h3 className="font-medium text-black">Patient</h3>
               <p className="text-[#007664]">
                 {selectedReferral.patient.firstName} {selectedReferral.patient.lastName}
               </p>
             </div>
           </div>
           <div className="flex items-center justify-center space-x-3">
             <Info size={24} color="#007664" />
             <div>
               <h3 className="font-medium text-black">Condition</h3>
               <p className="text-[#007664]">{selectedReferral.patient.progress}</p>
             </div>
           </div>
         </div>

         {/* Referral Details */}
         <div className="flex items-center justify-center">
           <div className="flex w-full max-w-2xl items-center space-x-3">
             <Info size={24} color="#007664" />
             <div className="flex-1">
               <h3 className=" font-medium text-black">Referral Details</h3>
               <p className="text-[#007664]">{selectedReferral.referralReason}</p>
             </div>
           </div>
         </div>

         {/* Button */}
         <div className="flex justify-center">
           <button
             onClick={() => handleViewMoreInfo(selectedReferral.patient)}
             className="flex items-center space-x-2 rounded-md bg-[#007664] px-5 py-2 text-white transition-colors hover:bg-[#006054]"
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
        <PatientDetailsView onClose={handleClose} SelectedPatient={selectedPatient}  patient={selectedPatient} currentUser={currentUser}/>
      )}
    </div>
  );
};

export default  ReferralsPage;
