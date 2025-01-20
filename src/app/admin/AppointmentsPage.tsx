"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { CalendarDays, Search, Plus } from 'lucide-react';
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentsListSkeleton } from "./AppointmentListSkeleton";
import { NewAppointmentDialog } from "./NewAppointmentDialog";
import type { RouterOutputs } from "~/trpc/react";

type Appointment = RouterOutputs["appointment"]["getAllAppointments"][number];
type AppointmentStatus = "AwAp" | "booked" | "done";

export function AppointmentsPage() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: appointments, isLoading, refetch } = 
    api.appointment.getAllAppointments.useQuery({
      search,
    }, {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false
    });

  const updateStatusMutation = api.appointment.updateAppointmentStatus.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Appointments
          </h1>
          <Button 
            onClick={() => setIsNewAppointmentOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 py-2 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 gap-1">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Upcoming</TabsTrigger>
              <TabsTrigger value="awaiting" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Awaiting Approval</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Completed</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="upcoming">
                <AppointmentsList
                  appointments={appointments?.filter((app): app is Appointment => 
                    app.status === "booked"
                  )}
                  isLoading={isLoading}
                  onStatusUpdate={updateStatusMutation.mutate}
                  actionLabel="Mark as Done"
                  actionStatus="done"
                />
              </TabsContent>

              <TabsContent value="awaiting">
                <AppointmentsList
                  appointments={appointments?.filter(app => app.status === "AwAp")}
                  isLoading={isLoading}
                  onStatusUpdate={updateStatusMutation.mutate}
                  actionLabel="Approve Appointment"
                  actionStatus="booked"
                />
              </TabsContent>

              <TabsContent value="completed">
                <AppointmentsList
                  appointments={appointments?.filter(app => app.status === "done")}
                  isLoading={isLoading}
                  onStatusUpdate={updateStatusMutation.mutate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>

      <NewAppointmentDialog
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
      />
    </div>
  );
}

interface AppointmentsListProps {
  appointments?: Appointment[];
  isLoading: boolean;
  onStatusUpdate: (data: { appointmentId: number; status: AppointmentStatus }) => void;
  actionLabel?: string;
  actionStatus?: AppointmentStatus;
}

function AppointmentsList({ appointments, isLoading, onStatusUpdate, actionLabel, actionStatus }: AppointmentsListProps) {
  if (isLoading) {
    return <AppointmentsListSkeleton />;
  }

  if (!appointments?.length) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No appointments found</h3>
        <p className="text-gray-600">
          There are no appointments matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onStatusUpdate={onStatusUpdate}
          actionLabel={actionLabel}
          actionStatus={actionStatus}
        />
      ))}
    </div>
  );
}
