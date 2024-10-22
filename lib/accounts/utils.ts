import type { Profile, Role, Session } from "@prisma/client";
import type { ClientSession } from ".";

export async function isLoggedIn(session: ClientSession): boolean {
}

export function hasRole(profile: ClientSession, role: Role): boolean {
    // return (
    //     profile !== undefined &&
    //     (profile as Profile).roles !== undefined &&
    //     (profile as Profile).roles.includes(role) &&
    //     (profile as Profile).isActive &&
    //     !(profile as Profile).isDeleted
    // );
    return false;
}

export async function getUserSession(id: string): ClientSession {
}

export async function addReward(login: string): void {
}
