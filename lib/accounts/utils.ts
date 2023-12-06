import type { Profile, Role, Session } from "@prisma/client";
import type { ClientSession } from ".";

export function getSessionCookie(request: any): string | undefined {
    let session = request.headers.cookie
        .split(";")
        .find((c: string) => c.trim().startsWith("session="));

    session = session?.split("=")[1];

    return atob(session);
}

export function isLoggedIn(session: ClientSession): boolean {
    return (
        session !== undefined && (session as Session).accessToken !== undefined && (session.profile as Profile) !== undefined && (session.profile as Profile).isActive && !(session.profile as Profile).isDeleted
    );
}

export function hasRole(profile: ClientSession, role: Role): boolean {
    return (
        profile !== undefined &&
        (profile as Profile).roles !== undefined &&
        (profile as Profile).roles.includes(role) &&
        (profile as Profile).isActive &&
        !(profile as Profile).isDeleted
    );
}
