import { AppointmentsPage } from "@/components/shared";

const Appointments = () => {
  const currentDashboard = "healthcare admin";

  return <AppointmentsPage currentDashboard={currentDashboard}/>;
};

export default Appointments;
