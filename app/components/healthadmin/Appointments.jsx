import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CalendarCheck,
} from "lucide-react";

const AppointmentsPage = () => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const handleDelete = () => {
    // In a real application, you would delete the appointment here
    setAppointments(
      appointments.filter((a) => a.id !== appointmentToDelete.id),
    );
    setIsDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const [appointments, setAppointments] = useState([
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
    // In a real application, you would create the appointment here
    setIsNewAppointmentOpen(false);
    setShowSuccess(true);
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
    <div
      className={`fixed inset-0 size-full overflow-y-auto bg-gray-600/50 ${showSuccess ? "" : "hidden"}`}
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <div className="mt-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
            <CalendarCheck className="size-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Appointment Created Successfully!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to the patient with the
              appointment details.
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-md bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NewAppointmentModal = () => (
    <div
      className={`fixed inset-0 size-full overflow-y-auto bg-gray-600/50 ${isNewAppointmentOpen ? "" : "hidden"}`}
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">New Appointment</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateAppointment();
          }}
        >
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="patientId"
            >
              Patient Reference
            </label>
            <input
              className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring"
              id="patientId"
              type="text"
              placeholder="Patient/[id]"
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="appointmentType"
            >
              Appointment Type
            </label>
            <select
              className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring"
              id="appointmentType"
            >
              <option>Select type</option>
              <option value="ROUTINE">Routine</option>
              <option value="WALKIN">Walk-in</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="startTime"
            >
              Start Time
            </label>
            <input
              className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring"
              id="startTime"
              type="datetime-local"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring"
              type="submit"
            >
              Create Appointment
            </button>
            <button
              className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none focus:ring"
              type="button"
              onClick={() => setIsNewAppointmentOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

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
      <div className="flex items-center justify-end">
        <button
          className="rounded bg-[#007664] px-4 py-2 font-bold text-white hover:bg-[#007664]/80"
          onClick={() => setIsNewAppointmentOpen(true)}
        >
          <Plus size={20} className="mr-2 inline-block" />
          New Appointment
        </button>
      </div>

      <div className="rounded-lg bg-[#75C05B]/10 shadow">
        <div className="flex items-center justify-between p-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search appointment..."
              className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007664]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow">
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
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                >
                  Specialty
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
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="transition-colors duration-200 hover:bg-green-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {appointment.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {appointment.subject.display}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(appointment.start)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatTime(appointment.start)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {appointment.appointmentType.coding[0].display}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {appointment.specialty.coding[0].display}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button className="mr-2 text-indigo-600 hover:text-indigo-900">
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setAppointmentToDelete(appointment);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewAppointmentModal />
      <SuccessDialog />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 size-full overflow-y-auto bg-gray-600/50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">
              Delete Appointment
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
