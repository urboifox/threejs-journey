import './main.css';
import * as T from 'three';
import { FontLoader, OrbitControls, Sky, TextGeometry } from 'three/addons';

// elements
const canvas = document.getElementById('webgl')!;

// options
const sizes = {
    width: innerWidth,
    height: innerHeight
};

const houseMeasurements = {
    width: 4,
    height: 2.5,
    depth: 4
};

/**
 * Textures
 */
const textureLoader = new T.TextureLoader();

// door
const doorColorTexture = textureLoader.load('/textures/door/color.webp');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.webp');
const doorAmbientOcclusionTexture = textureLoader.load(
    '/textures/door/ambientOcclusion.webp'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.webp');
const doorNormalTexture = textureLoader.load('/textures/door/normal.webp');
const doorMetalnessTexture = textureLoader.load(
    '/textures/door/metalness.webp'
);
const doorRoughnessTexture = textureLoader.load(
    '/textures/door/roughness.webp'
);
doorColorTexture.colorSpace = T.SRGBColorSpace;

// floor
const floorAlphaTexture = textureLoader.load('/textures/floor/alpha.webp');
const floorColorTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp'
);
const floorARMTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp'
);
const floorNormalTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp'
);
const floorDisplacementTexture = textureLoader.load(
    '/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp'
);
floorColorTexture.colorSpace = T.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = T.RepeatWrapping;
floorARMTexture.wrapS = T.RepeatWrapping;
floorNormalTexture.wrapS = T.RepeatWrapping;
floorDisplacementTexture.wrapS = T.RepeatWrapping;

floorColorTexture.wrapT = T.RepeatWrapping;
floorARMTexture.wrapT = T.RepeatWrapping;
floorNormalTexture.wrapT = T.RepeatWrapping;
floorDisplacementTexture.wrapT = T.RepeatWrapping;

// wall
const wallColorTexture = textureLoader.load(
    '/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp'
);
const wallARMTexture = textureLoader.load(
    '/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp'
);
const wallNormalTexture = textureLoader.load(
    '/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp'
);
wallColorTexture.colorSpace = T.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
    '/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp'
);
const roofARMTexture = textureLoader.load(
    '/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp'
);
const roofNormalTexture = textureLoader.load(
    '/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp'
);
roofColorTexture.colorSpace = T.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = T.RepeatWrapping;
roofARMTexture.wrapS = T.RepeatWrapping;
roofNormalTexture.wrapS = T.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
    '/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp'
);
const bushARMTexture = textureLoader.load(
    '/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp'
);
const bushNormalTexture = textureLoader.load(
    '/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp'
);

bushColorTexture.colorSpace = T.SRGBColorSpace;

// Grave
const graveColorTexture = textureLoader.load(
    '/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp'
);
const graveARMTexture = textureLoader.load(
    '/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp'
);
const graveNormalTexture = textureLoader.load(
    '/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp'
);

graveColorTexture.colorSpace = T.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Text
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Fox', {
        font,
        size: 0.3,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    });
    const textMaterial = new T.MeshStandardMaterial();
    const text = new T.Mesh(textGeometry, textMaterial);
    text.position.z = 1.95;
    text.position.y = 2.25;
    text.geometry.center();
    house.add(text);
});

// scene
const scene = new T.Scene();

/**
 * House
 */
