
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

export default function SampleCollection() {

  const [showRecordSampleModal, setShowRecordSampleModal] = useState(false);

    const [pendingCollections, setPendingCollections] = useState([
        {
          id: 'ORD-2025-001',
          patientName: 'John Doe',
          testType: 'Complete Blood Count',
          orderedDate: 'May 12, 2025'
        },
        {
          id: 'ORD-2025-004',
          patientName: 'Emily Wilson',
          testType: 'Glucose Test',
          orderedDate: 'May 14, 2025'
        }
      ]);
    
      const [collectionData, setCollectionData] = useState({
        orderId: 'ORD-2025-001',
        patientName: 'John Doe',
        testType: 'Complete Blood Count',
        sampleId: 'SAM-2025-001',
        collectionTime: '',
        notes: ''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCollectionData(prev => ({ ...prev, [name]: value || '' }));
      };
    

      return (
        <div className="space-y-6">
      <div className="space-y-4">
  <Card className="bg-[#75C05B]/10">
    <CardHeader>
      <h2 className="text-xl font-semibold">Sample Collection</h2>
      
      <div className="mt-4 flex">
        <div className="relative grow">
          <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
          <Input 
            placeholder="Search for patient or order ID..." 
            className="w-full rounded-l-md bg-white pl-8"
          />
        </div>
        <Button className="rounded-l-none bg-[#007664] text-white hover:bg-[#007664]/80">
          Search
        </Button>
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#007664] text-white">Order ID</TableHead>
              <TableHead className="bg-[#007664] text-white">Patient Name</TableHead>
              <TableHead className="bg-[#007664] text-white">Test Type</TableHead>
              <TableHead className="bg-[#007664] text-white">Ordered Date</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingCollections.map((collection) => (
              <TableRow 
                key={collection.id}
                className="transition-colors duration-200 hover:bg-green-50"
              >
                <TableCell>{collection.id}</TableCell>
                <TableCell>{collection.patientName}</TableCell>
                <TableCell>{collection.testType}</TableCell>
                <TableCell>{collection.orderedDate}</TableCell>
                <TableCell>
                  <Button 
                    className="bg-[#007664] text-sm text-white hover:bg-[#007664]/80"
                    onClick={() => {
                      setCollectionData({
                        ...collectionData,
                        orderId: collection.id,
                        patientName: collection.patientName,
                        testType: collection.testType
                      });
                      setShowRecordSampleModal(true);
                    }}
                  >
                    Record Collection
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
          
{showRecordSampleModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-md h-[500px] rounded-lg bg-white shadow-xl flex flex-col">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Record Sample Collection</h2>
        <button
          onClick={() => setShowRecordSampleModal(false)}
          className="hover:bg-white/20 rounded-full p-1"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto space-y-4 flex-1">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <input
              type="text"
              name="orderId"
              value={collectionData.orderId || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <input
              type="text"
              name="patientName"
              value={collectionData.patientName || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Test Type</label>
            <input
              type="text"
              name="testType"
              value={collectionData.testType || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sample ID</label>
            <input
              type="text"
              name="sampleId"
              value={collectionData.sampleId || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Collection Time</label>
            <input
              type="datetime-local"
              name="collectionTime"
              value={collectionData.collectionTime || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={collectionData.notes || ''}
            onChange={handleInputChange}
            rows="3"
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t pt-4 px-6 pb-6">
        <Button
          variant="outline"
          onClick={() => setShowAddItemModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#007664] hover:bg-[#006654] text-white"
          //onClick={handleSaveCollection}
        >
          Save Collection Record
        </Button>
      </div>
    </div>
  </div>
)}

        </div>
      );
    }
  