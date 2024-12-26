"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  Camera,
  ChevronDown,
  Database,
  FileBarChart,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  AdminAuditLog,
  AdminDashboard,
  AdminEvents,
  AdminReportAnalytics,
  AdminSettings,
  AdminUserComponent,
  AdminUtilities,
} from "../../components/admin/index";
import { LogoutConfirmation } from "../components/shared";

import { useRouter } from "next/navigation";

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center space-x-2 rounded p-2 text-sm font-bold ${
      active
        ? "bg-[#75C05B]/20 text-white"
        : "text-white hover:bg-[#75C05B]/20 hover:text-white"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const Avatar = ({ src, alt, fallback }) => (
  <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
    {src ? (
      <img
        src={src}
        alt={alt}
        className="size-full object-cover"
        width={100}
        height={100}
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

const Input = ({ id, value, placeholder, onChange, disabled = false }) => (
  <input
    id={id}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disabled}
    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007664]"
  />
);

const Button = ({ children, onClick, variant }) => (
  <button
    onClick={onClick}
    className={`rounded-md px-4 py-2 ${
      variant === "outline"
        ? "border border-[#007664] bg-transparent text-[#007664] hover:bg-[#007664] hover:text-white"
        : "bg-[#007664] text-white hover:bg-[#007664]/80"
    }`}
  >
    {children}
  </button>
);

function DashboardPage() {
  const { logout } = { logout: () => {} };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminInfo, setAdminInfo] = useState({
    name: "Smith",
    email: "smith@elikita.com",
    phone: "+234 123 456 7890",
    role: "System Admin",
    address: "123 Main St, Lagos, Nigeria",
  });

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
      {/* Sidebar */}
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
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={Database}
            label="Utilities"
            active={activeTab === "utilities"}
            onClick={() => setActiveTab("utilities")}
          />
          <NavItem
            icon={Users}
            label="User"
            active={activeTab === "user"}
            onClick={() => setActiveTab("user")}
          />
          <NavItem
            icon={Activity}
            label="Events"
            active={activeTab === "events"}
            onClick={() => setActiveTab("events")}
          />
          <NavItem
            icon={FileBarChart}
            label="Report/Analytics"
            active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
          />
          <NavItem
            icon={AlertTriangle}
            label="Audit Log"
            active={activeTab === "audit"}
            onClick={() => setActiveTab("audit")}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-3xl font-bold text-[#007664]">Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="size-6 cursor-pointer text-[#007664]" />
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </div>
            <div
              className="flex cursor-pointer items-center space-x-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Avatar
                src="/placeholder-user.jpg"
                alt={"currUser?.displayName.charAt(0)"}
                fallback={"currUser?.displayName.charAt(0)"}
              />
              <div>
                <p className="font-semibold">{currUser?.displayName}</p>
                <p className="text-sm text-gray-500">
                  {"currUser?.userPrincipalName"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "user" && <AdminUserComponent />}
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "utilities" && <AdminUtilities />}
        {activeTab === "report" && <AdminReportAnalytics />}
        {activeTab === "audit" && <AdminAuditLog />}
        {activeTab === "settings" && <AdminSettings />}

        <LogoutConfirmation
          isOpen={isLogoutConfirmationOpen}
          onClose={() => setIsLogoutConfirmationOpen(false)}
          onConfirm={logout}
        />
        <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <div className="rounded-lg bg-[#75C05B]/10 p-6">
            <h2 className="mb-4 text-2xl font-bold text-[#007664]">
              Edit Profile
            </h2>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <Avatar
                  src="/placeholder-user.jpg"
                  alt="@shadcn"
                  fallback="SM"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#007664] p-1"
                >
                  <Camera className="size-4 text-white" />
                </label>
                <input id="avatar-upload" type="file" className="hidden" />
              </div>
            </div>
            <div className="space-y-4">
              <Input
                id="name"
                value={adminInfo.name}
                placeholder="Name"
                onChange={handleInputChange}
                disabled={true}
              />
              <Input
                id="email"
                value={adminInfo.email}
                placeholder="Email"
                onChange={handleInputChange}
                disabled={true}
              />
              <Input
                id="phone"
                value={adminInfo.phone}
                placeholder="Phone"
                onChange={handleInputChange}
                disabled={false}
              />
              <Input
                id="address"
                value={adminInfo.address}
                placeholder="Address"
                onChange={handleInputChange}
                disabled={false}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Apply</Button>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
}

export default DashboardPage;
