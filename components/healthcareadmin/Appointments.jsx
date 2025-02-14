"use client";

import { CalendarCheck, Plus, Search } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { AlertDialog } from "@/components/ui/alert-dialog";

import AppointmentsTable from "./appointments-table";
import CreateNewAppointmentModal from "./create-appointments";

const AppointmentsPage = () => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const [appointments] = useState([
    {
      id: "appointment-001",
      identifier: [
        {
          system: "http://example.org/sampleappointment-identifier",
          value: "123",
        },
      ],
      status: "proposed",
      serviceCategory: {
        coding: [
          {
            system: "http://example.org/service-category",
            code: "gp",
            display: "General Practice",
          },
        ],
      },
      specialty: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "394814009",
            display: "General practice (specialty)",
          },
        ],
      },
      appointmentType: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0276",
            code: "ROUTINE",
            display: "Routine appointment",
          },
        ],
      },
      subject: {
        reference: "Patient/P001",
        display: "John Smith",
      },
      description: "Regular Check-up",
      start: "2024-10-25T09:00:00",
      end: "2024-10-25T09:30:00",
      minutesDuration: 30,
      created: "2024-10-20",
      note: [
        {
          text: "Patient requested morning appointment",
        },
      ],
      participant: [
        {
          actor: {
            reference: "Patient/P001",
            display: "John Smith",
          },
          required: "required",
          status: "accepted",
        },
      ],
    },
  ]);

  const handleCreateAppointment = () => {
    //here
    //setIsNewAppointmentOpen(false);
    //setShowSuccess(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      proposed: "bg-amber-500 text-white",
      pending: "bg-blue-500 text-white",
      booked: "bg-emerald-500 text-white",
      arrived: "bg-teal-500 text-white",
      fulfilled: "bg-purple-500 text-white",
      cancelled: "bg-gray-500 text-white",
      noshow: "bg-red-500 text-white",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const SuccessDialog = () => (
    <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
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
                  <div className="text-left font-medium text-emerald-700">
                    Patient:
                  </div>
                  <div className="text-right text-emerald-600">John Smith</div>

                  <div className="text-left font-medium text-emerald-700">
                    Date:
                  </div>
                  <div className="text-right text-emerald-600">
                    Oct 25, 2024
                  </div>

                  <div className="text-left font-medium text-emerald-700">
                    Time:
                  </div>
                  <div className="text-right text-emerald-600">9:00 AM</div>

                  <div className="text-left font-medium text-emerald-700">
                    Type:
                  </div>
                  <div className="text-right text-emerald-600">Check-up</div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-600">
              A confirmation email has been sent to the patient with the
              appointment details.
            </p>
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format time to HH:MM AM/PM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#007664]">Appointments</h2>
        <Button
          className="bg-[#007664] hover:bg-[#007664]/80"
          onClick={() => setIsNewAppointmentOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          New Appointment
        </Button>
      </div>

      <Card className="bg-[#75C05B]/10">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <Input
                placeholder="Search appointment..."
                className="bg-white pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <AppointmentsTable
          appointments={appointments}
          onDelete={() => {}}
          onEdit={() => {}}
        />
        {/*   <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-[#007664] text-white">ID</TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Patient
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
                    Specialty
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="transition-colors duration-200 hover:bg-green-50"
                  >
                    <TableCell>{appointment.id}</TableCell>
                    <TableCell>{appointment.subject.display}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatDate(appointment.start)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatTime(appointment.start)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {appointment.appointmentType.coding[0].display}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(appointment.status)} shadow-sm`}
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {appointment.specialty.coding[0].display}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#007664] hover:text-[#007664]/80"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-700 hover:text-red-800"
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
        </CardContent> */}
      </Card>

      <CreateNewAppointmentModal
        isNewAppointmentOpen={isNewAppointmentOpen}
        setIsNewAppointmentOpen={setIsNewAppointmentOpen}
      />
      <SuccessDialog />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}></Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      ></AlertDialog>
    </div>
  );
};

export default AppointmentsPage;
