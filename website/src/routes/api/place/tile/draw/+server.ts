import { isLoggedIn } from "$lib/accounts/utils";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendCanvasUpdate } from "$lib/server/place";
import type { Session } from "@prisma/client";

export interface ApiTileDrawBody {
    x: number;
    y: number;
    color: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw error(401, "Unauthorized");
    }
    const session = locals.session as Session;

    const body = (await request.json()) as ApiTileDrawBody;

    const { x, y, color } = body;

    if (await sendCanvasUpdate(locals, x, y, color)) {
        return json({ success: true });
    } else {
        throw error(400, "Bad Request");
    }
};
