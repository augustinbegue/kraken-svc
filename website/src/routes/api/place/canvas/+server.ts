import { prisma } from "$lib/server/db/prisma";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PlaceCanvas } from "$lib/place/PlaceCanvas";
import { log } from "$lib/server/logger";

export const GET: RequestHandler = async () => {
    let tiles = await prisma.tile.findMany({
        orderBy: {
            i: "asc",
        },
    });

    if (tiles.length === 0) {
        log.warn("No tiles found in database, generating new ones...");
        tiles = PlaceCanvas.generateBoard();

        await prisma.tile.createMany({
            data: tiles,
        });
    }

    if (tiles.length !== PlaceCanvas.CANVAS_SIZE ** 2) {
        throw error(500);
    }

    return json({ tiles });
};
