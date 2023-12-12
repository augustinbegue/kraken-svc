import { isLoggedIn } from "$lib/accounts/utils";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!isLoggedIn(locals.session)) {
        throw redirect(302, "/accounts/login/epita");
    }
};
