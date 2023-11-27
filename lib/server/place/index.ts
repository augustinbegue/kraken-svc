import { PlaceCanvas } from "$lib/place/PlaceCanvas";
import type { Session } from "@prisma/client";
import { prisma } from "../db/prisma";

/**
 * checks if the user can update the canvas and sends the update to the websocket server
 * @param session session of the user
 * @param x x coordinate
 * @param y y coordinate
 * @param color color to place
 * @returns true if the update was successful, false otherwise
 */
export async function sendCanvasUpdate(
    locals: App.Locals,
    x: number,
    y: number,
    color: string,
) {
    const session = locals.session as Session;
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
        return false;
    }

    // Check if the color is valid
    if (!PlaceCanvas.CANVAS_PALETTE.includes(color)) {
        return false;
    }

    const i = x + y * PlaceCanvas.CANVAS_SIZE;

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
    locals.ws.send({
        type: "place.update",
        data: {
            i,
            x,
            y,
            color,
        },
    });

    return true;
}
