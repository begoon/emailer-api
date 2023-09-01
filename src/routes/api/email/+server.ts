import { send } from "$lib/server/email";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const params = await request.json();
    return json({
        ...params,
        attachments: params.attachments?.length || 0,
        messageID: await send(params),
    });
}
