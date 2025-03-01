"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSystemSettings, useUpdateSystemSettings } from "@/hooks/admin";
import { useEffect, useState } from "react";

import {getSystemSettings, updatetSystemSettings } from "../shared/api";

import { StatusDialog } from "../shared";

export default function AdminSettings({currenUserId}) {
  const [isLoading, setisLoading] = useState(true);
  const [isUpdating, setisUpdating] = useState(false);

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

  // Local state for form inputs
  const [localSettings, setLocalSettings] = useState({});

  // Update local state when data is fetched
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setisLoading(true);
        const settings = await getSystemSettings();
        console.log('Loaded Settings:', settings);
  
        setLocalSettings(settings.data);
        setLocalSettings(prevState => ({
          ...prevState,
          lastUpdatedBy: currenUserId
      }));
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setisLoading(false); // Ensures it always runs
      }
    };
  
    loadSettings();
  }, [currenUserId]);
  

 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   console.log(localSettings)
 
     try {
      setisUpdating(true);
      await updatetSystemSettings(localSettings); // Ensure this function is async
      callStatusDialog('success', 'Settings Saved');
    } catch (error) {
      callStatusDialog('error', 'Failed to Save Settings');
    } finally {
      setisUpdating(false); // Ensure this always runs
    }

  
  };
  


  // Helper function to update specific setting
  const updateSetting = (key, value, session) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value, 
      lastUpdatedBy: currenUserId , // Always override
    }));

  };


  if (isLoading) {
    return (
      <div className="container mx-auto max-w-lg rounded-lg bg-white px-6 py-10 shadow-md">
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-200"></div>
  
        <div className="space-y-6">
          {/* Maintenance Mode Toggle Skeleton */}
      
          <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
        
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
           
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-14 animate-pulse rounded-full bg-gray-300"></div>
          </div>
          {/* Status Dialog Skeleton */}
          <div className="h-16 animate-pulse rounded-lg bg-gray-200"></div>
  
          {/* Save Button Skeleton */}
          <div className="text-right">
            <div className="h-10 w-32 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg rounded-lg bg-white px-6 py-10 shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Settings</h1>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name */}
        <div className="rounded-lg bg-gray-100 p-4">
  <Label htmlFor="organization-name" className="mb-2 block text-gray-700">
    Organization Name
  </Label>
  <Input
    id="organization-name"
    value={localSettings.organizationName || ""}
    onChange={(e) => updateSetting("organizationName", e.target.value)}
    className="w-full rounded border border-gray-300 p-2 focus:border-[#005a4f] focus:outline-none focus:ring-1 focus:ring-[#005a4f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#005a4f] focus-visible:ring-offset-0"
    style={{ outline: 'none' }}
    placeholder="Enter organization name"
  />
</div>

        {/* Session Timeout */}
        <div className="rounded-lg bg-gray-100 p-4">
  <Label htmlFor="session-timeout" className="mb-2 block text-gray-700">
    Session Timeout (minutes)
  </Label>
  <Input
    id="session-timeout"
    type="number"
    min="1"
    max="1440"
    value={localSettings.sessionTimeout || 30}
    onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value, 10))}
    className="w-full rounded border border-gray-300 p-2 focus:border-[#005a4f] focus:outline-none focus:ring-1 focus:ring-[#005a4f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#005a4f] focus-visible:ring-offset-0"
    style={{ outline: 'none' }}
  />
</div>

        {/* Maintenance Mode Toggle */}
        <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
          <Label htmlFor="maintenance-mode" className="text-gray-700">
            Maintenance Mode
          </Label>
          <Switch
            id="maintenance-mode"
            checked={localSettings.maintenanceMode}
            onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
            className="relative h-8 w-14 rounded-full bg-[#005a4f] transition-colors data-[state=checked]:bg-[#00443c]"
          >
            <span
              className={`absolute left-1 top-1 size-6 rounded-full bg-white shadow-md transition-transform${
                localSettings.maintenanceMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </Switch>
        </div>
        <StatusDialog
                        isOpen={statusDialog.isOpen}
                        onClose={() => {
                          setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                         
                        }}
                        status={statusDialog.status}
                        message={statusDialog.message}
                      />
        {/* Save Button */}
        <div className="text-right">
          <Button
            type="submit"
            disabled={isUpdating}
            className="mt-2 rounded bg-[#005a4f] px-6 py-2 font-semibold text-white transition-all hover:bg-[#00443c]"
          >
            {isUpdating ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
  
  
}
