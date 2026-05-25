/**
 * Parse CLI arguments into command, positional args, and flags.
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {{ command: string|null, args: string, positional: string[], flags: Map<string, string|true> }}
 */
export function parseArgs(argv) {
	const command = argv[0] || null;
	const rest = argv.slice(1);
	const flags = new Map();
	const positional = [];

	for (const token of rest) {
		if (token.startsWith("--")) {
			const eqIdx = token.indexOf("=");
			if (eqIdx !== -1) {
				flags.set(token.slice(2, eqIdx), token.slice(eqIdx + 1));
			} else {
				flags.set(token.slice(2), true);
			}
		} else if (token.startsWith("-") && token.length === 2) {
			flags.set(token.slice(1), true);
		} else {
			positional.push(token);
		}
	}

	return {
		command,
		args: positional.join(" "),
		positional,
		flags,
	};
}
