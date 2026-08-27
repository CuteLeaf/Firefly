/**
 * 触摸设备上的代码块复制按钮显形（从 MainGridLayout.astro 迁出）。
 * 委托到 document，swup 换页后无需重新绑定。
 */
export function initTouchCodeCopyReveal(): void {
	const CLASS = "ff-copy-revealed";

	document.addEventListener("click", (event) => {
		// 有 hover 能力的设备走 CSS 的悬停显形逻辑，不需要打标记。
		// 放在处理函数里判断，混合输入设备切换输入方式后也能跟上
		if (window.matchMedia("(hover: hover)").matches) return;

		const target = event.target as Element | null;
		if (!target?.closest) return;

		const frame = target.closest(".expressive-code .frame");

		// 点到别处就收起之前展开的按钮
		document.querySelectorAll(`.${CLASS}`).forEach((revealed) => {
			if (revealed !== frame) revealed.classList.remove(CLASS);
		});

		// 点在复制按钮上时说明它已经显形，交给原生逻辑处理即可
		if (frame && !target.closest(".copy")) frame.classList.add(CLASS);
	});
}
