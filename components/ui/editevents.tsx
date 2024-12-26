import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditEventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (updatedEvent: any) => void;
}

export function EditEventModal({
  event,
  isOpen,
  onClose,
  onUpdateEvent,
}: EditEventModalProps) {
  const [editedEvent, setEditedEvent] = useState(event);
  const [assignmentType, setAssignmentType] = useState(
    event?.emails ? "email" : "role",
  );

  useEffect(() => {
    setEditedEvent(event);
    setAssignmentType(event?.emails ? "email" : "role");
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEvent(editedEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={editedEvent?.name}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={editedEvent?.date}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, date: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Input
              id="type"
              value={editedEvent?.type}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, type: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={editedEvent?.time}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, time: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={editedEvent?.venue}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, venue: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedEvent?.description}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Assignment Type</Label>
            <Select
              onValueChange={(value) => setAssignmentType(value)}
              defaultValue={assignmentType}
            >
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
                  setEditedEvent({
                    ...editedEvent,
                    assignTo: value,
                    emails: "",
                  })
                }
                defaultValue={editedEvent?.assignTo}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Staff">All Staff</SelectItem>
                  <SelectItem value="Doctors">Doctors</SelectItem>
                  <SelectItem value="Nurses">Nurses</SelectItem>
                  <SelectItem value="IT Team">IT Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="emails">Assign To Emails</Label>
              <Input
                id="emails"
                placeholder="Enter email addresses separated by commas"
                value={editedEvent?.emails}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    emails: e.target.value,
                    assignTo: "",
                  })
                }
              />
            </div>
          )}
          <Button className="bg-[#007664]" type="submit">
            Update Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
