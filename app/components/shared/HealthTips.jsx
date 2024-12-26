


'use client'
import React, { useState , useEffect } from 'react';
import { 
    Heart, Camera, LightbulbOff, Brain, Sparkles, Lightbulb, Activity, 
    MinusCircle, PlusCircle, Plus, Clock, Video, UserRound, Share2, 
    ArrowRight, ChevronLeft, ChevronRight, Volume2, VolumeX, AlertTriangle, 
    ArrowLeft, Beaker, Bed, Bell, Briefcase, Building, Building2, Calculator, 
    Calendar, CalendarCheck, CameraOff, Check, CheckCircle, ChevronDown, 
    Clipboard, ClockIcon, Database, Edit, Edit2, Eye, FileBarChart, FileText, 
    Filter, Home, Info, Layers, LogOut, Mail, MapPin, Mic, MicOff, Phone, 
    Pill, QrCode, Search, Settings, Speaker, Stethoscope, TestTube, Thermometer, 
    Trash2, User, UserCog, UserPlus, Users, Zap, Send, Copy, Check as CheckIcon, Globe, Printer 
  } from 'lucide-react';import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';

import { 
  Button 
} from '@/components/ui/button';



const healthTips = [
    {
      title: "Daily Exercise",
      content: "30 minutes of moderate exercise can boost your mood and energy.",
      icon: Activity
    },
    {
      title: "Hydration",
      content: "Remember to drink 8 glasses of water daily for optimal health.",
      icon: Heart
    },
    {
      title: "Mental Health",
      content: "Take short breaks during work to reduce stress and maintain focus.",
      icon: Brain
    }
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
      setCurrentTipIndex((prev) => (prev - 1 + healthTips.length) % healthTips.length);
    };
  
    const currentTip = healthTips[currentTipIndex];
  
    return (
      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        <div className={`transition-all duration-300 ease-in-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <Card 
            className="w-80 shadow-lg hover:shadow-xl mb-1" 
            style={{ backgroundColor: '#007664' }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {React.createElement(currentTip.icon, { 
                    className: "h-5 w-5 text-white mr-2" 
                  })}
                  <h3 className="font-medium text-sm text-white">{currentTip.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={handlePreviousTip}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-white">
                    {currentTipIndex + 1}/{healthTips.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={handleNextTip}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-white">{currentTip.content}</p>
              <div className="mt-2 text-right">
                <span className="text-xs text-white opacity-75">Tips refresh every 10s</span>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 shadow-md flex items-center justify-center transform hover:scale-105 transition-transform"
          style={{ backgroundColor: '#007664' }}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <LightbulbOff className="h-6 w-6 text-white" />
          ) : (
            <Lightbulb className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>
    );
  };

  export default HealthTips;