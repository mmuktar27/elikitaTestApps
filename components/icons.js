import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineInventory } from "react-icons/md";
import { TbChevronCompactDown } from "react-icons/tb";
import { GiExitDoor } from "react-icons/gi";
import { FaHospitalUser } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";

const MicrosoftIcon = () => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="17" y="17" width="10" height="10" fill="#FEBA08" />
    <rect x="5" y="17" width="10" height="10" fill="#05A6F0" />
    <rect x="17" y="5" width="10" height="10" fill="#80BC06" />
    <rect x="5" y="5" width="10" height="10" fill="#F25325" />
  </svg>
);
export {
  MdDashboard as DashboardIcon,
  FaUsers as UsersIcons,
  IoCalendarNumberSharp as EventsIcon,
  IoMdSettings as SettingsIcon,
  TbReportSearch as ReportIcon,
  MdOutlineInventory as UtilitiesIcon,
  TbChevronCompactDown as DropdownIcon,
  GiExitDoor as LogoutIcon,
  FaHospitalUser as PatientIcon,
  FaUserDoctor as StaffIcon,
  MicrosoftIcon,
};
