const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

/**
 * Derive deterministic bytes from a key and context string using HMAC-SHA256.
 */
async function deriveBytes(
	key: string,
	context: string,
	length: number,
): Promise<Uint8Array> {
	const enc = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		enc.encode(key),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(context));
	return new Uint8Array(sig).slice(0, length);
}

/**
 * Encrypt HTML content with AES-256-GCM using PBKDF2-derived key.
 * Salt and IV are deterministic (derived from password + slug) so the same
 * inputs always produce the same ciphertext — this makes sessionStorage
 * password caching work reliably across page reloads.
 *
 * Output format: base64(salt[16] + iv[12] + authTag[16] + ciphertext)
 */
export async function encryptContent(
	html: string,
	password: string,
	slug: string,
): Promise<string> {
	const salt = await deriveBytes(password, `salt:${slug}`, SALT_LENGTH);
	const iv = await deriveBytes(password, `iv:${slug}`, IV_LENGTH);

	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		enc.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const keyBits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt as unknown as BufferSource,
			iterations: PBKDF2_ITERATIONS,
			hash: "SHA-256",
		},
		keyMaterial,
		KEY_LENGTH * 8,
	);
	const key = await crypto.subtle.importKey(
		"raw",
		keyBits,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt"],
	);

	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv: iv as unknown as BufferSource, tagLength: 128 },
		key,
		enc.encode(html),
	);

	// encrypted contains ciphertext + authTag (16 bytes)
	const encArr = new Uint8Array(encrypted);
	const authTag = encArr.slice(encArr.length - 16);
	const ciphertext = encArr.slice(0, encArr.length - 16);

	const result = new Uint8Array(
		SALT_LENGTH + IV_LENGTH + 16 + ciphertext.length,
	);
	result.set(salt, 0);
	result.set(iv, SALT_LENGTH);
	result.set(authTag, SALT_LENGTH + IV_LENGTH);
	result.set(ciphertext, SALT_LENGTH + IV_LENGTH + 16);

	return btoa(String.fromCharCode(...result));
}
