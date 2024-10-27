import type { Role, Session } from "@prisma/client";
import type { ClientSession } from ".";
import { PUBLIC_API_URL } from '$env/static/public';

export async function isLoggedIn(session: ClientSession): Promise<boolean> {
    return session !== undefined && (session as Session).login !== undefined;
}

export function hasRole(profile: ClientSession, role: Role): boolean {
    return profile.login === "augustin.begue";
}

export async function getUserSession(token: string): Promise<ClientSession | null> {
    const res = await fetch(new URL("/users/me", PUBLIC_API_URL), {
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

    return {
        id: data.id,
        login: data.email.split('@')[0]
    }
}
