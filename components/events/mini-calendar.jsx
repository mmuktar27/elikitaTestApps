import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";

export function MiniCalendar({ currentDate, selectedDate, onDateSelect }) {
  const [viewDate, setViewDate] = useState(currentDate);

  const startDate = startOfMonth(viewDate);
  const endDate = endOfMonth(viewDate);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="rounded-lg bg-white p-3 text-sm shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0"
          onClick={() =>
            setViewDate(
              (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
            )
          }
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs font-semibold">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0"
          onClick={() =>
            setViewDate(
              (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
            )
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {dateRange.map((date) => (
          <Button
            key={date.toString()}
            variant="ghost"
            size="sm"
            className={`size-6 p-0 text-xs ${isSameMonth(date, viewDate) ? "text-gray-900" : "text-gray-400"} ${
              isSameDay(date, selectedDate) ? "bg-[#53FDFD] text-white" : ""
            }`}
            onClick={() => onDateSelect(date)}
          >
            {format(date, "d")}
          </Button>
        ))}
      </div>
    </div>
  );
}
