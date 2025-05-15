'use client'
import { DayPilotMonth,DayPilotCalendar  } from '@daypilot/daypilot-lite-react';
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState,useMemo ,useCallback  } from "react";
import {getAllStaff} from './api'
import { Button } from "@/components/ui/button";
import BookingsURLManagement from "../admin/BookingUrl";
import {  Link as LinkIcon} from "lucide-react";

import { StatusDialog } from "../shared";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";


const navButtonStyle = {
    backgroundColor: '#004d4d',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  const viewButtonStyle = {
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
  };
  


  
  
function combineDateTime(dateStr, timeStr) {
    const today = new Date();
    const date = dateStr ? new Date(dateStr) : today;
    
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      // Default to current time if not provided
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), 0, 0);
    }
    
    return date;
  }
const Event = ({currentDashboard}) => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());
  const [cachedEvents, setCachedEvents] = useState({}); // Cache for events by month
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
const [newEventDate, setNewEventDate] = useState(null);
const [allStaff, setAllStaff] = useState([]);
const [selectedUsers, setSelectedUsers] = useState([]);
const [eventData, setEventData] = useState({ subject: '', description: '', importance: 'normal' });
const [emailSearch, setEmailSearch] = useState('');
const [filterRole, setFilterRole] = useState('all');
const [newAttendeeEmail, setNewAttendeeEmail]  = useState('');
useEffect(() => {
    getAllStaff().then(setAllStaff);
  }, []);
  const [selectionMethod, setSelectionMethod] = useState('roles'); // 'roles' or 'manual'
const [selectedRoles, setSelectedRoles] = useState([]);
const [emailInput, setEmailInput] = useState('');
  const [manualRefresh, setManualRefresh] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

// Create a list of all available roles from your staff data
// This should be calculated once when allStaff changes
 const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
const callStatusDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
  };





















