export interface ComponentConfig {
    id: string;
    showOnPostPage: boolean;
}

export interface SidebarConfig {
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    shouldShowSidebar: {
        mobile: boolean;
        tablet: boolean;
        desktop: boolean;
    };
}

export function toggleSidebarComponents(sidebarId: string, config: ComponentConfig[]) {
    const isPostPage = window.location.pathname.includes("/posts/");
    const sidebar = document.getElementById(sidebarId);
    if (!sidebar) return;

    // First try to find generic sidebar-widget wrappers
    const widgets = sidebar.querySelectorAll('.sidebar-widget');
    
    // Fallback for legacy/direct query (if wrappers are not used everywhere yet)
    // or if we decide not to wrap standard widgets? 
    // Actually, let's just support both or prioritize the wrapper.
    // If we wrap everything in SideBar.astro, we only need .sidebar-widget.
    
    widgets.forEach((widget) => {
        const widgetId = widget.getAttribute('data-id');
        const componentConfig = config.find(c => c.id === widgetId);

        if (componentConfig) {
            // Special handling: Sidebar TOC only shows on post page
            if (widgetId === 'sidebar-toc') {
                (widget as HTMLElement).style.display = isPostPage ? '' : 'none';
            }
            // Other components showOnPostPage setting:
            // true: Show on both post and non-post pages (default)
            // false: Hide on post pages, show on non-post pages
            else if (isPostPage && !componentConfig.showOnPostPage) {
                (widget as HTMLElement).style.display = 'none';
            } else {
                (widget as HTMLElement).style.display = '';
            }
        }
    });
}

function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export class SidebarManager {
    private element: HTMLElement;
    private config: SidebarConfig = {
        breakpoints: { mobile: 0, tablet: 0, desktop: 0 },
        shouldShowSidebar: { mobile: false, tablet: false, desktop: false }
    };
    private readonly _resizeHandler: () => void;

    constructor(element: HTMLElement) {
        this.element = element;
        // Bind and debounce the resize handler
        this._resizeHandler = debounce(() => this.updateResponsiveDisplay(), 100);
        this.init();
    }

    private init() {
        // Read config from DOM
        try {
            const configStr = this.element.dataset.sidebarConfig;
            if (configStr) {
                this.config = JSON.parse(configStr);
            }
        } catch (e) {
            console.error("Failed to parse sidebar config", e);
        }

        // Initial check
        this.refresh();

        // Add resize listener
        window.addEventListener("resize", this._resizeHandler);
    }

    public refresh() {
        this.updateResponsiveDisplay();
        this.checkVisibility();
    }

    private checkVisibility() {
        try {
            const configStr = this.element.dataset.componentsConfig;
            if (configStr) {
                const config = JSON.parse(configStr);
                toggleSidebarComponents(this.element.id, config);
            }
        } catch (e) {
            console.error("Failed to parse components config", e);
        }
    }

    private updateResponsiveDisplay() {
        if (!this.config || !this.config.breakpoints) return;

        const breakpoints = this.config.breakpoints;
        const width = window.innerWidth;

        let deviceType: "mobile" | "tablet" | "desktop";
        if (width < breakpoints.mobile) {
            deviceType = "mobile";
        } else if (width < breakpoints.tablet) {
            deviceType = "tablet";
        } else {
            deviceType = "desktop";
        }

        const shouldShow = this.config.shouldShowSidebar[deviceType];

        this.element.style.setProperty(
            `--sidebar-${deviceType}-display`,
            shouldShow ? "block" : "none"
        );
    }

    public destroy() {
        window.removeEventListener("resize", this._resizeHandler);
    }
}

export function initSidebars() {
    const sidebars = document.querySelectorAll('.sidebar-instance');
    sidebars.forEach((sidebar) => {
        const element = sidebar as HTMLElement & { _sidebarManager?: SidebarManager };
        if (!element._sidebarManager) {
            element._sidebarManager = new SidebarManager(element);
        } else {
            element._sidebarManager.refresh();
        }
    });
}
