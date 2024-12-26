"use client";

import React from "react";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthCheck = ({ children }) => {
  const token = Cookies.get("elktoken");
  const userCookie = Cookies.get("elkuser");
  //const user = userCookie ? JSON.parse(userCookie) : null;
  const router = useRouter();

  useEffect(() => {
    if (!token || token === "undefined") {
      router.push(`/login?from=${router.pathname}`);
    }
  }, [router, token]);

  return children;
};

export default AuthCheck;
