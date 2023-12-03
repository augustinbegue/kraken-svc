import { getLeaderboard } from "$lib/server/leaderboard/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    const leaderboard = await getLeaderboard();

    leaderboard.entries = leaderboard.entries.filter((entry) => entry.profile.graduation_years.includes(parseInt(params.year)));

    return json(leaderboard);
};

