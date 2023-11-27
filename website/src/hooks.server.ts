import { building } from "$app/environment";
import { prisma } from "$lib/server/db/prisma";
import { handleConnection } from "$lib/server/websocket/handle";
import {
    type ExtendedGlobal,
    GlobalThisWSS,
} from "$lib/server/websocket/utils";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

let wssInitialized = false;
const startupWebsocketServer = () => {
    if (wssInitialized) return;
    console.log("[wss:kit] setup");
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
        wss.on("connection", handleConnection);
        wssInitialized = true;
    }
};

const handleWss: Handle = async ({ event, resolve }) => {
    startupWebsocketServer();
    // Skip WebSocket server when pre-rendering pages
    if (!building) {
        const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
        if (wss !== undefined) {
            event.locals.wss = wss;
        }
    }
    const response = await resolve(event, {
        filterSerializedResponseHeaders: (name) => name === "content-type",
    });
    return response;
};

const handleSession: Handle = async ({ event, resolve }) => {
    const { cookies, locals } = event;

    const sessionId = cookies.get("session");

    if (sessionId) {
        const found = await prisma.session.findUnique({
            where: {
                id: atob(sessionId),
            },
            include: {
                profile: {
                    include: {
                        groups: true,
                    },
                },
            },
        });

        if (!found || found?.expiresAt < new Date()) {
            cookies.delete("session", {
                path: "/",
            });
        } else {
            locals.session = found;
        }
    }

    const state = cookies.get("state");

    if (!state) {
        // Set state cookie, expires in 5 minutes
        cookies.set("state", crypto.randomUUID(), {
            maxAge: 60 * 5,
            path: "/",
        });
    }

    return resolve(event);
};

export const handle = sequence(handleWss, handleSession);
