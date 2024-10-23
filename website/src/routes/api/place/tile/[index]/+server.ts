import { prisma } from "$lib/server/db/prisma";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isLoggedIn } from "$lib/accounts/utils";

export const GET: RequestHandler = async ({ params, locals }) => {
    const { index } = params;

    if (!(await isLoggedIn(locals.session))) {
        throw error(401, "Unauthorized");
    }

    const tileInfo = await prisma.tileInfo.findFirst({
        where: {
            i: Number(index),
        },
        orderBy: {
            placedAt: "desc",
        },
    });

    if (!tileInfo) {
        throw error(404, "Tile not found");
    }

    return json(tileInfo);
};
