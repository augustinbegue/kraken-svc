import { FORGE_ID_CLIENT_ID, FORGE_ID_ISSUER } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals, cookies }) => {
    const url = new URL(`${FORGE_ID_ISSUER}/authorize`);
    url.searchParams.set("client_id", FORGE_ID_CLIENT_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile epita");
    url.searchParams.set(
        "redirect_uri",
        "http://localhost:8080/accounts/complete/epita/",
    );
    url.searchParams.set("state", cookies.get("state") ?? "");

    throw redirect(302, url.toString());
};
