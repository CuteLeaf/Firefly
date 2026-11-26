import { expect, test } from "@playwright/test";

const article = "/e2e/code-groups/";

test("compact tabs maintain one keyboard stop and hide only inactive panels", async ({
	page,
}) => {
	await page.goto(article);
	const group = page.locator(".rehype-code-group").first();
	const tabs = group.getByRole("tab");
	await expect(tabs).toHaveCount(3);
	await expect(group).toHaveAttribute("data-rcg-enhanced", "");
	await expect(tabs.nth(2)).toHaveAttribute("tabindex", "-1");
	await tabs.first().focus();
	await page.keyboard.press("ArrowRight");
	await expect(tabs.nth(1)).toBeFocused();
	await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
	await expect(tabs.first()).toHaveAttribute("tabindex", "-1");
	await expect(tabs.nth(1)).toHaveAttribute("tabindex", "0");
	await expect(tabs.nth(2)).toHaveAttribute("tabindex", "-1");
	await expect(group.getByRole("tabpanel")).toHaveCount(1);
	await page.keyboard.press("End");
	await expect(tabs.last()).toBeFocused();
	await page.keyboard.press("Home");
	await expect(tabs.first()).toBeFocused();
});

test("rich tabs keep explanatory text and highlighted code in the same panel", async ({
	page,
}) => {
	await page.goto(article);
	const group = page.locator(".rehype-code-group").filter({
		has: page.getByRole("tablist", {
			name: "Installation choices",
			exact: true,
		}),
	});
	await expect(group).toHaveAttribute("data-rcg-enhanced", "");
	const panels = group.locator(":scope > .rcg-block");
	await expect(panels).toHaveCount(2);
	await expect(panels.first().locator(".expressive-code")).toHaveCount(1);
	await expect(panels.first().locator("p")).toHaveCount(2);
	await group.getByRole("tab", { name: "pnpm", exact: true }).click();
	await expect(panels.first()).toBeHidden();
	await expect(panels.last()).toBeVisible();
	await expect(panels.last().locator("li")).toHaveCount(2);
	await expect(panels.last().locator(".expressive-code")).toHaveCount(1);
});

test("fence labels resolve emoji and npm2yarn generates four highlighted commands", async ({
	page,
}) => {
	await page.goto(article);
	const fenceGroup = page
		.locator(".rehype-code-group")
		.filter({
			has: page.getByRole("tab", { name: "\u{1f4e6} pnpm", exact: true }),
		})
		.last();
	await expect(fenceGroup.getByRole("tab")).toHaveCount(2);
	await fenceGroup
		.getByRole("tab", { name: "\u{1f4e6} pnpm", exact: true })
		.click();
	await expect(fenceGroup.getByRole("tabpanel")).toContainText(
		"pnpm add rehype-code-group",
	);
	const packages = page
		.locator(".rehype-code-group")
		.filter({ has: page.getByRole("tab", { name: "bun", exact: true }) });
	await expect(packages.getByRole("tab")).toHaveCount(4);
	await packages.getByRole("tab", { name: "bun", exact: true }).click();
	await expect(packages.getByRole("tabpanel")).toContainText(
		"bun add rehype-code-group",
	);
	await expect(
		packages.getByRole("tabpanel").locator(".expressive-code"),
	).toHaveCount(1);
});

