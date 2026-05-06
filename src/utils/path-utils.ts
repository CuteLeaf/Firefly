/**
 * Normalize a path for use with import.meta.glob() keys.
 * Joins segments, normalizes separators, removes `.` segments and
 * collapses double slashes — without resolving `..` (glob keys keep
 * `../../` as-is).
 */
export function normalizeGlobPath(...segments: string[]): string {
	return segments
		.filter(Boolean)
		.join("/")
		.replace(/\\/g, "/")
		.replace(/\/\.\//g, "/")
		.replace(/\/\.$/, "")
		.replace(/\/+/g, "/");
}
