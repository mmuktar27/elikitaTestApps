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
  Settings,UserRound,
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  const upcomingConsultations = [
    { 
      id: 1, 
      name: "Sarah Johnson",
      role: "Patient",
      email: "sarah.j@email.com",
      appointmentTime: "2:00 PM Today",
      consultationType: "Follow-up",
      status: "scheduled",
      symptoms: "Chronic back pain"
    },
    { 
      id: 2, 
      name: "Dr. Michael Chen",
      role: "Health Assistant",
      email: "m.chen@health.com",
      appointmentTime: "3:30 PM Today",
      consultationType: "Case Discussion",
      status: "scheduled",
      specialization: "Cardiology"
    }
  
  ];

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
    <div className="mx-auto max-w-6xl px-4 mo:w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mo:w-auto">
        <div className="rounded-lg bg-[#75C05B]/10 p-4 shadow ">
          <h2 className="mb-4 text-xl font-bold text-[#007664]">
            Event Calendar
          </h2>
          <div className="rounded-lg bg-white p-4">
          <div className="grid grid-cols-7 gap-2">
  {/* Full Weekdays for larger screens */}
  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
    <div key={day} className="hidden sm:block text-center font-bold">
      {day}
    </div>
  ))}

  {/* Short Weekdays for smaller screens */}
  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
    <div key={day} className="block sm:hidden text-center font-bold">
      {day}
    </div>
  ))}

  {/* Calendar Days */}
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
 {/* Upcoming Consultations Section */}
 <Card className="border-none shadow-lg mo:mt-8">
  <CardHeader className="border-b border-gray-100">
    <CardTitle className="flex items-center gap-2 text-[#007664]">
      <Calendar className="w-5 h-5" />
      Upcoming Consultations
    </CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <div className="space-y-3">
      {upcomingConsultations.map((consultation) => (
        <div
          key={consultation.id}
          className="flex flex-col sm:flex-row items-center sm:justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
              ${consultation.role === 'Health Assistant' ? 'bg-blue-100' : 'bg-[#53FDFD]/10'}`}>
              {consultation.role === 'Health Assistant' ? 
                <Stethoscope className="w-6 h-6 text-blue-600" /> :
                <UserRound className="w-6 h-6 text-[#007664]" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{consultation.name}</h3>
                <Badge 
  className="bg-teal-600 text-teal-100 hover:bg-teal-500 hover:text-teal-200 transition-colors"
  variant={consultation.role === 'Health Assistant' ? 'default' : 'default'}
>
  {consultation.role}
</Badge>


              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {consultation.appointmentTime}
                </p>
                <p className="text-sm text-gray-500">
                  {consultation.consultationType} - {consultation.role === 'Health Assistant' ? 
                    consultation.specialization : consultation.symptoms}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 w-32 sm:w-auto bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
  <Video className="w-5 h-5" />
  <span>Join</span>
</button>

          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>


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
