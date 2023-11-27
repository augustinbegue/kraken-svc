import { dev } from "$app/environment";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: dev ? ["query"] : undefined,
});
