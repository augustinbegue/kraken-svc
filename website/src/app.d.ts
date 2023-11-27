// See https://kit.svelte.dev/docs/types#app

import type { WebsocketHandler } from "$lib/server/websocket/WebsocketHandler";
import type { Session, Profile, Group } from "@prisma/client";

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            ws: WebsocketHandler;
            session: ClientSession;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
