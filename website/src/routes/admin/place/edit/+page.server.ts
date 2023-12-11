import { hasRole } from "$lib/accounts/utils";
import { error } from "@sveltejs/kit";
import type { Action, PageServerLoad } from "./$types";
import type { Tile } from "@prisma/client";
import { PlaceCanvas } from "$lib/place/PlaceCanvas";
import { prisma } from "$lib/server/db/prisma";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (!hasRole(locals.session.profile, "STAFF")) {
        throw error(403);
    }

    const res = await fetch("/api/place/canvas");

    if (!res.ok) {
        throw error(res.status);
    }

    const { tiles } = await res.json() as { tiles: Tile[] };

    return {
        tiles,
    }
};

export const actions: Action = {
    update: async ({ request, locals }) => {
        if (!hasRole(locals.session.profile, "STAFF")) {
            throw error(403);
        }

        const body = (await request.formData());

        if (!body.get("x") || !body.get("y") || !body.get("width") || !body.get("height") || !body.get("color")) {
            return {
                error: "Missing required fields",
            }
        }

        let x = parseInt(body.get("x") as string);
        let y = parseInt(body.get("y") as string);
        let width = parseInt(body.get("width") as string);
        let height = parseInt(body.get("height") as string);

        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            return {
                error: "Invalid number",
            }
        }

        if (x < 0 || y < 0 || width <= 0 || height <= 0) {
            return {
                error: "Invalid number",
            }
        }

        if (x + width > PlaceCanvas.CANVAS_SIZE || y + height > PlaceCanvas.CANVAS_SIZE) {
            return {
                error: "Invalid number",
            }
        }

        const color = body.get("color") as string;

        if (!color.match(/^#[0-9a-f]{6}$/i)) {
            return {
                error: "Invalid color",
            }
        }

        let tiles: Tile[] = [];

        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                tiles.push({
                    i: j * PlaceCanvas.CANVAS_SIZE + i,
                    color,
                });
            }
        }

        await prisma.tile.updateMany({
            where: {
                i: {
                    in: tiles.map(tile => tile.i),
                },
            },
            data: {
                color,
            },
        });
    }
} satisfies Action;
