"use client";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  Filter,
  Flag,
  MapPin,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserCircle,FileText,User, ClipboardList, MessageSquare ,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useAppointmentPage } from "../shared";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

import { CreateNewAppointmentModal } from "../shared";

import { StatusDialog , PatientDetailsView } from "../shared";
import { deleteAppointment, getAllAppointments, updateAppointment } from "./api";

import { Skeleton } from "@/components/ui/skeleton";




const AppointmentTableSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Skeleton className="h-10 w-full rounded-md md:w-64" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {/* Sort by Date (Icon Only on Mobile & Tablet) */}
              <Skeleton className="size-10 rounded-lg md:w-32" />
              {/* Sort by Status (Icon Only on Mobile & Tablet) */}
              <Skeleton className="size-10 rounded-lg md:w-32" />
              {/* New Appointment (Icon Only on Mobile & Tablet) */}
              <Skeleton className="size-10 rounded-lg md:w-44" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#007664] text-white">
                  {[
                    "Patient Name",
                    "Patient ID",
                    "Date",
                    "Time",
                    "Type",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="p-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="size-6 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ITEMS_PER_PAGE = 10;

const AppointmentsPage = ({currentDashboard}) => {


  const session = useSession();
  const { activeAppointmentPage, setActiveAppointmentPage } = useAppointmentPage();

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("date");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState([{}]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDeleteType, setItemToDeleteType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const [isNewAppointmentOpens, setIsNewAppointmentOpens] = useState(false);



  const checkAndUpdateExpiredAppointments = async (appointments) => {
    const now = new Date();
    
    // Ensure appointments is an array, not an object with `.data`
    const appointmentsArray = Array.isArray(appointments.data) ? appointments.data : appointments;
    
    const expiredAppointments = appointmentsArray.filter((appointment) => {
      if (appointment?.status?.toLowerCase() === "scheduled") {
        // Check if appointment has an end date
        if (appointment?.endDate) {
          const endDate = new Date(appointment.endDate);
          // Consider expired if current time is past the end date
          return now > endDate;
        } else {
          // Fallback to the old logic if no end date exists
          const startDate = new Date(appointment?.startDate);
          const timeDifference = (now.getTime() - startDate.getTime()) / (1000 * 60); // Difference in minutes
          return timeDifference >= 60; // Only consider expired if it's at least 1 hour past startDate
        }
      }
      return false;
    });
    
    if (expiredAppointments.length > 0) {
      // Update expired appointments in the database
      await Promise.all(
        expiredAppointments.map(async (appointment) => {
          try {
            const updatedAppointment = { ...appointment, status: "expired" };
            await updateAppointment(updatedAppointment);
          } catch (error) {
            console.error(`Failed to update appointment ${appointment.id}:`, error);
          }
        })
      );
      
      // Instead of re-fetching, trigger a refresh state
      setTriggerRefresh(true);
    }
  };
  


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data); // Set fetched appointments first
  
        // After setting state, trigger update for expired ones
        checkAndUpdateExpiredAppointments(data);
      } catch (error) {
        setError(error.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, []);
  

  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data); // Update state with fetched data
      } catch (error) {
        setError(error.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    if (triggerRefresh) {
      fetchAppointments();
      setTriggerRefresh(false);
    }
  }, [triggerRefresh]); // Runs only when triggerRefresh changes

  //console.log(appointments);

  const [currentUser, setcurrentUser] = useState(null);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  const callStatusDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });

    if (status === "success") {
      setTriggerRefresh(true); // Trigger refresh when the status is success
    }
  };

  useEffect(() => {
    setcurrentUser(session?.data?.user);
  }, [session?.data?.user]);

  const handleSort = (type) => {
    setSortType(type);
  };



  const startDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };
  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteDialog(false);
  };
  const confirmDelete = async (itemid) => {
    if (!itemid) {
      callStatusDialog("error", "Invalid appointment ID.");
      return;
    }

    try {
      const response = await deleteAppointment(itemid);

      if (!response || response.error) {
        throw new Error(response?.error || "Unknown error occurred.");
      }

      // Audit log entry for successful deletion
      const auditData = {
        userId: currentUser,
        activityType: "Appointment Delete",
        entityId: itemid,
        entityModel: "Appointment",
        details: `Appointment deleted successfully`,
      };

      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }

      callStatusDialog("success", "Appointment deleted successfully!");
      setTriggerRefresh(true);
    } catch (error) {
      callStatusDialog(
        "error",
        `Failed to delete appointment: ${error.message}`,
      );
      console.error("Error deleting appointment:", error);

      // Audit log entry for failed deletion attempt
      const auditData = {
        userId: currentUser,
        activityType: "Appointment Deletion Failed",
        entityId: itemid,
        entityModel: "Appointment",
        details: `Failed to delete appointment`,
      };

      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
    } finally {
      setShowDeleteDialog(false);
    }
  };
  const ConfirmationDialog = ({ show, onConfirm, onCancel, item }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded bg-white p-6 shadow-md">
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
          <p className="mt-2">
            Are you sure you want to delete this Appointment?
          </p>
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

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800",
      proposed: "bg-amber-100 text-amber-800",
      pending: "bg-purple-100 text-purple-800",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const filteredAndSortedAppointments = React.useMemo(() => {
    if (!appointments?.data) return [];
  
    let filtered = appointments.data.filter((appointment) => {
      const matchesSearch =
        appointment?.patient?.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment?.patient?.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment?.patientReference?.toLowerCase()
          .includes(searchTerm.toLowerCase());
  
      const isNotCanceled =
        currentDashboard === "healthcare admin" || appointment.status !== "cancelled";
  
      return matchesSearch && isNotCanceled;
    });
  
    return filtered.sort((a, b) => {
      if (sortType === "status") {
        return a.status.localeCompare(b.status);
      }
      // Show most recent first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [appointments?.data, searchTerm, sortType, currentDashboard]);
  

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedAppointments.length / ITEMS_PER_PAGE,
  );
  const paginatedAppointments = filteredAndSortedAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Add pagination controls component
  const PaginationControls = () => (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedAppointments.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {filteredAndSortedAppointments.length}
            </span>{" "}
            results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue>{currentPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}  // Convert object values to string if needed

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true)
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsViewModalOpen(false)
  };



  useEffect(() => {
    // Check if selectedAppointment is null
    if (selectedAppointment === null) {
      // Set activeAppointmentPage to "appointment"
      setActiveAppointmentPage("appointment");
    }
  }, [selectedAppointment, setActiveAppointmentPage]);


  if (loading) {
    return (
      <Card>
        <CardContent>
          <AppointmentTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  const AppointmentDetailsModal = ({ selectedAppointment, closeModal }) => {
    if (!selectedAppointment) return null;
  
    const { patient } = selectedAppointment;
  
    return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div className="relative flex max-h-[95vh] w-full max-w-xl flex-col overflow-auto rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 sm:overflow-hidden md:max-h-[80vh] md:max-w-3xl lg:max-w-4xl">     {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white">
        <div className="flex w-full items-center justify-center text-center">
  <CalendarCheck className="mr-2 size-8 text-teal-300" />
  <h2 className="text-2xl font-semibold tracking-tight">
    Patient & Appointment Details
  </h2>
</div>

            
            <button
              onClick={closeModal}
              className="rounded-full p-2 text-blue-200 transition-colors duration-300 hover:bg-blue-700/50 hover:text-white"
            >
              <X className="size-7" />
            </button>
          </div>
    
          {/* Content */}
          <div className="space-y-6 overflow-auto p-6">
            {/* Appointment Details */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
  <h3 className="mb-3 border-b border-blue-100 pb-2 text-lg font-semibold text-teal-800">
    Appointment Information
  </h3>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <DetailRow
      icon={<Clock className="text-teal-600" />}
      label="Appointment Status"
      value={capitalizeFirstLetter(selectedAppointment?.status)}
    />
    <DetailRow
      icon={<CalendarCheck className="text-teal-600" />}
      label="Start Date"
      value={new Date(selectedAppointment?.startDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // This enables AM/PM format
      })}
    />
    <DetailRow
      icon={<CalendarCheck className="text-teal-600" />}
      label="End Date"
      value={new Date(selectedAppointment?.endDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // This enables AM/PM format
      })}    />
    <DetailRow
      icon={<User className="text-teal-600" />}
      label="Scheduled By"
      value={selectedAppointment?.addedBy ? `${selectedAppointment?.addedBy.firstName} ${selectedAppointment?.addedBy.lastName}` : "N/A"}
      />
    <DetailRow
      icon={<FileText className="text-teal-600" />}
      label="Description"
      value={selectedAppointment?.description || "No description provided"}
    />
    <DetailRow
      icon={<Stethoscope  className="text-teal-600" />}
      label="Specialty"
      value={selectedAppointment?.specialty || "N/A"}
    />
    <DetailRow
      icon={<ClipboardList  className="text-teal-600" />}
      label="Appointment Type"
      value={selectedAppointment?.appointmentType || "N/A"}
    />
    <DetailRow
      icon={<MessageSquare  className="text-teal-600" />}
      label="Notes"
      value={selectedAppointment?.notes || "No notes available"}
    />
  </div>
</div>

            {/* Patient Personal Information */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-100 pb-2 text-lg font-semibold text-gray-800">
                Patient Profile
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow 
                  icon={<UserCircle className="text-teal-600" />} 
                  label="Name" 
                  value={`${capitalizeFirstLetter(patient?.firstName)} ${capitalizeFirstLetter(patient?.lastName)}`} 
                />
                <DetailRow 
                  icon={<Flag className="text-teal-600" />} 
                  label="Language" 
                  value={capitalizeFirstLetter(patient?.preferredLanguage)} 
                />
                <DetailRow 
                  icon={<Phone className="text-teal-600" />} 
                  label="Phone" 
                  value={patient?.phone} 
                />
                <DetailRow 
                  icon={<MapPin className="text-teal-600" />} 
                  label="Address" 
                  value={capitalizeFirstLetter(patient?.address)} 
                />
                <DetailRow 
                  icon={<Stethoscope className="text-teal-600" />} 
                  label="Medical Condition" 
                  value={capitalizeFirstLetter(patient?.medicalCondition) || 'No specific conditions'} 
                />
              </div>
            </div>
          
          </div>

  {currentDashboard !== "healthcare admin" && (
  <div className="flex justify-center space-y-2">
    <button 
      onClick={() => {
        if (selectedAppointment?.patient) {
          handleViewMoreInfo(selectedAppointment);
        }
      }}
      className={`flex items-center space-x-2 rounded-md px-4 mb-4 py-1.5 text-xs font-medium shadow-md transition 
        ${selectedAppointment?.patient ? 'bg-[#007664] text-white hover:bg-[#006054]' : 'cursor-not-allowed bg-gray-300 text-gray-600'}`}
      disabled={!selectedAppointment?.patient}
    >
      <span>Proceed to Consultation</span>
    </button>
  </div>
)}


        </div>
      
      </div>
    );
  };
  
  // Utility Component for Consistent Detail Rows
  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
      <div className="flex w-6 items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );


const updateAppointmentStatus = async (selectedAppointment) => {
  if (!selectedAppointment || !selectedAppointment._id) {
    console.error("Invalid appointment data.");
    return { error: "Invalid appointment data." };
  }

  if (selectedAppointment.status === "scheduled") {
    try {
      const updateData = {
        status: "Reviewed",
        _id: selectedAppointment._id,
      };
      const result = await updateAppointment(updateData);
      console.log("Appointment updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { error: error.message };
    }
  } else {
    console.log("Appointment is not scheduled. No update needed.");
    return { message: "Appointment is not scheduled, no update required." };
  }
};
const handleClose = () => {
  setIsViewModalOpen(false);
  setSelectedAppointment(null);
};
const handleViewMoreInfo = async (appointment) => {
   
 

 // setSelectedAppointment(appointement);
  // setIsReferralModalOpen(false);
 setIsViewModalOpen(false)
   const result = await updateAppointmentStatus(appointment);
 
   if (result && !result.error) {
     setActiveAppointmentPage("patientdetails");
     //setSelectedAppointment(null)
   }else{
     setStatusDialog({
       isOpen: true,
       status:  "error",
       message:"Failed to add Update referral Status"
     
   })
 }
 
 }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}

      {activeAppointmentPage === "appointment" && (
        <>
      <header className="mb-6 rounded-lg bg-[#007664] p-6 text-white">
        <div className="mx-auto flex max-w-7xl justify-center">
          <h1 className="text-center text-3xl font-bold">Appointments</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        {/* Actions Bar */}

        {/* Search Bar */}

        {/* Appointments Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="my-4 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Top Container - Keeps Everything Inline */}
                <div className="flex w-full items-center justify-between gap-2">
                  {/* Search Bar - Stays Inline */}
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search appointments..."
                      className="w-full rounded-md border border-gray-300 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007664] md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Buttons (Stay Inline on Mobile & Tablet) */}
                  <div className="flex items-center gap-2">
                    {/* Sort by Date Button (Icon Only on Mobile & Tablet) */}
                    <Button
                      onClick={() => handleSort("date")}
                      className={`flex items-center justify-center rounded-lg border p-2 md:p-3 
          ${
            sortType === "date"
              ? "border-[#007664] bg-[#007664] text-white"
              : "border-gray-300 bg-white text-[#007664] hover:bg-[#007664]/20"
          }`}
                    >
                      <Calendar size={20} />
                      <span className="hidden lg:inline">
                        Sort by Date
                      </span>{" "}
                      {/* Text on Large Screens */}
                    </Button>

                    {/* Sort by Status Button (Icon Only on Mobile & Tablet) */}
                    <Button
                      onClick={() => handleSort("status")}
                      className={`flex items-center justify-center rounded-lg border p-2 md:p-3 
          ${
            sortType === "status"
              ? "border-[#007664] bg-[#007664] text-white"
              : "border-gray-300 bg-white text-[#007664] hover:bg-[#007664]/20"
          }`}
                    >
                      <Filter size={20} />
                      <span className="hidden lg:inline">
                        Sort by Status
                      </span>{" "}
                      {/* Text on Large Screens */}
                    </Button>

                    {/* New Appointment Button (Icon Only on Mobile & Tablet) */}
                    {currentDashboard === "healthcare admin" && (
  <Button
    onClick={() => setIsNewAppointmentOpen(true)}
    className="flex items-center justify-center rounded-lg bg-[#007664] p-2 text-white transition-colors hover:bg-[#006054] md:p-3"
  >
    <Plus size={20} />
    <span className="hidden lg:inline">New Appointment</span>
  </Button>
)}


                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#007664] text-white">
                      Patient Name
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Patient ID
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Date
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Time
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Type
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Status
                    </TableHead>
                    <TableHead className="bg-[#007664] text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments?.map((appointment) => (
                      <TableRow
                        key={appointment._id}
                        className="transition-colors duration-200 hover:bg-green-50"
                      >
                        <TableCell>{`${appointment?.patient?.firstName} ${appointment?.patient?.lastName}`}</TableCell>
                        <TableCell>{appointment?.patient?.patientReference}</TableCell>
                        <TableCell>
                          {format(
                            new Date(appointment?.startDate),
                            "MMM dd, yyyy",
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(appointment.startDate), "hh:mm a")}
                        </TableCell>
                        <TableCell>{appointment.appointmentType}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => handleViewClick(appointment)}
                            >
                              <Eye className="size-4" />
                            </Button>
                            <>
                            {selectedAppointment && isViewModalOpen && (
  <AppointmentDetailsModal 
    selectedAppointment={selectedAppointment} 
    closeModal={closeModal} 
  />
)}                          </>
                            {currentDashboard === "healthcare admin" && (
  <>
    <Button
      variant="ghost"
      size="icon"
      className="text-[#007664] hover:text-[#007664]/80"
      onClick={() => {
        setSelectedAppointment(appointment);
        setIsNewAppointmentOpen(true);
      }}
    >
      <Edit2 className="size-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="text-red-700 hover:text-red-800"
      onClick={() => startDelete(appointment._id)}
    >
      <Trash2 className="size-4" />
    </Button>
  </>
)}

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-4 text-center text-gray-500"
                      >
                        No Record Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <PaginationControls />
            </div>
          </CardContent>
        </Card>
      </main>
      </>
    )}
      <CreateNewAppointmentModal
        isNewAppointmentOpen={isNewAppointmentOpen}
        setIsNewAppointmentOpen={setIsNewAppointmentOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        setShowSuccess={setShowSuccess}
        currentUser={session?.data?.user?.id}
        callStatusDialog={callStatusDialog}
      />

{activeAppointmentPage === "patientdetails" && (
        <PatientDetailsView
          onClose={handleClose}
          SelectedPatient={selectedAppointment?.patient}
          patient={selectedAppointment?.patient}
          currentUser={session?.data?.user?.id}
          currentDashboard={currentDashboard}
        />
      )}
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => {
          setStatusDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        status={statusDialog.status}
        message={statusDialog.message}
      />

      <ConfirmationDialog
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        item={itemToDelete}
      />


    </div>
  );
};

export default AppointmentsPage;
