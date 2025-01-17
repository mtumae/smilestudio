import { relations, sql } from "drizzle-orm";

import {
  decimal,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";

import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `smilestudio_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    title: varchar("title", {length:256}),
    subtitle: varchar("title", {length:256}),
    body: varchar("body"),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),

  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phonenumber: varchar("phonenumber", { length: 255 }).unique(),
  role: varchar("role", { length: 255 }).notNull().default("client"),
  password: text("password"),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),



});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export const appointments = createTable('appointments', {
  id: serial('id').primaryKey(),
  patientName: varchar('patient_name', { length: 255 }).notNull(),
  patientEmail: varchar('patient_email', { length: 255 }).notNull(),
  appointmentType: varchar('appointment_type', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  googleEventId: varchar('google_event_id', { length: 255 }),
});

export const appointmentTypes = createTable('appointment_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  duration: integer('duration').notNull(), 
});
export const revenues = createTable('revenues', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
});

export const satisfactionRatings = createTable('satisfaction_ratings', {
  id: serial('id').primaryKey(),
  rating: integer('rating').notNull(),
  date: timestamp('date').notNull(),
});
export const settings = createTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull(),
  isSet: boolean('isSet').default(true),
});
export const patients = createTable('patients', {
  id: serial('id').primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
  .default(sql`CURRENT_TIMESTAMP`)
  .notNull(),
  
});
export const messageStatusEnum = pgEnum('message_status', ['unread', 'read', 'responded']);

export const messages = createTable('messages', {
  id: serial('id').primaryKey(),
  customerId: varchar('customer_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  status: messageStatusEnum('status').notNull().default('unread'),
  respondedBy: varchar('responded_by', { length: 255 })
    .references(() => users.id),
  responseContent: text('response_content'),
  isStarred: boolean('is_starred').default(false),
  responseTime: timestamp('response_time'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});

export const typingIndicators = createTable('typing_indicators', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  conversationId: varchar('conversation_id', { length: 255 })
    .notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  customer: one(users, {
    fields: [messages.customerId],
    references: [users.id],
  }),
  responder: one(users, {
    fields: [messages.respondedBy],
    references: [users.id],
  }),
}));
export const resetLink = createTable("reset_link", {
  identifier: text("identifier").notNull(),
  uuid: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
