"use client";
import { useGetStaff } from "@/hooks/admin";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const session = useSession();
  const { data } = useGetStaff();

  console.log("session", session);
  console.log("data", data);

  return <div>hello</div>;
};

export default Page;
