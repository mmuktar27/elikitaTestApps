"use client";
import React, { useState } from "react";
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
import { Eye, Clock, UserRound, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import {
  useGetAppointments,
  useUpdateAppointment,
} from "@/hooks/appointment.hook";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const DoctorAppointmentsTable = ({ doctorId }) => {
  const router = useRouter();

  const { data: appointments, isLoading } = useGetAppointments();
  const updateAppointment = useUpdateAppointment();

  const [sortBy, setSortBy] = useState("chronology");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTab, setViewTab] = useState("details");

  const formatDate = (date) => format(new Date(date), "EEEE, MMMM d, yyyy");
  const formatTime = (date) => format(new Date(date), "h:mm a");

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    await updateAppointment.mutateAsync({
      id: selectedAppointment._id,
      status: newStatus,
    });
  };

  const navigateToPatient = (patientId) => {
    router.push(`/patients/${patientId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return sortedAppointments.filter(
      (apt) => new Date(apt.startDate).toISOString().split("T")[0] === today,
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return sortedAppointments.filter(
      (apt) => new Date(apt.startDate).toISOString().split("T")[0] > today,
    );
  };

  const sortedAppointments = React.useMemo(() => {
    if (!appointments?.data?.data || !Array.isArray(appointments?.data?.data)) {
      return [];
    }

    return [...appointments?.data?.data].sort((a, b) => {
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

  const AppointmentTable = ({ appointments }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32 bg-[#007664] text-white">Time</TableHead>
          <TableHead className="bg-[#007664] text-white">Patient</TableHead>
          <TableHead className="bg-[#007664] text-white">Type</TableHead>
          <TableHead className="bg-[#007664] text-white">Status</TableHead>
          <TableHead className="w-20 bg-[#007664] text-white">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow
            key={appointment._id}
            className="transition-colors duration-200 hover:bg-green-50"
          >
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatTime(appointment.startDate)}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(appointment.startDate), "MMM d")}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-gray-500" />
                <span>{`${appointment.patient.firstName} ${appointment.patient.firstName}`}</span>
              </div>
            </TableCell>
            <TableCell>{appointment.appointmentType}</TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => handleViewClick(appointment)}
              >
                <Eye className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <CardContent>
      <Tabs defaultValue="today" className="w-full">
        <TabsList>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Clock className="size-4" />
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <ArrowUpRight className="size-4" />
            Upcoming
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <AppointmentTable appointments={getTodayAppointments()} />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <AppointmentTable appointments={getUpcomingAppointments()} />
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <Tabs value={viewTab} onValueChange={setViewTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Appointment Details</TabsTrigger>
                <TabsTrigger value="patient">Patient Information</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date & Time</Label>
                    <p className="mt-1 font-medium">
                      {formatDate(selectedAppointment.startDate)}
                      <br />
                      {formatTime(selectedAppointment.startDate)}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1 space-y-2">
                      <Badge
                        className={`${getStatusColor(selectedAppointment.status)}`}
                      >
                        {selectedAppointment.status}
                      </Badge>
                      <Select onValueChange={handleUpdateStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">
                            Mark as In Progress
                          </SelectItem>
                          <SelectItem value="completed">
                            Mark as Completed
                          </SelectItem>
                          <SelectItem value="no-show">
                            Mark as No-show
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Appointment Type</Label>
                  <p className="mt-1">{selectedAppointment.appointmentType}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="mt-1">{selectedAppointment.description}</p>
                </div>
                <div>
                  <Label>Clinical Notes</Label>
                  <p className="mt-1 whitespace-pre-wrap">
                    {selectedAppointment.notes}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="patient" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Patient Information</h3>
                    <Button
                      onClick={() =>
                        navigateToPatient(selectedAppointment.patientReference)
                      }
                      className="flex items-center gap-2"
                    >
                      View Full Profile
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="mt-1">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <Label>Patient ID</Label>
                      <p className="mt-1">
                        {selectedAppointment.patientReference}
                      </p>
                    </div>
                    {/* Add more patient details as needed */}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  );
};

export default DoctorAppointmentsTable;
