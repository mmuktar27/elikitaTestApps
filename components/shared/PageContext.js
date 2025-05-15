"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create a Context
const PageContext = createContext();

// Provide Context to the app
export const PageProvider = ({ children }) => {
  
  // Helper function to get value from localStorage safely
  const getLocalStorageItem = (key, defaultValue) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  };

  // Load states from localStorage or use defaults
  const [activeReferralsPage, setActiveReferralsPage] = useState(() =>
    getLocalStorageItem("activeReferralsPage", "referral")
  );

  const [activePatientsPage, setActivePatientsPage] = useState(() =>
    getLocalStorageItem("activePatientsPage", "patient")
  );

  const [activeAppointmentPage, setActiveAppointmentPage] = useState(() =>
    getLocalStorageItem("activeAppointmentPage", "appointment")
  );

  const [activeNavbar, setActiveNavbar] = useState(() =>
    getLocalStorageItem("activeNavbar", "dashboard")
  );

  const [activeUserPage, setActiveUserPage] = useState('users');

  const [userPrimaryRole, setUserPrimaryRole] = useState('')
  // Save state changes to localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeReferralsPage", activeReferralsPage);
    }
  }, [activeReferralsPage]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeAppointmentPage", activeAppointmentPage);
    }
  }, [activeAppointmentPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activePatientsPage", activePatientsPage);
    }
  }, [activePatientsPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeNavbar", activeNavbar);
    }
  }, [activeNavbar]);

  return (
    <PageContext.Provider
      value={{
        activeReferralsPage,
        setActiveReferralsPage,
        activePatientsPage,
        setActivePatientsPage,
        activeNavbar,
        setActiveNavbar,
        userPrimaryRole,
         setUserPrimaryRole,
         activeUserPage, 
         setActiveUserPage,
         activeAppointmentPage,
         setActiveAppointmentPage
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

// Custom hooks for each page
export const useReferralsPage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("useReferralsPage must be used within a PageProvider");
  }
  return {
    activeReferralsPage: context.activeReferralsPage,
    setActiveReferralsPage: context.setActiveReferralsPage,
  };
};


export const useCurrentUserDefaultRole = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("serPrimaryRole must be used within a PageProvider");
  }
  return {
    userPrimaryRole: context.userPrimaryRole,
    setUserPrimaryRole: context.setUserPrimaryRole,
  };
};



export const usePatientsPage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePatientsPage must be used within a PageProvider");
  }
  return {
    activePatientsPage: context.activePatientsPage,
    setActivePatientsPage: context.setActivePatientsPage,
  };
};


export const useAppointmentPage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePatientsPage must be used within a PageProvider");
  }
  return {
    activeAppointmentPage: context.activeAppointmentPage,
    setActiveAppointmentPage: context.setActiveAppointmentPage,
  };
};
// Custom hook for Navbar
export const useNavbar = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("useNavbar must be used within a PageProvider");
  }
  return {
    activeNavbar: context.activeNavbar,
    setActiveNavbar: context.setActiveNavbar,
  };
};



export const useUserPageNav = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("useNavbar must be used within a PageProvider");
  }
  return {
    activeUserPage: context.activeUserPage,
    setActiveUserPage: context.setActiveUserPage,
  };
};
