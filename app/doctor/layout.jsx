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
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Logout } from "@/components/shared";
import TeamSwitcher from "../../components/ui/team-switcher";

import { useDateTime } from "@/hooks/useDateTime";
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavItem = ({ icon: Icon, label, active, url }) => (
  <Link
    href={url}
    className={`flex w-full items-center space-x-2 rounded p-2 text-sm font-bold ${
      active
        ? "bg-[#75C05B]/20 text-white"
        : "text-white hover:bg-[#75C05B]/20 hover:text-white"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

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
  const [currUser, setCurrUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);

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
      <aside
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-[#007664] p-4 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">e-Likita</h1>
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
          />
          <NavItem
            icon={Users}
            label="Patients"
            active={routes === "/doctor/patients"}
            url={"/doctor/patients"}
          />
          <NavItem
            icon={UserCheck}
            label="Appointments"
            active={routes === "/doctor/appointments"}
            url={"/doctor/appointments"}
          />
          <NavItem
            icon={UserPlus}
            label="Referrals"
            active={routes === "/doctor/referrals"}
            url={"/doctor/referrals"}
          />

          <NavItem
            icon={Activity}
            label="Events"
            active={routes === "/doctor/events"}
            url={"/doctor/events"}
          />

      
          <NavItem
            icon={UserRoundPen}
            label="Profile"
            active={routes === "/doctor/profile"}
            url={"/doctor/profile"}
          />

          <button
            className={`flex w-full items-center gap-2 space-x-2 rounded   p-2 text-sm font-bold text-white hover:bg-[#75C05B]/20 hover:text-white`}
            onClick={() => setIsLogoutConfirmationOpen(true)}
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        {!isSidebarOpen && (
          <div className="fixed bottom-0 my-4 flex flex-col items-center justify-center gap-4">
            <TeamSwitcher roles={session?.data?.user?.roles} />
            <Separator />
            {session?.data && (
              <div className="text-2xl font-bold">
                <p>{formattedDate}</p>
                <p>{formattedTime}</p>
              </div>
            )}
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto bg-gray-100">
        <div className="fixed left-64 right-0 top-0 z-40 bg-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 md:hidden">
                <Menu size={24} />
              </button>
              <h1 className="text-3xl font-bold text-[#007664]">Doctor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex cursor-pointer items-center space-x-2">
                <Link
                  href="/healthadmin/profile"
                  className="flex items-center gap-2"
                >
                  <Avatar
                    src={session?.data?.user?.image}
                    alt={session?.data?.user?.name}
                    fallback={"currUser?.displayName.charAt(0)"}
                  />
                  <div>
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
        <div className="mt-32 p-8">{children}</div>

        <Logout
          isOpen={isLogoutConfirmationOpen}
          onClose={() => setIsLogoutConfirmationOpen(false)}
          onConfirm={async () => await signOut}
        />
      </main>
    </div>
  );
}

export default LayoutPage;
