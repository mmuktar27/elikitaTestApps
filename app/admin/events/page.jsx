import React from "react";
import { Event } from  "@/components/shared";

const Events = () => {
  const currentDashboard="system admin"

  return <Event currentDashboard={currentDashboard}/>;
};

export default Events;
