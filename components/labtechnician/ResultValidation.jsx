import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  X as CloseIcon,
  Edit,
  Eye,
  Filter,
  Info,
  Loader2,Activity,
  Search,AlertTriangle,
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
export default function ResultValidationTab() {
  const [testsForValidation, setTestsForValidation] = useState([
    {
      sampleId: 'SAM-2025-003',
      patientName: 'Jane Smith',
      testType: 'Lipid Panel',
      processedDate: 'May 10, 2025',
      status: 'Abnormal Results',
      statusClass: 'bg-yellow-100 text-yellow-800',
      bgClass: 'bg-yellow-50'
    },
    {
      sampleId: 'SAM-2025-004',
      patientName: 'Michael Brown',
      testType: 'Glucose Test',
      processedDate: 'May 11, 2025',
      status: 'Abnormal Results',
      statusClass: 'bg-yellow-100 text-yellow-800',
      bgClass: 'bg-yellow-50'
    },
    {
      sampleId: 'SAM-2025-002',
      patientName: 'Robert Johnson',
      testType: 'Urine Analysis',
      processedDate: 'May 13, 2025',
      status: 'Normal Results',
      statusClass: 'bg-green-100 text-green-800',
      bgClass: ''
    }
  ]);

  const [validationData, setValidationData] = useState({
    sampleId: 'SAM-2025-003',
    patientName: 'Jane Smith',
    testResults: [
      { name: 'Total Cholesterol', value: '240 mg/dL', range: '< 200 mg/dL', status: 'High', statusClass: 'bg-red-100 text-red-800' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', range: '> 40 mg/dL', status: 'Normal', statusClass: 'bg-green-100 text-green-800' },
      { name: 'LDL Cholesterol', value: '165 mg/dL', range: '< 100 mg/dL', status: 'High', statusClass: 'bg-red-100 text-red-800' },
      { name: 'Triglycerides', value: '150 mg/dL', range: '< 150 mg/dL', status: 'Borderline', statusClass: 'bg-yellow-100 text-yellow-800' }
    ],
    notes: '',
    action: ''
  });
  const [showValidationModal, setShowValidationModal] = useState(false);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationData(prev => ({ ...prev, [name]: value || '' }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
  <Card className="bg-[#75C05B]/10">
    <CardHeader>
      <h2 className="text-xl font-semibold">Result Validation</h2>
      
      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Attention!</strong> There are 2 test results that require validation.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex">
        <div className="relative grow">
          <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Search by sample ID or patient name..." 
            className="w-full bg-white pl-8 rounded-l-md"
          />
        </div>
        <Button className="rounded-l-none bg-[#007664] hover:bg-[#007664]/80 text-white">
          Search
        </Button>
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#007664] text-white">Sample ID</TableHead>
              <TableHead className="bg-[#007664] text-white">Patient Name</TableHead>
              <TableHead className="bg-[#007664] text-white">Test Type</TableHead>
              <TableHead className="bg-[#007664] text-white">Processed Date</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testsForValidation.map((test) => (
              <TableRow 
                key={test.sampleId}
                className={`transition-colors duration-200 hover:bg-green-50 ${test.bgClass || ''}`}
              >
                <TableCell>{test.sampleId}</TableCell>
                <TableCell>{test.patientName}</TableCell>
                <TableCell>{test.testType}</TableCell>
                <TableCell>{test.processedDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${test.statusClass}`}>
                    {test.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    className="bg-[#007664] hover:bg-[#007664]/80 text-white text-sm"
                    onClick={() => {
                      setValidationData({
                        ...validationData,
                        sampleId: test.sampleId,
                        patientName: test.patientName
                      });
                      setShowValidationModal(true);
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
  </div>
  {showValidationModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    {/* Modal container with fixed height */}
    <div 
      className="relative mx-4 my-6 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
    >
      {/* Close button */}
      <button
        onClick={() => setShowValidationModal(false)}
        className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Modal header - fixed */}
  
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-3 text-white rounded-t-lg">
        <div className="flex w-full items-center justify-center gap-3 text-2xl font-bold">
          <Activity className="size-6" />
          Result Review
        </div>
      </div>
      {/* Scrollable content area (now includes buttons at the bottom) */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample ID</label>
              <input 
                type="text" 
                value={validationData.sampleId || ''}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <input 
                type="text" 
                value={validationData.patientName || ''}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>
          </div>
          
          {/* Test results table */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Results</label>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {validationData.testResults.map((result) => (
                      <tr key={result.name}>
                        <td className="whitespace-nowrap px-4 py-2 text-sm">{result.name}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm">{result.value}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm">{result.range}</td>
                        <td className="whitespace-nowrap px-4 py-2">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${result.statusClass}`}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Validation Notes</label>
            <textarea 
              value={validationData.notes || ''}
              onChange={handleInputChange}
              rows="3" 
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter validation notes..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select 
              value={validationData.action || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Select Action</option>
              <option value="approve">Approve Results</option>
              <option value="retest">Request Re-Test</option>
              <option value="escalate">Escalate to Senior Staff</option>
            </select>
          </div>
          
          {/* Action buttons moved inside scrollable area */}
          <div className="border-t pt-6">
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="order-1 sm:order-none rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => setShowValidationModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
              >
                Request Re-Test
              </button>
              <button
                type="button"
                className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600"
              >
                Approve & Finalize
              </button>
              <button
                type="button"
                className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
              >
                Submit Review
              </button>
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