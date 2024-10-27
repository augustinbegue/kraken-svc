import { isLoggedIn } from "$lib/accounts/utils";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";
import { env } from "$env/dynamic/private";
import { PUBLIC_LOGIN_URL } from '$env/static/public';
import { ClientSession } from "$lib/accounts";

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const { session } = locals;

    if (!(await isLoggedIn(session))) {
        throw redirect(302, PUBLIC_LOGIN_URL);
    }

    let placeProfile = await prisma.placeProfile.findUnique({
        where: {
            login: session.login,
        },
    });

    if (!placeProfile) {
        placeProfile = await prisma.placeProfile.create({
            data: {
                profile: {
                    connect: {
                        preferred_username: session.login,
                    },
                },
                tilesPlaced: 0,
            },
        });
    }

    const wsUrl = env.WS_URL;
    const endDate = env.END_DATE ?? "";

    const currentAnnouncement = await prisma.announcement.findFirst({
        orderBy: { createdAt: "desc" },
    });

    return {
        currentAnnouncement,
        session,
        placeProfile,
        wsUrl,
        endDate
    };
};
