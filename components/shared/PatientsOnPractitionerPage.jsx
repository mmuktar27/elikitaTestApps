"use client";
import { Check, Edit, Eye, Filter, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import PatientDetailsView from "./PatientDetailsViewOnPractitionerPage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useCreatePatient,
  useGetPatients,
  useUpdatePatient,
} from "@/hooks/patients.hook";

const Patients = ({ setSelectedUser = () => {} }) => {
  const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [isMobile, setIsMobile] = useState(false);
  const [activepage, setIsactivepage] = useState("patient");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const { data: patientsData, isLoading: isPatientsLoading } = useGetPatients();
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient(selectedPatient?.id);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const emptyPatient = {
    patientReference: "",
    name: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    medicalCondition: "",
    status: "active",
    progress: "",
    language: "",
    maritalStatus: "",
    emergencyContact: "",
    insuranceProvider: "",
  };

  const [newPatient, setNewPatient] = useState(emptyPatient);

  const resetDialogStates = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setNewPatient(emptyPatient);
  };

  const viewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsactivepage("patientdetails");
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetDialogStates();
  };

  const handleSubmit = async (type) => {
    try {
      if (type === "add") {
        await createPatientMutation.mutateAsync(newPatient);
      } else if (type === "edit") {
        await updatePatientMutation.mutateAsync(newPatient);
      }
      setShowSuccess(true);
      resetDialogStates();
    } catch (error) {
      console.error("Error submitting patient:", error);
    }
  };

  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setNewPatient(patient);
    setIsEditOpen(true);
  };

  const handleDialogChange = (isOpen, type) => {
    if (type === "add") {
      setIsAddOpen(isOpen);
    } else if (type === "edit") {
      setIsEditOpen(isOpen);
    }

    if (!isOpen) {
      setNewPatient(emptyPatient);
    }
  };

  const PatientForm = ({ buttonText, onSubmit }) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="patientReference">Patient ID</Label>
        <Input
          disabled="disabled"
          id="patientReference"
          placeholder="Patient ID"
          value="PT097"
          onChange={(e) =>
            setNewPatient({ ...newPatient, patientReference: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Full Name"
          value={newPatient.name}
          onChange={(e) =>
            setNewPatient({ ...newPatient, name: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={newPatient.birthDate}
          onChange={(e) =>
            setNewPatient({ ...newPatient, birthDate: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={newPatient.gender}
          onValueChange={(value) =>
            setNewPatient({ ...newPatient, gender: value })
          }
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
          onChange={(e) =>
            setNewPatient({ ...newPatient, address: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) =>
            setNewPatient({ ...newPatient, phone: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) =>
            setNewPatient({ ...newPatient, email: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicalCondition">Medical Condition</Label>
        <Input
          id="medicalCondition"
          placeholder="Medical Condition"
          value={newPatient.medicalCondition}
          onChange={(e) =>
            setNewPatient({ ...newPatient, medicalCondition: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="progress">Progress</Label>
        <Select
          value={newPatient.progress}
          onValueChange={(value) =>
            setNewPatient({ ...newPatient, progress: value })
          }
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
          onChange={(e) =>
            setNewPatient({ ...newPatient, language: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maritalStatus">Marital Status</Label>
        <Select
          value={newPatient.maritalStatus}
          onValueChange={(value) =>
            setNewPatient({ ...newPatient, maritalStatus: value })
          }
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
          onChange={(e) =>
            setNewPatient({ ...newPatient, emergencyContact: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
        <Input
          id="insuranceProvider"
          placeholder="Insurance Provider"
          value={newPatient.insuranceProvider}
          onChange={(e) =>
            setNewPatient({ ...newPatient, insuranceProvider: e.target.value })
          }
        />
      </div>
      <div className="col-span-2 mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() =>
            handleDialogChange(
              false,
              buttonText.includes("Add") ? "add" : "edit",
            )
          }
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-teal-700 text-white hover:bg-teal-800"
        >
          {isLoading ? "Submitting..." : buttonText}
        </Button>
      </div>
    </div>
  );

  const SuccessModal = ({ isOpen, onClose, isUpdate }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="size-6 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Success!</DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            Patient information has been successfully{" "}
            {isUpdate ? "updated" : "added"}.
          </p>
          <Button
            onClick={onClose}
            className="min-w-[100px] bg-green-600 text-white hover:bg-green-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const filteredPatients =
    patientsData?.data.filter(
      (patient) =>
        patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientReference
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.medicalCondition
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    ) || [];

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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#007664]"></h2>
          </div>

          <Card
            className="bg-[#75C05B]/10"
            style={{
              width: isMobile ? "100vw" : "auto",
              margin: "0",
              padding: "0",
            }}
          >
            <CardHeader>
              <div className="flex w-full items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                  <Input
                    placeholder="Search patients..."
                    className="bg-white pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="whitespace-nowrap shadow-sm"
                >
                  <Filter className="mr-2 size-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-[#007664] text-white">
                        ID
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        Name
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        DOB
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        Contact
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        Medical Condition
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        Progress
                      </TableHead>
                      <TableHead className="bg-[#007664] text-white">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPatientsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Loading patients...
                        </TableCell>
                      </TableRow>
                    ) : filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          className="transition-colors duration-200 hover:bg-green-50"
                        >
                          <TableCell>{patient.patientReference}</TableCell>
                          <TableCell>{`${patient?.firstName} ${patient.lastName}`}</TableCell>
                          <TableCell>
                            {new Date(patient?.birthDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{patient?.phone}</div>
                              <div className="text-gray-500">
                                {patient?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{patient?.medicalCondition}</TableCell>
                          <TableCell>{patient?.progress}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => viewDetails(patient)}
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#007664] hover:text-[#007664]/80"
                                onClick={() => startEdit(patient)}
                              >
                                <Edit className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
