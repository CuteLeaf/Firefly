import { visit } from "unist-util-visit";

/**
 * Custom Remark plugin for creating responsive image grids.
 *
 * It parses markdown blocks surrounded by `[grid]` and `[/grid]` tags and wraps
 * the contained images in a styled `div` container with a grid layout.
 * The column count is evaluated automatically based on the number of inserted images
 * inside the grid tags (up to 4 columns).
 *
 * Grids are processed not only at the document root but also inside nested block
 * containers (admonitions, blockquotes, lists, directives), so `[grid]` / `[/grid]`
 * blocks keep working when placed inside such containers.
 *
 * Example:
 * [grid]
 * ![image1](/url1)
 * ![image2](/url2)
 * [/grid]
 *
 * @returns {import('unified').Plugin}
 */

// Block containers that may hold block-level content such as a `[grid]` block.
// Admonitions appear as `containerDirective` (`:::note`) or `blockquote`
// (Python-style `!!!note`) nodes at this stage of the pipeline.
const BLOCK_CONTAINER_TYPES = new Set([
	"root",
	"blockquote",
	"containerDirective",
	"list",
	"listItem",
]);

/** Resolve the responsive column class for a grid with the given image count. */
function getGridColumnClass(imgCount) {
	const cols = imgCount || 2;
	if (cols === 1) return "md:grid-cols-1";
	if (cols === 2) return "md:grid-cols-2";
	if (cols === 3) return "md:grid-cols-3";
	return "md:grid-cols-4";
}

/** Count all images found inside the given nodes, recursively. */
function countImages(nodes) {
	let imgCount = 0;
	nodes.forEach((node) => {
		visit(node, "image", () => {
			imgCount++;
		});
	});
	return imgCount;
}

/** Wrap the given nodes into a grid `div` paragraph node. */
function buildGridNode(nodes) {
	return {
		type: "paragraph",
		data: {
			hName: "div",
			hProperties: {
				className: [
					"image-grid",
					"grid",
					"grid-cols-1",
					getGridColumnClass(countImages(nodes)),
					"gap-4",
					"my-4",
				],
			},
		},
		children: nodes,
	};
}

/**
 * Process `[grid]` / `[/grid]` blocks within a flat list of block children.
 * Returns a new children array with grids replaced by grid `div` nodes.
 */
function processGridBlocks(children) {
	const newChildren = [];
	let inGrid = false;
	let gridChildren = [];

	for (let i = 0; i < children.length; i++) {
		const node = children[i];

		// Check if paragraph contains [grid] or [/grid]
		if (node.type === "paragraph" && node.children.length > 0) {
			const first = node.children[0];
			const last = node.children[node.children.length - 1];

			let containsGridStart = false;
			let containsGridEnd = false;

			if (first.type === "text" && first.value.trim().startsWith("[grid]")) {
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
				const mdColClass = getGridColumnClass(cols);

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

				newChildren.push(buildGridNode(gridChildren));
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

	return newChildren;
}

export function remarkImageGrid() {
	return (tree) => {
		// Process grids inside nested block containers (admonitions, blockquotes,
		// lists, ...) as well as at the document root. Children are processed first
		// (depth-first) so inner grids are already wrapped when an outer container
		// scans its own children.
		const processContainer = (node) => {
			if (Array.isArray(node.children)) {
				for (const child of node.children) {
					processContainer(child);
				}
			}
			if (BLOCK_CONTAINER_TYPES.has(node.type)) {
				node.children = processGridBlocks(node.children);
			}
		};

		processContainer(tree);
	};
}
