"use client";

import React, { useState, useEffect ,useMemo } from "react";
import {useSession } from "next-auth/react";
import EscalatedTests from "@/components/labtechnician/escalatedtest";

import { getCurrentUser } from "@/components/shared/api";

const EscalatedTest = () => {
  const session = useSession();
  const currentDashboard="doctor"
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
              const user = await getCurrentUser(session?.data?.user?.microsoftId);
              setCurrentUser(user);
             
  
          } catch (error) {
              console.error('Failed to fetch user data');
          }
      };
  
      fetchCurrentUser();
  
  }, [session?.data?.user?.microsoftId]);
  return (
    <>
     <EscalatedTests  />;
    </>
  )
};

export default EscalatedTest;
