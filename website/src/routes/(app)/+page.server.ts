import { isLoggedIn } from "$lib/accounts/utils";
import type { Profile } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {

    const events = await prisma.event.findMany({
        orderBy: {
            startTime: "asc",
        },
        where: {
            endTime: {
                gt: new Date(),
            },
        },
    });

    if (!isLoggedIn(locals.session)) {
        return {
            events,
        }
    }

    const { profile } = locals.session as { profile: Profile };

    if (!profile) {
        return {
            events,
        }
    }

    try {
        return {
            events,
        };
    } catch (error) {
        return {
            events,
        }
    }
};
