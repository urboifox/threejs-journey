import './main.css';
import * as T from 'three';
import { OrbitControls, Timer } from 'three/addons';

// elements
const canvas = document.getElementById('webgl')!;

// options
const sizes = {
    width: innerWidth,
    height: innerHeight
};

// scene
const scene = new T.Scene();

// particles
// geometry
const particlesGeometry = new T.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));

// material
const particlesMaterial = new T.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    color: 0xffffff
});

// points
const particles = new T.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// camera
const aspectRatio = sizes.width / sizes.height;
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3;

// renderer
const renderer = new T.WebGLRenderer({ antialias: true, canvas });
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

    particles.rotation.y = elapsedTime * 0.01;

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
