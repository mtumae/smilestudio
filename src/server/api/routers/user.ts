import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { z } from "zod";
import * as bcryptjs from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
    getMe: publicProcedure
    .query(async ({ ctx }) => {
       return   await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session?.user.id ?? ""),
      });

    }),
    signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
      phone: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;

      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User already exists',
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      await ctx.db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        phonenumber: input.phone,
        emailVerified: null, 
      });

      return { message: 'User created successfully. Please check your email for verification.' };
    }),
});