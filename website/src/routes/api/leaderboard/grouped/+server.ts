import { getLeaderboard } from "$lib/server/leaderboard/api";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    const leaderboard = await getLeaderboard();

    const leaderboardByYear: {
        year: number;
        points: number;
    }[] = [];

    for (const year of [2028, 2027, 2026, 2025, 2024]) {
        const entries = leaderboard.entries.filter((p) => p.profile.graduation_years.includes(year));
        const points = entries.reduce((acc, cur) => acc + cur.points, 0);

        leaderboardByYear.push({ year, points });
    }

    return json(leaderboardByYear);
};
