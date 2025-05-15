"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Trash2,
  X, UserSearch, UserPlus, Check, Loader, AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { StatusDialog } from "../shared";
import { getAllStaff } from '../shared/api'

import {createUser} from '../shared/api'
import StaffDetail from "./UserDetail"
import { createAuditLogEntry,getUserByEmail } from "@/components/shared/api";
import { useCreateUser, useDeleteStaff, useGetStaff } from "@/hooks/admin";
import { ROLES } from "@/utils/roles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SkeletonCard from "../ui/skeletoncard";

import { useUserPageNav } from "@/components/shared";


export default function UserComponent() {
  const { toast } = useToast();
  const { activeUserPage, setActiveUserPage } = useUserPageNav();

  const [newUser, setNewUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [organization, setOrganization] = useState("e-likita");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
const session = useSession();
  const [editingUser, setEditingUser] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);

  const [activeTab, setActiveTab] = useState('users');

  // Add these state variables
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [fetchedUser, setFetchedUser] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [isLoadings, setIsLoadings] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayName, setDisplayName] = useState("");
  //const [organization, setOrga] = useState("");
  const [currentUser, setcurrentUser] = useState("");
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

  const { data: allStaff, isLoading } = useGetStaff();
  const { mutate: deleteStaff, isPending } = useDeleteStaff();

  const fetchStaff = async () => {
    try {
      const staffList = await getAllStaff();
     // console.log("Staff List:", staffList);
  

      setUsers(staffList)
    } catch (error) {
      console.error("Failed to fetch staff list:", error.message);
    }
  };

  useEffect(() => {
    if (!isLoading && allStaff?.data.success) {
      setUsers(allStaff?.data?.data);
    }
  }, [isLoading, allStaff]);
  useEffect(() => {
    setcurrentUser(session?.data?.user?.id)
  }, [session?.data?.user?.id]);

  const usersPerPage = 10;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    let generatedDisplayName = "";
  
    // Use optional chaining and nullish coalescing for safer access
    const firstName = newUser?.firstName ?? "";
    const lastName = newUser?.lastName ?? "";
    
    if (firstName && lastName) {
      generatedDisplayName = `${firstName} ${lastName}`;
      
      // Only add organization if it exists and has a value
      if (organization && organization.trim()) {
        generatedDisplayName += ` (${organization})`;
      }
    } else if (firstName) {
      generatedDisplayName = firstName;
    } else if (lastName) {
      generatedDisplayName = lastName;
    }
  
    const trimmedDisplayName = generatedDisplayName.trim();
    setDisplayName(trimmedDisplayName);
    
    // Use functional update to avoid dependency on newUser
    setNewUser(prev => ({ ...prev, displayName: trimmedDisplayName }));
  }, [newUser?.firstName, newUser?.lastName, organization]);

  const filteredUsers = users.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const roleMatch =
      selectedRole === "" ||
      !selectedRole ||
      (user.roles && user.roles.includes(selectedRole));

    const matchesSearchTerm =
      searchTerm === "" ||
      (user?.firstName || "").toLowerCase().includes(lowerSearchTerm) ||
      (user?.lastName || "").toLowerCase().includes(lowerSearchTerm) ||
      (user?.workEmail || "").toLowerCase().includes(lowerSearchTerm);

    return roleMatch && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  {/*
    

  const addUser = async (user) => {
    try {
      setIsLoadings(true)
      const createdUser = await createUser(user, {
        onSuccess: async (newUser) => {
          setIsAddUserOpen(false);
          setShowAddUserModal(false);
          callStatusDialog('success','User successfully created.');
        
          // Ensure newUser contains the generated ID
          if (!newUser?.id) {
            console.error("Failed to retrieve created user ID.");
            return;
          }
  
          // Audit log entry
          const auditData = {
            userId: currentUser,
            activityType: "Create",
            entityId: newUser.id, // Get the user ID from response
            entityModel: "Staff",
            details: `User ${newUser.firstName} ${newUser.lastName} created successfully`,
          };
  
          try {
            const auditResponse = await createAuditLogEntry(auditData);
            console.log("Audit log response:", auditResponse);
          } catch (auditError) {
            console.error("Audit log failed:", auditError);
          }
        },
        onError: (error) => {
          callStatusDialog('error','Failed to create user.');
        },
      });
  
      return createdUser; // Return the user object if needed elsewhere
    } catch (error) {
      callStatusDialog('error','An unexpected error occurred.');
    } finally {
      setIsLoadings(false);
    }
  };
  */}

  const addUser = async (user) => {
    try {
      setIsLoadings(true);
      
      // Call the simple axios function
      const response = await createUser(user);
      const newUser = response; // Assuming the API returns the created user
      
      setIsAddUserOpen(false);
      setShowAddUserModal(false);
      callStatusDialog('success', 'User successfully created.');
      fetchStaff();
      // Ensure newUser contains the generated ID
      if (!newUser?.id) {
        console.error("Failed to retrieve created user ID.");
        return;
      }
  
      // Audit log entry
      const auditData = {
        userId: currentUser,
        activityType: "Create",
        entityId: newUser.id, // Get the user ID from response
        entityModel: "Staff",
        details: `User ${newUser.firstName} ${newUser.lastName} created successfully`,
      };
  
      try {
        const auditResponse = await createAuditLogEntry(auditData);
        console.log("Audit log response:", auditResponse);
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
      
      // You'll need to fetch staff data manually since we're not using queryClient.invalidateQueries anymore
      // If you have a function to fetch staff data, call it here
      // e.g., fetchStaffData();
      
      return newUser; // Return the user object if needed elsewhere
      
    } catch (error) {
      console.error("Error in addUser:", error);
      callStatusDialog('error', 'Failed to create user.');
    } finally {
      setIsLoadings(false);
    }
  };
  const handleViewUser= (user) => {
  
    setSelectedUser(user);
    
    setActiveUserPage('viewuser')
  };
  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async (user) => {  
    const auditData = {
      userId: currentUser,
      activityType: "Delete",
      entityId: user.id,
      entityModel: "Staff",
      details: `User ${user.firstName} ${user.lastName} deleted successfully`,
    };
  
    try {
      await deleteStaff(user.microsoftID, {
        onSuccess: async () => { 
          setShowDeleteConfirmation(false);
          
         
          callStatusDialog('success','User successfully deleted.');

          // Log audit after successful deletion
          try {
            const auditResponse = await createAuditLogEntry(auditData);
            console.log("Audit log response:", auditResponse);
          } catch (auditError) {
            console.error("Audit log failed:", auditError);
          }
        },
        onError: (error) => {
          callStatusDialog('error','Failed to delete user.');

         
        },
      });
    } catch (error) {

      callStatusDialog('error','An unexpected error occurred.');

      console.error("Unexpected error:", error);
    }
  };
  
// Function to fetch user from MS Graph
const fetchUserFromGraph = async () => {
  if (!searchEmail) {
    setFetchError("Please enter an email address");
    return;
  }
  
  setIsLoadings(true);
  setFetchError("");
  
  try {
    // The getUserByEmail function already returns parsed JSON data
    const userData = await getUserByEmail(searchEmail);
    
    if (!userData) {
      throw new Error("User not found or unable to fetch user data");
    }
    
    console.log(userData);
    
    setFetchedUser({
      firstName: userData.givenName || "",
      lastName: userData.surname || "",
      displayName: userData.displayName || "",
      email: userData.mail || userData.userPrincipalName || searchEmail,
      // Add any other fields you need
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    setFetchError(error.message || "Failed to fetch user data");
    setFetchedUser(null);
  } finally {
    setIsLoadings(false);
  }
};

  if (!isHydrated || isLoading || users.length === 0) {
    return <SkeletonCard className="h-[600px] w-full" />;
  }



  return (
    <>
 
    {activeUserPage === "users" && (

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#007664]">User Management</h2>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="rounded bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#007664]/80"
        >
          Add New User
        </button>
      </div>

      <div className="rounded-lg bg-[#75C05B]/10 p-6">
        <h3 className="mb-4 text-xl font-semibold text-[#007664]">User List</h3>
        <div className="mb-4 flex items-start justify-start gap-2">
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#007664]"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">All Roles</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-[#007664] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="whitespace-nowrap px-6 py-4">
                    {user?.firstName} {user?.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user?.workEmail}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user?.roles?.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role.toUpperCase()}
                      </Badge>
                    ))}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleViewUser(user)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={20} />
                      </button>

                      <button
                        onClick={() => handleDeleteConfirmation(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
{/*
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#007664]">
                {editingUser ? "Edit User" : "Register New User"}
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                  temp
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={newUser.displayName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, displayName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => addUser(newUser)}
                className="rounded bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#007664]/80"
              >
                {editingUser ? "Update User" : "Register User"}
              </button>
            </div>
          </div>
        </div>
      )}*/}
{showAddUserModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#007664]">
          {editingUser ? "Edit User" : "Register User"}
        </h3>
        <button
          onClick={() => {
            setShowAddUserModal(false);
            setRegistrationType(null);
            setCurrentStep(1);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Step 1: Choose registration method */}
      {currentStep === 1 && (
        <div className="flex flex-col items-center space-y-6 py-8">
          <h4 className="text-lg font-medium text-gray-700">Select an option to continue:</h4>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <button
              onClick={() => {
                setRegistrationType("existing");
                setCurrentStep(2);
              }}
              className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-6 text-center transition-all hover:border-[#007664] hover:bg-gray-50"
            >
              <UserSearch size={40} className="mb-3 text-[#007664]" />
              <span className="text-lg font-medium">Fetch Existing User</span>
              <span className="mt-2 text-sm text-gray-500">
                Search for a user in Microsoft
              </span>
            </button>
            <button
              onClick={() => {
                setRegistrationType("new");
                setCurrentStep(3);
              }}
              className="flex flex-col items-center rounded-lg border-2 border-gray-200 p-6 text-center transition-all hover:border-[#007664] hover:bg-gray-50"
            >
              <UserPlus size={40} className="mb-3 text-[#007664]" />
              <span className="text-lg font-medium">Create New User</span>
              <span className="mt-2 text-sm text-gray-500">
                Register a completely new user
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Fetch existing user form */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium text-gray-700"
            >
              User Email Address
            </label>
            <div className="flex space-x-2">
              <input
                id="userEmail"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter user email to search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
              />
              <button
                onClick={fetchUserFromGraph}
                disabled={isLoadings}
                className="whitespace-nowrap rounded bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#007664]/80 disabled:bg-gray-300"
              >
                {isLoadings ? (
                  <span className="flex items-center">
                    <Loader size={16} className="mr-2 animate-spin" /> Searching...
                  </span>
                ) : (
                  "Fetch User"
                )}
              </button>
            </div>
          </div>

          {fetchError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="size-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{fetchError}</p>
                </div>
              </div>
            </div>
          )}

          {fetchedUser && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-3 font-medium text-gray-700">User Found:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {fetchedUser.firstName} {fetchedUser.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{fetchedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Display Name</p>
                  <p className="font-medium">{fetchedUser.displayName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewUser(fetchedUser);
                  setCurrentStep(3);
                }}
                className="mt-4 flex w-full items-center justify-center rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
              >
                <Check size={16} className="mr-2" /> Use This User
              </button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
            
              onClick={() => {
                setNewUser(null);
                setFetchedUser(null)
                setCurrentStep(1)
              }}
              className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3: User details form */}
      {currentStep === 3 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={newUser?.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={newUser?.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={newUser?.displayName}
                onChange={(e) =>
                  setNewUser({ ...newUser, displayName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
  id="email"
  type="email"
  value={newUser?.email}
  onChange={(e) => {
    setNewUser({ ...newUser, email: e.target.value });
  }}
  onBlur={(e) => {
    // Validate email domain on blur
    const email = e.target.value;
    if (email && !email.endsWith('@e-likita.com')) {
      // Show error or handle invalid domain
      //alert('Please use an e-likita.com email address only');
      callStatusDialog('error','Please use an e-likita.com email address only')
      // Optional: Clear the email or mark it as invalid
      setNewUser({ ...newUser, email: '' });
    }
  }}
  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring focus:ring-[#007664]/50 ${
    newUser?.email && !newUser.email.endsWith('@e-likita.com') ? 'border-red-500' : ''
  }`}
  placeholder="username@e-likita.com"
/>
{newUser?.email && !newUser.email.endsWith('@e-likita.com') && (
  <p className="mt-1 text-sm text-red-600">Email must be from e-likita.com domain</p>
)}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(registrationType === "existing" ? 2 : 1)}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={() => addUser(newUser)}
              className="rounded bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#007664]/80"
            disabled={isLoadings}
            >
              {isLoadings ? (
                  <span className="flex items-center">
                    <Loader size={16} className="mr-2 animate-spin" /> Saving...
                  </span>
                ) : (
              
               
              editingUser ? "Update User" : "Register User" )}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
      {showViewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">User Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedUser?.displayName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>Mobile Number:</strong> {selectedUser?.mobileNumber}
              </p>
              <p>
                <strong>Job Title:</strong> {selectedUser?.jobTitle}
              </p>
              <p>
                <strong>Location:</strong> {selectedUser?.location}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser?.role}
              </p>
              <p>
                <strong>Gender:</strong> {selectedUser?.gender}
              </p>
            </div>
            <button
              onClick={() => setShowViewUserModal(false)}
              className="mt-4 rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
    
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the user{" "}
              {userToDelete?.displayName}?
             
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userToDelete)}
                className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
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
{activeUserPage === "viewuser" && <StaffDetail selectedUser={selectedUser} id={selectedUser?.microsoftID} setActiveUserPage={setActiveUserPage} />}



</>
  );
}
