// server/api/routers/dashboard.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { sql } from 'drizzle-orm';
import { appointments, patients, revenues, satisfactionRatings } from '~/server/db/schema';

import { CalendarIcon, Users2Icon, DollarSignIcon, ActivityIcon } from 'lucide-react';

// types.ts
export interface DashboardStat {
  title: string;
  value: string;
  trend: string;
  icon: React.ComponentType; // Updated to accept React component
  color: string;
}

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = ctx.db;
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Convert dates to SQL-safe format
    const todayStart = now.toISOString().split('T')[0];

    // Get today's appointments
    const todayAppointments = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(sql`DATE(${appointments.date}) = ${todayStart}`);

    // Get last week's appointments
    const lastWeekAppointments = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(sql`${appointments.date} >= ${lastWeek.toISOString()}`);

    // Get total patients
    const totalPatients = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients);

    // Get last month's new patients
    const lastMonthPatients = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(sql`${patients.createdAt} >= ${lastMonth.toISOString()}`);

    // Get current month revenue
    const currentMonthRevenue = await db
      .select({ sum: sql<number>`coalesce(sum(amount), 0)` })
      .from(revenues)
      .where(sql`${revenues.date} >= ${lastMonth.toISOString()}`);

    // Get previous month revenue
    const previousMonthStart = new Date(lastMonth);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    const previousMonthRevenue = await db
      .select({ sum: sql<number>`coalesce(sum(amount), 0)` })
      .from(revenues)
      .where(sql`${revenues.date} >= ${previousMonthStart.toISOString()} AND ${revenues.date} < ${lastMonth.toISOString()}`);

    // Get satisfaction rate
    const satisfactionRate = await db
      .select({
        avg: sql<number>`coalesce(avg(rating)::float, 0)`
      })
      .from(satisfactionRatings)
      .where(sql`${satisfactionRatings.date} >= ${lastMonth.toISOString()}`);

    // Log values for debugging
    console.log({
      todayAppointments: todayAppointments[0]?.count,
      lastWeekAppointments: lastWeekAppointments[0]?.count,
      totalPatients: totalPatients[0]?.count,
      lastMonthPatients: lastMonthPatients[0]?.count,
      currentMonthRevenue: currentMonthRevenue[0]?.sum,
      previousMonthRevenue: previousMonthRevenue[0]?.sum,
      satisfactionRate: satisfactionRate[0]?.avg
    });

    return [
        {
          title: "Today's Appointments",
          value: (todayAppointments[0]?.count ?? 0).toString(),
          trend: `${calculateTrendPercentage(
            todayAppointments[0]?.count ?? 0,
            lastWeekAppointments[0]?.count ?? 0
          )}% vs. last week`,
         
          color: 'text-primary-default'
        },
        {
          title: 'Total Patients',
          value: (totalPatients[0]?.count ?? 0).toLocaleString(),
          trend: `${calculateTrendPercentage(
            totalPatients[0]?.count ?? 0,
            lastMonthPatients[0]?.count ?? 0
          )}% vs. last month`,
       
          color: 'text-success-default'
        },
        {
          title: 'Monthly Revenue',
          value: `$${(currentMonthRevenue[0]?.sum ?? 0).toLocaleString()}`,
          trend: `${calculateTrendPercentage(
            currentMonthRevenue[0]?.sum ?? 0,
            previousMonthRevenue[0]?.sum ?? 0
          )}% vs. last month`,
          
          color: 'text-warning-default'
        },
        {
          title: 'Satisfaction Rate',
          value: `${Math.round(satisfactionRate[0]?.avg ?? 0)}%`,
          trend: `${calculateTrendPercentage(
            satisfactionRate[0]?.avg ?? 0,
            satisfactionRate[0]?.avg ?? 0
          )}% vs. last month`,
      
          color: 'text-error-default'
        }
      ];
  })
});

function calculateTrendPercentage(current: number, previous: number): string {
  // If both are 0, return "0"
  if (current === 0 && previous === 0) return '0';
  
  // If previous was 0 and current is not, return "+100"
  if (previous === 0 && current > 0) return '+100';
  
  // If current is 0 and previous was not, return "-100"
  if (current === 0 && previous > 0) return '-100';
  
  // Normal calculation
  const trend = ((current - previous) / previous) * 100;
  return trend > 0 ? `+${trend.toFixed(0)}` : trend.toFixed(0);
}

export default dashboardRouter;