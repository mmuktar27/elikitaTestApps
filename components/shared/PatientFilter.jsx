"use client";
import React, { useState } from 'react';
import { 
    Filter, 
    Calendar, 
    Stethoscope, 
    CheckCircle2, 
    RefreshCw 
  } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const PatientFilter = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  initialFilters 
}) => {
  const [filters, setFilters] = useState({
    progress: '',
    status: '',
    condition: '',
    dateRange: {
      from: '',
      to: ''
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleResetFilter = () => {
    const resetFilters = {
      progress: '',
      status: '',
      condition: '',
      dateRange: {
        from: '',
        to: ''
      }
    };
    setFilters(resetFilters);
    onApplyFilter(resetFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-2xl border-none bg-white shadow-2xl">
        <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6">
          <div className="flex items-center space-x-4">
            <Filter className="size-8 text-white" />
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                Patient Filters
              </DialogTitle>
              <DialogDescription className="mt-1 text-white/80">
                Refine your patient search with precision
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
  
        <div className="space-y-6 p-6">
          {/* Progress Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex w-1/4 items-center space-x-2">
              <Stethoscope className="size-5 text-teal-600" />
              <label className="font-medium text-gray-700">Progress</label>
            </div>
            <select 
              name="progress"
              value={filters.progress}
              onChange={handleFilterChange}
              className="grow rounded-lg border-2 border-teal-100 p-2 transition-all duration-300 focus:ring-2 focus:ring-teal-300"
            >
              <option value="" className="text-gray-500">All Progresses</option>
              <option value="Initial Assessment">Initial Assessment</option>
              <option value="Treatment Started">Treatment Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Improving">Improving</option>
              <option value="Stable">Stable</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
  
          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex w-1/4 items-center space-x-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <label className="font-medium text-gray-700">Status</label>
            </div>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="grow rounded-lg border-2 border-emerald-100 p-2 transition-all duration-300 focus:ring-2 focus:ring-emerald-300"
            >
              <option value="" className="text-gray-500">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discharged">Discharged</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>
  
          {/* Condition Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex w-1/4 items-center space-x-2">
              <Stethoscope className="size-5 text-blue-600" />
              <label className="font-medium text-gray-700">Condition</label>
            </div>
            <input 
              type="text"
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              placeholder="Enter medical condition"
              className="grow rounded-lg border-2 border-blue-100 p-2 transition-all duration-300 focus:ring-2 focus:ring-blue-300"
            />
          </div>
  
          {/* Date Range Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex w-1/4 items-center space-x-2">
              <Calendar className="size-5 text-purple-600" />
              <label className="font-medium text-gray-700">Date Range</label>
            </div>
            <div className="flex grow space-x-4">
              <div className="flex-1">
                <input 
                  type="date"
                  name="from"
                  value={filters.dateRange.from}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: e.target.value
                    }
                  }))}
                  className="w-full rounded-lg border-2 border-purple-100 p-2 transition-all duration-300 focus:ring-2 focus:ring-purple-300"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="date"
                  name="to"
                  value={filters.dateRange.to}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      to: e.target.value
                    }
                  }))}
                  className="w-full rounded-lg border-2 border-purple-100 p-2 transition-all duration-300 focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 rounded-b-2xl bg-gray-50 p-6">
          <Button 
            variant="outline" 
            onClick={handleResetFilter}
            className="flex items-center space-x-2 border-2 border-gray-300 transition-colors hover:bg-gray-100"
          >
            <RefreshCw className="size-4" />
            <span>Reset</span>
          </Button>
          <Button 
            onClick={handleApplyFilter}
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-300 hover:from-teal-600 hover:to-emerald-700"
          >
            <Filter className="size-4" />
            <span>Apply Filters</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFilter;