"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Plus, Search, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusDialog } from "../shared";
import {
  createUtility,
  deleteUtility,
  getAllUtility,
  updateUtility,
} from "../shared/api";
import { UtilityForm } from "./UtilityForm";

const mockUtilities = [
  {
    id: 1,
    name: "Hospital Beds",
    category: "Furniture",
    totalItems: 500,
    availableItems: 50,
    icon: "🛏️",
  },
  {
    id: 2,
    name: "Ambulances",
    category: "Vehicles",
    totalItems: 20,
    availableItems: 5,
    icon: "🚑",
  },
  {
    id: 3,
    name: "MRI Machines",
    category: "Medical Equipment",
    totalItems: 3,
    availableItems: 1,
    icon: "🏥",
  },
  {
    id: 4,
    name: "Pharmacies",
    category: "Facilities",
    totalItems: 5,
    availableItems: 5,
    icon: "💊",
  },
  {
    id: 5,
    name: "Operating Rooms",
    category: "Facilities",
    totalItems: 10,
    availableItems: 2,
    icon: "🩻",
  },
  {
    id: 6,
    name: "Wheelchairs",
    category: "Mobility Aids",
    totalItems: 200,
    availableItems: 75,
    icon: "🦽",
  },
];

const emojiOptions = [
  { label: "Hospital Bed", value: "🛏️" },
  { label: "Ambulance", value: "🚑" },
  { label: "MRI Machine", value: "🏥" },
  { label: "Pharmacy", value: "💊" },
  { label: "Operating Room", value: "🩻" },
  { label: "Wheelchair", value: "🦽" },
];

// Function to get the emoji from label
const UtilitiesSkeleton = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-5 h-8 w-64 animate-pulse rounded bg-gray-300"></div>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative h-10 w-64 animate-pulse rounded bg-gray-300"></div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-300"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg bg-gray-200 p-4 shadow"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="h-6 w-24 rounded bg-gray-300"></div>
              <div className="size-10 rounded-full bg-gray-300"></div>
            </div>
            <div className="mb-2 h-4 w-40 rounded bg-gray-300"></div>
            <div className="mb-2 h-8 w-32 rounded bg-gray-300"></div>
            <div className="h-4 w-40 rounded bg-gray-300"></div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 rounded bg-gray-300"></div>
              <div className="h-8 w-16 rounded bg-gray-300"></div>
              <div className="h-8 w-16 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewUtilityModal = ({utility,onClose}) => {
  if (!utility) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty values
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };
  const getEmoji = (label) => {
    const emojiObj = emojiOptions.find((emoji) => emoji.label === label);
    return emojiObj ? emojiObj.value : "❓"; // Default fallback if not found
  };
  
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl md:p-8">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h2 className="flex items-center gap-2 break-words text-xl font-semibold md:text-2xl">
          {getEmoji(utility.icon)} {utility.name}
        </h2>
        <p className="text-sm font-medium text-gray-500">{utility.category}</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs text-gray-500">Total Items</p>
            <p className="font-medium">{utility.totalItems}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs text-gray-500">Available Items</p>
            <p className="font-medium">{utility.availableItems}</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm md:text-base">
          <div className="flex flex-wrap justify-between">
            <p className="text-gray-600">Last Serviced</p>
            <p className="font-medium">{formatDate(utility.lastServiced) || "N/A"}</p>
          </div>
          <div className="flex flex-wrap justify-between">
            <p className="text-gray-600">Next Service Due</p>
            <p className="font-medium">{formatDate(utility.nextServiceDue) || "N/A"}</p>
          </div>
          <div className="flex flex-wrap justify-between">
            <p className="text-gray-600">Added By</p>
            <p className="font-medium">{utility.addedBy.firstName} {utility.addedBy.lastName}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button 
          onClick={onClose} 
          className="w-full rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={onClose} 
          className="w-full rounded-lg bg-teal-800 py-2.5 font-medium text-white transition-colors hover:bg-teal-900"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  );}
