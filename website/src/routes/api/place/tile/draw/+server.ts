import { isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendCanvasUpdate } from "$lib/server/place";
import type { Profile, Session } from "@prisma/client";
import { env } from "$env/dynamic/private";
import { log } from "$lib/server/logger";

export interface ApiTileDrawBody {
    x: number;
    y: number;
    color: string;
}

async function addPointToLeaderboard(profile: Profile) {
    const url = new URL("/wei/addPlacePoint", env.API_URL);

    console.log("Adding point to leaderboard", profile.preferred_username);

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${env.API_TOKEN}`,
        },
        body: JSON.stringify({
            login: profile.preferred_username,
        }),
    })
        .catch(e => console.error(e));

    return res && res.ok;
}

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw error(401, "Unauthorized");
    }

    const profile = locals.session.profile as Profile;

    const endDate = new Date(env.END_DATE ?? "").getTime();
    const now = Date.now();

    if (now > endDate) {
        throw error(403, "Forbidden");
    }

    try {
        const body = (await request.json()) as ApiTileDrawBody;

        const { x, y, color } = body;

        if (x === undefined || y === undefined || !color) {
            log.error(`User ${profile.preferred_username} tried to place with invalid data`);
            throw error(400, "Bad Request");
        }

        if (await sendCanvasUpdate(locals, x, y, color)) {
            await addPointToLeaderboard(profile);

            return json({ success: true });
        } else {
            throw error(400, "Bad Request");
        }
    } catch (e) {
        log.error(e)
        throw error(500, "Internal Server Error");
    }
};