const availableRoles = [
    "staff",
    "system admin",
    "doctor",
    "healthcare admin",
    "remote doctor",
    "healthcare assistant"
  ];
  // Theme with dark teal as primary color
  const [calendar, setCalendar] = useState({
    viewType: "Month",
    headerHeight: 30,
    dayHeaderHeight: 30,
    cellHeight: 80,
    headerDateFormat: "dddd", // Full day name format
    headerFontSize: "14px",
    theme: "calendar_default"
  });
  const [currentView, setCurrentView] = useState("Month");

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const dateFormat = (currentView === 'day') 
        ? (isMobile ? "dddd" : "dddd") // Full day format for day view
        : (currentView === 'week' 
          ? (isMobile ? "ddd" : "ddd") // Abbreviated day for week view
          : (isMobile ? "ddd" : "dddd")); // Default or month view, abbreviated for mobile
  
      setCalendar(prev => ({
        ...prev,
        headerDateFormat: dateFormat, // Updates based on currentView and screen size
        cellHeight: isMobile ? 60 : 80 // Adjust cell height for mobile
      }));
    };
  
    // Set initial value
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]); // Dependency on currentView to trigger updates when the view changes
  


  // Add a handler to switch between views
  const handleViewChange = (newView) => {
    setCurrentView(newView);
    setCalendar(prev => ({
      ...prev,
      viewType: newView
    }));
  };




  const addEvent = async (newEvent) => {
    if (!session) {
      console.error("No session found");
      return;
    }
    
    try {
      // Look for the access token in different possible locations
      const accessToken = 
        session.accessToken || 
        (session.user?.accessToken) || 
        (session.provider?.accessToken);
      
      if (!accessToken) {
        throw new Error('Access token not found in session');
      }
      
   
      // Direct API call to MS Graph
      const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create event: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Event created successfully:', data);
      callStatusDialog('success','Event created successfully')
      
      // Update calendar after successful event creation
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      callStatusDialog('error','Error creating event')

      //alert(`Failed to create event: ${err.message}`);
    }
  };

  // Get a key for the cache based on current month and year
  const getCacheKey = (dateObj) => {
    return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
  };


  const fetchEvents = useCallback(async () => {
    if (status === 'loading') return;
    
    if (!session) {
      setError("No session found");
      setLoading(false);
      return;
    }
    
    // Check if we have this month cached
    const currentKey = getCacheKey(date);
    if (cachedEvents[currentKey]) {
      setEvents(cachedEvents[currentKey]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Look for the access token in different possible locations
      const accessToken = 
        session.accessToken || 
        (session.user?.accessToken) || 
        (session.provider?.accessToken);
      
      if (!accessToken) {
        throw new Error('Access token not found in session');
      }
      
      // Calculate start and end dates for event fetching (3 months range)
      const startDate = new Date(date);
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      
      const endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of the month
      
      // Format dates for Microsoft Graph API
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      // Fetch events with date range filter
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${start}&endDateTime=${end}&$select=subject,start,end,importance,attendees,location,bodyPreview,onlineMeeting,onlineMeetingUrl,body`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    
      // If successful API response, process and update localStorage
      if (response.ok) {
        const data = await response.json();
        
        // Transform Graph API events to DayPilot format with more data
        const formattedEvents = data.value.map(event => ({
          id: event.id,
          text: event.subject || "No Title",
          attendees: event.attendees || "general event",
          start: event.start?.dateTime ? new Date(event.start.dateTime + 'Z').toISOString() : null,
          end: event.end?.dateTime ? new Date(event.end.dateTime + 'Z').toISOString() : null,
          backColor: getEventColor(event.importance),
          fontColor: getEventColor(event.importance) === "#004d4d" ? "white" : "#333",
          borderColor: "#003333",
          toolTip: `<div><strong>${event.subject || "No Title"}</strong>
                  ${event.location?.displayName ? `<br><i>${event.location.displayName}</i>` : ''}
                  ${event.bodyPreview ? `<br>${event.bodyPreview.substring(0, 100)}${event.bodyPreview.length > 100 ? '...' : ''}` : ''}
                  </div>`,
          // Store extra data for modal
          rawData: {
            subject: event.subject || "No Title",
            start: event.start,
            end: event.end,
            attendees: event.attendees,
            location: event.location?.displayName || "",
            bodyPreview: event.bodyPreview || "",
            body: event.body?.content || "",
            importance: event.importance || "normal",
            onlineMeeting: event.onlineMeeting || null,
            onlineMeetingUrl: event.onlineMeetingUrl || ""
          }
        })).filter(event => event.start && event.end);
        
        // Store in localStorage
        try {
          localStorage.setItem(`events_${currentKey}`, JSON.stringify(formattedEvents));
        } catch (storageError) {
          console.warn("Failed to save events to localStorage:", storageError);
        }
        
        // Store in cache and set current events
        setCachedEvents(prev => ({
          ...prev,
          [currentKey]: formattedEvents
        }));
        
        setEvents(formattedEvents);
        setError(null);
      } else {
        // Handle error responses
        if (response.status === 401) {
          console.warn("Access token expired or invalid (401) - using localStorage data if available");
          
          // Try to load from localStorage
          try {
            const storedEvents = localStorage.getItem(`events_${currentKey}`);
            if (storedEvents) {
              const parsedEvents = JSON.parse(storedEvents);
              setEvents(parsedEvents);
              setCachedEvents(prev => ({
                ...prev,
                [currentKey]: parsedEvents
              }));
              setError("Using cached events - please refresh your login session");
            } else {
              setError("Session expired and no cached events available");
              setEvents([]);
            }
          } catch (parseError) {
            console.error("Error parsing stored events:", parseError);
            setError("Error loading cached events");
            setEvents([]);
          }
        } else {
          // Handle other API errors
          const errorText = await response.text();
          throw new Error(`Failed to fetch events: ${response.status} - ${errorText}`);
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      
      // Try to load from localStorage on any error
      try {
        const storedEvents = localStorage.getItem(`events_${currentKey}`);
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
          setCachedEvents(prev => ({
            ...prev,
            [currentKey]: parsedEvents
          }));
          setError("Using cached events - there was an error connecting to the calendar service");
        } else {
          setError(err.message);
          setEvents([]);
        }
      } catch (parseError) {
        console.error("Error parsing stored events:", parseError);
        setError(err.message);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  }, [session, date, status, cachedEvents]);

// State to store filtered events based on user permissions
const [filteredEvents, setFilteredEvents] = useState([]);

// Get current user's email from session
const userEmail = session?.user?.workEmail || session?.user?.email;

// Filter events based on user role and attendance
useEffect(() => {
  // If no events yet or loading, return early
  if (!events || events.length === 0) {
    setFilteredEvents([]);
    return;
  }

  // Check if user is admin and filter events accordingly
  if (currentDashboard === "system admin") {
    // Admin can see all events
    setFilteredEvents(events);
  } else if (userEmail) {
    // Regular users only see events where they're an attendee
    const userEvents = events.filter(event => {
      // If no attendees array or it's empty, default behavior (could be adjusted)
      if (!event.attendees || !Array.isArray(event.attendees) || event.attendees.length === 0) {
        return false;
      }
      
      // Check if current user is in the attendees list by email
      return event.attendees.some(attendee => 
        attendee.emailAddress && 
        attendee.emailAddress.address && 
        attendee.emailAddress.address.toLowerCase() === userEmail.toLowerCase()
      );
    });
    
    setFilteredEvents(userEvents);
  } else {
    // No user email found, show no events
    setFilteredEvents([]);
  }
}, [events, currentDashboard, userEmail]);

// Now use filteredEvents instead of events in your calendar component


  // Function to get color based on event importance
  const getEventColor = (importance) => {
    switch (importance) {
      case 'high':
        return "#cc3300"; // Red for high priority
      case 'low':
        return "#99cc99"; // Light green for low priority
      default:
        return "#004d4d"; // Default dark teal
    }
  };

  // Navigate to previous month
  const navigatePrevious = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  // Navigate to next month
  const navigateNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  // Navigate to today
  const navigateToday = () => {
    setDate(new Date());
  };

  // Format month display name
  const getMonthDisplay = () => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Handle event click to show the modal
  const handleEventClick = (args) => {
    const clickedEvent = events.find(event => event.id === args.e.id());
    if (clickedEvent) {
      setSelectedEvent({
        ...clickedEvent.rawData,
        id: args.e.id() // Make sure to include the event ID
      });
      setShowModal(true);
    }
  };
  
  // Format date for display in modal
  const formatEventDate = (dateTimeObj) => {
    if (!dateTimeObj || !dateTimeObj.dateTime) return '';
    const date = new Date(dateTimeObj.dateTime + 'Z');
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Extract Teams meeting link from event body content
  const extractTeamsLink = (event) => {
    if (event.onlineMeetingUrl) {
      return event.onlineMeetingUrl;
    }
    
    // Try to find Teams link in the body content
    if (event.body) {
      const urlRegex = /(https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[^\s"]+)/i;
      const match = event.body.match(urlRegex);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session, status, date, fetchEvents]);

  useEffect(() => {
    if (!manualRefresh) return;
      fetchEvents();
setManualRefresh(false)
  }, [fetchEvents, manualRefresh]);


  const [isDeleting, setIsDeleting] = useState(false);



// Add these functions to your Event component

// Function to delete an event
const deleteEvent = async (eventId) => {
    if (!session || !eventId) {
      console.error("No session or event ID found");
      return;
    }
  
    setIsDeleting(true);
  
    try {
      const accessToken =
        session.accessToken ||
        session.user?.accessToken ||
        session.provider?.accessToken;
  
      if (!accessToken) {
        throw new Error('Access token not found in session');
      }
  
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
      }
  
      console.log('Event deleted successfully');
      callStatusDialog('success', 'Event deleted successfully');
      setShowModal(false);
      setManualRefresh(true);
  
    } catch (err) {
      console.error("Error deleting event:", err);
      callStatusDialog('error', `Error deleting event: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  
  // Function to handle edit event
  const [editMode, setEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  
  const startEditMode = () => {
    // Create a copy of the selected event for editing
    setEditedEvent({
      id: selectedEvent.id,
      subject: selectedEvent.subject,
      location: selectedEvent.location,
      start: {
        dateTime: selectedEvent.start?.dateTime ? new Date(selectedEvent.start.dateTime + 'Z').toISOString().slice(0, 16) : '',
        timeZone: selectedEvent.start?.timeZone || 'UTC'
      },
      end: {
        dateTime: selectedEvent.end?.dateTime ? new Date(selectedEvent.end.dateTime + 'Z').toISOString().slice(0, 16) : '',
        timeZone: selectedEvent.end?.timeZone || 'UTC'
      },
      importance: selectedEvent.importance || 'normal',
      body: {
        contentType: "text",
        content: selectedEvent.bodyPreview || ""
      }
    });
    setEditMode(true);
  };
  
  const handleEditField = (field, value) => {
    setEditedEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleBodyChange = (value) => {
    setEditedEvent(prev => ({
      ...prev,
      body: {
        ...prev.body,
        content: value
      }
    }));
  };
  
  const handleDateTimeChange = (field, value) => {
    const [datePart, timePart] = value.split('T');
    
    setEditedEvent(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        dateTime: value
      }
    }));
  };
  
  const updateEvent = async () => {
    if (!session || !editedEvent) {
      console.error("No session or edited event data found");
      return;
    }
    
    try {
      // Look for the access token in different possible locations
      const accessToken = 
        session.accessToken || 
        (session.user?.accessToken) || 
        (session.provider?.accessToken);
      
      if (!accessToken) {
        throw new Error('Access token not found in session');
      }
      
      // Prepare the event payload for Microsoft Graph API
      const eventPayload = {
        subject: editedEvent.subject,
        location: {
          displayName: editedEvent.location
        },
        start: {
          dateTime: new Date(editedEvent.start.dateTime).toISOString().slice(0, 19),
          timeZone: editedEvent.start.timeZone
        },
        end: {
          dateTime: new Date(editedEvent.end.dateTime).toISOString().slice(0, 19),
          timeZone: editedEvent.end.timeZone
        },
        importance: editedEvent.importance,
        body: editedEvent.body
      };
      
      // Direct API call to MS Graph to update the event
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/events/${selectedEvent.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update event: ${response.status} - ${errorText}`);
      }
      
      console.log('Event updated successfully');
      callStatusDialog('success', 'Event updated successfully');
      
      // Turn off edit mode, close modal, and refresh events
      setEditMode(false);
      setShowModal(false);
      setManualRefresh(true);
    } catch (err) {
      console.error("Error updating event:", err);
      callStatusDialog('error', `Error updating event: ${err.message}`);
    }
  };
  
  const cancelEdit = () => {
    setEditMode(false);
    setEditedEvent(null);
  };


  const handleAddAttendee = () => {
    // Basic email validation
    if (!newAttendeeEmail || !newAttendeeEmail.includes('@') || !newAttendeeEmail.includes('.')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists
    if (editedEvent.attendees && editedEvent.attendees.some(
      attendee => attendee.emailAddress.address.toLowerCase() === newAttendeeEmail.toLowerCase()
    )) {
      alert('This attendee is already added');
      return;
    }
    
    const newAttendee = {
      emailAddress: {
        address: newAttendeeEmail
      },
      type: "required"
    };
    
    setEditedEvent({
      ...editedEvent,
      attendees: [...(editedEvent.attendees || []), newAttendee]
    });
    
    // Clear the input
    setNewAttendeeEmail('');
  };

  const handleDateChange = (timeField, date) => {
    // Get the current time part
    const timePart = editedEvent[timeField].dateTime.split('T')[1];
    
    // Combine new date with existing time
    const newDateTime = `${date}T${timePart}`;
    
    setEditedEvent({
      ...editedEvent,
      [timeField]: {
        ...editedEvent[timeField],
        dateTime: newDateTime
      }
    });
  };
  
  const handleTimeChange = (timeField, time) => {
    // Get the current date part
    const datePart = editedEvent[timeField].dateTime.split('T')[0];
    
    // Combine existing date with new time
    const newDateTime = `${datePart}T${time}:00`;
    
    setEditedEvent({
      ...editedEvent,
      [timeField]: {
        ...editedEvent[timeField],
        dateTime: newDateTime
      }
    });
  };
  
  const handleLocationChange = (locationString) => {
    setEditedEvent({
      ...editedEvent,
      location: {
        displayName: locationString
      }
    });
  };
  
  const handleTeamsMeetingChange = (isEnabled) => {
    setEditedEvent({
      ...editedEvent,
      isOnlineMeeting: isEnabled,
      onlineMeetingProvider: isEnabled ? 'teamsForBusiness' : null,
      // Clear custom meeting link if enabling Teams
      customMeetingLink: isEnabled ? '' : editedEvent.customMeetingLink
    });
  };
  
  const handleCustomMeetingLinkChange = (link) => {
    // Detect provider from the URL
    let provider = 'other';
    if (link.includes('zoom.us')) {
      provider = 'zoom';
    } else if (link.includes('meet.google.com')) {
      provider = 'googleMeet';
    }
    
    setEditedEvent({
      ...editedEvent,
      customMeetingLink: link,
      isOnlineMeeting: !!link,
      onlineMeetingProvider: link ? provider : null
    });
  };
  
  const handleRemoveAttendee = (index) => {
    const updatedAttendees = [...editedEvent.attendees];
    updatedAttendees.splice(index, 1);
    
    setEditedEvent({
      ...editedEvent,
      attendees: updatedAttendees
    });
  };
  

 //console.log(events)
 //console.log(filteredEvents)


   // Use state instead of direct window.innerWidth access
   const [windowWidth, setWindowWidth] = useState(0);
   const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
 
   useEffect(() => {
     // Check if window is available (only in the browser)
     if (typeof window !== "undefined") {
       setWindowWidth(window.innerWidth); // Set initial window width
     }
     setIsMounted(true); // Mark the component as mounted
   }, []);
 
   useEffect(() => {
     // Function to handle window resize
     const handleResize = () => {
       if (typeof window !== "undefined") {
         setWindowWidth(window.innerWidth); // Update window width on resize
       }
     };
 
     // Add event listener for resize when component mounts
     if (isMounted) {
       window.addEventListener("resize", handleResize);
     }
 
     // Cleanup event listener on unmount
     return () => {
       if (isMounted) {
         window.removeEventListener("resize", handleResize);
       }
     };
   }, [isMounted]); // Only run after component is mounted
 
   const isMobile = windowWidth < 768;
   

  return (
    <div>
      


<div style={{ 
  display: 'flex', 
  justifyContent: 'flex-end', 
  alignItems: 'center',
  padding: '10px 0', 
  marginBottom: '10px',
  borderBottom: '1px solid #e0e0e0'
}}>

<>
  {currentDashboard === "system admin" && ( 

<Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
<DialogTrigger asChild>
<Button 
variant="outline" 
className="mx-2 flex items-center border-[#007664] text-[#007664] transition-colors duration-300 hover:bg-[#004d40] hover:text-white"
>
<LinkIcon className="mr-2 size-4" />
Manage Booking URL
</Button>

</DialogTrigger>
<DialogContent className="max-w-2xl p-0">
<BookingsURLManagement 
open={bookingDialogOpen} 
onOpenChange={setBookingDialogOpen}
/>
</DialogContent>
</Dialog>
  )}
</>
{currentDashboard === "system admin" && ( 
  <button
    onClick={() => {
      setNewEventDate(new Date().toISOString());
      setCreateModalOpen(true);
    }}
    className="rounded-md bg-teal-800 p-2 font-bold text-white transition-colors hover:bg-teal-900"
  >
    + New Event
  </button>
)}
</div>




<div className="mb-4 flex flex-col gap-2 md:mx-2 md:mb-2 md:flex-row md:justify-between">
  {/* Navigation Buttons */}
  <div className="flex gap-2">
    <button 
      onClick={navigatePrevious} 
      className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 md:flex-none"
    >
      &lt; Previous
    </button>
    <button 
      onClick={navigateToday} 
      className="flex-1 rounded-md bg-teal-700 px-4 py-2 text-white transition-colors hover:bg-teal-800 md:flex-none"
    >
      Today
    </button>
    <button 
      onClick={navigateNext} 
      className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 md:flex-none"
    >
      Next &gt;
    </button>
  </div>

  {/* View Selector - Aligned right on desktop, full width on mobile */}
  <div className="mt-2 flex md:mt-0">
    <button 
      onClick={() => handleViewChange("Day")}
      className={`flex-1 p-2 transition-colors ${
        currentView === "Day" 
          ? 'bg-teal-800 text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } rounded-l-md`}
    >
      Day
    </button>
    <button 
      onClick={() => handleViewChange("Week")}
      className={`flex-1 p-2 transition-colors ${
        currentView === "Week" 
          ? 'bg-teal-800 text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
    >
      Week
    </button>
    <button 
      onClick={() => handleViewChange("Month")}
      className={`flex-1 p-2 transition-colors ${
        currentView === "Month" 
          ? 'bg-teal-800 text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } rounded-r-md`}
    >
      Month
    </button>
  </div>
</div>
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '15px'
}}>
  <div  style={{ 
    fontSize: '20px', 
    fontWeight: 'bold', 
    color: '#004d4d',
    marginBottom: '4px'
  }}>
    {getMonthDisplay()}
  </div>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }}>
    <div style={{ margin: '0 15px 5px 0', display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        backgroundColor: '#004d4d', 
        marginRight: '5px', 
        borderRadius: '2px' 
      }}></div>
      <span>Normal</span>
    </div>
    <div style={{ margin: '0 15px 5px 0', display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        backgroundColor: '#cc3300', 
        marginRight: '5px', 
        borderRadius: '2px' 
      }}></div>
      <span>High Priority</span>
    </div>
    <div style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        backgroundColor: '#99cc99', 
        marginRight: '5px', 
        borderRadius: '2px' 
      }}></div>
      <span>Low Priority</span>
    </div>
  </div>
</div>
  

      {loading && 
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '20px'
        }}>
          <div style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #004d4d', 
            borderRadius: '50%', 
            width: '30px', 
            height: '30px', 
            animation: 'spin 2s linear infinite' 
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      }
      
      {error && 
        <div style={{ 
          backgroundColor: '#ffeeee', 
          color: '#cc0000', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '10px' 
        }}>
          Error: {error}
        </div>
      }
      
      {!loading && !error && events.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '4px' 
        }}>
          No calendar events found for this period
        </div>
      )}
      
      <div style={{ height: '600px' }}>



