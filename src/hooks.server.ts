import { env } from "$env/dynamic/private";
import { error, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const { request, cookies, locals } = event;

    const url = new URL(request.url);
    const user = cookies.get("teapot") || request.headers.get("teapot");
    console.log("REQUEST", url.pathname, user || "(*)");

    if (user !== env.TEAPOT) {
        throw error(418);
    }

    const started = performance.now();

    const response = await resolve(event);

    const elapsed = performance.now() - started;
    console.log("RESPONSE", response.status, "-", elapsed.toFixed(2), "ms");
    return response;
};

console.log("application started");
