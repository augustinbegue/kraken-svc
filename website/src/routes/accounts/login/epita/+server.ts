import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals, cookies }) => {
    const url = new URL(`${env.FORGE_ID_ISSUER}/authorize`);
    url.searchParams.set("client_id", env.FORGE_ID_CLIENT_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile epita");
    url.searchParams.set("redirect_uri", env.FORGE_ID_REDIRECT_URI);
    url.searchParams.set("state", cookies.get("state") ?? "");

    throw redirect(302, url.toString());
};
