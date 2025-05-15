"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Eye, Edit, Trash2, Filter, X,Printer } from "lucide-react";
import { Activity, Pill, ClipboardList, Package, AlertTriangle, MessageSquare, Barcode } from 'lucide-react';

export function PharmacyManagement() {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDispensingModal, setShowDispensingModal] = useState(false);
  const [selectedPrescription , setSelectedPrescription ] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const [prescriptions, setPrescriptions] = useState([
    { id: 'RX-1001', patient: 'John Doe', date: '2023-11-15', status: 'Pending', drugs: ['Amoxicillin', 'Paracetamol'] },
    { id: 'RX-1002', patient: 'Jane Smith', date: '2023-11-16', status: 'Dispensed', drugs: ['Ibuprofen'] }
  ]);

  const [inventory, setInventory] = useState([
    { id: 'DRG-001', name: 'Amoxicillin', batch: 'B20231101', expiry: '2024-11-01', stock: 45, threshold: 10 },
    { id: 'DRG-002', name: 'Paracetamol', batch: 'B20231015', expiry: '2025-01-15', stock: 120, threshold: 50 }
  ]);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  // Sample interaction check function (you should replace with your real logic)
  function checkDrugInteractions(prescription) {
    // Return a string or array of interactions or null if none
    if (prescription?.length > 0) {
      return prescription?.join(", ");
    }
    return null;
  }
  const [selectedRx, setSelectedRx] = useState(null);
  function viewPrescriptionDetails(rx) {
    setSelectedRx(rx); 
    setShowDetails(!showDetails);
  }
  
  function handleNotesChange(e) {
    setNotes(e.target.value);
  }
  const handleDispense = (prescriptionId) => {
    // Implement dispensing logic here
    console.log(`Dispensing medication for prescription ${prescriptionId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#007664] py-4 text-white">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Drugs Request</h1>
        </div>
      </header>
  
      <main className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 font-medium ${activeTab === 'prescriptions' ? 'border-b-2 border-[#007664] text-[#007664]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5" />
              Prescriptions
            </div>
          </button>
         
        
        </div>
  
        {/* Tab Content */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <Card className="bg-[#75C05B]/10">
              <CardHeader>
                <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    <div className="relative max-w-64 grow">
                      <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                      <Input
                        placeholder="Search prescriptions..."
                        className="w-full bg-white pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1"
                          onClick={() => setSearchTerm("")}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="whitespace-nowrap shadow-sm"
                      onClick={() => setIsFilterOpen(true)}
                    >
                      <Filter className="mr-2 size-4" />
                      Filter
                    </Button>
                  </div>
                  
                </div>
              </CardHeader>
  
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-[#007664] text-white">ID</TableHead>
                        <TableHead className="bg-[#007664] text-white">Patient</TableHead>
                        <TableHead className="bg-[#007664] text-white">Date</TableHead>
                        <TableHead className="bg-[#007664] text-white">Medications</TableHead>
                        <TableHead className="bg-[#007664] text-white">Status</TableHead>
                        <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {prescriptions.length > 0 ? (
                        prescriptions.map((rx) => (
                          <TableRow
                            key={rx.id}
                            className="transition-colors duration-200 hover:bg-green-50"
                          >
                            <TableCell>{rx.id}</TableCell>
                            <TableCell>{rx.patient}</TableCell>
                            <TableCell>
                              {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }).format(new Date(rx.date))}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                {rx.drugs.join(", ")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                rx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                rx.status === 'Filled' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {rx.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-blue-600 hover:text-blue-700" 
                                  onClick={() => viewPrescriptionDetails(rx)}
                                >
                                  <Eye className="size-4" />
                                </Button>
                               
                                {rx.status === "Pending" && (
          <button
            type="button"
            onClick={() => {setShowDispenseModal(true)

                setSelectedRx(rx)
            }} // Changed from handleDispense
            className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
          >
            Dispense Medication
          </button>
        )}
                               
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-500"
                          >
                            No prescriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
  
       
      </main>
  
      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-md bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-[#007664]">New Prescription</h2>
              <button 
                onClick={() => setShowPrescriptionModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient</label>
                  <Input
                    placeholder="Patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Medications</label>
                <div className="space-y-2">
                  {medications.map((med, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Input placeholder="Drug name" />
                      </div>
                      <div className="col-span-2">
                        <Input placeholder="Dosage" />
                      </div>
                      <div className="col-span-3">
                        <Input placeholder="Instructions" />
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-2">
                    <Plus className="mr-2 size-4" />
                    Add Medication
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Additional instructions or notes"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowPrescriptionModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#007664] hover:bg-[#006654]">
                  Save Prescription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
   {/* Show prescription details and drug interactions */}
   {showDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div
      className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6" />
            <h2 className="text-xl font-bold">Prescription Details</h2>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="text-white hover:bg-white/20 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Prescription ID</p>
            <p className="text-sm text-gray-900">{selectedRx.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-sm ${
              selectedRx.status === 'Pending' ? 'text-yellow-600' :
              selectedRx.status === 'Filled' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {selectedRx.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Patient</p>
            <p className="text-sm text-gray-900">{selectedRx.patient}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-sm text-gray-900">
              {new Date(selectedRx.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Medications */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
          <ul className="list-disc pl-5 space-y-1">
            {selectedRx.drugs.map((drug, index) => (
              <li key={index} className="text-sm text-gray-700">
                {drug} {selectedRx.dosage && `(${selectedRx.dosage})`}
              </li>
            ))}
          </ul>
        </div>

        {/* Drug interactions */}
        <div className={`rounded-md p-3 ${
          checkDrugInteractions(selectedRx.drugs) ?
            'bg-red-50 border border-red-200' :
            'bg-green-50 border border-green-200'
        }`}>
          <p className={`font-medium ${
            checkDrugInteractions(selectedRx.drugs) ? 'text-red-600' : 'text-green-600'
          }`}>
            {checkDrugInteractions(selectedRx.drugs) ? 'Drug Interaction Alert' : 'No known drug interactions'}
          </p>
          {checkDrugInteractions(selectedRx.drugs) && (
            <p className="text-sm text-red-600 mt-1">
              {checkDrugInteractions(selectedRx.drugs)}
            </p>
          )}
        </div>

        {/* Notes Section */}
        {selectedRx.note && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
            <p className="text-sm text-gray-700">{selectedRx.note}</p>
          </div>
        )}

        {/* Input Note if Pending */}
       

        {/* Action Buttons */}
        <div className="border-t pt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setShowDetails(false)}
            className="order-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:order-none"
          >
            Close
          </button>
          {selectedRx.status === "Pending" && (
          <button
            type="button"
            onClick={() => setShowDispenseModal(true)} // Changed from handleDispense
            className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
          >
            Dispense Medication
          </button>
        )}
        </div>
      </div>
    </div>
  </div>
)}


{showDispenseModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div
      className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="h-6 w-6" /> {/* Assuming you have a pill icon */}
            <h2 className="text-xl font-bold">Dispense Medication</h2>
          </div>
          <button
            onClick={() => setShowDispenseModal(false)}
            className="text-white hover:bg-white/20 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Prescription: {selectedRx.id}</h3>
          <p className="text-sm text-gray-600">Patient: {selectedRx.patient}</p>
        </div>

        {/* Available Medications */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Available Medications</h4>
          <div className="space-y-4">
            {selectedRx.drugs.map((drug, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{drug}</p>
                  {selectedRx.dosage && <p className="text-sm text-gray-600">Dosage: {selectedRx.dosage}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-16 p-1 border rounded text-center"
                  />
                  <span className="text-sm text-green-600">In Stock</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Add Notes</label>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes on drug usage, side effects, etc."
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
       
        {/* Unavailable Medications (if any) */}
        {/* You would need logic to determine which meds are unavailable */}
        {true && ( // Replace with your actual condition
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Unavailable Medications</h4>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">Medication Name</p>
                  <p className="text-sm text-gray-600">Dosage: XXmg</p>
                </div>
                <span className="text-sm text-red-600">Out of Stock</span>
              </div>
            </div>
            <div className="mt-4">
              <button 
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {/* Print function */}}
              >
                <Printer className="h-4 w-4" />
                Print Prescription for Another Pharmacy
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t pt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setShowDispenseModal(false)}
            className="order-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:order-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              handleDispense(selectedRx.id);
              setShowDispenseModal(false);
            }}
            className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
          >
            Confirm Dispense
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-md bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#007664]">Prescription Details</h2>
                <p className="text-sm text-gray-500">{selectedPrescription.id}</p>
              </div>
              <button 
                onClick={() => setSelectedPrescription(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Patient Information</h3>
                  <p className="text-sm text-gray-700">{selectedPrescription.patient}</p>
                  <p className="text-sm text-gray-500">DOB: 01/15/1985</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Prescribing Physician</h3>
                  <p className="text-sm text-gray-700">Dr. Smith</p>
                  <p className="text-sm text-gray-500">License: MD123456</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Medications</h3>
                <ul className="space-y-3">
                  {selectedPrescription.drugs.map((drug, index) => (
                    <li key={index} className="rounded-md bg-gray-50 p-3">
                      <div className="font-medium">{drug}</div>
                      <div className="text-sm text-gray-500">1 tablet daily</div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Status</h3>
                  <p className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    selectedPrescription.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedPrescription.status === 'Filled' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPrescription.status}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Printer className="mr-2 size-4" />
                      Print
                    </Button>
                    {selectedPrescription.status === 'Pending' && (
                      <Button className="w-full bg-[#007664] hover:bg-[#006654]">
                        Mark as Filled
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}