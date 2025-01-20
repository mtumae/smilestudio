import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { toast } from "~/hooks/use-toast"
import type { RouterOutputs } from "~/trpc/react"
import { api } from "~/trpc/react"

type Appointment = RouterOutputs["appointment"]["getAllAppointments"][number]
type AppointmentStatus = "AwAp" | "booked" | "done"

const STATUS_VARIANTS = {
  AwAp: "bg-yellow-100 text-yellow-800",
  booked: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
}

interface AppointmentCardProps {
  appointment: Appointment
  onStatusUpdate: (data: { appointmentId: number; status: AppointmentStatus }) => void
  actionLabel?: string
  actionStatus?: AppointmentStatus
}

export function AppointmentCard({ appointment, onStatusUpdate, actionLabel, actionStatus }: AppointmentCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteMutation = api.appointment.deleteAppointment.useMutation({
    onSuccess: () => {
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      })
      setIsDeleteDialogOpen(false)
      onStatusUpdate({ appointmentId: appointment.id, status: "AwAp" })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
      })
    },
  })

  const handleDelete = () => {
    void deleteMutation.mutateAsync({
      appointmentId: appointment.id,
      googleEventId: appointment.googleEventId ?? "",
    }).catch((error) => {
      console.error("Failed to delete appointment:", error);
    });
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{appointment.patientName}</h3>
              <p className="text-sm text-gray-600">{appointment.patientEmail}</p>
              <p className="text-sm font-medium text-ssblue mt-1">{appointment.appointmentType}</p>
            </div>
            <Badge
              className={`${STATUS_VARIANTS[appointment.status as AppointmentStatus]} px-3 py-1 rounded-full text-xs font-medium`}
            >
              {appointment.status === "AwAp"
                ? "Awaiting Approval"
                : appointment.status === "booked"
                  ? "Upcoming"
                  : "Completed"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-ssblue" />
              {format(new Date(appointment.date), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-ssblue" />
              {format(new Date(appointment.startTime), "h:mm a")}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {actionLabel && actionStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate({ appointmentId: appointment.id, status: actionStatus })}
                className="text-ssblue hover:text-white hover:bg-ssblue border-ssblue"
              >
                {actionStatus === "booked" ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {actionLabel}
              </Button>
            )}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this appointment?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the appointment.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

