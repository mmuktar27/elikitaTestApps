"use client";
import React, { useState } from "react";
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Search,
  Plus,
  Edit2,
  CalendarCheck,
  Trash2,
  Filter,
  Phone,
  QrCode,
  Check,
  Bell,
  Home,
  Layers,
  Settings,
  Users,
  ClockIcon,
  Activity,
  Database,
  Stethoscope,
  TestTube,
  UserCog,
  Calculator,
  Pill,
  Briefcase,
  Zap,
  User,
  FileText,
  LogOut,
  UserPlus,
  Beaker,
  Edit,
  PlusCircle,
  Building2,
  Building,
  Bed,
  FileBarChart,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronRight,
  Camera,
  Mail,
  Menu,
  X,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const events = [
    {
      id: 1,
      name: "Virtual Team Meeting",
      date: "2024-03-15",
      time: "10:00 AM",
      venue: "Zoom",
      type: "Virtual",
      description: "Monthly team sync-up",
      assignedTo: "Everyone",
      isVirtual: true,
      link: "https://zoom.us/j/meeting1",
    },
    {
      id: 2,
      name: "Virtual Office Training",
      date: "2024-03-16",
      time: "2:00 PM",
      venue: "Google Meet",
      type: "Virtual",
      description: "Quarterly training session",
      assignedTo: "All healthcare Admin",
      isVirtual: true,
      link: "https://meet.google.com/abc-defg-hij",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-[#75C05B]/10 p-4 shadow">
          <h2 className="mb-4 text-xl font-bold text-[#007664]">
            Event Calendar
          </h2>
          <div className="rounded-lg bg-white p-4">
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-bold">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const currentDay = i + 1;
                const eventsForDay = events.filter(
                  (event) => new Date(event.date).getDate() === currentDay,
                );
                const hasEvent = eventsForDay.length > 0;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (hasEvent) {
                        const eventForDay = eventsForDay[0];
                        setSelectedEvent(eventForDay);
                        setIsDialogOpen(true);
                      }
                    }}
                    className={`rounded-full p-2 text-center ${
                      hasEvent
                        ? "cursor-pointer bg-[#007664] text-white hover:bg-[#007664]/90"
                        : ""
                    }`}
                  >
                    {currentDay}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#B24531]/10 p-4 shadow">
          <h2 className="mb-4 text-xl font-bold text-[#B24531]">Event List</h2>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="cursor-pointer rounded bg-white p-2 hover:bg-gray-100"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{event.name}</h3>
                  {event.isVirtual ? (
                    <Video className="size-4 text-blue-500" />
                  ) : (
                    <MapPin className="size-4 text-gray-500" />
                  )}
                </div>
                <p className="text-sm">
                  {event.date} - {event.time}
                </p>
                <p className="text-sm">{event.venue}</p>
                <p className="text-sm">Assigned to: {event.assignedTo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#007664]">
              Event Details
            </h2>
            {selectedEvent && (
              <>
                <h3 className="mb-2 text-xl font-semibold">
                  {selectedEvent.name}
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Date:</strong> {selectedEvent.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedEvent.time}
                  </p>
                  <p>
                    <strong>Venue:</strong> {selectedEvent.venue}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedEvent.type}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                  <p>
                    <strong>Assigned to:</strong> {selectedEvent.assignedTo}
                  </p>
                </div>
                <div className="mt-4">
                  {selectedEvent.isVirtual ? (
                    <button className="rounded bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
                      <Video className="mr-2 inline-block size-4" />
                      Join Virtual Event
                    </button>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <MapPin className="mr-2 size-4" />
                      <span>In-person event at {selectedEvent.venue}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
