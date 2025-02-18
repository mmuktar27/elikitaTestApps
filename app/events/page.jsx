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
import { CalendarDays, Video, Tag, Plus, Edit, Trash2 } from "lucide-react";
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
      toast({ title: "Event deleted successfully" });
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      setSelectedEvent(null);
    } catch (error) {
      toast({ title: "Failed to delete event" });
      console.error("Error deleting event:", error);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!eventToEdit?._id) return;

    try {
      await updateEvent({ id: eventToEdit._id, ...formData });
      toast({ title: "Event updated successfully" });
      setIsEditModalOpen(false);
      setEventToEdit(null);
      setSelectedEvent(null);
    } catch (error) {
      toast({ title: "Failed to update event" });
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
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent className="max-h-[90vh] w-11/12 max-w-md overflow-y-auto bg-[#f5f5f5]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          onSubmit={handleAddSubmit}
          onClose={() => setIsAddModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  const EditEventModal = () => (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={(open) => {
        if (!open) setEventToEdit(null);
        setIsEditModalOpen(open);
      }}
    >
      <DialogContent className="max-h-[90vh] w-11/12 max-w-md overflow-y-auto bg-[#f5f5f5]">
        <DialogHeader>
          <DialogTitle>Edit Event: {eventToEdit?.title}</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          onSubmit={handleEditSubmit}
          onClose={() => {
            setIsEditModalOpen(false);
            setEventToEdit(null);
          }}
          initialData={eventToEdit}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );

  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const isSingleDay = isSameDay(startDate, endDate);

    const dateTimeString = isSingleDay
      ? `${format(startDate, "MMM d, yyyy")} • ${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`
      : `${format(startDate, "MMM d, HH:mm")} - ${format(endDate, "MMM d, HH:mm")}`;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-bold capitalize text-gray-900">
              {event.title}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          {event.image && (
            <div className="relative mb-4 h-48 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-gray-600" />
              <span>{dateTimeString}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="size-5 text-gray-600" />
              Type:<span className="capitalize"> {event.type}</span>
            </div>

            <div className="flex items-center gap-2">
              <Video className="size-5 text-gray-600" />
              <span>{event.platform}</span>
            </div>

            {event.description && (
              <div className="mt-3">
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}

            {event.meetingUrl && (
              <div className="mt-4">
                <a
                  href={event.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#007664] hover:underline"
                >
                  Click here to register &rarr;
                </a>
              </div>
            )}

            {isSystemAdmin && (
              <div className="mt-4 flex space-x-2">
                {/*      <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    handleEditClick(event);
                  }}
                  className="flex items-center rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                >
                  <Edit className="mr-2 size-4" /> Edit
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    setEventToDelete(event);
                    setIsDeleteModalOpen(true);
                  }}
                  disabled={isPending}
                  className="flex items-center rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  <Trash2 className="mr-2 size-4" /> Delete
                </button>
              </div>
            )}
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

          <AddEventModal />
          <EditEventModal />
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
