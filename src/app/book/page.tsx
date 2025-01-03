"use client";
import { useState } from "react";
import { api } from "../../trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export default function AppointmentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [email, setEmail] = useState("");

  const createEventMutation = api.appointment.createAppointment.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setType("");
      setDate(undefined);
      setStartTime("12:00");
      setEndTime("13:00");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      alert("Please select a date");
      return;
    }
  
    // Create start datetime
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(date);
    if (startHours === undefined || startMinutes === undefined) {
      alert("Invalid start time format");
      return;
    }
    startDateTime.setHours(startHours, startMinutes);
  
    // Create end datetime
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endDateTime = new Date(date);
    if (endHours === undefined || endMinutes === undefined) {
      alert("Invalid end time format");
      return;
    }
    endDateTime.setHours(endHours, endMinutes);
  
    createEventMutation.mutate({
      name,
      email,
      type,
      date: date.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      googleEventId: "placeholder", // You might want to generate this or make it optional
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Enter Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Enter Your Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">What Service are you here for?</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createEventMutation.isPending}
      >
        {createEventMutation.isPending ? "Creating Event..." : "Create Event"}
      </Button>
    </form>
  );
}