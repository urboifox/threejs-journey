import './main.css';
import * as T from 'three';
import { OrbitControls, Timer } from 'three/addons';
import wavesVertexShader from './shaders/waves/vertex.glsl';
import wavesFragmentShader from './shaders/waves/fragment.glsl';
import GUI from 'lil-gui';

// debug
const gui = new GUI();
const options = {
    depthColor: '#186691',
    surfaceColor: '#9bd8ff'
};

// elements
const canvas = document.getElementById('webgl')!;

// options
const sizes = {
    width: innerWidth,
    height: innerHeight
};

// scene
const scene = new T.Scene();

// sea
const sea = new T.Mesh(
    new T.PlaneGeometry(3, 3, 512, 512),
    new T.ShaderMaterial({
        side: T.DoubleSide,
        vertexShader: wavesVertexShader,
        fragmentShader: wavesFragmentShader,
        uniforms: {
            uTime: { value: 0 },

            uElevation: { value: 0.2 },
            uFrequency: { value: new T.Vector2(4, 1.5) },
            uSpeed: { value: 0.75 },

            uSmallWavesElevation: { value: 0.15 },
            uSmallWavesFrequency: { value: 3 },
            uSmallWavesSpeed: { value: 0.2 },
            uSmallWavesIterations: { value: 4 },

            uDepthColor: { value: new T.Color(options.depthColor) },
            uSurfaceColor: { value: new T.Color(options.surfaceColor) },
            uColorMultiplier: { value: 2 },
            uColorOffset: { value: 0.2 }
        }
    })
);
sea.rotation.x = -Math.PI / 2;
scene.add(sea);

// debug options
gui.add(sea.material.uniforms.uElevation, 'value', 0, 1, 0.001).name(
    'Elevation'
);
gui.add(sea.material.uniforms.uFrequency.value, 'x', 0, 10, 0.01).name(
    'Frequency X'
);
gui.add(sea.material.uniforms.uFrequency.value, 'y', 0, 10, 0.01).name(
    'Frequency Y'
);
gui.add(sea.material.uniforms.uSpeed, 'value', 0, 4, 0.001).name('Speed');
gui.addColor(options, 'depthColor')
    .name('Depth Color')
    .onChange(() => {
        sea.material.uniforms.uDepthColor.value.set(options.depthColor);
    });
gui.addColor(options, 'surfaceColor')
    .name('Surface Color')
    .onChange(() => {
        sea.material.uniforms.uSurfaceColor.value.set(options.surfaceColor);
    });
gui.add(sea.material.uniforms.uColorMultiplier, 'value', 0, 10, 0.01).name(
    'Color Multiplier'
);
gui.add(sea.material.uniforms.uColorOffset, 'value', 0, 1, 0.01).name(
    'Color Offset'
);
gui.add(sea.material.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.001).name(
    'Small Waves Elevation'
);
gui.add(sea.material.uniforms.uSmallWavesFrequency, 'value', 0, 10, 0.01).name(
    'Small Waves Frequency'
);
gui.add(sea.material.uniforms.uSmallWavesSpeed, 'value', 0, 4, 0.001).name(
    'Small Waves Speed'
);
gui.add(sea.material.uniforms.uSmallWavesIterations, 'value', 0, 6, 1).name(
    'Small Waves Iterations'
);

// camera
const aspectRatio = sizes.width / sizes.height;
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 2, 3);

// renderer
const renderer = new T.WebGLRenderer({ antialias: true, canvas });
// sky color
renderer.setClearColor(0x88888ff, 1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// frames
const timer = new Timer();
function update() {
    timer.update();
    const elapsedTime = timer.getElapsed();

    // update uTime
    sea.material.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(update);
}
update();

// events
addEventListener('resize', () => {
    sizes.width = innerWidth;
    sizes.height = innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
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
