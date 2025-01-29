import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getByID: protectedProcedure
    .input(z.object({ postid: z.string() }))
    .query(async ({ctx, input}) => {
         
          const data = await ctx.db.query.posts.findFirst({ 
            where:
              eq(posts.id, parseInt(input.postid))
          })
            return data ?? null
          }),
      

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
