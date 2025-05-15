"use client";

import { useState } from "react";
import EventCard from "../../components/events/eventcard";
import EventDivider from "../../components/events/eventdivider";
import {
  useGetEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "../../hooks/publicevents.hook";
import Image from "next/image";
import { CalendarDays, Video, Tag, Plus, Edit,X,ArrowRight ,Pencil, Trash2,CalendarCheck,XCircle } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusDialog } from "@/components/shared";

import { BsTwitterX } from "react-icons/bs";
import SkeletonCard from "../../components/ui/skeletoncard";

import { Button } from "@/components/ui/button";
import { CreateEventForm } from "../../components/events/create-event-form";
import { useToast } from "../../hooks/use-toast";
import AppLogo from "@/public/assets/Logo.svg";
import Link from "next/link";
import bgfooterImage from "@/public/assets/Footer-Hexa-Spiral.png";
import VolunteerModal from "@/components/events/volunteer";

export default function EventsPage() {
  const { toast } = useToast();

  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  const callStatusDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
    handlemodalClose(status);
  };
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetEvents();
  const { mutateAsync: createEvent } = useCreateEvent();
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: deleteEvent, isPending } = useDeleteEvent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const session = useSession();
  const userRoles = session?.data?.user?.roles || [];
  const isSystemAdmin = userRoles.includes("system admin");

  const events = data?.data?.data || [];
  const currentDate = new Date();

  // Add handleEditClick function
  const handleEditClick = (event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
  };

  const handlemodalClose = (status) => {
if (status==='success'){
  setIsAddModalOpen(false)
}
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.end) >= currentDate,
  );

  const pastEvents = sortedEvents
    .filter((event) => new Date(event.end) < currentDate)
    .reverse();

  const handleDelete = async () => {
    if (!eventToDelete?._id) return;

    try {
      await deleteEvent(eventToDelete._id);
     //toast({ title: "Event deleted successfully" });
     callStatusDialog('success','Event deleted successfully')
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      setSelectedEvent(null);
    } catch (error) {
     //toast({ title: "Failed to delete event" });
     callStatusDialog('error',"Failed to delete event" )
      console.error("Error deleting event:", error);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!eventToEdit?._id) return;

    try {
      await updateEvent({ id: eventToEdit._id, ...formData });
      //toast({ title: "Event updated successfully" });
      callStatusDialog('success','Event updated successfully')
      setIsEditModalOpen(false);
      setEventToEdit(null);
      setSelectedEvent(null);
    } catch (error) {
 
      callStatusDialog('error',"Failed to update event")
      console.error("Error updating event:", error);
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await createEvent(formData);
      toast({ message: "Event created successfully" });
      setIsAddModalOpen(false);
    } catch (error) {
      toast({ message: "Failed to create event" });
      console.error("Error creating event:", error);
    }
  };

  const DeleteConfirmationModal = () => (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete "${eventToDelete?.title}"? This
            action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setEventToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const AddEventModal = () => (


<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="relative h-[600px] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
  <button
    className="absolute right-4 top-4 rounded-full bg-red-100 p-2 text-red-700 hover:text-gray-800"
    onClick={() => setIsAddModalOpen(false)}
  >
     <XCircle className="size-6" />
  </button>
  <CreateEventForm onClose={() => setIsAddModalOpen(false)} onSubmit={callStatusDialog} />;
  </div>
</div>
  );




  const EditEventModal = () => (


    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative h-[600px] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4 pb-0 sm:p-6">
      <button
        className="absolute right-4 top-4 rounded-full bg-red-100 p-2 text-red-700 hover:text-gray-800"
        onClick={() => setIsEditModalOpen(false)}
      >
         <XCircle className="size-6" />
      </button>
      <CreateEventForm 
  onClose={() => setIsEditModalOpen(false)} 
  onSubmit={callStatusDialog} 
  initialData={eventToEdit} // Pass existing event data for editing

/>      </div>
    </div>
      );

  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const isSingleDay = isSameDay(startDate, endDate);

    const formatDateTime = (dateString) => {
      return format(new Date(dateString), "EEEE, MMMM do yyyy, h:mm a z");
    };
    //  console.log(event)
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between bg-gradient-to-r from-teal-800 to-teal-500 p-5 text-white">
            <div className="flex w-full justify-center">
  <div className="flex items-center text-center">
    <CalendarCheck className="mr-2 size-6 text-teal-300" />
    <h2 className="text-2xl font-semibold tracking-tight">Event Details</h2>
  </div>
</div>


              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-1 text-white hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>
      
            {/* Scrollable Content */}
            <div className="grow overflow-y-auto p-6">
              {/* Full-Width Event Title */}
              <div className="mb-6 text-left">
                <label className="block text-lg font-medium text-gray-600">Event Title</label>
                <h2 className="mt-1 text-2xl font-bold capitalize text-gray-900">
                  {event.title}
                </h2>
              </div>
      
              {/* Full-Width Event Image */}
              {event.image && (
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                   // className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              )}
      
              {/* Grid Layout for Event Details */}
              <div className="grid grid-cols-2 gap-4 text-center">
                {/* Start Date & Time */}
                <div className="flex flex-col items-center">

                  <label className="font-medium text-gray-600">Start Date & Time</label>
                  <div className="flex items-center gap-2 text-gray-700">
                  <CalendarDays className="size-5 text-teal-600" />
                  <span>{formatDateTime(event.start)}</span>
                  </div>
                </div>
      
                {/* End Date & Time */}
                <div className="flex flex-col items-center">
                  <label className="font-medium text-gray-600">End Date & Time</label>
                  <div className="flex items-center gap-2 text-gray-700">
                  <CalendarDays className="size-5 text-teal-600" />

                    <span>{formatDateTime(event.end)}</span>
                  </div>
                </div>
      
                {/* Event Type */}
                <div className="flex flex-col items-center">
                  <label className="font-medium text-gray-600">Event Type</label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Tag className="size-5 text-teal-600" />
                    <span className="capitalize">{event.type}</span>
                  </div>
                </div>
      
                {/* Platform */}
                <div className="flex flex-col items-center">
                  <label className="font-medium text-gray-600">Platform</label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Video className="size-5 text-teal-600" />
                    <span>{event.platform}</span>
                  </div>
                </div>
              </div>
      
              {/* Full-Width Event Description */}
              {event.description && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <label className="mb-1 block font-medium text-gray-600">Description</label>
                  <p className="whitespace-pre-wrap text-gray-700">{event.description}</p>
                </div>
              )}
      
              {/* Full-Width Registration Link */}
          {/* Registration Link & Admin Controls in Grid */}
<div className="mt-6 grid grid-cols-2 gap-4">
  {/* Registration Button */}
  {event.meetingUrl && (
    <a
      href={event.meetingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-md bg-teal-600 px-5 py-2 text-center text-lg font-medium text-white transition-colors hover:bg-teal-700"
    >
      Click here to register <ArrowRight className="size-4" />
    </a>
  )}

  {/* Admin Controls */}
  {isSystemAdmin && (
<>
<button
onClick={(e) => {
  e.stopPropagation();
  onClose();
  setEventToEdit(event); // Set the event being edited
  setIsEditModalOpen(true); // Open the edit modal
}}
className="flex items-center justify-center rounded bg-blue-500 px-5 py-2 text-lg text-white transition-colors hover:bg-blue-600"
>
<Pencil className="mr-2 size-5" /> Edit Event
</button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
      }}
      disabled={isPending}
      className="flex items-center justify-center rounded bg-red-500 px-5 py-2 text-lg text-white transition-colors hover:bg-red-600 disabled:opacity-50"
    >
      <Trash2 className="mr-2 size-5" /> Delete Event
    </button>
    </>
  )}
</div>

            </div>
          </div>
        </div>
      );  
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
        <div className="text-lg">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
        <div className="text-lg text-red-600">
          Error loading events: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFFB]">
      <div className="h-8 w-full bg-[#007664]"> </div>
      <nav className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image src={AppLogo} alt="e-Likita Logo" className="h-10" />
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/home#home"
              className="text-base font-normal text-[#2D2E2E]"
            >
              Home
            </Link>
            <Link
              href="/home#about"
              className="text-base font-normal text-[#2D2E2E]"
            >
              About Us
            </Link>
            <Link
              href="/events"
              className="text-base font-normal text-[#2D2E2E]"
            >
              Events
            </Link>
            <Link
              href="/home#contact"
              className="text-base font-normal text-[#2D2E2E]"
            >
              Contact Us
            </Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
         {/*    <Button
              className="rounded-lg border border-white bg-[#3A4F39] px-4 py-2 text-white"
              onClick={() => {}}
            >
              Sign In
            </Button> */}
            <VolunteerModal />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-green-600"
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <Link href="/home#home" className="block py-2 text-[#2D2E2E]">
              Home
            </Link>
            <Link href="/home#about" className="block py-2 text-[#2D2E2E]">
              About Us
            </Link>
            <Link href="/events" className="block py-2 text-[#2D2E2E]">
              Events
            </Link>
            <Link href="/home#contact" className="block py-2 text-[#2D2E2E]">
              Contact Us
            </Link>
            {/* <div className="mt-4 space-y-2">
              <button className="w-full rounded-lg border border-white bg-[#3A4F39] px-4 py-2 text-white">
                Sign In
              </button>
              <button className="flex w-full items-center justify-center rounded-lg border border-[#3A4F39] bg-white px-4 py-2 text-[#2B5845]">
                Volunteer
                <svg
                  className="ml-2 size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div> 
            
            */}
          </div>
        )}
      </nav>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl rounded-lg bg-[#f4f9f2] p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#B24531]">
              Upcoming & Past Events
            </h1>
            {isSystemAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#005a4d]"
              >
                <Plus className="mr-2 size-5" /> Add New Event
              </button>
            )}
          </div>

          {selectedEvent && (
            <EventModal
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
{isAddModalOpen &&(
  <>
  <AddEventModal />
  </>
)

}

{isEditModalOpen  &&(
  <>
  <EditEventModal />
  </>
)

}
          <DeleteConfirmationModal />

          <EventDivider text="UPCOMING" />
          {upcomingEvents.length > 0 ? (
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onViewDetails={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          ) : (
            <div className="mb-12 text-center text-gray-600">
              No upcoming events found.
            </div>
          )}

          <EventDivider text="PAST" />
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onViewDetails={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              No past events found.
            </div>
          )}
        </div>
      </div>
      <footer className="relative flex bg-[#007664] py-16 text-[#FFFFFF]">
        <Image
          src={bgfooterImage}
          alt="bg hero"
          fill={true}
          className="absolute z-0 opacity-20"
        />
        <div className="container z-10 mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-6">
              <Image src={AppLogo} alt="e-Likita Logo" className="h-12" />
              <p className="text-gray-300">
                Harnessing the power of tech to bridge healthcare delivery gaps
                by providing clinical decision support to the health workers.
              </p>
              <div className="relative z-50 flex items-center space-x-2">
                <a
                  href="mailto:contact@e-likita.com"
                  className="flex flex-nowrap items-center gap-2 text-nowrap"
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  contact@e-likita.com
                </a>
              </div>
            </div>

            <div className="md:ml-auto">
              <h3 className="mb-6 text-xl font-semibold">e-Likita</h3>
              <ul className="relative z-50 space-y-4">
                <li>
                  <Link href="#about" className="hover:text-gray-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-gray-300">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-gray-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-gray-300">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative z-50">
              <h3 className="mb-6 text-xl font-semibold">Follow us</h3>
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/profile.php?id=61572894154017"
                  className="hover:text-gray-300"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </Link>
                <Link
                  href="https://x.com/eLikita_app?t=tdRRKxFV16pag5MMIJP-UA&s=09"
                  className="hover:text-gray-300"
                >
                  <BsTwitterX size={24} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/e-likita/"
                  className="hover:text-gray-300"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <StatusDialog
                                  isOpen={statusDialog.isOpen}
                                  onClose={() => {
                                    setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                                   
                                  }}
                                  status={statusDialog.status}
                                  message={statusDialog.message}
                                />
        </div>
      </footer>

      <div className=" flex flex-col items-center justify-between border-t border-gray-700 bg-[#3A4F39] px-2 py-8  md:flex-row md:px-20">
        <p className="text-sm text-gray-400">
          e-Likita Copyright 2025 | All Rights Reserved
        </p>
        <div className="mt-4 flex space-x-6 md:mt-0">
          <a
            href="https://www.microsoft.com/en-US/privacy/privacystatement"
            className="text-sm text-gray-400 hover:text-white"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.microsoft.com/en-US/servicesagreement/"
            className="text-sm text-gray-400 hover:text-white"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
}
