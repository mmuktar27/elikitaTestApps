"use client";
import React, { useState } from 'react';
import { 
  Mic, 
  Camera, 
  MessageSquare, 
  Users, 
  PhoneOff,
  Phone
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

export const MeetingDialog = ({ isOpen, onOpenChange, onStartMeeting }) => {
    const [meetingName, setMeetingName] = useState('');
    const [participants, setParticipants] = useState('');
    const [meetingSuggestions, setMeetingSuggestions] = useState([]);
    const [participantSuggestions, setParticipantSuggestions] = useState([]);
    const [error, setError] = useState('');
  
    const handleStart = () => {
      if (!meetingName || !participants) {
        setError('Meeting name and participants are required');
        return;
      }
      setError('');
      onStartMeeting();
      onOpenChange(false);
    };
  
    const handleMeetingNameChange = (e) => {
      const value = e.target.value;
      setMeetingName(value);
      setError('');
      const possibleNames = ['Team Sync', 'Project Kickoff', 'Weekly Standup', 'Client Call'];
      setMeetingSuggestions(possibleNames.filter(name => name.toLowerCase().includes(value.toLowerCase())));
    };
  
    const handleParticipantChange = (e) => {
      const value = e.target.value;
      setParticipants(value);
      setError('');
      const possibleParticipants = ['msadiq@e-likita.com', 'jdoe@example.com', 'alice@company.com', 'bob@workplace.com'];
      setParticipantSuggestions(possibleParticipants.filter(email => email.toLowerCase().includes(value.toLowerCase())));
    };
  
    const selectMeetingSuggestion = (name) => {
      setMeetingName(name);
      setMeetingSuggestions([]);
    };
  
    const selectParticipantSuggestion = (email) => {
      setParticipants(email);
      setParticipantSuggestions([]);
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#00686A] text-center">Meet Now</DialogTitle>
            <DialogDescription className="text-center">
              Create your meeting details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
  <div className="grid grid-cols-4 gap-4">
    <div className="col-span-4">
      <label htmlFor="meetingName" className="block text-sm font-medium">Meeting Name</label>
      <div className="relative">
        <input 
          id="meetingName"
          value={meetingName}
          onChange={handleMeetingNameChange}
          placeholder="e-Likita"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#00686A]"
        />
        {meetingSuggestions.length > 0 && (
          <ul className="absolute left-0 w-full bg-white border rounded shadow-md mt-1 z-10">
            {meetingSuggestions.map((name, index) => (
              <li 
                key={index} 
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => selectMeetingSuggestion(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>

  <div className="grid grid-cols-4 gap-4">
    <div className="col-span-4">
      <label htmlFor="participants" className="block text-sm font-medium">Participants</label>
      <div className="relative">
        <input 
          id="participants"
          type="email"
          value={participants}
          onChange={handleParticipantChange}
          placeholder="doe@e-likita.com"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#00686A]"
        />
        {participantSuggestions.length > 0 && (
          <ul className="absolute left-0 w-full bg-white border rounded shadow-md mt-1 z-10">
            {participantSuggestions.map((email, index) => (
              <li 
                key={index} 
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => selectParticipantSuggestion(email)}
              >
                {email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
</div>

          
          <div className="flex justify-center">
            <button 
              onClick={handleStart}
              className="bg-[#00686A] hover:bg-[#008080] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
            >
              Start Call
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  


export const VideoMeetingPage = ({ isOpen, onOpenChange, onEndCall }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[1000px] min-h-[600px] flex flex-col">
        <DialogHeader className="relative flex items-center justify-center">
  {/* e-Likita Logo on the Left */}
  <span className="absolute left-0 text-lg font-semibold text-[#00686A]">e-Likita</span>

  {/* Centered Title */}
  <DialogTitle className="text-[#00686A] text-center">Video Meeting</DialogTitle>
</DialogHeader>


          
          <div className="flex flex-col flex-grow bg-gray-900 min-h-[400px]">
            <div className="flex-grow flex items-center justify-center">
              <div className="text-white text-2xl">Video feed placeholder</div>
            </div>
  
            <div className="bg-gray-800 p-4 flex justify-center space-x-4">
              <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                <Mic className="text-white h-6 w-6" />
              </button>
              <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                <Camera className="text-white h-6 w-6" />
              </button>
              <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                <MessageSquare className="text-white h-6 w-6" />
              </button>
              <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                <Users className="text-white h-6 w-6" />
              </button>
              <button 
                onClick={onEndCall}
                className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition"
              >
                <PhoneOff className="text-white h-6 w-6" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  