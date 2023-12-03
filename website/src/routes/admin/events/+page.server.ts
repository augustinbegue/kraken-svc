import { prisma } from "$lib/server/db/prisma";
import type { Event } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
    const events = await prisma.event.findMany({
        orderBy: {
            startTime: "desc",
        },
    });

    return {
        events
    }
};

export const actions: Actions = {
    upsert: async ({ request }) => {
        const body = (await request.formData())

        if (body.get("id")) {
            console.log(body);

            let res = await prisma.event.update({
                where: {
                    id: body.get("id") as string,
                },
                data: {
                    name: body.get("name") as string,
                    startTime: new Date(body.get("startTime") as string),
                    endTime: new Date(body.get("endTime") as string),
                    description: body.get("description") as string,
                    location: body.get("location") as string,
                }
            });

            console.log(res);
        }
        else {
            if (!body.get("name") || !body.get("startTime") || !body.get("endTime") || !body.get("description") || !body.get("location")) {
                return {
                    error: "Missing required fields",
                }
            } else {
                await prisma.event.create({
                    data: {
                        name: body.get("name") as string,
                        startTime: new Date(body.get("startTime") as string),
                        endTime: new Date(body.get("endTime") as string),
                        description: body.get("description") as string,
                        location: body.get("location") as string,
                    }
                });
            }
        }
    },
    delete: async ({ request }) => {
        const body = (await request.formData())

        if (body.get("id")) {
            await prisma.event.delete({
                where: {
                    id: body.get("id") as string,
                }
            });
        }
    }
} satisfies Actions;
