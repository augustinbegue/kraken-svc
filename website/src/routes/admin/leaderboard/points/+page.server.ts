import { prisma } from "$lib/server/db/prisma";
import { createReward } from "$lib/server/leaderboard/api";
import type { Action } from "./$types";

export const actions = {
    add: async ({ request }) => {
        const data = await request.formData();

        const login = data.get("login") as string;
        const points = parseInt(data.get("points") as string);

        if (!login || !points) {
            return { success: false, error: "Missing login or points" };
        }

        await createReward(login, 0, points);

        return { success: true }
    },
} satisfies Action;
