type DetectBuildPlatformOptions = {
	env: Record<string, string | undefined>;
	isCI: boolean;
	ciName?: string | null;
	isDev?: boolean;
	unknownBuildPlatform?: string;
};

const BUILD_PLATFORM_OVERRIDE_KEY = "FIREFLY_BUILD_PLATFORM";

function hasNonEmptyEnv(
	env: Record<string, string | undefined>,
	key: string,
): boolean {
	const value = env[key];
	return typeof value === "string" && value.trim() !== "";
}

function envUrlHostEquals(
	env: Record<string, string | undefined>,
	key: string,
	expectedHost: string,
): boolean {
	const value = env[key];
	if (typeof value !== "string" || value.trim() === "") {
		return false;
	}

	try {
		return new URL(value).host.toLowerCase() === expectedHost.toLowerCase();
	} catch {
		return false;
	}
}

export function detectBuildPlatform({
	env,
	isCI,
	ciName,
	isDev = false,
	unknownBuildPlatform = "Unknown CI",
}: DetectBuildPlatformOptions): string {
	const overrideValue = env[BUILD_PLATFORM_OVERRIDE_KEY];
	if (typeof overrideValue === "string" && overrideValue.trim() !== "") {
		return overrideValue.trim();
	}

	if (ciName?.trim()) {
		return ciName.trim();
	}

	if (hasNonEmptyEnv(env, "EDGEONE_PROJECT_ID")) {
		return "EdgeOne Pages";
	}

	if (envUrlHostEquals(env, "er_address", "build-script.esa.ialicdn.com")) {
		return "ESA Pages";
	}

	if (isCI) {
		return unknownBuildPlatform;
	}

	return isDev ? "Local Dev" : "Local";
}
