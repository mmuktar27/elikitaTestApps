"use client";

import { useState } from "react";
import TestOrders from "@/components/labtechnician/TestOrders";
import SampleCollection from "@/components/labtechnician/SampleCollection";
import TestProcessing from "@/components/labtechnician/TestProcessing";
import ResultValidation from "@/components/labtechnician/ResultValidation";
//import ColorPalette from "@/components/labtechnician/ColorPalette";

export function LabtestHome() {
  const [activeTab, setActiveTab] = useState("test-orders");

  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="container mx-auto p-4">
     
        
        <div className="mt-6 flex overflow-x-auto border-b border-gray-200">
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "test-orders"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("test-orders")}
          >
            Test Orders
          </button>
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "sample-collection"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("sample-collection")}
          >
            Sample Collection
          </button>
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "test-processing"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("test-processing")}
          >
            Test Processing
          </button>
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "result-validation"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("result-validation")}
          >
            Result Validation
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "test-orders" && <TestOrders />}
          {activeTab === "sample-collection" && <SampleCollection />}
          {activeTab === "test-processing" && <TestProcessing />}
          {activeTab === "result-validation" && <ResultValidation />}
        </div>
      </main>
    </div>
  );
}
