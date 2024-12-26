"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  CiMail as Mail,
  CiHeart as Heart,
  CiLock as Lock,
} from "react-icons/ci";

import { FaArrowRight as ArrowRight } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkLogin = (event) => {
    event.preventDefault();
    if (email === "admin@elikita.com" && password === "admin") {
      router.push("/admin");
    } else if (email === "hadmin@elikita.com" && password === "hadmin") {
      router.push("/healthadmin");
    } else if (email === "doctor@elikita.com" && password === 'doctor') {
      router.push("/doctor");
    } else {
      alert("Please enter valid credentials."); // Basic error handling
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex items-center justify-center bg-gradient-to-br from-[#AED56A] via-[#3BB3C1] to-[#007664] p-8 md:w-1/2">
        <div className="text-center text-white ">
          <Heart className="mx-auto mb-6 size-20 " />
          <h1 className=" mb-4 text-4xl font-bold">e-Likita</h1>
          <p className="text-xl">Your trusted telemedicine platform</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="mb-6 text-3xl font-bold text-[#007664]">
            Welcome Back
          </h2>
          <form className="space-y-6" onSubmit={checkLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg text-[#007664]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-5 text-[#3BB3C1]" />
                <input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="w-full rounded-md border border-[#3BB3C1] py-2 pl-10 pr-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#007664]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-lg text-[#007664]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-5 text-[#3BB3C1]" />
                <input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  className="w-full rounded-md border border-[#3BB3C1] py-2 pl-10 pr-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#007664]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-[#3BB3C1] text-[#3BB3C1] focus:ring-[#007664]"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-[#007664]"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-[#3BB3C1] transition-colors hover:text-[#007664]"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-[#3BB3C1] px-4 py-3 text-lg text-white transition-colors hover:bg-[#007664]"
            >
              Log in
              <ArrowRight className="ml-2 size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
