

"use client"; // Required for useEffect in Next.js app router

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// Assuming you have this function imported from your audit log service

const SessionManager = ({ timeout = 15, warningTime = 1,createAuditLogEntry,session }) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    // Check if session is expired based on expiry timestamp
    const checkSessionExpiry = async () => {
      if (session?.expires) {
        const now = new Date();
        const expiry = new Date(session.expires);
  
        if (expiry <= now) {
          console.warn("Session has expired. Auto-logging out...");
  
          if (session?.data?.user) {
            const auditData = {
              userId: session.data.user.id,
              activityType: "Logout",
              entityId: session.data.user.id,
              entityModel: "Staff",
              details: "Session expired - auto sign out"
            };
  
            try {
              await createAuditLogEntry(auditData);
              console.log("Audit log created successfully for expired session logout.");
            } catch (auditError) {
              console.error("Audit log failed during auto sign out:", auditError);
            }
          }
  
          await signOut();
        }
      }
    };
  
    // Call session expiry check on effect run
    checkSessionExpiry();
  
    // Function to handle forced logout with audit logging
    const performLogout = async () => {
      // Check if session data is available before creating audit log
      if (session?.data?.user) {
        const auditData = {
          userId: session.data.user.id,
          activityType: "Logout",
          entityId: session.data.user.id,
          entityModel: "Staff",
          details: "User force logout by session timeout"
        };
  
        try {
          await createAuditLogEntry(auditData);
          console.log("Audit log created successfully for session timeout.");
        } catch (auditError) {
          console.error("Audit log failed during session timeout:", auditError);
        }
      }
  
      // Proceed with sign out
      await signOut();
    };
  
    const checkInactivity = () => {
      const elapsedTime = (Date.now() - lastActivity) / (60 * 1000);
      
      // If elapsed time exceeds timeout, sign out
      if (elapsedTime >= timeout) {
        performLogout();
        return;
      }
      
      // If we're within the warning period
      if (elapsedTime >= timeout - warningTime) {
        setShowWarning(true);
        const secondsLeft = Math.ceil((timeout * 60 * 1000 - (Date.now() - lastActivity)) / 1000);
        setTimeRemaining(secondsLeft);
      } else {
        setShowWarning(false);
      }
    };
  
    // Enhanced activity reset that works across various scenarios
    const resetActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };
  
    // Visibility change event handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden (minimized, tab switched, or browser minimized)
        const hiddenTime = Date.now();
        
        // Listen for when the page becomes visible again
        const visibilityListener = () => {
          const timeHidden = (Date.now() - hiddenTime) / (60 * 1000);
          
          // If hidden longer than timeout, force logout
          if (timeHidden >= timeout) {
            performLogout();
          } else {
            // Reset activity if within timeout
            resetActivity();
          }
          
          // Remove the listener after checking
          document.removeEventListener('visibilitychange', visibilityListener);
        };
        
        document.addEventListener('visibilitychange', visibilityListener);
      }
    };
  
    // Handle browser/tab close
    const handleBeforeUnload = (e) => {
      // Store last activity in localStorage before closing
      localStorage.setItem('lastActivityBeforeClose', lastActivity.toString());
    };
  
    // Handle page show (when returning from closed tab/browser)
    const handlePageShow = (e) => {
      // Check if returning from a previous session
      const storedLastActivity = localStorage.getItem('lastActivityBeforeClose');
      if (storedLastActivity) {
        const lastActivityTime = parseInt(storedLastActivity, 10);
        const timeSinceLastActivity = (Date.now() - lastActivityTime) / (60 * 1000);
        
        // If time exceeded timeout, force logout
        if (timeSinceLastActivity >= timeout) {
          performLogout();
        }
        
        // Clear the stored last activity
        localStorage.removeEventListener('lastActivityBeforeClose');
      }
    };
  
    // Check inactivity more frequently (every second) to update countdown
    const interval = setInterval(checkInactivity, 1000);
    
    // Track user interactions - only reset activity when warning is not shown
    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keypress", resetActivity);
    window.addEventListener("click", resetActivity);
    window.addEventListener("scroll", resetActivity);
    
    // Add visibility and unload event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);
  
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keypress", resetActivity);
      window.removeEventListener("click", resetActivity);
      window.removeEventListener("scroll", resetActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [lastActivity, timeout, warningTime, showWarning, session, createAuditLogEntry]);
  

  // Updated continue and sign out handlers to include audit logging
  const continueSession = (e) => {
    e.stopPropagation();
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  const handleSignOut = async (e) => {
    e.stopPropagation();
    
    // Check if session data is available before creating audit log
    if (session?.data?.user) {
      const auditData = {
        userId: session.data.user.id,
        activityType: "Logout",
        entityId: session.data.user.id,
        entityModel: "Staff",
        details: "User manually signed out"
      };
  
      try {
        await createAuditLogEntry(auditData);
        console.log("Audit log created successfully for manual sign out.");
      } catch (auditError) {
        console.error("Audit log failed during manual sign out:", auditError);
      }
    }

    // Proceed with sign out
    await signOut();
  };

  // Render warning modal when needed
  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-red-600">Session Timeout Warning</h2>
        <p className="mb-4">
          Your session is about to expire due to inactivity.
        </p>
        <p className="mb-6 text-lg font-semibold">
          You will be signed out in: <span className="text-red-600">{timeRemaining} seconds</span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSignOut}
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Sign out now
          </button>
          <button
            onClick={continueSession}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Continue session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;

