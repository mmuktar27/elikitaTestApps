

'use client'
import React, { useState , useEffect } from 'react';
import { 
    Heart, Camera, LightbulbOff, Brain, Sparkles, Lightbulb, Activity, 
    MinusCircle, PlusCircle, Plus, Clock, Video, UserRound, Share2, 
    ArrowRight, ChevronLeft, ChevronRight, Volume2, VolumeX, AlertTriangle, 
    ArrowLeft, Beaker, Bed, Bell, Briefcase, Building, Building2, Calculator, 
    Calendar, CalendarCheck, CameraOff, Check, CheckCircle, ChevronDown, 
    Clipboard, ClockIcon, Database, Edit, Edit2, Eye, FileBarChart, FileText, 
    Filter, Home, Info, Layers, LogOut, Mail, MapPin, Mic, MicOff, Phone, 
    Pill, QrCode, Search, Settings, Speaker, Stethoscope, TestTube, Thermometer, 
    Trash2, User, UserCog, UserPlus, Users, Zap, Send, Copy, Check as CheckIcon, Globe, Printer , VolumeIcon 
  } from 'lucide-react';
  import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';

import { 
  Button 
} from '@/components/ui/button';
import Modal from "react-modal";

import { 
  Progress
} from "@/components/ui/progress";

import { 
  Checkbox
} from "@/components/ui/checkbox";


import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";


import { 
  Avatar, AvatarFallback, AvatarImage 
} from "@/components/ui/avatar";

import { 
  Collapsible, CollapsibleContent, CollapsibleTrigger 
} from "@/components/ui/collapsible";


import { 
  Label 
} from "@/components/ui/label";



import { 
  Badge 
} from "@/components/ui/badge";

import { 
  Alert, AlertDescription 
} from "@/components/ui/alert";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {

  SmartConsultation
} from "../../components/shared";

const SmartConsultationPage= () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
   const [activePage, setActivePage] = useState('preconsult');
   const [selectedPatient, setSelectedPatient] = useState(null);
   const demoPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: "32",
      gender: "Female",
      pregnancyStatus: "Not pregnant",
      lastVisit: "2 weeks ago",
      condition: "Regular Check-up",
      vitalSigns: [
        { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
        { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
        { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
        { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 }
      ],
      labResults: [
        { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
        { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
        { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
        { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 }
      ]
    },
    {
      id: 2,
      name: "Emily Williams",
      age: "45",
      gender: "Female",
      pregnancyStatus: "Not pregnant",
      lastVisit: "1 month ago",
      condition: "Follow-up",
      vitalSigns: [
        { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
        { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
        { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
        { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 }
      ],
      labResults: [
        { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
        { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
        { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
        { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 }
      ]
    },
    {
      id: 3,
      name: "James Wilson",
      age: "28",
      gender: "Male",
      pregnancyStatus: "Not applicable",
      lastVisit: "3 months ago",
      condition: "Consultation",
      vitalSigns: [
        { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
        { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
        { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
        { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 }
      ],
      labResults: [
        { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
        { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
        { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
        { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 }
      ]
    }
  ];
  

  const filteredPatients = demoPatients.filter(
    (patient) =>
      searchTerm && (
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );



  const handleContinue = () => {
    setIsSearchOpen(false);
    setActivePage("consult");
    console.log(selectedPatient)
  };
    const handlePatientSelect = (patient) => {
    setSelectedPatient(patient); // Set the selected patient
  };

  return (
  <div>
      {activePage === 'preconsult' && (
   <div className="min-h-screen bg-gradient-to-b from-[#75C05B]/5 to-[#007664]/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center">
            <div className="bg-[#007664]/10 p-4 rounded-full">
              <Brain className="w-12 h-12 text-[#007664]" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#007664] mb-4">AI-Powered Smart Consultation</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-assisted consultation system. 
              Get instant medical guidance and personalized care recommendations.
            </p>
          </div>
         <div className="flex justify-center">
    <Button 
      className="bg-[#007664] text-white hover:bg-[#006253] transition-all 
                 transform hover:scale-105 px-8 py-6 text-lg shadow-lg
                 flex items-center gap-3"
      onClick={() => setIsSearchOpen(true)}
    >
      <Sparkles className="w-6 h-6" />
      Start Smart Consultation
    </Button>
  </div>
        </div> 
        {/* Patient Selection Dialog */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patient name"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedPatient?.id === patient.id
                        ? 'bg-[#007664]/10 border border-[#007664]/20'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#75C05B]/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-[#75C05B]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">Age: {patient.age}</p>
                        <p className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPatient && (
                <Button
                  className="w-full bg-[#007664] hover:bg-[#006253] text-white shadow-lg
                             transition-all transform hover:scale-105"
                  onClick={handleContinue}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Consultation
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
      )}
          {activePage === 'consult' && <SmartConsultation patientData={selectedPatient}/>}
    </div>
  );
};

export default SmartConsultationPage;