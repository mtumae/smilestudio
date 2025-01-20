"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { CalendarDays, Search, Plus, Loader2,ClipboardList, Clock, CheckCircle2, Activity } from "lucide-react"
import { AppointmentCard } from "./AppointmentCard"
import { AppointmentsListSkeleton } from "./AppointmentListSkeleton"
import { NewAppointmentDialog } from "./NewAppointmentDialog"
import type { RouterOutputs } from "~/trpc/react"
import { useToast } from "~/hooks/use-toast"


type Appointment = RouterOutputs["appointment"]["getAllAppointments"][number]
type AppointmentStatus = "AwAp" | "booked" | "done"

export function AppointmentsPage() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"upcoming" | "awaiting" | "completed">("upcoming")
  const { toast } = useToast()

  const {
    data: appointments,
    isLoading,
    refetch,
  } = api.appointment.getAllAppointments.useQuery(
    {
      search,
    },
    {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  )
  const { data: statsData } = api.appointment.getStats.useQuery(undefined, {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
  

  const updateStatusMutation = api.appointment.updateAppointmentStatus.useMutation({
    onSuccess: () => {
      void refetch().then(() => {
        toast({
          title: "Appointment status updated",
          description: "The appointment status has been successfully updated.",
        })
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating the appointment status.",
        variant: "destructive",
      })
    },
  })
  const deleteMutation = api.appointment.deleteAppointment.useMutation({
    onSuccess: () => {
      void refetch().then(() => {
        toast({
          title: "Appointment deleted",
          description: "The appointment has been successfully deleted.",
        })
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating the appointment status.",
        variant: "destructive",
      })
    },
  })
  const filteredAppointments = {
    upcoming: appointments?.filter((app) => app.status === "booked") ?? [],
    awaiting: appointments?.filter((app) => app.status === "AwAp") ?? [],
    completed: appointments?.filter((app) => app.status === "done") ?? [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <Button
            onClick={() => setIsNewAppointmentOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Appointment
          </Button>
        </motion.div>
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
>
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Today&apos;s Appointments</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">
          {statsData?.todayCount ?? 0}
        </h3>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        <Clock className="w-6 h-6 text-blue-500" />
      </div>
    </div>
    <p className="text-green-600 text-sm mt-4">
      {statsData?.todayRemaining ?? 0} remaining today
    </p>
  </motion.div>

  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Awaiting Approval</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">
          {statsData?.awaitingCount ?? 0}
        </h3>
      </div>
      <div className="bg-purple-50 p-3 rounded-full">
        <ClipboardList className="w-6 h-6 text-purple-500" />
      </div>
    </div>
    <p className="text-purple-600 text-sm mt-4">
      Needs attention
    </p>
  </motion.div>

  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Weekly Completion</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">
          {statsData?.weeklyCompletionRate ?? 0}%
        </h3>
      </div>
      <div className="bg-green-50 p-3 rounded-full">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      </div>
    </div>
    <p className="text-green-600 text-sm mt-4">
      +{statsData?.weeklyCompletion?.improvement ?? 0}% vs last week
    </p>
  </motion.div>

  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Most Common Type</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">
          {statsData?.mostCommonType ?? 'Check-up'}
        </h3>
      </div>
      <div className="bg-indigo-50 p-3 rounded-full">
        <Activity className="w-6 h-6 text-indigo-500" />
      </div>
    </div>
    <p className="text-indigo-600 text-sm mt-4">
      {statsData?.commonTypePercentage ?? 0}% of appointments
    </p>
  </motion.div>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 py-3 bg-gray-50 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-2 gap-2">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg py-2 transition-all duration-300"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="awaiting"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg py-2 transition-all duration-300"
              >
                Awaiting Approval
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg py-2 transition-all duration-300"
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="upcoming">
                    <AppointmentsList
                      appointments={filteredAppointments.upcoming}
                      isLoading={isLoading}
                      onStatusUpdate={updateStatusMutation.mutate}
                      actionLabel="Mark as Done"
                      actionStatus="done"
                    />
                  </TabsContent>

                  <TabsContent value="awaiting">
                    <AppointmentsList
                      appointments={filteredAppointments.awaiting}
                      isLoading={isLoading}
                      onStatusUpdate={updateStatusMutation.mutate}
                      actionLabel="Approve Appointment"
                      actionStatus="booked"
                    />
                  </TabsContent>

                  <TabsContent value="completed">
                    <AppointmentsList
                      appointments={filteredAppointments.completed}
                      isLoading={isLoading}
                      onStatusUpdate={updateStatusMutation.mutate}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>

      <NewAppointmentDialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen} />
    </div>
  )
}

interface AppointmentsListProps {
  appointments: Appointment[]
  isLoading: boolean
  onStatusUpdate: (data: { appointmentId: number; status: AppointmentStatus }) => void
  actionLabel?: string
  actionStatus?: AppointmentStatus
}

function AppointmentsList({
  appointments,
  isLoading,
  onStatusUpdate,
  actionLabel,
  actionStatus,
}: AppointmentsListProps) {
  if (isLoading) {
    return <AppointmentsListSkeleton />
  }

  if (!appointments.length) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <CalendarDays className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-6 text-2xl font-semibold text-gray-900">No appointments found</h3>
        <p className="mt-2 text-lg text-gray-600">There are no appointments matching your criteria.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {appointments.map((appointment) => (
        <motion.div key={appointment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <AppointmentCard
            appointment={appointment}
            onStatusUpdate={onStatusUpdate}
            actionLabel={actionLabel}
            actionStatus={actionStatus}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

