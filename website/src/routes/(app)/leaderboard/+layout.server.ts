import { isLoggedIn } from "$lib/accounts/utils";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getLeaderboard } from "$lib/server/leaderboard/api";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    const { session } = locals;

    if (!isLoggedIn(session)) {
        cookies.set("redirect", "/place", {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        throw redirect(302, "/accounts/login/epita");
    }
};
