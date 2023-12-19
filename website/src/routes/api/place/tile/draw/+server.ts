import { isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendCanvasUpdate } from "$lib/server/place";
import type { Profile, Session } from "@prisma/client";
import { createReward } from "$lib/server/leaderboard/api";
import { PlaceCanvas } from "$lib/place/PlaceCanvas";

export interface ApiTileDrawBody {
    x: number;
    y: number;
    color: string;
}

let placeActivityId = 4;

const cutoffDate = new Date("2023-12-20T01:00:00.000Z").getTime();

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw error(401, "Unauthorized");
    }

    const profile = locals.session.profile as Profile;

    const now = Date.now();
    if (now > cutoffDate) {
        throw error(403, "Forbidden");
    }

    try {
        const body = (await request.json()) as ApiTileDrawBody;

        const { x, y, color } = body;

        if (x === undefined || y === undefined || !color) {
            throw error(400, "Bad Request");
        }

        if (await sendCanvasUpdate(locals, x, y, color)) {
            await createReward(profile.preferred_username, 0, placeActivityId);

            return json({ success: true });
        } else {
            throw error(400, "Bad Request");
        }
    } catch (e) {
        throw error(400, "Bad Request");
    }
};
