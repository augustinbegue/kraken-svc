import { hasRole, isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db/prisma";

export interface CreateQRBody {
    maxUses: number;
    activityId: number;
    points: number;
}

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!hasRole(locals.session.profile, "STAFF")) {
        throw error(403, "Forbidden");
    }

    const body = await request.json() as CreateQRBody;

    if (body.maxUses === undefined || body.activityId === undefined || body.points === undefined) {
        throw error(400, "Missing required body parameters");
    }

    const qrCode = await prisma.qRCode.create({
        data: {
            maxUses: body.maxUses,
            activityId: body.activityId,
            points: body.points
        }
    });

    return json(qrCode);
};
