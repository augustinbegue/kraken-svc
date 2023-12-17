import { hasRole } from "$lib/accounts/utils"
import { error } from "@sveltejs/kit"
import type { Action, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    if (!hasRole(locals.session.profile, "STAFF")) throw error(403, "Forbidden");

    const currentAnnouncement = await prisma.announcement.findFirst({
        orderBy: { createdAt: "desc" },
    });

    return {
        currentAnnouncement,
    };
}

export const actions: Action = {
    update: async ({ request, locals }) => {
        if (!hasRole(locals.session.profile, "STAFF")) throw error(403, "Forbidden");

        const body = await request.formData();

        const id = body.get("id") as string;

        if (!id) throw error(400, "Missing announcement ID");

        const announcement = await prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw error(404, "Announcement not found");

        await prisma.announcement.update({
            where: { id },
            data: {
                title: body.get("title") as string,
                description: body.get("description") as string,
                link: body.get("link") as string,
                image: body.get("image") as string,
            }
        });
    }
} satisfies Action;
