import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks/appointment.hook";
import { useGetPatients } from "@/hooks/patients.hook";
import {createAuditLogEntry} from "@/components/shared/api"

const CreateNewAppointmentModal = ({
  isNewAppointmentOpen,
  setIsNewAppointmentOpen,
  selectedAppointment,
  setSelectedAppointment,
  setShowSuccess,
  currentUser,
}) => {
  const { data: patients } = useGetPatients();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    patientReference: "",
    appointmentType: "ROUTINE",
    specialty: "394814009",
    status: "scheduled",
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: 30,
    description: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        patientReference: selectedAppointment.patientReference,
        appointmentType: selectedAppointment.appointmentType,
        specialty: selectedAppointment.specialty || "394814009",
        status: selectedAppointment.status,
        startTime: format(
          new Date(selectedAppointment.startDate),
          "yyyy-MM-dd'T'HH:mm",
        ),
        duration: selectedAppointment.duration || 30,
        description: selectedAppointment.description || "",
        notes: selectedAppointment.notes || "",
      });
      setSelectedPatient({
        id: selectedAppointment.patientReference,
        name: `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`,
        reference: selectedAppointment.patient.patientReference,
      });
    }
  }, [selectedAppointment]);

  const handleClose = () => {
    setIsNewAppointmentOpen(false);
    setSelectedAppointment(null);
    setSelectedPatient(null);
    setSearchTerm("");
    setFormData({
      patientReference: "",
      appointmentType: "ROUTINE",
      specialty: "394814009",
      status: "scheduled",
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      duration: 30,
      description: "",
      notes: "",
    });
  };

  const handleSubmit = async () => {
    const appointmentData = {
      ...formData,
      patientReference: selectedPatient.id,
    };
  
    if (selectedAppointment) {
      updateAppointment.mutate(
        { id: selectedAppointment._id, data: appointmentData },
        {
          onSuccess: async () => {
            setShowSuccess(true);
            handleClose();
  
            const auditData = {
              userId: currentUser?.id, // Ensure currentUser is available in scope
              activityType: "Appointment Update",
              entityId: selectedAppointment._id,
              entityModel: "Appointment",
              details: `Appointment updated successfully`,
            };
  
            try {
              await createAuditLogEntry(auditData);
              console.log("Audit log created successfully.");
            } catch (auditError) {
              console.error("Audit log failed:", auditError);
            }
          },
        }
      );
    } else {
      createAppointment.mutate(appointmentData, {
        onSuccess: async (newAppointment) => {
          setShowSuccess(true);
          handleClose();
  
          const auditData = {
            userId: currentUser?.id,
            activityType: "Appointment Creation",
            entityId: newAppointment?._id,
            entityModel: "Appointment",
            details: `New appointment created successfully`,
          };
  
          try {
            await createAuditLogEntry(auditData);
            console.log("Audit log created successfully.");
          } catch (auditError) {
            console.error("Audit log failed:", auditError);
          }
        },
      });
    }
  };
  
  const filteredPatients =
    patients?.data?.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto p-4 md:p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-teal-700 md:text-2xl">
            {selectedAppointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
          <Button variant="ghost" className="size-8 p-0" onClick={handleClose}>
            <X className="size-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label>Patient</Label>
            <div className="relative">
              <Input
                placeholder="Search patient by name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowPatientList(true);
                }}
                className="focus-visible:ring-teal-700"
              />
              {showPatientList && searchTerm && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-lg">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="cursor-pointer p-2 hover:bg-teal-50"
                      onClick={() => {
                        setSelectedPatient({
                          id: patient._id,
                          name: `${patient.firstName} ${patient.lastName}`,
                          reference: patient.patientReference,
                        });
                        setSearchTerm(
                          `${patient.firstName} ${patient.lastName}`,
                        );
                        setShowPatientList(false);
                      }}
                    >
                      <div className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Ref: {patient.patientReference}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Appointment Type</Label>
              <Select
                value={formData.appointmentType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, appointmentType: value }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROUTINE">Routine</SelectItem>
                  <SelectItem value="WALKIN">Walk-in</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Specialty</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, specialty: value }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="394814009">General Practice</SelectItem>
                  <SelectItem value="394582007">Cardiology</SelectItem>
                  <SelectItem value="394539006">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="focus-visible:ring-teal-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No-show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="focus-visible:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              placeholder="Brief description of appointment"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="focus-visible:ring-teal-700"
            />
          </div>

          <div className="grid gap-2">
            <Label>Clinical Notes</Label>
            <Textarea
              placeholder="Additional notes about the appointment"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="min-h-[100px] focus-visible:ring-teal-700"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-teal-700 text-white hover:bg-teal-800 sm:w-auto"
            onClick={handleSubmit}
            disabled={!selectedPatient}
          >
            {selectedAppointment ? "Update" : "Create"} Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewAppointmentModal;
