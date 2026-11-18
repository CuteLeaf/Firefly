import { defineConfig, devices } from "@playwright/test";

const port = 4336;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
	testDir: "src/components/features",
	testMatch: "CodeGroupManager.spec.ts",
	timeout: 60000,
	expect: { timeout: 10000 },
	workers: 1,
	retries: process.env.CI ? 1 : 0,
	use: { baseURL, trace: "retain-on-failure", ...devices["Desktop Chrome"] },
	webServer: {
		command: `pnpm preview --host 127.0.0.1 --port ${port}`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		// Run Astro in this process when an agent environment is detected.
		env: { ASTRO_PREVIEW_BACKGROUND: "1" },
	},
});
