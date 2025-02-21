import React from "react";
import { Calendar } from "../../../components/events/calendar";

const Events = () => {
  const currentDashboard = "healthcare admin";

  return <Calendar currentDashboard={currentDashboard} />;
};

export default Events;
