"use client";
import React from 'react'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">
      <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <svg
            className="size-16 animate-bounce text-[#005a4f]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M20.24 9H3.76a2 2 0 00-1.79 2.895l8.24 10.106a2 2 0 003.58 0l8.24-10.106A2 2 0 0020.24 9z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#005a4f]">We are Under Maintenance</h1>

        {/* Description */}
        <p className="mt-2 text-gray-600">
          E-likita is currently undergoing routine maintenance. We appreciate your patience and will be back soon.
        </p>

        {/* Animated Loader */}
        <div className="mt-6 flex items-center justify-center">
          <div className="size-5 animate-ping rounded-full bg-[#005a4f]"></div>
        </div>

        {/* Contact Info */}
        <p className="mt-4 text-sm text-gray-500">
          Need urgent support? Contact us at{" "}
          <a href="mailto:support@e-likita.com" className="font-semibold text-[#005a4f] underline">
            support@e-likita.com
          </a>
        </p>
      </div>
    </div>
  );
}

