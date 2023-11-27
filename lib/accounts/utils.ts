import type { Session } from "@prisma/client";
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
        session !== undefined && (session as Session).accessToken !== undefined
    );
}
