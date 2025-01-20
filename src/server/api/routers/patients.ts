
import { z } from "zod";
import { desc, eq, ilike, or, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { patients, users } from "~/server/db/schema";

export const patientRouter = createTRPCRouter({
  getPatients: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        sortBy: z.enum(["name", "createdAt", "appointmentCount"]).default("createdAt"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, search, sortBy } = input;

      let whereClause = undefined;
      
      if (search) {
        // Split search into words and create conditions for each
        const searchTerms = search.trim().split(/\s+/);
        whereClause = and(
          ...searchTerms.map(term => 
            or(
              ilike(users.name, `%${term}%`),
              ilike(users.email, `%${term}%`),
              ilike(users.phonenumber, `%${term}%`)
            )
          )
        );
      }

      const items = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phonenumber,
          createdAt: patients.createdAt,
          appointmentCount: patients.count,
          image: users.image,
        })
        .from(patients)
        .innerJoin(users, eq(patients.id, users.id))
        .where(whereClause)
        .orderBy(desc(sortBy === 'name' ? users.name : 
                     sortBy === 'appointmentCount' ? patients.count : 
                     patients.createdAt))
        .limit(limit + 1)
        .offset(cursor ?? 0);

      let nextCursor = null;
      if (items.length > limit) {
        items.pop();
        nextCursor = (cursor ?? 0) + limit;
      }

      return { items, nextCursor };
    }),
});