// floor
const floor = new T.Mesh(
    new T.PlaneGeometry(20, 20, 100, 100),
    new T.MeshStandardMaterial()
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.material.transparent = true;
floor.material.alphaMap = floorAlphaTexture;
floor.material.map = floorColorTexture;
floor.material.aoMap = floorARMTexture;
floor.material.metalnessMap = floorARMTexture;
floor.material.roughnessMap = floorARMTexture;
floor.material.displacementMap = floorDisplacementTexture;
floor.material.displacementScale = 0.3;
floor.material.displacementBias = -0.2;
floor.material.normalMap = floorNormalTexture;
scene.add(floor);

// house
const house = new T.Group();
scene.add(house);

// walls
const walls = new T.Mesh(
    new T.BoxGeometry(
        houseMeasurements.width,
        houseMeasurements.height,
        houseMeasurements.depth,
        100,
        100
    ),
    new T.MeshStandardMaterial()
);
walls.position.y = houseMeasurements.height / 2;
walls.material.map = wallColorTexture;
walls.material.metalnessMap = wallARMTexture;
walls.material.aoMap = wallARMTexture;
walls.material.roughnessMap = wallARMTexture;
walls.material.metalnessMap = wallARMTexture;
walls.material.normalMap = wallNormalTexture;
house.add(walls);

// roof
const roof = new T.Mesh(
    new T.ConeGeometry(3.5, 1.5, 4),
    new T.MeshStandardMaterial()
);
roof.position.y = houseMeasurements.height + 0.75;
roof.rotation.y = Math.PI / 4;
roof.material.map = roofColorTexture;
roof.material.normalMap = roofNormalTexture;
roof.material.roughnessMap = roofARMTexture;
roof.material.metalnessMap = roofARMTexture;
roof.material.aoMap = roofARMTexture;
house.add(roof);

// door
const door = new T.Mesh(
    new T.PlaneGeometry(2.2, 2.2, 100, 100),
    new T.MeshStandardMaterial({ color: 0x7f7f7f })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
door.material.map = doorColorTexture;
door.material.transparent = true;
door.material.alphaMap = doorAlphaTexture;
door.material.aoMap = doorAmbientOcclusionTexture;
door.material.displacementMap = doorHeightTexture;
door.material.displacementScale = 0.15;
door.material.displacementBias = -0.04;
door.material.normalMap = doorNormalTexture;
door.material.metalnessMap = doorMetalnessTexture;
door.material.roughnessMap = doorRoughnessTexture;
// door.material.metalness = 0.7;
// door.material.roughness = 0.7;
house.add(door);

// Bushes
const bushGeometry = new T.SphereGeometry(1, 16, 16);
const bushMaterial = new T.MeshStandardMaterial({ color: 0xccffcc });
bushMaterial.map = bushColorTexture;
bushMaterial.aoMap = bushARMTexture;
bushMaterial.roughnessMap = bushARMTexture;
bushMaterial.metalnessMap = bushARMTexture;
bushMaterial.normalMap = bushNormalTexture;

const bush1 = new T.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new T.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new T.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new T.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.2);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new T.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new T.MeshStandardMaterial();
graveMaterial.map = graveColorTexture;
graveMaterial.metalnessMap = graveARMTexture;
graveMaterial.roughnessMap = graveARMTexture;
graveMaterial.aoMap = graveARMTexture;
graveMaterial.normalMap = graveNormalTexture;

const graves = new T.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new T.Mesh(graveGeometry, graveMaterial);

    grave.position.x = x;
    grave.position.y = Math.random() * 0.4;
    grave.position.z = z;
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;

    graves.add(grave);
}

/**
 * Light
 */
// ambient light
const ambientLight = new T.AmbientLight(0x86cdff, 0.275);
scene.add(ambientLight);

// directional light
const directionalLight = new T.DirectionalLight(0x86cdff, 1);
directionalLight.position.set(3, 2, -8);
// Mappings
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

const doorLight = new T.PointLight(0xff7d46, 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// sky
const sky = new Sky();
sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
sky.scale.set(100, 100, 100);
scene.add(sky);

// Fog
// scene.fog = new T.Fog('#ff0000', 1, 13)
scene.fog = new T.FogExp2(0x04343f, 0.1);

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
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;
controls.maxPolarAngle = Math.PI / 2 - 0.3;
controls.minPolarAngle = 0.8;
controls.maxDistance = 8;
controls.minDistance = 6;
controls.enableDamping = true;

function update() {
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
