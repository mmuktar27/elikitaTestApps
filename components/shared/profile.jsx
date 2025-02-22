"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { updateStaff } from "@/components/shared/api";
import { StatusDialog } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BadgeIcon as IdCard,
  Loader2,
} from "lucide-react";

import API from "@/app/api/api";
import { useGetCurrentUser } from "@/hooks/staff";
import { toast } from "@/hooks/use-toast";

const initialUserState = {
  name: "",
  employmentId: "",
  jobTitle: "",
  department: "",
  roles: [],
  email: "",
  personalEmail: "",
  businessPhone: "",
  mobilePhone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  joinDate: "",
  avatarUrl: "",
};
const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-[#007664]">My Profile</h1>

      <div className="mb-6 rounded-lg bg-[#75C05B]/10 p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Skeleton className="size-32 rounded-full" />
          <div className="grow text-center md:text-left">
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-4 h-4 w-20" />
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-[#75C05B]/10 p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
        </div>

        <div className="rounded-lg bg-[#B24531]/10 p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-3 h-10 w-full" />
        </div>

        <div className="rounded-lg bg-[#8FD573]/10 p-6 md:col-span-2">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-3 h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
};

export default function ProfilePage({ currentUser }) {
  const session= useSession();
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  const [user, setUser] = useState(currentUser);
  const [isSaving, setIsSaving] = useState(false);
  

 
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        console.log("Fetching profile picture...");
        console.log("Session data:", session?.data);
    
        const accessToken = session?.data?.accessToken;
        const microsoftId = session?.data?.user?.microsoftId; // Azure AD Object ID
    
        if (!accessToken || !microsoftId) {
          console.error("Access token or Microsoft ID is missing!");
          return;
        }
    
        // Debug: Log Access Token
        console.log("Access Token:", accessToken);
    
        const response = await fetch(
          `https://graph.microsoft.com/v1.0/users/${microsoftId}/photo/$value`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
    
        console.log("Response status:", response.status);
    
        if (!response.ok) {
          throw new Error(`Failed to fetch image - ${response.statusText}`);
        }
    
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
    
        console.log("Image successfully fetched:", imageUrl);
        setProfileImage(imageUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    
    
  
    fetchProfilePicture();
  }, [session]);
  
  console.log("Profile Image URL:", profileImage);
  

  console.log(session?.data?.user?.image);
    console.log("session2", user);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading || !user) {
    return <ProfileSkeleton />;
  }


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

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving profile..."); // Log when save starts
    console.log("User data being sent:", user); // Log user data before sending

    try {
        const response = await updateStaff(user.microsoftID, user);
        console.log("Raw API Response:", response); // Log full response

        // Check if response is success
        if (response?.success) {
            setIsEditing(false);
            callStatusDialog("success", "Profile updated successfully");
            console.log("Profile updated successfully:", response.data);
        } else {
            console.warn("Update was successful but API returned false success:", response);
            callStatusDialog("warning", "Profile update might not have worked fully");
        }
    } catch (error) {
        console.error("Failed to update profile:", error);
        console.error("Error Response Data:", error.response?.data || "No response data");
        console.error("Error Status:", error.response?.status || "Unknown status");
        callStatusDialog("error", "Failed to update profile");
    } finally {
        setIsSaving(false);
        console.log("Save operation finished."); // Log when save ends
    }
};




  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-[#007664]">My Profile</h1>

      <Card className="mb-6 bg-[#75C05B]/10">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative">
              <Avatar className="size-32">
              <AvatarImage
  src={profileImage}
  alt={user?.firstName}
  className="size-full object-cover"
/>
<AvatarFallback>
  {user?.firstName?.split(" ").map((n) => n[0]).join("")}
  {user?.lastName?.[0] || ""}
</AvatarFallback>

              </Avatar>
            </div>

            <div className="grow text-center md:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-[#007664]">{user?.jobTitle}</p>
              <p className="text-sm text-gray-600">{user?.department}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                {user?.roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#007664] hover:bg-[#007664]/80"
              disabled={isSaving}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-[#75C05B]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#007664]">
              <IdCard size={20} />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employmentId">Employment ID</Label>
              <Input
                id="employmentId"
                name="employmentId"
                value={user?.employeeID}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={user?.jobTitle}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={user?.department}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                value={
                  user?.hireDate
                    ? new Date(user.hireDate).toISOString().substring(0, 10)
                    : ""
                }
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#B24531]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#B24531]">
              <Mail size={20} />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" name="email" value={user?.workEmail} disabled />
            </div>
            <div>
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                name="email"
                value={user?.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                name="businessPhone"
                value={user?.businessPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="mobilePhone">Mobile Phone</Label>
              <Input
                id="mobilePhone"
                name="mobilePhone"
                value={user?.mobilePhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
        <StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                       
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
        <Card className="bg-[#8FD573]/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#007664]">
              <MapPin size={20} />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={user?.streetAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={user?.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={user?.state}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={user?.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={user?.country}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={() => setIsEditing(false)}
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#007664] hover:bg-[#007664]/80"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
