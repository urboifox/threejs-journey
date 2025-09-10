varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // vec3 pattern1 = vec3(vUv, 1);
    // vec3 pattern2 = vec3(vUv, 0);
    // vec3 pattern3 = vec3(vUv.x);
    // vec3 pattern4 = vec3(vUv.y);
    // vec3 pattern5 = vec3(1.0 - vUv.y);
    // vec3 pattern6 = vec3(vUv.y * 10.0);
    // vec3 pattern7 = vec3(mod(vUv.y * 10.0, 1.0));
    // vec3 pattern8 = vec3(step(0.5, mod(vUv.y * 10.0, 1.0)));
    // vec3 pattern9 = vec3(step(0.8, mod(vUv.y * 10.0, 1.0)));
    // vec3 pattern10 = vec3(step(0.8, mod(vUv.x * 10.0, 1.0)));
    // vec3 pattern11 = vec3(step(0.8, mod(vUv.x * 10.0, 1.0))) + vec3(step(0.8, mod(vUv.y * 10.0, 1.0)));
    // vec3 pattern12 = vec3(step(0.8, mod(vUv.x * 10.0, 1.0))) * vec3(step(0.8, mod(vUv.y * 10.0, 1.0)));
    // vec3 pattern13 = vec3(step(0.4, mod(vUv.x * 10.0, 1.0))) * vec3(step(0.8, mod(vUv.y * 10.0, 1.0)));

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    // vec3 pattern14 = vec3(barY + barX);

    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));
    // vec3 pattern15 = vec3(barY + barX);

    // vec3 pattern16 = vec3(abs(vUv.x - 0.5));
    // vec3 pattern17 = vec3(min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // vec3 pattern18 = vec3(max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // vec3 pattern19 = vec3(step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))));
    // vec3 pattern20 = vec3(step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))));
    // vec3 pattern21 = vec3(floor(vUv.x * 10.0) / 10.0);
    // vec3 pattern22 = vec3(floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0);
    // vec3 pattern23 = vec3(random(vUv));

    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );
    // vec3 pattern24 = vec3(random(gridUv));

    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
    // );
    // vec3 pattern25 = vec3(random(gridUv));

    vec3 pattern26 = vec3(distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(pattern26, 1.0);
}
