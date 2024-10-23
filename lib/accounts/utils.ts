import type { Profile, Role, Session } from "@prisma/client";
import type { ClientSession } from ".";
import getUserClient from "liste-kraken-sdk/dist/client/user";
import { getCurrentUser } from "liste-kraken-sdk/dist/requests/users/get";


export async function isLoggedIn(session: ClientSession): Promise<boolean> {
    return session !== undefined && (session as Session).login !== undefined;
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

export async function getUserSession(): Promise<ClientSession | null> {
    const client = getUserClient(import.meta.env.VITE_API_URL);
    const user = await getCurrentUser(client);

    if (!user) return null;

    return {
        id: user.id,
        login: user.email ?? ""
    };
}
