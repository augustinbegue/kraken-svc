import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
    cookies.delete("session", { path: "/" });
    cookies.delete("state", { path: "/" });

    throw redirect(302, "/");
};
