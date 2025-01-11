import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messages, users } from "~/server/db/schema";
import { eq, and, desc, lt, asc, sql, ne, } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { pusherServer } from '~/server/pusher';
export const businessMessageRouter = createTRPCRouter({
    getMessages: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        cursor: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
       
        const admin = await ctx.db.query.users.findFirst({
          where:  and(eq(users.role , "admin"),eq(users.id, ctx.session.user.id))
        });
  
        if (!admin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can access messages",
          });
        }
  
        const messagesList = await ctx.db
          .select({
            id: messages.id,
            customerId: messages.customerId,
            content: messages.content,
            createdAt: messages.createdAt,
            status: messages.status,
            respondedBy: messages.respondedBy,
            responseContent: messages.responseContent,
            responseTime: messages.responseTime,
          })
          .from(messages)
          .where(
            input.cursor
              ? lt(messages.id, input.cursor)
              : undefined
          )
          .orderBy(desc(messages.createdAt))
          .limit(input.limit);
  
        return messagesList;
      }),
  
    respondToMessage: protectedProcedure
      .input(z.object({
        messageId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify admin status
        const admin = await ctx.db.query.users.findFirst({
            where:  and(eq(users.role , "admin"),eq(users.id, ctx.session.user.id))
          });
  
        if (!admin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can respond to messages",
          });
        }
  
        const [updatedMessage] = await ctx.db
          .update(messages)
          .set({
            respondedBy: ctx.session.user.id,
            responseContent: input.content,
            responseTime: new Date(),
            status: 'responded'
          })
          .where(eq(messages.id, input.messageId))
          .returning();
  
        if (!updatedMessage) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Message not found",
          });
        }
  
  
        await pusherServer.trigger(
            `customer-${updatedMessage.customerId}`,
            'new-response',
            updatedMessage
          );
  
        return updatedMessage;
      }),
  
      getCustomerMessages: protectedProcedure.query(async ({ ctx }) => {
        const customerMessages = await ctx.db
          .select({
            id: messages.id,
            content: messages.content,
            createdAt: messages.createdAt,
            status: messages.status,
            responseContent: messages.responseContent,
            customerId: messages.customerId,
          })
          .from(messages)
          .where(eq(messages.customerId, ctx.session.user.id))
          .orderBy(desc(messages.createdAt));
    
        return customerMessages;
      }),
    
      createCustomerMessage: protectedProcedure
        .input(z.object({
          content: z.string().min(1),
          subject: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const [newMessage] = await ctx.db
            .insert(messages)
            .values({
              customerId: ctx.session.user.id,
              content: input.content,
              status: 'unread',
            
            })
            .returning();
    
          if (!newMessage) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create message",
            });
          }
          await pusherServer.trigger(
            'business-inbox',
            'new-message',
            newMessage
          );
    
         
        
    
          return newMessage;
        }),
  
    markMessageAsRead: protectedProcedure
      .input(z.object({
        messageId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const [updatedMessage] = await ctx.db
          .update(messages)
          .set({
            status: 'read'
          })
          .where(eq(messages.id, input.messageId))
          .returning();
  
        return updatedMessage;
      }),
  });