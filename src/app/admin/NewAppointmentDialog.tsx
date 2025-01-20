import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import { api } from "~/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import { format, setHours, setMinutes, addMinutes } from "date-fns";
import { User, Mail, Clock, CalendarDays, ArrowRight, ArrowLeft, Clock3 } from "lucide-react";
import { cn } from "~/lib/utils";

const APPOINTMENT_TYPES = [
  { 
    id: 1, 
    name: "Dental Cleaning", 
    duration: 60,
    icon: "🦷",
    description: "Professional teeth cleaning and oral health check",
  },
  { 
    id: 2, 
    name: "Consultation", 
    duration: 30,
    icon: "👨‍⚕️",
    description: "Initial discussion of dental concerns and treatment planning",
  },
  { 
    id: 3, 
    name: "Root Canal", 
    duration: 90,
    icon: "🦿",
    description: "Complete root canal treatment with modern techniques",
  },
  { 
    id: 4, 
    name: "Teeth Whitening", 
    duration: 60,
    icon: "✨",
    description: "Professional whitening for a brighter smile",
  },
];

const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;

const STEPS = [
  { id: 1, title: "Patient Info" },
  { id: 2, title: "Service Selection" },
  { id: 3, title: "Date & Time" },
  { id: 4, title: "Confirmation" }
];

interface BookedSlot {
  start: Date;
  end: Date;
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    date: new Date(),
    startTime: "",
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();

  const existingAppointments = api.appointment.getAvailableSlots.useQuery(
    { date: formData.date?.toISOString() ?? "" },
    { enabled: !!formData.date }
  );

  const createAppointment = api.appointment.createAppointment.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      // Add toast notification here
    },
  });

  useEffect(() => {
    if (formData.date && formData.type) {
      generateAvailableTimeSlots();
    }
  }, [formData.date, formData.type, existingAppointments.data]);

  const generateAvailableTimeSlots = () => {
    const slots: string[] = [];
    const selectedService = APPOINTMENT_TYPES.find(t => t.name === formData.type);
    const duration = selectedService?.duration ?? 60;

    const bookedSlots: BookedSlot[] = existingAppointments.data?.map(apt => ({
      start: new Date(apt.startTime),
      end: new Date(apt.endTime)
    })) ?? [];

    const dayStart = setHours(setMinutes(new Date(formData.date), 0), WORKING_HOURS_START);
    const dayEnd = setHours(setMinutes(new Date(formData.date), 0), WORKING_HOURS_END);

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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!selectedTimeSlot) return;

    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    const startDateTime = new Date(formData.date);
    startDateTime.setHours(hours!, minutes);

    const selectedService = APPOINTMENT_TYPES.find(t => t.name === formData.type);
    const endDateTime = addMinutes(startDateTime, selectedService?.duration ?? 60);

    createAppointment.mutate({
      name: formData.name,
      email: formData.email,
      type: formData.type,
      date: formData.date.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      googleEventId: "placeholder",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                step >= s.id ? "bg-ssblue text-white" : "bg-gray-100"
              )}>
                {s.id}
              </div>
              <span className="ml-2 text-sm hidden sm:block">{s.title}</span>
              {s.id !== 4 && <div className="w-12 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {APPOINTMENT_TYPES.map((service) => (
                <motion.button
                  key={service.id}
                  onClick={() => setFormData({ ...formData, type: service.name })}
                  className={cn(
                    "p-4 rounded-xl text-left transition-all",
                    formData.type === service.name 
                      ? "bg-ssblue text-white shadow-lg" 
                      : "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <h3 className="font-medium mb-1">{service.name}</h3>
                  <p className={cn(
                    "text-sm mb-2",
                    formData.type === service.name ? "text-white/90" : "text-gray-600"
                  )}>
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock3 className="w-4 h-4" />
                    {service.duration} minutes
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

{step === 3 && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <div className="grid grid-cols-2 gap-6 max-h-[400px]">
      {/* Calendar Section */}
      <div>
        <Label className="mb-2 block">Select Date</Label>
        <Calendar
          mode="single"
          selected={formData.date}
          onSelect={(date) => date && setFormData({ ...formData, date })}
          className="rounded-md border"
          disabled={(date) => date < new Date()}
        />
      </div>

      {/* Time Slots Section */}
      <div>
        <Label className="mb-2 block">Available Time Slots</Label>
        <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[300px] pr-2">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedTimeSlot === slot ? "default" : "outline"}
                onClick={() => setSelectedTimeSlot(slot)}
                className="relative"
              >
                <Clock className="w-4 h-4 mr-2" />
                {slot}
              </Button>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {formData.date ? "No available slots for this date" : "Please select a date first"}
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
)}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{format(formData.date, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {APPOINTMENT_TYPES.find(t => t.name === formData.type)?.duration} minutes
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-4 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}
          <Button 
            onClick={handleNext} 
            disabled={createAppointment.isPending}
          >
            {step === 4 ? (
              createAppointment.isPending ? 'Creating...' : 'Create Appointment'
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}