import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useCreateEvent,useUpdateEvent } from "@/hooks/publicevents.hook";
import { useUploadImage } from "@/hooks/upload.hook";
import { useSession } from "next-auth/react";
import { useToast } from "../../hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";

import {createAuditLogEntry} from "../shared/api"

import {Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
export function CreateEventForm({ onClose,onSubmit,initialData = null }) {

  const { data: session } = useSession();
  const { mutateAsync: createEvent } = useCreateEvent();
    const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: uploadImage } = useUploadImage();
 

const [errors, setErrors] = useState({});



  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    startDate: initialData?.start.split("T")[0]  || "",
    startTime: initialData?.start.split("T")[1].slice(0, 5) || "",
    endDate: initialData?.end.split("T")[0]  || "",
    endTime: initialData?.end.split("T")[1].slice(0, 5)|| "",
    description: initialData?.description || "",
    color: initialData?.color || "#75C05B",
    meetingUrl: initialData?.meetingUrl || "",
    platform: initialData?.platform || "Zoom",
    type: initialData?.type || "workshop",
    image: null,
    imageUrl: initialData?.imageUrl || "",
    participants: initialData?.participants || [],
  });
  const participantOptions = [
    "public",
    "system admin",
    "doctor",
    "healthcare admin",
    "healthcare assistant",
    "remote doctor",
  ];
  const [changedFields, setChangedFields] = useState({});

  const isEditing = Boolean(initialData);
  const buttonText = isEditing ? "Update Event" : "Create Event";
  const formatLabel = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const [loading, setLoading] = useState(false);
