import fs from "node:fs";
import path from "node:path";

export default async function lrc(args, _flags) {
	if (!args) {
		console.error("Usage: pnpm cli lrc <path-to-m4a-or-directory>");
		return;
	}

	const target = path.resolve(args);

	if (!fs.existsSync(target)) {
		console.error(`  Path not found: ${target}`);
		return;
	}

	const stat = fs.statSync(target);

	if (stat.isDirectory()) {
		const files = fs.readdirSync(target).filter((f) => /\.m4a$/i.test(f));
		if (!files.length) {
			console.error("  No .m4a files found in directory.");
			return;
		}
		for (const file of files) {
			extractLrc(path.join(target, file));
		}
	} else if (stat.isFile()) {
		extractLrc(target);
	}
}

function extractLrc(filePath) {
	const buffer = fs.readFileSync(filePath);
	const lyrics = parseM4aLyrics(buffer);

	if (lyrics) {
		const outPath = filePath.replace(/\.m4a$/i, ".lrc");
		fs.writeFileSync(outPath, lyrics, "utf-8");
		console.log(`  Extracted: ${path.basename(outPath)}`);
	} else {
		console.log(`  No lyrics found: ${path.basename(filePath)}`);
	}
}

/**
 * Parse MP4 container to find ©lyr atom in udta metadata.
 * MP4 atoms: [4-byte size][4-byte type][data...]
 */
function parseM4aLyrics(buffer) {
	const udta = findAtom(buffer, 0, buffer.length, "udta");
	if (!udta) return null;

	const lyr = findAtom(buffer, udta.offset, udta.size, "©lyr");
	if (!lyr) return null;

	return buffer.slice(lyr.offset, lyr.offset + lyr.size).toString("utf-8").replace(/\0/g, "");
}

function findAtom(buffer, start, length, target) {
	let offset = start;
	const end = start + length;
	const containers = ["moov", "udta", "meta", "ilst", "trak", "mdia", "minf", "stbl"];

	while (offset + 8 <= end) {
		const size = buffer.readUInt32BE(offset);
		const type = buffer.slice(offset + 4, offset + 8).toString("ascii");

		if (size === 0) break;
		if (size === 1) {
			if (offset + 16 > end) break;
			offset += size;
			continue;
		}

		if (type === target) {
			return { offset: offset + 8, size: size - 8 };
		}

		if (containers.includes(type)) {
			const headerSize = type === "meta" ? 12 : 8;
			const result = findAtom(buffer, offset + headerSize, size - headerSize, target);
			if (result) return result;
		}

		offset += size;
	}
	return null;
}
