"use client";

import { useEffect, useState } from "react";
import { getAllAuditLogs } from "../shared/api"; // Adjust path accordingly
import { ChevronUp, ChevronDown, X } from 'lucide-react';

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

  const itemsPerPage = 10;

  // Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAllAuditLogs();
        setAuditLogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Sort logs when data or sort parameters change
  useEffect(() => {
    if (!auditLogs.length) return;
    
    const sortedLogs = [...auditLogs].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'userId' && a.userId && b.userId) {
        aValue = a.userId.name || a.userId;
        bValue = b.userId.name || b.userId;
      }

      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setLogs(sortedLogs);
  }, [auditLogs, sortField, sortDirection]);

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
  const getSortIcon = (field) => (sortField === field ? (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : null);

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

  console.log(logs)

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-bold">Activity Logs</h2>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full">
              <thead className="bg-[#007664] text-white">
                <tr>
                  <th className="cursor-pointer p-2 text-left" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-1">
                      Timestamp {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="cursor-pointer p-2 text-left" onClick={() => handleSort('userId')}>
                    <div className="flex items-center gap-1">
                      User {getSortIcon('userId')}
                    </div>
                  </th>
                  <th className="cursor-pointer p-2 text-left" onClick={() => handleSort('activityType')}>
                    <div className="flex items-center gap-1">
                      Action {getSortIcon('activityType')}
                    </div>
                  </th>
                  <th className="cursor-pointer p-2 text-left" onClick={() => handleSort('details')}>
                    <div className="flex items-center gap-1">
                      Details {getSortIcon('details')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log._id} className="cursor-pointer transition-colors hover:bg-gray-100" onClick={() => handleRowClick(log)}>
                    <td className="p-2">{formatDate(log.createdAt)}</td>
                    <td className="p-2">{getUserDisplay(log.userId.practitionerReference)}</td>
                    <td className="p-2">{log.activityType}</td>
                    <td className="max-w-xs truncate p-2">{log.details}</td>
                  </tr>
                ))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="max-h-screen w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Activity Log Details</h3>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded bg-gray-50 p-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">Timestamp</h4>
                  <p className="text-gray-900">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div className="rounded bg-gray-50 p-4">
                  <h4 className="mb-1 text-sm font-medium text-gray-500">User</h4>
                  <p className="text-gray-900">{getUserDisplay(selectedLog?.userId?.firstName)} {getUserDisplay(selectedLog?.userId?.lastName)}</p>

                  <p className="text-gray-900">{getUserDisplay(selectedLog?.userId?.practitionerReference)}</p>
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
    </div>
  );
};

export default AuditLog;