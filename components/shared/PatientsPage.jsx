"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
// Lucide Icons
import {
  CameraOff,
  Check,
  Edit,
  Edit2,
  Eye,
  FileBarChart,
  FileText,
  Filter,
  X as CloseIcon,
  Calendar,
  Info,
  Pill,
  QrCode,
  CheckCircle,
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
  Check as CheckIcon,
  AlertCircle,
  Globe,
  Loader2,
  Printer,
} from "lucide-react";
import { PatientDetailsView } from "../shared";

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
import { updateReferral, fetchReferralsByConsultant } from "../shared/api";

import { getCurrentUser } from "../shared/api";
import {createAuditLogEntry} from "../shared/api";

import {
  createPatient,
  updatePatient,
  deletePatient,
  fetchPatients,
} from "../shared/api";

import { PatientFilter } from "../shared";
import { usePage } from "../shared";

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

const PatientsForms = ({
  form,
  onSubmit,
  onClose,
  buttonText,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
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
    addedBy: "",
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
    if (!formData.maritalStatus)
      newErrors.maritalStatus = "Marital Status is required.";
    if (!formData.emergencyContact)
      newErrors.emergencyContact = "Emergency Contact is required.";
    if (!formData.insuranceProvider)
      newErrors.insuranceProvider = "Insurance Provider is required.";
    if (!formData.patientReference)
      newErrors.patientReference = "Patient Reference is required.";
    if (!formData.medicalCondition)
      newErrors.medicalCondition = "Medical Condition is required.";
    if (!formData.progress)
      newErrors.progress = "Treatment Progress is required.";
    if (!formData.status) newErrors.status = "Patient Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure addedBy is included before proceeding
    if (!formData?.addedBy || formData.addedBy.trim() === "") {
      setFormData((prev) => ({
        ...prev,
        addedBy: currentUser, // Assign the currentUser value if addedBy is empty
      }));
    }
  
    // Use updated state after ensuring addedBy is set
    if (validateForm()) {
      setIsLoading(true);
  
      try {
        let data;
        if (form?._id) {
          // If patient ID exists, update the patient
          data = await updatePatient(form._id, {
            ...formData,
            addedBy: formData?.addedBy || currentUser,
          });
          onClose();
          onSubmit("success", "Patient updated successfully!");
  
          // Audit log entry for update
          const auditData = {
            userId: currentUser,
            activityType: "Patient Update",
            entityId: form._id,
            entityModel: "Patient",
            details: `Patient ${formData.firstName} ${formData.lastName} updated successfully`,
          };
          await createAuditLogEntry(auditData);
        } else {
          // If no patient ID, create a new patient
          data = await createPatient({
            ...formData,
            addedBy: formData?.addedBy || currentUser,
          });
          onClose();
          onSubmit("success", "Patient created successfully!");
  
          // Ensure the newly created patient ID is available
          if (data?._id) {
            // Audit log entry for creation
            const auditData = {
              userId: currentUser,
              activityType: "Patient Creation",
              entityId: data._id, // Get the generated patient ID
              entityModel: "Patient",
              details: `Patient ${formData.firstName} ${formData.lastName} added successfully`,
            };
            await createAuditLogEntry(auditData);
          } else {
            console.error("Failed to retrieve new patient ID for audit log.");
          }
        }
  
        console.log("Response:", data);
      } catch (error) {
        onSubmit("error", "Operation Failed");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
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
          <h2 className="text-2xl">
            {form?.id ? "Update Patient" : "New Patient Entry"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Gender */}

          <input type="hidden" name="addedBy" value={currentUser} />

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
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
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
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
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
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
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
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate}</p>
              )}
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
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
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
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Email
              </label>
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
              {errors.maritalStatus && (
                <p className="text-sm text-red-500">{errors.maritalStatus}</p>
              )}
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
              {errors.emergencyContact && (
                <p className="text-sm text-red-500">
                  {errors.emergencyContact}
                </p>
              )}
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
              {errors.progress && (
                <p className="text-sm text-red-500">{errors.progress}</p>
              )}
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
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>{" "}
          </div>

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
            {errors.medicalCondition && (
              <p className="text-sm text-red-500">{errors.medicalCondition}</p>
            )}
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
              {errors.preferredLanguage && (
                <p className="text-sm text-red-500">
                  {errors.preferredLanguage}
                </p>
              )}
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
              {errors.insuranceProvider && (
                <p className="text-sm text-red-500">
                  {errors.insuranceProvider}
                </p>
              )}
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
              {errors.patientReference && (
                <p className="text-sm text-red-500">
                  {errors.patientReference}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`rounded-md px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
    ${isLoading ? "cursor-not-allowed bg-gray-400" : "bg-teal-600 hover:bg-teal-700"}
  `}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {buttonText.includes("Update")
                    ? "Updating Patient..."
                    : "Saving Patient..."}
                </span>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Patients = ({ currentDashboard }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(currentDashboard);
  const [referralData, setReferralData] = useState(null);

  const session = useSession();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

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
                  {[
                    "ID",
                    "Name",
                    "DOB",
                    "Contact",
                    "Condition",
                    "Progress",
                    "Actions",
                  ].map((header) => (
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
                          <div
                            key={btn}
                            className="size-8 animate-pulse rounded-md bg-gray-200"
                          />
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
        const user = await getCurrentUser(session?.data?.user?.microsoftId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };

    fetchCurrentUser();
    //console.log(currentUser)
  }, [session?.data?.user?.microsoftId]);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen for resize
    return () => window.removeEventListener("resize", checkScreenWidth); // Cleanup
  }, []);

  const [patients, setPatients] = useState([]);
  const [viewPatState, setViewPatState] = useState({
    isOpen: false,
    patientData: null,
  });

  const [editPatState, setEditPatState] = useState({
    isOpen: false,
    patientData: null,
  });
  const [newPatState, setNewPatState] = useState({
    isOpen: false,
    patientData: null,
  });
  /*
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
  */

  useEffect(() => {
    let isMounted = true;

    const fetchDataBasedOnDashboard = async () => {
      try {
        setIsLoading(true);

        // If manual trigger is true and it's remote doctor dashboard
        if (triggerRefresh && currentDashboard === "remote doctor") {
          console.log("Fetching referrals for consultant:");
          console.log(session?.data?.user);

          const data = await fetchReferralsByConsultant(
            session?.data?.user?.id,
          );
          console.log("API Response:", data);
          console.log("Full response:", data);
          console.log("data.data:", data?.data);
          console.log("data.data.referrals:", data?.data?.referrals);
          console.log(
            "data.data.referrals.patient:",
            data?.data?.referrals?.patient,
          );
          if (isMounted) {
            const patientList = data?.data?.referrals
              .filter((referral) => referral.referralType === "remotedoctor") // Filter for remotedoctor referrals
              .map((referral) => referral.patient)
              .filter((patient) => patient !== null);
            console.log("patientList");
            console.log(patientList);
            setReferralData(data?.data?.referrals);
            setPatients(patientList);
            setTriggerRefresh(false); // Reset trigger after fetch
          }
        }
        // If manual trigger is true and it's not remote doctor dashboard
        else if (triggerRefresh && currentDashboard !== "remote doctor") {
          console.log("Fetching patients...");
          const data = await fetchPatients();

          if (isMounted) {
            console.log("Patients fetched:", data);
            setPatients(data);
            setTriggerRefresh(false); // Reset trigger after fetch
          }
        }
        // Initial load - fetch based on dashboard type without manual trigger
        else {
          if (currentDashboard === "remote doctor") {
            console.log("Initial fetch: Referrals");
            const data = await fetchReferralsByConsultant(
              session?.data?.user.id,
            );
            if (isMounted) {
              setPatients(data.data.referrals.patient);
            }
          } else {
            console.log("Initial fetch: Patients");
            const data = await fetchPatients();
            if (isMounted) {
              setPatients(data);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.message, err.response?.data);
        setError(err.message);
      } finally {
        if (isMounted) {
          console.log("Fetching process completed.");
          setIsLoading(false);
        }
      }
    };

    fetchDataBasedOnDashboard();

    return () => {
      isMounted = false;
      console.log("Cleanup: Component unmounted, fetch aborted.");
    };
  }, [currentDashboard, session?.data?.user, triggerRefresh]);
  const Refresh = () => {
    setTriggerRefresh(true);
  };


  //const [activepage, setIsactivepage] = useState("patient");

  const { activepage, setIsactivepage } = usePage();

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
    let isMounted = true;

    const fetchDataBasedOnDashboard = async () => {
      try {
        setIsLoading(true);

        if (currentDashboard === "remote doctor") {
          console.log("Fetching referrals for consultant:");
          console.log(session?.data?.user);

          const data = await fetchReferralsByConsultant(
            session?.data?.user?.id,
          );
          console.log("API Response:", data);
          console.log("Full response:", data);
          console.log("data.data:", data?.data);
          console.log("data.data.referrals:", data?.data?.referrals);
          console.log(
            "data.data.referrals.patient:",
            data?.data?.referrals?.patient,
          );

          if (isMounted) {
            const uniqueTypes = [
              ...new Set(data?.data?.referrals.map((r) => r.referralType)),
            ];
            console.log("Unique referral types:", uniqueTypes);

            const patientList = data?.data?.referrals
              .filter(
                (referral) =>
                  referral.referralType.toLowerCase().includes("remote") ||
                  referral.referralType.toLowerCase() === "remotedoctor",
              )
              .map((referral) => referral.patient)
              .filter((patient) => patient !== null);

            console.log("Final patient list:", patientList);
            setReferralData(data?.data?.referrals);

            setPatients(patientList);
          }
        } else {
          console.log("Fetching patients...");
          const data = await fetchPatients();

          if (isMounted) {
            console.log("Patients fetched:", data);
            setPatients(data);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.message, err.response?.data);
        setError(err.message);
      } finally {
        if (isMounted) {
          console.log("Fetching process completed.");
          setIsLoading(false);
        }
      }
    };

    fetchDataBasedOnDashboard();

    return () => {
      isMounted = false;
    };
  }, [currentDashboard, session?.data?.user]);

  const [newPatient, setNewPatient] = useState(emptyPatient);

  const resetDialogStates = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsLoading(false);
    setNewPatient(emptyPatient);
  };

  const viewReferral = (referredPatient) => {
    // Find the referral that matches the referred patient's ID
    const matchedReferral = referralData.find(
      (ref) => ref.patient._id === referredPatient._id,
    );

    if (matchedReferral) {
      setSelectedReferral(matchedReferral);
      setIsReferralModalOpen(true);
    } else {
      console.warn("No matching referral found for this patient.");
    }
  };

  const handleCloseReferralModal = () => {
    setSelectedReferral(null);
    setIsReferralModalOpen(false);
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleReferralUpdate = async (referralId, updateData) => {
    if (!referralId) {
      console.error("Referral ID is required.");
      return { error: "Referral ID is required." };
    }

    try {
      const result = await updateReferral(referralId, updateData);
      if (result.error) {
        console.error("Error updating referral:", result.error);
      } else {
        console.log("Referral updated successfully:", result);
      }
      return result;
    } catch (error) {
      console.error("Unexpected error:", error);
      return { error: error.message };
    }
  };
  const updateReferralIfPending = async (selectedReferral) => {
    if (!selectedReferral || !selectedReferral._id) {
      console.error("Invalid referral data.");
      return { error: "Invalid referral data." };
    }

    if (selectedReferral.status === "pending") {
      try {
        const updateData = { status: "Reviewed" };
        const result = await handleReferralUpdate(
          selectedReferral._id,
          updateData,
        );
        console.log("Referral updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error updating referral:", error);
        return { error: error.message };
      }
    } else {
      console.log("Referral is not pending. No update needed.");
      return { message: "Referral is not pending, no update required." };
    }
  };

  const handleViewMoreInfo = async (patient, referral) => {
    setSelectedPatient(patient);
    setIsReferralModalOpen(false);

    const result = await updateReferralIfPending(referral);

    if (result && !result.error) {
      setIsactivepage("patientdetails");
    } else {
      setStatusDialog({
        isOpen: true,
        status: "error",
        message: "Failed to add Update referral Status",
      });
    }
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
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
  };
  const confirmDelete = async (itemid) => {
    if (!itemid) {
      ConfirmationDialog("error", "Invalid ID.");
      return;
    }
  
    try {
      const response = await deletePatient(itemid);
  
      if (!response || response.error) {
        throw new Error(response?.error || "Unknown error occurred.");
      }
  
      confirmationDialog("success", "Patient deleted successfully!");
      Refresh();
  
      // Audit log entry for deletion
      const auditData = {
        userId: User.id,
        activityType: "Patient Archive",
        entityId: itemid,
        entityModel: "Patient",
        details: `Patient with ID ${itemid} Archived successfully`,
      };
  
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log response: Patient deletion logged.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
    } catch (error) {
      confirmationDialog(
        "error",
        `Failed to delete patient: ${error.message}`
      );

      const auditData = {
        userId: User.id,
        activityType: "Failed",
        entityId: itemid,
        entityModel: "Patient",
        details: `Failed to Delete Patients`,
      };
  
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log response: Patient deletion logged.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
      console.error("Error deleting Patient:", error);
    } finally {
      setIsDeleteOpen(false);
    }
  };
  

  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setNewPatient(patient);
    setEditPatState({ patientData: patient, isOpen: true }); // Directly set isOpen to true here
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
    //setEditPatState({ isOpen: true, patientData: {} });
    setNewPatState({ isOpen: true, patientData: {} });
  };

  // Function to close the modal
  const handleDialogClose = () => {
    setEditPatState({ isOpen: false, patientData: null });
    setNewPatState({ isOpen: false, patientData: null });
  };

  const filteredPatients = useMemo(() => {
    if (!patients) return []; // Guard clause for when patients is undefined

    return patients.filter((patient) => {
      if (!patient) return false; // Guard clause for invalid patient records

      // Search Logic with null checks and default values
      const matchesSearch =
        !searchTerm ||
        [
          patient.firstName || "",
          patient.lastName || "",
          patient.patientReference || "",
        ].some((field) =>
          field.toLowerCase().includes((searchTerm || "").toLowerCase()),
        );

      // Filter Logic with null checks
      const matchesProgress =
        !activeFilters?.progress || patient.progress === activeFilters.progress;

      const matchesStatus =
        !activeFilters?.status || patient.status === activeFilters.status;

      const matchesCondition =
        !activeFilters?.condition ||
        (patient.medicalCondition || "")
          .toLowerCase()
          .includes((activeFilters.condition || "").toLowerCase());

      const matchesDateRange =
        (!activeFilters?.dateRange?.from ||
          new Date(patient.birthDate) >=
            new Date(activeFilters.dateRange.from)) &&
        (!activeFilters?.dateRange?.to ||
          new Date(patient.birthDate) <= new Date(activeFilters.dateRange.to));

      return (
        matchesSearch &&
        matchesProgress &&
        matchesStatus &&
        matchesCondition &&
        matchesDateRange
      );
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPatients.length / itemsPerPage));

    // Reset to first page when filters change to avoid empty pages
    if (currentPage > Math.ceil(filteredPatients.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [currentPage, filteredPatients, itemsPerPage]);

  // Calculate paginated patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, currentPage, itemsPerPage]);

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
          currentDashboard={currentDashboard}
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
                    open={newPatState.isOpen}
                    onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
                  >
                    <DialogTrigger asChild>
                      {currentDashboard === "healthcare admin" &&
                        session?.data?.user?.roles?.includes(
                          "healthcare admin",
                        ) && (
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
                              New Patient
                            </h2>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      {/* Patients form component */}
                      <PatientsForms
                        form={newPatState.patientData}
                        onClose={handleDialogClose}
                        onSubmit={(status, message) =>
                          handleAddNewPatientDialog(status, message)
                        }
                        buttonText="Submit"
                        currentUser={session?.data?.user?.id}
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
                          Condition
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
                      {paginatedPatients.length > 0 ? (
                        paginatedPatients.map((patient) => (
                          <TableRow
                            key={patient.patientReference}
                            className="transition-colors duration-200 hover:bg-green-50"
                          >
                            <TableCell>{patient.patientReference}</TableCell>
                            <TableCell>{`${capitalize(patient.firstName)} ${capitalize(patient.lastName)}`}</TableCell>
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
                                <div className="text-gray-500">
                                  {patient.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {capitalize(patient.medicalCondition)}
                            </TableCell>
                            <TableCell>{patient.progress}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() =>
                                    currentDashboard === "remote doctor"
                                      ? viewReferral(patient)
                                      : viewDetails(patient)
                                  }
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
                                        handleAddNewPatientDialog(
                                          status,
                                          message,
                                        )
                                      }
                                      buttonText="Update"
                                      currentUser={session?.data?.user?.id}
                                    />
                                  </DialogContent>
                                </Dialog>
                                {currentDashboard === "healthcare admin" &&
                                  session?.data?.user?.roles?.includes(
                                    "healthcare admin",
                                  ) && (
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
                          <TableCell
                            colSpan={7}
                            className="text-center text-gray-500"
                          >
                            No data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

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
                          <h2 className="text-xl font-semibold text-[#007664]">
                            Referral Details
                          </h2>
                        </div>

                        {selectedReferral && (
                          <div className="items-center space-y-6">
                            {/* Grid Layout for Referral Info */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div className="flex items-center justify-center space-x-3">
                                <Info size={24} color="#007664" />
                                <div>
                                  <h3 className="font-medium text-black">
                                    Referral ID
                                  </h3>
                                  <p className="text-[#007664]">
                                    {selectedReferral.referralID}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <User size={24} color="#007664" />
                                <div>
                                  <h3 className=" font-medium text-black">
                                    Referral Source
                                  </h3>
                                  <p className="text-[#007664]">
                                    {capitalize(
                                      selectedReferral.referredBy.firstName,
                                    )}{" "}
                                    {capitalize(
                                      selectedReferral.referredBy.lastName,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <Calendar size={24} color="#007664" />
                                <div>
                                  <h3 className=" font-medium text-black">
                                    Referral Date
                                  </h3>
                                  <p className="text-[#007664]">
                                    {new Date(
                                      selectedReferral.createdAt,
                                    ).toLocaleString("en-GB", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <CheckCircle size={24} color="#007664" />
                                <div>
                                  <h3 className="font-medium text-black">
                                    Referral Status
                                  </h3>
                                  <p className="text-[#007664]">
                                    {selectedReferral.status}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <User size={24} color="#007664" />
                                <div>
                                  <h3 className="font-medium text-black">
                                    Patient
                                  </h3>
                                  <p className="text-[#007664]">
                                    {selectedReferral.patient.firstName}{" "}
                                    {selectedReferral.patient.lastName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <Info size={24} color="#007664" />
                                <div>
                                  <h3 className="font-medium text-black">
                                    Condition
                                  </h3>
                                  <p className="text-[#007664]">
                                    {selectedReferral.patient.progress}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Referral Details */}
                            <div className="flex items-center justify-center">
                              <div className="flex w-full max-w-2xl items-center space-x-3">
                                <Info size={24} color="#007664" />
                                <div className="flex-1">
                                  <h3 className=" font-medium text-black">
                                    Referral Details
                                  </h3>
                                  <p className="text-[#007664]">
                                    {selectedReferral.referralReason}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Button */}
                            <div className="flex justify-center">
                              <button
                                onClick={() =>
                                  handleViewMoreInfo(
                                    selectedReferral.patient,
                                    selectedReferral,
                                  )
                                }
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
                  {/* Pagination Controls */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Previous
                    </Button>
                    <span className="self-center">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      Next
                    </Button>
                  </div>
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
