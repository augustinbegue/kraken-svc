import { isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendCanvasUpdate } from "$lib/server/place";
import type { Profile, Session } from "@prisma/client";
import { env } from "$env/dynamic/private";
import { log } from "$lib/server/logger";
import { addReward } from "$lib/server/accounts/utils";

export interface ApiTileDrawBody {
    x: number;
    y: number;
    color: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw error(401, "Unauthorized");
    }

    const session = locals.session;

    const endDate = new Date(env.END_DATE ?? "").getTime();
    const now = Date.now();

    if (now > endDate) {
        throw error(403, "Forbidden");
    }

    try {
        const body = (await request.json()) as ApiTileDrawBody;

        const { x, y, color } = body;

        if (x === undefined || y === undefined || !color) {
            log.error(`User ${session.id} tried to place with invalid data`);
            throw error(400, "Bad Request");
        }

        if (await sendCanvasUpdate(locals, x, y, color)) {
            await addReward(session.id);

            return json({ success: true });
        } else {
            throw error(400, "Bad Request");
        }
    } catch (e) {
        log.error(e)
        throw error(500, "Internal Server Error");
    }
};
