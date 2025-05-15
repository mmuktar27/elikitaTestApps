"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Activity,
  Apple,
  Brain,
  BriefcaseMedical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dumbbell,
  Edit,
  Eye,
  Heart,
  HeartPulse,
  Leaf,
  Lightbulb,
  LightbulbOff,
  Pill,
  Plus,
  Stethoscope,
  Syringe,
  Thermometer,
  Trash, X,
  XCircle,
} from "lucide-react";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { StatusDialog } from "../shared";
import {
  createHealthyTip,
  deleteHealthyTip,
  getAllHealthyTips,
  getHealthyTipsByCategory,
  updateHealthyTip
} from "./api";


const healthIcons = [
  { name: "HeartPulse", icon: "❤️" }, // Heart Health
  { name: "Stethoscope", icon: "🩺" }, // Medical Checkup
  { name: "Apple", icon: "🍏" }, // Nutrition
  { name: "Brain", icon: "🧠" }, // Mental & Brain Health
  { name: "Dumbbell", icon: "🏋️" }, // Fitness
  { name: "Leaf", icon: "🌿" }, // Natural Remedies
  { name: "Pill", icon: "💊" }, // Medications
  { name: "Syringe", icon: "💉" }, // Vaccination
  { name: "Thermometer", icon: "🌡️" }, // Temperature Check
  { name: "BandAid", icon: "🩹" }, // First Aid
  { name: "Activity", icon: "🏃" }, // General Activity
  { name: "ChevronLeft", icon: "⬅️" }, // Navigation
  { name: "ChevronRight", icon: "➡️" }, // Navigation
  { name: "ChevronUp", icon: "⬆️" }, // Navigation
  { name: "ChevronDown", icon: "⬇️" }, // Navigation
  { name: "Edit", icon: "✏️" }, // Edit/Modify
  { name: "Eye", icon: "👁️" }, // Vision/Visibility
  { name: "Heart", icon: "❤️" }, // General Heart Health
  { name: "Lightbulb", icon: "💡" }, // Tips/Ideas
  { name: "LightbulbOff", icon: "❌💡" }, // Inactive/Off
  { name: "Plus", icon: "➕" }, // Add/Increase
  { name: "XCircle", icon: "❌" }, // Cancel/Error
];


const HealthyTips = ({currentDashboard,addedBy}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
   const  session =useSession();
 
 
   const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [editTip, setEditTip] = useState(null);
  const [isEditTipOpen, setIsEditTipOpen] = useState(false);




 
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isNewModalOpen, setNewModalOpen] = useState({isedit:false,show:false});
  const [tips, setTips] = useState([]);
  const [editingTip, setEditingTip] = useState(null);
  const [tipsForuser, setTipsForuser] = useState({});

  const [newTip, setNewTip] = useState({ 
    title: "", 
    content: "", 
    icon: "", 
    tipsFor: "", 
    status: "", 
    addedBy: "" 
  });
  const [errors, setErrors] = useState({});






  const filterTipsByDashboard = (tips, currentDashboard) => {
    const formattedDashboard = currentDashboard.toLowerCase(); // Convert to lowercase for case-insensitive comparison
  
    return tips.filter(
      (tip) => tip.tipsFor.toLowerCase() === formattedDashboard && tip.status === "Active"
    );
  };
  
  const filteredTips = filterTipsByDashboard(tips, currentDashboard);
  
  // Map filtered tips and find the corresponding icon from healthTips

//console.log(enrichedTips)
 
