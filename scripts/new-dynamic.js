/* Create a timestamped dynamic markdown file from command-line text. */

import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "../src/config/siteConfig.ts";

const content = process.argv.slice(2).join(" ").trim();

if (!content) {
	console.error(
		"Error: No dynamic content provided\nUsage: pnpm new-dynamic <content>",
	);
	process.exit(1);
}

const now = new Date();
const pad = (value) => String(value).padStart(2, "0");
const timezone = siteConfig.timezone || "Asia/Shanghai";
const dateParts = new Intl.DateTimeFormat("en-CA", {
	timeZone: timezone,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hourCycle: "h23",
})
	.formatToParts(now)
	.reduce((parts, part) => {
		if (part.type !== "literal") parts[part.type] = part.value;
		return parts;
	}, {});
const year = dateParts.year;
const month = dateParts.month;
const day = dateParts.day;
const hours = dateParts.hour;
const minutes = dateParts.minute;
const seconds = dateParts.second;
const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
