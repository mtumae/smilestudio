"use client";
import { useState, useEffect } from "react";
import { format, setHours, setMinutes, addMinutes } from "date-fns";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { 
  CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "~/lib/utils";
import { PhoneInput } from "~/app/_components/phonenumber";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "~/hooks/use-toast";

const APPOINTMENT_TYPES = [
  { 
    id: 1, 
    name: "Dental Cleaning", 
    duration: 60,
    icon: "🦷",
    description: "Professional teeth cleaning and oral health check",
    benefits: ["Complete oral examination", "Plaque removal", "Teeth polishing"]
  },
  { 
    id: 2, 
    name: "Consultation", 
    duration: 30,
    icon: "👨‍⚕️",
    description: "Initial discussion of dental concerns and treatment planning",
    benefits: ["Treatment plan", "Cost estimation", "Health assessment"]
  },
  { 
    id: 3, 
    name: "Root Canal", 
    duration: 90,
    icon: "🦿",
    description: "Complete root canal treatment with modern techniques",
    benefits: ["Pain relief", "Tooth preservation", "Modern equipment"]
  },
  { 
    id: 4, 
    name: "Teeth Whitening", 
    duration: 60,
    icon: "✨",
    description: "Professional whitening for a brighter smile",
    benefits: ["Immediate results", "Long-lasting", "Safe procedure"]
  },
];

const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;

export default function AppointmentBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: session } = useSession();
  const { data: userData, isLoading: userLoading } = api.user.getMe.useQuery(undefined, {
    enabled: !!session?.user
  });

  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? "");
      setEmail(userData.email ?? "");
      setPhone(userData.phonenumber ?? "");
    }
  }, [userData]);

  const existingAppointments = api.appointment.getAvailableSlots.useQuery(
    { date: date?.toISOString() ?? "" },
    { enabled: !!date }
  );

  const createEventMutation = api.appointment.createAppointment.useMutation({
    onSuccess: () => {
      setCurrentStep(4);
      toast({
        title: "Success",
        description: "Appointment Booked Successfully",
      });
    },
    onError: (error) => {
      toast({
        variant:"destructive",
        title: "Failure",
        description: "Failed to book appointment. Please try again.",
      });
      
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (date) {
      generateAvailableTimeSlots();
    }
  }, [date, existingAppointments.data]);

const generateAvailableTimeSlots = (): void => {
  if (!date) return;

  const slots: string[] = [];
  const selectedService = APPOINTMENT_TYPES.find(t => t.name === type);
  const duration = selectedService?.duration ?? 60;

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

const validateStep = (step: number) => {
  switch (step) {
    case 1:
      if (!name || !email || !phone) {
        toast({
          variant:"destructive",
          title: "Please fill in all the fields",
        });
        
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          variant:"destructive",
          title: "Enter a valid email",
        });
        
        return false;
      }
      return true;
    case 2:
      if (!type) {
        toast({
          variant:"destructive",
          title: "Select Service Type",
          
        });
        
        return false;
      }
      return true;
    case 3:
      if (!date || !selectedTimeSlot) {
          toast({
        variant:"destructive",
        title: "Select both a date and time",
      
      });
      
        return false;
      }
      return true;
    default:
      return true;
  }
};

const handleSubmit = async () => {
  if (!validateStep(3)) return;
  
  setIsSubmitting(true);
  
  const [hours, minutes] = selectedTimeSlot!.split(':').map(Number);
  const startDateTime = new Date(date!);
  startDateTime.setHours(hours!, minutes);
  const selectedService = APPOINTMENT_TYPES.find(t => t.name === type);
  const endDateTime = addMinutes(startDateTime, selectedService?.duration ?? 60);

  try {
    await createEventMutation.mutateAsync({
      name,
      email,
      type,
      date: date!.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      googleEventId: "placeholder",
    });
  } catch (error) {
    setIsSubmitting(false);
  }
};

const handleNext = () => {
  if (validateStep(currentStep)) {
    setCurrentStep(step => step + 1);
  }
};

const pageTransitionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const renderStepIndicator = () => (
  <motion.div 
    className="flex flex-wrap justify-center gap-4 mb-12"
    variants={containerVariants}
    initial="initial"
    animate="animate"
  >
    {[
      { step: 1, label: "Personal Info", icon: User },
      { step: 2, label: "Service", icon: CalendarDays },
      { step: 3, label: "Schedule", icon: Clock3 }
    ].map(({ step, label, icon: Icon }) => (
      <motion.div
        key={step}
        variants={itemVariants}
        className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-full transition-all",
          currentStep === step && "bg-ssblue text-white shadow-lg",
          currentStep < step && "text-gray-400",
          currentStep > step && "text-ssblue"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          currentStep >= step ? "bg-white/20" : "bg-gray-100"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium hidden sm:block">{label}</span>
      </motion.div>
    ))}
  </motion.div>
);


return (
  <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 py-8 px-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {renderStepIndicator()}
 
      <Card className="border-0 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.h1 
                    className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Tell Us About Yourself
                  </motion.h1>
                  <p className="text-gray-600 mt-3">We'll use these details to contact you about your appointment</p>
                </div>
 
                <motion.div 
                  className="max-w-2xl mx-auto space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 py-6 bg-white/50 border-gray-200 focus:bg-white transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </motion.div>
 
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-6 bg-white/50 border-gray-200 focus:bg-white transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </motion.div>
 
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        international
                        defaultCountry="KE"
                        className="w-full pl-10 py-6 bg-white/50 focus:bg-white transition-all"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
 
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.h1 
                    className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Choose Your Service
                  </motion.h1>
                  <p className="text-gray-600 mt-3">Select the type of appointment you need</p>
                </div>
 
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                >
                  {APPOINTMENT_TYPES.map((service) => (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => setType(service.name)}
                        className={cn(
                          "w-full p-6 rounded-2xl text-left transition-all duration-200",
                          type === service.name 
                            ? "bg-ssblue text-white shadow-lg ring-2 ring-ssblue ring-offset-2" 
                            : "bg-white/50 hover:bg-white hover:shadow-md"
                        )}
                      >
                        <div className="text-3xl mb-3">{service.icon}</div>
                        <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                        <p className={cn(
                          "text-sm mb-4",
                          type === service.name ? "text-white/90" : "text-gray-600"
                        )}>
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock3 className="w-4 h-4" />
                          {service.duration} minutes
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
 
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.h1 
                    className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Pick Your Time
                  </motion.h1>
                  <p className="text-gray-600 mt-3">Choose a convenient date and time for your appointment</p>
                </div>
 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <Label className="text-gray-700 font-medium mb-4 block">Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-lg"
                      disabled={(date) => date < new Date()}
                    />
                  </motion.div>
 
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <Label className="text-gray-700 font-medium mb-4 block">Available Time Slots</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <motion.button
                            key={slot}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={cn(
                              "p-4 rounded-xl flex items-center justify-center gap-2 transition-all",
                              selectedTimeSlot === slot 
                                ? "bg-ssblue text-white shadow-lg" 
                                : "bg-gray-50 hover:bg-gray-100"
                            )}
                          >
                            <Clock className="w-4 h-4" />
                            {slot}
                          </motion.button>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          {date ? "No available slots for this date" : "Please select a date first"}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
 
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Your appointment is scheduled for<br />
                  <span className="font-semibold text-ssblue">
                    {date && format(date, "MMMM do")} at {selectedTimeSlot}
                  </span>
                </p>
                
                <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-medium text-gray-700 mb-4">Appointment Details</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {APPOINTMENT_TYPES.find(t => t.name === type)?.duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{email}</span>
                    </div>
                  </div>
                </div>
 
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-ssblue hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg shadow-lg transition-all"
                >
                  Book Another Appointment
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
 
          {currentStep < 4 && (
            <motion.div 
              className="flex flex-col sm:flex-row justify-between mt-12 pt-6 border-t gap-4"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(step => step - 1)}
                  className="order-2 sm:order-1 py-6 px-8"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}
              <Button
                onClick={() => currentStep === 3 ? handleSubmit() : handleNext()}
                className="bg-ssblue hover:bg-blue-600 text-white order-1 sm:order-2 py-6 px-8 rounded-xl shadow-lg transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    {currentStep === 3 ? "Confirm Booking" : "Continue"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  </div>
 );
 }