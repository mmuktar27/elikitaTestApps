"use client";
import { Brain, Search, Sparkles, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import SmartConsultation from "./SmartConsultation";

const SmartConsultationPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePage, setActivePage] = useState("preconsult");
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
        {
          date: "2023-01-01",
          heartRate: 72,
          bloodPressure: 120,
          temperature: 98.6,
        },
        {
          date: "2023-02-01",
          heartRate: 75,
          bloodPressure: 118,
          temperature: 98.4,
        },
        {
          date: "2023-03-01",
          heartRate: 70,
          bloodPressure: 122,
          temperature: 98.7,
        },
        {
          date: "2023-04-01",
          heartRate: 73,
          bloodPressure: 121,
          temperature: 98.5,
        },
      ],
      labResults: [
        {
          date: "2023-01-01",
          cholesterol: 180,
          bloodSugar: 95,
          creatinine: 0.9,
        },
        {
          date: "2023-02-01",
          cholesterol: 175,
          bloodSugar: 92,
          creatinine: 0.8,
        },
        {
          date: "2023-03-01",
          cholesterol: 190,
          bloodSugar: 98,
          creatinine: 0.9,
        },
        {
          date: "2023-04-01",
          cholesterol: 172,
          bloodSugar: 90,
          creatinine: 0.7,
        },
      ],
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
        {
          date: "2023-01-01",
          heartRate: 72,
          bloodPressure: 120,
          temperature: 98.6,
        },
        {
          date: "2023-02-01",
          heartRate: 75,
          bloodPressure: 118,
          temperature: 98.4,
        },
        {
          date: "2023-03-01",
          heartRate: 70,
          bloodPressure: 122,
          temperature: 98.7,
        },
        {
          date: "2023-04-01",
          heartRate: 73,
          bloodPressure: 121,
          temperature: 98.5,
        },
      ],
      labResults: [
        {
          date: "2023-01-01",
          cholesterol: 180,
          bloodSugar: 95,
          creatinine: 0.9,
        },
        {
          date: "2023-02-01",
          cholesterol: 175,
          bloodSugar: 92,
          creatinine: 0.8,
        },
        {
          date: "2023-03-01",
          cholesterol: 190,
          bloodSugar: 98,
          creatinine: 0.9,
        },
        {
          date: "2023-04-01",
          cholesterol: 172,
          bloodSugar: 90,
          creatinine: 0.7,
        },
      ],
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
        {
          date: "2023-01-01",
          heartRate: 72,
          bloodPressure: 120,
          temperature: 98.6,
        },
        {
          date: "2023-02-01",
          heartRate: 75,
          bloodPressure: 118,
          temperature: 98.4,
        },
        {
          date: "2023-03-01",
          heartRate: 70,
          bloodPressure: 122,
          temperature: 98.7,
        },
        {
          date: "2023-04-01",
          heartRate: 73,
          bloodPressure: 121,
          temperature: 98.5,
        },
      ],
      labResults: [
        {
          date: "2023-01-01",
          cholesterol: 180,
          bloodSugar: 95,
          creatinine: 0.9,
        },
        {
          date: "2023-02-01",
          cholesterol: 175,
          bloodSugar: 92,
          creatinine: 0.8,
        },
        {
          date: "2023-03-01",
          cholesterol: 190,
          bloodSugar: 98,
          creatinine: 0.9,
        },
        {
          date: "2023-04-01",
          cholesterol: 172,
          bloodSugar: 90,
          creatinine: 0.7,
        },
      ],
    },
  ];

  const filteredPatients = demoPatients.filter(
    (patient) =>
      searchTerm &&
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleContinue = () => {
    setIsSearchOpen(false);
    setActivePage("consult");
    console.log(selectedPatient);
  };
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient); // Set the selected patient
  };

  return (
    <div>
      {activePage === "preconsult" && (
        <div className="min-h-screen bg-gradient-to-b from-[#75C05B]/5 to-[#007664]/5 p-6">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Hero Section */}
            <div className="space-y-6 py-12 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#007664]/10 p-4">
                  <Brain className="size-12 text-[#007664]" />
                </div>
              </div>
              <div>
                <h1 className="mb-4 text-4xl font-bold text-[#007664]">
                  AI-Powered Smart Consultation
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                  Experience the future of healthcare with our AI-assisted
                  consultation system. Get instant medical guidance and
                  personalized care recommendations.
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  className="flex items-center gap-3 bg-[#007664] 
                 px-8 py-6 text-lg text-white shadow-lg transition-all
                 hover:scale-105 hover:bg-[#006253]"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Sparkles className="size-6" />
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
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient name"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className={`cursor-pointer rounded-lg p-4 transition-all hover:shadow-md ${
                          selectedPatient?.id === patient.id
                            ? "border border-[#007664]/20 bg-[#007664]/10"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex size-12 items-center justify-center rounded-full bg-[#75C05B]/10">
                            <User className="size-6 text-[#75C05B]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Age: {patient.age}
                            </p>
                            <p className="text-sm text-gray-500">
                              Last Visit: {patient.lastVisit}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedPatient && (
                    <Button
                      className="w-full bg-[#007664] text-white shadow-lg transition-all
                             hover:scale-105 hover:bg-[#006253]"
                      onClick={handleContinue}
                    >
                      <Sparkles className="mr-2 size-4" />
                      Start AI Consultation
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      {activePage === "consult" && (
        <SmartConsultation patientData={selectedPatient} />
      )}
    </div>
  );
};

export default SmartConsultationPage;
