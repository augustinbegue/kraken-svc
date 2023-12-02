import { isLoggedIn } from "$lib/accounts/utils";
import type { Profile } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { getLeaderboard, getLeaderboardEntry } from "$lib/server/leaderboard/api";

export const load: PageServerLoad = async ({ locals }) => {
    if (!isLoggedIn(locals.session)) {
        return;
    }

    const { profile } = locals.session as { profile: Profile };

    if (!profile) {
        return;
    }

    const leaderboardEntry = await getLeaderboardEntry(profile.preferred_username);

    return {
        leaderboardEntry,
    };
};



