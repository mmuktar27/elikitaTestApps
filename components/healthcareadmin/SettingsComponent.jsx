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

export default function AdminSettings() {
  const { data: systemSettings, isLoading } = useGetSystemSettings();

  // Mutation hook for updating settings
  const { mutate: updateSettings, isPending: isUpdating } =
    useUpdateSystemSettings();

  // Local state for form inputs
  const [localSettings, setLocalSettings] = useState({
    emrSystemName: "",
    organizationName: "",
    defaultTimezone: "UTC",
    maintenanceMode: false,
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (systemSettings) {
      setLocalSettings(systemSettings.data.data);
    }
  }, [systemSettings]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(localSettings);
  };

  // Helper function to update specific setting
  const updateSetting = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">EMR Admin Settings</h1>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general EMR settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emr-name">EMR System Name</Label>
                  <Input
                    id="emr-name"
                    placeholder="Enter EMR system name"
                    value={localSettings.emrSystemName}
                    onChange={(e) =>
                      updateSetting("emrSystemName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input
                    id="organization"
                    placeholder="Enter organization name"
                    value={localSettings.organizationName}
                    onChange={(e) =>
                      updateSetting("organizationName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select
                    value={localSettings.defaultTimezone}
                    onValueChange={(value) =>
                      updateSetting("defaultTimezone", value)
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance-mode"
                    checked={localSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      updateSetting("maintenanceMode", checked)
                    }
                  />
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage security and access control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select>
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="very-strong">Very Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input id="session-timeout" type="number" placeholder="30" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="mt-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
            >
              {isUpdating ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
