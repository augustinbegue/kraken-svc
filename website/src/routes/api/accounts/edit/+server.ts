import { hasRole } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Profile, Role } from "@prisma/client";
import { prisma } from "$lib/server/db/prisma";

export interface AccountsEditBody {
    profile: Profile;
}

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!hasRole(locals.session.profile, "ADMIN")) {
        throw error(403, "Forbidden");
    }

    const body = await request.json() as AccountsEditBody;

    if (!body.profile || !body.profile.preferred_username) {
        throw error(400, "Missing login");
    }

    const profile = await prisma.profile.update({
        where: {
            preferred_username: body.profile.preferred_username,
        },
        data: {
            roles: body.profile.roles,
            isActive: body.profile.isActive,
            isDeleted: body.profile.isDeleted,
            deletedAt: body.profile.isDeleted ? new Date() : undefined
        }
    });

    return json(profile);
}
