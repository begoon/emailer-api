import fs from "node:fs";
import process from "node:process";

import dotenv from "dotenv";

dotenv.config();

const argv = process.argv;
console.log("argv", argv.slice(2));

const env = process.env;

const contentTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    json: "application/json",
};

const [to, subject, text, ...files] = argv.slice(2);
const email = {
    to,
    subject,
    text,
    attachments: files.map((filename) => ({
        filename,
        contentType:
            contentTypes[filename.split(".").slice(-1)[0]] ||
            "application/octet-stream",
        encoding: "base64",
        content: fs.readFileSync(filename).toString("base64"),
    })),
};

console.log(
    JSON.stringify(
        email,
        (k, v) => (k === "content" ? v.slice(0, 100) + "..." : v),
        2
    )
);

const mode = env.MODE === "POST" ? "POST" : "GET";

const EMAILER_API = env.EMAILER_API || "http://localhost:5173/api/email";
const headers = { teapot: env.TEAPOT || "?" };

let result;
if (mode === "POST") {
    result = await fetch(EMAILER_API, {
        method: "POST",
        headers,
        body: JSON.stringify(email),
    });
} else {
    email.text += " " + JSON.stringify(files);
    const url = `${EMAILER_API}/${email.to}/${email.subject}/${email.text}`;
    console.log("GET", url);
    result = await fetch(url, { headers });
}

console.log(result.status);
