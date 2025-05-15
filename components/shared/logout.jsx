'use client'
import React from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {createAuditLogEntry,updateHeartbeat} from "./api";
import { Loader2 } from "lucide-react";

function LogoutConfirmation({ isOpen, onClose, onConfirm ,currentUser}) {
  const [loading, setLoading] = useState(false);
  const handleHeartbeatUpdate = async (currentUser) => {
    try {
      const data = {
        userId: currentUser, // Replace with actual user ID
        isActive: false, // Update as needed
      };
  
      const result = await updateHeartbeat(data);
      console.log("Heartbeat updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update heartbeat:", error.message);
    }
  };
  const router = useRouter();
  const auditData = {
    userId: currentUser,
    activityType: "Logout",
    entityId: currentUser,
    entityModel: "Staff",
    details: "User logged out successfully",
  };

  const SignOutUser = async () => {
    setLoading(true);
    try {

      await fetch("./api/clear-user-cache", { method: "POST" });
      await signOut();
      await createAuditLogEntry(auditData);
      await handleHeartbeatUpdate(currentUser);
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      router.push("/login");
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-[95%] max-w-md mx-auto p-4 sm:p-6">
      <DialogHeader>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogDescription>
          Are you sure you want to log out? You will be redirected to the
          login page.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          onClick={SignOutUser}  
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}

export default LogoutConfirmation;
