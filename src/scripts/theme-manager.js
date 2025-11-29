// 主题管理脚本
export function initThemeManager() {
	const _DEFAULT_THEME = "LIGHT_MODE";
	const LIGHT_MODE = "LIGHT_MODE";
	const DARK_MODE = "DARK_MODE";
	const SYSTEM_MODE = "SYSTEM_MODE";
	const BANNER_HEIGHT_EXTEND = 30;
	const _PAGE_WIDTH = 80;
	const configHue = 200; // 从配置中获取
	const defaultMode = "system"; // 从配置中获取

	// Load the theme from local storage, use defaultMode from config if not set
	const theme = localStorage.getItem("theme") || defaultMode;

	// Helper function to get system preference
	function getSystemPreference() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? DARK_MODE
			: LIGHT_MODE;
	}

	// Resolve theme (convert system to actual theme)
	function resolveTheme(themeValue) {
		if (themeValue === SYSTEM_MODE) {
			return getSystemPreference();
		}
		return themeValue;
	}

	const resolvedTheme = resolveTheme(theme);
	let isDark = false;

	switch (resolvedTheme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			isDark = false;
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			isDark = true;
			break;
	}

	// Setup system theme change listener if using system mode
	if (theme === SYSTEM_MODE) {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = (e) => {
			const currentStoredTheme = localStorage.getItem("theme");
			if (currentStoredTheme === SYSTEM_MODE) {
				const newTheme = e.matches ? DARK_MODE : LIGHT_MODE;
				const newIsDark = newTheme === DARK_MODE;

				if (newIsDark) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}

				const expressiveTheme = newIsDark ? "github-dark" : "github-light";
				document.documentElement.setAttribute("data-theme", expressiveTheme);
			}
		};

		// Add listener for system theme changes
		mediaQuery.addListener(handleSystemThemeChange);
	}

	// Set the theme for Expressive Code based on current mode
	const expressiveTheme = isDark ? "github-dark" : "github-light";
	document.documentElement.setAttribute("data-theme", expressiveTheme);

	// 确保主题正确应用 - 解决代码块渲染问题
	// 使用 requestAnimationFrame 确保在下一帧检查主题状态
	requestAnimationFrame(() => {
		const currentTheme = document.documentElement.getAttribute("data-theme");
		if (currentTheme !== expressiveTheme) {
			document.documentElement.setAttribute("data-theme", expressiveTheme);
		}
	});

	// Load the hue from local storage
	const hue = localStorage.getItem("hue") || configHue;
	document.documentElement.style.setProperty("--hue", hue);

	// calculate the --banner-height-extend, which needs to be a multiple of 4 to avoid blurry text
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset = offset - (offset % 4);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset}px`,
	);
}
