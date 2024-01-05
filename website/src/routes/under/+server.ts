import { prisma } from "$lib/server/db/prisma";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const announcement = await prisma.announcement.findFirst();

    console.log(announcement);

    throw redirect(302, announcement?.link ?? "/404");
};
