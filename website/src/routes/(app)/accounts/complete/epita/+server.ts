import { env } from "$env/dynamic/private";
import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db/prisma";
import type { Group, Profile } from "@prisma/client";
import { log } from "$lib/server/logger";

export const GET: RequestHandler = async ({ locals, url, cookies, fetch }) => {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const localState = cookies.get("state");

    if (state !== localState) {
        throw error(400, "Invalid state");
    }

    if (!code) {
        throw error(400, "Missing code");
    }

    const tokres = await fetch(`${env.FORGE_ID_ISSUER}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(
                `${env.FORGE_ID_CLIENT_ID}:${env.FORGE_ID_SECRET}`,
            )}`,
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: env.FORGE_ID_REDIRECT_URI,
        }),
    });

    if (!tokres.ok) {
        throw error(tokres.status, "Failed to fetch token");
    }

    const { access_token: accessToken } = (await tokres.json()) as {
        access_token: string;
    };

    const res = await fetch(`${env.FORGE_ID_ISSUER}/userinfo`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw error(res.status, "Failed to fetch user info");
    }

    // Create session and profile if not exists
    const profile = (await res.json()) as Profile & {
        groups: Group[];
    };

    // Check if profile exists
    const existing = await prisma.profile.findUnique({
        where: {
            preferred_username: profile.preferred_username,
        },
        include: {
            groups: true,
        },
    });

    // Check if account is active
    if (existing) {
        if (!existing.isActive) {
            throw error(403, "Account is disabled.");
        }

        if (existing.isDeleted) {
            await prisma.profile.update({
                where: {
                    preferred_username: profile.preferred_username,
                },
                data: {
                    isDeleted: false,
                    deletedAt: undefined,
                },
            });
        }
    }

    // Create session & profile
    const session = await prisma.session.create({
        data: {
            accessToken,
            profile: {
                connectOrCreate: {
                    where: {
                        preferred_username: profile.preferred_username,
                    },
                    create: {
                        preferred_username: profile.preferred_username,
                        given_name: profile.given_name,
                        family_name: profile.family_name,
                        nickname: profile.nickname,
                        name: profile.name,
                        zoneinfo: profile.zoneinfo,
                        uid: profile.uid,
                        gid: profile.gid,
                        graduation_years: profile.graduation_years,
                        email: profile.email,
                    },
                },
            },
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
        include: {
            profile: {
                include: {
                    groups: true,
                },
            },
        },
    });

    if (!session) {
        throw error(500, "Failed to create session");
    }

    // Create/link groups to profile
    log.debug(
        `Linking Groups: ${profile.groups.map((g) => g.name).join(", ")}`,
    );
    for (const group of profile.groups) {
        await prisma.group.upsert({
            where: {
                slug: group.slug,
            },
            create: {
                kind: group.kind,
                slug: group.slug,
                name: group.name,
                private: group.private,
                Profile: {
                    connect: {
                        preferred_username: profile.preferred_username,
                    },
                },
            },
            update: {
                Profile: {
                    connect: {
                        preferred_username: profile.preferred_username,
                    },
                },
            },
        });
    }

    cookies.set("session", btoa(session.id), {
        path: "/",
        httpOnly: true,
        maxAge: session.expiresAt.getTime() - Date.now(),
    });

    const redirection = cookies.get("redirect");
    cookies.delete("redirect", { path: "/" });
    throw redirect(302, redirection || "/");
};
