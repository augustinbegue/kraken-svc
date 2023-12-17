import { isLoggedIn } from "$lib/accounts/utils";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";
import type { Session } from "@prisma/client";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const { session } = locals;

    if (!isLoggedIn(session)) {
        cookies.set("redirect", "/place", {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        throw redirect(302, "/accounts/login/epita");
    }

    let placeProfile = await prisma.placeProfile.findUnique({
        where: {
            login: (session as Session).login,
        },
    });

    if (!placeProfile) {
        placeProfile = await prisma.placeProfile.create({
            data: {
                profile: {
                    connect: {
                        preferred_username: (session as Session).login,
                    },
                },
                tilesPlaced: 0,
            },
        });
    }

    const wsUrl = env.WS_URL;

    const currentAnnouncement = await prisma.announcement.findFirst({
        orderBy: { createdAt: "desc" },
    });

    return {
        currentAnnouncement,
        session,
        placeProfile,
        wsUrl,
    };
};
