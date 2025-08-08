import './main.css';
import * as T from 'three';
import { OrbitControls, Timer } from 'three/addons';
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';

// elements
const canvas = document.getElementById('webgl')!;

// options
const sizes = {
    width: innerWidth,
    height: innerHeight
};

// scene
const scene = new T.Scene();

const aspectRatio = sizes.width / sizes.height;
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3;

// renderer
const renderer = new T.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// elements
const plane = new T.Mesh(
    new T.PlaneGeometry(10, 10),
    new T.RawShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader
    })
);
plane.position.z = -10;
scene.add(plane);

// frames
const timer = new Timer();
function update() {
    timer.update();

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
