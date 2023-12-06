import { hasRole } from "$lib/accounts/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    if (!hasRole(locals.session.profile, "ADMIN")) {
        throw error(403, "Forbidden");
    }

    const profiles = await prisma.profile.findMany({
        where: {
            isDeleted: false
        },
        orderBy: {
            created_at: "desc"
        },
        include: {
            groups: true
        }
    });

    return {
        profiles
    };
};
