"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { updateHeartbeat } from "./api";

export default function HeartbeatManager() {
  const session = useSession();

  const sendHeartbeat = useCallback(async () => {
    try {
      const data = {
        userId: session?.data?.user?.id,
      };

      const result = await updateHeartbeat(data);
      //console.log("Heartbeat updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update heartbeat:", error.message);
    }
  }, [session?.data?.user?.id]); // Dependencies: only re-create if user data changes

  useEffect(() => {
    if (!session?.data?.user?.id) return;

    // Send heartbeat immediately
    sendHeartbeat();

    // Set up interval to send heartbeats every minute
    const interval = setInterval(sendHeartbeat, 60 * 1000);

    return () => clearInterval(interval);
  }, [sendHeartbeat, session?.data?.user?.id]); // Now only depends on sendHeartbeat

  return null; // This component doesn't render anything
}
