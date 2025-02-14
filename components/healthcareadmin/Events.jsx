"use client";
import { MapPin, Video } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
        <Card className="bg-[#75C05B]/10">
          <CardHeader>
            <CardTitle className="text-[#007664]">Event Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-white p-4">
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="text-center font-bold">
                      {day}
                    </div>
                  ),
                )}
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
          </CardContent>
        </Card>

        <Card className="bg-[#B24531]/10">
          <CardHeader>
            <CardTitle className="text-[#B24531]">Event List</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col items-center space-y-4">
            <DialogHeader>
              <DialogTitle className="text-center text-[#007664]">
                Event Details
                {selectedEvent?.isVirtual && (
                  <Video className="mx-auto mt-2 size-5" />
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <>
                <h3 className="text-center text-lg font-bold">
                  {selectedEvent.name}
                </h3>
                <div className="w-full space-y-2 text-center">
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
                <div className="flex justify-center pt-4">
                  {selectedEvent.isVirtual ? (
                    <Button className="bg-teal-700 text-white shadow-lg hover:bg-teal-800">
                      <Video className="mr-2 size-4" />
                      Join Virtual Event
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="size-4" />
                      <span>In-person event at {selectedEvent.venue}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
