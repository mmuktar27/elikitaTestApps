"use client";
import React, { useEffect, useState } from "react";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => {
    return typeof window !== "undefined" ? new Date() : null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDateTime(new Date());

      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 60000);

      return () => clearInterval(timer);
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!currentDateTime) {
    return null;
  }

  return (
    <div className="text-2xl font-bold">
      <p>{formatDate(currentDateTime)}</p>
      <p>{formatTime(currentDateTime)}</p>
    </div>
  );
};

export default DateTimeDisplay;
