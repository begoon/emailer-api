import { send } from "$lib/server/email";
import type { Email } from "$lib/server/emailer";
import { json } from "@sveltejs/kit";

export async function GET({ params, url }): Promise<Response> {
    const prefix = new URLSearchParams(url.search).get("prefix");
    const email: Email = { ...params };
    if (prefix) email.prefix = prefix;
    return json({ ...params, messageID: await send(email) });
}
