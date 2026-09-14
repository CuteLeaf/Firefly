#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
out vec4 color;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float wave = 0.5 + 0.5 * sin(uv.x * 8.0 + iTime * 0.4);
    vec3 sky = mix(vec3(0.02, 0.08, 0.16), vec3(0.08, 0.32, 0.48), uv.y);
    color = vec4(sky + vec3(0.03, 0.07, 0.09) * wave, 1.0);
}
