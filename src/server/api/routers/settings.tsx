import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { z } from "zod";
import * as bcryptjs from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { settings, users } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { ideahub } from "googleapis/build/src/apis/ideahub";
import { get } from "http";
import { removeAllListeners } from "process";

export const settingsRouter = createTRPCRouter({
    updateAdmin: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
  
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });
  
      if (existingUser) {
        return  await ctx.db.update(users).set({
          role: 'admin'
        }).where(eq(users.email, email));
      }
  
 }),
    fetchAdmins: protectedProcedure
    .query(async ({ ctx }) => {
        const admins = await ctx.db.query.users.findMany({
          where: (users, { eq }) => eq(users.role, 'admin')
        });
        return admins;
      }),
      removeAdmin: protectedProcedure
      .input(z.object({
        email: z.string().email(),
      }))
        .mutation(async ({ ctx, input }) => {
            const { email } = input;
        
            const existingUser = await ctx.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
            });
        
            if (existingUser) {
            return  await ctx.db.update(users).set({
                role: 'user'
            }).where(eq(users.email, email));
            }
        }),
    addAdmin: protectedProcedure
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
        role: 'admin', 
      });
  
      return { message: 'Admin user created successfully. Please check your email for verification.' };
    }),
    getSettings: protectedProcedure
    .query(async ({ ctx }) => {
        const settings = await ctx.db.query.settings.findMany();
        return settings;
      }),
    toggleSetting: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First get the current setting
      const currentSetting = await ctx.db.query.settings.findFirst({
        where: eq(settings.id, input.id)
      })

      if (!currentSetting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Setting not found'
        });
      }

      // Update with the opposite of current value
      const update = await ctx.db
        .update(settings)
        .set({
          isSet: !currentSetting.isSet
        })
        .where(eq(settings.id, input.id));

      return update;
    }),
        
        
  

});