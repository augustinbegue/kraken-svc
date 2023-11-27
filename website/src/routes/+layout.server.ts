import { isLoggedIn } from "$lib/accounts/utils";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (isLoggedIn(locals.session)) {
        return {
            profile: locals.session.profile,
        };
    }

    return {
        profile: undefined,
    };
};
