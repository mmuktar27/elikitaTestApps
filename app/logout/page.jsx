"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { createAuditLogEntry, updateHeartbeat } from "@/components/shared/api";
import { Loader2 } from "lucide-react";
import SkeletonCard from "@/components/ui/skeletoncard";

export default function LogoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      // If not logged in, redirect immediately
      if (!session || !session.user || !session.user.id) {
        router.push("/login");
        return;
      }

      const currentUser = session.user.id;

      try {
        const auditData = {
          userId: currentUser,
          activityType: "Logout",
          entityId: currentUser,
          entityModel: "Staff",
          details: "User logged out successfully",
        };

        // Sign out user session (NextAuth)
        await signOut({ redirect: false });

        // Log audit entry
        await createAuditLogEntry(auditData);

        // Update heartbeat
        await updateHeartbeat({ userId: currentUser, isActive: false });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        router.push("/login");
      }
    };

    if (status !== "loading") {
      performLogout();
    }
  }, [session, status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Processing logout…</p>
        <SkeletonCard />
     
    </div>
  );
}
