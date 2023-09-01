import type { Email } from "./emailer";
import * as emailer from "./emailer";

export async function send(args: Email): Promise<string> {
    console.time("send");
    const id = await emailer.send(args);
    console.timeEnd("send");
    return id;
}
