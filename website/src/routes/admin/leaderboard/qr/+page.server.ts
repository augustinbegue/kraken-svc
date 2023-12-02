import { getActivities, getCategories } from "$lib/server/leaderboard/api";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    const categories = await getCategories();
    const activities = await getActivities();

    return {
        categories,
        activities
    }
}
