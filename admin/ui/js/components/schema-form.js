/**
 * 通用 Schema 驱动表单渲染器。
 * 支持：对象（可折叠分组）、对象数组（增删排序）、字符串数组（标签/列表）、
 * 枚举下拉、布尔开关、数字、url/email/date/datetime/color/textarea/markdown、
 * 自由 JSON 编辑器、string|string[] 联合（单值/多值切换）、x-if 条件显示。
 */

function clone(value) {
	if (value === undefined) return undefined;
	return JSON.parse(JSON.stringify(value));
}

function getIn(obj, path) {
	let cur = obj;
	for (const seg of path) {
		if (cur == null) return undefined;
		cur = cur[seg];
	}
	return cur;
}

function setIn(obj, path, value) {
	let cur = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const seg = path[i];
		const next = path[i + 1];
		if (cur[seg] == null || typeof cur[seg] !== "object") {
			cur[seg] = typeof next === "number" ? [] : {};
		}
		cur = cur[seg];
	}
	cur[path[path.length - 1]] = value;
}

/** 根据 Schema 生成空默认值 */
function defaultFromSchema(schema) {
	if (!schema) return "";
	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
	if (schema["x-editor"] === "json") return {};
	if (type === "object") {
		const out = {};
		for (const [key, child] of Object.entries(schema.properties ?? {})) {
			out[key] = defaultFromSchema(child);
		}
		return out;
	}
	if (type === "array") return [];
	if (type === "boolean") return false;
	if (type === "number" || type === "integer") return 0;
	if (type === "string") {
		if (Array.isArray(schema.enum) && schema.enum.length > 0)
			return schema.enum[0];
		return "";
	}
	return "";
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function createSchemaForm({ schema, value, root, onChange, depth = 0 }) {
	const state = clone(value ?? defaultFromSchema(schema));
	let dirty = false;

	const formEl = document.createElement("div");
	formEl.className = "schema-form";

	/* ── 字段渲染 ── */

	function fieldWrapper(schemaNode, path, control, extra = {}) {
		const wrapper = document.createElement("div");
		wrapper.className = "field";
		wrapper.dataset.path = JSON.stringify(path);
		if (extra.xif) {
			wrapper.dataset.xif = extra.xif;
			wrapper.dataset.xifEquals = JSON.stringify(extra.xifEquals ?? null);
		}
		wrapper.appendChild(control);
		if (schemaNode.description) {
			const hint = document.createElement("div");
			hint.className = "field-hint";
			hint.textContent = schemaNode.description;
			wrapper.appendChild(hint);
		}
		return wrapper;
	}

	function renderString(schemaNode, path) {
		const value = getIn(state, path);
		if (Array.isArray(schemaNode.enum) && schemaNode.enum.length > 0) {
			const select = document.createElement("select");
			for (let i = 0; i < schemaNode.enum.length; i++) {
				const opt = document.createElement("option");
				opt.value = schemaNode.enum[i];
				opt.textContent =
					schemaNode["x-enumLabels"]?.[i] ?? String(schemaNode.enum[i]);
				select.appendChild(opt);
			}
			select.value = value ?? "";
			return select;
		}
		const format = schemaNode["x-format"];
		if (format === "textarea" || format === "markdown") {
			const ta = document.createElement("textarea");
			ta.rows = format === "markdown" ? 8 : 3;
			if (format === "markdown") ta.classList.add("mono");
			ta.value = value ?? "";
			return ta;
		}
		if (format === "color") {
			// 非十六进制值（如 CSS 变量）时退化为文本框
			if (value && !HEX_RE.test(value)) {
				const input = document.createElement("input");
				input.type = "text";
				input.value = value ?? "";
				return input;
			}
			const input = document.createElement("input");
			input.type = "color";
			input.value = value && HEX_RE.test(value) ? value : "#3b82f6";
			return input;
		}
		if (format === "date") {
			const input = document.createElement("input");
			input.type = "date";
			input.value = value ?? "";
			return input;
		}
		if (format === "date-time") {
			const input = document.createElement("input");
			input.type = "datetime-local";
			if (value) {
				const d = new Date(value);
				if (!Number.isNaN(d.getTime()))
					input.value = d.toISOString().slice(0, 16);
			}
			return input;
		}
		const input = document.createElement("input");
		input.type =
			format === "url" ? "url" : format === "email" ? "email" : "text";
		input.value = value ?? "";
		return input;
	}

	function renderScalar(schemaNode, path) {
		const type = Array.isArray(schemaNode.type)
			? schemaNode.type[0]
			: schemaNode.type;
		const value = getIn(state, path);
		if (type === "boolean") {
			const label = document.createElement("label");
			label.className = "switch";
			const input = document.createElement("input");
			input.type = "checkbox";
			input.checked = value === true;
			label.appendChild(input);
			const track = document.createElement("span");
			track.className = "switch-track";
			label.appendChild(track);
			const text = document.createElement("span");
			text.className = "switch-label";
			text.textContent = schemaNode.title ?? "";
			label.appendChild(text);
			return label;
		}
		const input = document.createElement("input");
		input.type = type === "number" || type === "integer" ? "number" : "text";
		if (type === "number" || type === "integer") {
			input.step = type === "integer" ? "1" : "any";
			if (schemaNode.minimum !== undefined) input.min = schemaNode.minimum;
			if (schemaNode.maximum !== undefined) input.max = schemaNode.maximum;
		}
		input.value = value ?? "";
		return input;
	}

	function renderJsonEditor(path) {
		const wrap = document.createElement("div");
		const ta = document.createElement("textarea");
		ta.className = "json-editor mono";
		ta.dataset.managed = "1";
		ta.value = JSON.stringify(getIn(state, path) ?? {}, null, 2);
		const err = document.createElement("div");
		err.className = "field-error";
		err.hidden = true;
		ta.addEventListener("input", () => {
			try {
				const parsed = JSON.parse(ta.value);
				setIn(state, path, parsed);
				ta.classList.remove("invalid");
				err.hidden = true;
				dirty = true;
				onChange?.(path, parsed);
				reEvaluate();
			} catch {
				ta.classList.add("invalid");
				err.hidden = false;
				err.textContent = "JSON 语法错误";
			}
		});
		wrap.appendChild(ta);
		wrap.appendChild(err);
		return wrap;
	}

	function renderStringList(path) {
		if (!Array.isArray(getIn(state, path))) setIn(state, path, []);
		const wrap = document.createElement("div");
		wrap.className = "schema-array";
		const itemsWrap = document.createElement("div");
		itemsWrap.className = "schema-array";
		wrap.appendChild(itemsWrap);

		function rerender() {
			itemsWrap.innerHTML = "";
			const list = getIn(state, path) ?? [];
			list.forEach((item, idx) => {
				const row = document.createElement("div");
				row.className = "string-list-item";
				const input = document.createElement("input");
				input.type = "text";
				input.value = item ?? "";
				input.dataset.path = JSON.stringify([...path, idx]);
				const del = document.createElement("button");
				del.className = "btn btn-sm";
				del.innerHTML = "✕";
				del.title = "删除";
				del.addEventListener("click", () => {
					const next = list.filter((_, i) => i !== idx);
					setIn(state, path, next);
					dirty = true;
					onChange?.(path, next);
					rerender();
					reEvaluate();
				});
				row.appendChild(input);
				row.appendChild(del);
				itemsWrap.appendChild(row);
			});
		}
		rerender();

		const addBtn = document.createElement("button");
		addBtn.className = "btn btn-sm schema-array-add";
		addBtn.textContent = "＋ 添加一项";
		addBtn.addEventListener("click", () => {
			const list = getIn(state, path) ?? [];
			setIn(state, path, [...list, ""]);
			dirty = true;
			onChange?.(path, getIn(state, path));
			rerender();
		});
		wrap.appendChild(addBtn);
		return wrap;
	}

	function renderTagInput(path) {
		if (!Array.isArray(getIn(state, path))) setIn(state, path, []);
		const wrap = document.createElement("div");
		wrap.className = "tag-input";
		wrap.dataset.managed = "1";

		function rerender() {
			wrap.innerHTML = "";
			const list = getIn(state, path) ?? [];
			for (let idx = 0; idx < list.length; idx++) {
				const chip = document.createElement("span");
				chip.className = "tag-chip";
				const text = document.createElement("span");
				text.textContent = list[idx];
				const x = document.createElement("span");
				x.className = "tag-x";
				x.textContent = "×";
				x.addEventListener("click", () => {
					list.splice(idx, 1);
					commit();
				});
				chip.appendChild(text);
				chip.appendChild(x);
				wrap.appendChild(chip);
			}
			const input = document.createElement("input");
			input.type = "text";
			input.placeholder = "输入后回车添加";
			input.addEventListener("keydown", (e) => {
				const v = input.value.trim();
				if ((e.key === "Enter" || e.key === ",") && v) {
					e.preventDefault();
					list.push(v);
					input.value = "";
					commit();
				} else if (e.key === "Backspace" && !input.value && list.length > 0) {
					list.pop();
					commit();
				}
			});
			wrap.appendChild(input);
		}

		function commit() {
			setIn(state, path, [...list]);
			dirty = true;
			onChange?.(path, getIn(state, path));
			rerender();
			reEvaluate();
			wrap.querySelector("input")?.focus();
		}
		rerender();
		return wrap;
	}

	function renderUnionStringArray(schemaNode, path) {
		const wrap = document.createElement("div");
		const mode = document.createElement("div");
		mode.className = "mode-toggle";
		const btnSingle = document.createElement("button");
		btnSingle.textContent = "单值";
		const btnMulti = document.createElement("button");
		btnMulti.textContent = "多值";
		mode.appendChild(btnSingle);
		mode.appendChild(btnMulti);
		const body = document.createElement("div");
		wrap.appendChild(mode);
		wrap.appendChild(body);

		const isMulti = () => Array.isArray(getIn(state, path));

		function render() {
			btnSingle.classList.toggle("active", !isMulti());
			btnMulti.classList.toggle("active", isMulti());
			body.innerHTML = "";
			if (isMulti()) {
				const list = document.createElement("div");
				list.className = "schema-array";
				const listEl = renderStringList(path);
				list.appendChild(listEl);
				body.appendChild(list);
			} else {
				const input = document.createElement("input");
				input.type = "text";
				input.value = getIn(state, path) ?? "";
				input.dataset.path = JSON.stringify(path);
				body.appendChild(input);
			}
		}
		btnSingle.addEventListener("click", () => {
			const cur = getIn(state, path);
			setIn(state, path, Array.isArray(cur) ? (cur[0] ?? "") : cur);
			dirty = true;
			onChange?.(path, getIn(state, path));
			render();
			reEvaluate();
		});
		btnMulti.addEventListener("click", () => {
			const cur = getIn(state, path);
			setIn(state, path, Array.isArray(cur) ? cur : cur ? [cur] : []);
			dirty = true;
			onChange?.(path, getIn(state, path));
			render();
			reEvaluate();
		});
		render();
		return wrap;
	}

	function renderObjectFields(propsSchema, path, depth) {
		const frag = document.createDocumentFragment();
		for (const [key, childSchema] of Object.entries(propsSchema)) {
			const child = renderNode(childSchema, [...path, key], depth + 1, key);
			if (child) frag.appendChild(child);
		}
		return frag;
	}

	function renderObjectPanel(schemaNode, path, depth) {
		if (depth <= 0) {
			return renderObjectFields(schemaNode.properties ?? {}, path, depth);
		}
		const panel = document.createElement("div");
		panel.className = "schema-object";
		const head = document.createElement("div");
		head.className = "schema-object-head";
		head.innerHTML =
			'<svg class="chevron" viewBox="0 0 24 24"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>';
		const title = document.createElement("span");
		title.textContent = schemaNode.title ?? "";
		head.appendChild(title);
		head.addEventListener("click", () => panel.classList.toggle("collapsed"));
		panel.appendChild(head);
		const body = document.createElement("div");
		body.className = "schema-object-body";
		body.appendChild(
			renderObjectFields(schemaNode.properties ?? {}, path, depth),
		);
		panel.appendChild(body);
		return panel;
	}

	function renderArray(schemaNode, path, depth) {
		const items = schemaNode.items;
		if (items && items.type === "object") {
			if (!Array.isArray(getIn(state, path))) setIn(state, path, []);
			const wrap = document.createElement("div");
			wrap.className = "schema-array";
			const itemsWrap = document.createElement("div");
			itemsWrap.className = "schema-array";
			wrap.appendChild(itemsWrap);

			const titleKey = schemaNode["x-itemTitle"];

			function itemTitle(item, idx) {
				if (titleKey && item?.[titleKey]) return String(item[titleKey]);
				return `#${idx + 1}`;
			}

			function rerender() {
				itemsWrap.innerHTML = "";
				const list = getIn(state, path) ?? [];
				list.forEach((item, idx) => {
					const block = document.createElement("div");
					block.className = "schema-array-item";
					const head = document.createElement("div");
					head.className = "schema-array-item-head";
					const label = document.createElement("span");
					label.className = `item-title${item?.[titleKey] ? "" : " empty"}`;
					label.textContent = itemTitle(item, idx);
					head.appendChild(label);
					const up = document.createElement("button");
					up.className = "move-btn";
					up.innerHTML = "↑";
					up.disabled = idx === 0;
					up.addEventListener("click", () => {
						[list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
						dirty = true;
						onChange?.(path, clone(list));
						rerender();
						reEvaluate();
					});
					const down = document.createElement("button");
					down.className = "move-btn";
					down.innerHTML = "↓";
					down.disabled = idx === list.length - 1;
					down.addEventListener("click", () => {
						[list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
						dirty = true;
						onChange?.(path, clone(list));
						rerender();
						reEvaluate();
					});
					const del = document.createElement("button");
					del.className = "move-btn";
					del.innerHTML = "✕";
					del.title = "删除此项";
					del.addEventListener("click", () => {
						list.splice(idx, 1);
						dirty = true;
						onChange?.(path, clone(list));
						rerender();
						reEvaluate();
					});
					head.appendChild(up);
					head.appendChild(down);
					head.appendChild(del);
					block.appendChild(head);
					const body = document.createElement("div");
					body.className = "schema-array-item-body";
					body.appendChild(
						renderObjectFields(
							items.properties ?? {},
							[...path, idx],
							depth + 1,
						),
					);
					block.appendChild(body);
					itemsWrap.appendChild(block);
				});
			}
			rerender();

			const addBtn = document.createElement("button");
			addBtn.className = "btn btn-sm schema-array-add";
			addBtn.textContent = `＋ 添加${schemaNode.title ? ` ${schemaNode.title.replace(/列表$/, "")}` : "一项"}`;
			addBtn.addEventListener("click", () => {
				const list = getIn(state, path) ?? [];
				list.push(defaultFromSchema(items));
				setIn(state, path, list);
				dirty = true;
				onChange?.(path, clone(list));
				rerender();
				reEvaluate();
			});
			wrap.appendChild(addBtn);
			return wrap;
		}
		if (schemaNode["x-tags"]) return renderTagInput(path);
		return renderStringList(path);
	}

	function renderNode(schemaNode, path, depth, key) {
		if (!schemaNode) return null;
		const isUnionStringArray =
			Array.isArray(schemaNode.type) &&
			schemaNode.type.includes("string") &&
			schemaNode.type.includes("array");

		let control;
		if (schemaNode["x-editor"] === "json") {
			control = renderJsonEditor(path);
		} else if (isUnionStringArray) {
			control = renderUnionStringArray(schemaNode, path);
		} else if (schemaNode.type === "object") {
			const panel = renderObjectPanel(schemaNode, path, depth);
			// 对象面板也要挂路径与条件属性（x-if 对对象字段同样生效）
			if (panel instanceof HTMLElement) {
				panel.dataset.path = JSON.stringify(path);
				if (schemaNode["x-if"]) {
					panel.dataset.xif = schemaNode["x-if"].field;
					panel.dataset.xifEquals = JSON.stringify(
						schemaNode["x-if"].equals ?? null,
					);
				}
			}
			return panel;
		} else if (schemaNode.type === "array") {
			control = renderArray(schemaNode, path, depth);
		} else if (schemaNode.type === "string") {
			control = renderString(schemaNode, path);
		} else if (schemaNode.type === "number" || schemaNode.type === "integer") {
			control = renderScalar(schemaNode, path);
		} else if (schemaNode.type === "boolean") {
			control = renderScalar(schemaNode, path);
		} else {
			const input = document.createElement("input");
			input.type = "text";
			input.value = getIn(state, path) ?? "";
			control = input;
		}

		// 布尔开关自带标题，其余统一在外层显示标题
		const extra = {};
		if (schemaNode["x-if"]) {
			extra.xif = schemaNode["x-if"].field;
			extra.xifEquals = schemaNode["x-if"].equals;
		}
		if (schemaNode.type === "boolean") {
			return fieldWrapper(schemaNode, path, control, extra);
		}
		const field = document.createElement("div");
		field.className = "field";
		field.dataset.path = JSON.stringify(path);
		if (extra.xif) {
			field.dataset.xif = extra.xif;
			field.dataset.xifEquals = JSON.stringify(extra.xifEquals);
		}
		const label = document.createElement("label");
		label.className = "field-label";
		label.textContent = schemaNode.title ?? key ?? "";
		field.appendChild(label);
		field.appendChild(control);
		if (schemaNode.description) {
			const hint = document.createElement("div");
			hint.className = "field-hint";
			hint.textContent = schemaNode.description;
			field.appendChild(hint);
		}
		return field;
	}

	/* ── 值读取与写入 ── */

	function readControlValue(field, target) {
		const control = field.querySelector("input, textarea, select");
		if (target.type === "checkbox") return target.checked;
		if (target.type === "number") {
			return target.value === "" ? undefined : Number(target.value);
		}
		if (target.type === "date") return target.value; // YYYY-MM-DD
		if (target.type === "datetime-local") {
			return target.value ? new Date(target.value).toISOString() : "";
		}
		return target.value ?? "";
	}

	function handleInput(e) {
		const managed = e.target.closest("[data-managed]");
		if (managed) return; // 标签输入等自管理控件
		const field = e.target.closest("[data-path]");
		if (!field) return;
		const path = JSON.parse(field.dataset.path);
		const value = readControlValue(field, e.target);
		setIn(state, path, value);
		dirty = true;
		onChange?.(path, value);
		reEvaluate();
	}

	/* ── 条件显示 ── */

	function reEvaluate() {
		for (const el of formEl.querySelectorAll("[data-xif]")) {
			const path = JSON.parse(el.dataset.path);
			const parentPath = path.slice(0, -1);
			const key = el.dataset.xif;
			const expected = el.dataset.xifEquals;
			const actual = getIn(state, [...parentPath, key]);
			const match = JSON.stringify(actual ?? null) === expected;
			el.classList.toggle("cond-hidden", !match);
		}
	}

	formEl.addEventListener("input", handleInput);
	formEl.addEventListener("change", handleInput);
	formEl.appendChild(renderNode(schema, [], depth));
	root.appendChild(formEl);
	reEvaluate();

	return {
		el: formEl,
		getValue: () => clone(state),
		isDirty: () => dirty,
		markClean: () => {
			dirty = false;
		},
		/** 从外部写入某个路径的值（如媒体选择器回填图片路径） */
		setValue(path, value) {
			setIn(state, path, value);
			dirty = true;
			onChange?.(path, value);
			// 简单控件直接同步 DOM；复杂控件整体重渲染
			const field = formEl.querySelector(
				`[data-path='${JSON.stringify(path)}']`,
			);
			if (field) {
				const control = field.querySelector("input, textarea, select");
				if (control && !field.querySelector(".tag-input")) {
					if (control.type === "checkbox") control.checked = value === true;
					else control.value = value ?? "";
					reEvaluate();
					return;
				}
			}
			this.rerender();
		},
		rerender() {
			formEl.innerHTML = "";
			formEl.appendChild(renderNode(schema, [], depth));
			reEvaluate();
		},
		destroy: () => {
			formEl.remove();
		},
	};
}
