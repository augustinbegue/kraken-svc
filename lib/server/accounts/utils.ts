import type { Session } from "@prisma/client";
import { prisma } from "../db/prisma";

export async function getSession(sessionId: string): Promise<Session | null> {
    return await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });
}
