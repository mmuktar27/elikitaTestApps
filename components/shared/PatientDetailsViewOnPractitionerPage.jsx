"use client";
import React, { useEffect, useState } from "react";

import {
  Calendar,
  Clipboard,
  Edit,
  Eye,
  FileText,
  Pill,
  Plus,
  Share2,
  Sparkles,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
  Video,
} from "lucide-react";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SmartConsultation from "./SmartConsultation";

import Modal from "react-modal";

const PatientDetailsView = ({ patient, onClose, SelectedPatient }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddmOpen, setIsAddmOpen] = useState(false);
  const [isAddDOpen, setIsAddDOpen] = useState(false);
  const [isAddlabOpen, setIsAddlabOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [consult, setConsult] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [med, setMed] = useState(null);

  const [isViewConsultOpen, setIsViewConsultOpen] = useState(false);
  const [isViewDiagOpen, setIsViewDiagOpen] = useState(false);
  const [isViewMedOpen, setIsViewMedOpen] = useState(false);

  const closeModal = () => setIsAddlabOpen(false);

  const closeViewConsultModal = () => setIsViewConsultOpen(false);
  const closeViewMedModal = () => setIsViewMedOpen(false);
  const closeViewDiagnosisModal = () => setIsViewDiagOpen(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth < 400);
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen for resize
    return () => window.removeEventListener("resize", checkScreenWidth); // Cleanup
  }, []);

  const viewlabDetails = (patient) => {
    setResult(patient.labResult);
    setIsAddlabOpen(true);
  };

  const viewConsultDetails = (consult) => {
    setConsult(consult);
    // console.log(consult) ;
    setIsViewConsultOpen(true);
  };
  const viewMedtDetails = (medication) => {
    setMed(medication);
    setIsViewMedOpen(true);
  };
  const viewDiagnosisDetails = (diagnoses) => {
    setDiagnosis(diagnosis);
    setIsViewDiagOpen(true);
  };
  const [refmodalIsOpen, setrefModalIsOpen] = useState(false);
  const [selectedrefOption, setSelectedrefOption] = useState("");
  const [list, setList] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");

  // Open modal handler
  const openrefModal = () => setrefModalIsOpen(true);
  const handleRefChange = (event) => {
    setSelectedRef(event.target.value);
  };
  // Close modal handler
  const closerefModal = () => {
    setrefModalIsOpen(false);
    setSelectedrefOption("");
    setSelectedRef("");
    setList([]);
  };

  // Handle option selection and update list based on selection
  const handleSelectrefChange = (event) => {
    const value = event.target.value;
    setSelectedrefOption(value);

    // Populate the list based on selection
    switch (value) {
      case "doctor":
        setList(doctors);
        break;
      case "labTech":
        setList(labTechnicians);
        break;
      case "pharmacy":
        setList(pharmacies);
        break;
      default:
        setList([]);
        break;
    }
  };
  const handleFormSubmit = async (actionType) => {
    setIsLoading(true);

    setIsLoading(false);
    setIsAddOpen(false);
  };
  const handleDialogChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
    }
    setIsAddOpen(isOpen);
  };
  const handleDialogDChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
    }
    setIsAddDOpen(isOpen);
  };
  const handleDialogmChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
    }
    setIsAddmOpen(isOpen);
  };
  const handleDialoglabChange = (isOpen, actionType) => {
    if (actionType === "add" && isOpen) {
    }
    setIsAddlabOpen(isOpen);
  };

  const handleDialogViewConsult = (isOpen) => {
    setIsViewConsultOpen(isOpen);
  };
  const handleCallClick = () => {};

  const handleDialogViewMed = (isOpen) => {
    setIsViewMedOpen(isOpen);
  };

  const handleDialogViewDiagnosis = (isOpen) => {
    setIsViewDiagOpen(isOpen);
  };
  const startDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = (item) => {
    console.log("Deleting item:", item);
    // Perform delete action here
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteDialog(false);
  };
  const handleEditSubmit = () => {
    // Add logic to update the consultation
    console.log("Updated Consultation:", newConsultation);

    // Close the dialog after submission
    setIsEditOpen(false);
  };
  const startEdit = (consultation) => {
    // Set the state with the consultation data to start editing
    setNewConsultation({
      id: consultation.id,
      patientName: consultation.subject.display,
      status: consultation.status,
      category: consultation.category,
      serviceType: consultation.serviceType,
      occurrenceDateTime: consultation.occurrenceDateTime,
      created: consultation.created,
      description: consultation.description,
      reasonCode: consultation.reasonCode,
      diagnosis: consultation.diagnosis,
      presentedProblem: consultation.presentedProblem,
      summary: consultation.summary,
    });
    // console.log(consultation)

    // Optionally, you may open a dialog or modal here to show the form
    //setDialogOpen(true);
    setIsAddOpen(true);
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
  const LabResultDetailsModal = ({ result, isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lab Result Details</DialogTitle>
          </DialogHeader>
          <Card className="space-y-4">
            {/* Basic Test Information */}
            <CardHeader>
              <CardTitle>Basic Test Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium">Test Name</h4>
                  <p>{result.testName}</p>
                </div>
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p>{result.description}</p>
                </div>
                <div>
                  <h4 className="font-medium">LOINC Code</h4>
                  <p>{result.code}</p>
                </div>
              </div>
            </CardContent>

            {/* Result Value and Reference Ranges */}
            <CardHeader>
              <CardTitle>Result and Reference Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium">Result Value</h4>
                  <p>
                    {result.value} {result.unit}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Reference Range</h4>
                  <p>{result.referenceRange}</p>
                </div>
              </div>
            </CardContent>

            {/* Flags or Alerts */}
            <CardHeader>
              <CardTitle>Interpretive Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="border-b pb-4">{result.flags}</p>
            </CardContent>

            {/* Collection Details */}
            <CardHeader>
              <CardTitle>Collection Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium">Collection Method</h4>
                  <p>{result.collectionMethod}</p>
                </div>
                <div>
                  <h4 className="font-medium">Specimen Type</h4>
                  <p>{result.specimenType}</p>
                </div>
              </div>
            </CardContent>

            {/* Timing and Ordering Information */}
            <CardHeader>
              <CardTitle>Timing and Ordering</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium">Performed Date</h4>
                  <p>{result.performedDate}</p>
                </div>
                <div>
                  <h4 className="font-medium">Ordered By</h4>
                  <p>{result.orderedBy}</p>
                </div>
                <div>
                  <h4 className="font-medium">Performing Lab</h4>
                  <p>{result.performingLab}</p>
                </div>
              </div>
            </CardContent>

            {/* Patient Details */}
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 border-b pb-4">
                <div>
                  <h4 className="font-medium">Name</h4>
                  <p>{result.patientName}</p>
                </div>
                <div>
                  <h4 className="font-medium">DOB</h4>
                  <p>{result.patientDOB}</p>
                </div>
                <div>
                  <h4 className="font-medium">MRN</h4>
                  <p>{result.patientMRN}</p>
                </div>
              </div>
            </CardContent>

            {/* Additional Information */}
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Status</h4>
                  <p>{result.status}</p>
                </div>
                <div>
                  <h4 className="font-medium">Comments</h4>
                  <p>{result.comments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  };

  const [newConsultation, setNewConsultation] = useState({
    id: "", // Unique identifier for the Consultation
    status: "", // Consultation status
    category: [], // Classification of consultation
    serviceType: [], // Type of service provided
    subject: {
      reference: "", // Reference to the patient
      display: "", // Patient's name
    },
    participant: [
      {
        type: [], // Participant type
        individual: {
          reference: "", // Reference to participant
          display: "", // Participant's name
        },
      },
    ],
    occurrenceDateTime: "", // Date/Time of the consultation
    created: "", // Creation date of consultation
    description: "", // Description of consultation
    reasonCode: [], // Codes for the consultation reason
    diagnosis: [], // Diagnosis associated with consultation
    appointment: {
      reference: "", // Reference to the appointment
    },
    period: {
      start: "", // Start date/time of consultation
      end: "", // End date/time of consultation
    },
    location: {
      location: {
        reference: "", // Location reference
        display: "", // Location name
      },
    },
    hospitalization: {
      admitSource: "", // Source of admission
      dischargeDisposition: "", // Disposition at discharge
    },
    totalCost: {
      value: 0, // Total cost of consultation
      currency: "", // Currency
    },
    presentedProblem: [], // Problems presented during consultation
    progress: [], // Progress notes
    summary: "", // High-level summary of consultation
  });

  const ConsultationDetailsModal = ({ consult, isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Consultation Details
            </DialogTitle>
          </DialogHeader>
          <Card className="space-y-6">
            {/* Basic Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">Status</h4>
                  <p className="text-sm md:text-base">{consult.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Category</h4>
                  <p className="text-sm md:text-base">
                    {consult.category.join(", ")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Service Type
                  </h4>
                  <p className="text-sm md:text-base">
                    {consult.serviceType.join(", ")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Patient</h4>
                  <p className="text-sm md:text-base">
                    {consult.subject.display}
                  </p>
                </div>
              </div>
            </CardContent>

            {/* Participant Details */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Participant Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consult.participant.map((participant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2"
                >
                  <div>
                    <h4 className="text-sm font-medium md:text-base">Type</h4>
                    <p className="text-sm md:text-base">
                      {participant.type.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium md:text-base">Name</h4>
                    <p className="text-sm md:text-base">
                      {participant.individual.display}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Timing Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Timing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Occurrence Date/Time
                  </h4>
                  <p className="text-sm md:text-base">
                    {consult.occurrenceDateTime}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Created</h4>
                  <p className="text-sm md:text-base">{consult.created}</p>
                </div>
              </div>
            </CardContent>

            {/* Additional Details */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Reason Code
                  </h4>
                  <p className="text-sm md:text-base">
                    {consult.reasonCode.join(", ")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Diagnosis
                  </h4>
                  <p className="text-sm md:text-base">
                    {consult.diagnosis.join(", ")}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium md:text-base">Summary</h4>
                  <p className="text-sm md:text-base">{consult.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  };

  const [newDiagnosis, setNewDiagnosis] = useState({
    id: "", // Unique identifier for the Diagnosis
    status: "", // Diagnosis status
    category: [], // Classification of diagnosis
    serviceType: [], // Type of service related to diagnosis
    patient: {
      reference: "", // Reference to the patient
      display: "", // Patient's name
    },
    participant: [
      {
        type: [], // Participant type (e.g., doctor, specialist)
        individual: {
          reference: "", // Reference to participant
          display: "", // Participant's name
        },
      },
    ],
    occurrenceDateTime: "", // Date/Time of the diagnosis
    created: "", // Creation date of diagnosis
    description: "", // Description of diagnosis
    reasonCode: [], // Codes for the diagnosis reason
    diagnosisDetails: [], // Specific details of diagnosis
    appointment: {
      reference: "", // Reference to the associated appointment
    },
    period: {
      start: "", // Start date/time of diagnosis
      end: "", // End date/time of diagnosis, if applicable
    },
    location: {
      location: {
        reference: "", // Location reference
        display: "", // Location name
      },
    },
    hospitalization: {
      admitSource: "", // Source of admission
      dischargeDisposition: "", // Disposition at discharge, if relevant
    },
    totalCost: {
      value: 0, // Total cost of diagnosis-related services
      currency: "", // Currency
    },
    presentedProblem: [], // Problems presented leading to diagnosis
    progress: [], // Progress notes related to diagnosis
    summary: "", // High-level summary of diagnosis
  });
  const [newMedication, setNewMedication] = useState({
    medicationDescription: "",
    medicationNote: "",
    medicationCode: "",
    medicationStatus: "active",
    medicationStartDate: "",
    medicationStartTime: "",
    medicationEndDate: "",
    medicationFrequency: {
      type: "daily",
      value: 1,
    },
  });

  const DiagnosisForm = ({ buttonText, onSubmit, diagnosesData }) => {
    const [newDiagnosis, setNewDiagnosis] = useState({
      id: "", // Unique identifier for the Diagnosis
      status: "", // Diagnosis status
      category: [], // Classification of diagnosis
      serviceType: [], // Type of service related to diagnosis
      patient: {
        reference: "", // Reference to the patient
        display: "", // Patient's name
      },
      participant: [
        {
          type: [], // Participant type (e.g., doctor, specialist)
          individual: {
            reference: "", // Reference to participant
            display: "", // Participant's name
          },
        },
      ],
      occurrenceDateTime: "", // Date/Time of the diagnosis
      created: "", // Creation date of diagnosis
      description: "", // Description of diagnosis
      reasonCode: [], // Codes for the diagnosis reason
      diagnosisDetails: [], // Specific details of diagnosis
      appointment: {
        reference: "", // Reference to the associated appointment
      },
      period: {
        start: "", // Start date/time of diagnosis
        end: "", // End date/time of diagnosis, if applicable
      },
      location: {
        reference: "", // Location reference
        display: "", // Location name
      },
      hospitalization: {
        admitSource: "", // Source of admission
        dischargeDisposition: "", // Disposition at discharge, if relevant
      },
      totalCost: {
        value: 0, // Total cost of diagnosis-related services
        currency: "", // Currency
      },
      presentedProblem: [], // Problems presented leading to diagnosis
      progress: [], // Progress notes related to diagnosis
      summary: "", // High-level summary of diagnosis
    });

    // Pre-populate form for editing
    useEffect(() => {
      if (diagnosesData) {
        console.log(diagnosesData);
        setNewDiagnosis({
          id: diagnosesData.id || "",
          patient: {
            reference: diagnosesData.patient?.reference || "",
            display: diagnosesData.patient?.display || "",
          },
          status: diagnosesData.status || "",
          category: diagnosesData.category || [],
          serviceType: diagnosesData.serviceType || [],
          occurrenceDateTime: diagnosesData.occurrenceDateTime || "",
          created: diagnosesData.created || "",
          reasonCode: diagnosesData.reasonCode || [],
          description: diagnosesData.description || "",
          diagnosisDetails: diagnosesData.diagnosisDetails || [],
          appointment: {
            reference: diagnosesData.appointment?.reference || "",
          },
          period: {
            start: diagnosesData.period?.start || "",
            end: diagnosesData.period?.end || "",
          },
          location: {
            reference: diagnosesData.location?.reference || "",
            display: diagnosesData.location?.display || "",
          },
          hospitalization: {
            admitSource: diagnosesData.hospitalization?.admitSource || "",
            dischargeDisposition:
              diagnosesData.hospitalization?.dischargeDisposition || "",
          },
          totalCost: {
            value: diagnosesData.totalCost?.value || 0,
            currency: diagnosesData.totalCost?.currency || "",
          },
          presentedProblem: diagnosesData.presentedProblem || [],
          progress: diagnosesData.progress || [],
          summary: diagnosesData.summary || "",
        });
      }
    }, [diagnosesData]);

    const handleChange = (field, value) => {
      setNewDiagnosis((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Diagnosis ID */}
        <div className="space-y-2">
          <Label htmlFor="id">Diagnosis ID</Label>
          <Input
            id="id"
            placeholder="Diagnosis ID"
            value={newDiagnosis.id}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({ ...prev, id: e.target.value }))
            }
          />
        </div>

        {/* Diagnosis Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Diagnosis Status</Label>
          <Select
            value={newDiagnosis.status}
            onValueChange={(value) =>
              setNewDiagnosis((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Diagnosis Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Patient Information */}
        <div className="space-y-2">
          <Label htmlFor="patientDisplay">Patient Name</Label>
          <Input
            id="patientDisplay"
            placeholder="Patient Name"
            value={newDiagnosis.patient.display}
            onChange={(e) =>
              updateNestedState("patient.display", e.target.value)
            }
          />
        </div>

        {/* Occurrence Date Time */}
        <div className="space-y-2">
          <Label>Occurrence Date</Label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={
              newDiagnosis.occurrenceDateTime
                ? new Date(newDiagnosis.occurrenceDateTime)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              updateNestedState("occurrenceDateTime", e.target.value)
            }
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Diagnosis Description</Label>
          <Textarea
            id="description"
            placeholder="Detailed diagnosis description"
            value={newDiagnosis.description}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="w-full resize-none"
          />
        </div>

        {/* Summary */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="summary">Diagnosis Summary</Label>
          <Textarea
            id="summary"
            placeholder="High-level summary of the diagnosis"
            value={newDiagnosis.summary}
            onChange={(e) =>
              setNewDiagnosis((prev) => ({ ...prev, summary: e.target.value }))
            }
            rows={3}
            className="w-full resize-none"
          />
        </div>

        {/* Location Information */}
        <div className="space-y-2">
          <Label htmlFor="locationDisplay">Location</Label>
          <Input
            id="locationDisplay"
            placeholder="Diagnosis Location"
            value={newDiagnosis.location.display}
            onChange={(e) =>
              updateNestedState("location.display", e.target.value)
            }
          />
        </div>

        {/* Hospitalization Details */}
        <div className="space-y-2">
          <Label htmlFor="admitSource">Admit Source</Label>
          <Input
            id="admitSource"
            placeholder="Admission Source"
            value={newDiagnosis.hospitalization.admitSource}
            onChange={(e) =>
              updateNestedState("hospitalization.admitSource", e.target.value)
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 md:col-span-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(newDiagnosis)}
            disabled={isLoading}
            className="bg-teal-700 text-white hover:bg-teal-800"
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </div>
    );
  };

  const DiagnosisDetailsModal = ({ diagnosis, isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Consultation Details
            </DialogTitle>
          </DialogHeader>
          <Card className="space-y-6">
            {/* Basic Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">Status</h4>
                  <p>{diagnosis.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Category</h4>
                  <p>{diagnosis.category.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Service Type
                  </h4>
                  <p>{diagnosis.serviceType.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Patient</h4>
                  <p>{diagnosis.patient.display}</p>
                </div>
              </div>
            </CardContent>

            {/* Participant Details */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Participant Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnosis.participant.map((participant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2"
                >
                  <div>
                    <h4 className="text-sm font-medium md:text-base">Type</h4>
                    <p>{participant.type.join(", ")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium md:text-base">Name</h4>
                    <p>{participant.individual.display}</p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Timing Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Timing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Occurrence Date/Time
                  </h4>
                  <p>{diagnosis.occurrenceDateTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Created</h4>
                  <p>{diagnosis.created}</p>
                </div>
              </div>
            </CardContent>

            {/* Additional Details */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Reason Code
                  </h4>
                  <p>{diagnosis.reasonCode.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Progress</h4>
                  <p>{diagnosis.progress.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Presented Problem
                  </h4>
                  <p>{diagnosis.presentedProblem}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Presented Problem
                  </h4>
                  <p>{diagnosis.presentedProblem}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium md:text-base">Summary</h4>
                  <p>{diagnosis.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  };

  const MedicationForm = ({ buttonText, onSubmit, medicationData }) => {
    const [newMedication, setNewMedication] = useState({
      medicationDescription: "",
      medicationNote: "",
      medicationCode: [],
      medicationStatus: "active",
      medicationStartDate: "",
      medicationStartTime: "",
      medicationEndDate: "",
      medicationFrequency: {
        type: "daily",
        value: 1,
      },
      dosage: "",
      name: "",
    });

    // Pre-populate form for editing
    useEffect(() => {
      if (medicationData) {
        console.log(medicationData);
        setNewMedication({
          medicationDescription: medicationData.medicationDescription || "",
          medicationNote: medicationData.medicationNote || "",
          medicationCode: medicationData.medicationCode || [],
          medicationStatus: medicationData.medicationStatus || "active",
          medicationStartDate: medicationData.medicationStartDate || "",
          medicationStartTime: medicationData.medicationStartTime || "",
          medicationEndDate: medicationData.medicationEndDate || "",
          medicationFrequency: medicationData.medicationFrequency || {
            type: "daily",
            value: 1,
          },
          dosage: medicationData.dosage || "",
          name: medicationData.name || "",
        });
      }
    }, [medicationData]); // Ensures the effect runs when `medicationData` changes

    const handleChange = (field, value) => {
      setNewMedication((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="medication">Medication ID</Label>
          <Input
            id="medication"
            disabled="disabled"
            placeholder="Medication"
            value="dg-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicationNote">Medication Note</Label>
          <textarea
            id="medicationNote"
            placeholder="Medication Note"
            value={newMedication.medicationNote}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationNote: e.target.value,
              })
            }
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationCode">Condition</Label>
          <Input
            id="medicationCode"
            placeholder="Medication Code"
            value={newMedication.medicationCode}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationCode: e.target.value.split(", "),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationCode">Name</Label>
          <Input
            id="medname"
            placeholder="Medication name"
            value={newMedication.name}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                name: e.target.value.split(", "),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationDosage">Dosage</Label>
          <Input
            id="medicationDosage"
            placeholder="Medication Dosage"
            value={newMedication.dosage}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                dosage: e.target.value.split(", "),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationStatus">Medication Status</Label>
          <Select
            value={newMedication.medicationStatus}
            onValueChange={(value) =>
              setNewMedication({ ...newMedication, medicationStatus: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Medication Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationStartDate">Start Date</Label>
          <Input
            id="medicationStartDate"
            type="date"
            value={newMedication.medicationStartDate}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationStartDate: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationEndDate">End Date</Label>
          <Input
            id="medicationEndDate"
            type="date"
            value={newMedication.medicationEndDate}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationEndDate: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationStartTime">Start Time</Label>
          <Input
            id="medicationStartTime"
            type="time"
            value={newMedication.medicationStartTime}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationStartTime: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationDescription">Medication</Label>
          <textarea
            id="medicationDescription"
            placeholder="Medication Description"
            value={newMedication.medicationDescription}
            onChange={(e) =>
              setNewMedication({
                ...newMedication,
                medicationDescription: e.target.value,
              })
            }
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicationFrequencyType">Frequency Type</Label>
          <Select
            value={newMedication.medicationFrequency.type}
            onValueChange={(value) =>
              setNewMedication({
                ...newMedication,
                medicationFrequency: {
                  ...newMedication.medicationFrequency,
                  type: value,
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Frequency Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {newMedication.medicationFrequency.type === "daily" && (
          <div className="space-y-2">
            <Label htmlFor="medicationFrequencyValue">Frequency Value</Label>
            <Input
              id="medicationFrequencyValue"
              type="number"
              value={newMedication.medicationFrequency.value}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  setNewMedication({
                    ...newMedication,
                    medicationFrequency: {
                      ...newMedication.medicationFrequency,
                      value,
                    },
                  });
                }
              }}
            />
          </div>
        )}

        <div className="col-span-1 mt-4 flex justify-end space-x-2 md:col-span-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-teal-700 text-white hover:bg-teal-800"
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </div>
    );
  };

  const MedicationDetailsModal = ({ medic, isOpen, onClose }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Medication Details
            </DialogTitle>
          </DialogHeader>
          <Card className="space-y-6">
            {/* Basic Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Medication Name
                  </h4>
                  <p>{medic.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">Dosage</h4>
                  <p>{medic.dosage}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Frequency
                  </h4>
                  <p>{medic.frequency}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Start Date
                  </h4>
                  <p>{medic.startDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">End Date</h4>
                  <p>{medic.endDate}</p>
                </div>
              </div>
            </CardContent>

            {/* Additional Information */}
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Medication Status
                  </h4>
                  <p>{medic.medicationStatus}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Medication Description
                  </h4>
                  <p>{medic.medicationDescription}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Medication Frequency Type
                  </h4>
                  <p>{medic.medicationFrequency.type}</p>
                </div>
                {medic.medicationFrequency.type === "daily" && (
                  <div>
                    <h4 className="text-sm font-medium md:text-base">
                      Frequency Value
                    </h4>
                    <p>{medic.medicationFrequency.value} times per day</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium md:text-base">
                    Start Time
                  </h4>
                  <p>{medic.medicationStartTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  };

  const doctors = [
    { id: 1, name: "Dr. Alice" },
    { id: 2, name: "Dr. Bob" },
  ];
  const labTechnicians = [
    { id: 1, name: "Tech Anne" },
    { id: 2, name: "Tech Max" },
  ];
  const pharmacies = [
    { id: 1, name: "Pharmacy A" },
    { id: 2, name: "Pharmacy B" },
  ];

  const ConsultationForm = ({ buttonText, onSubmit, consultationData }) => {
    const [newConsultation, setNewConsultation] = useState({
      id: "",
      patientName: "",
      status: "",
      category: [],
      serviceType: "",
      occurrenceDateTime: "",
      created: "",
      reasonCode: [],
      diagnosis: [],
      summary: "",
      participant: [], // Ensure participant data is included if needed
    });

    // Pre-populate form for editing
    useEffect(() => {
      if (consultationData) {
        console.log(consultationData);
        setNewConsultation({
          id: consultationData.id || "",
          patientName: consultationData.subject?.display || "",
          status: consultationData.status || "",
          category: consultationData.category || [],
          serviceType: consultationData.serviceType?.[0] || "",
          occurrenceDateTime: consultationData.occurrenceDateTime || "",
          created: consultationData.created || "",
          reasonCode: consultationData.reasonCode || [],
          diagnosis: consultationData.diagnosis || [],
          summary: consultationData.summary || "",
          participant: consultationData.participant || [], // Include participant info if required
        });
      }
    }, [consultationData]);

    const handleChange = (field, value) => {
      setNewConsultation((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(newConsultation);
    };
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="id">Consultation ID</Label>
          <Input
            disabled="disabled"
            id="id"
            placeholder="Consultation ID"
            value={newConsultation.id}
            onChange={(e) => handleChange("id", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            placeholder="Patient Name"
            value={newConsultation.patientName}
            disabled="disabled"
            onChange={(e) => handleChange("patientName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={newConsultation.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress">In-Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={newConsultation.category.join(", ")}
            onValueChange={(value) =>
              handleChange("category", value.split(", "))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="new-patient">New Patient</SelectItem>
              <SelectItem value="annual-checkup">Annual Checkup</SelectItem>
              <SelectItem value="specialist-consultation">
                Specialist Consultation
              </SelectItem>
              <SelectItem value="emergency-visit">Emergency Visit</SelectItem>
              <SelectItem value="routine-care">Routine Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            value={newConsultation.serviceType}
            onValueChange={(value) => handleChange("serviceType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
              <SelectItem value="mental-health-counseling">
                Mental Health Counseling
              </SelectItem>
              <SelectItem value="primary-care">Primary Care</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occurrenceDateTime">Consultation Date/Time</Label>
          <Input
            id="occurrenceDateTime"
            type="datetime-local"
            value={newConsultation.occurrenceDateTime}
            onChange={(e) => handleChange("occurrenceDateTime", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="created">Created Date/Time</Label>
          <Input
            id="created"
            type="datetime-local"
            value={newConsultation.created}
            onChange={(e) => handleChange("created", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Description"
            value={newConsultation.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reasonCode">Reason Code</Label>
          <Select
            value={newConsultation.reasonCode}
            onValueChange={(value) => handleChange("reasonCode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Reason Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chronic-condition">
                Chronic Condition
              </SelectItem>
              <SelectItem value="mental-health-counseling">
                Mental Health Counseling
              </SelectItem>
              <SelectItem value="acute-illness">Acute Illness</SelectItem>
              <SelectItem value="preventive-care">Preventive Care</SelectItem>
              <SelectItem value="post-op-follow-up">
                Post-op Follow-up
              </SelectItem>
              <SelectItem value="injury">Injury</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Input
            id="diagnosis"
            placeholder="Diagnosis"
            value={newConsultation.diagnosis.join(", ")}
            onChange={(e) =>
              handleChange("diagnosis", e.target.value.split(", "))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="presentedProblem">Presented Problem</Label>
          <Input
            id="presentedProblem"
            placeholder="Presented Problem"
            value={newConsultation.presentedProblem}
            onChange={(e) =>
              handleChange("presentedProblem", e.target.value.split(", "))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <textarea
            id="summary"
            placeholder="Summary"
            value={newConsultation.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={4}
            className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1 mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(newConsultation)}
            disabled={isLoading}
            className="bg-teal-700 text-white hover:bg-teal-800"
          >
            {isLoading ? "Submitting..." : buttonText}
          </Button>
        </div>
      </div>
    );
  };
  const visitHistory = [
    {
      date: "April 15, 2023",
      doctor: "Dr. Jane Doe",
      purpose: "Annual Checkup",
    },
    {
      date: "June 2, 2023",
      doctor: "Dr. John Smith",
      purpose: "Follow-up Appointment",
    },
    {
      date: "August 20, 2023",
      doctor: "Dr. Sarah Lee",
      purpose: "Flu Vaccination",
    },
    {
      date: "October 10, 2023",
      doctor: "Dr. David Kim",
      purpose: "Routine Blood Work",
    },
    {
      date: "December 5, 2023",
      doctor: "Dr. Emily Chen",
      purpose: "Medication Review",
    },
  ];
  const startSmartConsult = () => {
    // Set the selected user for the call
    ///setSelectedUser(patient);
    // Switch to the callsetup tab
    if (activeTab === "summary") {
      setActiveTab("smartconsult");
    } else {
      setActiveTab("summary");
    }
  };
  return (
    <div>
      {activeTab === "summary" && (
        <div className="flex items-center justify-between">
          <Card
            className="w-full bg-[#75C05B]/10"
            style={{
              width: isMobile ? "100vw" : "80vw", // Full width only on mobile
              margin: "0",
              padding: "0",
            }}
          >
            <h2 className="text-2xl font-bold text-[#007664]"> </h2>
            <CardHeader className="flex flex-row items-center justify-between space-x-4">
              {/* Patient Info */}
              <div className="grow">
                <CardTitle className="text-2xl font-bold text-[#007664]">
                  {SelectedPatient.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  ID: {SelectedPatient.patientReference} • DOB:{" "}
                  {new Date(SelectedPatient.birthDate).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-teal-800 hover:bg-teal-800/10"
                  onClick={handleCallClick}
                >
                  <Video className="size-4 text-teal-800" />
                </Button>

                <Button
                  className="flex w-full items-center gap-2 bg-[#007664] text-white hover:bg-[#007664]/80 sm:w-auto"
                  onClick={openrefModal}
                >
                  <Share2 className="size-4" />
                  <span>Refer Patient</span>
                </Button>
              </div>
            </CardHeader>
            {/* Modal for selection */}
            <Modal isOpen={refmodalIsOpen} onRequestClose={closerefModal}>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-[#007664]">
                  Select Referral Type
                </h2>
                <select
                  value={selectedrefOption}
                  onChange={handleSelectrefChange}
                  className="mb-4 w-full rounded-md border border-[#75C05B] p-2"
                >
                  <option value="">Select an option</option>
                  <option value="doctor">Doctor</option>
                  <option value="labTech">Lab Technician</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
                {/* Display the list based on selected option */}
                {selectedrefOption && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium text-[#007664]">
                      {`Select ${
                        selectedrefOption === "doctor"
                          ? "Referring Doctor"
                          : selectedrefOption === "labTech"
                            ? "Lab Technician"
                            : "Pharmacy"
                      }`}
                    </h3>
                    <select
                      value={selectedRef}
                      onChange={handleRefChange}
                      className="mb-4 w-full rounded-md border border-[#75C05B] p-2"
                    >
                      <option value="">Select {selectedrefOption}</option>
                      {list.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {selectedrefOption === "doctor" && (
                      <div className="mb-4">
                        <label
                          htmlFor="referralReason"
                          className="mb-2 block font-medium text-[#007664]"
                        >
                          Referral Reason:
                        </label>
                        <input
                          type="text"
                          id="referralReason"
                          name="referralReason"
                          placeholder="Enter the reason for the referral"
                          className="w-full rounded-md border border-[#75C05B] p-2"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  {/* Button to close modal */}
                  <button
                    onClick={closerefModal}
                    className="mr-2 rounded-md bg-[#B24531] px-4 py-2 text-white hover:bg-[#a13d2a]"
                  >
                    Close
                  </button>
                  {/* Submit button */}
                  <button className="rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#00654f]">
                    Submit
                  </button>
                </div>
              </div>
            </Modal>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-2 gap-4 sm:mb-6 sm:grid-cols-2 md:grid-cols-5">
                  <TabsTrigger
                    value="summary"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <FileText className="size-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="consultations"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Stethoscope className="size-4" />
                    Consultations
                  </TabsTrigger>
                  <TabsTrigger
                    value="diagnoses"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <FileText className="size-4" />
                    Diagnoses
                  </TabsTrigger>
                  <TabsTrigger
                    value="labresult"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Thermometer className="size-4" />
                    Lab Result
                  </TabsTrigger>
                  <TabsTrigger
                    value="medications"
                    className="flex items-center gap-2 text-[#007664] hover:bg-[#007664]/20"
                  >
                    <Pill className="size-4" />
                    Medications
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="summary"
                  className="mt-32 sm:mt-6"
                  style={{
                    width: isMobile ? "75vw" : "70vw", // Full width only on mobile
                    margin: "6",
                    padding: "0",
                  }}
                >
                  <div className="space-y-6">
                    {/* Top row with Demographics, Vitals, and Call Button */}
                    <div className="mo:mt-32 relative grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Card className="bg-[#75C05B]/10">
                        <CardHeader className=" text-center">
                          <CardTitle className="text-center text-lg text-[#007664]">
                            Demographics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4 text-center">
                            <div>
                              <dt className="font-medium">Gender</dt>
                              <dd>{SelectedPatient.gender}</dd>
                            </div>
                            <div>
                              <dt className="font-medium">Phone</dt>
                              <dd>{SelectedPatient.phone}</dd>
                            </div>
                            <div className="w-full overflow-hidden break-words">
                              <dt className="font-medium">Email</dt>
                              <dd className="text-sm text-gray-700">
                                {SelectedPatient.email}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium">Address</dt>
                              <dd>{SelectedPatient.address}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#75C05B]/10">
                        <CardHeader>
                          <CardTitle className="text-center text-lg text-[#007664]">
                            Latest Vitals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4 text-center">
                            <div>
                              <dt className="font-medium">Blood Pressure</dt>
                              <dd>
                                {SelectedPatient.vitals?.bloodPressure || "N/A"}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium">Heart Rate</dt>
                              <dd>
                                {SelectedPatient.vitals?.heartRate || "N/A"} bpm
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium">Temperature</dt>
                              <dd>
                                {SelectedPatient.vitals?.temperature || "N/A"}{" "}
                                °C
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Visit History Section */}
                    <div className="mx-auto rounded-lg bg-[#F7F7F7] p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <h2 className="mb-4 text-center text-2xl font-bold text-[#007664]">
                          Patient Visit History
                        </h2>
                        {visitHistory.map((visit, index) => (
                          <div
                            key={index}
                            className="flex w-full items-center border-b border-[#007664] pb-4"
                          >
                            <div className="mr-4">
                              <Calendar className="size-4 text-[#007664]" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-[#007664]">
                                {visit.date}
                              </div>
                              <div className="flex items-center text-sm text-[#B24531]">
                                <User className="mr-2 size-4 text-[#B24531]" />{" "}
                                {visit.doctor}
                              </div>
                              <div className="flex items-center text-sm text-[#B24531]">
                                <Clipboard className="mr-2 size-4 text-[#B24531]" />{" "}
                                {visit.purpose}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="consultations" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex flex-col justify-between sm:flex-row">
                    <h3 className="mb-4 text-lg font-semibold text-[#007664] sm:mb-0">
                      Recent Consultations
                    </h3>
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-x-4">
                      <Dialog
                        open={isAddOpen}
                        onOpenChange={(isOpen) =>
                          handleDialogChange(isOpen, "add")
                        }
                      >
                        <DialogTrigger asChild>
                          <Button className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto">
                            <Plus className="size-4" />
                            New Consultation
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>New Consultation</DialogTitle>
                          </DialogHeader>

                          <ConsultationForm
                            buttonText="Submit Consultation"
                            onSubmit={() => handleFormSubmit("add")}
                            isLoading={isLoading}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button
                        className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto"
                        onClick={startSmartConsult}
                      >
                        <Sparkles className="size-4" />
                        Start Smart Consultation
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg  border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Doctor</th>
                          <th className="px-4 py-2 text-left">Reason</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.consultations?.map((consultation) => {
                          // Extract the doctor from the participants
                          const doctor = consultation.participant?.find((p) =>
                            p.type.includes("Doctor"),
                          );
                          const formattedDate = new Date(consultation.created)
                            .toISOString()
                            .split("T")[0];
                          return (
                            <tr key={consultation.id}>
                              <td className="px-4 py-2">{formattedDate}</td>
                              <td className="px-4 py-2">
                                {doctor?.individual?.display || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {consultation.reasonCode}
                              </td>
                              <td className="px-4 py-2">
                                {consultation.status}
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => viewConsultDetails(patient)}
                                  >
                                    <Eye className="size-4" />
                                  </Button>
                                  <Dialog
                                    open={isViewConsultOpen}
                                    onOpenChange={(isOpen) =>
                                      handleDialogViewConsult(isOpen)
                                    }
                                  >
                                    <DialogTrigger asChild></DialogTrigger>

                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Consultation Details
                                        </DialogTitle>
                                      </DialogHeader>

                                      <ConsultationDetailsModal
                                        consult={consultation}
                                        isOpen={isViewConsultOpen}
                                        onClose={closeViewConsultModal}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Dialog
                                    open={isEditOpen}
                                    onOpenChange={(isOpen) =>
                                      setIsEditOpen(isOpen)
                                    } // Control dialog state
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#007664] hover:text-[#007664]/80"
                                      >
                                        <Edit className="size-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Consultation
                                        </DialogTitle>
                                      </DialogHeader>

                                      {/* Render the consultation form pre-filled for editing */}
                                      <ConsultationForm
                                        buttonText="Update"
                                        onSubmit={handleEditSubmit} // Handle form submission for edits
                                        consultationData={consultation}
                                      />
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-700 hover:text-red-800"
                                    onClick={() => startDelete(consultation)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="diagnoses" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Diagnoses History
                    </h3>
                    <Dialog
                      open={isAddDOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogDChange(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#007664] hover:bg-[#007664]/80">
                          <Plus className="size-4" />
                          New Diagnosis
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>New Diagnose</DialogTitle>
                        </DialogHeader>

                        <DiagnosisForm
                          buttonText="Submit Diagnose"
                          onSubmit={() => handleFormSubmit("add")}
                          isLoading={isLoading}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Condition</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Doctor</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.diagnoses?.map((diagnosis) => (
                          <tr key={diagnosis.id}>
                            <td className="px-4 py-2">{diagnosis.created}</td>
                            <td className="px-4 py-2">{diagnosis.condition}</td>
                            <td className="px-4 py-2">{diagnosis.status}</td>
                            <td className="px-4 py-2">{diagnosis.doctor}</td>
                            <td className="px-4 py-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() =>
                                    viewDiagnosisDetails(diagnosis)
                                  }
                                >
                                  <Eye className="size-4" />
                                </Button>
                                <Dialog
                                  open={isViewDiagOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialogViewDiagnosis(isOpen)
                                  }
                                >
                                  <DialogTrigger asChild></DialogTrigger>

                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Diagnosis Details
                                      </DialogTitle>
                                    </DialogHeader>

                                    <DiagnosisDetailsModal
                                      diagnosis={diagnosis}
                                      isOpen={isViewDiagOpen}
                                      onClose={closeViewDiagnosisModal}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Dialog
                                  open={isEditOpen}
                                  onOpenChange={(isOpen) =>
                                    setIsEditOpen(isOpen)
                                  } // Control dialog state
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-[#007664] hover:text-[#007664]/80"
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Diagnosis</DialogTitle>
                                    </DialogHeader>

                                    {/* Render the consultation form pre-filled for editing */}
                                    <DiagnosisForm
                                      buttonText="Update"
                                      onSubmit={handleEditSubmit} // Handle form submission for edits
                                      diagnosesData={diagnosis}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-700 hover:text-red-800"
                                  onClick={() => startDelete(diagnosis)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="labresult" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Lab Results
                    </h3>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Code</th>
                          <th className="px-4 py-2 text-left">Value</th>
                          <th className="px-4 py-2 text-left">Unit</th>
                          <th className="px-4 py-2 text-left">
                            Performed Date
                          </th>
                          <th className="px-4 py-2 text-left">Ordered By</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.labResults?.map((result) => (
                          <tr key={result.id}>
                            <td className="px-4 py-2">{result.code}</td>
                            <td className="px-4 py-2">{result.value}</td>
                            <td className="px-4 py-2">{result.unit}</td>
                            <td className="px-4 py-2">
                              {result.performedDate}
                            </td>
                            <td className="px-4 py-2">{result.orderedBy}</td>
                            <td>
                              <div className="flex space-x-2">
                                <Dialog
                                  open={isAddlabOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialoglabChange(isOpen, "add")
                                  }
                                >
                                  <DialogTrigger asChild></DialogTrigger>

                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Lab Result</DialogTitle>
                                    </DialogHeader>

                                    <LabResultDetailsModal
                                      result={result}
                                      isOpen={isAddlabOpen}
                                      onClose={closeModal}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => viewlabDetails(patient)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-32 sm:mt-6">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold text-[#007664]">
                      Recent Medications
                    </h3>
                    <Dialog
                      open={isAddmOpen}
                      onOpenChange={(isOpen) =>
                        handleDialogmChange(isOpen, "add")
                      }
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#007664] hover:bg-[#007664]/80">
                          <Plus className="size-4" />
                          Add Medication
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>New Medication</DialogTitle>
                        </DialogHeader>

                        <MedicationForm
                          buttonText="Submit Consultation"
                          onSubmit={() => handleFormSubmit("add")}
                          isLoading={isLoading}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-[#007664] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Medication</th>
                          <th className="px-4 py-2 text-left">Dosage</th>
                          <th className="px-4 py-2 text-left">Frequency</th>
                          <th className="px-4 py-2 text-left">Start Date</th>
                          <th className="px-4 py-2 text-left">End Date</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {SelectedPatient.medications?.map((medication) => (
                          <tr key={medication.id}>
                            <td className="px-4 py-2">{medication.name}</td>
                            <td className="px-4 py-2">{medication.dosage}</td>
                            <td className="px-4 py-2">
                              {medication.frequency}
                            </td>
                            <td className="px-4 py-2">
                              {medication.startDate}
                            </td>
                            <td className="px-4 py-2">2024-01-11</td>
                            <td>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => viewMedtDetails(medication)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                                <Dialog
                                  open={isViewMedOpen}
                                  onOpenChange={(isOpen) =>
                                    handleDialogViewMed(isOpen)
                                  }
                                >
                                  <DialogTrigger asChild></DialogTrigger>

                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Medication Details
                                      </DialogTitle>
                                    </DialogHeader>

                                    <MedicationDetailsModal
                                      medic={medication}
                                      isOpen={isViewMedOpen}
                                      onClose={closeViewMedModal}
                                    />
                                  </DialogContent>
                                </Dialog>

                                <Dialog
                                  open={isEditOpen}
                                  onOpenChange={(isOpen) =>
                                    setIsEditOpen(isOpen)
                                  } // Control dialog state
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-[#007664] hover:text-[#007664]/80"
                                    >
                                      <Edit className="size-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Medication</DialogTitle>
                                    </DialogHeader>

                                    {/* Render the consultation form pre-filled for editing */}
                                    <MedicationForm
                                      buttonText="Update"
                                      onSubmit={handleEditSubmit} // Handle form submission for edits
                                      medicationData={medication}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-700 hover:text-red-800"
                                  onClick={() => startDelete(medication)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <ConfirmationDialog
            show={showDeleteDialog}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            item={itemToDelete}
          />
        </div>
      )}
      {activeTab === "smartconsult" && (
        <SmartConsultation patientData={SelectedPatient} />
      )}
    </div>
  );
};

export default PatientDetailsView;
