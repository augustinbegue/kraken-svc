import { createActivity, createCategory, getActivities, getCategories } from "$lib/server/leaderboard/api";
import type { Action, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {
    const categories = await getCategories();
    const activities = await getActivities();

    return {
        categories,
        activities
    }
}

export const actions: Action = {
    category: async ({ request }) => {
        const body = await request.formData();

        if (!body.has("name")) {
            return { success: false, error: "Missing field" };
        }

        const name = body.get("name") as string;
        const id = parseInt(body.get("id")) as number;

        try {
            let res: any;
            if (id !== -1) {
                // update
            } else {
                res = await createCategory(name);
            }

            return { success: true, data: res };
        } catch (error) {
            return { success: false, error };
        }

    },
    activity: async ({ request }) => {
        const body = await request.formData();

        if (!body.has("name") || !body.has("category") || !body.has("points")) {
            return { success: false, error: "Missing field" };
        }

        const name = body.get("name") as string;
        const category = parseInt(body.get("category") as string);
        const points = parseInt(body.get("points") as string);
        const id = parseInt(body.get("id") as string);

        try {
            let res: any;
            if (id !== -1) {
                // update
            } else {
                res = await createActivity(name, category, points);
            }

            return { success: true, data: res };
        } catch (error) {
            return { success: false, error };
        }
    },
} satisfies Action;
