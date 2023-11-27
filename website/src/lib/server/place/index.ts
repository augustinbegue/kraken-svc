import { PlaceCanvas } from "$lib/place/PlaceCanvas";
import type { Session } from "@prisma/client";
import { prisma } from "../db/prisma";

export async function updateCanvas(
    session: Session,
    x: number,
    y: number,
    color: string,
) {
    // Check if the profile exists,
    let placeProfile = await prisma.placeProfile.findUnique({
        where: {
            login: session.login,
        },
    });
    if (!placeProfile) {
        return false;
    }

    // Check if the cooldown is over
    if (
        placeProfile.lastPlaced.getTime() + PlaceCanvas.COOLDOWN >=
        Date.now()
    ) {
        console.log("cooldown not over");

        return false;
    }

    // Check if the color is valid
    if (!PlaceCanvas.CANVAS_PALETTE.includes(color)) {
        return false;
    }

    const i = x + y * PlaceCanvas.CANVAS_SIZE;
    await prisma.tile.update({
        where: {
            i,
        },
        data: {
            color,
        },
    });
    // TODO: Send update to the websocket server
    await prisma.placeProfile.update({
        where: {
            login: session.login,
        },
        data: {
            tilesPlaced: {
                increment: 1,
            },
            lastPlaced: new Date(),
        },
    });
    await prisma.tileInfo.create({
        data: {
            color,
            i,
            placedAt: new Date(),
            placeProfile: {
                connect: {
                    login: session.login,
                },
            },
        },
    });

    return true;
}
