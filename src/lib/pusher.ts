import Pusher from 'pusher-js';
import {env} from "process"

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: "mt1",
});