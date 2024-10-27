import type { Role, Session } from "@prisma/client";
import type { ClientSession } from ".";
import { PUBLIC_API_URL } from '$env/static/public';

export async function isLoggedIn(session: ClientSession): Promise<boolean> {
    return session !== undefined && (session as Session).login !== undefined;
}

export function hasRole(profile: ClientSession, role: Role): boolean {
    return profile.login === "augustin.begue";
}
