import { hasRole } from "$lib/accounts/utils";
import { error } from "@sveltejs/kit";
import type { Action, PageServerLoad } from "./$types";
import type { Tile } from "@prisma/client";
import { PlaceCanvas } from "$lib/place/PlaceCanvas";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!hasRole(locals.session.profile, "ADMIN")) {
        throw error(403);
    }

    const tresholdDate = new Date(params.date || Date.now());

    const res = await prisma.tileInfo.findMany({
        where: {
            placedAt: {
                lt: tresholdDate,
            },
        },
        orderBy: {
            placedAt: "desc",
        },
        distinct: ["i"]
    });

    return {
        tiles: res
    }
};
