import { prisma } from "$lib/server/db/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    const events = await prisma.event.findMany({
        orderBy: {
            startTime: "asc",
        },
    });

    return {
        events,
    }
};
