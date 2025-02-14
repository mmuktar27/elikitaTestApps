"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { AddEventModal } from "../ui/addevent";
import { EditEventModal } from "../ui/editevents";
import { Button } from "@/components/ui/button";

const Events = () => {
  const [events, setEvents] = useState([
    /*  {
      id: 1,
      name: "Staff Training",
      date: "2023-10-15",
      type: "Training",
      venue: "Conference Room A",
      time: "10:00",
      description: "Annual staff training session",
      assignTo: "All Staff",
    },
    {
      id: 2,
      name: "System Maintenance",
      date: "2023-10-20",
      type: "Maintenance",
      venue: "IT Department",
      time: "14:00",
      description: "Scheduled system maintenance and updates",
      assignTo: "IT Team",
    },
    {
      id: 3,
      name: "Medical Conference",
      date: "2023-11-05",
      type: "Conference",
      venue: "Grand Hotel",
      time: "09:00",
      description: "International medical conference on telemedicine",
      assignTo: "Doctors",
    }, */
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const dates = events.map((event) => new Date(event.date));
    setSelectedDates(dates);
  }, [events]);

  const generateICSFile = (event) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.date.replace(/-/g, "")}T${event.time.replace(":", "")}00
DTEND:${event.date.replace(/-/g, "")}T${event.time.replace(":", "")}00
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.venue}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addEvent = (newEvent) => {
    const newEventWithId = { id: events.length + 1, ...newEvent };
    setEvents([...events, newEventWithId]);
    setSelectedDates([...selectedDates, new Date(newEvent.date)]);
    //generateICSFile(newEventWithId);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
    const updatedDates = events
      .map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      .map((event) => new Date(event.date));
    setSelectedDates(updatedDates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold text-[#007664]">Events</h2>
        <AddEventModal onAddEvent={addEvent} />
      </div>
      <div className="flex items-center justify-start gap-4">
        <div className="w-1/3 rounded-lg bg-[#75C05B]/10 p-4">
          <h3 className="mb-4 text-xl font-semibold text-[#007664]">
            Event Calendar
          </h3>
          <DayPicker
            startMonth={new Date()}
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            className="rounded border p-2"
          />
        </div>

        {events.length > 0 && (
          <div className="flex h-[400px] w-2/3 flex-col rounded-lg bg-[#B24531]/10 p-4">
            <h3 className="mb-4 text-xl font-semibold text-[#B24531]">
              Event List
            </h3>
            <div className="grow space-y-2 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="cursor-pointer rounded bg-white p-2 hover:bg-gray-100"
                  onClick={() => handleEventClick(event)}
                >
                  <h3 className="font-bold">{event.name}</h3>
                  <p className="text-sm">
                    {event.date} - {event.time}
                  </p>
                  <p className="text-sm">{event.venue}</p>
                  <p className="text-sm">
                    Assigned to: {event.assignTo || event.emails}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <EditEventModal
        event={selectedEvent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateEvent={updateEvent}
      />
    </div>
  );
};

export default Events;
