"use client";

import React, { useState, useEffect ,useMemo } from "react";

import { ReferralsPage } from "@/components/doctor";
import { getCurrentUser } from "@/components/shared/api";
const Referral = () => {
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
              const user = await getCurrentUser('MICRO123456');
              setCurrentUser(user);
             
  
          } catch (error) {
              console.error('Failed to fetch user data');
          }
      };
  
      fetchCurrentUser();
  
  }, []);
  return <ReferralsPage  currentUser={currentUser}/>;
};

export default Referral;
