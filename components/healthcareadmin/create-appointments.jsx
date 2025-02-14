import { useState } from "react";
import { useCreateAppointment } from "@/hooks/appointment.hook";
import { useGetPatients } from "@/hooks/patients.hook";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreateNewAppointmentModal = ({
  isNewAppointmentOpen,
  setIsNewAppointmentOpen,
}) => {
  const [appointmentData, setAppointmentData] = useState({
    patientReference: "",
    appointmentType: "",
    specialty: "",
    status: "",
    startTime: "",
    duration: 30,
    description: "",
    notes: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const { data: patients } = useGetPatients();

  const createAppointment = useCreateAppointment();

  const handleCreateAppointment = () => {
    createAppointment.mutate(appointmentData, {
      onSuccess: () => {
        setIsNewAppointmentOpen(false);
        setAppointmentData({
          patientReference: "",
          appointmentType: "",
          specialty: "",
          status: "",
          startTime: "",
          duration: 30,
          description: "",
          notes: "",
        });
      },
    });
  };

  const filteredPatients = (patients?.data ?? []).filter((patient) =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto p-4 md:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-teal-700 md:text-2xl">
            New Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Patient Search and Select */}
          <div className="grid gap-2">
            <Label htmlFor="patientSearch">Search Patient</Label>
            <Input
              id="patientSearch"
              placeholder="Type patient name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-teal-700"
            />
            {filteredPatients &&
              filteredPatients.length > 0 &&
              searchTerm.length > 0 && (
                <ul className="mt-2 max-h-[150px] overflow-y-auto border border-gray-300 bg-white p-2">
                  {filteredPatients.map((patient) => (
                    <li
                      key={patient?.patientReference}
                      className="cursor-pointer p-2 hover:bg-teal-100"
                      onClick={() => {
                        setAppointmentData((prev) => ({
                          ...prev,
                          patientReference: patient?._id,
                        }));
                        setSearchTerm(patient.firstName);
                      }}
                    >
                      {`${patient?.firstName} ${patient?.lastName}`} (
                      {patient?.patientReference})
                    </li>
                  ))}
                </ul>
              )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select
                onValueChange={(value) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    appointmentType: value,
                  }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  <SelectItem value="ROUTINE">Routine</SelectItem>
                  <SelectItem value="WALKIN">Walk-in</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                onValueChange={(value) =>
                  setAppointmentData((prev) => ({ ...prev, specialty: value }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  <SelectItem value="394814009">General Practice</SelectItem>
                  <SelectItem value="394582007">Cardiology</SelectItem>
                  <SelectItem value="394539006">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setAppointmentData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No-show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={appointmentData.startTime}
                onChange={(e) =>
                  setAppointmentData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="focus-visible:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of appointment"
              value={appointmentData.description}
              onChange={(e) =>
                setAppointmentData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="focus-visible:ring-teal-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the appointment"
              value={appointmentData.notes}
              onChange={(e) =>
                setAppointmentData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="min-h-[100px] focus-visible:ring-teal-700"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsNewAppointmentOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-teal-700 text-white hover:bg-teal-800 sm:w-auto"
            onClick={handleCreateAppointment}
          >
            Create Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewAppointmentModal;
