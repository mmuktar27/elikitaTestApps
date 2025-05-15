"use client";
import { useEffect, useState } from "react";

// Lucide Icons
import {
  Calendar,

  CheckCircle,
  Info,

  Search, User,
  XCircle
} from "lucide-react";

import { useReferralsPage } from "../shared";


import {
  DialogHeader
} from "@/components/ui/dialog";
import {
  fetchReferralsByConsultant,
  updateReferral
} from "../shared/api";



// Third-party Modal
import { useSession } from "next-auth/react";
import { PatientDetailsView, StatusDialog } from "../shared";

const ReferralTableSkeleton = () => {
  // You can adjust the number of skeleton rows as needed.
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="rounded-md bg-[#75C05B]/10 p-4 shadow-md">
      {/* Search Bar Skeleton */}
      <div className="flex w-full items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {["Referral ID", "Source", "Date", "Status", "Patient", "Condition"].map(
                (header, index) => (
                  <th key={index} className="bg-[#007664] p-2 text-left text-white">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((_, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-green-50"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <td key={i} className="p-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const ReferralsPage = ({ currentUser, currentDashboard }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const session = useSession();
 const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  useEffect(() => {
    const getReferrals = async () => {
     // console.log("Fetching referrals for consultant:");
    //  console.log(currentUser);
    //  console.log(session?.data?.user);
      try {
        const data = await fetchReferralsByConsultant(currentUser.id);
        //console.log(currentUser._id)
      //  console.log("API Response:", data);
        //console.log("Referrals Data:", data.data.referrals);

        setReferrals(data.data.referrals);
      } catch (err) {
        console.error(
          "Error fetching referrals:",
          err.message,
          err.response?.data,
        );
        setError(err.message);
      } finally {
        console.log("Fetching process completed.");
        setLoading(false);
      }
    };

    getReferrals();
  }, [currentUser, session?.data?.user]);

  

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  //const [activepage, setIsactivepage] = useState("referral");
  //const { activepage, setIsactivepage } = useReferralsPage ();
  const { activeReferralsPage, setActiveReferralsPage } = useReferralsPage();

  const [showDetails, setShowDetails] = useState(false);



  const filterReferralsbyDashboard = referrals.filter(referral => {
    switch (currentDashboard) {
      case 'doctor':
        return referral.referralType === 'doctor';
      case 'remotedoctor':
          return referral.referralType === 'remotedoctor';
      case 'healthcare assistant':
        return referral.referralType === 'healthcareassistant';
      default:
        return true;
    }
  });
//console.log('ffreferrals')
//console.log(filterReferralsbyDashboard)


  const filteredReferrals = filterReferralsbyDashboard
    .map((referral) => ({
      ...referral,
      patientName: `${referral.patient?.firstName} ${referral.patient?.lastName}`,
      patientCondition: referral?.patient?.medicalCondition || "N/A",
      patientProgress: referral?.patient?.progress || "N/A",
      referredToName: referral?.referredTo
        ? `${referral?.referredTo?.firstName} ${referral?.referredTo?.lastName}`
        : "N/A",
    }))
    .filter((referral) => {
      const searchFields = [
        referral._id,
        referral.referralType,
        referral.referredToName, // Use the formatted string instead of the object
        referral.referralReason,
        referral.status,
        referral.patientName,
        referral.patientCondition,
        referral.patientProgress,
      ];

      return searchFields.some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
    });

  const handleReferralUpdate = async (referralId, updateData) => {
    if (!referralId) {
      console.error("Referral ID is required.");
      return { error: "Referral ID is required." };
    }

    try {
      const result = await updateReferral(referralId, updateData);
      if (result.error) {
        console.error("Error updating referral:", result.error);
      } else {
        console.log("Referral updated successfully:", result);
      }
      return result;
    } catch (error) {
      console.error("Unexpected error:", error);
      return { error: error.message };
    }
  };
  const handleClose = () => {
    setShowDetails(false);
    setSelectedPatient(null);
  };

  const handleViewReferralDetails = (referral) => {
    setSelectedReferral(referral);
    // console.log(referral);
    setIsReferralModalOpen(true);
  };

  const handleCloseReferralModal = () => {
    setSelectedReferral(null);
    setIsReferralModalOpen(false);
  };
  const updateReferralIfPending = async (selectedPatient) => {
    if (!selectedPatient || !selectedPatient._id) {
      console.error("Invalid patient data.");
      return { error: "Invalid patient data." };
    }
  
    if (selectedPatient.status === "pending") {
      try {
        const updateData = { status: "Reviewed" };
        const result = await handleReferralUpdate(selectedPatient._id, updateData);
        console.log("Referral updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error updating referral:", error);
        return { error: error.message };
      }
    } else {
      console.log("Referral is not pending. No update needed.");
      return { message: "Referral is not pending, no update required." };
    }
  };
  const handleViewMoreInfo = async (patient, referral) => {
   
 

   setSelectedPatient(patient);
    setIsReferralModalOpen(false);
  
    const result = await updateReferralIfPending(referral);
  
    if (result && !result.error) {
      setActiveReferralsPage("patientdetails");
    }else{
      setStatusDialog({
        isOpen: true,
        status:  "error",
        message:"Failed to add Update referral Status"
      
    })
  }
  
  }

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const isdoctor = () => {
    return (
      currentDashboard === "doctor" || currentDashboard === "remotedoctor"  && currentUser?.roles?.includes("doctor") || currentUser?.roles?.includes("remotedoctor")
    );
  };

  if (loading || !currentUser || !filteredReferrals) {
    return <ReferralTableSkeleton />;
  }
  return (

    <div>
      {activeReferralsPage === "referral" && (
        <div className="rounded-md bg-[#75C05B]/10 p-4 shadow-md">
          <div className="flex w-full items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <input
                placeholder="Search referrals..."
                className="rounded-md bg-white p-2 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
  <thead>
    <tr className="border-b border-gray-300">
      <th className="border-r border-gray-300 bg-[#007664] p-2 text-left text-white">
        Referral ID
      </th>
      <th className="border-r border-gray-300 bg-[#007664] p-2 text-left text-white">
        Source
      </th>
      <th className="border-r border-gray-300 bg-[#007664] p-2 text-left text-white">
        Date
      </th>
      <th className="border-r border-gray-300 bg-[#007664] p-2 text-left text-white">
        Status
      </th>
      <th className="border-r border-gray-300 bg-[#007664] p-2 text-left text-white">
        Patient
      </th>
      <th className="bg-[#007664] p-2 text-left text-white">
        Condition
      </th>
    </tr>
  </thead>
  <tbody>
  {filteredReferrals?.length > 0 ? (
    filteredReferrals?.map((referral) => (
      <tr
        key={referral._id}
        className="cursor-pointer border-b border-gray-300 transition-colors duration-200 hover:bg-green-50"
        onClick={() => handleViewReferralDetails(referral)}
      >
        <td className="border-r border-gray-300 p-2">{referral.referralID}</td>
        <td className="border-r border-gray-300 p-2">
          {capitalize(referral.referredBy.firstName)}{" "}
          {capitalize(referral.referredBy.lastName)}
        </td>
        <td className="border-r border-gray-300 p-2">
          {new Date(referral.createdAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </td>
        <td className="border-r border-gray-300 p-2">{capitalize(referral.status)}</td>
        <td className="border-r border-gray-300 p-2">{referral.patientName}</td>
        <td className="p-2">{capitalize(referral.patientProgress)}</td>
      </tr>
    ))
  ) : (
<tr>
    <td  className="text-center text-gray-500 " colspan="7">No records found</td>
    </tr>
      )}
  </tbody>
</table>

          </div>

          {/* Dialog (Modal) */}
          {isReferralModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:max-w-4xl sm:p-6">
      
      {/* Close Button */}
      <button
        className="absolute right-3 top-3 rounded-full bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
        onClick={handleCloseReferralModal}
      >
        <XCircle className="size-6" />
      </button>

      {/* Modal Header */}
      <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Referral Details</h2>

      </div>
      </DialogHeader>
      {selectedReferral && (
        <div className="space-y-4">
          {/* Referral Info Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { icon: <Info size={24} color="#007664" />, label: "Referral ID", value: selectedReferral?.referralID },
              { icon: <User size={24} color="#007664" />, label: "Referral Source", value: `${capitalize(selectedReferral?.referredBy?.firstName)} ${capitalize(selectedReferral?.referredBy?.lastName)}` },
              { icon: <Calendar size={24} color="#007664" />, label: "Referral Date", value: new Date(selectedReferral?.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) },
              { icon: <CheckCircle size={24} color="#007664" />, label: "Referral Status", value: selectedReferral?.status },
              { icon: <User size={24} color="#007664" />, label: "Patient", value: `${selectedReferral?.patient?.firstName} ${selectedReferral?.patient?.lastName}` },
              { icon: <Info size={24} color="#007664" />, label: "Condition", value: selectedReferral?.patient?.progress },
            ].map(({ icon, label, value }, index) => (
              <div key={index} className="flex items-center space-x-3 rounded-lg border p-3 shadow-sm">
                {icon}
                <div>
                  <h3 className="text-xs font-medium text-gray-600">{label}</h3>
                  <p className="text-sm font-semibold text-[#007664] sm:text-lg">{value || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Details */}
          <div className="flex items-center justify-center">
            <div className="flex w-full max-w-2xl items-center space-x-3 rounded-lg border p-3 shadow-sm">
              <Info size={24} color="#007664" />
              <div className="flex-1">
                <h3 className="text-xs font-medium text-gray-600">Referral Details</h3>
                <p className="text-sm font-semibold text-[#007664] sm:text-lg">
                  {selectedReferral?.referralReason || "No details provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
          <div className="space-y-2">
  {!selectedReferral?.patient && (
    <p className="text-sm text-red-600">Patient Does not Exist.</p>
  )}

  <button 
    onClick={() => {
      if (selectedReferral?.patient) {
        handleViewMoreInfo(selectedReferral.patient, selectedReferral);
      }
    }}
    className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium shadow-md transition sm:px-6 sm:py-3 sm:text-lg 
      ${selectedReferral?.patient ? 'bg-[#007664] text-white hover:bg-[#006054]' : 'cursor-not-allowed bg-gray-300 text-gray-600'}`}
    disabled={!selectedReferral?.patient}
  >
    <span>View More Information</span>
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  </div>
)}


        </div>
      )}
<StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
      {/* Patient Details View */}
      {activeReferralsPage === "patientdetails" && (
        <PatientDetailsView
          onClose={handleClose}
          SelectedPatient={selectedPatient}
          patient={selectedPatient}
          currentUser={currentUser}
          currentDashboard={currentDashboard}
        />
      )}
    </div>
   
  );
};

export default ReferralsPage;
