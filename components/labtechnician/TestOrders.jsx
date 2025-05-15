'use client';
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
 
  X as CloseIcon,

  Eye,
 
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

export default function TestOrders() {
  return (
    <div className="space-y-4">
      <Card className="bg-[#75C05B]/10">
        <CardHeader>
          <h2 className="text-xl font-semibold">Patient Test Orders</h2>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="patient-filter" className="mb-1 block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select 
                id="patient-filter" 
                className="w-full rounded-md border border-gray-300 p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#007664]"
              >
                <option value="">All Patients</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Robert Johnson</option>
              </select>
            </div>
            
            <div className="w-full sm:w-64">
              <label htmlFor="date-filter" className="mb-1 block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <input 
                type="date" 
                id="date-filter" 
                className="w-full rounded-md border border-gray-300 p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#007664]"
              />
            </div>
            
            <div className="w-full sm:w-64">
              <label htmlFor="test-type-filter" className="mb-1 block text-sm font-medium text-gray-700">
                Test Type
              </label>
              <select 
                id="test-type-filter" 
                className="w-full rounded-md border border-gray-300 p-2 focus:border-[#007664] focus:ring-2 focus:ring-[#007664]"
              >
                <option value="">All Tests</option>
                <option value="blood">Blood Test</option>
                <option value="urine">Urine Analysis</option>
                <option value="imaging">Imaging</option>
              </select>
            </div>
            
            <div className="flex w-full items-end sm:w-64">
              <Button 
                className="bg-[#007664] hover:bg-[#007664]/80 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-[#007664] text-white">
                    Order ID
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Patient Name
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Test Type
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Ordered Date
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Status
                  </TableHead>
                  <TableHead className="bg-[#007664] text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="transition-colors duration-200 hover:bg-green-50">
                  <TableCell>ORD-2025-001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Complete Blood Count</TableCell>
                  <TableCell>May 12, 2025</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                      Pending Collection
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                
                      <Button className="bg-[#007664] hover:bg-[#007664]/80 text-white text-sm">
                        Collect Sample
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="transition-colors duration-200 hover:bg-green-50">
                  <TableCell>ORD-2025-002</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Lipid Panel</TableCell>
                  <TableCell>May 10, 2025</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Completed
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button className="bg-[#007664] hover:bg-[#007664]/80 text-white text-sm">
                        View Results
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="transition-colors duration-200 hover:bg-green-50">
                  <TableCell>ORD-2025-003</TableCell>
                  <TableCell>Robert Johnson</TableCell>
                  <TableCell>Urine Analysis</TableCell>
                  <TableCell>May 13, 2025</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                      In Processing
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                 
                      <Button className="bg-[#007664] hover:bg-[#007664]/80 text-white text-sm">
                        Enter Results
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  }
  