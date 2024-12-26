"use client";
import { Check, Edit, Filter, Search, Trash2, UserPlus,   Eye } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Button 
} from '@/components/ui/button';
const Patients = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      identifier: "PT001",
      name: "Alice Brown",
      birthDate: "1988-05-15",
      gender: "female",
      address: "123 Main St",
      phone: "(555) 123-4567",
      email: "alice@email.com",
      condition: "Hypertension",
      status: "active",
      progress: "Stable",
      language: "English",
      maritalStatus: "Married",
      emergencyContact: "John Brown",
      insuranceProvider: "HealthCare Plus",
    },
  ]);
  const [openviewpatient, setOpenviewpatient] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const emptyPatient = {
    identifier: "",
    name: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    condition: "",
    status: "active",
    progress: "",
    language: "",
    maritalStatus: "",
    emergencyContact: "",
    insuranceProvider: "",
  };

  const [newPatient, setNewPatient] = useState(emptyPatient);


  const PatientDialog = ({ patientData }) => {
  const patientDetails = [
    { label: "Patient ID", value: patientData.identifier },
    { label: "Full Name", value: patientData.name },
    { label: "Birth Date", value: patientData.birthDate },
    { label: "Gender", value: patientData.gender },
    { label: "Address", value: patientData.address },
    { label: "Phone", value: patientData.phone },
    { label: "Email", value: patientData.email },
    { label: "Medical Condition", value: patientData.condition },
    { label: "Progress", value: patientData.progress },
    { label: "Preferred Language", value: patientData.language },
    { label: "Marital Status", value: patientData.maritalStatus },
    { label: "Emergency Contact", value: patientData.emergencyContact },
    { label: "Insurance Provider", value: patientData.insuranceProvider }
  ];

  return (
    
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {patientDetails.map((detail, index) => (
      <div key={index}>
        <strong className="block text-sm font-medium text-gray-700 mb-1">
          {detail.label}:
        </strong>
        <span className="text-gray-900">
          {detail.value || "N/A"}
        </span>
      </div>
    ))}
  </div>
  
     
  );}

  const resetDialogStates = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsLoading(false);
    setNewPatient(emptyPatient);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetDialogStates();
  };

  const handleSubmit = async (type) => {
    setIsLoading(true);

    setTimeout(() => {
      if (type === "add") {
        setPatients([
          ...patients,
          {
            id: patients.length + 1,
            ...newPatient,
          },
        ]);
      } else if (type === "edit") {
        setPatients(
          patients.map((p) => (p.id === selectedPatient.id ? newPatient : p)),
        );
        setSelectedPatient(null);
      }

      setShowSuccess(true);
      setIsLoading(false);
    }, 1000);
  };

  const startDelete = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setPatients(patients.filter((p) => p.id !== patientToDelete.id));
    setIsDeleteOpen(false);
    setPatientToDelete(null);
  };

  const startEdit = (patient) => {
    setSelectedPatient(patient);
    setNewPatient(patient);
    setIsEditOpen(true);
  };

  const handleDialogChange = (isOpen, type) => {
    if (type === "add") {
      setIsAddOpen(isOpen);
    } else if (type === "edit") {
      setIsEditOpen(isOpen);
    }

    if (!isOpen) {
      setNewPatient(emptyPatient);
      setIsLoading(false);
    }
  };
  const viewDetails = (patient) => {
    setSelectedPatient(patient);
    setOpenviewpatient(true);
   // console.log(selectedPatient)
  };

  const PatientForm = ({ buttonText, onSubmit }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-gray-700"
        >
          Patient ID
        </label>
        <input
          id="identifier"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Patient ID"
          value="PT097"
          disabled
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Full Name"
          value={newPatient.name}
          onChange={(e) =>
            setNewPatient({ ...newPatient, name: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium text-gray-700"
        >
          Birth Date
        </label>
        <input
          id="birthDate"
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          value={newPatient.birthDate}
          onChange={(e) =>
            setNewPatient({ ...newPatient, birthDate: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          value={newPatient.gender}
          onChange={(e) =>
            setNewPatient({ ...newPatient, gender: e.target.value })
          }
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          id="address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Address"
          value={newPatient.address}
          onChange={(e) =>
            setNewPatient({ ...newPatient, address: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          id="phone"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) =>
            setNewPatient({ ...newPatient, phone: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) =>
            setNewPatient({ ...newPatient, email: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Medical Condition
        </label>
        <input
          id="condition"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Medical Condition"
          value={newPatient.condition}
          onChange={(e) =>
            setNewPatient({ ...newPatient, condition: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="progress"
          className="block text-sm font-medium text-gray-700"
        >
          Progress
        </label>
        <select
          id="progress"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          value={newPatient.progress}
          onChange={(e) =>
            setNewPatient({ ...newPatient, progress: e.target.value })
          }
        >
          <option value="">Select progress</option>
          <option value="Improving">Improving</option>
          <option value="Stable">Stable</option>
          <option value="Declining">Declining</option>
        </select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Language
        </label>
        <input
          id="language"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Preferred Language"
          value={newPatient.language}
          onChange={(e) =>
            setNewPatient({ ...newPatient, language: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="maritalStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Marital Status
        </label>
        <select
          id="maritalStatus"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          value={newPatient.maritalStatus}
          onChange={(e) =>
            setNewPatient({ ...newPatient, maritalStatus: e.target.value })
          }
        >
          <option value="">Select status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="emergencyContact"
          className="block text-sm font-medium text-gray-700"
        >
          Emergency Contact
        </label>
        <input
          id="emergencyContact"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Emergency Contact"
          value={newPatient.emergencyContact}
          onChange={(e) =>
            setNewPatient({ ...newPatient, emergencyContact: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="insuranceProvider"
          className="block text-sm font-medium text-gray-700"
        >
          Insurance Provider
        </label>
        <input
          id="insuranceProvider"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50 focus:ring focus:ring-indigo-200/50"
          placeholder="Insurance Provider"
          value={newPatient.insuranceProvider}
          onChange={(e) =>
            setNewPatient({ ...newPatient, insuranceProvider: e.target.value })
          }
        />
      </div>
      <div className="col-span-full mt-4 flex justify-end space-x-2">
        <button
          onClick={() =>
            handleDialogChange(false, buttonText.includes("Add") ? "add" : "edit")
          }
          className="rounded-md border bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring focus:ring-indigo-500 focus:ring-offset-2"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  const SuccessModal = ({ isOpen, onClose, isUpdate }) => (
    <div
      className={`fixed inset-0 size-full overflow-y-auto bg-gray-600/50 ${isOpen ? "" : "hidden"}`}
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <div className="mt-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
            <Check className="size-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Success!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Patient information has been successfully{" "}
              {isUpdate ? "updated" : "added"}.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="w-full rounded-md bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        isUpdate={Boolean(selectedPatient)}
      />

      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80 focus:outline-none focus:ring-2 focus:ring-[#007664] focus:ring-offset-2"
        >
          <UserPlus className="mr-2 inline-block size-4" />
          Add New Patient
        </button>
      </div>


      {isAddOpen && (
        <div className="fixed inset-0 z-50 size-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Add New Patient</h2>
            <PatientForm
              buttonText="Add Patient"
              onSubmit={() => handleSubmit("add")}
            />
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 size-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-full max-w-2xl rounded-md border bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Edit Patient Information
            </h2>
            <PatientForm
              buttonText="Save Changes"
              onSubmit={() => handleSubmit("edit")}
            />
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 size-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Remove Patient Record
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Are you sure you want to remove this patient&apos;s record? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-[#75C05B]/10 shadow">
        <div className="flex items-center justify-between p-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007664]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#007664] focus:ring-offset-2">
            <Filter className="mr-2 inline-block size-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#007664]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  DOB
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Condition
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="transition-colors duration-200 hover:bg-green-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {patient.identifier}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {patient.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {patient.birthDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {patient.condition}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {patient.progress}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
             

                          <Dialog>
      <DialogTrigger asChild>
      <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                           
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Patient Information
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Comprehensive details of the selected patient
          </DialogDescription>
        </DialogHeader>
        <PatientDialog patientData={patient} />
        </DialogContent>
    </Dialog>
                    <button
                      onClick={() => startEdit(patient)}
                      className="mr-2 text-[#007664] hover:text-[#007664]/80">
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => startDelete(patient)}
                      className="text-red-700 hover:text-red-800"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <Dialog open={openviewpatient} onOpenChange={setOpenviewpatient}>
        {selectedPatient && <PatientDialog patientData={selectedPatient} />}
      </Dialog>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
