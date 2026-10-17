/* Admin-only publishing safeguard. Loaded only from /admin/index.html. */
(() => {
  const publishLabels = /^(publish|publish now|publish changes|publish entry|发布|立即发布|确认发布)$/i;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest('button, [role="button"], input[type="submit"]');
      if (!button) return;

      const label = (
        button.getAttribute("aria-label") ||
        button.textContent ||
        button.getAttribute("value") ||
        ""
      ).replace(/\s+/g, " ").trim();

      if (!publishLabels.test(label)) return;

      const confirmed = window.confirm(
        "请再次确认：你准备将这篇文章提交到发布审核流程吗？\n\n" +
        "启用审核流程后，这一步不会直接更新正式网站；请在后续审核/合并前再次检查文章内容。"
      );

      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    },
    true
  );
})();
