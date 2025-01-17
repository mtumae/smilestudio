import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { z } from "zod";
import * as bcryptjs from "bcryptjs";
import { nanoid } from 'nanoid';
import { EmailService } from "~/lib/emailResetService";

import {
  createTRPCRouter,

  publicProcedure,
} from "~/server/api/trpc";
import { resetLink, users } from "~/server/db/schema";

import { eq } from "drizzle-orm";

const emailService = new EmailService();

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
    sendResetLink: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No account found with this email',
        });
      }

      const resetToken = nanoid();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 


      await ctx.db.delete(resetLink)
        .where(eq(resetLink.identifier, input.email));

    
      await ctx.db.insert(resetLink).values({
        identifier: input.email,
        uuid: resetToken,
        expires: expiresAt,
      });


      await emailService.sendPasswordResetEmail(input.email, resetToken);

      return { success: true };
    }),

  resetPassword: publicProcedure
    .input(z.object({
      uuid: z.string(),
      newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long",
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const resetLinkEntry = await ctx.db.query.resetLink.findFirst({
        where: eq(resetLink.uuid, input.uuid),
      });

      if (!resetLinkEntry) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid or expired reset link',
        });
      }

      if (new Date() > resetLinkEntry.expires) {

        await ctx.db.delete(resetLink)
          .where(eq(resetLink.uuid, input.uuid));

        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Reset link has expired',
        });
      }

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, resetLinkEntry.identifier),
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const hashedPassword = await bcryptjs.hash(input.newPassword, 12);

      // Update password
      await ctx.db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user.id));

      // Delete used reset link
      await ctx.db.delete(resetLink)
        .where(eq(resetLink.uuid, input.uuid));

      return { success: true };
    }),
});