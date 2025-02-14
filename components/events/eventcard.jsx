"use client";

import Image from "next/image";
import { CalendarDays, Video, Tag } from "lucide-react";
import { format, isSameDay } from "date-fns";

export default function EventCard({ event, onViewDetails }) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const dateTimeString = isSameDay(startDate, endDate)
    ? `${format(startDate, "MMM d, yyyy")} • ${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`
    : `${format(startDate, "MMM d, HH:mm")} - ${format(endDate, "MMM d, HH:mm")}`;

  return (
    <div
      className={`${event.color} flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md`}
    >
      <div className="relative w-full pt-[60%]">
        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      <div className="flex grow flex-col justify-between bg-white/90 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-700">
              {event.type}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 min-h-12 text-lg font-semibold text-gray-900">
            {event.title}
          </h3>

          <div className="mb-3 flex items-center space-x-2 text-sm text-gray-600">
            <CalendarDays className="size-4 shrink-0" />
            <span className="line-clamp-1">{dateTimeString}</span>
          </div>

          <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
            <Video className="size-4 shrink-0" />
            <span className="line-clamp-1">
              {event.platform}
              {/*•{" "} {event.meetingUrl ? "Online Event" : "In-person"} */}
            </span>
          </div>

          {event.description && (
            <p className="mb-4 line-clamp-3 text-sm text-gray-700">
              {event.description}
            </p>
          )}
        </div>

        <button
          onClick={onViewDetails}
          className="mt-4 block w-full rounded-md bg-[#007664] px-4 py-2 text-center font-medium text-white transition-colors hover:bg-[#005a4d] focus:outline-none focus:ring-2 focus:ring-[#007664] focus:ring-offset-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
