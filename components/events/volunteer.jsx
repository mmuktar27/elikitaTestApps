import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const VolunteerModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center rounded-lg border border-[#3A4F39] bg-white px-4 py-2 text-[#3A4F39]">
          Volunteer
          <svg
            className="ml-2 size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl font-bold text-[#2B5845]">
            <Heart className="mr-2 text-red-500" /> Join Us as a Volunteer
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-6">
            <a
              href="https://forms.office.com/r/YiuTjJ50z4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-[#2B5845] px-6 py-3 text-center text-white transition-transform hover:scale-105"
            >
              Apply as Healthcare Expert
            </a>
            <a
              href="https://forms.office.com/r/L22eGP9mrV"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-[#3A4F39] px-6 py-3 text-center text-white transition-transform hover:scale-105"
            >
              Apply as Technical Expert
            </a>
            <p className="text-center text-sm text-gray-500">
              Join our mission to bridge healthcare delivery gaps and make a
              difference in communities.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerModal;
