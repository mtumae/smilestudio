// app/review/[appointmentId]/actions.ts
"use server";

import { db } from "~/server/db";
import { satisfactionRatings } from "~/server/db/schema";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export async function submitReview(data: {
  rating: number;
  feedback?: string;
}) {
  try {
    const validated = reviewSchema.parse(data);

    await db.insert(satisfactionRatings).values({
      rating: validated.rating,
      feedback: validated.feedback,
      date: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}