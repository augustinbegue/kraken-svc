
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
Sentry.init({
    dsn: 'https://cc019f35a1099c0d9de1249474e88764@o4506393568280576.ingest.sentry.io/4506393569591296',
    tracesSampleRate: 1.0,
});

import { WebsocketHandler } from "$lib/server/websocket/WebsocketHandler";
export let wsHandler: WebsocketHandler;
const handleWebsocket: Handle = async ({ event, resolve }) => {
    const { locals } = event;

    if (!wsHandler) {
        wsHandler = new WebsocketHandler();
    }

    locals.ws = wsHandler;

    return resolve(event);
};

import { isLoggedIn } from "$lib/accounts/utils";
import { prisma } from "$lib/server/db/prisma";
import type { Profile, Session } from "@prisma/client";
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

import { log } from "$lib/server/logger";
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
    log.info(`Headers: `);
    for (const [key, value] of event.request.headers.entries()) {
        log.info(`  ${key}: ${value}`);
    }

    const response = await resolve(event);

    log.info(
        `${response.status} ${event.url.pathname} ${response.headers.get(
            "content-length",
        )} to ${clientIdentifier}`,
    );

    return response;
};

export const handle = sequence(
    sentryHandle(),
    handleWebsocket,
    handleSession,
    handleAccessLogs,
);

export const handleError = handleErrorWithSentry();
