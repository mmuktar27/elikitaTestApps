

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

const preCheckTasks = [
    { id: "verify-identity", label: "Verify patient identity" },
    { id: "check-vitals", label: "Check patient vitals" },
    { id: "review-history", label: "Review medical history" }
  ]
  
  const chiefComplaintOptions = [
    "Fever",
    "Headache",
    "Abdominal Pain",
    "Cough",
    "Fatigue",
    "Shortness of Breath",
    "Sore Throat",
    "Not listed (specify)"
  ]
  
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
  
  const SmartConsultation = ({ patientData }) => {
    const [activeTab, setActiveTab] = useState('patient-info')
    const [aiEnabled, setAiEnabled] = useState(false)
    const [completedTasks, setCompletedTasks] = useState([])
    const [selectedLabTest, setSelectedLabTest] = useState('cholesterol')
    const [consultationData, setConsultationData] = useState({})
    const [aiSuggestions, setAiSuggestions] = useState({})
    const [selectedChiefComplaints, setSelectedChiefComplaints] = useState([])
    const [otherChiefComplaint, setOtherChiefComplaint] = useState('')
    const [showWarningDialog, setShowWarningDialog] = useState(false)
    const [warningAction, setWarningAction] = useState('')
    const [copiedDiagnosis, setCopiedDiagnosis] = useState(false)
  
    const handleTaskToggle = (taskId) => {
      setCompletedTasks((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      )
    }
  
    const handleConsultationInput = (key, value) => {
      setConsultationData(prev => ({ ...prev, [key]: value }))
    }
  
    const handleChiefComplaintToggle = (complaint) => {
      setSelectedChiefComplaints(prev =>
        prev.includes(complaint)
          ? prev.filter(c => c !== complaint)
          : [...prev, complaint]
      )
    }
  
    const handleAISuggestions = (key) => {
      if (key === 'chiefcomplaint') {
        const suggestions = generateChiefComplaintSuggestions(selectedChiefComplaints)
        setAiSuggestions(prev => ({ ...prev, [key]: suggestions }))
      } else if (key === 'symptoms') {
        const suggestions = generateSymptomSuggestions(selectedChiefComplaints, consultationData.symptoms)
        setAiSuggestions(prev => ({ ...prev, [key]: suggestions }))
      } else if (key === 'examination') {
        const suggestions = `AI suggestion for examination: Consider the following:
  Inspection: Check for visible signs like distention, scars, or jaundice.
  Palpation: Identify tenderness (localized or generalized), masses, or guarding (indicates peritoneal irritation).
  Percussion: Check for tympany (gas) or dullness (fluid or mass).
  Auscultation: Listen for bowel sounds (absent or hyperactive).
  Rebound tenderness: Assess for peritonitis (e.g., appendicitis).`
        setAiSuggestions(prev => ({ ...prev, [key]: suggestions }))
      } else if (key === 'diagnosis') {
        const suggestions = `Based on the patients symptoms of fever, right lower quadrant abdominal pain, nausea, loss of appetite, and signs of dehydration, the most likely diagnosis is acute appendicitis. The elevated heart rate and fever suggest an ongoing infection or inflammation. The localized tenderness and guarding in the right lower quadrant further point toward appendicitis.
  
  Additionally, signs of mild dehydration (dry mucous membranes, delayed skin turgor) may be secondary to decreased oral intake due to pain and nausea.
  
  However, other differential diagnoses to consider include:
  
  Gastroenteritis
  Pelvic inflammatory disease (if applicable, based on further gynecological evaluation)
  Right-sided kidney infection (pyelonephritis)
  Further investigations like an abdominal ultrasound or CT scan may be needed to confirm the diagnosis of appendicitis.
  
  CAUTION: These are AI-generated suggestions based on the provided information. They should be carefully verified and considered by the healthcare professional in the context of the patients full medical history, physical examination, and any additional diagnostic tests. The final diagnosis and treatment plan should always be determined by a qualified healthcare provider.`
        setAiSuggestions(prev => ({ ...prev, [key]: suggestions }))
      } else if (key === 'treatmentplan') {
        setShowWarningDialog(true)
      } else {
        setAiSuggestions(prev => ({ ...prev, [key]: `AI suggestion for ${key}: Consider...` }))
      }
    }
  
    const generateChiefComplaintSuggestions = (complaints) => {
      let suggestions = "Based on the selected chief complaints, consider checking for the following symptoms:\n\n"
      
      if (complaints.includes("Fever")) {
        suggestions += "- Body temperature\n- Chills or sweating\n- Fatigue or weakness\n- Body aches\n"
      }
      if (complaints.includes("Headache")) {
        suggestions += "- Pain location and intensity\n- Duration of headache\n- Any associated symptoms (nausea, sensitivity to light or sound)\n"
      }
      if (complaints.includes("Abdominal Pain")) {
        suggestions += "- Pain location and nature (sharp, dull, cramping)\n- Duration of pain\n- Any associated symptoms (nausea, vomiting, changes in bowel movements)\n"
      }
      if (complaints.includes("Cough")) {
        suggestions += "- Type of cough (dry or productive)\n- Duration of cough\n- Any associated symptoms (shortness of breath, chest pain)\n"
      }
      
      return suggestions
    }
  
    const generateSymptomSuggestions = (complaints, symptoms) => {
      let suggestions = "Based on the chief complaints and symptoms, consider the following examinations:\n\n"
      
      if (complaints.includes("Fever") || complaints.includes("Headache")) {
        suggestions += "- Check vital signs (temperature, blood pressure, heart rate, respiratory rate)\n- Perform a general physical examination\n- Check for signs of dehydration\n"
      }
      if (complaints.includes("Abdominal Pain")) {
        suggestions += "- Perform abdominal palpation\n- Check for abdominal tenderness or guarding\n- Listen for bowel sounds\n"
      }
      if (complaints.includes("Cough") || complaints.includes("Shortness of Breath")) {
        suggestions += "- Perform lung auscultation\n- Check oxygen saturation\n- Observe respiratory effort and rate\n"
      }
      
      return suggestions
    }
  
    const handleWarningAction = () => {
      setShowWarningDialog(false)
      if (warningAction === 'adjust') {
        setAiSuggestions(prev => ({ ...prev, treatmentplan: "Please adjust the treatment plan based on the warnings." }))
      } else if (warningAction === 'sendToSpecialist') {
        const patientDetails = `
  Patient: Alice
  Age: 35
  Gender: Female
  Pregnancy Status: Currently pregnant
  
  Chief Complaint: ${selectedChiefComplaints.join(', ')}${otherChiefComplaint ? `, ${otherChiefComplaint}` : ''}
  
  Symptoms:
  ${consultationData.symptoms || 'No symptoms recorded'}
  
  Examination:
  ${consultationData.examination || 'No examination details recorded'}
  
  Diagnosis:
  ${consultationData.diagnosis || 'No diagnosis recorded'}
  
  Treatment Plan:
  ${consultationData.treatmentplan || 'No treatment plan recorded'}
  
  AI Suggestion:
  Alice is currently pregnant and should not be prescribed thalidomide due to its high risk of teratogenic effects, which can cause severe birth defects.
  
  Additionally, Alice has a documented allergy to penicillin, and therefore should not be administered any penicillin-based antibiotics, including amoxicillin or ampicillin. Please ensure any antibiotic alternatives are chosen with her allergy profile in mind.
  
  It is also noted that Alice is currently taking warfarin, an anticoagulant. Given the potential risk of bleeding complications, especially during pregnancy, she should avoid non-steroidal anti-inflammatory drugs (NSAIDs) such as ibuprofen, as they can increase bleeding risk and interfere with warfarins anticoagulant effects. Consider safer alternatives if pain relief is necessary.
  
  Please review the treatment plan in light of these considerations and adjust the medications accordingly to ensure Alices safety.
  `
        setAiSuggestions(prev => ({ ...prev, treatmentplan: patientDetails }))
      }
    }
  
    const handleVoiceInput = (key) => {
      // Simulating voice input
      handleConsultationInput(key, `${consultationData[key] || ''} [Voice input transcription]`)
    }
  
    const handleTextToSpeech = (key) => {
      // Simulating text-to-speech
      console.log(`Reading aloud: ${consultationData[key]}`)
    }
  
    const handleSendReport = () => {
      console.log('Sending report...')
    }
  
    const handlePrintReport = () => {
      console.log('Printing report...')
    }
  
    const handleCopyDiagnosis = () => {
      navigator.clipboard.writeText(aiSuggestions.diagnosis || '')
      setCopiedDiagnosis(true)
      toast({
        title: "Copied!",
        description: "AI suggestion for diagnosis has been copied to clipboard.",
      })
      setTimeout(() => setCopiedDiagnosis(false), 2000)
    }
    const getInitials = (name) => {
      const nameParts = name.split(" "); // Split the name by space
      const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join(""); // Get first letter of each part
      return initials;
    };
  
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col bg-gradient-to-br from-[#F7F7F7] to-[#e8f5e3]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-gradient-to-r from-[#007664] to-[#75C05B] p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0">
    e-Likita: Smart Consultation
  </h1>
  <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 sm:space-x-4">
    <div className="flex items-center space-x-2 mr-2">
      <Switch
        id="ai-mode"
        checked={aiEnabled}
        onCheckedChange={setAiEnabled}
      />
      <Label htmlFor="ai-mode" className="text-white">AI Assistance</Label>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white text-[#007664] border-none hover:bg-[#F7F7F7] w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Globe className="h-4 w-4 mr-2" />
          Translate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>English</DropdownMenuItem>
        <DropdownMenuItem>Spanish</DropdownMenuItem>
        <DropdownMenuItem>French</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
  
        <Tabs value="consultation"  className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-1 mb-4 bg-gradient-to-r from-[#007664] to-[#75C05B] rounded-lg">
            <TabsTrigger value="consultation" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#75C05B]">Consultation</TabsTrigger>
          </TabsList>
  
            
          <TabsContent value="consultation" className="flex-1 overflow-hidden">
          <Card className="h-full flex flex-col ">
        <CardHeader className="bg-gradient-to-r from-[#007664] to-[#75C05B] p-4 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <CardTitle className="text-white text-lg sm:text-xl"> Smart Consultation</CardTitle>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <Button 
                variant="outline" 
                size="icon"
                className="bg-white text-[#007664] hover:bg-[#F7F7F7] h-8 w-8"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendReport} 
                variant="outline" 
                size="sm" 
                className="bg-white text-[#007664] hover:bg-[#F7F7F7]"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Report
              </Button>
              <Button 
                onClick={handlePrintReport} 
                variant="outline" 
                size="sm" 
                className="bg-white text-[#007664] hover:bg-[#F7F7F7]"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </CardHeader>

              <CardContent className="flex-1 overflow-auto">
              <ScrollArea className="h-full pr-4">
  {consultationSteps.map((step) => (
    <div key={step.key} className="mb-6">
      <Label
        htmlFor={step.key}
        className="mb-1 block text-lg font-medium text-[#007664]"
      >
        {step.label}
      </Label>
      {step.key === 'chiefcomplaint' ? (
        <div>
          <div className="flex flex-wrap gap-4 mb-2">
            {chiefComplaintOptions.map((complaint) => (
              <div
                key={complaint}
                className="flex items-center space-x-2 w-full sm:w-auto"
              >
                <Checkbox
                  id={`complaint-${complaint}`}
                  checked={selectedChiefComplaints.includes(complaint)}
                  onCheckedChange={() => handleChiefComplaintToggle(complaint)}
                />
                <Label htmlFor={`complaint-${complaint}`}>{complaint}</Label>
              </div>
            ))}
          </div>
          {selectedChiefComplaints.includes('Not listed (specify)') && (
            <Input
              placeholder="Specify other chief complaint"
              value={otherChiefComplaint}
              onChange={(e) => setOtherChiefComplaint(e.target.value)}
              className="mt-2 w-full"
            />
          )}
        </div>
      ) : (
        <Textarea
          id={step.key}
          placeholder={`Enter ${step.label}`}
          value={consultationData[step.key] || ''}
          onChange={(e) => handleConsultationInput(step.key, e.target.value)}
          className="h-24 mb-2 bg-white border-[#007664] focus:border-[#75C05B] focus:ring-[#75C05B] w-full"
        />
      )}
      <div className="flex flex-wrap sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
        <Button
          onClick={() => handleVoiceInput(step.key)}
          variant="outline"
          size="sm"
          className="bg-[#007664] text-white hover:bg-[#006054] w-full sm:w-auto"
        >
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
        <Button
          onClick={() => handleTextToSpeech(step.key)}
          variant="outline"
          size="sm"
          className="bg-[#75C05B] text-white hover:bg-[#63a34d] w-full sm:w-auto"
        >
          <VolumeIcon className="h-4 w-4 mr-2" />
          Read Aloud
        </Button>
        <Button
          onClick={() => handleAISuggestions(step.key)}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] w-full sm:w-auto"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {step.key === 'treatmentplan'
            ? 'Validate Plan with AI'
            : 'AI Suggestions'}
        </Button>
        {step.key === 'diagnosis' && (
          <Button
            onClick={handleCopyDiagnosis}
            variant="outline"
            size="sm"
            className="bg-[#53FDFD] text-[#007664] hover:bg-[#48e4e4] w-full sm:w-auto"
            disabled={!aiSuggestions.diagnosis}
          >
            {copiedDiagnosis ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy AI Suggestion
          </Button>
        )}
      </div>
      <Textarea
        placeholder="AI suggestions will appear here"
        value={aiSuggestions[step.key] || ''}
        readOnly
        className="h-24 mt-2 bg-[#e8f5e3] border-[#75C05B] text-[#007664] w-full"
      />
    </div>
  ))}
</ScrollArea>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
  
        <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <DialogContent className="sm:max-w-[500px] p-6">
            <DialogHeader className="flex flex-col items-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-[#B24531]" />
              <DialogTitle className="text-[#B24531] text-xl text-center">WARNING: Potential Contraindications Detected</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center mt-4 space-y-4 text-sm">
              <div className="bg-[#fce8e6] border border-[#B24531] rounded-md p-3">
                <p className="font-semibold">Pregnancy Alert:</p>
                <p>Thalidomide is contraindicated during pregnancy due to severe risk of birth defects.</p>
              </div>
              <div className="bg-[#fff3e6] border border-[#B24531] rounded-md p-3">
                <p className="font-semibold">Allergy Alert:</p>
                <p>Penicillin-based antibiotics (e.g., amoxicillin, ampicillin) are contraindicated due to the patients documented penicillin allergy.</p>
              </div>
              <div className="bg-[#fff3e6] border border-[#B24531] rounded-md p-3">
                <p className="font-semibold">Medication Interaction Alert:</p>
                <p>Patient is currently taking warfarin. Avoid prescribing NSAIDs (e.g., ibuprofen) as they increase the risk of bleeding and may interfere with warfarins effects.</p>
              </div>
              <p className="font-medium">Please review the treatment plan and adjust medications to ensure patient safety.</p>
            </DialogDescription>
            <RadioGroup value={warningAction} onValueChange={setWarningAction} className="flex flex-col items-start space-y-2 mt-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adjust" id="adjust" />
                <Label htmlFor="adjust">Adjust treatment plan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sendToSpecialist" id="sendToSpecialist" />
                <Label htmlFor="sendToSpecialist">Send details to specialist for review and approval</Label>
              </div>
            </RadioGroup>
            <DialogFooter className="mt-6">
              <Button onClick={handleWarningAction} disabled={!warningAction} className="w-full">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
  export default SmartConsultation;