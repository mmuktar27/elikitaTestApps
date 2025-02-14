"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Brain,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";
import React, { useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

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
        className={`transform transition-all duration-300 ease-in-out ${
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
                  className: "h-5 w-5 text-white mr-2",
                })}
                <h3 className="text-sm font-medium text-white">
                  {currentTip.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-white hover:bg-white hover:bg-opacity-20"
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
                  className="size-6 text-white hover:bg-white hover:bg-opacity-20"
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

      <Button
        variant="ghost"
        size="sm"
        className="flex h-8 w-8 transform items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
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
