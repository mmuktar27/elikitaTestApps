"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Check,
  Copy,
  Globe,
  Lightbulb,
  Mic,
  Printer,
  Send,
  Video,
  VolumeIcon,
} from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Label } from "@/components/ui/label";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const preCheckTasks = [
  { id: "verify-identity", label: "Verify patient identity" },
  { id: "check-vitals", label: "Check patient vitals" },
  { id: "review-history", label: "Review medical history" },
];

const chiefComplaintOptions = [
  "Fever",
  "Headache",
  "Abdominal Pain",
  "Cough",
  "Fatigue",
  "Shortness of Breath",
  "Sore Throat",
  "Not listed (specify)",
];

const consultationSteps = [
  { key: "chiefcomplaint", label: "Chief Complaint" },
  { key: "symptoms", label: "Symptoms" },
  { key: "examination", label: "Examination" },
  { key: "diagnosis", label: "Diagnosis" },
  { key: "treatmentplan", label: "Treatment Plan" },
];

const vitalSigns = [
  { date: "2023-01-01", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
  { date: "2023-02-01", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
  { date: "2023-03-01", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
  { date: "2023-04-01", heartRate: 73, bloodPressure: 121, temperature: 98.5 },
];

const labResults = [
  { date: "2023-01-01", cholesterol: 180, bloodSugar: 95, creatinine: 0.9 },
  { date: "2023-02-01", cholesterol: 175, bloodSugar: 92, creatinine: 0.8 },
  { date: "2023-03-01", cholesterol: 190, bloodSugar: 98, creatinine: 0.9 },
  { date: "2023-04-01", cholesterol: 172, bloodSugar: 90, creatinine: 0.7 },
];

const SmartConsultation = ({ patientData }) => {
  const [activeTab, setActiveTab] = useState("patient-info");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedLabTest, setSelectedLabTest] = useState("cholesterol");
  const [consultationData, setConsultationData] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [selectedChiefComplaints, setSelectedChiefComplaints] = useState([]);
  const [otherChiefComplaint, setOtherChiefComplaint] = useState("");
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningAction, setWarningAction] = useState("");
  const [copiedDiagnosis, setCopiedDiagnosis] = useState(false);

  const handleTaskToggle = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const handleConsultationInput = (key, value) => {
    setConsultationData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChiefComplaintToggle = (complaint) => {
    setSelectedChiefComplaints((prev) =>
      prev.includes(complaint)
        ? prev.filter((c) => c !== complaint)
        : [...prev, complaint],
    );
  };

  const handleAISuggestions = (key) => {
    if (key === "chiefcomplaint") {
      const suggestions = generateChiefComplaintSuggestions(
        selectedChiefComplaints,
      );
      setAiSuggestions((prev) => ({ ...prev, [key]: suggestions }));
    } else if (key === "symptoms") {
      const suggestions = generateSymptomSuggestions(
        selectedChiefComplaints,
        consultationData.symptoms,
      );
      setAiSuggestions((prev) => ({ ...prev, [key]: suggestions }));
    } else if (key === "examination") {
      const suggestions = `AI suggestion for examination: Consider the following:
  Inspection: Check for visible signs like distention, scars, or jaundice.
  Palpation: Identify tenderness (localized or generalized), masses, or guarding (indicates peritoneal irritation).
  Percussion: Check for tympany (gas) or dullness (fluid or mass).
  Auscultation: Listen for bowel sounds (absent or hyperactive).
  Rebound tenderness: Assess for peritonitis (e.g., appendicitis).`;
      setAiSuggestions((prev) => ({ ...prev, [key]: suggestions }));
    } else if (key === "diagnosis") {
      const suggestions = `Based on the patients symptoms of fever, right lower quadrant abdominal pain, nausea, loss of appetite, and signs of dehydration, the most likely diagnosis is acute appendicitis. The elevated heart rate and fever suggest an ongoing infection or inflammation. The localized tenderness and guarding in the right lower quadrant further point toward appendicitis.
  
  Additionally, signs of mild dehydration (dry mucous membranes, delayed skin turgor) may be secondary to decreased oral intake due to pain and nausea.
  
  However, other differential diagnoses to consider include:
  
  Gastroenteritis
  Pelvic inflammatory disease (if applicable, based on further gynecological evaluation)
  Right-sided kidney infection (pyelonephritis)
  Further investigations like an abdominal ultrasound or CT scan may be needed to confirm the diagnosis of appendicitis.
  
  CAUTION: These are AI-generated suggestions based on the provided information. They should be carefully verified and considered by the healthcare professional in the context of the patients full medical history, physical examination, and any additional diagnostic tests. The final diagnosis and treatment plan should always be determined by a qualified healthcare provider.`;
      setAiSuggestions((prev) => ({ ...prev, [key]: suggestions }));
    } else if (key === "treatmentplan") {
      setShowWarningDialog(true);
    } else {
      setAiSuggestions((prev) => ({
        ...prev,
        [key]: `AI suggestion for ${key}: Consider...`,
      }));
    }
  };

  const generateChiefComplaintSuggestions = (complaints) => {
    let suggestions =
      "Based on the selected chief complaints, consider checking for the following symptoms:\n\n";

    if (complaints.includes("Fever")) {
      suggestions +=
        "- Body temperature\n- Chills or sweating\n- Fatigue or weakness\n- Body aches\n";
    }
    if (complaints.includes("Headache")) {
      suggestions +=
        "- Pain location and intensity\n- Duration of headache\n- Any associated symptoms (nausea, sensitivity to light or sound)\n";
    }
    if (complaints.includes("Abdominal Pain")) {
      suggestions +=
        "- Pain location and nature (sharp, dull, cramping)\n- Duration of pain\n- Any associated symptoms (nausea, vomiting, changes in bowel movements)\n";
    }
    if (complaints.includes("Cough")) {
      suggestions +=
        "- Type of cough (dry or productive)\n- Duration of cough\n- Any associated symptoms (shortness of breath, chest pain)\n";
    }

    return suggestions;
  };

  const generateSymptomSuggestions = (complaints, symptoms) => {
    let suggestions =
      "Based on the chief complaints and symptoms, consider the following examinations:\n\n";

    if (complaints.includes("Fever") || complaints.includes("Headache")) {
      suggestions +=
        "- Check vital signs (temperature, blood pressure, heart rate, respiratory rate)\n- Perform a general physical examination\n- Check for signs of dehydration\n";
    }
    if (complaints.includes("Abdominal Pain")) {
      suggestions +=
        "- Perform abdominal palpation\n- Check for abdominal tenderness or guarding\n- Listen for bowel sounds\n";
    }
    if (
      complaints.includes("Cough") ||
      complaints.includes("Shortness of Breath")
    ) {
      suggestions +=
        "- Perform lung auscultation\n- Check oxygen saturation\n- Observe respiratory effort and rate\n";
    }

    return suggestions;
  };

  const handleWarningAction = () => {
    setShowWarningDialog(false);
    if (warningAction === "adjust") {
      setAiSuggestions((prev) => ({
        ...prev,
        treatmentplan:
          "Please adjust the treatment plan based on the warnings.",
      }));
    } else if (warningAction === "sendToSpecialist") {
      const patientDetails = `
  Patient: Alice
  Age: 35
  Gender: Female
  Pregnancy Status: Currently pregnant
  
  Chief Complaint: ${selectedChiefComplaints.join(", ")}${otherChiefComplaint ? `, ${otherChiefComplaint}` : ""}
  
  Symptoms:
  ${consultationData.symptoms || "No symptoms recorded"}
  
  Examination:
  ${consultationData.examination || "No examination details recorded"}
  
  Diagnosis:
  ${consultationData.diagnosis || "No diagnosis recorded"}
  
  Treatment Plan:
  ${consultationData.treatmentplan || "No treatment plan recorded"}
  
  AI Suggestion:
  Alice is currently pregnant and should not be prescribed thalidomide due to its high risk of teratogenic effects, which can cause severe birth defects.
  
  Additionally, Alice has a documented allergy to penicillin, and therefore should not be administered any penicillin-based antibiotics, including amoxicillin or ampicillin. Please ensure any antibiotic alternatives are chosen with her allergy profile in mind.
  
  It is also noted that Alice is currently taking warfarin, an anticoagulant. Given the potential risk of bleeding complications, especially during pregnancy, she should avoid non-steroidal anti-inflammatory drugs (NSAIDs) such as ibuprofen, as they can increase bleeding risk and interfere with warfarins anticoagulant effects. Consider safer alternatives if pain relief is necessary.
  
  Please review the treatment plan in light of these considerations and adjust the medications accordingly to ensure Alices safety.
  `;
      setAiSuggestions((prev) => ({ ...prev, treatmentplan: patientDetails }));
    }
  };

  const handleVoiceInput = (key) => {
    // Simulating voice input
    handleConsultationInput(
      key,
      `${consultationData[key] || ""} [Voice input transcription]`,
    );
  };

  const handleTextToSpeech = (key) => {
    // Simulating text-to-speech
    console.log(`Reading aloud: ${consultationData[key]}`);
  };

  const handleSendReport = () => {
    console.log("Sending report...");
  };

  const handlePrintReport = () => {
    console.log("Printing report...");
  };

  const handleCopyDiagnosis = () => {
    navigator.clipboard.writeText(aiSuggestions.diagnosis || "");
    setCopiedDiagnosis(true);
    toast({
      title: "Copied!",
      description: "AI suggestion for diagnosis has been copied to clipboard.",
    });
    setTimeout(() => setCopiedDiagnosis(false), 2000);
  };
  const getInitials = (name) => {
    const nameParts = name.split(" "); // Split the name by space
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join(""); // Get first letter of each part
    return initials;
  };

  return (
    <div className="container mx-auto flex h-screen flex-col bg-gradient-to-br from-[#F7F7F7] to-[#e8f5e3] p-4">
      <div className="mb-4 flex flex-col items-center justify-between rounded-lg bg-gradient-to-r from-[#007664] to-[#75C05B] p-4 shadow-md sm:flex-row">
        <h1 className="mb-2 text-2xl font-bold text-white sm:mb-0">
          e-Likita: Smart Consultation
        </h1>
        <div className="flex flex-wrap items-center justify-center space-x-2 sm:justify-end sm:space-x-4">
          <div className="mr-2 flex items-center space-x-2">
            <Switch
              id="ai-mode"
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
            <Label htmlFor="ai-mode" className="text-white">
              AI Assistance
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-none bg-white text-[#007664] hover:bg-[#F7F7F7] sm:mt-0 sm:w-auto"
              >
                <Globe className="mr-2 size-4" />
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col"
      >
        <TabsList className="mb-4 grid w-full grid-cols-2 rounded-lg bg-gradient-to-r from-[#007664] to-[#75C05B]">
          <TabsTrigger
            value="patient-info"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#007664]"
          >
            Patient Info
          </TabsTrigger>
          <TabsTrigger
            value="consultation"
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#75C05B]"
          >
            Consultation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patient-info" className="flex-1 overflow-hidden">
          <Card className="flex h-full flex-col bg-[#F7F7F7]">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#007664] to-[#75C05B]">
              <CardTitle className="text-white">Patient Information</CardTitle>
              <Button
                onClick={handlePrintReport}
                variant="outline"
                size="sm"
                className="ml-2 bg-white text-[#007664] hover:bg-[#F7F7F7]"
              >
                <Printer className="mr-2 size-4" />
                Print Report
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="mb-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Alice"
                  />
                  <AvatarFallback>
                    {getInitials(patientData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-[#007664]">
                    {patientData.name}
                  </p>
                  <p className="text-sm text-[#75C05B]">
                    {patientData.age} years, {patientData.gender},
                    {patientData.pregnancyStatus} Pregnant
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium text-[#007664]">
                    Vital Signs Over Time
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData.vitalSigns}>
                      <XAxis dataKey="date" />
                      <YAxis
                        yAxisId="left"
                        label={{
                          value: "Heart Rate (bpm) / Blood Pressure (mmHg)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Temperature (°F)",
                          angle: 90,
                          position: "insideRight",
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#007664"
                        name="Heart Rate"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="bloodPressure"
                        stroke="#75C05B"
                        name="Blood Pressure"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#B24531"
                        name="Temperature"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Rest of the component remains structurally the same, just updating colors */}
                <div>
                  <h3 className="mb-2 text-lg font-medium text-[#007664]">
                    Lab Test Results
                  </h3>
                  <div className="mb-2">
                    <Select
                      onValueChange={setSelectedLabTest}
                      value={selectedLabTest}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>
                          {selectedLabTest
                            ? selectedLabTest
                            : "Select lab test"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(patientData.labResults[0])
                          .filter((key) => key !== "date")
                          .map((testType, index) => (
                            <SelectItem key={index} value={testType}>
                              {testType}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={labResults}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={selectedLabTest}
                        stroke="#007664"
                        name={selectedLabTest}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium text-[#007664]">
                  Pre-check Tasks
                </h3>
                {preCheckTasks.map((task) => (
                  <div
                    key={task.id}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <Checkbox
                      id={task.id}
                      checked={completedTasks.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <Label htmlFor={task.id} className="text-gray-700">
                      {task.label}
                    </Label>
                  </div>
                ))}
              </div>
              {completedTasks.length < preCheckTasks.length && (
                <Alert
                  variant="warning"
                  className="mt-4 border-[#B24531] bg-[#fff3e6]"
                >
                  <AlertTitle className="text-[#B24531]">Attention</AlertTitle>
                  <AlertDescription className="text-[#B24531]">
                    Please complete all pre-check tasks before proceeding with
                    the consultation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultation" className="flex-1 overflow-hidden">
          <Card className="flex h-full flex-col ">
            <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#007664] to-[#75C05B] p-4">
              <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
                <CardTitle className="text-lg text-white sm:text-xl">
                  Consultation
                </CardTitle>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 bg-white text-[#007664] hover:bg-[#F7F7F7]"
                  >
                    <Video className="size-4" />
                  </Button>
                  <Button
                    onClick={handleSendReport}
                    variant="outline"
                    size="sm"
                    className="bg-white text-[#007664] hover:bg-[#F7F7F7]"
                  >
                    <Send className="mr-2 size-4" />
                    Send Report
                  </Button>
                  <Button
                    onClick={handlePrintReport}
                    variant="outline"
                    size="sm"
                    className="bg-white text-[#007664] hover:bg-[#F7F7F7]"
                  >
                    <Printer className="mr-2 size-4" />
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
                    {step.key === "chiefcomplaint" ? (
                      <div>
                        <div className="mb-2 flex flex-wrap gap-4">
                          {chiefComplaintOptions.map((complaint) => (
                            <div
                              key={complaint}
                              className="flex w-full items-center space-x-2 sm:w-auto"
                            >
                              <Checkbox
                                id={`complaint-${complaint}`}
                                checked={selectedChiefComplaints.includes(
                                  complaint,
                                )}
                                onCheckedChange={() =>
                                  handleChiefComplaintToggle(complaint)
                                }
                              />
                              <Label htmlFor={`complaint-${complaint}`}>
                                {complaint}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedChiefComplaints.includes(
                          "Not listed (specify)",
                        ) && (
                          <Input
                            placeholder="Specify other chief complaint"
                            value={otherChiefComplaint}
                            onChange={(e) =>
                              setOtherChiefComplaint(e.target.value)
                            }
                            className="mt-2 w-full"
                          />
                        )}
                      </div>
                    ) : (
                      <Textarea
                        id={step.key}
                        placeholder={`Enter ${step.label}`}
                        value={consultationData[step.key] || ""}
                        onChange={(e) =>
                          handleConsultationInput(step.key, e.target.value)
                        }
                        className="mb-2 h-24 w-full border-[#007664] bg-white focus:border-[#75C05B] focus:ring-[#75C05B]"
                      />
                    )}
                    <div className="mb-2 flex flex-wrap space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                      <Button
                        onClick={() => handleVoiceInput(step.key)}
                        variant="outline"
                        size="sm"
                        className="w-full bg-[#007664] text-white hover:bg-[#006054] sm:w-auto"
                      >
                        <Mic className="mr-2 size-4" />
                        Voice Input
                      </Button>
                      <Button
                        onClick={() => handleTextToSpeech(step.key)}
                        variant="outline"
                        size="sm"
                        className="w-full bg-[#75C05B] text-white hover:bg-[#63a34d] sm:w-auto"
                      >
                        <VolumeIcon className="mr-2 size-4" />
                        Read Aloud
                      </Button>
                      <Button
                        onClick={() => handleAISuggestions(step.key)}
                        variant="outline"
                        size="sm"
                        className="w-full bg-gradient-to-r from-[#007664] to-[#75C05B] text-white hover:from-[#006054] hover:to-[#63a34d] sm:w-auto"
                      >
                        <Lightbulb className="mr-2 size-4" />
                        {step.key === "treatmentplan"
                          ? "Validate Plan with AI"
                          : "AI Suggestions"}
                      </Button>
                      {step.key === "diagnosis" && (
                        <Button
                          onClick={handleCopyDiagnosis}
                          variant="outline"
                          size="sm"
                          className="w-full bg-[#53FDFD] text-[#007664] hover:bg-[#48e4e4] sm:w-auto"
                          disabled={!aiSuggestions.diagnosis}
                        >
                          {copiedDiagnosis ? (
                            <Check className="mr-2 size-4" />
                          ) : (
                            <Copy className="mr-2 size-4" />
                          )}
                          Copy AI Suggestion
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="AI suggestions will appear here"
                      value={aiSuggestions[step.key] || ""}
                      readOnly
                      className="mt-2 h-24 w-full border-[#75C05B] bg-[#e8f5e3] text-[#007664]"
                    />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="p-6 sm:max-w-[500px]">
          <DialogHeader className="flex flex-col items-center space-y-4">
            <AlertTriangle className="size-12 text-[#B24531]" />
            <DialogTitle className="text-center text-xl text-[#B24531]">
              WARNING: Potential Contraindications Detected
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="mt-4 space-y-4 text-center text-sm">
            <div className="rounded-md border border-[#B24531] bg-[#fce8e6] p-3">
              <p className="font-semibold">Pregnancy Alert:</p>
              <p>
                Thalidomide is contraindicated during pregnancy due to severe
                risk of birth defects.
              </p>
            </div>
            <div className="rounded-md border border-[#B24531] bg-[#fff3e6] p-3">
              <p className="font-semibold">Allergy Alert:</p>
              <p>
                Penicillin-based antibiotics (e.g., amoxicillin, ampicillin) are
                contraindicated due to the patients documented penicillin
                allergy.
              </p>
            </div>
            <div className="rounded-md border border-[#B24531] bg-[#fff3e6] p-3">
              <p className="font-semibold">Medication Interaction Alert:</p>
              <p>
                Patient is currently taking warfarin. Avoid prescribing NSAIDs
                (e.g., ibuprofen) as they increase the risk of bleeding and may
                interfere with warfarins effects.
              </p>
            </div>
            <p className="font-medium">
              Please review the treatment plan and adjust medications to ensure
              patient safety.
            </p>
          </DialogDescription>
          <RadioGroup
            value={warningAction}
            onValueChange={setWarningAction}
            className="mt-6 flex flex-col items-start space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adjust" id="adjust" />
              <Label htmlFor="adjust">Adjust treatment plan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sendToSpecialist" id="sendToSpecialist" />
              <Label htmlFor="sendToSpecialist">
                Send details to specialist for review and approval
              </Label>
            </div>
          </RadioGroup>
          <DialogFooter className="mt-6">
            <Button
              onClick={handleWarningAction}
              disabled={!warningAction}
              className="w-full"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SmartConsultation;
