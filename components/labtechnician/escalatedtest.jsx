"use client";
import { useState } from 'react';
import Head from 'next/head';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    X as CloseIcon,
    Edit,
    Eye,Activity,
    Filter,
    Info,
    Loader2,
    Search,
    Trash2,
    User,
    UserPlus
  } from "lucide-react";
  
  import { Input } from "@/components/ui/input";
  
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
export default function EscalatedTests() {
  // Sample escalated tests data
  const [escalatedTests, setEscalatedTests] = useState([
    {
      id: 'T-2023-045',
      patientName: 'John Doe',
      patientId: 'P-1001',
      testType: 'Lipid Panel',
      testDate: '2023-11-15',
      escalatedBy: 'Dr. Smith',
      escalationDate: '2023-11-16',
      escalationReason: 'Abnormal cholesterol levels requiring senior review',
      status: 'Pending Review',
      parameters: [
        { name: 'Total Cholesterol', value: '240 mg/dL', normalRange: '< 200 mg/dL', flag: 'High' },
        { name: 'LDL Cholesterol', value: '165 mg/dL', normalRange: '< 100 mg/dL', flag: 'High' },
        { name: 'HDL Cholesterol', value: '45 mg/dL', normalRange: '> 40 mg/dL', flag: 'Normal' }
      ]
    },
    // ... more test data
  ]);

  // Modal and review state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Open modal with test details
  const openTestModal = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  // Handle review submission
  const handleReviewSubmit = () => {
    const updatedTests = escalatedTests.map(test => {
      if (test.id === selectedTest.id) {
        return {
          ...test,
          status: reviewAction === 'approve' ? 'Approved' : 
                 reviewAction === 'retest' ? 'Re-Test Ordered' : 
                 'Further Evaluation Needed',
          reviewNotes,
          reviewedDate: new Date().toISOString().split('T')[0],
          reviewedBy: 'Senior Staff' // This would be the logged in user in a real app
        };
      }
      return test;
    });
    
    setEscalatedTests(updatedTests);
    setIsModalOpen(false);
    setReviewAction('');
    setReviewNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

   
<main className="container mx-auto px-4 py-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-[#007664]">Review Requests</h2>
    <div className="text-sm text-gray-500">
      {escalatedTests.filter(t => t.status === 'Pending Review').length} pending reviews
    </div>
  </div>

  <Card className="bg-[#75C05B]/10">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#007664] text-white">Test ID</TableHead>
              <TableHead className="bg-[#007664] text-white">Patient</TableHead>
              <TableHead className="bg-[#007664] text-white">Test Type</TableHead>
              <TableHead className="bg-[#007664] text-white">Escalated By</TableHead>
              <TableHead className="bg-[#007664] text-white">Date</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escalatedTests.length > 0 ? (
              escalatedTests.map(test => (
                <TableRow 
                  key={test.id} 
                  className={`transition-colors duration-200 hover:bg-green-50 ${
                    test.status === 'Pending Review' ? 'bg-yellow-50' : ''
                  }`}
                >
                  <TableCell>{test.id}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{test.patientName}</div>
                      <div className="text-gray-500">{test.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.escalatedBy}</TableCell>
                  <TableCell>{test.escalationDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      test.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                      test.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {test.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#007664] hover:text-[#007664]/80 flex items-center"
                        onClick={() => openTestModal(test)}
                      >
                        <Eye className="size-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</main>



        {/* Test Detail Modal */}
        {isModalOpen && selectedTest && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    {/* Modal container */}
    <div 
      className="relative mx-4 my-6 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient header with Activity icon */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-center gap-3">
          <Activity className="h-6 w-6" />
          <h2 className="text-xl font-bold">Test Details - {selectedTest.testType}</h2>
        </div>
      </div>

      {/* Close button - positioned over gradient header */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute right-4 top-4 z-10 rounded-full p-1 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Patient and Test Information */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Patient Information</h4>
            <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Name:</span> {selectedTest.patientName}</p>
              <p><span className="font-medium">ID:</span> {selectedTest.patientId}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Test Information</h4>
            <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Test ID:</span> {selectedTest.id}</p>
              <p><span className="font-medium">Test Date:</span> {selectedTest.testDate}</p>
              <p><span className="font-medium">Escalated By:</span> {selectedTest.escalatedBy}</p>
              <p><span className="font-medium">Escalation Date:</span> {selectedTest.escalationDate}</p>
            </div>
          </div>
        </div>
        
        {/* Escalation Reason */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Escalation Reason</h4>
          <p className="text-sm bg-yellow-50 p-3 rounded-md">{selectedTest.escalationReason}</p>
        </div>
        
        {/* Test Results Table */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Test Results</h4>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parameter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Result</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Normal Range</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {selectedTest.parameters.map(param => (
                  <tr key={param.name}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{param.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{param.value}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{param.normalRange}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        param.flag === 'High' ? 'bg-red-100 text-red-800' :
                        param.flag === 'Low' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {param.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Review Action (if pending) */}
        {selectedTest.status === 'Pending Review' && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Review Action</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select Action</option>
                  <option value="approve">Approve Results</option>
                  <option value="retest">Request Re-Test</option>
                  <option value="escalate">Further Evaluation Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Add review comments..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Review Outcome (if completed) */}
        {selectedTest.status !== 'Pending Review' && selectedTest.reviewNotes && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Review Outcome</h4>
            <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Action:</span> {selectedTest.status}</p>
              <p><span className="font-medium">Reviewed By:</span> {selectedTest.reviewedBy}</p>
              <p><span className="font-medium">Date:</span> {selectedTest.reviewedDate}</p>
              <p><span className="font-medium">Notes:</span> {selectedTest.reviewNotes}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal footer */}
      <div className="border-t bg-gray-50 px-6 py-4">
        {selectedTest.status === 'Pending Review' ? (
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReviewSubmit}
              disabled={!reviewAction}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                !reviewAction ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#007664] hover:bg-[#006654]'
              }`}
            >
              Submit Review
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}