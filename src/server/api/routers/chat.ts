import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { messages, conversations, conversationParticipants, users } from "~/server/db/schema";
import { eq, and, desc, lt, asc, sql, ne, } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { pusherServer } from '~/server/pusher';



export const chatRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id)
    });
    const isAdmin = user?.role === "admin";

    // If admin, get all conversations
    if (isAdmin) {
      const allConversations = await ctx.db
        .select({
          conversation: conversations,
          participant: conversationParticipants,
          lastMessage: messages,
          otherUser: users,
        })
        .from(conversations)
        .innerJoin(
          conversationParticipants,
          eq(conversations.id, conversationParticipants.conversationId)
        )
        .innerJoin(
          users,
          eq(users.id, conversationParticipants.userId)
        )
        .leftJoin(
          messages,
          and(
            eq(messages.conversationId, conversations.id),
            eq(messages.id, 
              sql`(
                SELECT id 
                FROM ${messages} 
                WHERE conversation_id = ${conversations.id} 
                ORDER BY created_at DESC 
                LIMIT 1
              )`
            )
          )
        )
        .where(
          and(
            ne(conversationParticipants.userId, ctx.session.user.id),
            eq(conversationParticipants.role, 'patient')
          )
        )
        .orderBy(desc(conversations.updatedAt));

      return allConversations;
    }

    // If not admin, get only user's conversations
    const userConversations = await ctx.db
      .select({
        conversation: conversations,
        participant: conversationParticipants,
        lastMessage: messages,
        otherUser: users,
      })
      .from(conversations)
      .innerJoin(
        conversationParticipants,
        eq(conversations.id, conversationParticipants.conversationId)
      )
      .innerJoin(
        users,
        eq(users.id, 
          sql`(
            SELECT user_id 
            FROM ${conversationParticipants} 
            WHERE conversation_id = ${conversations.id} 
              AND user_id != ${ctx.session.user.id} 
            LIMIT 1
          )`
        )
      )
      .leftJoin(
        messages,
        and(
          eq(messages.conversationId, conversations.id),
          eq(messages.id, 
            sql`(
              SELECT id 
              FROM ${messages} 
              WHERE conversation_id = ${conversations.id} 
              ORDER BY created_at DESC 
              LIMIT 1
            )`
          )
        )
      )
      .where(
        eq(conversationParticipants.userId, ctx.session.user.id)
      )
      .orderBy(desc(conversations.updatedAt));
  
    return userConversations;
  }),

  getMessages: protectedProcedure
  .input(z.object({
    conversationId: z.number(),
    limit: z.number().default(50),
    cursor: z.number().optional(),
  }))
  .query(async ({ ctx, input }) => {
    // Check if user is admin
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id)
    });
    const isAdmin = user?.role === "admin";

    // If not admin, check if user is participant
    if (!isAdmin) {
      const participant = await ctx.db.query.conversationParticipants.findFirst({
        where: and(
          eq(conversationParticipants.conversationId, input.conversationId),
          eq(conversationParticipants.userId, ctx.session.user.id)
        ),
      });
      
      if (!participant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not part of this conversation",
        });
      }
    }

    const messagesList = await ctx.db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        status: messages.status,
        senderImage: users.image,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        input.cursor
          ? and(
              eq(messages.conversationId, input.conversationId),
              lt(messages.id, input.cursor)
            )
          : eq(messages.conversationId, input.conversationId)
      )
      .orderBy(asc(messages.createdAt))
      .limit(input.limit);

    return messagesList;
  }),
    sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id)
      });
      const isAdmin = user?.role === "admin";

      // If not admin, check if user is participant
      if (!isAdmin) {
        const participant = await ctx.db.query.conversationParticipants.findFirst({
          where: and(
            eq(conversationParticipants.conversationId, input.conversationId),
            eq(conversationParticipants.userId, ctx.session.user.id)
          ),
        });

        if (!participant) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not part of this conversation",
          });
        }
      }

      try {
        const [newMessage] = await ctx.db.insert(messages)
          .values({
            conversationId: input.conversationId,
            senderId: ctx.session.user.id,
            content: input.content,
          })
          .returning();
  
        if (!newMessage) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create message",
          });
        }
  
        await ctx.db.update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, input.conversationId));
  
        await pusherServer.trigger(
          `chat-${input.conversationId}`,
          'new-message',
          newMessage
        );
  
        return newMessage;
      } catch (error) {
        console.error("Error in sendMessage procedure:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while sending the message",
        });
      }
    }),

  createConversation: protectedProcedure
    .input(z.object({
      subject: z.string().min(1),
      initialMessage: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find an admin user
      const adminUser = await ctx.db.query.users.findFirst({
        where: eq(users.role, "admin")
      });

      if (!adminUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No admin user found to handle the conversation",
        });
      }

      // Create the conversation with subject
      const [newConversation] = await ctx.db.insert(conversations)
        .values({
          subject: input.subject,
          type: 'support',
          updatedAt: new Date(),
        })
        .returning();

      if (!newConversation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create conversation",
        });
      }

      // Add the user and admin to the conversation with roles
      await ctx.db.insert(conversationParticipants)
        .values([
          {
            conversationId: newConversation.id,
            userId: ctx.session.user.id,
            role: 'patient',
            lastRead: new Date(),
          },
          {
            conversationId: newConversation.id,
            userId: adminUser.id,
            role: 'admin',
            lastRead: new Date(),
          },
        ]);

      // Add the initial message
      const [newMessage] = await ctx.db.insert(messages)
        .values({
          conversationId: newConversation.id,
          senderId: ctx.session.user.id,
          content: input.initialMessage,
          createdAt: new Date(),
        })
        .returning();

      // Notify admins of new conversation
      await pusherServer.trigger(
        'admin-notifications',
        'new-conversation',
        {
          conversationId: newConversation.id,
          subject: input.subject,
          message: input.initialMessage,
        }
      );

      return { id: newConversation.id };
    }),
    getConversationDetails: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db
        .select({
          conversation: conversations,
          participant: conversationParticipants,
          user: users,
        })
        .from(conversations)
        .innerJoin(
          conversationParticipants,
          eq(conversations.id, conversationParticipants.conversationId)
        )
        .innerJoin(
          users,
          eq(conversationParticipants.userId, users.id)
        )
        .where(and(
          eq(conversations.id, input.conversationId),
          eq(conversationParticipants.userId, sql`${conversationParticipants.userId} != ${ctx.session.user.id}`)
        ))
        .limit(1);

      if (!conversation.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      return conversation[0];
    }),
    getConversation: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db
        .select({
          conversation: conversations,
          participant: conversationParticipants,
          user: users,
        })
        .from(conversations)
        .innerJoin(
          conversationParticipants,
          eq(conversations.id, conversationParticipants.conversationId)
        )
        .innerJoin(
          users,
          eq(conversationParticipants.userId, users.id)
        )
        .where(and(
          eq(conversations.id, input.conversationId),
          ne(conversationParticipants.userId, ctx.session.user.id)
        ))
        .limit(1);
  
      if (!conversation.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }
  
      return conversation[0];
    }),

  // setTypingStatus: protectedProcedure
  //   .input(z.object({
  //     conversationId: z.number(),
  //     isTyping: z.boolean(),
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     await pusherServer.trigger(
  //       `chat-${input.conversationId}-typing`,
  //       'typing-status',
  //       {
  //         userId: ctx.session.user.id,
  //         isTyping: input.isTyping,
  //       }
  //     );
  //   }),
  // Add these to your existing chatRouter





});