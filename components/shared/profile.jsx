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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUserState);
  const [isSaving, setIsSaving] = useState(false);

  console.log("session", session);

  useEffect(() => {
    const userData = {};
    if (userData) {
      setUser({
        name: userData?.name || "",
        employmentId: userData?.employmentId || "",
        jobTitle: userData?.jobTitle || "",
        department: userData?.department || "",
        roles: userData?.roles || [],
        email: userData?.email || "",
        personalEmail: userData?.personalEmail || "",
        businessPhone: userData?.businessPhone || "",
        mobilePhone: userData?.mobilePhone || "",
        streetAddress: userData?.streetAddress || "",
        city: userData?.city || "",
        state: userData?.state || "",
        zipCode: userData?.zipCode || "",
        country: userData?.country || "",
        joinDate: userData?.joinDate || "",
        avatarUrl: userData?.avatarUrl || "",
      });
    }
  }, []);

  /*  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#007664]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">
          Please sign in to view your profile
        </p>
        <Button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="bg-[#007664] hover:bg-[#007664]/80"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">Failed to load profile data</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#007664] hover:bg-[#007664]/80"
        >
          Retry
        </Button>
      </div>
    );
  } */

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await API.put("/staff/me", user);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
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
                  src={user.avatarUrl || "/placeholder-user.jpg"}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grow text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-[#007664]">{user.jobTitle}</p>
              <p className="text-sm text-gray-600">{user.department}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                {user.roles.map((role, index) => (
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
                value={user.employmentId}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={user.jobTitle}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={user.department}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                value={user.joinDate}
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
              <Label htmlFor="email">Business Email</Label>
              <Input id="email" name="email" value={user.email} disabled />
            </div>
            <div>
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                name="personalEmail"
                value={user.personalEmail}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                name="businessPhone"
                value={user.businessPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="mobilePhone">Mobile Phone</Label>
              <Input
                id="mobilePhone"
                name="mobilePhone"
                value={user.mobilePhone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

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
                value={user.streetAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={user.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={user.state}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={user.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={user.country}
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
