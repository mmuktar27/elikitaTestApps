import React from "react";
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
import {createAuditLogEntry} from "./api";

function LogoutConfirmation({ isOpen, onClose, onConfirm ,currentUser}) {
  const router = useRouter();
  const auditData = {
    userId: currentUser,
    activityType: "Logout",
    entityId: currentUser,
    entityModel: "Staff",
    details: "User logged out successfully",
  };

  const SignOutUser = async () => {
    try {
      await signOut();
      await createAuditLogEntry(auditData);
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      router.push("/login");
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogDescription>
          Are you sure you want to log out? You will be redirected to the
          login page.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={SignOutUser}>
          Logout
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}

export default LogoutConfirmation;
