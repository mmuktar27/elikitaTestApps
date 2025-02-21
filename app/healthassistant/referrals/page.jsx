"use client";

import React, { useState, useEffect ,useMemo } from "react";
import {useSession } from "next-auth/react";
import { ReferralsPage } from "@/components/shared";
import { getCurrentUser } from "@/components/shared/api";
const Referral = () => {
  const session = useSession();
  const currentDashboard="healthcare assistant"
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
  return <ReferralsPage  currentUser={currentUser} currentDashboard={currentDashboard}/>;
};

export default Referral;
