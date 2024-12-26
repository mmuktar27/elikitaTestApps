"use client";

import { useState } from "react";

const AuditLog = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: "2023-10-16 10:30:15",
      user: "Admin Smith",
      action: "Logged in",
      details: "IP: 192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2023-10-16 11:45:22",
      user: "Dr. Jane Doe",
      action: "Updated patient record",
      details: "Patient ID: 12345",
    },
    {
      id: 3,
      timestamp: "2023-10-16 13:15:07",
      user: "Nurse Johnson",
      action: "Accessed lab results",
      details: "Lab Test ID: LT789",
    },
    {
      id: 4,
      timestamp: "2023-10-16 14:30:55",
      user: "System",
      action: "Backup completed",
      details: "Backup size: 2.5GB",
    },
    {
      id: 5,
      timestamp: "2023-10-16 15:20:11",
      user: "Pharmacist Brown",
      action: "Dispensed medication",
      details: "Prescription ID: RX456",
    },
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Audit Log</h2>
      <div className="rounded-lg bg-[#A0FEFE]/10 p-4">
        <h3 className="mb-4 text-xl font-semibold text-[#007664]">
          System Activity Log
        </h3>
        <table className="w-full">
          <thead className="bg-[#007664] text-white">
            <tr>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-100">
                <td className="p-2">{log.timestamp}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AuditLog;
