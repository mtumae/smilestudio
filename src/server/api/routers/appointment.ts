import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { appointments, accounts, settings, patients, users } from "~/server/db/schema";
import { GoogleCalendarService } from "~/lib/calender";
import { eq, and, gte, lte, desc, or, like, SQL, sql, isNull } from "drizzle-orm";
import { EmailService } from "~/lib/email";  
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";

const createAppointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  googleEventId: z.string().optional(),
});

const AppointmentStatus = z.enum(["AwAp", "booked", "done"]);

const updateAppointmentStatusSchema = z.object({
  appointmentId: z.number(),
  status: AppointmentStatus,
});

const getAppointmentsSchema = z.object({
  status: AppointmentStatus.optional(),
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const appointmentRouter = createTRPCRouter({
  createAppointment: publicProcedure
  .input(createAppointmentSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      console.log('Starting appointment creation process...');
      
      const settingq = await ctx.db.query.settings.findFirst({
        where: eq(settings.id, 1),
      });

      const initialStatus = settingq?.isSet ? "AwAp" : "booked";

      // Create proper Date objects
      const appointmentDate = new Date(input.date);
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);

      // Send email to patient
      const emailService = new EmailService();
      
      await emailService.sendConfirmationEmail(
        input.email,
        input.name,
        input.type,
        startTime,
        endTime,
        appointmentDate
      );

      // Schedule reminder email
      const reminderDate = new Date(appointmentDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      
      void setTimeout(async () => {
        await emailService.sendReminderEmail(
          input.email,
          input.name,
          input.type,
          startTime,
          appointmentDate
        );
      }, reminderDate.getTime() - Date.now());

      // Create the appointment record
      const [newAppointment] = await ctx.db.insert(appointments).values({
        patientName: input.name,
        patientEmail: input.email,
        appointmentType: input.type,
        startTime,
        endTime,
        status: initialStatus,
        date: appointmentDate,
      }).returning();

      return {
        success: true,
        appointment: newAppointment
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

  approveAppointment: protectedProcedure
  .input(z.object({
    appointmentId: z.number()
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const appointment = await ctx.db.query.appointments.findFirst({
        where: eq(appointments.id, input.appointmentId)
      });

      if (!appointment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found"
        });
      }

      // Ensure we have proper Date objects
      const appointmentDate = new Date(appointment.date);
      const startTime = new Date(appointment.startTime);
      const endTime = new Date(appointment.endTime);

      const emailService = new EmailService();
      
      await emailService.sendConfirmationEmail(
        appointment.patientEmail,
        appointment.patientName,
        appointment.appointmentType,
        startTime,
        endTime,
        appointmentDate
      );

      // Schedule reminder email with proper Date objects
      const reminderDate = new Date(appointmentDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      
      void setTimeout(async () => {
        await emailService.sendReminderEmail(
          appointment.patientEmail,
          appointment.patientName,
          appointment.appointmentType,
          startTime,
          appointmentDate
        );
      }, reminderDate.getTime() - Date.now());

      await ctx.db.update(appointments)
        .set({ status: "booked" })
        .where(eq(appointments.id, input.appointmentId));

      return { success: true };
    } catch (error) {
      console.error("Failed to approve appointment:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to approve appointment",
        cause: error,
      });
    }
  }),
  getStats: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    // Main data query
    const allAppointments = await ctx.db
      .select({
        id: appointments.id,
        status: appointments.status,
        startTime: appointments.startTime,
        appointmentType: appointments.appointmentType,
      })
      .from(appointments)
      .where(
        and(
          gte(appointments.startTime, lastWeekStart),
          lte(appointments.startTime, weekEnd)
        )
      );

    // Validate and filter time periods
    const today = allAppointments.filter(app => 
      app.startTime >= todayStart && 
      app.startTime <= todayEnd
    );
    
    const thisWeek = allAppointments.filter(app => 
      app.startTime >= weekStart && 
      app.startTime <= weekEnd
    );
    
    const lastWeek = allAppointments.filter(app => 
      app.startTime >= lastWeekStart && 
      app.startTime < weekStart
    );

    // Today's stats
    const todayTotal = today.length;
    const todayRemaining = today.filter(app => app.status !== "done").length;

    // Awaiting approval count
    const awaitingCount = allAppointments.filter(app => app.status === "AwAp").length;

    // Weekly completion stats
    const thisWeekTotal = thisWeek.length;
    const thisWeekCompleted = thisWeek.filter(app => app.status === "done").length;
    const lastWeekTotal = lastWeek.length;
    const lastWeekCompleted = lastWeek.filter(app => app.status === "done").length;

    // Calculate completion rates with validation
    const thisWeekCompletionRate = thisWeekTotal > 0
      ? Math.min(100, Math.max(0, Math.round((thisWeekCompleted / thisWeekTotal) * 100)))
      : 0;

    const lastWeekCompletionRate = lastWeekTotal > 0
      ? Math.min(100, Math.max(0, Math.round((lastWeekCompleted / lastWeekTotal) * 100)))
      : 0;

    // Calculate appointment type distribution
    const typeDistribution = thisWeek.reduce((acc, app) => {
      acc[app.appointmentType] = (acc[app.appointmentType] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find most common type with validation
    let mostCommonType = "No appointments";
    let commonTypeCount = 0;

    if (thisWeekTotal > 0) {
      const sortedTypes = Object.entries(typeDistribution)
        .sort(([,a], [,b]) => b - a);
      
      if (sortedTypes.length > 0) {
        const [type, count] = sortedTypes[0] ?? ["No appointments", 0];
        mostCommonType = type;
        commonTypeCount = count;
      }
    }

    // Calculate percentage with bounds checking
    const commonTypePercentage = thisWeekTotal > 0
      ? Math.min(100, Math.max(0, Math.round((commonTypeCount / thisWeekTotal) * 100)))
      : 0;

    // Validation logging (can be removed in production)
    console.log({
      thisWeekTotal,
      thisWeekCompleted,
      lastWeekTotal,
      lastWeekCompleted,
      typeDistribution,
      commonTypeCount,
      thisWeekCompletionRate,
      commonTypePercentage
    });

    return {
      todayCount: todayTotal,
      todayRemaining,
      awaitingCount,
      weeklyCompletionRate: thisWeekCompletionRate,
      weeklyCompletion: {
        improvement: Math.min(100, Math.max(-100, thisWeekCompletionRate - lastWeekCompletionRate)),
      },
      mostCommonType,
      commonTypePercentage,
      // Debug info (can be removed in production)
      debug: {
        thisWeekTotal,
        commonTypeCount
      }
    };
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

  getUserAppointments: protectedProcedure
    .query(async ({ctx, input}) => {
      const data = await ctx.db.query.appointments.findMany({  
        where:
          eq(appointments.patientEmail, ctx.session.user.email!)
      })

      return data
    }),

  getAllAppointments: protectedProcedure
    .input(getAppointmentsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const conditions = [];
        
        if (input.status) {
          conditions.push(eq(appointments.status, input.status));
        }

        if (input.search) {
          conditions.push(
            or(
              like(appointments.patientName, `%${input.search}%`),
              like(appointments.patientEmail, `%${input.search}%`),
              like(appointments.appointmentType, `%${input.search}%`)
            )
          );
        }

        if (input.startDate && input.endDate) {
          conditions.push(
            and(
              gte(appointments.date, input.startDate),
              lte(appointments.date, input.endDate)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const appointmentsData = await ctx.db.query.appointments.findMany({
          where: whereClause,
          orderBy: [desc(appointments.date)],
        });

        return appointmentsData;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointments",
          cause: error,
        });
      }
    }),
    updateAppointmentStatus: publicProcedure
    .input(z.object({
      appointmentId: z.number(),
      status: z.enum(["AwAp", "booked", "done"])
    }))
    .mutation(async ({ ctx, input }) => {
      const { appointmentId, status } = input;
  
      return await ctx.db.transaction(async (tx) => {
        const [updatedAppointment] = await tx
          .update(appointments)
          .set({ status })
          .where(eq(appointments.id, appointmentId))
          .returning({
            patientEmail: appointments.patientEmail,
            patientName: appointments.patientName
          });
  
        if (status === "done" && updatedAppointment) {
          // Handle patient stats update
          const [user] = await tx
            .select()
            .from(users)
            .where(eq(users.email, updatedAppointment.patientEmail));
  
          if (user) {
            const [existingPatient] = await tx
              .select()
              .from(patients)
              .where(eq(patients.id, user.id));
  
            if (existingPatient) {
              await tx
                .update(patients)
                .set({ count: sql`${patients.count} + 1` })
                .where(eq(patients.id, user.id));
            } else {
              await tx
                .insert(patients)
                .values({
                  id: user.id,
                  count: 1
                });
            }
  
           
            const emailService = new EmailService();
            const reviewLink = `${process.env.NEXTAUTH_URL}/review/${appointmentId}`;
            
            await emailService.sendReviewRequestEmail(
              updatedAppointment.patientEmail,
              updatedAppointment.patientName,
              reviewLink
            );
          }
        }
  
        return { success: true };
      });
    }),

  deleteAppointment: protectedProcedure
    .input(z.object({
      appointmentId: z.number(),
      googleEventId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // const account = await ctx.db.query.accounts.findFirst({
        //   where: and(
        //     eq(accounts.userId, ctx.session.user.id),
        //     eq(accounts.provider, 'google')
        //   ),
        // });

        // if (!account?.refresh_token) {
        //   throw new TRPCError({
        //     code: 'UNAUTHORIZED',
        //     message: 'Google Calendar access not authorized.'
        //   });
        // }

        // const calendarService = new GoogleCalendarService(account.refresh_token);
        // await calendarService.deleteAppointment(input.googleEventId);

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