import { building } from "$app/environment";
import { prisma } from "$lib/server/db/prisma";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

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

export const handle = sequence(handleSession);