export default function UtilitiesManagement() {
  const [selectedUtility, setSelectedUtility] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false)

  const [utilities, setUtilities] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUtilityOpen, setIsAddUtilityOpen] = useState(false);
  const [editUtility, setEditUtility] = useState(null);
  const [isEditUtilityOpen, setIsEditUtilityOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUtilities();
  }, []);
  const getEmoji = (label) => {
    const emojiObj = emojiOptions.find((emoji) => emoji.label === label);
    return emojiObj ? emojiObj.value : "❓"; // Default fallback if not found
  };
  

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
  const loadUtilities = async () => {
    setIsLoading(true); // Set loading state to true before fetching
    try {
      const data = await getAllUtility();
      setUtilities(data);
    } catch (error) {
      console.error("Error loading utilities:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  const handleAddUtilities= async (utility) => {

   try{
      await createUtility(utility);

      callStatusDialog('success','Utility added successfully')
      loadUtilities();
      setIsAddUtilityOpen(false);
     
    } catch (error) {
      console.error("Error adding tip:", error);
      callStatusDialog('error','Failed to add Utility')

    }
  };


  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });



  const handleupdateUtility = async (data) => {
    try {
      await updateUtility(data._id, data);
      callStatusDialog('success','Utility Updated successfully')
      loadUtilities();
      setIsEditUtilityOpen(false);


    } catch (error) {
      console.error("Error updating tip:", error);
      callStatusDialog('error','Failed to update Utility ')

    }
  };

  

  const handleDeleteUtility = async (id) => {
    try {
      await deleteUtility(id);
      loadUtilities();
      callStatusDialog('success','Utility deleted Sucessfully')

    } catch (error) {
      console.error("Error deleting tip:", error);
      callStatusDialog('error','Failed to delete utility')

    }
  };







  const filteredUtilities = utilities?.filter(
    (utility) =>
      utility?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility?.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addUtility = async (utility) => {

    await handleAddUtilities(utility)
  
  };
  if (isLoading) {
    return <UtilitiesSkeleton />;
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-5 text-3xl font-bold text-[#007664]">
        Utilities Management
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search utilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
                <Button className="bg-[#007664] hover:bg-[#007664]/80"
                               onClick={() => setIsAddUtilityOpen(true)}
                                >
                                      <Plus className="size-4" />
                                      Add Utility
                                      </Button>
        {isAddUtilityOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
 <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-0">
  
      <button
  className="pointer-events-auto absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
  onClick={() => setIsAddUtilityOpen(false)}
>
  <XCircle className="size-6" />
</button>

<UtilityForm
              onSubmit={handleAddUtilities}
              onCancel={() => setIsAddUtilityOpen(false)}
              utility={null}
              buttonText="Submit"
            />
</div></div>
      )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUtilities?.map((utility) => (
          <Card
            key={utility.id}
            className="cursor-pointer bg-[#75C05B]/10 transition-shadow hover:shadow-lg"
          //  onClick={() => setSelectedUtility(utility)}
            >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {utility.name}
              </CardTitle>
              <div className="text-4xl">{getEmoji(utility.icon)}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Category: {utility.category}
              </p>
              <p className="text-2xl font-bold">
                {utility.availableItems} / {utility.totalItems}
              </p>
              <p className="text-xs text-muted-foreground">Available / Total</p>
            </CardContent>
            <CardFooter>
            <div className="flex gap-2">
            {/* View Button */}
            <Button variant="outline" size="sm" onClick={() => setSelectedUtility(utility)}>
              <Eye className="mr-1 size-4" /> View
            </Button>

            {/* Edit Button */}

            <Button 
  variant="secondary" 
  size="sm" 
  onClick={() => {
    setEditUtility(utility); // Store selected utility
    setIsEditUtilityOpen(true); // Open dialog
  }}
>
  <Pencil className="mr-1 size-4" /> Edit
</Button>  

         
            

            {/* Delete Button */}
            <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm({ show: true, id: utility._id })}>
              <Trash2 className="mr-1 size-4" /> Delete
            </Button>
          </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isEditUtilityOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-0">
   
      <button
  className="pointer-events-auto absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
  onClick={() => setIsEditUtilityOpen(false)}
>
  <XCircle className="size-6" />
</button>
      <UtilityForm
              onCancel={() => setIsEditUtilityOpen(false)}
              utility={editUtility}
              onUpdate={handleupdateUtility}
              buttonText="Update"
            />
</div></div>
      )}
      {selectedUtility && <ViewUtilityModal utility={selectedUtility} onClose={() => setSelectedUtility(null)} />}
{deleteConfirm.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
  <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this utility?</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm({ show: false, id: null })}>
                Cancel
              </Button>
              <Button variant="destructive" 
              onClick={() => {
                handleDeleteUtility(deleteConfirm.id);
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
}
