"use client";

import {
  Activity,
  Brain,
  Home,
  LogOut,
  Menu,
  Settings,
  UserRoundPen,
  UserPlus,
  Users,
  UserCheck,
  X,CalendarCheck
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState,useEffect  } from "react";
import { PageProvider, usePatientsPage ,useReferralsPage,useAppointmentPage  } from "../../components/shared";
import { getSystemSettings } from "@/components/shared/api";
import {SessionManager} from '@/components/shared'


import { HeartbeatManager } from "@/components/shared";



import { Logout } from "@/components/shared";
import TeamSwitcher from "../../components/ui/team-switcher";
import {getCurrentBookingUrlConfig} from "../../components/shared/api"
import { useDateTime } from "@/hooks/useDateTime";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {createAuditLogEntry } from "@/components/shared/api"
const NavItem = ({ icon: Icon, label, active, url, onClick }) => {
  const router = useRouter();
 // const { setIsactivepage } = usePage();
 const { setActiveReferralsPage } = useReferralsPage();
 const { setActivePatientsPage } = usePatientsPage();
 const { activeAppointmentPage, setActiveAppointmentPage } = useAppointmentPage();


  return (
    <Link
      href={url}
      className={`flex w-full items-center gap-2 rounded p-2 text-sm font-bold transition duration-200 
        ${active ? "bg-[#75C05B]/20 text-white" : "text-white hover:bg-[#75C05B]/20 hover:text-white"} 
        focus:ring focus:ring-teal-300/50`}
      onClick={(e) => {
        if (url === "/doctor/patients") setActivePatientsPage("patient");
        if (url === "/doctor/referrals") setActiveReferralsPage("referral");
        if (url === "/doctor/appointments") setActiveAppointmentPage("appointment");

        if (onClick) onClick(e); // Preserve existing onClick behavior
        router.push(url);
      }}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};


const Avatar = ({ src, alt, fallback }) => (
  <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
    {src ? (
      <Image
        src={src}
        alt={alt}
        className="size-full object-cover"
        width={40}
        height={40}
      />
    ) : (
      <span className="text-lg font-semibold">{fallback}</span>
    )}
  </div>
);

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

function LayoutPage({ children }) {

  const { setActiveReferralsPage } = useReferralsPage();
  const {  setActivePatientsPage } = usePatientsPage();
  const { setActiveAppointmentPage } = useAppointmentPage();


  const { formattedDate, formattedTime } = useDateTime();
  const logout = async () => {
    console.log("logging out");
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };
  const session = useSession();
  const routes = usePathname();
  const [sessionTimeOut, setSessionTimeOut] = useState(10);

  const [currUser, setCurrUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);
  const [bookingUrl, setBookingUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Track loading status

  const [organizationName, setOrganizationName] = useState(null);

   const [isMaintenanceMode, setisMaintenanceMode] = useState(false);
     useEffect(() => {
       const checkMaintenanceMode = async () => {
         if (!session?.data?.user?.roles) return; // Ensure session data is available
   
         try {
           const settings = await getSystemSettings();
           const isMaintenanceMode = settings?.data?.maintenanceMode || false;
       
           // Allow access if the user has the "system admin" rolesMaintenanceMode){
   setisMaintenanceMode(isMaintenanceMode)
   setOrganizationName(settings?.data?.organizationName )
   setSessionTimeOut(settings?.data?.sessionTimeout)

   setIsLoading(false); // Data has been fetched

   if (session.data.user.roles.includes("system admin")) {
    return;
  }
   if (isMaintenanceMode)
    
    {router.push("/maintenance");
  }
         } catch (error) {
           console.error("Error fetching system settings:", error);
           setIsLoading(false); // Ensure loading stops even on error

         }
       };
   
       checkMaintenanceMode();
     }, [router, session]);
  useEffect(() => {
    const fetchBookingUrl = async () => {
      try {
        const data = await getCurrentBookingUrlConfig();
        let url = data?.internalBookingUrl;
  
        if (url) {
          // Ensure it has a proper scheme (http/https)
          if (!url.startsWith("http")) {
            url = `https://${url}`;
          }
        } else {
          url = "https://e-likita.com"; // Fallback URL
        }
  
        setBookingUrl(url);
      } catch (error) {
        console.error("Failed to fetch booking URL", error);
      }
    };
  
    fetchBookingUrl();
  }, []);
  
 

  const handleLogout = () => {
    setIsLogoutConfirmationOpen(true);
  };

  const confirmLogout = () => {
    console.log("Logging out...");
    setIsLogoutConfirmationOpen(false);
    router.push("/login");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAdminInfo((prevInfo) => ({ ...prevInfo, [id]: value }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#007664]">
        <HeartbeatManager /> 
    {!isLoading && <SessionManager timeout={sessionTimeOut || 10} warningTime={1}   createAuditLogEntry={createAuditLogEntry}
  session={session} 
    
    />}

      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-[#007664] p-4 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
  <h1 className="mb-1 text-3xl font-bold text-white">e-Likita</h1>
  {!isLoading && organizationName && (
    <h2 className="text-lg font-medium text-gray-200">{organizationName}</h2>
  )}
</div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2">
  <NavItem
    icon={Home}
    label="Dashboard"
    active={routes === "/doctor"}
    url={"/doctor"}
    onClick={() => isSidebarOpen && toggleSidebar()} // Close sidebar on mobile
  />
  <NavItem
    icon={Users}
    label="Patients"
  active={routes.includes("/doctor/patients")} url="/doctor/patients"
    onClick={() => {
      setActivePatientsPage("patient"); // Keep existing function
      if (isSidebarOpen) toggleSidebar(); // Close sidebar
    }}
  />
  <NavItem
    icon={UserPlus}
    label="Referrals"
    active={routes.includes("/doctor/referrals")}
    url={"/doctor/referrals"}
    onClick={() => {
      setActiveReferralsPage("referral"); // Keep existing function
      if (isSidebarOpen) toggleSidebar(); // Close sidebar
    }}
  />
  <NavItem
    icon={UserCheck}
    label="Appointments"
    active={routes === "/doctor/appointments"}
    url={"/doctor/appointments"}
    onClick={() => {
      setActiveAppointmentPage("appointment"); // Keep existing function
      if (isSidebarOpen) toggleSidebar(); // Close sidebar
    }}
  />
  <NavItem
    icon={Activity}
    label="Events"
    active={routes === "/doctor/events"}
    url={"/doctor/events"}
    onClick={() => isSidebarOpen && toggleSidebar()}
  />
  <Link
            href={bookingUrl}
            className="flex w-full items-center gap-2 p-2 text-sm font-bold text-white hover:bg-[#75C05B]/20 hover:text-white"
            target="_blank" // Opens in a new tab
            rel="noopener noreferrer" // Security best practice
            onClick={() => {
              if (isSidebarOpen) toggleSidebar();
            }}
          >
            <CalendarCheck size={18} /> <span>Bookings</span>
          </Link>
  <NavItem
    icon={UserRoundPen}
    label="Profile"
    active={routes === "/doctor/profile"}
    url={"/doctor/profile"}
    onClick={() => isSidebarOpen && toggleSidebar()}
  />
  <button
    className="flex w-full items-center gap-2 p-2 text-sm font-bold text-white hover:bg-[#75C05B]/20 hover:text-white focus:ring focus:ring-white/50"
    onClick={() => {
      setIsLogoutConfirmationOpen(true);
      if (isSidebarOpen) toggleSidebar(); // Close sidebar when logging out
    }}
  >
    <LogOut size={18} /> Logout
  </button>
</nav>


<div
  className={`fixed bottom-0 my-4 flex flex-col items-center justify-center gap-4 
    ${isSidebarOpen ? "flex" : "hidden"} md:flex`}
>
  <TeamSwitcher roles={session?.data?.user?.roles} />
  <Separator />
  {session?.data && (
    <div className="text-2xl font-bold">
      <p>{formattedDate}</p>
      <p>{formattedTime}</p>
    </div>
  )}
</div>


      </aside>
      <main className="flex-1 overflow-auto bg-gray-100">
  <div className="fixed inset-x-0 top-0 z-40 h-auto min-h-20 bg-gray-100 p-8 md:left-64">
    <div className="flex h-full items-center justify-between"> 
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#007664] md:text-3xl">Doctor</h1>
      </div>
      <div className="flex items-center">
        <div className="flex cursor-pointer items-center">
          <Link href="/doctor/profile" className="flex items-center gap-2">
            <Avatar
              src={session?.data?.user?.image}
              alt={session?.data?.user?.name}
              fallback={session?.data?.user?.name?.charAt(0) || "U"}
            />
            <div className="hidden sm:block">
              <p className="font-semibold">{session?.data?.user?.name}</p>
              <p className="text-sm text-gray-500">
                {session?.data?.user?.workEmail}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>

  <div className="mt-8 p-8 pt-20">
    {children}
  </div>

  <Logout
    isOpen={isLogoutConfirmationOpen}
    onClose={() => setIsLogoutConfirmationOpen(false)}
    onConfirm={async () => await signOut()}
    currentUser={session?.data?.user?.id}
  />
</main>

    </div>

  );
}

export default LayoutPage;
