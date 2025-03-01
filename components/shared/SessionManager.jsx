"use client"; // Required for useEffect in Next.js app router

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react"; // If using NextAuth.js

const SessionManager = ({ timeout = 15, warningTime = 1 }) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkInactivity = () => {
      const elapsedTime = (Date.now() - lastActivity) / (60 * 1000);
      
      // If elapsed time exceeds timeout, sign out
      if (elapsedTime >= timeout) {
        signOut();
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

    // Only add activity listeners when warning is NOT showing
    const resetActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };

    // Check inactivity more frequently (every second) to update countdown
    const interval = setInterval(checkInactivity, 1000);
    
    // Track user interactions - only reset activity when warning is not shown
    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keypress", resetActivity);
    window.addEventListener("click", resetActivity);
    window.addEventListener("scroll", resetActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keypress", resetActivity);
      window.removeEventListener("click", resetActivity);
      window.removeEventListener("scroll", resetActivity);
    };
  }, [lastActivity, timeout, warningTime, showWarning]); // Added showWarning to dependencies

  // Handler for continuing the session
  const continueSession = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  // Handler for signing out
  const handleSignOut = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    signOut();
    
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