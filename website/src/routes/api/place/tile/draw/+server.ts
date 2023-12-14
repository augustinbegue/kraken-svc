import { isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendCanvasUpdate } from "$lib/server/place";
import type { Profile, Session } from "@prisma/client";
import { createReward } from "$lib/server/leaderboard/api";

export interface ApiTileDrawBody {
    x: number;
    y: number;
    color: string;
}

let placeActivityId = 4;

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw error(401, "Unauthorized");
    }

    throw error(403, "Forbidden");

    const profile = locals.session.profile as Profile;

    const body = (await request.json()) as ApiTileDrawBody;

    const { x, y, color } = body;

    if (await sendCanvasUpdate(locals, x, y, color)) {
        await createReward(profile.preferred_username, 0, placeActivityId);

        return json({ success: true });
    } else {
        throw error(400, "Bad Request");
    }
};
