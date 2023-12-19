import { prisma } from "$lib/server/db/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ }) => {
    const currentAnnouncement = await prisma.announcement.findFirst({
        orderBy: { createdAt: "desc" },
    });

    return {
        currentAnnouncement,
    };
}
