import { isLoggedIn } from "$lib/accounts/utils";
import type { Profile } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { getLeaderboard, getLeaderboardEntry } from "$lib/server/leaderboard/api";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {

    const events = await prisma.event.findMany({
        orderBy: {
            startTime: "asc",
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
        const leaderboardEntry = await getLeaderboardEntry(profile.preferred_username);

        return {
            leaderboardEntry,
            events,
        };
    } catch (error) {
        return {
            events,
        }
    }
};
