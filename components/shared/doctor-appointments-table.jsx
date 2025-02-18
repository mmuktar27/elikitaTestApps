"use client";
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Filter,
  Eye,
  Clock,
  User,
  FileText,
  Phone,
  History,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetAppointments,
  useUpdateAppointment,
} from "@/hooks/appointment.hook";
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
import SkeletonCard from "../ui/skeletoncard";

const DoctorsView = ({ doctorId }) => {
  const router = useRouter();
  const { data: appointments, isLoading } = useGetAppointments();
  const updateAppointment = useUpdateAppointment();

  const [sortType, setSortType] = useState("date");
  const [filterType, setFilterType] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("appointment");

  const formatDate = (date) => (new Date(date), "EEEE, MMMM d, yyyy");
  const formatTime = (date) => (new Date(date), "h:mm a");

  const handleUpdateStatus = async (newStatus) => {
    await updateAppointment.mutateAsync({
      id: selectedAppointment._id,
      status: newStatus,
    });
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

  const filteredAppointments = useMemo(() => {
    if (!appointments?.data?.data) return [];

    const today = new Date().toISOString().split("T")[0];
    return appointments.data.data
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.startDate)
          .toISOString()
          .split("T")[0];

        switch (filterType) {
          case "today":
            return appointmentDate === today;
          case "upcoming":
            return appointmentDate > today;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (sortType === "date") {
          return new Date(a.startDate) - new Date(b.startDate);
        } else {
          return a.status.localeCompare(b.status);
        }
      });
  }, [appointments, filterType, sortType]);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#007664] p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Doctor&apos;s Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant={filterType === "today" ? "secondary" : "outline"}
              onClick={() => setFilterType("today")}
            >
              <Clock className="mr-2 size-4" />
              Today&apos;s Appointments
            </Button>
            <Button
              variant={filterType === "upcoming" ? "secondary" : "outline"}
              onClick={() => setFilterType("upcoming")}
            >
              <ArrowUpRight className="mr-2 size-4" />
              Upcoming Appointments
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              variant={sortType === "date" ? "secondary" : "outline"}
              onClick={() => setSortType("date")}
            >
              <Calendar className="mr-2 size-4" />
              Sort by Date
            </Button>
            <Button
              variant={sortType === "status" ? "secondary" : "outline"}
              onClick={() => setSortType("status")}
            >
              <Filter className="mr-2 size-4" />
              Sort by Status
            </Button>
          </div>
        </div>

        <Table className="rounded-lg bg-white shadow">
          <TableHeader>
            <TableRow>
              <TableHead className="w-32 bg-[#007664] text-white">
                Time
              </TableHead>
              <TableHead className="bg-[#007664] text-white">Patient</TableHead>
              <TableHead className="bg-[#007664] text-white">Type</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="w-20 bg-[#007664] text-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id} className="hover:bg-green-50">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatTime(appointment.startDate)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(new Date(appointment.startDate), "MMM d")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-gray-500" />
                    {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                  </div>
                </TableCell>
                <TableCell>{appointment.appointmentType}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowModal(true);
                    }}
                  >
                    <Eye className="size-4 text-[#007664]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="appointment">
                    Appointment Details
                  </TabsTrigger>
                  <TabsTrigger value="patient">Patient Information</TabsTrigger>
                </TabsList>

                <TabsContent value="appointment" className="space-y-4 pt-4">
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
                          className={getStatusColor(selectedAppointment.status)}
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
                    <p className="mt-1">
                      {selectedAppointment.appointmentType}
                    </p>
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
                      <h3 className="text-lg font-medium">
                        Patient Information
                      </h3>
                      {/*  <Button
                        onClick={() =>
                          router.push(
                            `/patients/${selectedAppointment.patientReference}`,
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        View Full Profile
                        <ArrowUpRight className="size-4" />
                      </Button> */}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <p className="mt-1">
                          {selectedAppointment.patientName}
                        </p>
                      </div>
                      <div>
                        <Label>Patient ID</Label>
                        <p className="mt-1">
                          {selectedAppointment.patientReference}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorsView;
