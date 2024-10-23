import type { Session } from "@prisma/client";
import getStaticClient from "liste-kraken-sdk/dist/client/static";
import { claimReward } from "liste-kraken-sdk/dist/requests/rewards/claim";
import { prisma } from "../db/prisma";

export async function getSession(sessionId: string): Promise<Session | null> {
    return await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });
}

export async function addReward(id: string): Promise<void> {
    if (!process.env.API_URL || !process.env.API_TOKEN || !process.env.API_REWARD_ID) {
        throw new Error("API_URL, API_TOKEN and API_REWARD_ID must be set");
    }

    const client = getStaticClient(process.env.API_URL, process.env.API_TOKEN);

    // claimReward(client, process.env.API_REWARD_ID, id);
}
