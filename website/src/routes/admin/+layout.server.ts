import { hasRole, isLoggedIn } from "$lib/accounts/utils";
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { PUBLIC_LOGIN_URL } from '$env/static/public';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    if (!(await isLoggedIn(locals.session))) {
        cookies.set("redirect",
            "/admin",
            { path: "/", httpOnly: false, sameSite: "lax" }
        );

        throw redirect(302, PUBLIC_LOGIN_URL);
    }
    if (!hasRole(locals.session, "STAFF")) {
        throw error(403, "You are not allowed to access this page.");
    }
};
