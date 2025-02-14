import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useCreateEvent } from "@/hooks/publicevents.hook";
import { useUploadImage } from "@/hooks/upload.hook";
import { useSession } from "next-auth/react";
import { useToast } from "../../hooks/use-toast";

export function CreateEventForm({ onClose }) {
  const { data: session } = useSession();
  const { mutate: createEvent } = useCreateEvent();
  const { mutateAsync: uploadImage } = useUploadImage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    color: "#75C05B",
    meetingUrl: "",
    platform: "Zoom",
    type: "workshop",
    image: null,
    imageUrl: "",
    participants: "public",
  });

  const participantOptions = [
    "public",
    "system admin",
    "doctor",
    "healthcare admin",
    "healthcare assistant",
    "remote doctor",
  ];

  const formatLabel = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (formData.image) {
        const uploadResponse = await uploadImage(formData.image);
        imageUrl = uploadResponse.data;
        console.log("Image uploaded successfully:", uploadResponse.data);
      }

      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        ...formData,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        host: session?.user?.name || "",
        imageUrl,
      };

      await createEvent(eventData);

      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      onClose(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating event:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
        imageUrl: "",
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-full space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="Add a title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="w-full space-y-2">
        <p className="text-sm text-gray-500">
          Events must be between 8:00 AM and 8:00 PM
        </p>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="flex space-x-2">
          <div className="w-1/2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Event description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="participants">Participants</Label>
        <select
          id="participants"
          value={formData.participants}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          {participantOptions.map((option) => (
            <option key={option} value={option}>
              {formatLabel(option)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="color">Event Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={handleChange}
          className="h-12 w-full"
        />
      </div>

      <div className="w-full space-y-2">
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

      <div className="w-full space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <select
          id="platform"
          value={formData.platform}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Zoom">Zoom</option>
          <option value="Google Meet">Google Meet</option>
          <option value="Microsoft Teams">Microsoft Teams</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="type">Event Type</Label>
        <select
          id="type"
          value={formData.type}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="conference">Conference</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      <div className="w-full space-y-2">
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
        <Button
          type="submit"
          className="bg-[#007664] text-white hover:bg-[#005a4d]"
        >
          Create Event
        </Button>
      </div>
    </form>
  );
}
