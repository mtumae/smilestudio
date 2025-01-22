import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { appointmentRouter } from "./routers/appointment";
import { analyticsRouter } from "./routers/analytics";
import { settings } from "../db/schema";
import { settingsRouter } from "./routers/settings";
import { businessMessageRouter } from "./routers/messaging";
import { patientRouter } from "./routers/patients";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  appointment: appointmentRouter,
  
  settings: settingsRouter,
  messages: businessMessageRouter,
  patient: patientRouter,
  analytics:analyticsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
