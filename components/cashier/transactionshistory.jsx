"use client";
import { useState, useEffect } from 'react';
import {
  Search,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,AlertCircle,
  Filter
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function TransactionsHistory() {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Simulate API call
        const mockTransactions = [
          {
            id: 'TXN-2023-001',
            datetime: '2023-06-15 09:30 AM',
            patientName: 'Kwame Asante',
            service: 'Consultation',
            paymentMethod: 'cash',
            amount: 'GHS 150.00',
            status: 'completed'
          },
          {
            id: 'TXN-2023-002',
            datetime: '2023-06-15 10:15 AM',
            patientName: 'Ama Mensah',
            service: 'Lab Test',
            paymentMethod: 'mobile',
            amount: 'GHS 250.00',
            status: 'completed'
          },
          {
            id: 'TXN-2023-003',
            datetime: '2023-06-16 11:00 AM',
            patientName: 'Yaw Boateng',
            service: 'Pharmacy',
            paymentMethod: 'card',
            amount: 'GHS 120.00',
            status: 'completed'
          },
          // Add more mock transactions...
        ];
        
        setTimeout(() => {
          setTransactions(mockTransactions);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search term and date filter
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = () => {
      const txnDate = new Date(txn.datetime);
      const now = new Date();
      
      switch(dateFilter) {
        case 'today':
          return txnDate.toDateString() === now.toDateString();
        case 'week':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return txnDate >= oneWeekAgo;
        case 'month':
          return txnDate.getMonth() === now.getMonth() && 
                 txnDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    };
    
    return matchesSearch && matchesDate();
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction, 
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Handle print receipt
  const handlePrintReceipt = (transaction) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${transaction.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #007664; }
            .receipt-title { font-size: 20px; margin: 10px 0; }
            .transaction-info { margin: 15px 0; }
            .transaction-info table { width: 100%; border-collapse: collapse; }
            .transaction-info th, .transaction-info td { 
              padding: 8px; text-align: left; border-bottom: 1px solid #ddd; 
            }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">E-likita</div>
            <div class="receipt-title">PAYMENT RECEIPT</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="transaction-info">
            <table>
              <tr>
                <th>Transaction ID:</th>
                <td>${transaction.id}</td>
              </tr>
              <tr>
                <th>Date/Time:</th>
                <td>${transaction.datetime}</td>
              </tr>
              <tr>
                <th>Patient Name:</th>
                <td>${transaction.patientName}</td>
              </tr>
              <tr>
                <th>Service:</th>
                <td>${transaction.service}</td>
              </tr>
              <tr>
                <th>Payment Method:</th>
                <td>${transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}</td>
              </tr>
              <tr>
                <th>Amount:</th>
                <td>${transaction.amount}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</td>
              </tr>
            </table>
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

  // Handle export report
  const handleExportReport = () => {
    // This would typically generate a CSV or PDF
    console.log("Exporting report...");
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007664]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading transactions</h3>
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
    <div className="space-y-6">
      <Card className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Transaction History</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative grow">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-white pl-8 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-[#007664] hover:bg-[#007664]/80 text-white"
            onClick={handleExportReport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || dateFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No transactions available'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#007664] text-white">Transaction ID</TableHead>
                    <TableHead className="bg-[#007664] text-white">Date/Time</TableHead>
                    <TableHead className="bg-[#007664] text-white">Patient</TableHead>
                    <TableHead className="bg-[#007664] text-white">Service</TableHead>
                    <TableHead className="bg-[#007664] text-white">Payment Method</TableHead>
                    <TableHead className="bg-[#007664] text-white">Amount</TableHead>
                    <TableHead className="bg-[#007664] text-white">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-green-50">
                      <TableCell>{txn.id}</TableCell>
                      <TableCell>{txn.datetime}</TableCell>
                      <TableCell>{txn.patientName}</TableCell>
                      <TableCell>{txn.service}</TableCell>
                      <TableCell>
                        <span className="capitalize">{txn.paymentMethod}</span>
                      </TableCell>
                      <TableCell>{txn.amount}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                          onClick={() => handlePrintReceipt(txn)}
                        >
                          <Printer className="mr-1 h-3 w-3" />
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstTransaction + 1} to{' '}
                {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{' '}
                {filteredTransactions.length} transactions
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
      </Card>
    </div>
  );
}