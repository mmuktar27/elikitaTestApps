"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetStaff } from "@/hooks/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function AccessDeniedPage() {
  const session = useSession();
  const { data } = useGetStaff();

  console.log("session", session);
  console.log("data", data);
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold tracking-tight text-red-600">
            Access Denied
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-center">
            <Lock className="size-full text-red-600" />
          </div>
          <p className="text-center text-sm text-gray-600">
            If you believe this is an error, please contact the system
            administrator or try logging in again.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button asChild className="flex-1">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Link href="/contact-support">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