/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    try {
      let imageUrl = "";
  
      if (formData.image) {
        const uploadResponse = await uploadImage(formData.image);
        imageUrl = uploadResponse.data;
        console.log("Image uploaded successfully:", uploadResponse.data);
      }
  
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
  
      if (endDateTime <= startDateTime) {
        onSubmit("error", "End date must be after start date");
        setLoading(false);
        return;
      }
  
      const eventData = {
        ...formData,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        host: session?.user?.name || "",
        imageUrl,
      };
  
      console.log("createEvent type:", typeof createEvent);
      const result = await createEvent(eventData);
      console.log("Event creation result:", result);
  
      const createdEventId = result?.data?._id;
      const createdEventTitle = result?.data?.title;
      console.log("Created event ID:", createdEventId);
  
      if (createdEventId && session?.user?.id) {
        const auditData = {
          userId: session.user.id,
          activityType: "Event Creation",
          entityId: createdEventId,
          entityModel: "PublicEvent",
          details: `User created an event with title: ${createdEventTitle}`,
        };
  
        console.log("Creating audit log with data:", auditData);
        try {
          const auditResult = await createAuditLogEntry(auditData);
          console.log("Audit log created successfully:", auditResult);
        } catch (auditError) {
          console.error("Audit log creation failed:", auditError);
        }
      }
  
      onSubmit("success", "Event created successfully!");
      onClose(false);
    } catch (error) {
      console.error("Error creating event:", error);
      onSubmit("error", error.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
   setLoading(true); // Start loading
 
  if (Object.keys(changedFields).length === 0) {
    onSubmit("error", "No changes detected");

   
    return;
  }
  setErrors({}); // Reset errors

  const now = new Date();
  let validationErrors = {};
   // Format dates
   const startDateTime = formData.startDate && formData.startTime
   ? new Date(`${formData.startDate}T${formData.startTime}`)
   : null;
 const endDateTime = formData.endDate && formData.endTime
   ? new Date(`${formData.endDate}T${formData.endTime}`)
   : null;

 // **Validation Handling for Both New and Update Cases**
 if (!isEditing || changedFields.startDate || changedFields.startTime) {
   if (!startDateTime || isNaN(startDateTime)) {
     validationErrors.startDate = "Start date/time is required.";
   } else if (startDateTime <= now) {
     validationErrors.startDate = "Start date/time must be in the future.";
   }
 }

 if (!isEditing || changedFields.endDate || changedFields.endTime) {
   if (!endDateTime || isNaN(endDateTime)) {
     validationErrors.endDate = "End date/time is required.";
   } else if (startDateTime && endDateTime <= startDateTime) {
     validationErrors.endDate = "End date/time must be after start date/time.";
   }
 }

 // If validation errors exist, prevent submission
 if (Object.keys(validationErrors).length > 0) {
   setErrors(validationErrors);
   setLoading(false);
   return;
 }

    try {
      let imageUrl = isEditing ? initialData.imageUrl || "" : ""; // Keep existing image if editing
  
      // Upload new image if provided
      if (formData.image && (!isEditing || formData.image !== initialData.imageUrl)) {
        const uploadResponse = await uploadImage(formData.image);
        imageUrl = uploadResponse.data;
        console.log("Image uploaded successfully:", uploadResponse.data);
      }
  
   
  
      const eventDataUpdate = {
        ...changedFields, // Use only changed fields
        ...(changedFields.startDate || changedFields.startTime
          ? { start: startDateTime.toISOString() }
          : {}),
        ...(changedFields.endDate || changedFields.endTime
          ? { end: endDateTime.toISOString() }
          : {}),
        ...(formData.image && formData.image !== initialData.imageUrl
          ? { imageUrl }
          : {}),
        host: session?.user?.name || "",
      };
      
  
    
      if (isEditing) {
        // Update existing event


        await updateEvent({ id: initialData._id, ...eventDataUpdate });

        const auditData = {
          userId: session.user.id,
          activityType: "Event Update",
          entityId: initialData._id,
          entityModel: "PublicEvent",
          details: `User updated an event with title: ${initialData?.title}`};
        await createAuditLogEntry(auditData);
       onSubmit("success", "Event updated successfully");
       //console.log(eventDataUpdate)
      } else {
        // Create new event
        const eventData = {
          ...formData,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          host: session?.user?.name || "",
          imageUrl,
        };
        const result = await createEvent(eventData);
        console.log("Event creation result:", result);
  
        // Get created event ID & log audit
        const createdEventId = result?.data?._id;
        if (createdEventId && session?.user?.id) {
          const auditData = {
            userId: session.user.id,
            activityType: "Event Creation",
            entityId: createdEventId,
            entityModel: "PublicEvent",
            details: `User created an event with title: ${result?.data?.title} `, };
          await createAuditLogEntry(auditData);
        }
        onSubmit("success", "Event created successfully!");
      }
  
      // Close modal & reset state
      onClose(false);
     // setEventToEdit(null);
     // setSelectedEvent(null);
    } catch (error) {
      onSubmit("error", error.response?.data?.message || "Failed to process event. Please try again.");
      console.error("Error processing event:", error);
    } finally {
      setLoading(false); // Stop loading
    }

  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
        imageUrl: "",

      }));
      setChangedFields((prev) => ({
        ...prev,
        image: file, 
        imageUrl: "",
      }));

    }

  };

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  
    setChangedFields((prev) => ({
      ...prev,
      [id]: value,
    }));
  
    // Clear the error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [id]: undefined,
    }));
  };
  

  //console.log(initialData)
  return (

    <div className="mx-auto mt-0 w-full max-w-5xl p-2">

    <Card className="grid grid-cols-1 gap-4 bg-white  md:grid-cols-1">
      <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
      <div className="w-full text-center">
      <CardTitle className="text-2xl">
  {isEditing ? "Edit Event" : "New Event Entry"}
</CardTitle>

        </div>
      </CardHeader>
      <CardContent>

     
      <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="title">Event Title</Label>
      <Input
        id="title"
        placeholder="Add a title"
        value={formData.title}
        onChange={handleChange}
        required
      />
    </div>

    <div className="flex flex-wrap gap-4">
    <Label htmlFor='Participants' >
       Participants:
      </Label>
      {participantOptions.map((option) => (
  <div key={option} className="flex items-center space-x-2">
    <Checkbox
      id={option}
      checked={formData.participants.includes(option)}
      onCheckedChange={(checked) => {
        handleChange({
          target: {
            id: "participants",
            value: checked
              ? [...formData.participants, option]
              : formData.participants.filter((p) => p !== option),
          },
        });
      }}
      className="data-[state=checked]:border-teal-800 data-[state=checked]:bg-teal-800"
    />
    <label htmlFor={option} className="text-sm">
      {formatLabel(option)}
    </label>
  </div>
))}
</div>
  </div>

  <p className="text-sm text-gray-500">Events must be between 8:00 AM and 8:00 PM</p>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="startDate">Start Date</Label>
      <input
        id="startDate"
        type="date"
        className="w-full"

        value={formData.startDate}
        onChange={handleChange}
        required
      />
        {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}

    </div>
    <div className="space-y-2">
      <Label htmlFor="startTime">Start Time</Label>
      <input
        id="startTime"
        className="w-full"

        type="time"
        value={formData.startTime}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="endDate">End Date</Label>
      <input
        id="endDate"
        className="w-full"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        required
      />
        {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}

    </div>
    <div className="space-y-2">
      <Label htmlFor="endTime">End Time</Label>
      <input
        id="endTime"
        className="w-full"

        type="time"
        value={formData.endTime}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="description">Description</Label>
    <Textarea
  id="description"
  placeholder="Event description"
  value={formData.description}
  onChange={handleChange}
  required
  rows={4} // Adjust row count as needed
/>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="color">Event Color</Label>
      <Input
        id="color"
        type="color"
        value={formData.color}
        onChange={handleChange}
        className="h-12 w-full"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="meetingUrl">Meeting URL</Label>
      <Input
        id="meetingUrl"
        type="url"
        placeholder="https://example.com/meeting"
        value={formData.meetingUrl}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="platform">Platform</Label>
      <select
        id="platform"
        value={formData.platform}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="Zoom">Zoom</option>
        <option value="Google Meet">Google Meet</option>
        <option value="Microsoft Teams">Microsoft Teams</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="type">Event Type</Label>
      <select
        id="type"
        value={formData.type}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="workshop">Workshop</option>
        <option value="seminar">Seminar</option>
        <option value="conference">Conference</option>
        <option value="meeting">Meeting</option>
      </select>
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="image">Event Image</Label>
    <div className="flex items-center space-x-2">
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById("image")?.click()}
      >
        <Upload className="mr-2 size-4" />
        Upload Image
      </Button>
      {formData.image && (
        <span className="text-sm text-gray-500">{formData.image.name}</span>
      )}
    </div>
  </div>

  <div className="mt-6 flex justify-end space-x-2">
    <Button type="button" variant="outline" onClick={onClose}>
      Cancel
    </Button>
    <button
  type="submit"
  className="flex items-center justify-center rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#005a4d] disabled:opacity-50"
  disabled={loading}
>
  {loading ? (
    <>
      <Loader2 className="mr-2 size-5 animate-spin" />
      {isEditing ? "Updating..." : "Creating..."}
    </>
  ) : (
    isEditing ? "Update Event" : "Create Event"
  )}
</button>
  </div>
</form>



        </CardContent>
        </Card>    </div>
  );
}
