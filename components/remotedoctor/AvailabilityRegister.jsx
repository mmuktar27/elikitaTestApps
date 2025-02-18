"use client";
import React, { useState, useEffect } from "react";
import {
 
Calendar,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Modal from "react-modal";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { availabilityService } from '../shared/api'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export  function AvailabilityRegister() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [availability, setAvailability] = useState({});
  const [showSchedule, setShowSchedule] = useState(false);
  const [recurrenceSettings, setRecurrenceSettings] = useState({
    type: 'weekly',
    interval: 1,
    startDate: '',
    endDate: '',
    daysOfWeek: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const availabilityData = {
        availability: {
          // Your availability data structure
        },
        recurrence: recurrenceSettings,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await availabilityService.setAvailability(availabilityData);
      alert('Availability set successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to set availability');
    } finally {
      setLoading(false);
    }
  }
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



  // Group days into chunks of 3 for the grid layout
  const groupedDays = [];
  for (let i = 0; i < daysOfWeek.length; i += 3) {
    groupedDays.push(daysOfWeek.slice(i, i + 3));
  }

  const handleMonthToggle = (month) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        return prev.filter(m => m !== month);
      }
      return [...prev, month];
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    // Update availability for all selected months
    const newAvailability = { ...availability };
    selectedMonths.forEach(month => {
      newAvailability[month] = {
        ...newAvailability[month],
        [day]: {
          ...newAvailability[month]?.[day],
          [field]: value
        }
      };
    });
    setAvailability(newAvailability);
  };



  return (
    <Card className="mx-auto w-full max-w-5xl bg-[#F7F7F7] shadow-lg">
      <CardHeader className="rounded-t-lg bg-[#007664] text-white">
        <CardTitle className="text-2xl font-semibold">
          Register Your Long-term Availability
        </CardTitle>
        <CardDescription className="text-gray-100">
          Set your availability schedule for multiple months ahead.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <Label className="mb-3 block text-lg font-semibold text-gray-700">
              Select Months for Availability
            </Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {months.map((month) => (
                <div
                  key={month}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedMonths.includes(month)
                      ? 'border-[#007664] bg-[#007664] text-white'
                      : 'border-gray-200 hover:border-[#007664]'
                    }
                  `}
                  onClick={() => handleMonthToggle(month)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {selectedMonths.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gray-700">
                  Set Weekly Schedule
                </Label>
                <Button
                  type="button"
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="bg-[#75C05B] hover:bg-[#5ea347]"
                >
                  {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
                </Button>
              </div>
              
              {showSchedule && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedDays.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-4">
                      {group.map((day) => (
                        <div
                          key={day}
                          className="flex flex-col space-y-2 rounded-lg p-4 transition-colors duration-200 hover:bg-white"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={availability[selectedMonths[0]]?.[day]?.checked}
                              onCheckedChange={(checked) =>
                                handleAvailabilityChange(day, "checked", checked)
                              }
                              className="border-[#007664] text-[#007664]"
                            />
                            <Label
                              htmlFor={day}
                              className="font-medium text-gray-700"
                            >
                              {day}
                            </Label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="time"
                              value={availability[selectedMonths[0]]?.[day]?.start || ''}
                              onChange={(e) =>
                                handleAvailabilityChange(day, "start", e.target.value)
                              }
                              disabled={!availability[selectedMonths[0]]?.[day]?.checked}
                              className="border-[#75C05B] bg-white focus:ring-[#007664] disabled:bg-gray-100"
                            />
                            <Input
                              type="time"
                              value={availability[selectedMonths[0]]?.[day]?.end || ''}
                              onChange={(e) =>
                                handleAvailabilityChange(day, "end", e.target.value)
                              }
                              disabled={!availability[selectedMonths[0]]?.[day]?.checked}
                              className="border-[#75C05B] bg-white focus:ring-[#007664] disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="rounded-b-lg bg-gray-50 p-6">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={selectedMonths.length === 0}
          className="w-full bg-[#007664] py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#75C05B] disabled:bg-gray-400"
        >
          Register Availability for {selectedMonths.length} Month{selectedMonths.length !== 1 ? 's' : ''}
        </Button>
      </CardFooter>
    </Card>
  );
}
