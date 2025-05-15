
import { useState } from 'react';

import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  X as CloseIcon,
  Edit,Activity ,
  Eye,
  Filter,
  Info,
  Loader2,Plus,
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


export default function TestProcessing() {
  
  
  const [pendingTests, setPendingTests] = useState([
    

  
  {
      sampleId: 'SAM-2025-001',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      collectionTime: 'May 12, 2025 10:30 AM',
      status: 'Awaiting Results',
      statusClass: 'bg-yellow-100 text-yellow-800'
    },
    {
      sampleId: 'SAM-2025-002',
      patientName: 'Robert Johnson',
      testType: 'Urine Analysis',
      collectionTime: 'May 13, 2025 2:15 PM',
      status: 'Awaiting Results',
      statusClass: 'bg-yellow-100 text-yellow-800'
    }
  ]);

// State
const [primaryParameter, setPrimaryParameter] = useState({
  name: "Primary Test Result", // Set your default parameter name
  value: "",
  range: "0-100" // Set your default range
});
const [additionalParameters, setAdditionalParameters] = useState([]);
const [showAddParameterModal, setShowAddParameterModal] = useState(false);
const [newParameterType, setNewParameterType] = useState("");
const [customParameterName, setCustomParameterName] = useState("");
const [customParameterRange, setCustomParameterRange] = useState("");

// Handlers
const handlePrimaryParameterChange = (value) => {
  setPrimaryParameter({...primaryParameter, value});
};

const handleAddParameter = () => {
  if (newParameterType === 'custom' && customParameterName) {
    setAdditionalParameters([...additionalParameters, {
      name: customParameterName,
      value: "",
      range: customParameterRange,
      isCustom: true
    }]);
  } else if (newParameterType && newParameterType !== 'custom') {
    const selectedParam = availableParameters.find(p => p.id === newParameterType);
    if (selectedParam) {
      setAdditionalParameters([...additionalParameters, {
        name: selectedParam.name,
        value: "",
        range: selectedParam.range,
        isCustom: false
      }]);
    }
  }
  setShowAddParameterModal(false);
  setNewParameterType("");
  setCustomParameterName("");
  setCustomParameterRange("");
};

const removeAdditionalParameter = (index) => {
  setAdditionalParameters(additionalParameters.filter((_, i) => i !== index));
};

const handleAdditionalParameterChange = (index, field, value) => {
  const updated = [...additionalParameters];
  updated[index][field] = value;
  setAdditionalParameters(updated);
};

 const [showTestProcessModal, setShowTestProcessModal] = useState(false);


  const [testResults, setTestResults] = useState({
    sampleId: 'SAM-2025-001',
    patientName: 'John Doe',
    testType: 'Complete Blood Count',
    parameters: [
      { name: 'WBC', value: '', range: '4.5-11.0 10^3/μL' },
      { name: 'RBC', value: '', range: '4.5-5.9 10^6/μL' },
      { name: 'Hemoglobin', value: '', range: '13.5-17.5 g/dL' },
      { name: 'Hematocrit', value: '', range: '41-53%' },
      { name: 'Platelets', value: '', range: '150-450 10^3/μL' }
    ],
    report: null,
    notes: ''
  });

  const handleParameterChange = (index, value) => {
    const updatedParameters = [...testResults.parameters];
    updatedParameters[index].value = value || '';
    setTestResults(prev => ({ ...prev, parameters: updatedParameters }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestResults(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleFileChange = (e) => {
    setTestResults(prev => ({ ...prev, report: e.target.files[0] || null }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Test Processing</h2>
        
        <div className="space-y-4">
  <Card className="bg-[#75C05B]/10">
    <CardHeader>
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
              <TableHead className="bg-[#007664] text-white">Collection Time</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTests.map((test) => (
              <TableRow 
                key={test.sampleId}
                className="transition-colors duration-200 hover:bg-green-50"
              >
                <TableCell>{test.sampleId}</TableCell>
                <TableCell>{test.patientName}</TableCell>
                <TableCell>{test.testType}</TableCell>
                <TableCell>{test.collectionTime}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${test.statusClass}`}>
                    {test.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    className="bg-[#007664] hover:bg-[#007664]/80 text-white text-sm"
                    onClick={() => {
                      setTestResults({
                        ...testResults,
                        sampleId: test.sampleId,
                        patientName: test.patientName,
                        testType: test.testType
                      });
                      setShowTestProcessModal(true);
                    }}
                  >
                    Enter Results
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
  </div></div>
      
  {showTestProcessModal && (
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
          <h2 className="text-xl font-bold">Enter Test Results</h2>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setShowTestProcessModal(false)}
        className="absolute right-4 top-4 z-10 rounded-full p-1 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <CloseIcon className="h-6 w-6" />
      </button>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Sample, Patient, and Test Info */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sample ID</label>
            <input 
              type="text" 
              name="sampleId"
              value={testResults.sampleId || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Patient</label>
            <input 
              type="text" 
              name="patientName"
              value={testResults.patientName || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Test Type</label>
            <input 
              type="text" 
              name="testType"
              value={testResults.testType || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            />
          </div>
        </div>
        
        {/* Primary Test Parameter */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">Primary Test Result</label>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Parameter</label>
                <input
                  type="text"
                  value={primaryParameter.name || ''}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Result</label>
                <input 
                  type="text" 
                  value={primaryParameter.value || ''}
                  onChange={(e) => handlePrimaryParameterChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter value"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Normal Range</label>
                <input
                  type="text"
                  value={primaryParameter.range || ''}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                />
              </div>
            </div>
          </div>
          

        </div>

        {/* Additional Parameters Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Additional Parameters</label>
            <button
              type="button"
              onClick={() => setShowAddParameterModal(true)}
              className="flex items-center gap-1 text-sm text-[#007664] hover:text-[#006654]"
            >
              <Plus className="h-4 w-4" />
              Add Parameter
            </button>
          </div>

          {additionalParameters.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parameter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Result</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Normal Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {additionalParameters.map((param, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{param.name}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <input 
                          type="text" 
                          value={param.value || ''}
                          onChange={(e) => handleAdditionalParameterChange(index, 'value', e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2"
                          placeholder="Enter value"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {param.isCustom ? (
                          <input 
                            type="text" 
                            value={param.range || ''}
                            onChange={(e) => handleAdditionalParameterChange(index, 'range', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2"
                            placeholder="Enter range"
                          />
                        ) : (
                          param.range
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <button
                          onClick={() => removeAdditionalParameter(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mb-4">
  <label className="mb-1 block text-sm font-medium text-gray-700">Result Status</label>
  <select
    value={primaryParameter.status || ''}
    onChange={(e) => handlePrimaryParameterChange(e.target.value)}
    className="w-full rounded-md border border-gray-300 p-2 text-sm"
  >
    <option value="">Select status</option>
    <option value="Normal">Normal</option>
    <option value="Abnormal">Abnormal</option>
    <option value="Critical">Critical</option>
    <option value="Inconclusive">Inconclusive</option>
    <option value="Pending">Pending</option>
  </select>
</div>
        {/* File Attachment */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Attach Scanned Report</label>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#007664] file:text-white
                hover:file:bg-[#006654]"
            />
          </div>
        </div>
        
        {/* Notes */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
          <textarea 
            name="notes"
            value={testResults.notes || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter any additional notes..."
          />
        </div>
        
        {/* Action Buttons */}
        <div className="border-t pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowTestProcessModal(false)}
              className="order-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:order-none"
            >
              Cancel
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600"
              >
                Flag for Review
              </button>
              <button
                type="button"
                //onClick={handleSaveResults}
                className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
              >
                Save Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Add Parameter Modal */}
{showAddParameterModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Test Parameter</h2>
          <button
            onClick={() => setShowAddParameterModal(false)}
            className="text-white hover:bg-white/20 rounded-full p-1"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Parameter</label>
          <select
            value={newParameterType}
            onChange={(e) => setNewParameterType(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">Select from list</option>
            {availableParameters.map((param) => (
              <option key={param.id} value={param.id}>{param.name}</option>
            ))}
            <option value="custom">Other (custom)</option>
          </select>
        </div>

        {newParameterType === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Parameter Name</label>
            <input
              type="text"
              value={customParameterName}
              onChange={(e) => setCustomParameterName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter parameter name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Normal Range (optional)</label>
          <input
            type="text"
            value={customParameterRange}
            onChange={(e) => setCustomParameterRange(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter normal range"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAddParameterModal(false)}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddParameter}
            className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
          >
            Add Parameter
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  
  ;


  </div>
)}