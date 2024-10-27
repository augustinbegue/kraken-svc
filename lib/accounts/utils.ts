import type { ClientSession } from ".";

export async function isLoggedIn(session: ClientSession): Promise<boolean> {
    return !!session && !!session.login;
}

export function hasRole(profile: ClientSession, role: string): boolean {
    return profile.login === "augustin.begue";
}