{/*


   
{currentView === "Month" && (
  <DayPilotMonth
    {...calendar}
     viewType="Month"
     headerDateFormat='d'
    startDate={`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`}
    events={filteredEvents}
  
    onTimeRangeSelected={(args) => {
        if (currentDashboard === "system admin") {
          setNewEventDate(args.start.toString());
          setCreateModalOpen(true);
        }
      }}
    onEventClick={handleEventClick}
  />
)}

*/}



{currentView === "Month" && (() => {

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div 
              key={day} 
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '8px 0', 
                fontWeight: 'bold', 
                wordWrap: 'break-word', 
                hyphens: 'auto',
                fontSize: isMobile ? '0.85rem' : '1rem'
              }}
            >
              {isMobile ? day.substring(0, 3) : day}
            </div>
          ))}
        </div>
      </div>
      <DayPilotMonth
        {...calendar}
        viewType="Month"
        startDate={`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`}
        events={filteredEvents}
        onTimeRangeSelected={args => {
          if (currentDashboard === "system admin") {
            setNewEventDate(args.start.toString());
            setCreateModalOpen(true);
          }
        }}
        onEventClick={handleEventClick}
        columnHeaderVisible={false}
        showHeader={false}
        headerHeight={0}
        columnHeaderHeight={0}
      />
    </div>
  );
})()}









