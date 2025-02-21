"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus,Link as LinkIcon  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEventForm } from "./create-event-form";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  startOfWeek,
  subWeeks,
  addWeeks,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
  differenceInMinutes,
} from "date-fns";
import {
  useGetEventsByParticipant,
  useGetEventsByParticipants,
} from "@/hooks/publicevents.hook";
import { platform } from "os";
import { useSession, signOut } from "next-auth/react";
import BookingsURLManagement from "../admin/BookingUrl";

const hours = Array.from({ length: 13 }, (_, i) => i + 8);
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const today = new Date();
const tomorrow = addDays(today, 1);

export function Calendar({currentDashboard}) {
  const session = useSession();
  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false);

  const roles = session?.data?.user?.roles || [];
  const { data: eventsData, isLoading, error } = useGetEventsByParticipant();
  const canCreate = roles.includes("system admin");
  console.log("eventsData", eventsData);
  const [openDialog, setOpenDialog] = useState(false);
  const events =
    eventsData?.data?.data.map((event) => ({
      id: event._id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      color: event.color,
      description: event.description,
      organizer: event.host,
      eventLink: event.meetingUrl,
      type: event.type,
      platform: event.platform,
    })) || [];

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const timeColumnRef = useRef(null);
  const eventsContainerRef = useRef(null);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = weekDays.map((day, index) => ({
    day,
    date: addDays(startOfCurrentWeek, index),
  }));

  const navigateWeek = (direction) => {
    setCurrentDate((prevDate) =>
      direction === "prev" ? subWeeks(prevDate, 1) : addWeeks(prevDate, 1),
    );
  };

  const isMultiDayEvent = (event) => {
    return !isSameDay(event.start, event.end);
  };

  const shouldDisplayEvent = (event, date) => {
    return isWithinInterval(date, {
      start: startOfDay(event.start),
      end: endOfDay(event.end),
    });
  };

  const getEventPosition = (event, date) => {
    const isMultiDay = isMultiDayEvent(event);
    const isStartDay = isSameDay(event.start, date);
    const isEndDay = isSameDay(event.end, date);
    const hourHeight = 80;

    if (isMultiDay) {
      if (isStartDay) {
        const startMinutes =
          event.start.getHours() * 60 + event.start.getMinutes();
        const endMinutes = 24 * 60;
        return {
          top: `${((startMinutes - 8 * 60) / 60) * hourHeight}px`,
          height: `${((endMinutes - startMinutes) / 60) * hourHeight}px`,
          left: "4px",
          right: "0",
          borderRadius: "4px 0 0 4px",
        };
      } else if (isEndDay) {
        const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
        return {
          top: "0",
          height: `${(endMinutes / 60) * hourHeight}px`,
          left: "0",
          right: "4px",
          borderRadius: "0 4px 4px 0",
        };
      } else {
        return {
          top: "0",
          height: "100%",
          left: "0",
          right: "0",
          borderRadius: "0",
        };
      }
    } else {
      const startMinutes =
        event.start.getHours() * 60 + event.start.getMinutes();
      const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
      return {
        top: `${((startMinutes - 8 * 60) / 60) * hourHeight}px`,
        height: `${((endMinutes - startMinutes) / 60) * hourHeight}px`,
        left: "4px",
        right: "4px",
        borderRadius: "4px",
      };
    }
  };

  useEffect(() => {
    const timeColumn = timeColumnRef.current;
    const eventsContainer = eventsContainerRef.current;

    const handleScroll = (event) => {
      const target = event.target;
      const other = target === timeColumn ? eventsContainer : timeColumn;
      if (other) {
        other.scrollTop = target.scrollTop;
      }
    };

    if (timeColumn && eventsContainer) {
      timeColumn.addEventListener("scroll", handleScroll);
      eventsContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (timeColumn && eventsContainer) {
        timeColumn.removeEventListener("scroll", handleScroll);
        eventsContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex h-screen flex-col bg-[#f0f7ed]">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header section */}
      <header className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="size-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          {currentDashboard === "system admin" && session?.data?.user?.roles?.includes("system admin") && ( 

          <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
      <DialogTrigger asChild>
      <Button 
  variant="outline" 
  className="flex items-center border-[#007664] text-[#007664] transition-colors duration-300 hover:bg-[#004d40] hover:text-white"
>
  <LinkIcon className="mr-2 size-4" />
  Manage Booking URL
</Button>

      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <BookingsURLManagement 
          open={bookingDialogOpen} 
          onOpenChange={setBookingDialogOpen}
        />
      </DialogContent>
    </Dialog>
          )}

          {canCreate && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#007664] text-white hover:bg-[#005a4d]">
                  <Plus className="mr-2 size-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-11/12 max-w-md overflow-y-auto bg-[#f5f5f5]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <CreateEventForm onClose={setOpenDialog} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Calendar grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div
          ref={timeColumnRef}
          className="w-16 flex-none overflow-y-scroll border-r bg-gray-50"
        >
          <div className="h-12 border-b" />
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b pt-1 text-center text-xs text-gray-500"
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Days and events */}
        <div ref={eventsContainerRef} className="flex-1 overflow-y-auto">
          <div className="flex">
            {days.map(({ day, date }) => (
              <div key={format(date, "yyyy-MM-dd")} className="flex-1 border-r">
                {/* Day header */}
                <div
                  className={cn(
                    "sticky top-0 z-10 h-12 border-b bg-white py-2 text-center",
                    isSameDay(date, new Date()) &&
                      "border-b-2 border-[#53FDFD]",
                  )}
                >
                  <div className="font-bold">{format(date, "d")}</div>
                  <div className="text-sm text-gray-500">
                    {format(date, "EEE")}
                  </div>
                </div>

                {/* Time slots and events */}
                <div className="relative">
                  {hours.map((hour) => (
                    <div key={hour} className="h-20 border-b" />
                  ))}

                  {/* Events */}
                  {events
                    .filter((event) => shouldDisplayEvent(event, date))
                    .map((event) => (
                      <div
                        key={event.id}
                        className="absolute z-10 w-[calc(100%-8px)] overflow-hidden"
                        style={{
                          ...getEventPosition(event, date),
                          backgroundColor: event.color,
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="p-1">
                          <div className="text-xs font-semibold text-white">
                            {event.title}
                          </div>
                          <div className="text-xs text-white/80">
                            {format(event.start, "HH:mm")} -{" "}
                            {format(event.end, "HH:mm")}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event details modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-2xl font-semibold">
              {selectedEvent.title}
            </h3>

            <div className="mb-4 grid grid-cols-3 gap-4">
              {/* Event Type */}
              <div className="col-span-1 font-semibold text-gray-600">
                Type:
              </div>
              <div className="col-span-2 text-gray-600">
                {selectedEvent.type}
              </div>

              {/* Platform */}
              <div className="col-span-1 font-semibold text-gray-600">
                Platform:
              </div>
              <div className="col-span-2 text-gray-600">
                {selectedEvent.platform}
              </div>

              {/* Time */}
              <div className="col-span-1 font-semibold text-gray-600">
                Time:
              </div>
              <div className="col-span-2 text-gray-600">
                {format(selectedEvent.start, "MMM d, yyyy HH:mm")} -{" "}
                {format(selectedEvent.end, "MMM d, yyyy HH:mm")}
                <br />
                <span className="text-sm">
                  ({differenceInMinutes(selectedEvent.end, selectedEvent.start)}{" "}
                  minutes)
                </span>
              </div>

              {/* Organizer */}
              <div className="col-span-1 font-semibold text-gray-600">
                Organizer:
              </div>
              <div className="col-span-2 text-gray-600">
                {selectedEvent.organizer}
              </div>

              {/* Event Link */}
              {selectedEvent.eventLink && (
                <>
                  <div className="col-span-1 font-semibold text-gray-600">
                    Link:
                  </div>
                  <div className="col-span-2">
                    <a
                      href={selectedEvent.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {selectedEvent.eventLink}
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="mb-2 font-semibold text-gray-600">
                Description:
              </div>
              <p className="whitespace-pre-wrap text-gray-600">
                {selectedEvent.description || "No description provided"}
              </p>
            </div>

            <Button
              className="w-full bg-[#007664] hover:bg-[#005a4d]"
              onClick={() => setSelectedEvent(null)}
            >
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
