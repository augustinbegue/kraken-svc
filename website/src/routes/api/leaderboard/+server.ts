import { getLeaderboard } from "$lib/server/leaderboard/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const limit = parseInt(url.searchParams.get('limit') ?? '100');
    const page = parseInt(url.searchParams.get('page') ?? '1');

    console.log(limit, page);

    const leaderboard = await getLeaderboard(page, limit);

    return json(leaderboard);
};
