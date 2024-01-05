
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
Sentry.init({
    dsn: 'https://cc019f35a1099c0d9de1249474e88764@o4506393568280576.ingest.sentry.io/4506393569591296',
    tracesSampleRate: 1.0,
});

import { log } from "$lib/server/logger";
const handleAccessLogs: Handle = async ({ event, resolve }) => {
    let clientIdentifier = event.getClientAddress();

    log.info(
        `${event.request.method} ${event.url.pathname} from ${clientIdentifier}`,
    );
    // log.info(`Headers: `);
    // for (const [key, value] of event.request.headers.entries()) {
    //     log.info(`  ${key}: ${value}`);
    // }

    const response = await resolve(event);

    log.info(
        `${response.status} ${event.url.pathname} ${response.headers.get(
            "content-length",
        )} to ${clientIdentifier}`,
    );
    // log.info(`Headers: `);
    // for (const [key, value] of response.headers.entries()) {
    //     log.info(`  ${key}: ${value}`);
    // }

    return response;
};

export const handle = sequence(
    sentryHandle(),
    handleAccessLogs,
);

export const handleError = handleErrorWithSentry();
