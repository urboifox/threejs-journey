import GUI from 'lil-gui';
import './main.css';
import * as T from 'three';
import { OrbitControls } from 'three/addons';

// INFO: elements
const canvas = document.getElementById('webgl')!;
const gui = new GUI({ width: 350 });
const scene = new T.Scene();

// INFO: options
const params = {
    width: innerWidth,
    height: innerHeight,
    count: 50000,
    size: 0.01,
    radius: 5,
    branches: 4,
    spin: -0.65,
    randomness: 0.3,
    randomnessPower: 3.5,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
};

// INFO: Galaxy
let geometry: T.BufferGeometry | null = null;
let material: T.PointsMaterial | null = null;
let particles: T.Points | null = null;

function generateGalaxy() {
    if (particles !== null) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(particles);
    }

    geometry = new T.BufferGeometry();
    material = new T.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        vertexColors: true
    });

    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * params.radius;
        const branchAngle =
            ((i % params.branches) / params.branches) * Math.PI * 2;
        const spinAngle = params.spin * radius;

        const randomX =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            params.randomness *
            radius;
        const randomY =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            params.randomness *
            radius;
        const randomZ =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            params.randomness *
            radius;

        const colorInside = new T.Color(params.insideColor);
        const colorOutside = new T.Color(params.outsideColor);
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new T.BufferAttribute(colors, 3));
    particles = new T.Points(geometry, material);
    scene.add(particles);
}
generateGalaxy();

// INFO: controls
gui.add(params, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, 'count')
    .min(1000)
    .max(100000)
    .step(1000)
    .onFinishChange(generateGalaxy);
gui.add(params, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
gui.add(params, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
gui.add(params, 'spin')
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, 'randomness')
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(params, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy);

// INFO: camera
const aspectRatio = params.width / params.height;
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 8;
camera.position.x = -8;
camera.position.y = 8;

// INFO: renderer
const renderer = new T.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(params.width, params.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// INFO: controls
const controls = new OrbitControls(camera, renderer.domElement);

// INFO: frames
function update() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(update);
}
update();

// INFO: events
addEventListener('resize', () => {
    params.width = innerWidth;
    params.height = innerHeight;

    // update camera
    camera.aspect = params.width / params.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(params.width, params.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

addEventListener('dblclick', () => {
    const fullscreenElement =
        document.fullscreenElement ||
        ('webkitFullscreenElement' in document &&
            document.webkitFullscreenElement) ||
        ('mozFullScreenElement' in document && document.mozFullScreenElement);

    if (fullscreenElement) {
        document.exitFullscreen();
    } else {
        if (canvas?.requestFullscreen) {
            canvas.requestFullscreen();
            // @ts-ignore
        } else if (canvas?.webkitRequestFullscreen) {
            // @ts-ignore
            canvas.webkitRequestFullscreen();
            // @ts-ignore
        } else if (canvas?.mozRequestFullScreen) {
            // @ts-ignore
            canvas.mozRequestFullScreen();
        }
    }
});
