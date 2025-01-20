import { format } from "date-fns";
import { CalendarDays, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { RouterOutputs } from "~/trpc/react";

type Appointment = RouterOutputs["appointment"]["getAllAppointments"][number];
type AppointmentStatus = "AwAp" | "booked" | "done";

const STATUS_VARIANTS = {
  AwAp: "bg-yellow-100 text-yellow-800",
  booked: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusUpdate: (data: { appointmentId: number; status: AppointmentStatus }) => void;
  actionLabel?: string;
  actionStatus?: AppointmentStatus;
}

export function AppointmentCard({ appointment, onStatusUpdate, actionLabel, actionStatus }: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-600">
              {appointment.patientEmail}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                {format(new Date(appointment.date), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {format(new Date(appointment.startTime), 'h:mm a')}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Badge 
              className={`${STATUS_VARIANTS[appointment.status as AppointmentStatus]} px-2 py-1 rounded-full text-xs font-medium`}
            >
              {appointment.status === "AwAp" ? "Awaiting Approval" :
               appointment.status === "booked" ? "Upcoming" : "Completed"}
            </Badge>

            {actionLabel && actionStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate({ appointmentId: appointment.id, status: actionStatus })}
                className="text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800"
              >
                {actionStatus === "booked" ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

