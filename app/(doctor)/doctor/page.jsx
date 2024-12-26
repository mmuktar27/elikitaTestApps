"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Camera,
  LightbulbOff,
  Brain,
  Menu,
  Sparkles,
  Lightbulb,
  Activity,
  MinusCircle,
  PlusCircle,
  Plus,
  Clock,
  Video,
  UserRound,
  Share2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowLeft,
  Beaker,
  Bed,
  Bell,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarCheck,
  CameraOff,
  Check,
  CheckCircle,
  ChevronDown,
  Clipboard,
  ClockIcon,
  Database,
  Edit,
  Edit2,
  Eye,
  FileBarChart,
  FileText,
  Filter,
  Home,
  Info,
  Layers,
  LogOut,
  Mail,
  MapPin,
  Mic,
  MicOff,
  Phone,
  Pill,
  QrCode,
  Search,
  Settings,
  Speaker,
  Stethoscope,
  TestTube,
  Thermometer,
  Trash2,
  User,
  UserCog,
  UserPlus,
  Users,
  X,
  Zap,
  Globe,
  Printer,
  VolumeIcon,
  Send,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger , DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Button 
} from '@/components/ui/button';
import Modal from "react-modal";
import { 
  Avatar, AvatarFallback, AvatarImage 
} from "@/components/ui/avatar";
import DashboardComponent from "@/app/components/doctor/Dashboard";
import ReferralsPage from "@/app/components/doctor/Referrals";

import {
 
  EventsPage,
 
  PatientsPage,
  SettingsPage,
  SmartConsultationPage,

} from "../../components/shared";

import { LogoutConfirmation } from "../../components/shared";
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






function DoctorsComponent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminInfo, setAdminInfo] = useState({
    name: "Smith",
    email: "smith@elikita.com",
    phone: "+234 123 456 7890",
    role: "System Admin",
    address: "123 Main St, Lagos, Nigeria",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
            onClick={() => {
              setActiveTab("dashboard");
              toggleSidebar();
            }}
          />
          <NavItem
            icon={Users}
            label="Patients"
            active={activeTab === "patient"}
            onClick={() => {setActiveTab("patient");
            toggleSidebar();}}
          />
          <NavItem
            icon={UserPlus}
            label="Referrals"
            active={activeTab === "referrals"}
            onClick={() => {setActiveTab("referrals");
            toggleSidebar();}}
          />
          <NavItem icon={Brain} 
        label="Smart Consultation" active={activeTab === 'Smart Consultation'}
         onClick={() => {setActiveTab('Smart Consultation');
         toggleSidebar();}} />
          <NavItem
            icon={Activity}
            label="Events"
            active={activeTab === "events"}
            onClick={() => {setActiveTab("events");
            toggleSidebar();}}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => {setActiveTab("settings");
            toggleSidebar();}}
          />
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-100 p-2">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 md:hidden">
              <Menu size={24} />
            </button>
            <h1 
                className="text-3xl font-bold text-[#007664]" 
                style={{ textTransform: 'capitalize' }}
              >
                {activeTab === "dashboard" ? (
                  <>
                    <span>{activeTab}</span> 
                    <span className="ml-2">&gt;</span> {/* Adds caret */}
                    <span className="ml-2">Doctors Dashboard</span>
                  </>
                ) : (
                  activeTab
                )}
              </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="size-6 cursor-pointer text-[#007664]" />
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </div>
            <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          {/* Avatar: Always Visible */}
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>

          {/* Admin Info: Hidden on Mobile */}
          <div className="hidden sm:block">
            <p className="font-semibold">{adminInfo.name}</p>
            <p className="text-sm text-gray-500">{adminInfo.email}</p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent 
        className="
          fixed 
          mo:bottom-0 
        
          mo:w-full 
          mo:max-w-full 
          rounded-t-xl 
          mo:rounded-lg 
      
          mo:left-1/2 
          m0:top-1/2 
          
          bg-[#75C05B]/10 
          p-6 
          mo:p-8
        "
      >
        <DialogHeader>
          <DialogTitle className="text-[#007664] text-lg sm:text-xl md:text-2xl text-center">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 bg-[#007664] rounded-full p-1 cursor-pointer shadow-md"
            >
              <Camera className="h-5 w-5 text-white" />
            </label>
            <input id="avatar-upload" type="file" className="hidden" />
          </div>
        </div>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <Input
            id="name"
            value={adminInfo.name}
            placeholder="Name"
            onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
            disabled={!isEditing}
            className="w-full"
          />
          <Input
            id="email"
            value={adminInfo.email}
            placeholder="Email"
            onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
            disabled={!isEditing}
            className="w-full"
          />
          <Input
            id="phone"
            value={adminInfo.phone}
            placeholder="Phone"
            onChange={(e) => setAdminInfo({ ...adminInfo, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full"
          />
          <Input
            id="address"
            value={adminInfo.address}
            placeholder="Address"
            onChange={(e) => setAdminInfo({ ...adminInfo, address: e.target.value })}
            disabled={!isEditing}
            className="w-full"
          />

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <Button
              variant="outline"
              className="bg-[#007664] text-white hover:bg-[#007664]/80 w-full sm:w-auto mb-2 sm:mb-0"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>

            {isEditing && (
              <Button
                className="bg-[#007664] hover:bg-[#007664]/80 w-full sm:w-auto"
                onClick={() => {
                  // Handle applying changes, e.g., save data
                  setIsEditing(false);
                }}
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
          </div>
        </div>
        {activeTab === "dashboard" && <DashboardComponent />}
        {activeTab === "patient" && <PatientsPage />}
        {activeTab === "events" && <EventsPage />}
        {activeTab === "referrals" && <ReferralsPage />}
        {activeTab === "Smart Consultation" && <SmartConsultationPage />}
        {activeTab === "settings" && <SettingsPage />}

        <LogoutConfirmation
          isOpen={isLogoutConfirmationOpen}
          onClose={() => setIsLogoutConfirmationOpen(false)}
          onConfirm={confirmLogout}
        />
   
      </main>
    </div>
  );
}

export default DoctorsComponent;
