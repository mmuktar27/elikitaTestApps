"use client";
import { Settings } from "lucide-react";
import React from "react";

const SettingsComponent = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Settings</h2>
    <div className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
      <h3 className="mb-4 text-xl font-semibold text-[#007664]">Personal</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Change Password
          </label>
          <input
            type="password"
            placeholder="Current Password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50  focus:ring focus:ring-indigo-200/50 "
          />
          <input
            type="password"
            placeholder="New Password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50  focus:ring focus:ring-indigo-200/50 "
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50  focus:ring focus:ring-indigo-200/50 "
          />
          <button className="mt-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80 focus:outline-none focus:ring-2 focus:ring-[#007664] ">
            Update Password
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50  focus:ring focus:ring-indigo-200/50 ">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300/50  focus:ring focus:ring-indigo-200/50 ">
            <option value="en">English</option>
            <option value="yo">Yoruba</option>
            <option value="ha">Hausa</option>
          </select>
        </div>
      </div>
    </div>
    <button className="rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80 focus:outline-none focus:ring-2 focus:ring-[#007664] ">
      Save Settings
    </button>
  </div>
);

export default SettingsComponent;
