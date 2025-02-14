"use client";
import React, { useState, useEffect ,useMemo } from "react";

// Lucide Icons
import {
 
  CameraOff,
  Check,

  Edit,
  Edit2,
  Eye,
  FileBarChart,
  FileText,
  Filter,X as CloseIcon ,
 
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
  Users,
  Zap,
  Send,
  Copy,
  Check as CheckIcon,AlertCircle,
  Globe,
  Printer,
} from "lucide-react";
import { PatientDetailsView} from "../shared"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {getCurrentUser} from '../shared/api'

import { createPatient, updatePatient, deletePatient,fetchPatients } from "../shared/api"

import {PatientFilter} from "../shared"

const StatusDialog = ({ isOpen, onClose, status, message }) => {
  const isSuccess = status === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-sm rounded-lg border-2 transition-all duration-200${
          isSuccess
            ? "border-[#75C05B] bg-[#007664]"
            : "border-[#B24531]/50 bg-[#B24531]"
        }`}
      >
        <div className="p-6 text-white">
          <div className="mb-4 flex items-center justify-center">
            {isSuccess ? (
              <div className="rounded-full bg-[#75C05B] p-3">
                <Check className="size-8 text-white" />
              </div>
            ) : (
              <div className="rounded-full bg-[#B24531]/80 p-3">
                <AlertCircle className="size-8 text-white" />
              </div>
            )}
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold">
            {isSuccess ? "Success!" : "Error"}
          </h2>

          <p className="text-center text-white/90">{message}</p>

          <button
            onClick={onClose}
            className={`mt-6 w-full rounded-lg px-4 py-2 font-semibold transition-colors duration-200
              ${
                isSuccess
                  ? "bg-[#75C05B] hover:bg-[#75C05B]/80"
                  : "bg-white/20 hover:bg-white/30"
              }`}
          >
            {isSuccess ? "Continue" : "Try Again"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const PatientsForms = ({ form , onSubmit , onClose}) => {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    address: "",
    phone: "",
    email: "",
    medicalCondition: "",
    progress: "",
    maritalStatus: "",
    emergencyContact: "",
    insuranceProvider: "",
    status: "",
    patientReference: "",
  });


  const [errors, setErrors] = useState({});

  // Update formData when the form prop changes (for editing existing data)
  const currentYear = new Date().getFullYear();

  // Update formData when the form prop changes (for editing existing data)
  useEffect(() => {
    if (form && Object.keys(form).length > 0) {
      setFormData(form);
    } else {
      // Generate a new patient reference using a portion of Unix timestamp
      const unixTimestamp = Date.now();
      const timestampPortion = unixTimestamp.toString().slice(-4); // Take last 4 digits
      const newReference = `PAT-${currentYear}-${timestampPortion}`;
  
      setFormData((prevData) => ({
        ...prevData,
        patientReference: newReference,
      }));
    }
  }, [form, currentYear]);


  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "patientReference") {
      setFormData({ ...formData, [name]: value });
    }

    // Remove error message when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.birthDate) newErrors.birthDate = "Birth Date is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.maritalStatus) newErrors.maritalStatus = "Marital Status is required.";
    if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency Contact is required.";
    if (!formData.insuranceProvider) newErrors.insuranceProvider = "Insurance Provider is required.";
    if (!formData.patientReference) newErrors.patientReference = "Patient Reference is required.";
    if (!formData.medicalCondition) newErrors.medicalCondition = "Medical Condition is required.";
    if (!formData.progress) newErrors.progress = "Treatment Progress is required.";
    if (!formData.status) newErrors.status = "Patient Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(form)
    if (validateForm()) {
      setLoading(true);

      try {
        let data;
        if (form?._id) {
          // If patient ID exists, update the patient
          data = await updatePatient(form._id, formData);
          //alert("Patient updated successfully!");
          onClose();
onSubmit('success', 'Patient updated successfully!!');
        } else {
          // If no patient ID, create a new patient
          data = await createPatient(formData);
         // alert("Patient created successfully!");
         onClose();
          onSubmit('success', 'Patient created successfully!');
        }

        console.log("Response:", data);
      } catch (error) {
        //alert("Error: " + error.message);
      // onClose();
        onSubmit('error', 'Operation Failed');
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!form?.id) {
      alert("No patient selected for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this patient?")) {
      setLoading(true);

      try {
        const data = await deletePatient(form.id);
        alert("Patient deleted successfully!");
        console.log("Response:", data);
        setFormData({});
      } catch (error) {
        alert("Error: " + error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6" style={{ width: "65vw" }}>
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow-lg md:grid-cols-1">
        <div className="flex flex-row items-center justify-between rounded-t-lg bg-teal-700 p-4 text-white">
          <h2 className="text-2xl">{form?.id ? "Update Patient" : "New Patient Entry"}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Gender */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Gender and Birth Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
            </div>
          </div>

          {/* Address and Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-teal-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* New fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
  <label className="block text-sm font-medium text-teal-700">
    Marital Status <span className="text-red-500">*</span>
  </label>
  <select
    name="maritalStatus"
    value={formData.maritalStatus}
    onChange={handleInputChange}
    className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
  >
    <option value="">Select</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
    <option value="Divorced">Divorced</option>
    <option value="Widowed">Widowed</option>
  </select>
  {errors.maritalStatus && <p className="text-sm text-red-500">{errors.maritalStatus}</p>}
</div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Emergency Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.emergencyContact && <p className="text-sm text-red-500">{errors.emergencyContact}</p>}
            </div>
          </div>
{/* Medical Condition, Progress, and Status */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
<div className="space-y-2">

    <label className="block text-sm font-medium text-teal-700">
      Treatment Progress
    </label>
    <select
      name="progress"
      value={formData.progress}
      onChange={handleInputChange}
      className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
    >
      <option value="">Select Progress</option>
      <option value="Initial Assessment">Initial Assessment</option>
      <option value="Treatment Started">Treatment Started</option>
      <option value="ongoing">Ongoing</option>
      <option value="improving">Improving</option>
      <option value="stable">Stable</option>
      <option value="completed">Completed</option>
    </select>
    {errors.progress && <p className="text-sm text-red-500">{errors.progress}</p>}

    </div>
    <div className="space-y-2">

 
    <label className="block text-sm font-medium text-teal-700">
      Patient Status
    </label>
    <select
      name="status"
      value={formData.status}
      onChange={handleInputChange}
      className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
    >
      <option value="">Select Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
      <option value="Discharged">Discharged</option>
      <option value="Transferred">Transferred</option>
    </select>
    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}

    </div>  </div> 

  <div className="space-y-2">
    <label className="block text-sm font-medium text-teal-700">
      Medical Condition
    </label>
    <textarea
      name="medicalCondition"
      value={formData.medicalCondition}
      onChange={handleInputChange}
      className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
      placeholder="Describe patient's medical condition"
    />
    {errors.medicalCondition && <p className="text-sm text-red-500">{errors.medicalCondition}</p>}

  </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">

<label className="block text-sm font-medium text-teal-700">
Preferred Language
</label>
<select
  name="preferredLanguage"
  value={formData.preferredLanguage}
  onChange={handleInputChange}
  className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
>
  <option value="">Select Language</option>
  <option value="English">English</option>
  <option value="Hausa">Hausa</option>
  <option value="Fulfulde">Fulfulde</option>
 
</select>
{errors.preferredLanguage && <p className="text-sm text-red-500">{errors.preferredLanguage}</p>}

</div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.insuranceProvider && <p className="text-sm text-red-500">{errors.insuranceProvider}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Patient Reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientReference"
                value={formData.patientReference}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                disabled
              />
              {errors.patientReference && <p className="text-sm text-red-500">{errors.patientReference}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {form?.id ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Patients = ({ setSelectedUser = () => {} }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('remotedoctor');
  const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [isMobile, setIsMobile] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
 const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });


  const LoadingSkeleton = () => {
    // Create an array of 5 items to represent loading rows
    const loadingRows = Array(5).fill(null);
  
    return (
    
      <Card className="bg-[#75C05B]/10">
        <CardHeader>
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              {/* Search bar skeleton */}
              <div className="relative max-w-64 grow">
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
              </div>
              {/* Filter button skeleton */}
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
            </div>
            {/* New Patient button skeleton */}
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
          </div>
        </CardHeader>
  
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {['ID', 'Name', 'DOB', 'Contact', 'Condition', 'Progress', 'Actions'].map((header) => (
                    <TableHead key={header} className="bg-[#007664] text-white">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRows.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {[1, 2, 3].map((btn) => (
                          <div key={btn} className="size-8 animate-pulse rounded-md bg-gray-200" />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    
  );
  };






  useEffect(() => {
    const fetchCurrentUser = async () => {
        try {
            const user = await getCurrentUser('MICRO12443456');
            setCurrentUser(user);
        } catch (error) {
            console.error('Failed to fetch user data');
        }
    };

    fetchCurrentUser();
    console.log(currentUser)
}, []);







  
  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen for resize
    return () => window.removeEventListener("resize", checkScreenWidth); // Cleanup
  }, []);

  const [patients, setPatients] = useState([]);
  const [viewPatState, setViewPatState] = useState({
    isOpen: false,
    patientData: null
  });
  
  const [editPatState, setEditPatState] = useState({
    isOpen: false,
    patientData: null
  });
  useEffect(() => {
    if (!triggerRefresh) return;
  
    let isMounted = true; // Prevents state updates on unmounted components
  
    const getPatients = async () => {
      try {
        console.log("Fetching patients...");
        setIsLoading(true)
        const data = await fetchPatients();
  
        if (isMounted) {
          console.log("Patients fetched:", data);
          setPatients(data);
          setTriggerRefresh(false);
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
  
    getPatients();
  
    return () => {
      isMounted = false;
      console.log("Cleanup: Component unmounted, fetch aborted.");
    };
  }, [triggerRefresh]);
  
    
    const Refresh = () => {
      setTriggerRefresh(true);
    };
  
  const [activepage, setIsactivepage] = useState("patient");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    insuranceProvider: "",
  };
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components
  
    const getPatients = async () => {
      try {
        console.log("Fetching patients...");
        setIsLoading(true)
        const data = await fetchPatients();
  
        if (isMounted) {
          console.log("Patients fetched:", data);
          setPatients(data);
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
  
    getPatients(); // Call the async function
  
    return () => {
      isMounted = false;
      //console.log("Cleanup: Component unmounted, fetch aborted.");
    };
  }, []);
  
  const [newPatient, setNewPatient] = useState(emptyPatient);

  const resetDialogStates = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsLoading(false);
    setNewPatient(emptyPatient);
  };

  const viewDetails = (patient) => {
    setSelectedPatient(patient);
    console.log(selectedPatient);
    setIsactivepage("patientdetails");
  };
  const CloseviewDetails = () => {
    setIsactivepage("patient");
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetDialogStates();
  };
  const handleSubmit = async (type) => {
    setIsLoading(true);

    setTimeout(() => {
      if (type === "add") {
        setPatients([
          ...patients,
          {
            id: patients.length + 1,
            ...newPatient,
          },
        ]);
      } else if (type === "edit") {
        setPatients(
          patients.map((p) => (p.id === selectedPatient.id ? newPatient : p)),
        );
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
  const confirmationDialog = (status, message) => {
    setStatusDialog({
        isOpen: true,
        status: status === "success" ? "success" : "error",
        message: message || (status === "success" ? "Action completed successfully" : "Action failed"),
    });
};
 const confirmDelete = async (itemid) => {
   if (!itemid) {
       ConfirmationDialog("error", "Invalid  ID.");
       return;
   }

   try {
     const response = await deletePatient(itemid);
 
     if (!response || response.error) {
         throw new Error(response?.error || "Unknown error occurred.");
     }
 
     confirmationDialog("success", "Patients deleted successfully!");
     Refresh();
 } catch (error) {
     confirmationDialog("error", `Failed to delete diagnosis: ${error.message}`);
     console.error("Error deleting Patient:", error);
 } finally {
     setIsDeleteOpen(false);
 }
  }



  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setNewPatient(patient);
    setEditPatState({ patientData: patient, isOpen: true });  // Directly set isOpen to true here
    setIsEditOpen(true);
  };

  const cancelDelete = () => {
    setPatientToDelete(null);
    setIsDeleteOpen(false);
  };
  const handleAddNewPatientDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Patient added successfully!"
          : "Failed to add Patient"),
    });
  };
  const handleUpdatePatientDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Patient updated successfully!"
          : "Failed to add Patient"),
    });
  };

  const ConfirmationDialog = ({ show, onConfirm, onCancel, item }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded bg-white p-6 shadow-md">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <p className="mt-2">Are you sure you want to delete this item?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              className="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
              onClick={() => onConfirm(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  const handleDialogChange = (isOpen, type) => {
    if (type === "add") {
      setIsAddOpen(isOpen);
    } else if (type === "edit") {
      setIsEditOpen(isOpen);
    }

    if (!isOpen) {
      setNewPatient(emptyPatient);
      setIsLoading(false);
    }
  };
  const handleNewPatient = () => {
    setEditPatState({ isOpen: true, patientData: {} });
  };

  // Function to close the modal
  const handleDialogClose = () => {
    setEditPatState({ isOpen: false, patientData: null });
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search Logic
      const matchesSearch = 
        !searchTerm || 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientReference.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter Logic
      const matchesProgress = 
        !activeFilters.progress || 
        patient.progress === activeFilters.progress;

      const matchesStatus = 
        !activeFilters.status || 
        patient.status === activeFilters.status;

      const matchesCondition = 
        !activeFilters.condition || 
        patient.medicalCondition.toLowerCase().includes(activeFilters.condition.toLowerCase());

      const matchesDateRange = 
        (!activeFilters.dateRange?.from || 
          new Date(patient.birthDate) >= new Date(activeFilters.dateRange.from)) &&
        (!activeFilters.dateRange?.to || 
          new Date(patient.birthDate) <= new Date(activeFilters.dateRange.to));

      return matchesSearch && 
             matchesProgress && 
             matchesStatus && 
             matchesCondition && 
             matchesDateRange;
    });
  }, [patients, searchTerm, activeFilters]);

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
          currentUser={currentUser}
        />
      )}

      {activepage === "patient" && (
      <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <Card
          className="bg-[#75C05B]/10"
          style={{
            width: isMobile ? "100vw" : "auto", // Full width only on mobile
            margin: "0",
            padding: "0",
          }}
        >
          <CardHeader>
            <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Search and Filter Container */}
              <div className="flex w-full items-center gap-2 sm:w-auto">
                {/* Search input field */}
                <div className="relative max-w-64 grow">
                  <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                  <Input
                    placeholder="Search patients..."
                    className="w-full bg-white pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setSearchTerm("")}
                    >
                      <CloseIcon className="size-4" />
                    </Button>
                  )}
                </div>
    
                <Button
                  variant="outline"
                  className="whitespace-nowrap shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="mr-2 size-4" />
                  Filter
                </Button>
              </div>
              <PatientFilter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilter={setActiveFilters}
              />
              {/* New Patient Button */}
              <Dialog
                open={editPatState.isOpen}
                onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
              >
                <DialogTrigger asChild>
                {currentUser?.roles?.includes("healthassistant") && (
  <Button
    className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto"
    onClick={handleNewPatient}
  >
    <UserPlus className="mr-2 size-4" />
    New Patient
  </Button>
)}

                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="mb-0 text-center">
                        <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                          {editPatState.patientData?._id
                            ? "Edit Patient"
                            : "New Patient"}
                        </h2>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  {/* Patients form component */}
                  <PatientsForms
                    form={editPatState.patientData}
                    onClose={handleDialogClose}
                    onSubmit={(status, message) =>
                      handleAddNewPatientDialog(status, message)
                    }
                  />
                </DialogContent>
              </Dialog>
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
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow
                        key={patient.patientReference}
                        className="transition-colors duration-200 hover:bg-green-50"
                      >
                        <TableCell>{patient.patientReference}</TableCell>
                        <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                        <TableCell>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(patient.birthDate))}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.phone}</div>
                            <div className="text-gray-500">{patient.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.medicalCondition}</TableCell>
                        <TableCell>{patient.progress}</TableCell>
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
    
                            <Dialog
                              open={editPatState.isOpen}
                              onOpenChange={(isOpen) =>
                                !isOpen && handleDialogClose()
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[#007664] hover:text-[#007664]/80"
                                  onClick={() => startEdit(patient)}
                                >
                                  <Edit className="size-4" />
                                </Button>
                              </DialogTrigger>
    
                              <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-5xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    <div className="mb-0 text-center">
                                      <h2 className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-3xl font-bold text-transparent">
                                        {editPatState.patientData?._id
                                          ? "Edit Patient"
                                          : "New Patient"}
                                      </h2>
                                    </div>
                                  </DialogTitle>
                                </DialogHeader>
    
                                <PatientsForms
                                  form={editPatState.patientData}
                                  onClose={handleDialogClose}
                                  onSubmit={(status, message) =>
                                    handleAddNewPatientDialog(status, message)
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                            {currentUser?.roles?.includes("healthassistant") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-700 hover:text-red-800"
                              onClick={() => startDelete(patient._id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
    
      )}

<StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        if (statusDialog.status === "success") {
                          Refresh();
                        }
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />

<ConfirmationDialog
            show={isDeleteOpen}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            item={patientToDelete}
          />
    </div>
  );
};

export default Patients;
