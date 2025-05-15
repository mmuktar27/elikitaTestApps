import React from "react";
import { Event } from  "@/components/shared";

const Events = () => {
  const currentDashboard="remote doctor"

  return <Event currentDashboard={currentDashboard}/>;
};

export default Events;