test("sync and local persistence survive reload and Swup navigation", async ({
	page,
}) => {
	await page.goto(article);
	const groups = page.locator('[data-rcg-sync="firefly-package-manager"]');
	await expect(groups).toHaveCount(2);
	await groups.first().getByRole("tab", { name: "pnpm", exact: true }).click();
	for (const group of await groups.all())
		await expect(
			group.getByRole("tab", { name: "pnpm", exact: true }),
		).toHaveAttribute("aria-selected", "true");
	await page.reload();
	for (const group of await groups.all())
		await expect(
			group.getByRole("tab", { name: "pnpm", exact: true }),
		).toHaveAttribute("aria-selected", "true");
	await page.waitForFunction(() => Boolean(Reflect.get(window, "swup")));
	await page.evaluate(() => {
		Reflect.set(window, "__codeGroupNavigation", true);
		const link = document.createElement("a");
		link.href = "/about/";
		link.id = "code-group-navigation";
		link.textContent = "About";
		document.querySelector("main")?.append(link);
	});
	await page.locator("#code-group-navigation").click();
	await expect(page).toHaveURL(/\/about\/$/);
	await expect(page.locator("#code-group-navigation")).toHaveCount(0);
	await page.evaluate(() => {
		const link = document.createElement("a");
		link.href = "/e2e/code-groups/";
		link.id = "code-group-return";
		link.textContent = "Code group fixture";
		document.querySelector("main")?.append(link);
	});
	await page.locator("#code-group-return").click();
	await expect(page).toHaveURL(/\/e2e\/code-groups\/$/);
	expect(
		await page.evaluate(() => Reflect.get(window, "__codeGroupNavigation")),
	).toBe(true);
	for (const group of await groups.all())
		await expect(
			group.getByRole("tab", { name: "pnpm", exact: true }),
		).toHaveAttribute("aria-selected", "true");
	await groups.first().getByRole("tab", { name: "npm", exact: true }).click();
	for (const group of await groups.all())
		await expect(
			group.getByRole("tab", { name: "npm", exact: true }),
		).toHaveAttribute("aria-selected", "true");
});

test("vertical tabs fit narrow screens and keep vertical keyboard navigation", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(article);
	const group = page.locator('[data-rcg-orientation="vertical"]');
	const tabs = group.getByRole("tab");
	await expect(group).toHaveAttribute("data-rcg-enhanced", "");
	await tabs.first().focus();
	await page.keyboard.press("ArrowDown");
	await expect(tabs.last()).toBeFocused();
	expect(
		await group
			.locator(".rcg-tab-container")
			.evaluate((element) => getComputedStyle(element).flexDirection),
	).toBe("row");
	const box = await group.boundingBox();
	if (!box) throw new Error("Expected a visible vertical code group");
	expect(box.x + box.width).toBeLessThanOrEqual(390);
});

test("all code panels remain readable without JavaScript and in print", async ({
	browser,
	page,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const staticPage = await context.newPage();
	await staticPage.goto(article);
	const panels = staticPage.locator(".rehype-code-group .rcg-block");
	expect(await panels.count()).toBeGreaterThan(15);
	for (const panel of await panels.all()) await expect(panel).toBeVisible();
	await context.close();
	await page.goto(article);
	await expect(
		page.locator(".rehype-code-group[data-rcg-enhanced]").first(),
	).toBeVisible();
	await page.emulateMedia({ media: "print" });
	for (const panel of await page.locator(".rehype-code-group .rcg-block").all())
		await expect(panel).toBeVisible();
});

test("tabs follow Firefly's theme hue in light and dark mode", async ({
	page,
}) => {
	await page.goto(article);
	const group = page.locator(".rehype-code-group").first();
	await expect(group).toHaveAttribute("data-rcg-enhanced", "");
	for (const dark of [false, true]) {
		await page.evaluate((dark) => {
			document.documentElement.classList.toggle("dark", dark);
			document.documentElement.style.setProperty("--hue", "280");
		}, dark);
		await expect
			.poll(async () => {
				const colors = await group.evaluate((element) => {
					const tab = element.querySelector<HTMLElement>(
						'[aria-selected="true"]',
					);
					if (!tab) throw new Error("Missing selected tab");
					const probe = document.createElement("span");
					probe.style.color = "var(--primary)";
					element.append(probe);
					const expected = getComputedStyle(probe).color;
					probe.remove();
					return {
						expected,
						text: getComputedStyle(tab).color,
						underline: getComputedStyle(tab).borderBottomColor,
					};
				});
				return {
					text: colors.text === colors.expected,
					underline: colors.underline === colors.expected,
				};
			})
			.toEqual({ text: true, underline: true });
	}
});

test("horizontal arrow navigation follows RTL direction", async ({ page }) => {
	await page.goto(article);
	const group = page.locator(".rehype-code-group").first();
	await expect(group).toHaveAttribute("data-rcg-enhanced", "");
	await group.evaluate((element) => element.setAttribute("dir", "rtl"));
	const tabs = group.getByRole("tab");
	await tabs.first().focus();
	await page.keyboard.press("ArrowLeft");
	await expect(tabs.nth(1)).toBeFocused();
	await page.keyboard.press("ArrowRight");
	await expect(tabs.first()).toBeFocused();
});
