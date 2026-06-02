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
		const files = fs.readdirSync(target).filter((f) => /\.(m4a|mp3)$/i.test(f));
		if (!files.length) {
			console.error("  No .m4a/.mp3 files found in directory.");
			return;
		}
		for (const file of files) {
			const fp = path.join(target, file);
			extractLrc(fp);
			extractCover(fp);
		}
	} else if (stat.isFile()) {
		extractLrc(target);
		extractCover(target);
	}
}

function isM4A(buffer) {
	return (
		buffer.length > 8 &&
		buffer.slice(4, 8).toString("ascii") === "ftyp"
	);
}

function isMP3(buffer) {
	return buffer.length > 3 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

function extractLrc(filePath) {
	const buffer = fs.readFileSync(filePath);
	let lyrics = null;

	if (isM4A(buffer)) {
		lyrics = parseM4aLyrics(buffer);
	} else if (isMP3(buffer)) {
		lyrics = parseMp3Lyrics(buffer);
	}

	if (lyrics) {
		const outPath = filePath.replace(/\.(m4a|mp3)$/i, ".lrc");
		fs.writeFileSync(outPath, lyrics, "utf-8");
		console.log(`  Lyrics: ${path.basename(outPath)}`);
	} else {
		console.log(`  No lyrics found: ${path.basename(filePath)}`);
	}
}

function extractCover(filePath) {
	const buffer = fs.readFileSync(filePath);
	let cover = null;

	if (isM4A(buffer)) {
		cover = parseM4aCover(buffer);
	} else if (isMP3(buffer)) {
		cover = parseMp3Cover(buffer);
	}

	if (!cover) {
		console.log(`  No cover found: ${path.basename(filePath)}`);
		return;
	}

	const outPath = filePath.replace(/\.(m4a|mp3)$/i, `.${cover.ext}`);
	if (fs.existsSync(outPath)) {
		console.log(`  Cover skipped (exists): ${path.basename(outPath)}`);
		return;
	}

	fs.writeFileSync(outPath, cover.data);
	console.log(`  Cover: ${path.basename(outPath)}`);
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

/**
 * Parse MP4 container to find cover image in udta > ilst > covr.
 * Returns { data: Buffer, ext: "jpg"|"png" } or null.
 */
function parseM4aCover(buffer) {
	const udta = findAtom(buffer, 0, buffer.length, "udta");
	if (!udta) return null;

	const ilst = findAtom(buffer, udta.offset, udta.size, "ilst");
	if (!ilst) return null;

	const covr = findAtom(buffer, ilst.offset, ilst.size, "covr");
	if (!covr) return null;

	const data = buffer.slice(covr.offset, covr.offset + covr.size);
	if (data.length < 4) return null;

	// Detect format by magic bytes
	const isJpeg = data[0] === 0xff && data[1] === 0xd8;
	const isPng = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;

	if (!isJpeg && !isPng) return null;

	return { data, ext: isJpeg ? "jpg" : "png" };
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

/**
 * Parse ID3v2 tags from MP3 file.
 * Returns { frames: Map<id, {data: Buffer}> }
 */
function parseId3v2(buffer) {
	if (buffer.length < 10) return null;
	const header = buffer.slice(0, 10);
	if (header.toString("ascii", 0, 3) !== "ID3") return null;

	const version = header[3];
	const size = (header[6] << 21) | (header[7] << 14) | (header[8] << 7) | header[9];
	const offset = 10;
	const end = offset + size;

	if (version === 4) {
		// ID3v2.4 uses synchsafe integers for frame sizes
		return parseId3v2Frames(buffer, offset, end, true);
	}
	return parseId3v2Frames(buffer, offset, end, false);
}

function parseId3v2Frames(buffer, start, end, synchsafe) {
	const frames = new Map();
	let offset = start;

	while (offset + 10 <= end) {
		const frameId = buffer.slice(offset, offset + 4).toString("ascii");
		if (frameId[0] === "\0") break;

		let frameSize;
		if (synchsafe) {
			frameSize =
				(buffer[offset + 4] << 21) |
				(buffer[offset + 5] << 14) |
				(buffer[offset + 6] << 7) |
				buffer[offset + 7];
		} else {
			frameSize = buffer.readUInt32BE(offset + 4);
		}

		if (frameSize <= 0 || offset + 10 + frameSize > end) break;

		const data = buffer.slice(offset + 10, offset + 10 + frameSize);
		frames.set(frameId, { data });
		offset += 10 + frameSize;
	}
	return frames;
}

/**
 * Extract lyrics from MP3 ID3v2 USLT frame.
 */
function parseMp3Lyrics(buffer) {
	const id3 = parseId3v2(buffer);
	if (!id3) return null;

	const uslt = id3.get("USLT");
	if (!uslt) return null;

	// USLT format: [encoding(1)][lang(3)][description(\0)][lyrics]
	const data = uslt.data;
	if (data.length < 4) return null;

	const encoding = data[0];
	if (encoding === 0) {
		// ISO-8859-1
		return data.slice(4).toString("latin1").replace(/\0/g, "");
	}
	if (encoding === 1) {
		// UTF-16 with BOM
		return data.slice(4).toString("utf16le").replace(/\0/g, "");
	}
	if (encoding === 3) {
		// UTF-8
		return data.slice(4).toString("utf-8").replace(/\0/g, "");
	}
	return data.slice(4).toString("utf-8").replace(/\0/g, "");
}

/**
 * Extract cover from MP3 ID3v2 APIC frame.
 * Returns { data: Buffer, ext: "jpg"|"png" } or null.
 */
function parseMp3Cover(buffer) {
	const id3 = parseId3v2(buffer);
	if (!id3) return null;

	const apic = id3.get("APIC");
	if (!apic) return null;

	const data = apic.data;
	if (data.length < 4) return null;

	// APIC format: [encoding(1)][mime(\0)][pictureType(1)][description(\0)][pictureData]
	let offset = 1; // skip encoding byte

	// Find end of MIME type (null-terminated)
	while (offset < data.length && data[offset] !== 0) offset++;
	offset++; // skip null terminator

	if (offset >= data.length) return null;
	offset++; // skip picture type

	// Find end of description (null-terminated)
	while (offset < data.length && data[offset] !== 0) offset++;
	offset++; // skip null terminator

	if (offset >= data.length) return null;

	const imageData = data.slice(offset);
	if (imageData.length < 4) return null;

	const isJpeg = imageData[0] === 0xff && imageData[1] === 0xd8;
	const isPng =
		imageData[0] === 0x89 &&
		imageData[1] === 0x50 &&
		imageData[2] === 0x4e &&
		imageData[3] === 0x47;

	if (!isJpeg && !isPng) return null;

	return { data: imageData, ext: isJpeg ? "jpg" : "png" };
}
