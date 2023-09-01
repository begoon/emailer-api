import nodemailer from "nodemailer";

import { env } from "$env/dynamic/private";
import type { Attachment } from "nodemailer/lib/mailer";

export type Email = {
    from?: string;
    prefix?: string;
    to?: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Attachment[];
};

export async function send(email: Email): Promise<string> {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    });
    let from = env.FROM_EMAIL;
    if (email.prefix) {
        const [name, domain] = from.split("@");
        from = `${name}+${email.prefix}@${domain}`;
    }
    const parcel = {
        from,
        to: email.to || env.DEVELOPER_EMAIL,
        subject: email.subject,
        html: email.html || email.text,
        attachments: email.attachments,
    };
    console.log("send", {
        ...parcel,
        attachments: parcel.attachments?.map((a) => ({
            ...a,
            content: (<string>a.content).slice(0, 100) + "...",
        })),
    });
    const sent = await transporter.sendMail(parcel);
    console.log("sent", sent.messageId);
    transporter.close();
    return sent.messageId;
}
