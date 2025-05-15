"use client";

import { Logout, SessionManager, useUserPageNav } from '@/components/shared';
import { getSystemSettings } from "@/components/shared/api";
import {
  Activity,
  AlertTriangle,
  Database,
  FileBarChart,
  Home,
  LogOut,
  Menu,
  Settings,
  UserRoundPen,
  Users,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TeamSwitcher from "../../components/ui/team-switcher";
import {createAuditLogEntry } from "@/components/shared/api"
import { HeartbeatManager } from "@/components/shared";
import { useDateTime } from "@/hooks/useDateTime";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const NavItem = ({ icon: Icon, label, active, url, onClick }) => {
  const {  setActiveUserPage } = useUserPageNav();
  const router = useRouter();

  return(
  <Link
    href={url}
    onClick={(e) => {
      if (url === "/admin/users") setActiveUserPage("users");

      if (onClick) onClick(e); // Preserve existing onClick behavior
      router.push(url);
    }}// Preserve onClick behavior
    className={`flex w-full items-center gap-2 rounded p-2 text-sm font-bold transition duration-200 
      ${active ? "bg-[#75C05B]/20 text-white" : "text-white hover:bg-[#75C05B]/20 hover:text-white"}
      focus:ring focus:ring-white/50`}


    aria-current={active ? "page" : undefined}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);}



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


function DashboardPage({ children }) {
 

  const {  setActiveUserPage } = useUserPageNav();


  const [isLoading, setIsLoading] = useState(true); // Track loading status

  const [organizationName, setOrganizationName] = useState(null);
  const { formattedDate, formattedTime } = useDateTime();

  const session = useSession();

  const routes = usePathname();

  const [currUser, setCurrUser] = useState(null);
  const [sessionTimeOut, setSessionTimeOut] = useState(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);



   useEffect(() => {
       const getOrganizationName = async () => {
   
         try {
           const settings = await getSystemSettings();
       
           // Allow access if the user has the "system admin" rolesMaintenanceMode){
   setOrganizationName(settings?.data?.organizationName )
   setSessionTimeOut(settings?.data?.sessionTimeout)
   setIsLoading(false); // Data has been fetched

 
  } catch (error) {
           console.error("Error fetching system settings:", error);
           setIsLoading(false); // Ensure loading stops even on error

         }
       };
   
       getOrganizationName();
     }, [router, session])



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
  const [isOpen, setIsOpen] = useState(false);




  
  return (
    <div className="flex h-screen bg-[#007664]">
          <HeartbeatManager /> 

{!isLoading && <SessionManager timeout={sessionTimeOut || 10} warningTime={1} createAuditLogEntry={createAuditLogEntry}
  session={session} />}

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

  <nav className="mb-6 space-y-2 pb-20">
    <NavItem
      icon={Home}
      label="Dashboard"
      active={routes === "/admin"}
      url={"/admin"}
      onClick={() => isSidebarOpen && toggleSidebar()} // Close sidebar on mobile
    />

    <NavItem
      icon={Users}
      label="User"
      active={routes === "/admin/users"}
      url={"/admin/users"}
      onClick={() => {
        setActiveUserPage("users"); // Keep existing function
        if (isSidebarOpen) toggleSidebar(); // Close sidebar
      }}
    />
    <NavItem
      icon={Activity}
      label="Events"
      active={routes === "/admin/events"}
      url={"/admin/events"}
      onClick={() => isSidebarOpen && toggleSidebar()}
    />
    <NavItem
      icon={FileBarChart}
      label="Report/Analytics"
      active={routes === "/admin/reports"}
      url={"/admin/reports"}
      onClick={() => isSidebarOpen && toggleSidebar()}
    />
    <NavItem
      icon={AlertTriangle}
      label="Audit Log"
      active={routes === "/admin/audits"}
      url={"/admin/audits"}
      onClick={() => isSidebarOpen && toggleSidebar()}
    />
    <NavItem
      icon={UserRoundPen}
      label="Profile"
      active={routes === "/admin/profile"}
      url={"/admin/profile"}
      onClick={() => isSidebarOpen && toggleSidebar()}
    />
    <NavItem
      icon={Settings}
      label="Settings"
      active={routes === "/admin/settings"}
      url={"/admin/settings"}
      onClick={() => isSidebarOpen && toggleSidebar()}
    />

    <button
      className="flex w-full items-center gap-2 p-2 text-sm font-bold text-white hover:bg-[#75C05B]/20 hover:text-white focus:ring focus:ring-white/50"
      onClick={() => {
        setIsLogoutConfirmationOpen(true);
        if (isSidebarOpen) toggleSidebar();
      }}
    >
      <LogOut size={18} /> Logout
    </button>
  </nav>
 
  <div
  className={`fixed bottom-0 my-4 flex flex-col items-center justify-center gap-4 mt-6
    ${isSidebarOpen ? "flex" : "hidden"} md:flex`}
>
  <TeamSwitcher roles={session?.data?.user?.roles} />
 
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
        <h1 className="text-2xl font-bold text-[#007664] md:text-3xl">System Admin</h1>
      </div>
      <div className="flex items-center">
        <div className="flex cursor-pointer items-center">
          <Link href="/admin/profile" className="flex items-center gap-2">
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

export default DashboardPage;
