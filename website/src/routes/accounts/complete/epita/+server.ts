import {
    FORGE_ID_CLIENT_ID,
    FORGE_ID_ISSUER,
    FORGE_ID_SECRET,
} from "$env/static/private";
import { error, json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db/prisma";
import type { Profile } from "@prisma/client";

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

    const tokres = await fetch(`${FORGE_ID_ISSUER}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(
                `${FORGE_ID_CLIENT_ID}:${FORGE_ID_SECRET}`,
            )}`,
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:8080/accounts/complete/epita/",
        }),
    });

    if (!tokres.ok) {
        throw error(tokres.status, "Failed to fetch token");
    }

    const { access_token: accessToken } = (await tokres.json()) as {
        access_token: string;
    };

    const res = await fetch(`${FORGE_ID_ISSUER}/userinfo`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw error(res.status, "Failed to fetch user info");
    }

    const profile = (await res.json()) as Profile;
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

    cookies.set("session", btoa(session.id), {
        path: "/",
        httpOnly: true,
        maxAge: session.expiresAt.getTime() - Date.now(),
    });

    const redirection = cookies.get("redirect");
    cookies.delete("redirect", { path: "/" });
    throw redirect(302, redirection || "/");
};
