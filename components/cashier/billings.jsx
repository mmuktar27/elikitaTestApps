"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Search,
  Printer,
  FilePlus,
  AlertCircle,
  Loader2,
  CreditCard,
  Wallet,
  Banknote,
  X as CloseIcon
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

export default function BillingPage() {
  // State management
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const printRef = useRef();

  // Payment methods
  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: <Banknote className="h-5 w-5" /> },
    { id: 'transfer', name: 'Bank Transfer', icon: <Wallet className="h-5 w-5" /> },
    { id: 'online', name: 'Online Payment', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'mobile', name: 'Mobile Money', icon: <Wallet className="h-5 w-5" /> }
  ];

  // Fetch bills data
  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Simulate API call
        const mockBills = [
          {
            id: 'BIL-001',
            patientName: 'Kwame Asante',
            services: [
              { id: 'LAB-001', name: 'Blood Test' },
              { id: 'CON-001', name: 'Consultation' }
            ],
            date: '2023-06-15',
            amount: 'GHS 250.00',
            status: 'Paid'
          },
          {
            id: 'BIL-002',
            patientName: 'Ama Mensah',
            services: [
              { id: 'PHA-001', name: 'Medication' }
            ],
            date: '2023-06-16',
            amount: 'GHS 120.00',
            status: 'Pending'
          },
          {
            id: 'BIL-003',
            patientName: 'Yaw Boateng',
            services: [
              { id: 'LAB-002', name: 'Urine Test' },
              { id: 'CON-001', name: 'Consultation' },
              { id: 'PHA-002', name: 'Prescription' }
            ],
            date: '2023-06-17',
            amount: 'GHS 380.00',
            status: 'Pending'
          }
        ];
        
        setTimeout(() => {
          setBills(mockBills);
          setLoading(false);
        }, 800); // Simulate network delay
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Filter bills based on search term
  const filteredBills = bills.filter(bill => {
    const searchLower = searchTerm.toLowerCase();
    return (
      bill.id.toLowerCase().includes(searchLower) ||
      bill.patientName.toLowerCase().includes(searchLower) ||
      bill.services.some(service => 
        service.name.toLowerCase().includes(searchLower))
    );
  });

  // Handle print bill
  const handlePrintBill = (bill) => {
    setSelectedBill(bill);
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill Receipt - ${bill.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .clinic-name { font-size: 24px; font-weight: bold; color: #007664; }
              .receipt-title { font-size: 20px; margin: 10px 0; }
              .bill-info { margin: 15px 0; }
              .bill-info table { width: 100%; border-collapse: collapse; }
              .bill-info th, .bill-info td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              .services { margin: 20px 0; }
              .services table { width: 100%; border-collapse: collapse; }
              .services th { background-color: #007664; color: white; padding: 10px; text-align: left; }
              .services td { padding: 8px; border-bottom: 1px solid #ddd; }
              .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="clinic-name">E-likita</div>
              <div class="receipt-title">BILL RECEIPT</div>
              <div>Date: ${new Date().toLocaleDateString()}</div>
            </div>
            
            <div class="bill-info">
              <table>
                <tr>
                  <th>Bill ID:</th>
                  <td>${bill.id}</td>
                </tr>
                <tr>
                  <th>Patient Name:</th>
                  <td>${bill.patientName}</td>
                </tr>
                <tr>
                  <th>Date:</th>
                  <td>${bill.date}</td>
                </tr>
              </table>
            </div>
            
            <div class="services">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${bill.services.map(service => `
                    <tr>
                      <td>${service.name}</td>
                      <td>${service.id.includes('LAB') ? 'GHS 150.00' : service.id.includes('CON') ? 'GHS 100.00' : 'GHS 70.00'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="total">
              Total Amount: ${bill.amount}
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
    }, 100);
  };

  // Handle view bill details
  const handleViewBill = (billId) => {
    console.log(`Viewing bill ${billId}`);
  };

  // Handle new bill generation
  const handleNewBill = () => {
    console.log("Generating new bill");
  };

  // Handle pay now button click
  const handlePayNow = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Process payment
  const processPayment = () => {
    console.log(`Processing payment for ${selectedBill.id} via ${selectedPaymentMethod}`);
    // Update bill status to paid
    setBills(bills.map(bill => 
      bill.id === selectedBill.id ? { ...bill, status: 'Paid' } : bill
    ));
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
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
            <h3 className="text-sm font-medium text-red-800">Error loading bills</h3>
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
      <Head>
        <title>Billing Management</title>
      </Head>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Payment Method</h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-1"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Bill Details</h3>
                <div className="border rounded-md p-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill ID:</span>
                    <span>{selectedBill?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient:</span>
                    <span>{selectedBill?.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{selectedBill?.amount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-md border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-[#007664] bg-[#007664]/10'
                          : 'border-gray-200 hover:border-[#007664]/50'
                      }`}
                    >
                      <span className="mb-2 text-[#007664]">{method.icon}</span>
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedBill?.adjustments?.length > 0 && (
  <div className="border rounded-md p-3 space-y-1 bg-yellow-50">
    <div className="text-sm font-medium text-yellow-800">Adjustments Applied:</div>
    {selectedBill.adjustments.map((adj, i) => (
      <div key={i} className="flex justify-between text-sm text-yellow-700">
        <span>{adj.reason}</span>
        <span>-₦{adj.amount}</span>
      </div>
    ))}
    <div className="flex justify-between font-semibold pt-2 border-t mt-2">
      <span>Total Due:</span>
      <span>₦{selectedBill.amount - totalAdjustmentAmount}</span>
    </div>
  </div>
)}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                  }}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={processPayment}
                  disabled={!selectedPaymentMethod}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                    selectedPaymentMethod
                      ? 'bg-[#007664] hover:bg-[#006654]'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Billing Management</h2>
          
          <div className="space-y-4">
            <Card className="bg-[#75C05B]/10">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative max-w-md grow">
                    <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Search by patient ID or name..." 
                      className="w-full rounded-md bg-white pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="bg-[#007664] text-white hover:bg-[#007664]/80"
                    onClick={handleNewBill}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Generate New Bill
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredBills.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try a different search term' : 'No bills available'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#007664] text-white">Bill ID</TableHead>
                          <TableHead className="bg-[#007664] text-white">Patient</TableHead>
                          <TableHead className="bg-[#007664] text-white">Services</TableHead>
                          <TableHead className="bg-[#007664] text-white">Date</TableHead>
                          <TableHead className="bg-[#007664] text-white">Amount</TableHead>
                          <TableHead className="bg-[#007664] text-white">Status</TableHead>
                          <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBills.map((bill) => (
                          <TableRow key={bill.id} className="hover:bg-green-50">
                            <TableCell>{bill.id}</TableCell>
                            <TableCell>{bill.patientName}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {bill.services.map((service, index) => (
                                  <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs">
                                    {service.name}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{bill.date}</TableCell>
                            <TableCell>{bill.amount}</TableCell>
                            <TableCell>
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {bill.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {bill.status === 'Pending' ? (
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={() => handlePayNow(bill)}
                                  >
                                    Pay Now
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="bg-[#007664] text-white hover:bg-[#007664]/80"
                                    onClick={() => handleViewBill(bill.id)}
                                  >
                                    View
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                                  onClick={() => handlePrintBill(bill)}
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}