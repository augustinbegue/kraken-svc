import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    const wsUrl = env.WS_URL;

    return {
        wsUrl,
    };
}