{currentView === "Week" && (
  <DayPilotCalendar
    {...calendar}
    viewType="Week"
    startDate={date}
    events={filteredEvents}
    onTimeRangeSelected={(args) => {
        if (currentDashboard === "system admin") {
          setNewEventDate(args.start.toString());
          setCreateModalOpen(true);
        }
      }}
    onEventClick={handleEventClick}
  />
)}

{currentView === "Day" && (
  <DayPilotCalendar
    {...calendar}
    viewType="Day"
    startDate={date}
    events={filteredEvents}
    onTimeRangeSelected={(args) => {
        if (currentDashboard === "system admin") {
          setNewEventDate(args.start.toString());
          setCreateModalOpen(true);
        }
      }}
    onEventClick={handleEventClick}
  />
)}
      </div>
      {showModal && selectedEvent && (
  <div className=" " style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div  style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <div  style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '10px'
      }}>
        {!editMode ? (
          <h2 style={{ 
            margin: 0, 
            color: getEventColor(selectedEvent.importance),
            fontSize: '1.5rem'
          }}>
            {selectedEvent.subject}
          </h2>
        ) : (
          <h2 style={{ 
            margin: 0, 
            color: '#004d4d',
            fontSize: '1.5rem'
          }}>
            Edit Event
          </h2>
        )}
        <button 
          onClick={() => {
            setShowModal(false);
            setEditMode(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          &times;
        </button>
      </div>
      
      {!editMode ? (
        // View mode
        <div >
          <div style={{ marginBottom: '10px' }}>
            <strong>Start:</strong> {formatEventDate(selectedEvent.start)}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>End:</strong> {formatEventDate(selectedEvent.end)}
          </div>
          
          {selectedEvent.location && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Location:</strong> {selectedEvent.location}
            </div>
          )}
          
          {/* Teams meeting link */}
          {extractTeamsLink(selectedEvent) && (
            <div style={{ marginBottom: '20px' }}>
              <a 
                href={extractTeamsLink(selectedEvent)} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#4b53bc',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Join Teams Meeting
              </a>
            </div>
          )}
          
          {/* Event description */}
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <strong>Description:</strong>
            <div dangerouslySetInnerHTML={{ 
              __html: selectedEvent.body || selectedEvent.bodyPreview || "No description available" 
            }} />
          </div>
          
          {/* Action buttons */}
          {currentDashboard === "system admin" && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginTop: '20px',
            gap: '10px'
          }}>
            <button
              onClick={startEditMode}
              style={{
                backgroundColor: '#004d4d',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button
  onClick={() => deleteEvent(selectedEvent.id)}
  disabled={isDeleting}
  style={{
    backgroundColor: isDeleting ? '#aaa' : '#cc3300',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: isDeleting ? 'not-allowed' : 'pointer',
    opacity: isDeleting ? 0.7 : 1
  }}
>
  {isDeleting ? 'Deleting...' : 'Delete'}
</button>

          </div>)}
        </div>
      ) :
      (
        <div className=" " style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div  style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{ color: '#004d4d' }}>Edit Event</h2>
                <button onClick={cancelEdit} style={{
                  fontSize: '1.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer'
                }}>&times;</button>
              </div>
        
              {/* Title */}
              <div style={{ marginBottom: '15px' }}>
                <label>Title</label>
                <input
                  type="text"
                  value={editedEvent.subject}
                  onChange={(e) => handleEditField('subject', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
        
              {/* Description */}
              <div style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea
                  value={editedEvent.body.content}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
                />
              </div>
        
              {/* All-day checkbox */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={editedEvent.isAllDay || false}
                    onChange={(e) => setEditedEvent({ ...editedEvent, isAllDay: e.target.checked })}
                  />
                  All-day Event
                </label>
              </div>
        
              {/* Start/End Date and Time */}
              {editedEvent.isAllDay ? (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={editedEvent.start.dateTime.split('T')[0]}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>End Date</label>
                    <input
                      type="date"
                      value={editedEvent.end.dateTime.split('T')[0]}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={editedEvent.start.dateTime.split('T')[0]}
                        onChange={(e) => handleDateChange('start', e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={editedEvent.start.dateTime.split('T')[1].substring(0, 5)}
                        onChange={(e) => handleTimeChange('start', e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                  </div>
        
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label>End Date</label>
                      <input
                        type="date"
                        value={editedEvent.end.dateTime.split('T')[0]}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>End Time</label>
                      <input
                        type="time"
                        value={editedEvent.end.dateTime.split('T')[1].substring(0, 5)}
                        onChange={(e) => handleTimeChange('end', e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                  </div>
                </>
              )}
        
              {/* Event Type */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Event Type</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['inPerson', 'online', 'hybrid'].map(type => (
                    <button
                      key={type}
                      onClick={() => setEditedEvent({ ...editedEvent, eventType: type })}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: (editedEvent.eventType || 'inPerson') === type ? '#004d4d' : '#eee',
                        color: (editedEvent.eventType || 'inPerson') === type ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {type === 'inPerson' ? 'In-Person' : type === 'online' ? 'Online Meeting' : 'Hybrid'}
                    </button>
                  ))}
                </div>
              </div>
        
              {/* Physical Location */}
              {(editedEvent.eventType === 'inPerson' || editedEvent.eventType === 'hybrid') && (
                <div style={{ marginBottom: '15px' }}>
                  <label>Physical Location</label>
                  <input
                    type="text"
                    value={editedEvent.location?.displayName || ''}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Enter address or meeting room"
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
              )}
        
              {/* Online Meeting */}
              {(editedEvent.eventType === 'online' || editedEvent.eventType === 'hybrid') && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Online Meeting</label>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        checked={editedEvent.isOnlineMeeting && editedEvent.onlineMeetingProvider === 'teamsForBusiness'}
                        onChange={(e) => handleTeamsMeetingChange(e.target.checked)}
                      />
                      Microsoft Teams meeting
                    </label>
                    {editedEvent.isOnlineMeeting && editedEvent.onlineMeetingProvider === 'teamsForBusiness' ? (
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {editedEvent.onlineMeeting?.joinUrl
                          ? 'Teams meeting link already generated'
                          : 'A Teams link will be generated when saved'}
                      </div>
                    ) : (
                      <>
                        <label>Custom Meeting Link (optional)</label>
                        <input
                          type="text"
                          value={editedEvent.customMeetingLink || ''}
                          onChange={(e) => handleCustomMeetingLinkChange(e.target.value)}
                          placeholder="Zoom, Google Meet, etc."
                          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
        
              {/* Importance */}
              <div style={{ marginBottom: '15px' }}>
                <label>Importance</label>
                <select
                  value={editedEvent.importance || 'normal'}
                  onChange={(e) => handleEditField('importance', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
        
              {/* --- Recipient Selection (NEW) --- */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Select Recipients By</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setSelectionMethod('roles')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectionMethod === 'roles' ? '#004d4d' : '#eee',
                      color: selectionMethod === 'roles' ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Roles
                  </button>
                  <button
                    onClick={() => setSelectionMethod('manual')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: selectionMethod === 'manual' ? '#004d4d' : '#eee',
                      color: selectionMethod === 'manual' ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Individual Users
                  </button>
                </div>
              </div>
        
              {selectionMethod === 'roles' && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Select Roles</label>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
                    {availableRoles.map(role => (
                      <div key={role} style={{ padding: '5px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role)}
                            onChange={(e) =>
                              e.target.checked
                                ? setSelectedRoles([...selectedRoles, role])
                                : setSelectedRoles(selectedRoles.filter(r => r !== role))
                            }
                            style={{ marginRight: '8px' }}
                          />
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#666' }}>
                    {selectedRoles.length > 0
                      ? `${allStaff.filter(user => user.roles.some(role => selectedRoles.includes(role))).length} users will receive this event`
                      : 'No roles selected'}
                  </div>
                </div>
              )}
        
              {selectionMethod === 'manual' && (
                <>
                  <label>Add Users by Email</label>
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Type work email to find users..."
                      style={{ width: '100%', padding: '8px' }}
                    />
        
                    {emailInput.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}>
                        {allStaff
                          .filter(user =>
                            user.workEmail?.toLowerCase().includes(emailInput.toLowerCase()) &&
                            !selectedUsers.includes(user.id))
                          .map(user => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setSelectedUsers([...selectedUsers, user.id]);
                                setEmailInput('');
                              }}
                              style={{
                                padding: '8px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee'
                              }}
                              onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                            >
                              <div>{user.name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                {user.workEmail} ({user.roles.join(', ')})
                              </div>
                            </div>
                          ))}
                        {allStaff.filter(user =>
                          user.workEmail?.toLowerCase().includes(emailInput.toLowerCase()) &&
                          !selectedUsers.includes(user.id)).length === 0 && (
                            <div style={{ padding: '8px', color: '#999' }}>No matching users found</div>
                          )}
                      </div>
                    )}
                  </div>
        
                  <label>Selected Users</label>
                  <div style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '5px',
                    marginBottom: '15px'
                  }}>
                    {selectedUsers.length === 0 ? (
                      <div style={{ padding: '5px', color: '#999' }}>No users selected</div>
                    ) : (
                      allStaff.filter(user => selectedUsers.includes(user.id)).map(user => (
                        <div key={user.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '5px',
                          backgroundColor: '#f0f0f0',
                          margin: '2px 0',
                          borderRadius: '3px'
                        }}>
                          <span>
                            <div>{user.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.workEmail}</div>
                          </span>
                          <button
                            onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== user.id))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ff4d4d',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
        
              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button onClick={cancelEdit} style={{
                  backgroundColor: '#666',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={updateEvent} style={{
                  backgroundColor: '#004d4d',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}>Save Changes</button>
              </div>
            </div>
          </div>
      )
      
      }
    </div>
  </div>
)} 
 
  



{createModalOpen && (
  <div  style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div  style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#004d4d' }}>Create New Event</h2>
        <button onClick={() => setCreateModalOpen(false)} style={{
          fontSize: '1.5rem',
          background: 'none',
          border: 'none',
          color: '#999',
          cursor: 'pointer'
        }}>&times;</button>
      </div>

      <label>Title</label>
      <input
        type="text"
        value={eventData.subject}
        onChange={(e) => setEventData({...eventData, subject: e.target.value})}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <label>Description</label>
      <textarea
        value={eventData.description}
        onChange={(e) => setEventData({...eventData, description: e.target.value})}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Start Date</label>
          <input
            type="date"
            value={eventData.startDate || ''}
            onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Start Time</label>
          <input
            type="time"
            value={eventData.startTime || ''}
            onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
            disabled={eventData.isAllDay}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>End Date</label>
          <input
            type="date"
            value={eventData.endDate || ''}
            onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>End Time</label>
          <input
            type="time"
            value={eventData.endTime || ''}
            onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
            disabled={eventData.isAllDay}
          />
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={eventData.isAllDay || false}
            onChange={(e) => {
              const isAllDay = e.target.checked;
              setEventData({
                ...eventData, 
                isAllDay,
                // Clear time fields if all-day is checked
                startTime: isAllDay ? '' : eventData.startTime,
                endTime: isAllDay ? '' : eventData.endTime
              });
            }}
          />
          All-day Event
        </label>
      </div>

      {/* Event Type Selection (Online/Offline) */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Event Type</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setEventData({...eventData, eventType: 'inPerson'})} 
            style={{
              padding: '5px 10px',
              backgroundColor: eventData.eventType === 'inPerson' ? '#004d4d' : '#eee',
              color: eventData.eventType === 'inPerson' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            In-Person
          </button>
          <button 
            onClick={() => setEventData({...eventData, eventType: 'online'})} 
            style={{
              padding: '5px 10px',
              backgroundColor: eventData.eventType === 'online' ? '#004d4d' : '#eee',
              color: eventData.eventType === 'online' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Online Meeting
          </button>
          <button 
            onClick={() => setEventData({...eventData, eventType: 'hybrid'})} 
            style={{
              padding: '5px 10px',
              backgroundColor: eventData.eventType === 'hybrid' ? '#004d4d' : '#eee',
              color: eventData.eventType === 'hybrid' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hybrid
          </button>
        </div>
      </div>

      {/* Location fields based on event type */}
      {(eventData.eventType === 'inPerson' || eventData.eventType === 'hybrid') && (
        <div style={{ marginBottom: '15px' }}>
          <label>Physical Location</label>
          <input
            type="text"
            value={eventData.location || ''}
            onChange={(e) => setEventData({...eventData, location: e.target.value})}
            placeholder="Enter address or meeting room"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      )}

      {/* Online meeting options */}
      {(eventData.eventType === 'online' || eventData.eventType === 'hybrid') && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Online Meeting</label>
          <div style={{ 
            padding: '10px',  
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={eventData.createTeamsMeeting || false}
                  onChange={(e) => setEventData({...eventData, createTeamsMeeting: e.target.checked})}
                />
                Create Microsoft Teams meeting
              </label>
              {eventData.createTeamsMeeting && (
                <div style={{ fontSize: '0.85rem', color: '#666', marginLeft: '20px' }}>
                  A Teams meeting link will be automatically generated when the event is saved
                </div>
              )}
            </div>

            {!eventData.createTeamsMeeting && (
              <div>
                <label>Custom Meeting Link (optional)</label>
                <input
                  type="text"
                  value={eventData.customMeetingLink || ''}
                  onChange={(e) => setEventData({...eventData, customMeetingLink: e.target.value})}
                  placeholder="Enter Zoom, Google Meet, or other meeting URL"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <label>Importance</label>
      <select
        value={eventData.importance}
        onChange={(e) => setEventData({...eventData, importance: e.target.value})}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="low">Low</option>
      </select>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Select Recipients By</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setSelectionMethod('roles')} 
            style={{
              padding: '5px 10px',
              backgroundColor: selectionMethod === 'roles' ? '#004d4d' : '#eee',
              color: selectionMethod === 'roles' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Roles
          </button>
          <button 
            onClick={() => setSelectionMethod('manual')} 
            style={{
              padding: '5px 10px',
              backgroundColor: selectionMethod === 'manual' ? '#004d4d' : '#eee',
              color: selectionMethod === 'manual' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Individual Users
          </button>
        </div>
      </div>

      {selectionMethod === 'roles' && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Roles</label>
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '5px' 
          }}>
            {availableRoles.map(role => (
              <div key={role} style={{ padding: '5px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role]);
                      } else {
                        setSelectedRoles(selectedRoles.filter(r => r !== role));
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#666' }}>
            {selectedRoles.length > 0 ? 
              `${allStaff.filter(user => user.roles.some(role => selectedRoles.includes(role))).length} users will receive this event` :
              'No roles selected'
            }
          </div>
        </div>
      )}

      {selectionMethod === 'manual' && (
        <>
          <label>Add Users by Email</label>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Type work email to find users..."
              style={{ width: '100%', padding: '8px' }}
            />

            {emailInput.length > 1 && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                maxHeight: '150px', 
                overflowY: 'auto', 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                backgroundColor: 'white',
                zIndex: 10,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {allStaff
                  .filter(user => 
                    user.workEmail && 
                    user.workEmail.toLowerCase().includes(emailInput.toLowerCase()) &&
                    !selectedUsers.includes(user.id)
                  )
                  .map(user => (
                    <div 
                      key={user.id}
                      onClick={() => {
                        setSelectedUsers([...selectedUsers, user.id]);
                        setEmailInput('');
                      }}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        hover: {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <div>{user.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.workEmail} ({user.roles.join(', ')})</div>
                    </div>
                  ))
                }
                {allStaff.filter(user => 
                  user.workEmail && 
                  user.workEmail.toLowerCase().includes(emailInput.toLowerCase()) &&
                  !selectedUsers.includes(user.id)
                ).length === 0 && (
                  <div style={{ padding: '8px', color: '#999' }}>No matching users found</div>
                )}
              </div>
            )}
          </div>

          <label>Selected Users</label>
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '5px',
            marginBottom: '15px'
          }}>
            {selectedUsers.length === 0 ? (
              <div style={{ padding: '5px', color: '#999' }}>No users selected</div>
            ) : (
              allStaff
                .filter(user => selectedUsers.includes(user.id))
                .map(user => (
                  <div key={user.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px',
                    backgroundColor: '#f0f0f0',
                    margin: '2px 0',
                    borderRadius: '3px'
                  }}>
                    <span>
                      <div>{user.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.workEmail}</div>
                    </span>
                    <button 
                      onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== user.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4d4d',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      <button
        onClick={() => {
          // Create date objects from the date and time inputs
          let startDateTime, endDateTime;
          
          if (eventData.isAllDay) {
            // For all-day events, set time to beginning and end of day
            startDateTime = eventData.startDate ? new Date(eventData.startDate) : new Date();
            endDateTime = eventData.endDate ? new Date(eventData.endDate) : new Date(startDateTime);
          } else {
            // For timed events, combine date and time
            startDateTime = combineDateTime(eventData.startDate, eventData.startTime);
            endDateTime = combineDateTime(eventData.endDate, eventData.endTime);
            
            // If end date/time is before start, default to 1 hour later
            if (endDateTime <= startDateTime) {
              endDateTime = new Date(startDateTime);
              endDateTime.setHours(startDateTime.getHours() + 1);
            }
          }
          
          // Prepare location and online meeting info
          let locationString = '';
          let onlineMeetingProvider = null;
          let onlineMeetingUrl = null;
          
          if (eventData.eventType === 'inPerson') {
            locationString = eventData.location || '';
          } else if (eventData.eventType === 'online') {
            if (eventData.createTeamsMeeting) {
              onlineMeetingProvider = 'teamsForBusiness';
              // URL will be generated by MS Graph
            } else if (eventData.customMeetingLink) {
              onlineMeetingUrl = eventData.customMeetingLink;
              
              // Try to detect the provider from the URL
              if (eventData.customMeetingLink.includes('zoom.us')) {
                onlineMeetingProvider = 'zoom';
              } else if (eventData.customMeetingLink.includes('meet.google.com')) {
                onlineMeetingProvider = 'googleMeet';
              } else {
                onlineMeetingProvider = 'other';
              }
            }
          } else if (eventData.eventType === 'hybrid') {
            locationString = eventData.location || '';
            
            if (eventData.createTeamsMeeting) {
              onlineMeetingProvider = 'teamsForBusiness';
              // URL will be generated by MS Graph
            } else if (eventData.customMeetingLink) {
              onlineMeetingUrl = eventData.customMeetingLink;
              
              // Try to detect the provider from the URL
              if (eventData.customMeetingLink.includes('zoom.us')) {
                onlineMeetingProvider = 'zoom';
              } else if (eventData.customMeetingLink.includes('meet.google.com')) {
                onlineMeetingProvider = 'googleMeet';
              } else {
                onlineMeetingProvider = 'other';
              }
            }
          }
          
          const newEvent = {
            subject: eventData.subject,
            body: {
              contentType: "text",
              content: eventData.description || ""
            },
            importance: eventData.importance,
            
            // Format start and end dates properly
            start: {
              dateTime: startDateTime.toISOString().slice(0, 19),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
              dateTime: endDateTime.toISOString().slice(0, 19),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            
            isAllDay: eventData.isAllDay || false
          };
          
          // Only add location if it exists
          if (locationString && locationString.trim() !== '') {
            newEvent.location = {
              displayName: locationString
            };
          }
          
          // Handle online meeting settings
          if (eventData.createTeamsMeeting) {
            newEvent.isOnlineMeeting = true;
            newEvent.onlineMeetingProvider = 'teamsForBusiness';
          } else if (onlineMeetingUrl) {
            newEvent.isOnlineMeeting = true;
            newEvent.onlineMeetingProvider = onlineMeetingProvider;
            // Some providers may not support custom URLs through the API
          }
          
          // Format attendees correctly using email addresses
          let attendeeEmails = [];
          
          if (selectionMethod === 'roles') {
            // Find users with matching roles and get their emails
            attendeeEmails = allStaff
              .filter(user => user.roles.some(role => selectedRoles.includes(role)))
              .map(user => {
                // Make sure you're accessing the email property, not ID
                return user.email || user.workEmail || user.emailAddress;
              })
              .filter(email => email && typeof email === 'string' && email.includes('@')); // Only include valid emails
          } else {
            // For manual selection, make sure you're using email addresses
            // You might need to look up emails based on user IDs
            attendeeEmails = selectedUsers.map(userId => {
              // Find the user by ID and get their email
              const user = allStaff.find(u => u.id === userId);
              return user ? (user.email || user.workEmail || user.emailAddress) : null;
            }).filter(email => email && typeof email === 'string' && email.includes('@')); // Only include valid emails
          }
          
          // Only add attendees if there are valid emails
          if (attendeeEmails.length > 0) {
            newEvent.attendees = attendeeEmails.map(email => ({
              emailAddress: {
                address: email
              },
              type: "required"
            }));
          }
          
          
          
          addEvent(newEvent);
          console.log('Event payload:', JSON.stringify(newEvent, null, 2));
          setCreateModalOpen(false);
          setEventData({ 
            subject: '', 
            description: '', 
            importance: 'normal',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            isAllDay: false,
            eventType: 'inPerson',
            location: '',
            createTeamsMeeting: false,
            customMeetingLink: ''
          });
          setSelectedUsers([]);
          setSelectedRoles([]);
          setEmailInput('');
        }}
        style={{
          marginTop: '15px',
          backgroundColor: '#004d4d',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Save Event
      </button>
    </div>
  </div>
)}

<StatusDialog
                        isOpen={statusDialog.isOpen}
                        onClose={() => {
                          setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                         
                        }}
                        status={statusDialog.status}
                        message={statusDialog.message}
                      />
    </div>
  );
};

export default Event;