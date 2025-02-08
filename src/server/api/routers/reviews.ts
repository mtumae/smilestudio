// server/api/routers/review.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { satisfactionRatings, users } from '~/server/db/schema';
import { desc, and, gte, isNotNull, eq } from 'drizzle-orm';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export const reviewRouter = createTRPCRouter({
  submitReview: publicProcedure
    .input(reviewSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session?.user?.id; // Will be undefined for anonymous users
        
        await ctx.db.insert(satisfactionRatings).values({
          userId,
          rating: input.rating,
          feedback: input.feedback,
          date: new Date(),
        });

        return { success: true };
      } catch (error) {
        console.error("Error submitting review:", error);
        throw new Error("Failed to submit review");
      }
    }),

    getTopReviews: publicProcedure.query(async ({ ctx }) => {
      const topReviews = await ctx.db
        .select({
          id: satisfactionRatings.id,
          userId: satisfactionRatings.userId,
          rating: satisfactionRatings.rating,
          feedback: satisfactionRatings.feedback,
          date: satisfactionRatings.date,
          user: users // Assuming you have a users table
        })
        .from(satisfactionRatings)
        .leftJoin(users, eq(satisfactionRatings.userId, users.id))
        .where(
          and(
            gte(satisfactionRatings.rating, 4),
            isNotNull(satisfactionRatings.feedback)
          )
        )
        .orderBy(desc(satisfactionRatings.date))
        .limit(3);
  
      return topReviews;
    }),
});