import { useState, useEffect } from "react";

const PatientsForms = ({ form }) => {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    address: "",
    phone: "",
    email: "",
    medicalCondition: "",
    progress: "",
    maritalStatus: "",
    emergencyContact: "",
    insuranceProvider: "",
    patientReference: "",
  });

  const [errors, setErrors] = useState({});

  // Update formData when the form prop changes (for editing existing data)
  const currentYear = new Date().getFullYear();

  // Update formData when the form prop changes (for editing existing data)
  useEffect(() => {
    if (form && Object.keys(form).length > 0) {
      setFormData(form);
    } else {
      // Generate a new patient reference using a portion of Unix timestamp
      const unixTimestamp = Date.now();
      const timestampPortion = unixTimestamp.toString().slice(-6); // Take last 6 digits
      const newReference = `PAT-${currentYear}-${timestampPortion}`;
  
      setFormData((prevData) => ({
        ...prevData,
        patientReference: newReference,
      }));
    }
  }, [form, currentYear]);


  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "patientReference") {
      setFormData({ ...formData, [name]: value });
    }

    // Remove error message when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.birthDate) newErrors.birthDate = "Birth Date is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.maritalStatus) newErrors.maritalStatus = "Marital Status is required.";
    if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency Contact is required.";
    if (!formData.insuranceProvider) newErrors.insuranceProvider = "Insurance Provider is required.";
    if (!formData.patientReference) newErrors.patientReference = "Patient Reference is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        let data;
        if (form?.id) {
          // If patient ID exists, update the patient
          data = await updatePatient(form.id, formData);
          alert("Patient updated successfully!");
        } else {
          // If no patient ID, create a new patient
          data = await createPatient(formData);
          alert("Patient created successfully!");
        }

        console.log("Response:", data);
      } catch (error) {
        alert("Error: " + error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!form?.id) {
      alert("No patient selected for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this patient?")) {
      setLoading(true);

      try {
        const data = await deletePatient(form.id);
        alert("Patient deleted successfully!");
        console.log("Response:", data);
        setFormData({});
      } catch (error) {
        alert("Error: " + error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6" style={{ width: "65vw" }}>
      <div className="grid grid-cols-1 gap-4 bg-white shadow-lg md:grid-cols-1 p-6 rounded-lg">
        <div className="flex flex-row items-center justify-between rounded-t-lg bg-teal-700 text-white p-4">
          <h2 className="text-2xl">{form?.id ? "Update Patient" : "New Patient Entry"}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          {/* Gender and Birth Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
            </div>
          </div>

          {/* Address and Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-teal-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* New fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
  <label className="block text-sm font-medium text-teal-700">
    Marital Status <span className="text-red-500">*</span>
  </label>
  <select
    name="maritalStatus"
    value={formData.maritalStatus}
    onChange={handleInputChange}
    className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
  >
    <option value="">Select</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
    <option value="Divorced">Divorced</option>
    <option value="Widowed">Widowed</option>
  </select>
  {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus}</p>}
</div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Emergency Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.emergencyContact && <p className="text-red-500 text-sm">{errors.emergencyContact}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
              />
              {errors.insuranceProvider && <p className="text-red-500 text-sm">{errors.insuranceProvider}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-teal-700">
                Patient Reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientReference"
                value={formData.patientReference}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 focus:ring-2 focus:ring-teal-500"
                disabled
              />
              {errors.patientReference && <p className="text-red-500 text-sm">{errors.patientReference}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {form?.id ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
