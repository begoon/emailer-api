import { send } from "$lib/server/email";
import { json } from "@sveltejs/kit";

export async function GET({ params }): Promise<Response> {
    return json({ ...params, messageID: await send(params) });
}
