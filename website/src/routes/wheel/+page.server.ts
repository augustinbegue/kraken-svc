import { hasRole, isLoggedIn } from "$lib/accounts/utils";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (!isLoggedIn(locals.session)) {
        throw redirect(300, "/accounts/login/epita");
    };

    if (!hasRole(locals.session.profile, "STAFF")) {
        throw error(403, "You are not allowed to access this page.");
    }
}
