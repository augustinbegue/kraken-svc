
import { redirect, type Handle } from "@sveltejs/kit";
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

import { getUserSession, isLoggedIn } from "$lib/accounts/utils";
import { log } from "$lib/server/logger";
const handleAccessLogs: Handle = async ({ event, resolve }) => {
    const { locals } = event;
    let id: string | undefined;
    if (await isLoggedIn(locals.session)) {
        id = locals.session.login;
    }

    let clientIdentifier = id ? id : "unknown"
    try {
        clientIdentifier = id
            ? `${id}: ${event.getClientAddress()}`
            : event.getClientAddress();
    } catch { }

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

import { PUBLIC_LOGIN_URL } from "$env/static/public";
const handleSession: Handle = async ({ event, resolve }) => {
    const session = await getUserSession(event.cookies.get("krakookie") ?? "")

    if (!session) {
        console.log('hook not logged in', event.cookies.get("krakookie"))
        throw redirect(302, PUBLIC_LOGIN_URL);
    }

    event.locals.session = session;

    return await resolve(event);
}


export const handle = sequence(
    sentryHandle(),
    handleSession,
    handleWebsocket,
    handleAccessLogs,
);

export const handleError = handleErrorWithSentry();
