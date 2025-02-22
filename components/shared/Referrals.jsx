"use client";
import React, { useState, useEffect } from "react";

// Lucide Icons
import {
 
  Calendar,

  CheckCircle,

  Info,
  
  Search,User,

  Check as CheckIcon,

} from "lucide-react";

import { usePage } from "../shared";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createReferral,
  fetchReferralsByConsultant,
  updateReferral,
  deleteReferral,
} from "../shared/api";



// Third-party Modal
import Modal from "react-modal";
import { PatientDetailsView } from "../shared";
import { useSession } from "next-auth/react";
import { getCurrentUser } from "../shared/api";
import {StatusDialog} from "../shared"

const ReferralTableSkeleton = () => {
  // You can adjust the number of skeleton rows as needed.
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="bg-[#007664] p-2 text-left text-white">
              Referral ID
            </th>
            <th className="bg-[#007664] p-2 text-left text-white">
              Source
            </th>
            <th className="bg-[#007664] p-2 text-left text-white">
              Date
            </th>
            <th className="bg-[#007664] p-2 text-left text-white">
              Status
            </th>
            <th className="bg-[#007664] p-2 text-left text-white">
              Patient
            </th>
            <th className="bg-[#007664] p-2 text-left text-white">
              Condition
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr
              key={index}
              className="transition-colors duration-200 hover:bg-green-50"
            >
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      console.log("Fetching referrals for consultant:");
      console.log(currentUser);
      console.log(session?.data?.user);
      try {
        const data = await fetchReferralsByConsultant(currentUser.id);
        //console.log(currentUser._id)
        console.log("API Response:", data);
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
  const { activepage, setIsactivepage } = usePage();
  
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
      patientName: `${referral.patient.firstName} ${referral.patient.lastName}`,
      patientCondition: referral.patient.medicalCondition || "N/A",
      patientProgress: referral.patient.progress || "N/A",
      referredToName: referral.referredTo
        ? `${referral.referredTo.firstName} ${referral.referredTo.lastName}`
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
      setIsactivepage("patientdetails");
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
      {activepage === "referral" && (
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
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Referral ID
                  </th>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Source
                  </th>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Date
                  </th>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Status
                  </th>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Patient
                  </th>
                  <th className="bg-[#007664] p-2 text-left text-white">
                    Condition
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr
                    key={referral._id}
                    className="cursor-pointer transition-colors duration-200 hover:bg-green-50"
                    onClick={() => handleViewReferralDetails(referral)}
                  >
                    <td className="p-2">{referral.referralID}</td>
                    <td className="p-2">
                      {capitalize(referral.referredBy.firstName)}{" "}
                      {capitalize(referral.referredBy.lastName)}
                    </td>{" "}
                    {/* Use the formatted name */}
                    <td className="p-2">
                      {new Date(referral.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{referral.status}</td>
                    <td>{referral.patientName}</td>
                    <td>{referral.patientProgress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dialog (Modal) */}
          {isReferralModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={handleCloseReferralModal}
            >
              <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex justify-center">
                  <h2 className="text-xl font-semibold text-[#007664]">
                    Referral Details
                  </h2>
                </div>

                {selectedReferral && (
                  <div className="items-center space-y-6">
                    {/* Grid Layout for Referral Info */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="flex items-center justify-center space-x-3">
                        <Info size={24} color="#007664" />
                        <div>
                          <h3 className="font-medium text-black">
                            Referral ID
                          </h3>
                          <p className="text-[#007664]">
                            {selectedReferral.referralID}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <User size={24} color="#007664" />
                        <div>
                          <h3 className=" font-medium text-black">
                            Referral Source
                          </h3>
                          <p className="text-[#007664]">
                            {capitalize(selectedReferral.referredBy.firstName)}{" "}
                            {capitalize(selectedReferral.referredBy.lastName)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Calendar size={24} color="#007664" />
                        <div>
                          <h3 className=" font-medium text-black">
                            Referral Date
                          </h3>
                          <p className="text-[#007664]">
                            {new Date(
                              selectedReferral.createdAt,
                            ).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <CheckCircle size={24} color="#007664" />
                        <div>
                          <h3 className="font-medium text-black">
                            Referral Status
                          </h3>
                          <p className="text-[#007664]">
                            {selectedReferral.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <User size={24} color="#007664" />
                        <div>
                          <h3 className="font-medium text-black">Patient</h3>
                          <p className="text-[#007664]">
                            {selectedReferral.patient.firstName}{" "}
                            {selectedReferral.patient.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Info size={24} color="#007664" />
                        <div>
                          <h3 className="font-medium text-black">Condition</h3>
                          <p className="text-[#007664]">
                            {selectedReferral.patient.progress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Referral Details */}
                    <div className="flex items-center justify-center">
                      <div className="flex w-full max-w-2xl items-center space-x-3">
                        <Info size={24} color="#007664" />
                        <div className="flex-1">
                          <h3 className=" font-medium text-black">
                            Referral Details
                          </h3>
                          <p className="text-[#007664]">
                            {selectedReferral.referralReason}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          handleViewMoreInfo(selectedReferral.patient,selectedReferral)
                        }
                        className="flex items-center space-x-2 rounded-md bg-[#007664] px-5 py-2 text-white transition-colors hover:bg-[#006054]"
                      >
                        <span>View More Information</span>
                      </button>
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
      {activepage === "patientdetails" && (
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
