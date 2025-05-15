"use client";

import { useEffect, useState } from "react";
import { getAllAuditLogs } from "../shared/api"; // Adjust path accordingly
import { ChevronUp, ChevronDown, X,Printer,Search } from 'lucide-react';
import {
  DialogHeader
} from "@/components/ui/dialog";

import { getSystemSettings } from "../shared/api";

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [fromDate, setFromDate] = useState(false);

  const [toDate, setToDate] = useState(false);

  // New state for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [availableActivityTypes, setAvailableActivityTypes] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('all');

  const itemsPerPage = 10;


  const [localSettings, setLocalSettings] = useState({});

   useEffect(() => {
      const loadSettings = async () => {
        try {
        //  setisLoading(true);
          const settings = await getSystemSettings();
          console.log('Loaded Settings:', settings);
    
          setLocalSettings(settings.data);
         
        } catch (error) {
          console.error('Error loading settings:', error);
        } finally {
        //  setisLoading(false); // Ensures it always runs
        }
      };
    
      loadSettings();
    }, []);
    
  // Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAllAuditLogs();
        setAuditLogs(data);
        
        // Extract all unique activity types for the filter dropdown
        const types = [...new Set(data.map(log => log.activityType))];
        setAvailableActivityTypes(types);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter and sort logs when data or parameters change
  useEffect(() => {
    if (!auditLogs.length) return;
  
    // First apply filters
    let filteredLogs = [...auditLogs];
    
    // Filter by activity type if selected
    if (activityTypeFilter) {
      filteredLogs = filteredLogs.filter(log => 
        log.activityType === activityTypeFilter
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        (log.details && log.details.toLowerCase().includes(searchLower)) ||
        (log.activityType && log.activityType.toLowerCase().includes(searchLower)) ||
        (log.userId?.firstName && log.userId.firstName.toLowerCase().includes(searchLower)) ||
        (log.userId?.lastName && log.userId.lastName.toLowerCase().includes(searchLower))
      );
    }
  
    // Then sort
    const sortedLogs = filteredLogs.sort((a, b) => {
      const aValue = new Date(a.createdAt).getTime();
      const bValue = new Date(b.createdAt).getTime();
  
      return sortDirection === 'dsc' ? aValue - bValue : bValue - aValue;
    });
  
    setLogs(sortedLogs);
    setCurrentPage(1); // Reset to first page when filters change
  }, [auditLogs, sortDirection, searchTerm, activityTypeFilter]);
  

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  // Format timestamp
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Get user display name
  const getUserDisplay = (user) => (!user ? 'Unknown' : typeof user === 'object' && user.name ? user.name : user.toString());

  // Handle row click to show modal
  const handleRowClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  // Get sort icon
  const getSortIcon = (field) => (sortField === field ? (sortDirection === 'dsc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : null);

  // Generate report
  const generateReport = () => {
    setShowReportModal(true);
  };

  // Print report
// Print report
const printReport = () => {
  // Filter logs based on report type
  let reportLogs = [...auditLogs];
  
  if (reportType !== 'all') {
    reportLogs = reportLogs.filter(log => {
      const logDate = new Date(log.createdAt); // Convert log's timestamp to Date object
      const fromDateValid = fromDate ? new Date(fromDate) : null;
      const toDateValid = toDate ? new Date(toDate) : null;
  
      // If no date range is provided, return all logs of the selected type
      if (!fromDate && !toDate) {
        return log.activityType === reportType;
      }
  
      // Ensure that fromDate and toDate are valid before filtering
      if (fromDateValid instanceof Date && !isNaN(fromDateValid) && 
          toDateValid instanceof Date && !isNaN(toDateValid)) {
        return (
          log.activityType === reportType &&
          logDate.toISOString().split('T')[0] >= fromDateValid.toISOString().split('T')[0] &&
          logDate.toISOString().split('T')[0] <= toDateValid.toISOString().split('T')[0]
        );
      }
  
      // If dates are invalid, fallback to filtering only by type
      return log.activityType === reportType;
    });
  }
  

  const orgName = localSettings?.organizationName || 'e-Likita';

function formatDate(dateString) {
    if (!dateString) return "N/A"; // Check for null, undefined, or empty value

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Check for invalid date

    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}



  // Create a printable version of the report
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>e-Likita | Audit Log Report - ${reportType === 'all' ? 'All Activities' : reportType}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #007664; color: white; }
          h1 { color: #007664;align-items: center; }
          .report-info { margin-bottom: 20px; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #007664; }
          .org-name { font-size: 16px; color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">e-Likita</div>
            <div class="org-name">${orgName} </div>
          </div>
          <h1>Audit Log Report</h1>
        </div>
        <div class="report-info">
          <p><strong>Report Type:</strong> ${reportType === 'all' ? 'All Activities' : reportType}</p>
          <p><strong>Report From:</strong> ${formatDate(fromDate)} To ${formatDate(toDate)}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Records:</strong> ${reportLogs.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${reportLogs.map(log => `
              <tr>
                <td>${formatDate(log.createdAt)}</td>
                <td>${log.userId?.firstName || ''} ${log.userId?.lastName || ''}</td>
                <td>${log.activityType}</td>
                <td>${log.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
  
  setShowReportModal(false);
  setToDate(null);
  setFromDate(null);

};
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
      <div className="overflow-x-auto rounded shadow">
        <div className="h-12 w-full rounded-t bg-gray-200"></div>
        {[...Array(itemsPerPage)].map((_, index) => (
          <div key={index} className="flex h-12 w-full border-b">
            <div className="w-1/4 p-2"><div className="h-6 rounded bg-gray-200"></div></div>
            <div className="w-1/4 p-2"><div className="h-6 rounded bg-gray-200"></div></div>
            <div className="w-1/4 p-2"><div className="h-6 rounded bg-gray-200"></div></div>
            <div className="w-1/4 p-2"><div className="h-6 rounded bg-gray-200"></div></div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-20 rounded bg-gray-200"></div>
          <div className="h-8 w-10 rounded bg-gray-200"></div>
          <div className="h-8 w-10 rounded bg-gray-200"></div>
          <div className="h-8 w-20 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );

  console.log(logs);

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex gap-2">
          <button 
            onClick={generateReport} 
            className="flex items-center gap-1 rounded bg-[#007664] px-3 py-2 text-white hover:bg-[#007664]/90"
          >
            <Printer size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex flex-1 items-center rounded border border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="w-full flex-1 border-none px-3 py-2 outline-none"
          />
          <div className="mx-2 text-gray-400">
            <Search size={18} />
          </div>
        </div>
        
        <select
          value={activityTypeFilter}
          onChange={(e) => setActivityTypeFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 outline-none"
        >
          <option value="">All Activity Types</option>
          {availableActivityTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full border border-gray-300">
              <thead className="bg-[#007664] text-white">
                <tr>
                  <th className="cursor-pointer border-b border-gray-300 p-2 text-left" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">
                      Timestamp {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="cursor-pointer border-b border-gray-300 p-2 text-left" onClick={() => handleSort('userId')}>
                    <div className="flex items-center gap-1">
                      User {getSortIcon('userId')}
                    </div>
                  </th>
                  <th className="cursor-pointer border-b border-gray-300 p-2 text-left" onClick={() => handleSort('activityType')}>
                    <div className="flex items-center gap-1">
                      Action {getSortIcon('activityType')}
                    </div>
                  </th>
                  <th className="cursor-pointer border-b border-gray-300 p-2 text-left" onClick={() => handleSort('details')}>
                    <div className="flex items-center gap-1">
                      Details {getSortIcon('details')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log._id} className="cursor-pointer border-b border-gray-300 transition-colors hover:bg-gray-100" onClick={() => handleRowClick(log)}>
                      <td className="border-r border-gray-300 p-2">{formatDate(log.createdAt)}</td>
                      <td className="border-r border-gray-300 p-2">{getUserDisplay(log?.userId?.firstName)} {getUserDisplay(log?.userId?.lastName)}</td>
                      <td className="border-r border-gray-300 p-2">{log.activityType}</td>
                      <td className="max-w-xs truncate border-r border-gray-300 p-2">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">No logs found matching your search criteria</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                Showing {startIndex + 1}-{Math.min(endIndex, logs.length)} of {logs.length} entries
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="rounded border px-3 py-1 disabled:opacity-50">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`rounded border px-3 py-1 ${currentPage === i + 1 ? 'bg-[#007664] text-white' : ''}`}>
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="rounded border px-3 py-1 disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {/* Detailed View Modal */}
      {showModal && selectedLog && (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
   <div className="relative flex h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white p-6 shadow-lg">
            
            <button onClick={closeModal} 
     className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
     >
              <X size={20} />
            </button>
        <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
                    <div className="mb-4 text-center">
                      <h2 className="text-xl font-semibold text-white sm:text-2xl">Activity Log Details</h2>
              
                    </div>
                    </DialogHeader>
           
            <div className="grow space-y-4 overflow-auto">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded bg-gray-50 p-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">Timestamp</h4>
                  <p className="text-gray-900">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div className="rounded bg-gray-50 p-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">User</h4>
                  <p className="text-gray-900">{getUserDisplay(selectedLog?.userId?.firstName)} {getUserDisplay(selectedLog?.userId?.lastName)}</p>

                  <p className="text-gray-900">{getUserDisplay(selectedLog?.userId?.employeeID ?? 'N/A')}
                  </p>
                </div>
              </div>
              <div className="rounded bg-gray-50 p-4">
                <h4 className="mb-1 text-sm font-medium text-gray-500">Activity Type</h4>
                <p className="text-gray-900">{selectedLog.activityType}</p>
              </div>
              <div className="rounded bg-gray-50 p-4">
                <h4 className="mb-1 text-sm font-medium text-gray-500">Details</h4>
                <p className="whitespace-pre-wrap text-gray-900">{selectedLog.details}</p>
              </div>
              {selectedLog.metadata && (
                <div className="rounded bg-gray-50 p-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">Additional Metadata</h4>
                  <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
            <button onClick={closeModal} className="rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/90">
            Close
              </button>
            </div>
          </div>
        </div>
      )}


{showReportModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Generate Activity Report</h3>
      
      <div className="mb-4">
        <label className="mb-2 block font-medium">Select Activity Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
        >
          <option value="all">All Activities</option>
          {availableActivityTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Show date inputs if a specific activity type is chosen */}
      {reportType !== "all" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select Date Range:</label>
          <div className="flex gap-2">
            <input
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
              className="w-1/2 rounded border border-gray-300 p-2"
              placeholder="From"
            />
            <input
              type="date"
              onChange={(e) => setToDate(e.target.value)}
              className="w-1/2 rounded border border-gray-300 p-2"
              placeholder="To"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={() => setShowReportModal(false)} 
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          onClick={printReport} 
          className="flex items-center gap-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/90"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AuditLog;