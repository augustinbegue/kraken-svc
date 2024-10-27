import { prisma } from "../db/prisma";
import type { ClientSession } from "$lib/accounts";

export async function addReward(token: string): Promise<void> {
    if (!process.env.API_URL || !process.env.API_REWARD_ID) {
        throw new Error("API_URL and API_REWARD_ID must be set");
    }

    await fetch(new URL("/claim", process.env.API_URL), {
        method: "POST",
        headers: {
            cookie: `krakookie=${token}`
        },
        body: JSON.stringify({
            reward_id: process.env.API_REWARD_ID
        })
    })
}

export async function getUserSession(token: string): Promise<ClientSession | null> {
    if (!process.env.API_URL) {
        throw new Error("API_URL must be set");
    }

    const res = await fetch(new URL("/users/me", process.env.API_URL), {
        headers: {
            cookie: `krakookie=${token}`
        }
    })

    if (res.status === 401)
        return null;

    const { data }: {
        data: {
            id: string,
            email: string
        }
    } = await res.json()

    const session = {
        id: data.id,
        login: data.email.split('@')[0],
    };

    const profile = await prisma.profile.findFirst({
        where: {
            email: data.email
        }
    })
    if (!profile)
        await prisma.profile.create({
            data: {
                email: data.email,
                preferred_username: session.login
            }
        })

    return session;
}
