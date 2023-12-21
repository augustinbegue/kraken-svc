import { hasRole } from "$lib/accounts/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";

export const ssr = false;

export const load: PageServerLoad = async ({ locals }) => {
    if (!hasRole(locals.session.profile, "ADMIN")) {
        throw error(403);
    }

    const startDate = new Date("2023-12-13T06:00:00.000+01:00");
    const endDate = new Date("2023-12-19T20:00:00.000+01:00");

    const res = await prisma.tileInfo.findMany({
        where: {
            placedAt: {
                gte: startDate,
                lt: endDate,
            },
        },
        orderBy: {
            placedAt: "asc",
        }
    });

    console.log(`Loaded ${res.length} tiles`);

    return {
        startDate,
        endDate,
        tiles: res
    }
}
