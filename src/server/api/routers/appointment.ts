
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure,publicProcedure } from "~/server/api/trpc";
import { appointments, accounts } from "~/server/db/schema";
import { GoogleCalendarService } from "~/lib/calender";
import { eq, and, gte, lte } from "drizzle-orm";

const createAppointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  googleEventId: z.string().optional(),
});

export const appointmentRouter = createTRPCRouter({
  createAppointment: protectedProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('Starting appointment creation process...');
    
        const account = await ctx.db.query.accounts.findFirst({
          where: and(
            eq(accounts.userId, ctx.session.user.id),
            eq(accounts.provider, 'google')
          ),
        });

        console.log('Google account found:', !!account);

        if (!account?.refresh_token) {
          console.log('No refresh token found');
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Google Calendar access not authorized. Please reconnect your Google account.'
          });
        }

        const calendarService = new GoogleCalendarService(account.refresh_token);
        
        const startDateTime = new Date(input.startTime);
        const endDateTime = new Date(input.endTime);

        console.log('Scheduling calendar event...');
        
    
        const eventId = await calendarService.scheduleAppointment({
          email: ctx.session.user.email!,
          startTime: startDateTime,
          endTime: endDateTime,
          summary: `Dental Appointment - ${input.name}`,
          description: `Appointment Type: ${input.type}\nPatient Email: ${input.email}`
        });

        console.log('Calendar event created, ID:', eventId);

    
        console.log('Creating database record...');
        
        const [newAppointment] = await ctx.db.insert(appointments).values({
          patientName: input.name,
          patientEmail: input.email,
          appointmentType: input.type,
          startTime: startDateTime,
          endTime: endDateTime,
          date: new Date(input.date),
          googleEventId: eventId,
        }).returning();

        console.log('Database record created');

        return {
          success: true,
          appointment: newAppointment,
          calendarEventId: eventId
        };
      } catch (error) {
        console.error("Detailed appointment creation error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create appointment",
          cause: error,
        });
      }
    }),

getAvailableSlots: publicProcedure
.input(z.object({
  date: z.string()
}))
.query(async ({ ctx, input }) => {
  const dayStart = new Date(input.date);
  const dayEnd = new Date(input.date);
  dayEnd.setHours(23, 59, 59);

  const existingAppointments = await ctx.db.query.appointments.findMany({
    where: and(
      gte(appointments.startTime, dayStart),
      lte(appointments.endTime, dayEnd)
    ),
  });

  return existingAppointments;
}),

  deleteAppointment: protectedProcedure
    .input(z.object({
      appointmentId: z.number(),
      googleEventId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const account = await ctx.db.query.accounts.findFirst({
          where: and(
            eq(accounts.userId, ctx.session.user.id),
            eq(accounts.provider, 'google')
          ),
        });

        if (!account?.refresh_token) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Google Calendar access not authorized.'
          });
        }

        const calendarService = new GoogleCalendarService(account.refresh_token);
        await calendarService.deleteAppointment(input.googleEventId);

        await ctx.db.delete(appointments)
          .where(eq(appointments.id, input.appointmentId));

        return { success: true };
      } catch (error) {
        console.error("Failed to delete appointment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to delete appointment",
          cause: error,
        });
      }
    })
});