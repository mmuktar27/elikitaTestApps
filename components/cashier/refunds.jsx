"use client";
import { useState, useEffect } from 'react';
import {
  Search,
  Printer,
  FilePlus,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,Filter,
  User
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function RefundPage() {
  // State management
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [action, setAction] = useState('approve'); // 'approve' or 'reject'

  // Fetch refunds data
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        // Simulate API call
        const mockRefunds = [
          {
            id: 'REF-2023-001',
            originalTransaction: 'TXN-2023-015',
            patientName: 'Kwame Asante',
            type: 'refund',
            amount: 'GHS 150.00',
            status: 'Pending',
            authorizedBy: null,
            date: '2023-06-15',
            reason: 'Service not rendered'
          },
          {
            id: 'REF-2023-002',
            originalTransaction: 'TXN-2023-016',
            patientName: 'Ama Mensah',
            type: 'adjustment',
            amount: 'GHS 75.00',
            status: 'Approved',
            authorizedBy: 'Dr. Osei',
            date: '2023-06-14',
            reason: 'Price adjustment'
          },
          {
            id: 'REF-2023-003',
            originalTransaction: 'TXN-2023-017',
            patientName: 'Yaw Boateng',
            type: 'refund',
            amount: 'GHS 200.00',
            status: 'Rejected',
            authorizedBy: 'Dr. Osei',
            date: '2023-06-13',
            reason: 'Patient cancellation'
          },
          {
            id: 'REF-2023-004',
            originalTransaction: 'TXN-2023-018',
            patientName: 'Esi Coleman',
            type: 'adjustment',
            amount: 'GHS 50.00',
            status: 'Pending',
            authorizedBy: null,
            date: '2023-06-12',
            reason: 'Discount application'
          }
        ];
        
        setTimeout(() => {
          setRefunds(mockRefunds);
          setLoading(false);
        }, 800); // Simulate network delay
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Filter refunds based on search term and status filter
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.originalTransaction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      refund.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Handle process refund click
  const handleProcessClick = (refund, actionType) => {
    setSelectedRefund(refund);
    setAction(actionType);
    setShowProcessDialog(true);
  };

  // Confirm refund processing
  const confirmProcessRefund = () => {
    // Update refund status
    setRefunds(refunds.map(refund => 
      refund.id === selectedRefund.id 
        ? { 
            ...refund, 
            status: action === 'approve' ? 'Approved' : 'Rejected',
            authorizedBy: 'Current User' // Replace with actual user
          } 
        : refund
    ));
    setShowProcessDialog(false);
  };

  // Handle print receipt
  const handlePrintRefund = (refund) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Refund - ${refund.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #007664; }
            .document-title { font-size: 20px; margin: 10px 0; }
            .refund-info { margin: 15px 0; }
            .refund-info table { width: 100%; border-collapse: collapse; }
            .refund-info th, .refund-info td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .reason { margin: 20px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">Your Clinic Name</div>
            <div class="document-title">${refund.type === 'refund' ? 'REFUND' : 'ADJUSTMENT'} DOCUMENT</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="refund-info">
            <table>
              <tr>
                <th>Reference ID:</th>
                <td>${refund.id}</td>
              </tr>
              <tr>
                <th>Original Transaction:</th>
                <td>${refund.originalTransaction}</td>
              </tr>
              <tr>
                <th>Patient Name:</th>
                <td>${refund.patientName}</td>
              </tr>
              <tr>
                <th>Type:</th>
                <td>${refund.type.charAt(0).toUpperCase() + refund.type.slice(1)}</td>
              </tr>
              <tr>
                <th>Amount:</th>
                <td>${refund.amount}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>${refund.status}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>${refund.date}</td>
              </tr>
              <tr>
                <th>Authorized By:</th>
                <td>${refund.authorizedBy || 'Pending'}</td>
              </tr>
            </table>
          </div>
          
          <div class="reason">
            <strong>Reason:</strong><br>
            ${refund.reason}
          </div>
          
          <div class="footer">
            Thank you for choosing our clinic<br>
            Contact: clinic@example.com | Phone: +233 XX XXX XXXX
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#007664]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading refunds</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="border-red-400 text-red-700 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Process Refund Dialog */}
      {showProcessDialog && selectedRefund && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div
      className="relative mx-4 my-6 w-full max-w-lg rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {action === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </h2>
            <p className="text-sm opacity-90">
              {action === 'approve'
                ? 'Are you sure you want to approve this refund? This action cannot be undone.'
                : 'Are you sure you want to reject this refund? This action cannot be undone.'}
            </p>
          </div>
          <button
            onClick={() => setShowProcessDialog(false)}
            className="rounded-full p-1 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Refund ID:</span>
            <span className="font-medium">{selectedRefund.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{selectedRefund.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{selectedRefund.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Reason:</span>
            <span className="font-medium">{selectedRefund.reason}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setShowProcessDialog(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmProcessRefund}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              action === 'approve'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      <div className="space-y-6">
        <div className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Refunds & Adjustments</h2>
          
          <div className="space-y-4">
            <Card className="bg-[#75C05B]/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative grow max-w-md">
                    <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Search by transaction ID or patient..." 
                      className="w-full bg-white pl-8 rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-[#007664] hover:bg-[#007664]/80 text-white">
                      <FilePlus className="mr-2 h-4 w-4" />
                      New Adjustment
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredRefunds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Filter className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No refunds found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'No refunds or adjustments available'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#007664] text-white">Reference</TableHead>
                          <TableHead className="bg-[#007664] text-white">Original Transaction</TableHead>
                          <TableHead className="bg-[#007664] text-white">Patient</TableHead>
                          <TableHead className="bg-[#007664] text-white">Type</TableHead>
                          <TableHead className="bg-[#007664] text-white">Amount</TableHead>
                          <TableHead className="bg-[#007664] text-white">Status</TableHead>
                          <TableHead className="bg-[#007664] text-white">Authorized By</TableHead>
                          <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRefunds.map((refund) => (
                          <TableRow key={refund.id} className="hover:bg-green-50">
                            <TableCell>{refund.id}</TableCell>
                            <TableCell>{refund.originalTransaction}</TableCell>
                            <TableCell>{refund.patientName}</TableCell>
                            <TableCell>
                              <span className="capitalize">{refund.type}</span>
                            </TableCell>
                            <TableCell>{refund.amount}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                refund.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {refund.status === 'Pending' ? (
                                  <Clock className="mr-1 h-3 w-3" />
                                ) : refund.status === 'Approved' ? (
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3" />
                                )}
                                {refund.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {refund.authorizedBy ? (
                                <span className="inline-flex items-center">
                                  <User className="mr-1 h-3 w-3" />
                                  {refund.authorizedBy}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {refund.status === 'Pending' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleProcessClick(refund, 'approve')}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-600 hover:bg-red-50"
                                      onClick={() => handleProcessClick(refund, 'reject')}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                                    onClick={() => handlePrintRefund(refund)}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}