import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ROLES } from "@/utils/roles";

interface AddEventModalProps {
  onAddEvent: (event: any) => void;
}

export function AddEventModal({ onAddEvent }: AddEventModalProps) {
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    type: "",
    venue: "",
    time: "",
    description: "",
    assignTo: "",
    emails: "",
  });

  const [assignmentType, setAssignmentType] = useState("role");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(newEvent);
    setNewEvent({
      name: "",
      date: "",
      type: "",
      venue: "",
      time: "",
      description: "",
      assignTo: "",
      emails: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#007664]">Add New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Input
              id="type"
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, time: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={newEvent.venue}
              onChange={(e) =>
                setNewEvent({ ...newEvent, venue: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Assignment Type</Label>
            <Select onValueChange={(value) => setAssignmentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Assign to Role</SelectItem>
                <SelectItem value="email">Assign to Emails</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {assignmentType === "role" ? (
            <div className="space-y-2">
              <Label htmlFor="assignTo">Assign To Role</Label>
              <Select
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, assignTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="emails">Assign To Emails</Label>
              <Input
                id="emails"
                placeholder="Enter email addresses separated by commas"
                value={newEvent.emails}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, emails: e.target.value })
                }
              />
            </div>
          )}
          <Button className="bg-[#007664]" type="submit">
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