useEffect(() => {
  if (filteredTips.length <= 1) return; // No need to rotate if only 1 or 0 items

  const interval = setInterval(() => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  }, 10000);

  return () => clearInterval(interval);
}, [filteredTips.length]); // Re-run when `filteredTips` changes


  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const handlePreviousTip = () => {
    setCurrentTipIndex(
      (prev) => (prev - 1 + filteredTips.length) % filteredTips.length,
    );
  };

  useEffect(() => {
    if (session && !newTip.addedBy) {
      setNewTip((prev) => ({ ...prev, addedBy: session?.data?.user?.id }));
    }
  }, [newTip?.addedBy, session, session?.data?.user?.id]);
  const validateForm = () => {
    let newErrors = {};
    if (!newTip.title) newErrors.title = "Title is required.";
    if (!newTip.content) newErrors.content = "Content is required.";
    if (!newTip.icon) newErrors.icon = "Please select an icon.";
    if (!newTip.tipsFor) newErrors.tipsFor = "Please select a category.";
    if (!newTip.status) newErrors.status = "Please select a status.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch tips on mount
  useEffect(() => {
    loadTips();
   // fetchTipsbyCat()
  }, []);

  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  const callStatusDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
  };
  const fetchTipsbyCat = async (currentDashboard) => { 
    try {
      // Capitalize the first letter
      const formattedDashboard = currentDashboard?.toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
     
      const tips = await getHealthyTipsByCategory(formattedDashboard);
      //console.log(`${formattedDashboard} Tips:`, tips);
      setTipsForuser(tips)
    } catch (error) {
      console.error("Failed to fetch tips:", error);
    }
  };
  

  const loadTips = async () => {
    try {
      const data = await getAllHealthyTips();
      setTips(data);
    } catch (error) {
      console.error("Error loading tips:", error);
    }
  };





  const handleAddTip = async () => {
    if (validateForm()) {
      try {
        if ( isNewModalOpen.isedit) {
          await updateHealthyTip(newTip._id,newTip); // Call edit function
          callStatusDialog("success", "Healthy Tip updated successfully");
        } else {
          await createHealthyTip(newTip); // Call create function
          callStatusDialog("success", "Healthy Tip added successfully");
          closeNewtipModal();
        }
  
        loadTips();
        setNewModalOpen({ isedit: false, show: false });
      } catch (error) {
        console.error("Error processing tip:", error);
        callStatusDialog(
          "error",
          isNewModalOpen.isedit
            ? "Failed to update Healthy Tip"
            : "Failed to add Healthy Tip"
        );
      }
    }
  };
  

  const handleEditTip = async (id, updatedTip) => {
    try {
      await updateHealthyTip(id, updatedTip);
      loadTips();
      setEditingTip(null);
    } catch (error) {
      console.error("Error updating tip:", error);
    }
  };

  
  const closeNewtipModal = () => {
    setNewModalOpen({isedit:false,show:false})
    setNewTip({ 
      title: "", 
      content: "", 
      icon: "", 
      tipsFor: "", 
      status: "", 
      addedBy: "" 
    })
    
   };
  const handleEdit = (selectedTipp) => {
   // console.log(selectedTipp)
    setNewTip(selectedTipp)
    setNewModalOpen({isedit:true,show:true})
    setViewModalOpen(false)
   
  };
  const handleDeleteTip = async (id) => {
    try {
      await deleteHealthyTip(id);
      loadTips();
      callStatusDialog('success','Healthy Tip deleted successfull')

    } catch (error) {
      console.error("Error deleting tip:", error);
      callStatusDialog('error','Failed to delete Healthy Tip')

    }
  };


  const tipsForOptions = [
    "Doctor", "Remote Doctor", "Healthcare Assistant", "Healthcare Admin", "General"
  ];
  const statusOptions = ["Active", "Inactive"];
  const handleInputChange = (field, value) => {
    setNewTip({ ...newTip, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" }); // Clear error for this field
    }
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 10;

// Sort function
const sortedTips = [...tips].sort((a, b) => {
  if (!sortConfig.key) return 0;
  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];
  if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
  return 0;
});

// Pagination
const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = sortedTips.slice(indexOfFirstRecord, indexOfLastRecord);
const totalPages = Math.ceil(tips.length / recordsPerPage);

// Handle sorting
const requestSort = (key) => {
  let direction = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  setSortConfig({ key, direction });
};

// Handle pagination
const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const getEmoji = (name) => {
  const emojiObj = healthIcons.find((emoji) => emoji.name === name);
  return emojiObj ? emojiObj.icon : "❓"; // Default fallback if not found
};


//console.log('tips')



const currentTip = filteredTips[currentTipIndex];
//console.log(enrichedTips[0])
//console.log(currentDashboard)
const getHealthIcon = (name) => {
  switch (name) {
    case "HeartPulse":
      return HeartPulse;
    case "Stethoscope":
      return Stethoscope;
    case "Apple":
      return Apple;
    case "Brain":
      return Brain;
    case "Dumbbell":
      return Dumbbell;
    case "Leaf":
      return Leaf;
    case "Pill":
      return Pill;
    case "Syringe":
      return Syringe;
    case "Thermometer":
      return Thermometer;
    case "BandAid":
      return BriefcaseMedical;
    case "Activity":
      return Activity;
    case "Eye":
      return Eye;
    case "Heart":
      return Heart;
    case "Lightbulb":
      return Lightbulb;
    case "LightbulbOff":
      return LightbulbOff;
    case "Plus":
      return Plus;
    case "XCircle":
      return XCircle;
    default:
      return null; // Return null if no match is found
  }
};

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Floating Healthy Tips Card */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <Card
                 className="mb-1 w-80 shadow-lg hover:shadow-xl"
                 style={{ backgroundColor: "#007664" }}
               >
                 <CardContent className="p-4">
                   <div className="mb-2 flex items-center justify-between">
                     <div className="flex items-center">
                     {currentTip?.icon 
  ? React.createElement(getHealthIcon(currentTip.icon), { className: "size-5 text-white mr-2" }) 
  : null}

                     <h3 className="text-sm font-medium text-white">
                         {currentTip?.title || 'N/A'}
                       </h3>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Button
                         variant="ghost"
                         size="icon"
                         className="size-6 text-white hover:bg-white/20"
                         onClick={handlePreviousTip}
                       >
                         <ChevronLeft className="size-4" />
                       </Button>
                       <span className="text-xs text-white">
                         {currentTipIndex + 1}/{filteredTips.length}
                       </span>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="size-6 text-white hover:bg-white/20"
                         onClick={handleNextTip}
                       >
                         <ChevronRight className="size-4" />
                       </Button>
                     </div>
                   </div>
                   <p className="text-sm text-white">{currentTip?.content || 'N/A'}</p>
                   <div className="mt-2 text-right">
                     <span className="text-xs text-white opacity-75">
                       Tips refresh every 10s
                     </span>
                   </div>
                 </CardContent>
               </Card>
      </div>

      {/* Floating Buttons */}
      <div className="mb-2 flex space-x-2">
      <button
        className="flex size-8 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
        style={{ backgroundColor: "#007664" }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <LightbulbOff className="size-6 text-white" /> : <Lightbulb className="size-6 text-white" />}
      </button>
      {currentDashboard.toLowerCase() === "healthcare admin" && (
  <>
    <button
      className="rounded-full p-2 shadow-md transition-transform hover:scale-105"
      style={{ backgroundColor: "#007664", color: "white" }}
      onClick={() => setNewModalOpen({ isedit: false, show: true })}
    >
      <Plus className="size-5" />
    </button>
    <button
      className="rounded-full p-2 shadow-md transition-transform hover:scale-105"
      style={{ backgroundColor: "#007664", color: "white" }}
      onClick={() => setViewModalOpen(true)}
    >
      <Eye className="size-5" />
    </button>
  </>
)}


      {/* Toggle Button */}
 
      </div>
      {/* New Tip Modal */}
      {isNewModalOpen.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
  {isNewModalOpen.isedit ? "Edit Health Tip" : "Add New Health Tip"}
</h2>
              <button onClick={() => closeNewtipModal()}>
                <X className="size-5" />
              </button>
            </div>
            
            <div className="mb-2">
              <input
                type="text"
                placeholder="Title"
                value={newTip.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full rounded border p-2"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="mb-2">
              <textarea
                placeholder="Content"
                value={newTip.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="w-full rounded border p-2"
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="mb-2">
              <select
                value={newTip.icon}
                onChange={(e) => handleInputChange("icon", e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">Select an Icon</option>
                {healthIcons.map((item, index) => (
                  <option key={index} value={item.name}>{item.icon}</option>
                ))}
              </select>
              {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
            </div>

            <div className="mb-2">
              <select
                value={newTip.tipsFor}
                onChange={(e) => handleInputChange("tipsFor", e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">Select Tips For</option>
                {tipsForOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              {errors.tipsFor && <p className="text-sm text-red-500">{errors.tipsFor}</p>}
            </div>

            <div className="mb-2">
              <select
                value={newTip.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">Select Status</option>
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <button
  onClick={handleAddTip}
  className="w-full rounded p-2"
  style={{ backgroundColor: "#007664", color: "white" }}
>
  {isNewModalOpen.isedit ? "Update Tip" : "Add Tip"}
</button>
          </div>
        </div>
      )}
 

      {/* View Tips Modal */}
      {isViewModalOpen && (
   <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
   <div className="relative flex h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white p-6 shadow-lg">
     {/* Close Button inside the modal container */}
     <button
       className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
       onClick={() => setViewModalOpen(false)}
     >
       <XCircle className="size-6" />
     </button>
 
     {/* Header */}
     <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
       <div className="flex w-full items-center justify-center gap-3 text-2xl font-bold">
         <HeartPulse className="size-7" />
         <span>Existing Healthy Tips</span>
       </div>
     </DialogHeader>
  
 
       <div className="mb-4 flex items-center justify-between">
       
       
       {/* Make table scrollable within the modal */}
       <div className="grow overflow-auto">
       <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          {["title", "content", "status", "tipsFor", "icon"].map((key) => (
            <th
              key={key}
              className="cursor-pointer border p-2"
              onClick={() => requestSort(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {sortConfig.key === key ? (
                sortConfig.direction === "asc" ? <ChevronUp className="ml-1 inline size-4" /> : <ChevronDown className="ml-1 inline size-4" />
              ) : null}
            </th>
          ))}
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentRecords.length > 0 ? (
          currentRecords.map((tip) => (
            <tr key={tip._id} className="border">
              <td className="border p-2">{tip.title}</td>
              <td className="border p-2">{tip.content}</td>
              <td className="border p-2">{tip.status}</td>
              <td className="border p-2">{tip.tipsFor}</td>
              <td className="border p-2">{getEmoji(tip.icon)}</td>
              <td className="flex space-x-2 border p-2">
                <button onClick={() => handleEdit(tip)} className="rounded bg-blue-500 p-1 text-white">
                  <Edit className="size-4" />
                </button>
                <button onClick={() => setDeleteConfirm({ show: true, id: tip._id })} className="rounded bg-red-500 p-1 text-white">
                  <Trash className="size-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="border p-4 text-center text-gray-500">
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Pagination Controls */}
    {totalPages > 1 && (
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="rounded bg-gray-200 p-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-200 p-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}

       </div>
     </div>
   </div>
   </div>

)}

{deleteConfirm.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
<div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this Healthy Tip?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm({ show: false, id: null })}>
                Cancel
              </Button>
              <Button variant="destructive" 
              onClick={() => {
                handleDeleteTip(deleteConfirm.id);
                setDeleteConfirm({ show: false, id: null });
              }}>
                Yes, Delete
              </Button>
            </div>
          </div>
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
    </div>
  );
};

export default HealthyTips;
