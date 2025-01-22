import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { appointments, patients, satisfactionRatings } from "~/server/db/schema";
import { and, eq, gte, lte, count, sql, desc } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const analyticsRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));

    // Get monthly appointments count
    const [currentMonthAppointments] = await ctx.db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.date, currentMonth),
          lte(appointments.date, endOfMonth(now))
        )
      );

    const [lastMonthAppointments] = await ctx.db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.date, lastMonth),
          lte(appointments.date, endOfMonth(lastMonth))
        )
      );

    // Get completed appointments
    const [completedAppointments] = await ctx.db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.status, "done"));

    // Get new patients this month
    const [newPatients] = await ctx.db
      .select({ count: count() })
      .from(patients)
      .where(
        and(
          gte(patients.createdAt, currentMonth),
          lte(patients.createdAt, endOfMonth(now))
        )
      );

    // Get satisfaction ratings with proper calculation
    const ratings = await ctx.db
      .select({
        rating: satisfactionRatings.rating,
      })
      .from(satisfactionRatings)
      .where(
        and(
          gte(satisfactionRatings.date, currentMonth),
          lte(satisfactionRatings.date, endOfMonth(now))
        )
      );

    // Calculate average rating manually to ensure accuracy
    const averageRating = ratings.length > 0
      ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
      : 0;

    // Get monthly appointments data for chart
    const monthlyAppointments = await Promise.all(
      Array.from({ length: 12 }).map(async (_, i) => {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = endOfMonth(monthStart);

        const [result] = await ctx.db
          .select({ count: count() })
          .from(appointments)
          .where(
            and(
              gte(appointments.date, monthStart),
              lte(appointments.date, monthEnd)
            )
          );

        return {
          month: monthStart.toLocaleString('default', { month: 'short' }),
          total: result?.count ?? 0
        };
      })
    );

    // Get recent appointments
    const recentAppointments = await ctx.db.query.appointments.findMany({
      orderBy: [desc(appointments.date)],
      limit: 5,
      where: eq(appointments.status, "done")
    });

    return {
      stats: {
        monthlyAppointments: currentMonthAppointments?.count ?? 0,
        appointmentGrowth: lastMonthAppointments?.count
          ? ((currentMonthAppointments?.count ?? 0) - lastMonthAppointments.count) / lastMonthAppointments.count * 100
          : 0,
        completedAppointments: completedAppointments?.count ?? 0,
        newPatients: newPatients?.count ?? 0,
        satisfactionRating: averageRating,
      },
      monthlyData: monthlyAppointments.reverse(),
      recentAppointments: recentAppointments.map(apt => ({
        id: apt.id,
        name: apt.patientName,
        email: apt.patientEmail,
        date: apt.date,
        type: apt.appointmentType,
        amount: 0
      }))
    };
  }),
});