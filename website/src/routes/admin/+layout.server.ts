import { hasRole, isLoggedIn } from "$lib/accounts/utils";
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw redirect(300, "/accounts/login/epita");
    }

    if (!hasRole(locals.session.profile, "STAFF")) {
        throw error(403, "You are not allowed to access this page.");
    }
}
