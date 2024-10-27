import type { ClientSession } from ".";
import { PUBLIC_API_URL } from '$env/static/public';

export async function isLoggedIn(session: ClientSession): Promise<boolean> {
    return session !== undefined && session.login !== undefined;
}

export function hasRole(profile: ClientSession, role: string): boolean {
    return profile.login === "augustin.begue";
}
