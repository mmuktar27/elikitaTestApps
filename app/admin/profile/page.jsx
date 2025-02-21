"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ProfilePage } from "@/components/shared";
import { getCurrentUser } from "@/components/shared/api";

const Profile = () => {
  const session = useSession();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser(session?.data?.user?.microsoftId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };

    fetchCurrentUser();
  }, [session?.data?.user?.microsoftId]);
  return <ProfilePage currentUser={currentUser} />;
};

export default Profile;
