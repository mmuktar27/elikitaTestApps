"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Mail,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateUser, useDeleteStaff, useGetStaff } from "@/hooks/admin";
import SkeletonCard from "../ui/skeletoncard";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import { ROLES } from "@/utils/roles";

export default function UserComponent() {
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [orgName, setOrgName] = useState("<Org>");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    mutate: createUser,
    isPending: createPending,
    isSuccess: createSuccess,
  } = useCreateUser();
  const { data: allStaff, isLoading } = useGetStaff();
  const { mutate: deleteStaff, isPending } = useDeleteStaff();

  useEffect(() => {
    if (!isLoading && allStaff?.data.success) {
      setUsers(allStaff?.data?.data);
    }
  }, [isLoading, allStaff]);

  const usersPerPage = 10;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const addUser = async (user) => {
    try {
      await createUser(user, {
        onSuccess: () => {
          setIsAddUserOpen(false);
          setShowAddUserModal(false);

          toast({
            title: "New User",
            description: "User successfully created.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create user.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async (user) => {
    try {
      await deleteStaff(user.microsoftID, {
        onSuccess: () => {
          setShowDeleteConfirmation(false);

          toast({
            title: "Delete User",
            description: "User successfully deleted.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete user.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const router = useRouter();

  if (!isHydrated || isLoading || users.length === 0) {
    return <SkeletonCard className="h-[600px] w-full" />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="rounded bg-[#007664] px-4 py-2 text-white transition-colors hover:bg-[#007664]/80"
        >
          Add New User
        </button>
      </div>

      <div className="rounded-lg bg-[#B24531]/10 p-6">
        <h3 className="mb-4 text-xl font-semibold text-[#B24531]">User List</h3>
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
            <thead className="bg-[#B24531] text-white">
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
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.workEmail}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.roles?.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role.toUpperCase()}
                      </Badge>
                    ))}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/users/${user.microsoftID}`)
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
  );
}
