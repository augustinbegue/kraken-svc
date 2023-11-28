import { env } from "$env/dynamic/private";
import { isLoggedIn } from "$lib/accounts/utils";
import { prisma } from "$lib/server/db/prisma";
import { log } from "$lib/server/logger";
import { WebsocketHandler } from "$lib/server/websocket/WebsocketHandler";
import type { Profile, Session } from "@prisma/client";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export let wsHandler: WebsocketHandler;

const handleWebsocket: Handle = async ({ event, resolve }) => {
    const { locals } = event;

    if (!wsHandler) {
        wsHandler = new WebsocketHandler();
    }

    locals.ws = wsHandler;

    return resolve(event);
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

const handleAccessLogs: Handle = async ({ event, resolve }) => {
    const { locals } = event;
    let profile: Profile | undefined;
    if (isLoggedIn(locals.session)) {
        profile = locals.session.profile;
    }

    let clientIdentifier = profile
        ? `${profile.nickname}: ${event.getClientAddress()}`
        : event.getClientAddress();

    log.info(
        `${event.request.method} ${event.url.pathname} from ${clientIdentifier}`,
    );

    const response = await resolve(event);

    log.info(
        `${response.status} ${event.url.pathname} ${response.headers.get(
            "content-length",
        )} to ${clientIdentifier}`,
    );

    return response;
};

export const handle = sequence(
    handleWebsocket,
    handleSession,
    handleAccessLogs,
);
