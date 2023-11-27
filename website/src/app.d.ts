// See https://kit.svelte.dev/docs/types#app

import type { ExtendedWebSocketServer } from "$lib/server/websocket/utils";
import type { Session, Profile, Group } from "@prisma/client";

export type ClientSession =
    | (Session & {
          profile: Profile & {
              groups: Group[];
          };
      })
    | {
          state: string;
      };

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            wss?: ExtendedWebSocketServer;
            session: ClientSession;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
