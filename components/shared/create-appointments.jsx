'use client'
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {

  Calendar as Cal,

} from "lucide-react";
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

import { useGetPatients } from "@/hooks/patients.hook";
import { createAuditLogEntry } from "@/components/shared/api";
import { createAppointment, updateAppointment } from "./api";
import { Calendar } from "../events/calendar";
import { fetchPatients } from "./api"
export function CreateNewAppointmentModal({
  isNewAppointmentOpen,
  setIsNewAppointmentOpen,
  selectedAppointment,
  setSelectedAppointment,
  setShowSuccess,
  currentUser,
  callStatusDialog,
}){

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientList, setShowPatientList] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    appointmentType: "ROUTINE",
    specialty: "General Practice",
    status: "scheduled",
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    description: "",
    notes: "",
  });


  const [patients, setPatients] = useState([]);
  const [isOther, setIsOther] = useState(false);


  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (err) {
       // setError(err.message || "Something went wrong");
       console.log(err.message || 'something went wrong')
      } finally {
       // setLoading(false);
      }
    };

    getPatients();
  }, []);


  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        appointmentType: selectedAppointment.appointmentType,
        specialty: selectedAppointment.specialty || "General",
        status: selectedAppointment.status,
        startTime: format(
          new Date(selectedAppointment.startDate),
          "yyyy-MM-dd'T'HH:mm",
        ),
        endTime: format(
          new Date(selectedAppointment.endDate),
          "yyyy-MM-dd'T'HH:mm",
        ),
        description: selectedAppointment.description || "",
        notes: selectedAppointment.notes || "",
      });
      setSelectedPatient({
        id: selectedAppointment.patient,
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
    
      appointmentType: "ROUTINE",
      specialty: "General Practice",
      status: "scheduled",
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
     
  
      description: "",
      notes: "",
    });
  };
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
  
    if (!selectedAppointment) {
      // Validate required fields
      if (!selectedPatient) newErrors.selectedPatient = "Patient is required.";
      if (!formData.appointmentType)
        newErrors.appointmentType = "Appointment type is required.";
      if (!formData.specialty) newErrors.specialty = "Specialty is required.";
      if (!formData.status) newErrors.status = "Status is required.";
      if (!formData.startTime) {
        newErrors.startTime = "Start time is required.";
      }
      if (!formData.endTime) {
        newErrors.endTime = "End time is required.";
      }
  

  
      // Validate start and end time logic
      if (formData.startTime && formData.endTime) {
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);
  
        if (isNaN(start.getTime())) {
          newErrors.startTime = "Start time must be a valid date.";
        }
  
        if (isNaN(end.getTime())) {
          newErrors.endTime = "End time must be a valid date.";
        }
  
        if (!newErrors.startTime && !newErrors.endTime && end <= start) {
          newErrors.endTime = "End time must be after start time.";
        }
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const cleanData = (data) => {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!selectedAppointment && !validateForm()) return;


    const appointmentData = {
      ...formData,
      patient: selectedPatient.id,
      addedBy: currentUser,
    };

    setLoading(true);
    try {
      let response;

      if (selectedAppointment) {
        // Update existing appointment
        const appointmentDataEdit = {
          ...formData,
       
          _id: selectedAppointment._id,
        };

        const filteredAppointmentData = cleanData(appointmentDataEdit);

        // Clean the appointmentData before sending

        // Send the filtered data
        response = await updateAppointment(filteredAppointmentData);

        const auditData = {
          userId: currentUser,
          activityType: "Appointment Update",
          entityId: selectedAppointment._id,
          entityModel: "Appointment",
          details: `Appointment updated successfully`,
        };

        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
        callStatusDialog("success", "Appointment updated successfully");
      } else {
        // Create a new appointment
        response = await createAppointment(appointmentData);

        const auditData = {
          userId: currentUser,
          activityType: "Appointment Creation",
          entityId: response?._id,
          entityModel: "Appointment",
          details: `New appointment created successfully`,
        };

        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully.");
        callStatusDialog("success", "New appointment created successfully");
      }

      setShowSuccess(true);
      handleClose();
    } catch (error) {
      console.error("Failed to submit appointment:", error);
      callStatusDialog("error", "Opertaion Failed");
    }finally {
      setLoading(false); 
    }

  };

  const filteredPatients =
    patients?.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ) || [];

    return (
      isNewAppointmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
   <div className="relative flex h-[95vh] w-full max-w-3xl flex-col rounded-lg bg-white p-6 shadow-lg">
              <button 
       className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
       onClick={handleClose}>
    <X className="size-4" />
  </button>
     <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
       <div className="flex w-full items-center justify-center gap-3 text-2xl font-bold">
         <Cal className="size-7" />
         <span>    {selectedAppointment ? "Edit Appointment" : "New Appointment"}
         </span>
       </div>
     </DialogHeader>
       <div className="grow overflow-auto">
            <div className="mx-2 mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label>Patient <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                placeholder="Search patient by name"
                value={
                  selectedAppointment
                    ? `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
                    : searchTerm
                }
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowPatientList(true);
                }}
                className="focus-visible:ring-teal-700"
                disabled={!!selectedAppointment} // Disable if in edit mode
              />
              {errors.selectedPatient && (
                <p className="text-sm text-red-500">{errors.selectedPatient}</p>
              )}

              {showPatientList && searchTerm && (
                <div className="absolute z-10 mt-1 w-full  rounded-md border bg-white shadow-lg">
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
              <Label>Appointment Type <span className="text-red-500">*</span>

              </Label>
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
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Walkin">Walk-in</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Follow_up">Follow-up Check </SelectItem>
        <SelectItem value="Treatment">Treatment Session</SelectItem>
        <SelectItem value="Evaluation">Progress Evaluation</SelectItem>
        <SelectItem value="Consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
              {errors.appointmentType && (
                <p className="text-sm text-red-500">{errors.appointmentType}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Specialty <span className="text-red-500">*</span></Label>
              <Select
        value={isOther ? 'Other' : formData.specialty}
        onValueChange={(value) => {
          if (value === 'Other') {
            setIsOther(true);
            setFormData((prev) => ({ ...prev, specialty: '' })); // clear to allow typing
          } else {
            setIsOther(false);
            setFormData((prev) => ({ ...prev, specialty: value }));
          }
        }}
      >
        <SelectTrigger className="focus-visible:ring-teal-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="General Practice">General Practice</SelectItem>
          <SelectItem value="Cardiology">Cardiology</SelectItem>
          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      {isOther && (
        <input
          type="text"
          placeholder="Enter specialty"
          className="mt-2 w-full rounded border p-2"
          value={formData.specialty}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, specialty: e.target.value }))
          }
        />
      )}
            </div>
            {errors.specialty && (
              <p className="text-sm text-red-500">{errors.specialty}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status <span className="text-red-500">*</span></Label>
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
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Start Time <span className="text-red-500">*</span></Label>
              <input
  type="datetime-local"
  value={formData.startTime}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      startTime: e.target.value,
    }))
  }
  className="rounded-md border border-gray-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus-visible:ring-teal-700"
/>
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>End Time</Label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-teal-700 focus:outline-none focus-visible:ring-teal-700"
                />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
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


        <div className="mb-0 mt-2 flex flex-col justify-end gap-3 sm:flex-row">
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
            disabled={!selectedPatient || loading}
          >
           {loading 
  ? selectedAppointment 
    ? 'Updating...' 
    : 'Creating...' 
  : selectedAppointment 
    ? 'Update Appointment' 
    : 'Create Appointment'}
    
          </Button>
        </div>
</div>
        </div>
        </div>
      )
    );
    



};


