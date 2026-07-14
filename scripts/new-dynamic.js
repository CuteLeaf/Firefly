/* Create a timestamped dynamic markdown file from command-line text. */

import fs from "node:fs";
import path from "node:path";

const content = process.argv.slice(2).join(" ").trim();

if (!content) {
	console.error(
		"Error: No dynamic content provided\nUsage: pnpm new-dynamic <content>",
	);
	process.exit(1);
}

const now = new Date();
const pad = (value) => String(value).padStart(2, "0");
const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const hours = pad(now.getHours());
const minutes = pad(now.getMinutes());
const seconds = pad(now.getSeconds());
const timezoneOffset = -now.getTimezoneOffset();
const timezoneSign = timezoneOffset >= 0 ? "+" : "-";
const timezoneHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
const timezoneMinutes = pad(Math.abs(timezoneOffset) % 60);
const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`;
const fileName = `${year}-${month}-${day}-${hours}${minutes}${seconds}.md`;
const targetDir = path.resolve("src/content/dynamic");
const fullPath = path.join(targetDir, fileName);

fs.mkdirSync(targetDir, { recursive: true });

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists`);
	process.exit(1);
}

fs.writeFileSync(fullPath, `---\npublished: ${timestamp}\n---\n\n${content}\n`);

console.log(`Dynamic ${fullPath} created`);
