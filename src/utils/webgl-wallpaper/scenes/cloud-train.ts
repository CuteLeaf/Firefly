import type { WebGLWallpaperScene, WebGLWallpaperSceneContext } from "../types";

// Scene-specific configuration. The host remains independent of these controls.
const defaults = {
	speed: 0.75,
	resolution: 0.75,
	feedback: 0.3,
	vignette: 1,
	zoom: 1,
	offset: 0,
	amplitude: 1,
	detail: 6,
	exposure: 1,
	saturation: 1,
	hue: 0,
	temperature: 0,
	skyTint: "#ffffff",
	smokeTint: "#ffffff",
	trainTint: "#ffffff",
	introEnabled: true,
	introDuration: 3,
	introFeather: 0.22,
	paused: false,
};
type CloudTrainSettings = typeof defaults;
function number(
	value: unknown,
	fallback: number,
	min: number,
	max: number,
): number {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
function tint(value: unknown): string {
	return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
		? value
		: "#ffffff";
}
function settings(options: Record<string, unknown>): CloudTrainSettings {
	return {
		speed: number(options.speed, 0.75, 0, 5),
		resolution: number(options.resolution, 0.75, 0.25, 1),
		feedback: number(options.feedback, 0.3, 0, 0.85),
		vignette: number(options.vignette, 1, 0, 1),
		zoom: number(options.zoom, 1, 0.5, 2),
		offset: number(options.offset, 0, -0.5, 0.5),
		amplitude: number(options.amplitude, 1, 0, 2),
		detail: Math.round(number(options.detail, 6, 1, 8)),
		exposure: number(options.exposure, 1, 0.2, 2),
		saturation: number(options.saturation, 1, 0, 2),
		hue: number(options.hue, 0, -180, 180),
		temperature: number(options.temperature, 0, -1, 1),
		skyTint: tint(options.skyTint),
		smokeTint: tint(options.smokeTint),
		trainTint: tint(options.trainTint),
		introEnabled:
			typeof options.introEnabled === "boolean" ? options.introEnabled : true,
		introDuration: number(options.introDuration, 3, 0.5, 10),
		introFeather: number(options.introFeather, 0.22, 0.02, 0.6),
		paused: typeof options.paused === "boolean" ? options.paused : false,
	};
}

// Original supplied shader credited to mdb. No redistribution license was supplied.
// Preserve the source project's deterministic noise and previous-frame feedback assumptions.
// Tint within each material, before compositing and feedback. White is identity.
function cloudTrainColorizeSource(source: string) {
	let result = source.replace(
		"return vec4(0.58, 0.7, 1.0, 1.);",
		"return vec4(vec3(0.58, 0.7, 1.0)*skyTint, 1.);",
	);
	const trainStart = result.indexOf("col = mix(col, vec3(0.18");
	const smokeStart = result.indexOf("// loco smoke");
	if (trainStart < 0 || smokeStart < 0)
		throw new Error("Train color source markers missing");
	result =
		result.slice(0, trainStart) +
		result
			.slice(trainStart, smokeStart)
			.replace(/vec3\(([^()]*)\)/g, "vec3($1)*trainTint") +
		result.slice(smokeStart);
	result = result
		.replace(
			"if(y < 0.0) col = vec3(1.0, 0.94, 0.91);",
			"if(y < 0.0) col = vec3(1.0, 0.94, 0.91)*smokeTint;",
		)
		.replace(
			"if(y < - 0.02) col = vec3(0.92, 0.85, 0.82);",
			"if(y < - 0.02) col = vec3(0.92, 0.85, 0.82)*smokeTint;",
		);
	return "uniform vec3 skyTint, smokeTint, trainTint;\n" + result;
}

// Reveal real depth layers, not rectangular screen bands. At intro=1 the
// original layer boundaries and material compositing are unchanged.
function cloudTrainOpeningSource(source: string): string {
	return (
		`uniform float intro, introFeather;
float openingLayer(float start) {
  if (intro >= 1.) return 1.;
  float width = mix(.08, .24, clamp(introFeather / .6, 0., 1.));
  return smoothstep(start, min(start + width, 1.), intro);
}
` +
		source
			.replace(
				"#define layer(dh, v)  if (uv.y < h + midlevel - (dh) ) return vec4(v, 1.);",
				"#define layer(dh, v) { float p=openingLayer(dist>=10. ? .08+.60*(100.-dist)/90. : (dist>1.5 ? .78 : .88)); if(dist!=matchedDepth && uv.y < h + midlevel - (dh)) { matchedDepth=dist; accumulated.rgb+=(1.-accumulated.a)*p*(v); accumulated.a+=(1.-accumulated.a)*p; if(accumulated.a>=1.) return accumulated; } }",
			)
			.replaceAll(
				"float midlevel;",
				"vec4 accumulated=vec4(0.); float matchedDepth=-1.; float midlevel;",
			)
			.replace(
				"return vec4(0.95, 0.80, 0.77, 0.);",
				"return vec4(accumulated.a>0. ? accumulated.rgb/accumulated.a : vec3(0.95,0.80,0.77),accumulated.a);",
			)
			.replace(
				"return vec4(vec3(0.58, 0.7, 1.0)*skyTint, 1.);",
				"return vec4(accumulated.rgb+(1.-accumulated.a)*mix(vec3(.008,.035,.051),vec3(0.58, 0.7, 1.0)*skyTint,openingLayer(0.)), 1.);",
			)
			.replace(
				"vec3 col = bg.rgb;",
				"vec3 col = bg.rgb; vec3 openingBackground = col;",
			)
			.replace(
				"col = mix(col, fg.rgb, fg.a);",
				"col = mix(openingBackground, col, openingLayer(.70)); col = mix(col, fg.rgb, fg.a);",
			)
	);
}

function cloudTrainTintRgb(hex: string): [number, number, number] {
	if (!/^#[0-9a-f]{6}$/i.test(hex)) return [1, 1, 1];
	return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
		number,
		number,
		number,
	];
}

class CloudTrainRenderer implements WebGLWallpaperScene {
	#canvas: HTMLCanvasElement;
	#settings: { current: CloudTrainSettings };
	#wake = { current: () => {} };
	#cleanup: (() => void) | undefined;
	#onError: (message: string | undefined) => void;
	#onFirstFrame: () => void;
	constructor(
		_layer: HTMLElement,
		canvas: HTMLCanvasElement,
		settings: CloudTrainSettings,
		onError: (message: string | undefined) => void,
		onFirstFrame: () => void,
	) {
		this.#canvas = canvas;
		this.#settings = { current: settings };
		this.#onError = onError;
		this.#onFirstFrame = onFirstFrame;
		this.#cleanup = this.#start();
		canvas.addEventListener("webglcontextlost", this.#lost);
		canvas.addEventListener("webglcontextrestored", this.#restored);
	}
	#start(): (() => void) | undefined {
		const state = this.#settings,
			wake = this.#wake;
		let firstFrame = true;
		const onFirstFrame = this.#onFirstFrame;
		// 前景保留近景 c14、背景保留 c12/c10 等层；移除 c13 与 c11 以减少每像素噪声采样。
		const original =
			"float noise(vec2 x){\n    vec2 f = fract(x);\n    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);\n    vec2 du = 30.0*f*f*(f*(f-2.0)+1.0);\n    \n    vec2 p = floor(x);\n\tfloat a = texture(iChannel0, (p+vec2(0.0, 0.0))/1024.0).x;\n\tfloat b = texture(iChannel0, (p+vec2(1.0,0.0))/1024.0).x;\n\tfloat c = texture(iChannel0, (p+vec2(0.0,1.0))/1024.0).x;\n\tfloat d = texture(iChannel0, (p+vec2(1.0,1.0))/1024.0).x;\n\n    \n\treturn a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y;\n}\n\nfloat fbm(vec2 x, int detail){\n    float a = 0.0;\n    float b = 1.0;\n    float t = 0.0;\n    for(int i = 0; i < detail; i++){\n        float n = noise(x);\n        a += b*n;\n        t += b;\n        b *= 0.7;\n        x *= 2.0; \n    \n    }\n    return a/t;\n}\n\nfloat fbm2(vec2 x, int detail){\n    float a = 0.0;\n    float b = 1.0;\n    float t = 0.0;\n    for(int i = 0; i < detail; i++){\n        float n = noise(x);\n        a += b*n;\n        t += b;\n        b *= 0.9;\n        x *= 2.0; \n    \n    }\n    return a/t;\n}\n\nfloat box(vec2 uv, float x1, float x2, float y1, float y2){\n    return (uv.x > x1 && uv.x < x2 && uv.y > y1 && uv.y < y2)?1.0:0.0;\n} \n\n#define dot2(v) dot(v, v)\n#define layer(dh, v)  if (uv.y < h + midlevel - (dh) ) return vec4(v, 1.);\n\nvec4 foreground(vec2 uv, float t){\n    float midlevel;\n    float h;\n    float disp;\n    float dist;\n    vec2 uv2;\n    \n    uv.y -= 0.2;\n    // clouds foreground //////////////////////////////////////////////////////////////\n    \n    // c14\n    midlevel = -0.1;\n    disp = 1.7;\n    dist = 1.0;\n    uv2 = uv + vec2(t/dist + 40.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.12, vec3(0.43, 0.32, 0.31));\n    layer(0.08, vec3(0.55, 0.42, 0.41));\n    layer(0.04, vec3(0.66, 0.42, 0.40));\n    layer(0., vec3(0.77, 0.48, 0.46));\n    \n    return vec4(0.95, 0.80, 0.77, 0.);\n}\n\nvec4 background(vec2 uv, float t){\n    float midlevel;\n    float h;\n    float disp;\n    float dist;\n    vec2 uv2;\n    \n    // clouds ///////////////////////////////////////////////////////\n    \n    // c12\n    midlevel = 0.3;\n    disp = 0.9;\n    dist = 10.0;\n    uv2 = uv + vec2(t/dist + 32.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.14, vec3(0.48, 0.19, 0.20));\n    layer(0.1, vec3(0.68, 0.28, 0.19));\n    layer(0.07, vec3(0.88, 0.38, 0.24));\n    layer(0., vec3(0.95, 0.45, 0.30));\n    \n    // c10\n    midlevel = 0.35;\n    disp = 3.5;\n    dist = 20.0;\n    uv2 = uv + vec2(t/dist + 27.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.12, vec3(0.43, 0.32, 0.31));\n    layer(0.08, vec3(0.55, 0.42, 0.41));\n    layer(0.04, vec3(0.66, 0.42, 0.40));\n    layer(0., vec3(0.77, 0.48, 0.46));\n    \n    // c9\n    midlevel = 0.45;\n    disp = 2.0;\n    dist = 25.0;\n    uv2 = uv + vec2(t/dist + 23.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.04, vec3(0.98, 0.57, 0.36));\n    layer(0., vec3(1.0, 0.62, 0.44));\n    \n    // c8\n    midlevel = 0.5;\n    disp = 2.3;\n    dist = 30.0;\n    uv2 = uv + vec2(t/dist + 20.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.12, vec3(0.41, 0.27, 0.27));\n    layer(0.08, vec3(0.53, 0.35, 0.32));\n    layer(0.04, vec3(0.80, 0.24, 0.17));\n    layer(0., vec3(0.99, 0.29, 0.20));\n    \n    // c7\n    midlevel = 0.5;\n    disp = 2.5;\n    dist = 35.0;\n    uv2 = uv + vec2(t/dist + 18.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.1, vec3(0.88, 0.38, 0.24));\n    layer(0.05, vec3(0.98, 0.42, 0.28));\n    layer(0., vec3(1.0, 0.48, 0.35));\n    \n    // c6\n    midlevel = 0.6;\n    disp = 2.0;\n    dist = 40.0;\n    uv2 = uv + vec2(t/dist + 18.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.1, vec3(0.95, 0.66, 0.48));\n    layer(0., vec3(1.0, 0.76, 0.60));\n    \n    // c5\n    midlevel = 0.75;\n    disp = 3.5;\n    dist = 45.0;\n    uv2 = uv + vec2(t/dist + 15.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.2, vec3(1.0, 0.55, 0.33));\n    layer(0.15, vec3(0.98, 0.50, 0.24));\n    layer(0.1, vec3(0.90, 0.55, 0.40));\n    layer(0., vec3(1.0, 0.62, 0.44));\n    \n    // c4\n    midlevel = 0.7;\n    disp = 2.7;\n    dist = 50.0;\n    uv2 = uv + vec2(t/dist + 12.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.04, vec3(0.73, 0.36, 0.30));\n    layer(0., vec3(0.80, 0.40, 0.34));\n    \n    // c3\n    midlevel = 0.8;\n    disp = 2.7;\n    dist = 60.0;\n    uv2 = uv + vec2(t/dist + 9.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.1, vec3(0.93, 0.58, 0.35));\n    layer(0., vec3(1.0, 0.76, 0.60));\n    \n    // c2\n    midlevel = 0.9;\n    disp = 3.0;\n    dist = 70.0;\n    uv2 = uv + vec2(t/dist + 7.0, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.1, vec3(0.56, 0.25, 0.22));\n    layer(0.05, vec3(0.60, 0.30, 0.27));\n    layer(0., vec3(0.74, 0.35, 0.30));\n    \n    // c1\n    midlevel = 1.0;\n    disp = 5.0;\n    dist = 100.0;\n    uv2 = uv + vec2(t/dist + 3.5, 0.0);\n    h = (fbm(uv2, 8) - 0.5)*disp;\n    layer(0.1, vec3(0.92, 0.85, 0.82));\n    layer(0., vec3(1.0, 0.94, 0.91));\n    \n    return vec4(0.58, 0.7, 1.0, 1.);\n}\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n    vec2 uv = fragCoord/iResolution.y;\n    //uv.x += iTime;\n    float t = iTime*4.0;\n    vec4 bg = background(uv, t);\n    \n    vec4 fg = vec4(0.);\n    int n = 5;\n    if (uv.y < 0.5)\n    for (int i = 0; i < n; i++){\n        fg += foreground(uv, t+4.*float(i)/float(n)/60.) / (float(n));\n    }\n    \n    vec3 col = bg.rgb;\n    // train /////////////////////////////////////////////////////////////////////\n    float k;\n    float midlevel;\n    float h;\n    float disp;\n    float dist;\n    vec2 uv2;\n    uv.y -= 0.2;\n    // choo choo\n    k = 1.0;\n    uv2 = fract(uv*9.0);\n    float wagon = 1.0;\n    wagon *= 1.0 - step(0.45, uv.x);\n    wagon *= 1.0 - step(0.115, uv.y);\n    wagon *= step(0.103, uv.y);\n    wagon *= step(0.05, 1.0 - abs(uv2.x*2.0 - 1.0));\n    \n    float join = 1.0; \n    join *= 1.0 - step(0.45, uv.x);\n    join *= 1.0 - step(0.11, uv.y);\n    join *= step(0.107, uv.y);\n    \n    \n    float roof = 1.0;\n    roof *= 1.0 - step(0.45, uv.x);\n    roof *= 1.0 - step(0.117, uv.y);\n    roof *= step(0.11, uv.y);\n    roof *= step(0.15, 1.0 - abs(uv2.x*2.0 - 1.0));\n    \n    float loco = box(uv, 0.45, 0.5, 0.103, 0.112);\n    float chem1 = box(uv, 0.49, 0.495, 0.103, 0.12);\n    float chem2 = box(uv, 0.488, 0.496, 0.12, 0.123);\n    float locoRoof = box(uv, 0.443, 0.47, 0.11, 0.117);\n    \n    float wheel = 1.0 - step(0.00004, dot2(uv - vec2(0.457, 0.106)));\n    wheel += 1.0 - step(0.00002, dot2(uv - vec2(0.487, 0.105)));\n    wheel += 1.0 - step(0.00002, dot2(uv - vec2(0.497, 0.105)));\n    \n    if (uv.x < 0.45 && uv.y > 0.025 && uv.y < 0.2){\n        wheel += 1.0 - step(0.002, dot2(uv2 - vec2(0.2, 0.95)));\n        wheel += 1.0 - step(0.002, dot2(uv2 - vec2(0.8, 0.95)));\n    }\n    col = mix(col, vec3(0.18, 0.12, 0.15), join);\n    col =  mix(col, vec3(0.48, 0.19, 0.20), wagon);\n    col = mix(col, vec3(0.18, 0.12, 0.15), roof);\n    \n    col = mix(col, vec3(0.38, 0.19, 0.20), loco);\n    col = mix(col, vec3(0.38, 0.19, 0.20), chem1);\n    col = mix(col, vec3(0.18, 0.12, 0.15), locoRoof);\n    col = mix(col, vec3(0.18, 0.12, 0.15), chem2 + wheel);\n    // loco smoke //////\n    \n    dist = 5.0;\n    uv2 = uv + vec2(t/dist + 3.5, 0.0);\n    uv2.x -= t/dist*0.2;\n    h = fbm2(uv2, 8) - 0.55;\n    \n    if(uv.x < 0.49){\n        float x = -uv.x + 0.49;\n        float y = abs(uv.y + h*0.4 - 0.16*sqrt(x) - 0.12) - 0.8*x*exp(-x*10.0);\n        if(y < 0.0) col = vec3(1.0, 0.94, 0.91);\n        if(y < - 0.02) col = vec3(0.92, 0.85, 0.82);\n    }\n    \n    //bridge ///////\n    dist = 5.0;\n    uv2 = uv + vec2(t/dist + 32.5, 0.0);\n    uv2.x = fract(uv2.x*3.0);\n    k = 1.0;\n    k *= smoothstep(0.001, 0.003, abs(uv2.y - pow(uv2.x - 0.5, 2.0)*0.15 - 0.12));\n    k *= min(step(0.05, 1.0 - abs(uv2.x*2.0 - 1.0))\n         +   step(0.17, uv2.y), 1.0);\n    k *= min(smoothstep(0.02, 0.05, 1.0 - abs(uv2.x*2.0 - 1.0))\n         +   step(0.177, uv2.y), 1.0);\n         \n    k *= min(step(0.1, uv2.y)\n           + smoothstep(-0.09, -0.085, -uv2.y - 0.001/(1.0 - abs(uv2.x*2.0 - 1.0))), 1.0);\n           \n    k *= min(smoothstep(0.05, 0.2, 1.0 - abs(fract(uv2.x*16.0)*2.0 - 1.0))\n         +   step(0.12, uv2.y - pow(uv2.x - 0.5, 2.0)*0.15)\n         +   step(-0.1, -uv2.y), 1.0);\n    col = mix(vec3(0.29, 0.09, 0.08)*smoothstep(-0.08, 0.08, uv.y), col, k);\n    \n    \n    \n    col = mix(col, fg.rgb, fg.a);\n\n    // Output to screen\n    uv = fragCoord/iResolution.xy;\n    col = mix(col, texture(iChannel1, uv).rgb, 0.3);\n    fragColor = vec4(col,1.0);\n}\n\n";
		const imageSource =
			"#version 300 es\nprecision highp float;\nuniform sampler2D scene;\nuniform vec2 resolution;\nuniform float vignette;\nuniform float exposure, saturation;\nuniform float hue, temperature;\nuniform float intro, introFeather;\nout vec4 color;\nvoid main(){\nvec2 uv=gl_FragCoord.xy/resolution;\nvec3 col=texture(scene,uv).rgb;\nif(hue!=0.){\n  vec3 axis=normalize(vec3(1.));\n  float angle=radians(hue);\n  col=col*cos(angle)+cross(axis,col)*sin(angle)+axis*dot(axis,col)*(1.-cos(angle));\n}\ncol*=vec3(1.+temperature*.25,1.,1.-temperature*.25);\ncol=max(col,vec3(0.));\ncol=mix(vec3(dot(col,vec3(.2126,.7152,.0722))),col,saturation)*exposure;\ncol*=mix(1.,.5+.5*pow(max(16.*uv.x*uv.y*(1.-uv.x)*(1.-uv.y),0.),.2),vignette);\nif(intro<1.){\n  float eased=intro*intro*(3.-2.*intro);\n  float edge=mix(-introFeather,1.+introFeather,eased);\n  float reveal=1.-smoothstep(edge-introFeather,edge+introFeather,uv.x);\n  col=mix(vec3(.008,.035,.051),col,reveal);\n}\ncolor=vec4(col,1.);\n}\n";
		const vertex =
			"#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0,1);}";
		// 开场分层揭示只在前几秒需要；完成后改用原始的逐层提前返回，
		// 避免持续在每个像素上执行开场混合与累积逻辑。
		const fragment = (opening: boolean) =>
			"#version 300 es\nprecision highp float;\nuniform vec3 iResolution;uniform float iTime,uFeedback,zoom,offset,amplitude,uDetail,uSamples;uniform sampler2D iChannel0,iChannel1;out vec4 result;\n" +
			(opening
				? cloudTrainOpeningSource(cloudTrainColorizeSource(original))
				: cloudTrainColorizeSource(original))
				.replace(
					"texture(iChannel1, uv).rgb, 0.3",
					"texture(iChannel1, uv).rgb, uFeedback",
				)
				.replace(
					"vec2 uv = fragCoord/iResolution.y;",
					"vec2 uv = (fragCoord/iResolution.y - .5*iResolution.xy/iResolution.y)/zoom + .5*iResolution.xy/iResolution.y; uv.y -= offset;",
				)
				.replaceAll(
					"(fbm(uv2, 8) - 0.5)*disp",
					"(fbm(uv2, 8) - 0.5)*disp*amplitude",
				)
				.replaceAll("i < detail;", "i < min(detail, int(uDetail));")
				.replace("int n = 5;", "int n = int(uSamples);") +
			"\nvoid main(){mainImage(result,gl_FragCoord.xy);}";

		const el = this.#canvas,
			gl = el.getContext("webgl2", {
				alpha: false,
				antialias: false,
				depth: false,
			});
		if (!gl) {
			throw new Error("WebGL 2 is required");
		}
		const programs: WebGLProgram[] = [],
			textures: WebGLTexture[] = [],
			buffers: WebGLBuffer[] = [],
			fbos: WebGLFramebuffer[] = [];
		let raf = 0,
			last = 0,
			time = 0,
			w = 0,
			h = 0,
			read = 0,
			history = false,
			dead = false;
		let introProgress = state.current.paused ? 1 : 0;
		function program(src: string) {
			const p = gl!.createProgram()!;
			programs.push(p);
			for (const [type, source] of [
				[gl!.VERTEX_SHADER, vertex],
				[gl!.FRAGMENT_SHADER, src],
			] as const) {
				const s = gl!.createShader(type)!;
				gl!.shaderSource(s, source);
				gl!.compileShader(s);
				if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
					const e = gl!.getShaderInfoLog(s);
					gl!.deleteShader(s);
					throw Error(e || "Shader error");
				}
				gl!.attachShader(p, s);
				gl!.deleteShader(s);
			}
			gl!.bindAttribLocation(p, 0, "p");
			gl!.linkProgram(p);
			if (!gl!.getProgramParameter(p, gl!.LINK_STATUS))
				throw Error(gl!.getProgramInfoLog(p) || "Link error");
			return p;
		}
		function texture() {
			const t = gl!.createTexture()!;
			textures.push(t);
			gl!.bindTexture(gl!.TEXTURE_2D, t);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
			return t;
		}
		function clean() {
			dead = true;
			cancelAnimationFrame(raf);
			programs.forEach((p) => gl!.deleteProgram(p));
			textures.forEach((t) => gl!.deleteTexture(t));
			buffers.forEach((b) => gl!.deleteBuffer(b));
			fbos.forEach((f) => gl!.deleteFramebuffer(f));
		}
		try {
			// 前景采样的时间跨度保持原有的三分之一；采样次数随设备负载调整。
			const openingScene = program(
				fragment(true).replace(
					"t+4.*float(i)/float(n)/60.",
					"t+(4./3.)*float(i)/float(n)/60.",
				),
			);
			const steadyScene = program(
				fragment(false).replace(
					"t+4.*float(i)/float(n)/60.",
					"t+(4./3.)*float(i)/float(n)/60.",
				),
			);
			const post = program(imageSource);
			const locations = <const T extends readonly string[]>(
				p: WebGLProgram,
				n: T,
			) =>
				Object.fromEntries(
					n.map((k) => [k, gl.getUniformLocation(p, k)]),
				) as Record<T[number], WebGLUniformLocation | null>;
			const tintKeys = ["skyTint", "smokeTint", "trainTint"] as const;
			const sceneUniforms = [
				"iResolution",
				"iTime",
				"iChannel0",
				"iChannel1",
				"uFeedback",
				"zoom",
				"offset",
				"amplitude",
				"uDetail",
				"uSamples",
				"intro",
				"introFeather",
					...tintKeys,
			] as const;
			const openingLocations = locations(openingScene, sceneUniforms);
			const steadyLocations = locations(steadyScene, sceneUniforms);
			const b = locations(post, [
					"resolution",
					"scene",
					"vignette",
					"exposure",
					"saturation",
					"hue",
					"temperature",
					"intro",
					"introFeather",
				]);
			const quad = gl.createBuffer()!;
			buffers.push(quad);
			gl.bindBuffer(gl.ARRAY_BUFFER, quad);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, 3, -1, -1, 3]),
				gl.STATIC_DRAW,
			);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
			// Restore the original deterministic noise; supplied thumbnail is retained as an asset only.
			const noise = texture(),
				data = new Uint8Array(1024 * 1024);
			let seed = 93451;
			for (let i = 0; i < data.length; i++) {
				seed ^= seed << 13;
				seed ^= seed >>> 17;
				seed ^= seed << 5;
				data[i] = seed & 255;
			}
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.R8,
				1024,
				1024,
				0,
				gl.RED,
				gl.UNSIGNED_BYTE,
				data,
			);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			const targets = [texture(), texture()];
			for (const t of targets) {
				gl.bindTexture(gl.TEXTURE_2D, t);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				fbos.push(gl.createFramebuffer()!);
			}
			const media = matchMedia("(prefers-reduced-motion: reduce)");
			function request() {
				if (!dead && !raf && !document.hidden)
					raf = requestAnimationFrame(draw);
			}
			const uniformCache = new Map<WebGLUniformLocation, number | string>();
			function scalar(location: WebGLUniformLocation | null, value: number) {
				if (location && uniformCache.get(location) !== value) {
					gl!.uniform1f(location, value);
					uniformCache.set(location, value);
				}
			}
			function tint(location: WebGLUniformLocation | null, value: string) {
				if (location && uniformCache.get(location) !== value) {
					gl!.uniform3f(location, ...cloudTrainTintRgb(value));
					uniformCache.set(location, value);
				}
			}
			const bounds = el.getBoundingClientRect();
			let cssWidth = bounds.width,
				cssHeight = bounds.height;
			let pixelWidth = 1,
				pixelHeight = 1,
				scale = state.current.resolution;
			// 帧慢时仅降低画布像素和前景采样；噪声细节保持配置的 6 层。
			// 保留 resolution 作为质量上限，设备恢复后再缓慢升回。
			const qualityTiers = [
				{ scale: 1, samples: 5 },
				{ scale: 0.8, samples: 3 },
				{ scale: 0.65, samples: 2 },
				{ scale: 0.5, samples: 1 },
				{ scale: 0.45, samples: 1 },
			] as const;
			let qualityTier = 0;
			let slowFrames = 0;
			let fastDuration = 0;
			let lastQualityChange = 0;
			const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
			function updatePixelSize() {
				const d = Math.min(devicePixelRatio || 1, 1.5) * scale;
				pixelWidth = Math.max(
					1,
					Math.min(maxViewport[0]!, Math.round(cssWidth * d)),
				);
				pixelHeight = Math.max(
					1,
					Math.min(maxViewport[1]!, Math.round(cssHeight * d)),
				);
			}
			updatePixelSize();
			function setQualityTier(next: number, now: number) {
				if (next === qualityTier) return;
				qualityTier = next;
				scale =
					state.current.resolution * (qualityTiers[next] ?? qualityTiers[0]).scale;
				updatePixelSize();
				slowFrames = 0;
				fastDuration = 0;
				lastQualityChange = now;
			}
			// Each texture owns a unit: resize uploads and rendering share this cache.
			let activeUnit = -1;
			const boundTextures = new Map<number, WebGLTexture>();
			function bindTexture(unit: number, t: WebGLTexture) {
				if (boundTextures.get(unit) === t) return;
				if (activeUnit !== unit) {
					gl!.activeTexture(gl!.TEXTURE0 + unit);
					activeUnit = unit;
				}
				gl!.bindTexture(gl!.TEXTURE_2D, t);
				boundTextures.set(unit, t);
			}
			function activate(unit: number) {
				if (activeUnit !== unit) {
					gl!.activeTexture(gl!.TEXTURE0 + unit);
					activeUnit = unit;
				}
			}
			bindTexture(0, noise);
			targets.forEach((t, i) => bindTexture(i + 1, t));
			for (const [sceneProgram, sceneLocations] of [
				[openingScene, openingLocations],
				[steadyScene, steadyLocations],
			] as const) {
				gl.useProgram(sceneProgram);
				gl.uniform1i(sceneLocations.iChannel0, 0);
				gl.uniform1i(sceneLocations.iChannel1, 1);
			}
			gl.useProgram(post);
			gl.uniform1i(b.scene, 2);
			function draw(now: number) {
				raf = 0;
				const s = state.current;
				const frameGap = last ? now - last : 0;
				if (frameGap > 40) {
					slowFrames++;
					fastDuration = 0;
				} else if (frameGap > 0) {
					slowFrames = 0;
					fastDuration = frameGap < 20 ? fastDuration + frameGap : 0;
				}
				if (
					slowFrames >= 2 &&
					now - lastQualityChange > 1200 &&
					qualityTier < qualityTiers.length - 1
				) {
					setQualityTier(qualityTier + 1, now);
				} else if (
					fastDuration > 8000 &&
					now - lastQualityChange > 8000 &&
					qualityTier > 0
				) {
					setQualityTier(qualityTier - 1, now);
				}
				// 开场按实际经过时间推进，慢设备不再把三秒动画拖成几十秒。
				const elapsed = Math.min(frameGap / 1000, 1);
				if (!s.introEnabled || media.matches) introProgress = 1;
				else if (!s.paused)
					introProgress = Math.min(
						1,
						introProgress + elapsed / s.introDuration,
					);
				if (!s.paused && !media.matches)
					time += Math.min(elapsed, 0.1) * s.speed;
				last = now;
				const nw = pixelWidth,
					nh = pixelHeight;
				if (w !== nw || h !== nh) {
					w = nw;
					h = nh;
					el.width = w;
					el.height = h;
					history = false;
					targets.forEach((t, i) => {
						bindTexture(i + 1, t);
						activate(i + 1);
						gl!.texImage2D(
							gl!.TEXTURE_2D,
							0,
							gl!.RGBA,
							w,
							h,
							0,
							gl!.RGBA,
							gl!.UNSIGNED_BYTE,
							null,
						);
						gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbos[i] ?? null);
						gl!.framebufferTexture2D(
							gl!.FRAMEBUFFER,
							gl!.COLOR_ATTACHMENT0,
							gl!.TEXTURE_2D,
							t,
							0,
						);
						gl!.clearColor(0, 0, 0, 1);
						gl!.clear(gl!.COLOR_BUFFER_BIT);
					});
					for (const [sceneProgram, sceneLocations] of [
						[openingScene, openingLocations],
						[steadyScene, steadyLocations],
					] as const) {
						gl!.useProgram(sceneProgram);
						gl!.uniform3f(sceneLocations.iResolution, w, h, 1);
					}
					gl!.useProgram(post);
					gl!.uniform2f(b.resolution, w, h);
					gl!.viewport(0, 0, w, h);
				}
				const write = 1 - read;
				gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbos[write]!);
				// 开场结束后使用保留原始提前返回路径的着色器。
				const opening = introProgress < 1;
				const a = opening ? openingLocations : steadyLocations;
				gl!.useProgram(opening ? openingScene : steadyScene);
				gl!.uniform1i(a.iChannel1, read + 1);
				for (const key of tintKeys) tint(a[key]!, s[key]);
				scalar(a.zoom, s.zoom);
				scalar(a.offset, s.offset);
				scalar(a.amplitude, s.amplitude);
				const quality = qualityTiers[qualityTier] ?? qualityTiers[0];
				scalar(a.uDetail, s.detail);
				scalar(a.uSamples, quality.samples);
				scalar(a.intro, introProgress);
				scalar(a.introFeather, s.introFeather);
				scalar(a.iTime, time);
				scalar(a.uFeedback, history && introProgress >= 1 ? s.feedback : 0);
				gl!.drawArrays(gl!.TRIANGLES, 0, 3);
				gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
				gl!.useProgram(post);
				gl!.uniform1i(b.scene, write + 1);
				scalar(b.intro, 1);
				scalar(b.introFeather, s.introFeather);
				scalar(b.vignette, s.vignette);
				scalar(b.exposure, s.exposure);
				scalar(b.saturation, s.saturation);
				scalar(b.hue, s.hue);
				scalar(b.temperature, s.temperature);
				gl!.drawArrays(gl!.TRIANGLES, 0, 3);
				read = write;
				history = true;
				if (firstFrame) {
					firstFrame = false;
					onFirstFrame();
				}
				if (!s.paused && !media.matches && (s.speed !== 0 || introProgress < 1))
					request();
			}
			const reset = () => {
				cancelAnimationFrame(raf);
				raf = 0;
				last = 0;
				history = false;
				const nextScale =
					state.current.resolution *
					(qualityTiers[qualityTier] ?? qualityTiers[0]).scale;
				if (scale !== nextScale) {
					scale = nextScale;
					updatePixelSize();
				}
				request();
			};
			wake.current = reset;
			let dprQuery: MediaQueryList;
			const dprChanged = () => {
				dprQuery?.removeEventListener("change", dprChanged);
				dprQuery = matchMedia(
					"(resolution: " + (devicePixelRatio || 1) + "dppx)",
				);
				dprQuery.addEventListener("change", dprChanged);
				updatePixelSize();
				reset();
			};
			dprChanged();
			const resize = new ResizeObserver(([entry]) => {
				if (!entry) return;
				cssWidth = entry.contentRect.width;
				cssHeight = entry.contentRect.height;
				updatePixelSize();
				reset();
			});
			resize.observe(el);
			document.addEventListener("visibilitychange", reset);
			media.addEventListener("change", reset);
			request();
			return () => {
				resize.disconnect();
				dprQuery.removeEventListener("change", dprChanged);
				document.removeEventListener("visibilitychange", reset);
				media.removeEventListener("change", reset);
				wake.current = () => {};
				clean();
			};
		} catch (e) {
			clean();
			throw e;
		}
	}
	#lost = (e: Event): void => {
		e.preventDefault();
		this.#cleanup?.();
		this.#cleanup = undefined;
		this.#onError(
			"Cloud Train graphics context interrupted. Waiting to restore…",
		);
	};
	#restored = (): void => {
		try {
			this.#cleanup = this.#start();
			this.#onError(undefined);
		} catch (e) {
			this.#onError(String(e));
		}
	};
	setSettings(s: CloudTrainSettings): void {
		this.#settings.current = s;
		this.#wake.current();
	}
	replay(): void {
		this.#cleanup?.();
		this.#cleanup = this.#start();
	}
	dispose(): void {
		this.#cleanup?.();
		this.#cleanup = undefined;
		this.#canvas.removeEventListener("webglcontextlost", this.#lost);
		this.#canvas.removeEventListener("webglcontextrestored", this.#restored);
	}
}

/** Cloud Train is one scene module; other files in this directory use the same host contract. */
export default function createCloudTrainScene({
	canvas,
	options,
	onFirstFrame,
}: WebGLWallpaperSceneContext): CloudTrainRenderer {
	const renderer = new CloudTrainRenderer(
		canvas.parentElement!,
		canvas,
		settings(options),
		(message) => {
			if (message)
				canvas.closest("#wallpaper-wrapper")?.classList.remove("webgl-ready");
		},
		onFirstFrame,
	);
	return renderer;
}
