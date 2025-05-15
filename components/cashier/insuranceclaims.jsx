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
  Clock,
  Filter,
  User,
  Download,
  ChevronLeft,
  ChevronRight
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function InsuranceClaims() {
  // State management
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const claimsPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // Simulate API call
        const mockClaims = [
          {
            id: 'IC-2023-001',
            patientName: 'Kwame Asante',
            provider: 'National Health Insurance',
            serviceDate: '2023-06-15',
            serviceType: 'Consultation',
            amount: 'GHS 150.00',
            status: 'Approved',
            lastUpdated: '2023-06-17 10:30 AM',
            claimDate: '2023-06-16',
            processedDate: '2023-06-17',
            notes: 'Approved for full amount'
          },
          {
            id: 'IC-2023-002',
            patientName: 'Ama Mensah',
            provider: 'Acme Health Insurance',
            serviceDate: '2023-06-14',
            serviceType: 'Lab Test',
            amount: 'GHS 250.00',
            status: 'Pending',
            lastUpdated: '2023-06-16 02:15 PM',
            claimDate: '2023-06-15',
            processedDate: null,
            notes: 'Awaiting provider approval'
          },
          {
            id: 'IC-2023-003',
            patientName: 'Yaw Boateng',
            provider: 'Ghana Health Insurance',
            serviceDate: '2023-06-13',
            serviceType: 'Pharmacy',
            amount: 'GHS 120.00',
            status: 'Rejected',
            lastUpdated: '2023-06-15 09:45 AM',
            claimDate: '2023-06-14',
            processedDate: '2023-06-15',
            notes: 'Service not covered by plan'
          },
          // Add more mock claims...
        ];
        
        setTimeout(() => {
          setClaims(mockClaims);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Calculate summary counts
  const summaryCounts = claims.reduce((acc, claim) => {
    acc.total++;
    if (claim.status === 'Approved') acc.approved++;
    if (claim.status === 'Pending') acc.pending++;
    if (claim.status === 'Rejected') acc.rejected++;
    return acc;
  }, { total: 0, approved: 0, pending: 0, rejected: 0 });

  // Filter claims based on search term and status filter
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      claim.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - claimsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstClaim, indexOfLastClaim);
  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage);

  // Handle view claim details
  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetails(true);
  };

  // Handle print claim
  const handlePrintClaim = (claim) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Insurance Claim - ${claim.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #007664; }
            .document-title { font-size: 20px; margin: 10px 0; }
            .claim-info { margin: 15px 0; }
            .claim-info table { width: 100%; border-collapse: collapse; }
            .claim-info th, .claim-info td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .status { 
              display: inline-block; 
              padding: 2px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              font-weight: bold;
              ${claim.status === 'Approved' ? 'background-color: #dcfce7; color: #166534;' : 
               claim.status === 'Pending' ? 'background-color: #fef9c3; color: #854d0e;' : 
               'background-color: #fee2e2; color: #991b1b;'}
            }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">E-likita</div>
            <div class="document-title">INSURANCE CLAIM DETAILS</div>
            <div>Printed: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="claim-info">
            <table>
              <tr>
                <th>Claim ID:</th>
                <td>${claim.id}</td>
              </tr>
              <tr>
                <th>Patient Name:</th>
                <td>${claim.patientName}</td>
              </tr>
              <tr>
                <th>Insurance Provider:</th>
                <td>${claim.provider}</td>
              </tr>
              <tr>
                <th>Service Date:</th>
                <td>${claim.serviceDate}</td>
              </tr>
              <tr>
                <th>Service Type:</th>
                <td>${claim.serviceType}</td>
              </tr>
              <tr>
                <th>Claim Amount:</th>
                <td>${claim.amount}</td>
              </tr>
              <tr>
                <th>Claim Date:</th>
                <td>${claim.claimDate}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td><span class="status">${claim.status}</span></td>
              </tr>
              ${claim.processedDate ? `
                <tr>
                  <th>Processed Date:</th>
                  <td>${claim.processedDate}</td>
                </tr>
              ` : ''}
              ${claim.notes ? `
                <tr>
                  <th>Notes:</th>
                  <td>${claim.notes}</td>
                </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="footer">
            Thank you for choosing our clinic<br>
            Contact: billing@clinic.com | Phone: +233 XX XXX XXXX
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

  // Handle export report
  const handleExportReport = () => {
    // This would typically generate a CSV or PDF
    console.log("Exporting claims report...");
    alert('Export functionality would be implemented here');
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
            <h3 className="text-sm font-medium text-red-800">Error loading claims</h3>
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
      {/* Claim Details Dialog */}
      {showClaimDetails && selectedClaim && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div
      className="relative mx-4 my-6 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Claim Details - {selectedClaim?.id}
            </h2>
            <p className="text-sm opacity-90">
              Detailed information about this insurance claim
            </p>
          </div>
          {/* Close Button */}
          <button
            onClick={() => setShowClaimDetails(false)}
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
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">Patient Information</h3>
            <div className="border rounded-md p-4 space-y-2 bg-gray-50">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient Name:</span>
                <span className="font-medium">{selectedClaim.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Date:</span>
                <span>{selectedClaim.serviceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span>{selectedClaim.serviceType}</span>
              </div>
            </div>
          </div>

          {/* Claim Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">Claim Information</h3>
            <div className="border rounded-md p-4 space-y-2 bg-gray-50">
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Provider:</span>
                <span className="font-medium">{selectedClaim.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Claim Amount:</span>
                <span className="font-medium">{selectedClaim.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                    selectedClaim.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : selectedClaim.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedClaim.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-800">Timeline</h3>
          <div className="border rounded-md p-4 space-y-2 bg-gray-50">
            <div className="flex justify-between">
              <span className="text-gray-600">Claim Date:</span>
              <span>{selectedClaim.claimDate}</span>
            </div>
            {selectedClaim.processedDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Processed Date:</span>
                <span>{selectedClaim.processedDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span>{selectedClaim.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {selectedClaim.notes && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">Notes</h3>
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-gray-700">{selectedClaim.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


      <div className="space-y-6">
        <div className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Insurance Claims</h2>
          
      
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative grow max-w-md">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Search claims..." 
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
              <Button 
                className="bg-[#007664] hover:bg-[#007664]/80 text-white"
                onClick={() => alert('New claim functionality would be implemented here')}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                New Claim
              </Button>
              <Button 
                variant="outline"
                className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                onClick={handleExportReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {filteredClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No claims found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No insurance claims available'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-[#007664] text-white">Claim ID</TableHead>
                      <TableHead className="bg-[#007664] text-white">Patient</TableHead>
                      <TableHead className="bg-[#007664] text-white">Provider</TableHead>
                      <TableHead className="bg-[#007664] text-white">Service Date</TableHead>
                      <TableHead className="bg-[#007664] text-white">Amount</TableHead>
                      <TableHead className="bg-[#007664] text-white">Status</TableHead>
                      <TableHead className="bg-[#007664] text-white">Last Updated</TableHead>
                      <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentClaims.map((claim) => (
                      <TableRow key={claim.id} className="hover:bg-green-50">
                        <TableCell>{claim.id}</TableCell>
                        <TableCell>{claim.patientName}</TableCell>
                        <TableCell>{claim.provider}</TableCell>
                        <TableCell>{claim.serviceDate}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            claim.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {claim.status === 'Pending' ? (
                              <Clock className="mr-1 h-3 w-3" />
                            ) : claim.status === 'Approved' ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {claim.status}
                          </span>
                        </TableCell>
                        <TableCell>{claim.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-[#007664] hover:bg-[#007664]/80 text-white"
                              onClick={() => handleViewClaim(claim)}
                            >
                              {claim.status === 'Pending' ? 'Track' : 'View'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                              onClick={() => handlePrintClaim(claim)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstClaim + 1} to{' '}
                  {Math.min(indexOfLastClaim, filteredClaims.length)} of{' '}
                  {filteredClaims.length} claims
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}