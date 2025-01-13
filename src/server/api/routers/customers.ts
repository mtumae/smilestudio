// server/api/routers/customers.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messages, users } from "~/server/db/schema";
import { eq, and, avg, count, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const customersRouter = createTRPCRouter({
  getDetails: protectedProcedure
    .input(z.object({
      customerId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify admin status
      const admin = await ctx.db.query.users.findFirst({
        where: and(
          eq(users.role, "admin"),
          eq(users.id, ctx.session.user.id)
        ),
      });

      if (!admin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access customer details",
        });
      }

      // Get customer basic info
      const customer = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.customerId),
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      // Get conversation stats
      const stats = await ctx.db
        .select({
          totalConversations: count(messages.id),
          averageResponseTime: sql<number>`
            ROUND(
              AVG(
                EXTRACT(EPOCH FROM (${messages.responseTime} - ${messages.createdAt})) / 60
              )
            )::integer
          `.as('avg_response_time'),
        })
        .from(messages)
        .where(eq(messages.customerId, input.customerId))
        .groupBy(messages.customerId)
        .then(rows => rows[0] ?? { totalConversations: 0, averageResponseTime: 0 });

      // Get recent activity
      const recentActivity = await ctx.db
        .select({
          id: messages.id,
          description: messages.content,
          date: messages.createdAt,
        })
        .from(messages)
        .where(eq(messages.customerId, input.customerId))
        .orderBy(sql`${messages.createdAt} DESC`)
        .limit(5);

      // Combine all data
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phonenumber,
        image: customer.image,
        createdAt: customer.emailVerified, // Using emailVerified as customer since date
        stats: {
          totalConversations: Number(stats.totalConversations),
          averageResponseTime: stats.averageResponseTime ?? 0,
        },
        recentActivity,
        // You can add more custom fields here based on your needs
        additionalDetails: {
          "Account Type": customer.role,
          // Add other custom fields as needed
        },
      };
    }),
});