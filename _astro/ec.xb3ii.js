try{(()=>{function a(e){if(!e)return;let t=e.getAttribute("tabindex")!==null,r=e.scrollWidth>e.clientWidth;r&&!t?(e.setAttribute("tabindex","0"),e.setAttribute("role","region")):!r&&t&&(e.removeAttribute("tabindex"),e.removeAttribute("role"))}var u=window.requestIdleCallback||(e=>setTimeout(e,1)),s=window.cancelIdleCallback||clearTimeout;function l(e){let t=new Set,r,n;return new ResizeObserver(c=>{c.forEach(o=>t.add(o.target)),r&&clearTimeout(r),n&&s(n),r=setTimeout(()=>{n&&s(n),n=u(()=>{t.forEach(o=>e(o)),t.clear()})},250)})}function i(e,t){e.querySelectorAll?.(".expressive-code pre > code").forEach(r=>{let n=r.parentElement;n&&t.observe(n)})}var d=l(a);i(document,d);var b=new MutationObserver(e=>e.forEach(t=>t.addedNodes.forEach(r=>{i(r,d)})));b.observe(document.body,{childList:!0,subtree:!0});document.addEventListener("astro:page-load",()=>{i(document,d)});})();}catch(e){console.error("[EC] tabindex-js-module failed:",e)}
try{(()=>{function l(o){let e=document.createElement("pre");Object.assign(e.style,{opacity:"0",pointerEvents:"none",position:"absolute",overflow:"hidden",left:"0",top:"0",width:"20px",height:"20px",webkitUserSelect:"auto",userSelect:"all"}),e.ariaHidden="true",e.textContent=o,document.body.appendChild(e);let a=document.createRange();a.selectNode(e);let n=getSelection();if(!n)return!1;n.removeAllRanges(),n.addRange(a);let r=!1;try{r=document.execCommand("copy")}finally{n.removeAllRanges(),document.body.removeChild(e)}return r}async function u(o){let e=o.currentTarget,a=e.dataset,n=!1,r=a.code.replace(/\u007f/g,`
`);try{await navigator.clipboard.writeText(r),n=!0}catch{n=l(r)}if(!n||e.parentNode?.querySelector(".feedback"))return;let c=e.parentNode?.querySelector("[aria-live]"),t=document.createElement("div");t.classList.add("feedback"),t.append(a.copied),c.append(t),t.offsetWidth,requestAnimationFrame(()=>t?.classList.add("show"));let s=()=>!t||t.classList.remove("show"),d=()=>{!t||parseFloat(getComputedStyle(t).opacity)>0||(t.remove(),t=void 0)};setTimeout(s,1500),setTimeout(d,2500),e.addEventListener("blur",s),t.addEventListener("transitioncancel",d),t.addEventListener("transitionend",d)}function i(o){o.querySelectorAll?.(".expressive-code .copy button").forEach(e=>e.addEventListener("click",u))}i(document);var m=new MutationObserver(o=>o.forEach(e=>e.addedNodes.forEach(a=>{i(a)})));m.observe(document.body,{childList:!0,subtree:!0});document.addEventListener("astro:page-load",()=>{i(document)});})();}catch(e){console.error("[EC] copy-js-module failed:",e)}
(function() {
        'use strict';

        if (window.ecCollapsibleInit) return;
        window.ecCollapsibleInit = true;

        // Fallback values - will be overridden by dynamic calculation
        const FALLBACK_LINE_HEIGHT = 21.6; // 16 * 0.9 * 1.5
        const FALLBACK_PADDING = 56;

        // Create live region for screen reader announcements
        function getOrCreateLiveRegion() {
          let liveRegion = document.getElementById('ec-collapse-live-region');
          if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'ec-collapse-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
            document.body.appendChild(liveRegion);
          }
          return liveRegion;
        }

        function announceStateChange(frame, isExpanded) {
          const liveRegion = getOrCreateLiveRegion();
          // Use configurable announcement text from data attributes
          const expandedText = frame.dataset.expandedAnnouncement || 'Code block expanded';
          const collapsedText = frame.dataset.collapsedAnnouncement || 'Code block collapsed';
          liveRegion.textContent = isExpanded ? expandedText : collapsedText;
          // Clear after announcement to allow repeated announcements
          setTimeout(() => { liveRegion.textContent = ''; }, 1000);
        }

        function calcPreviewHeight(frame, previewLines) {
          // Try to dynamically calculate line height from the actual code element
          const codeElement = frame.querySelector('code');
          if (codeElement) {
            const computedStyle = window.getComputedStyle(codeElement);
            const lineHeight = parseFloat(computedStyle.lineHeight) || FALLBACK_LINE_HEIGHT;

            // Get padding from the pre element
            const preElement = frame.querySelector('pre');
            let padding = FALLBACK_PADDING;
            if (preElement) {
              const preStyle = window.getComputedStyle(preElement);
              padding = parseFloat(preStyle.paddingTop) + parseFloat(preStyle.paddingBottom);
            }

            return (previewLines * lineHeight) + padding;
          }

          // Fallback to hardcoded values
          return (previewLines * FALLBACK_LINE_HEIGHT) + FALLBACK_PADDING;
        }

        function toggleCollapse(frame, btn) {
          const isCollapsed = frame.classList.contains('ec-collapse--collapsed');
          const newState = isCollapsed ? 'expanded' : 'collapsed';

          if (isCollapsed) {
            frame.classList.remove('ec-collapse--collapsed');
            frame.classList.add('ec-collapse--expanded');
          } else {
            frame.classList.remove('ec-collapse--expanded');
            frame.classList.add('ec-collapse--collapsed');

            const rect = frame.getBoundingClientRect();
            if (rect.top < 0) {
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              frame.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'start' });
            }
          }

          // Update aria-expanded on ALL toggle buttons in this frame
          const allButtons = frame.querySelectorAll('.ec-collapse__toggle, .ec-collapse__header-toggle');
          allButtons.forEach(b => b.setAttribute('aria-expanded', newState === 'expanded' ? 'true' : 'false'));

          // Announce state change to screen readers
          announceStateChange(frame, newState === 'expanded');
        }

        function initCollapseButtons() {
          // Initialize both overlay and header toggle buttons
          document.querySelectorAll('.ec-collapse__toggle, .ec-collapse__header-toggle').forEach(btn => {
            if (btn.dataset.init) return;
            btn.dataset.init = 'true';

            const frame = btn.closest('.ec-collapse');
            if (!frame) return;

            // Set preview height (only needs to be done once per frame)
            if (!frame.dataset.heightInit) {
              frame.dataset.heightInit = 'true';
              const previewLines = parseInt(frame.dataset.collapsePreviewLines || '8', 10);
              frame.style.setProperty('--ec-collapse-preview-height', calcPreviewHeight(frame, previewLines) + 'px');
            }

            btn.addEventListener('click', (e) => {
              e.preventDefault();
              toggleCollapse(frame, btn);
            });
          });
        }

        // Debounce utility
        function debounce(fn, delay) {
          let timeoutId;
          return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
          };
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initCollapseButtons);
        } else {
          initCollapseButtons();
        }

        // Debounced MutationObserver to avoid excessive calls
        const debouncedInit = debounce(initCollapseButtons, 100);
        new MutationObserver(debouncedInit).observe(document.body, { childList: true, subtree: true });
      })();