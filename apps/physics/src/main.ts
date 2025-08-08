import './main.css';
import * as T from 'three';
import CANNON from 'cannon';
import GUI from 'lil-gui';
import { OrbitControls, Timer } from 'three/addons';

// elements
const canvas = document.getElementById('webgl')!;

// options
const sizes = {
    width: innerWidth,
    height: innerHeight
};

const gui = new GUI();
const scene = new T.Scene();
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const hitSound = new Audio('/hit.mp3');
function playHitSound(collision: CANNON.ICollisionEvent) {
    const strength = collision.contact.getImpactVelocityAlongNormal();
    if (strength < 1.5) return;
    hitSound.volume = Math.min(1, strength / 10);
    hitSound.currentTime = 0;
    hitSound.play();
}

// materials
const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// camera
const aspectRatio = sizes.width / sizes.height;
const camera = new T.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 7;
camera.position.y = 5;
camera.position.x = -7;

// renderer
const renderer = new T.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// light
const ambient = new T.AmbientLight(0xffffff, 1);
const light = new T.DirectionalLight(0xffffff, 3);
light.position.set(15, 15, 15);
light.castShadow = true;
scene.add(ambient, light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// floor
const groundSize = 10;
const ground = new T.Mesh(
    new T.PlaneGeometry(groundSize, groundSize),
    new T.MeshStandardMaterial({ color: 0x444444, side: T.DoubleSide })
);
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
    shape: groundShape
});
ground.position.y = -0.05;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

scene.add(ground);
world.addBody(groundBody);

// utils
const objectsToUpdate: { body: CANNON.Body; mesh: T.Mesh }[] = [];
const ballGeometry = new T.SphereGeometry(1, 32, 32);
const ballMaterial = new T.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.3,
    roughness: 0.4
});
const boxGeometry = new T.BoxGeometry(1, 1, 1);
const boxMaterial = new T.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.3,
    roughness: 0.4
});

function createBall(
    radius: number,
    position: { x: number; y: number; z: number }
) {
    const mesh = new T.Mesh(ballGeometry, ballMaterial);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(new T.Vector3(position.x, position.y, position.z));
    scene.add(mesh);

    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        shape,
        position: new CANNON.Vec3(0, 3, 0)
    });
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    // save in objectsToUpdate
    objectsToUpdate.push({ mesh, body });
}
function createBox(
    width: number,
    height: number,
    depth: number,
    position: { x: number; y: number; z: number }
) {
    const mesh = new T.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(new T.Vector3(position.x, position.y, position.z));
    scene.add(mesh);

    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    const body = new CANNON.Body({
        mass: 1,
        shape,
        position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    // save in objectsToUpdate
    objectsToUpdate.push({ mesh, body });
}

const debug = {
    createBall: () =>
        createBall(Math.random() * 0.5 + 0.2, {
            x: (Math.random() - 0.5) * 3,
            y: 5,
            z: (Math.random() - 0.5) * 3
        }),
    createBox: () =>
        createBox(Math.random(), Math.random(), Math.random(), {
            x: (Math.random() - 0.5) * 3,
            y: 5,
            z: (Math.random() - 0.5) * 3
        }),
    reset: () => {
        objectsToUpdate.forEach(({ body, mesh }) => {
            body.removeEventListener('collide', playHitSound);
            world.remove(body);
            scene.remove(mesh);
        });
    }
};

const debugGui = gui.addFolder('Debug');
debugGui.add(debug, 'createBall');
debugGui.add(debug, 'createBox');
debugGui.add(debug, 'reset');

createBall(0.5, { x: 0, y: 5, z: 0 });

// tick
const timer = new Timer();
function tick() {
    timer.update();

    // update physics
    world.step(1 / 60);

    // update objects
    objectsToUpdate.forEach(({ body, mesh }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(tick);
}
tick();

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

addEventListener('dblclick', (e) => {
    if (e.target !== canvas) return;
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
