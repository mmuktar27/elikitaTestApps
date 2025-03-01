"use client";
import React, { useState } from "react";
import {  useEffect } from "react";

import {
  CalendarCheck,
  Plus,
  Search,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetAppointments,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/appointment.hook";
import CreateNewAppointmentModal from "./create-appointments";

const ITEMS_PER_PAGE = 10;

const AppointmentsPage = () => {
  const { data: appointments, isLoading } = useGetAppointments();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();
  const session = useSession();

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("date");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

const [currentUser, setcurrentUser]=useState(null)

useEffect(() => {
      setcurrentUser(session?.data?.user);
}, [session?.data?.user]);

  const handleSort = (type) => {
    setSortType(type);
  };

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
  
    try {
      // Delete the appointment
      await deleteAppointment.mutateAsync(selectedAppointment._id);
      console.log("Appointment deleted successfully.");
  
      // Audit log entry
      const auditData = {
        userId: currentUser?.id,
        activityType: "Appointment Deletion",
        entityId: selectedAppointment._id,
        entityModel: "Appointment",
        details: "Appointment deleted successfully",
      };
  
      await createAuditLogEntry(auditData);
      console.log("Audit log created successfully.");
    } catch (error) {
      console.error("Error during appointment deletion:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  

  const handleUpdateStatus = async (newStatus) => {
    if (selectedAppointment) {
      await updateAppointment.mutateAsync({
        id: selectedAppointment._id,
        status: newStatus,
      });
      setIsViewModalOpen(false);
    }
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
    if (!appointments?.data?.data) return [];

    let filtered = appointments.data.data.filter(
      (appointment) =>
        appointment.patient.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patient.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patientReference
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      if (sortType === "status") {
        return a.status.localeCompare(b.status);
      }
      // Changed to show most recent first
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [appointments?.data?.data, searchTerm, sortType]);

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

  const SuccessDialog = () => (
    <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 rounded-full bg-emerald-100 p-3">
            <CalendarCheck className="size-12 text-emerald-600" />
          </div>

          <DialogTitle className="mb-4 text-2xl font-bold text-emerald-700">
            Appointment Created Successfully!
          </DialogTitle>

          <div className="mb-6 w-full max-w-sm space-y-4">
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selectedAppointment && (
                    <>
                      <div className="text-left font-medium text-emerald-700">
                        Patient:
                      </div>
                      <div className="text-right text-emerald-600">
                        {`${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`}
                      </div>

                      <div className="text-left font-medium text-emerald-700">
                        Date:
                      </div>
                      <div className="text-right text-emerald-600">
                        {format(
                          new Date(selectedAppointment.startDate),
                          "MMM dd, yyyy",
                        )}
                      </div>

                      <div className="text-left font-medium text-emerald-700">
                        Time:
                      </div>
                      <div className="text-right text-emerald-600">
                        {format(
                          new Date(selectedAppointment.startDate),
                          "hh:mm a",
                        )}
                      </div>

                      <div className="text-left font-medium text-emerald-700">
                        Type:
                      </div>
                      <div className="text-right text-emerald-600">
                        {selectedAppointment.appointmentType}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex w-full flex-col justify-center gap-2 sm:flex-row sm:justify-end">
            <Button
              onClick={() => setShowSuccess(false)}
              className="border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false);
                setIsNewAppointmentOpen(true);
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Create Another
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6 rounded-lg bg-[#007664] p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl">
        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => setIsNewAppointmentOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#006054]"
          >
            <Plus size={20} />
            New Appointment
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={() => handleSort("date")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                sortType === "date"
                  ? "border-[#007664] text-[#007664]"
                  : "border-gray-300"
              }`}
            >
              <Calendar size={20} />
              Sort by Date
            </Button>
            <Button
              onClick={() => handleSort("status")}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${
                sortType === "status"
                  ? "border-[#007664] text-[#007664]"
                  : "border-gray-300"
              }`}
            >
              <Filter size={20} />
              Sort by Status
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {paginatedAppointments.map((appointment) => (
                    <TableRow
                      key={appointment._id}
                      className="transition-colors duration-200 hover:bg-green-50"
                    >
                      <TableCell>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</TableCell>
                      <TableCell>{appointment.patientReference}</TableCell>
                      <TableCell>
                        {format(
                          new Date(appointment.startDate),
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
                            onClick={() => handleDeleteClick(appointment)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PaginationControls />
            </div>
          </CardContent>
        </Card>
      </main>

      <CreateNewAppointmentModal
        isNewAppointmentOpen={isNewAppointmentOpen}
        setIsNewAppointmentOpen={setIsNewAppointmentOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        setShowSuccess={setShowSuccess}
        currentUser={session?.data?.user?.id}
      />

      <SuccessDialog />
    </div>
  );
};

export default AppointmentsPage;
