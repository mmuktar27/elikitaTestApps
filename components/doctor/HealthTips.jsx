"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Camera,
  LightbulbOff,
  Brain,
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
  Zap,
  Send,
  Copy,
  Check as CheckIcon,
  Globe,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const healthTips = [
  {
    title: "Daily Exercise",
    content: "30 minutes of moderate exercise can boost your mood and energy.",
    icon: Activity,
  },
  {
    title: "Hydration",
    content: "Remember to drink 8 glasses of water daily for optimal health.",
    icon: Heart,
  },
  {
    title: "Mental Health",
    content:
      "Take short breaks during work to reduce stress and maintain focus.",
    icon: Brain,
  },
];

const HealthTips = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
  };

  const handlePreviousTip = () => {
    setCurrentTipIndex(
      (prev) => (prev - 1 + healthTips.length) % healthTips.length,
    );
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <div
        className={`transition-all duration-300 ease-in-out${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <Card
          className="mb-1 w-80 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: "#007664" }}
        >
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                {React.createElement(currentTip.icon, {
                  className: "size-5 text-white mr-2",
                })}
                <h3 className="text-sm font-medium text-white">
                  {currentTip.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-white hover:bg-white/50"
                  onClick={handlePreviousTip}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-white">
                  {currentTipIndex + 1}/{healthTips.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-white hover:bg-white/20"
                  onClick={handleNextTip}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-white">{currentTip.content}</p>
            <div className="mt-2 text-right">
              <span className="text-xs text-white opacity-75">
                Tips refresh every 10s
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex size-8 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
        style={{ backgroundColor: "#007664" }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? (
          <LightbulbOff className="size-6 text-white" />
        ) : (
          <Lightbulb className="size-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default HealthTips;
