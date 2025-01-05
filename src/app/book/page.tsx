"use client";
import { useState, useEffect } from "react";
import { format, setHours, setMinutes, addMinutes } from "date-fns";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import { PhoneInput } from "~/app/_components/phonenumber";
import { useSession } from "next-auth/react";

const APPOINTMENT_DURATION = 60;
const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;

const APPOINTMENT_TYPES = [
  { id: 1, name: "Dental Cleaning", duration: 60 },
  { id: 2, name: "Consultation", duration: 30 },
  { id: 3, name: "Root Canal", duration: 90 },
  { id: 4, name: "Teeth Whitening", duration: 60 },
];

export default function AppointmentBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const {data: session} = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const existingAppointments = api.appointment.getAvailableSlots.useQuery(
    { date: date?.toISOString() ?? "" },
    { enabled: !!date }
  );

  const createEventMutation = api.appointment.createAppointment.useMutation({
    onSuccess: () => {
      
      setCurrentStep(4);
    },
  });

  useEffect(() => {
    if (date) {
      generateAvailableTimeSlots();
    }
  }, [date, existingAppointments.data]);

  const generateAvailableTimeSlots = () => {
    if (!date) return;
  
    const slots: string[] = [];
    const selectedService = APPOINTMENT_TYPES.find(t => t.name === type);
    const duration = selectedService?.duration ?? APPOINTMENT_DURATION;
  
  
    const bookedSlots = existingAppointments.data?.map(apt => ({
      start: new Date(apt.startTime),
      end: new Date(apt.endTime)
    })) ?? [];
  
    
    const dayStart = setHours(setMinutes(new Date(date), 0), WORKING_HOURS_START);
    const dayEnd = setHours(setMinutes(new Date(date), 0), WORKING_HOURS_END);
  
    let currentSlot = dayStart;
    while (currentSlot < dayEnd) {
      const slotEnd = addMinutes(currentSlot, duration);
      
  
      const isOverlapping = bookedSlots.some(bookedSlot => {
        return (
          (currentSlot >= bookedSlot.start && currentSlot < bookedSlot.end) ||
          (slotEnd > bookedSlot.start && slotEnd <= bookedSlot.end) ||
          (currentSlot <= bookedSlot.start && slotEnd >= bookedSlot.end)
        );
      });
  
  
      if (!isOverlapping && slotEnd <= dayEnd) {
        slots.push(format(currentSlot, 'HH:mm'));
      }
  
      
      currentSlot = addMinutes(currentSlot, 30);
    }
  
    setAvailableSlots(slots);
  };

  const handleSubmit = () => {
    if (!date || !selectedTimeSlot) return;

    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours!, minutes);
    const endDateTime = addMinutes(startDateTime, APPOINTMENT_DURATION);

    createEventMutation.mutate({
      name,
      email,
      type,
      date: date.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      googleEventId: "placeholder",
    });
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="bg-white shadow-2xl rounded-2xl">
        <CardContent className="p-10">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "flex items-center",
                  step < currentStep && "text-ssblue",
                  step === currentStep && "text-ssblue font-bold",
                  step > currentStep && "text-gray-300"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  step <= currentStep ? "border-ssblue" : "border-gray-300"
                )}>
                  {step}
                </div>
                <div className="ml-2">
                  {step === 1 && "Personal Info"}
                  {step === 2 && "Service Type"}
                  {step === 3 && "Date & Time"}
                </div>
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-ssblue">Personal Information</h1>
                <p className="text-gray-600 mt-2">Please provide your contact details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    international
                    defaultCountry="KE"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-ssblue">Select Service</h1>
                <p className="text-gray-600 mt-2">Choose the type of appointment you need</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {APPOINTMENT_TYPES.map((appointmentType) => (
                  <Button
                    key={appointmentType.id}
                    variant={type === appointmentType.name ? "default" : "outline"}
                    className={cn(
                      "h-24 flex flex-col items-center justify-center",
                      type === appointmentType.name && "bg-ssblue"
                    )}
                    onClick={() => setType(appointmentType.name)}
                  >
                    <span className="font-semibold">{appointmentType.name}</span>
                    <span className="text-sm mt-1">{appointmentType.duration} minutes</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-ssblue">Choose Date & Time</h1>
                <p className="text-gray-600 mt-2">Select your preferred appointment slot</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Available Time Slots</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTimeSlot === slot ? "default" : "outline"}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={cn(
                          "flex items-center justify-center",
                          selectedTimeSlot === slot && "bg-ssblue"
                        )}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-ssblue">Appointment Confirmed!</h2>
              <p className="text-gray-600">
                We have sent you an email with all the details.
                See you on {date && format(date, "MMMM do")} at {selectedTimeSlot}!
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-ssblue"
              >
                Book Another Appointment
              </Button>
            </div>
          )}

          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(step => step - 1)}
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}
              <Button
                className="bg-ssblue"
                onClick={() => {
                  if (currentStep === 3) {
                    handleSubmit();
                  } else {
                    setCurrentStep(step => step + 1);
                  }
                }}
              >
                {currentStep === 3 ? "Confirm Booking" : "Continue"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}