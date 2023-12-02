import { isLoggedIn } from "$lib/accounts/utils";
import { error, json, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db/prisma";
import { createReward } from "$lib/server/leaderboard/api";

export const load: PageServerLoad = async ({ locals, params, cookies, url }) => {
    if (!isLoggedIn(locals.session)) {
        cookies.set("redirect", url.pathname, {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        throw redirect(302, "/accounts/login/epita");
    }

    const qrCodeId = atob(params.code);

    const qrCode = await prisma.qRCode.findUnique({
        where: {
            id: qrCodeId,
        },
        include: {
            _count: {
                select: {
                    usedBy: true,
                }
            },
            usedBy: {
                where: {
                    preferred_username: locals.session.profile.preferred_username,
                }
            }
        }
    });

    if (!qrCode) {
        throw error(404, "QR Code not found");
    }

    if (qrCode.maxUses !== 0 && qrCode.maxUses <= qrCode._count.usedBy) {
        throw error(403, "QR Code has been used too many times");
    }

    if (qrCode.usedBy.length > 0) {
        throw error(403, "QR Code has already been used");
    }

    let res = await createReward(locals.session.profile.preferred_username, qrCode.activityId, qrCode.points);

    if ((res as any).errors?.length > 0) {
        throw error(500, (res as any).errors[0].message);
    }

    await prisma.qRCode.update({
        where: {
            id: qrCodeId,
        },
        data: {
            usedBy: {
                connect: {
                    preferred_username: locals.session.profile.preferred_username,
                }
            }
        }
    });

    return {
        qrCode,
    }
}
