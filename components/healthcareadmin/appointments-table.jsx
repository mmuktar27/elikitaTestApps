import React, { useState } from "react";
import {  useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Edit2, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import {
  useGetAppointments,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/appointment.hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const AppointmentsTable = () => {
  const { data: appointments, isLoading } = useGetAppointments();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const [sortBy, setSortBy] = useState("chronology");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    patientReference: "",
    appointmentType: "",
    specialty: "",
    status: "",
    startTime: "",
    duration: 30,
    description: "",
    notes: "",
  });

  const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");
  const formatTime = (date) => format(new Date(date), "HH:mm");

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditFormData({
      ...appointment,
      startTime: format(new Date(appointment.startDate), "yyyy-MM-dd'T'HH:mm"),
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    await updateAppointment.mutateAsync({
      id: selectedAppointment._id,
      status: newStatus,
    });
    setIsViewModalOpen(false);
  };

  const handleSaveEdit = async () => {
    await updateAppointment.mutateAsync({
      id: selectedAppointment._id,
      ...editFormData,
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteAppointment.mutateAsync(selectedAppointment._id);
    setIsDeleteModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedAppointments = React.useMemo(() => {
    if (!appointments?.data?.data || !Array.isArray(appointments?.data?.data)) {
      return [];
    }

    return [...appointments.data?.data].sort((a, b) => {
      if (sortBy === "status") {
        return isAscending
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === "chronology") {
        const dateA = new Date(a?.startDate);
        const dateB = new Date(b?.startDate);
        return isAscending ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  }, [appointments?.data?.data, sortBy, isAscending]);

  if (isLoading) {
    return <CardContent>Loading appointments...</CardContent>;
  }

  console.log(sortedAppointments);

  return (
    <CardContent>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-x-2">
          <Button
            variant={sortBy === "status" ? "default" : "outline"}
            onClick={() => {
              setSortBy("status");
              setIsAscending((prev) => (sortBy === "status" ? !prev : true));
            }}
          >
            Sort by Status {sortBy === "status" && (isAscending ? "↑" : "↓")}
          </Button>
          <Button
            variant={sortBy === "chronology" ? "default" : "outline"}
            onClick={() => {
              setSortBy("chronology");
              setIsAscending((prev) =>
                sortBy === "chronology" ? !prev : true,
              );
            }}
          >
            Sort by Chronology{" "}
            {sortBy === "chronology" && (isAscending ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#007664] text-white">
                Fullname
              </TableHead>
              <TableHead className="bg-[#007664] text-white">Patient</TableHead>
              <TableHead className="bg-[#007664] text-white">Date</TableHead>
              <TableHead className="bg-[#007664] text-white">Time</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="transition-colors duration-200 hover:bg-green-50"
              >
                <TableCell>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</TableCell>
                <TableCell>{appointment.patientReference}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formatDate(appointment.startDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formatTime(appointment.startDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(appointment.status)} shadow-sm`}
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
                      onClick={() => handleEditClick(appointment)}
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
      </div>

      {/* View/Status Update Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <Badge
                  className={`${getStatusColor(selectedAppointment.status)} mt-1`}
                >
                  {selectedAppointment.status}
                </Badge>
              </div>
              <div>
                <Label>Update Status</Label>
                <Select onValueChange={(value) => handleUpdateStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Appointment Details</Label>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p>
                    <strong>Patient:</strong>{" "}
                    {selectedAppointment.patient.patientReference}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedAppointment.appointmentType}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedAppointment.startDate)}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(selectedAppointment.startDate)}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedAppointment.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="appointmentType">Appointment Type</Label>
                <Select
                  value={editFormData.appointmentType}
                  onValueChange={(value) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      appointmentType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROUTINE">Routine</SelectItem>
                    <SelectItem value="WALKIN">Walk-in</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                {console.log(editFormData)}
                <Input
                  type="datetime-local"
                  value={editFormData.startTime}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                value={editFormData.reason}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={editFormData.notes}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This will permanently delete the appointment and all associated
              data.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  );
};

export default AppointmentsTable;
