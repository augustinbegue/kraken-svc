import { prisma } from "$lib/server/db/prisma";
import { createReward } from "$lib/server/leaderboard/api";
import type { Action } from "./$types";

export const actions = {
    add: async ({ request }) => {
        const data = await request.formData();

        const login = (data.get("login") as string).toLowerCase();
        const points = parseInt(data.get("points") as string);

        if (!login || !points) {
            return { success: false, error: "Missing login or points" };
        }

        let res = await createReward(login, points);
        console.log(res);

        return { success: true }
    },
} satisfies Action;
