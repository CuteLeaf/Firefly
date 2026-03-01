import { visit } from "unist-util-visit";

/**
 * Custom Remark plugin for creating responsive image grids.
 *
 * It parses markdown blocks surrounded by `[grid]` and `[/grid]` tags and wraps
 * the contained images in a styled `div` container with a grid layout.
 * The column count is evaluated automatically based on the number of inserted images
 * inside the grid tags (up to 4 columns).
 *
 * Example:
 * [grid]
 * ![image1](/url1)
 * ![image2](/url2)
 * [/grid]
 *
 * @returns {import('unified').Plugin}
 */

export function remarkImageGrid() {
	return (tree) => {
		// 1. Process block-level [grid] and [/grid]
		if (tree.type === "root") {
			const newChildren = [];
			let inGrid = false;
			let gridChildren = [];

			for (let i = 0; i < tree.children.length; i++) {
				const node = tree.children[i];

				// Check if paragraph contains [grid] or [/grid]
				if (node.type === "paragraph" && node.children.length > 0) {
					const first = node.children[0];
					const last = node.children[node.children.length - 1];

					let containsGridStart = false;
					let containsGridEnd = false;

					if (
						first.type === "text" &&
						first.value.trim().startsWith("[grid]")
					) {
						containsGridStart = true;
					}
					if (last.type === "text" && last.value.trim().endsWith("[/grid]")) {
						containsGridEnd = true;
					}

					// Case 1: [grid] and [/grid] in the SAME paragraph
					if (containsGridStart && containsGridEnd && !inGrid) {
						first.value = first.value.replace(/^\s*\[grid\]\s*/, "");
						last.value = last.value.replace(/\s*\[\/grid\]\s*$/, "");

						// count images in the grid
						const imgCount = node.children.filter(
							(n) =>
								n.type === "image" ||
								(n.type === "link" &&
									n.children &&
									n.children.some((c) => c.type === "image")),
						).length;
						const cols = imgCount || 2;
						const mdColClass =
							cols === 1
								? "md:grid-cols-1"
								: cols === 2
									? "md:grid-cols-2"
									: cols === 3
										? "md:grid-cols-3"
										: "md:grid-cols-4";

						newChildren.push({
							type: "paragraph",
							data: {
								hName: "div",
								hProperties: {
									className: [
										"image-grid",
										"grid",
										"grid-cols-1",
										mdColClass,
										"gap-4",
										"my-4",
									],
								},
							},
							children: node.children.filter(
								(n) => n.type !== "text" || n.value.trim() !== "",
							), // Remove empty text nodes left over
						});
						continue;
					}

					// Case 2: Multi-paragraph
					if (!inGrid && containsGridStart) {
						inGrid = true;
						first.value = first.value.replace(/^\s*\[grid\]\s*/, "");
						if (node.children.length === 1 && first.value.trim() === "") {
							// [grid] stood alone, ignore this node
						} else {
							gridChildren.push(node);
						}
						continue;
					}

					if (inGrid && containsGridEnd) {
						inGrid = false;
						last.value = last.value.replace(/\s*\[\/grid\]\s*$/, "");
						if (node.children.length === 1 && last.value.trim() === "") {
							// [/grid] stood alone
						} else {
							gridChildren.push(node);
						}

						// Count images across all children in gridChildren
						let imgCount = 0;
						gridChildren.forEach((child) => {
							visit(child, "image", () => {
								imgCount++;
							});
						});
						const cols = imgCount || 2;
						const mdColClass =
							cols === 1
								? "md:grid-cols-1"
								: cols === 2
									? "md:grid-cols-2"
									: cols === 3
										? "md:grid-cols-3"
										: "md:grid-cols-4";

						newChildren.push({
							type: "paragraph",
							data: {
								hName: "div",
								hProperties: {
									className: [
										"image-grid",
										"grid",
										"grid-cols-1",
										mdColClass,
										"gap-4",
										"my-4",
									],
								},
							},
							children: gridChildren,
						});
						gridChildren = [];
						continue;
					}
				}

				if (inGrid) {
					gridChildren.push(node);
				} else {
					newChildren.push(node);
				}
			}

			// If unclosed, just append them
			if (inGrid) {
				newChildren.push(...gridChildren);
			}

			tree.children = newChildren;
		}
	};
}
