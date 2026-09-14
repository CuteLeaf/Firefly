import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createArchiveLighting } from "./rhine/archive-lighting";
import { loadArchiveAsset } from "./archive-asset";
import { coast, damp, wave, type Spring } from "./timeline-motion";

export interface TimelineScene {
	select(index: number): void;
	suspend(value: boolean): void;
	dispose(): void;
}
interface SceneOptions {
	count: number;
	model: string;
	signal: AbortSignal;
	onSelect(index: number): void;
	onFailure(): void;
}

/** 单行有限窗口：实例身份与文章下标分开，任何时刻最多提交 25 个槽位。 */
export async function createTimelineScene(
	host: HTMLElement,
	options: SceneOptions,
): Promise<TimelineScene> {
	const asset = await loadArchiveAsset(options.model);
	if (options.signal.aborted) {
		asset.dispose();
		throw new DOMException("已离开归档", "AbortError");
	}
	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});
	} catch (error) {
		asset.dispose();
		throw error;
	}
	const scene = new THREE.Scene();
	// 保留真实透明度，让网站壁纸与主题直接透出，而非匹配一块固定底色。
	renderer.setClearColor(0x000000, 0);
	const camera = new THREE.PerspectiveCamera(10, 1, 5, 180);
	const aim = new THREE.Vector3(0, 0.4, 0);
	camera.position.copy(aim).add(new THREE.Vector3(62.26, 27, 43.28));
	camera.lookAt(aim);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	const light = createArchiveLighting(renderer, scene);
	light.castShadow = true;
	Object.assign(light.shadow.camera, {
		left: -15,
		right: 15,
		top: 15,
		bottom: -15,
		near: 0.1,
		far: 45,
	});
	light.shadow.mapSize.set(2048, 2048);
	light.shadow.normalBias = 0.035;
	light.shadow.bias = -0.0003;
	light.shadow.radius = 4;
	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(200, 200),
		// 地面只接收轻微投影，不再绘制奶黄色实体平面。
		new THREE.ShadowMaterial({ color: "#172749", opacity: 0.16 }),
	);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -4.63;
	floor.receiveShadow = true;
	scene.add(floor);
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	const ao = new SSAOPass(scene, camera, 1, 1);
	ao.kernelRadius = 0.38;
	ao.minDistance = 0.001;
	ao.maxDistance = 0.09;
	// SSAOPass 默认乘色混合保留 beauty buffer 的 alpha，空白处保持透明。
	composer.addPass(ao);
	composer.addPass(new OutputPass());
	const capacity = Math.min(25, options.count);
	const instances = asset.layers.map(({ geometry, material }) => {
		const mesh = new THREE.InstancedMesh(geometry, material, capacity);
		mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
		mesh.frustumCulled = false;
		mesh.receiveShadow = true;
		mesh.castShadow = material.name.startsWith("Optical_Diffuser");
		scene.add(mesh);
		return mesh;
	});
	const abort = new AbortController();
	const signal = abort.signal;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const rail: Spring = { value: 0, velocity: 0 };
	let selected = 0,
		target = 0,
		hover = -1,
		clock = 0,
		last = 0;
	let momentum = false,
		disposed = false,
		suspended = false,
		inView = true,
		frameId = 0;
	let pulses: { index: number; time: number }[] = [];
	const dummy = new THREE.Object3D();
	const ray = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	let visible: number[] = [];
	let frameInterval = 16.7;
	const hoverStates = new Map<number, Spring>();
	// 抽出的完整模型只存在于选中与归位期间；普通槽位使用五组实例。
	const heroes = new Map<number, { group: THREE.Group; lift: Spring }>();
	const ensureHero = (index: number) => {
		if (heroes.has(index)) return;
		const group = asset.template.clone(true);
		asset.appearance.prepare(group);
		// 编号印刷层沿用原模型标签位置，作为博客档案的动态标识。
		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 220;
		const ctx = canvas.getContext("2d")!;
		ctx.fillStyle = "#e6e2d9";
		ctx.fillRect(0, 0, 512, 220);
		ctx.fillStyle = "#252b29";
		ctx.font = "500 40px sans-serif";
		ctx.fillText("FURINAFANS", 20, 55);
		ctx.font = "300 90px sans-serif";
		ctx.fillText(`F-${String(index + 1).padStart(3, "0")}`, 15, 160);
		const texture = new THREE.CanvasTexture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		const label = new THREE.Mesh(
			new THREE.PlaneGeometry(0.99, 0.46),
			new THREE.MeshBasicMaterial({
				map: texture,
				toneMapped: false,
				transparent: true,
				depthWrite: false,
			}),
		);
		label.position.set(-1.36, 3.04, 0.255);
		label.userData.timelineLabel = true;
		group.add(label);
		scene.add(group);
		heroes.set(index, { group, lift: { value: 0, velocity: 0 } });
	};
	const removeHero = (index: number) => {
		const hero = heroes.get(index);
		if (!hero) return;
		asset.appearance.dispose(hero.group);
		for (const child of hero.group.children)
			if (child.userData.timelineLabel)
				(child as THREE.Mesh).geometry.dispose();
		scene.remove(hero.group);
		heroes.delete(index);
	};
	const clamp = (value: number) =>
		Math.max(0, Math.min(options.count - 1, value));
	const choose = (index: number) => {
		index = Math.round(clamp(index));
		if (selected === index) return;
		selected = index;
		ensureHero(index);
		if (!reduced.matches) pulses.push({ index, time: clock });
		options.onSelect(index);
	};
	const select = (index: number) => {
		momentum = false;
		target = Math.round(clamp(index));
		choose(target);
		if (reduced.matches) {
			rail.value = target;
			rail.velocity = 0;
		}
		wake();
	};
	ensureHero(0);
	const resize = () => {
		const { width, height } = host.getBoundingClientRect();
		if (!width || !height || disposed) return;
		camera.aspect = width / height;
		// 小屏扩大取景而不缩小正文；保持长焦视角和卡片的物理尺寸。
		const span = Math.max(8.3, 7 / camera.aspect);
		camera.fov = THREE.MathUtils.radToDeg(
			2 * Math.atan(span / (2 * camera.position.distanceTo(aim))),
		);
		camera.updateProjectionMatrix();
		renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
		renderer.setSize(width, height);
		composer.setPixelRatio(renderer.getPixelRatio());
		composer.setSize(width, height);
		wake();
	};
	const pick = (event: PointerEvent) => {
		const rect = host.getBoundingClientRect();
		pointer.set(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			(-(event.clientY - rect.top) / rect.height) * 2 + 1,
		);
		ray.setFromCamera(pointer, camera);
		const hits = ray.intersectObjects(instances, false);
		const id = hits[0]?.instanceId;
		return id === undefined ? -1 : (visible[id] ?? -1);
	};
	let drag: {
		id: number;
		x: number;
		y: number;
		start: number;
		moved: boolean;
		samples: { value: number; time: number }[];
		lastMove: number;
		direction: number;
		projection: THREE.Vector2;
	} | null = null;
	host.addEventListener(
		"pointerdown",
		(event) => {
			if (!event.isPrimary || event.button !== 0) {
				drag = null;
				return;
			}
			momentum = false;
			rail.velocity = 0;
			host.focus({ preventScroll: true });
			const a = new THREE.Vector3(0, 1.8, 0).project(camera);
			const b = new THREE.Vector3(0, 1.8, -0.62).project(camera);
			const projection = new THREE.Vector2(
				((b.x - a.x) * host.clientWidth) / 2,
				(-(b.y - a.y) * host.clientHeight) / 2,
			);
			drag = {
				id: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				start: rail.value,
				moved: false,
				samples: [{ value: rail.value, time: event.timeStamp }],
				lastMove: event.timeStamp,
				direction: 0,
				projection,
			};
			host.setPointerCapture(event.pointerId);
			wake();
		},
		{ signal },
	);
	host.addEventListener(
		"pointermove",
		(event) => {
			if (!drag || drag.id !== event.pointerId) {
				if (event.pointerType === "mouse") hover = pick(event);
				return;
			}
			const dx = event.clientX - drag.x,
				dy = event.clientY - drag.y;
			if (!drag.moved && Math.hypot(dx, dy) < 8) return;
			drag.moved = true;
			hover = -1;
			const p = drag.projection;
			const value = clamp(
				drag.start - (dx * p.x + dy * p.y) / Math.max(1, p.lengthSq()),
			);
			const previous = drag.samples.at(-1)!;
			const direction = Math.sign(value - previous.value);
			if (direction && drag.direction && direction !== drag.direction)
				drag.samples = [previous];
			if (direction) {
				drag.direction = direction;
				drag.lastMove = event.timeStamp;
			}
			drag.samples.push({ value, time: event.timeStamp });
			drag.samples = drag.samples
				.filter(
					(sample, index, samples) =>
						event.timeStamp - sample.time <= 120 ||
						index === samples.length - 2,
				)
				.slice(-32);
			rail.value = value;
			choose(Math.round(value));
		},
		{ signal },
	);
	const release = (event: PointerEvent, canceled: boolean) => {
		if (!drag || event.pointerId !== drag.id) return;
		const current = drag;
		drag = null;
		if (host.hasPointerCapture(event.pointerId))
			host.releasePointerCapture(event.pointerId);
		if (!current.moved && !canceled) {
			const index = pick(event);
			if (index >= 0) select(index);
			else {
				target = Math.round(clamp(rail.value));
				choose(target);
			}
			return;
		}
		const first = current.samples[0],
			end = current.samples.at(-1)!;
		rail.velocity =
			!canceled &&
			!reduced.matches &&
			end.time - first.time >= 8 &&
			// 慢帧中 pointerup 可能比最后一次 move 晚一个绘制周期。
			// 最多容纳 200ms，长按停住后依然不产生惯性。
			event.timeStamp - current.lastMove <=
				Math.max(80, Math.min(200, frameInterval * 2))
				? ((end.value - first.value) * 1000) / (end.time - first.time)
				: 0;
		momentum = Math.abs(rail.velocity) >= 0.75;
		target = Math.round(clamp(rail.value));
		choose(target);
	};
	host.addEventListener("pointerup", (event) => release(event, false), {
		signal,
	});
	host.addEventListener("pointercancel", (event) => release(event, true), {
		signal,
	});
	host.addEventListener("lostpointercapture", (event) => release(event, true), {
		signal,
	});
	host.addEventListener(
		"pointerleave",
		() => {
			hover = -1;
		},
		{ signal },
	);
	let wheelTotal = 0,
		wheelTime = 0;
	host.addEventListener(
		"wheel",
		(event) => {
			if (event.ctrlKey) return;
			const delta =
				Math.abs(event.deltaX) > Math.abs(event.deltaY)
					? event.deltaX
					: event.deltaY;
			if (
				(target === 0 && delta < 0) ||
				(target === options.count - 1 && delta > 0)
			)
				return;
			event.preventDefault();
			if (
				event.timeStamp - wheelTime > 180 ||
				Math.sign(wheelTotal) !== Math.sign(delta)
			)
				wheelTotal = 0;
			wheelTime = event.timeStamp;
			wheelTotal +=
				delta *
				(event.deltaMode === 1
					? 16
					: event.deltaMode === 2
						? host.clientHeight
						: 1);
			if (Math.abs(wheelTotal) >= 40) {
				select(target + Math.sign(wheelTotal));
				wheelTotal = 0;
			}
		},
		{ signal, passive: false },
	);
	host.addEventListener(
		"keydown",
		(event) => {
			const index =
				event.key === "ArrowRight"
					? target + 1
					: event.key === "ArrowLeft"
						? target - 1
						: event.key === "Home"
							? 0
							: event.key === "End"
								? options.count - 1
								: null;
			if (index !== null) {
				event.preventDefault();
				select(index);
			}
		},
		{ signal },
	);
	renderer.domElement.addEventListener(
		"webglcontextlost",
		(event) => {
			event.preventDefault();
			api.suspend(true);
			options.onFailure();
		},
		{ signal },
	);
	const draw = (stamp: number) => {
		frameId = 0;
		if (disposed || suspended || !inView || document.hidden) {
			last = 0;
			return;
		}
		if (last) frameInterval += (stamp - last - frameInterval) * 0.25;
		const dt = Math.min(0.1, last ? (stamp - last) / 1000 : 1 / 60);
		last = stamp;
		clock += dt;
		if (!drag) {
			if (momentum) {
				momentum = coast(rail, dt, options.count - 1);
				choose(Math.round(rail.value));
				if (!momentum) {
					target = Math.round(clamp(rail.value + rail.velocity / 2.4));
					choose(target);
				}
			} else if (reduced.matches) {
				rail.value = target;
				rail.velocity = 0;
			} else damp(rail, target, 6, dt);
		}
		pulses = pulses.filter((pulse) => clock - pulse.time < 3.2).slice(-8);
		const start = Math.max(
			0,
			Math.min(
				options.count - capacity,
				Math.round(rail.value) - Math.floor(capacity / 2),
			),
		);
		visible = Array.from({ length: capacity }, (_, i) => start + i);
		for (const [index, hero] of heroes) {
			if (reduced.matches) {
				hero.lift.value = index === selected ? 0.4 : 0;
				hero.lift.velocity = 0;
			} else
				damp(
					hero.lift,
					index === selected ? 0.4 : 0,
					index === selected ? 4.2 : 4.5,
					dt,
				);
			if (
				index !== selected &&
				(Math.abs(hero.lift.value) < 0.001 ||
					index < start ||
					index >= start + capacity)
			)
				removeHero(index);
		}
		visible.forEach((index, slot) => {
			const distance = index - rail.value;
			// 有限队列首尾保留少量向内的取景余量，短列表居中。
			const margin = Math.min(4, (options.count - 1) / 2);
			const framing = Math.max(
				margin,
				Math.min(options.count - 1 - margin, rail.value),
			);
			const shoulder = 0.5 * Math.exp(-0.5 * (distance / 3.5) ** 2);
			const ripple = reduced.matches
				? 0
				: pulses.reduce(
						(sum, pulse) => sum + wave(index - pulse.index, clock - pulse.time),
						0,
					);
			const hoverState = hoverStates.get(index) ?? { value: 0, velocity: 0 };
			if (reduced.matches) hoverState.value = index === hover ? 0.12 : 0;
			else damp(hoverState, index === hover ? 0.12 : 0, 8, dt);
			hoverStates.set(index, hoverState);
			const y = -1.5 + shoulder + ripple + hoverState.value;
			const z = -(index - framing) * 0.62;
			const hero = heroes.get(index);
			if (hero) {
				hero.group.position.set(0, y + hero.lift.value, z);
				asset.appearance.apply(
					hero.group,
					Math.min(1, Math.max(0, hero.lift.value / 0.4)),
				);
			}
			dummy.position.set(0, y, z);
			dummy.scale.setScalar(hero ? 0 : 1);
			dummy.updateMatrix();
			for (const mesh of instances) mesh.setMatrixAt(slot, dummy.matrix);
		});
		for (const mesh of instances) mesh.instanceMatrix.needsUpdate = true;
		for (const index of hoverStates.keys())
			if (index < start || index >= start + capacity) hoverStates.delete(index);
		composer.render();
		frameId = requestAnimationFrame(draw);
	};
	function wake(): void {
		if (!frameId && !disposed && !suspended && inView && !document.hidden)
			frameId = requestAnimationFrame(draw);
	}
	const observer = new ResizeObserver(resize);
	const intersection = new IntersectionObserver((entries) => {
		inView = entries[0].isIntersecting;
		wake();
	});
	document.addEventListener("visibilitychange", wake, { signal });
	reduced.addEventListener(
		"change",
		() => {
			momentum = false;
			drag = null;
			target = selected;
			rail.velocity = 0;
			pulses = [];
			wake();
		},
		{ signal },
	);
	const api: TimelineScene = {
		select,
		suspend(value) {
			suspended = value;
			last = 0;
			if (value) {
				drag = null;
				momentum = false;
				target = selected;
			} else wake();
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			abort.abort();
			cancelAnimationFrame(frameId);
			observer.disconnect();
			intersection.disconnect();
			for (const index of heroes.keys()) removeHero(index);
			for (const mesh of instances) mesh.dispose();
			for (const pass of composer.passes) pass.dispose();
			composer.dispose();
			(
				scene.userData.archiveEnvironmentTarget as THREE.WebGLRenderTarget
			).dispose();
			light.shadow.dispose();
			floor.geometry.dispose();
			floor.material.dispose();
			asset.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		},
	};
	host.append(renderer.domElement);
	observer.observe(host);
	intersection.observe(host);
	resize();
	wake();
	return api;
}
