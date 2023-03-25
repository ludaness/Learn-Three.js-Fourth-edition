import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import {
  AmbientLight, BoxGeometry,
  DirectionalLight,
  Fog, Mesh, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial,
  PerspectiveCamera, PlaneBufferGeometry,
  Scene,
  sRGBEncoding, TorusKnotBufferGeometry,
  VSMShadowMap,
  WebGLRenderer
} from 'three'

// Note: This is just a getting started example. For the other examples
// we reuse the basic components by extracting them to a set of common
// JavaScript modules / files.

// basic scene setup
const scene = new Scene();
// scene.backgroundColor = 0xc3c5c5;
scene.fog = new Fog(0xf8f8f8, 0.0025, 50);

// setup camera
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 10;
camera.position.z = 10;
camera.position.y = 2;

// setup the renderer and attach to canvas
const renderer = new WebGLRenderer({ antialias: true });
renderer.outputEncoding = sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf3f3f3);
document.body.appendChild(renderer.domElement);

// add lights
scene.add(new AmbientLight(0x666666));

const dirLight = new DirectionalLight(0xaaaaaa);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.intensity = 1;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.radius = 4;
dirLight.shadow.bias = -0.0005;

scene.add(dirLight);

// add orbitcontrols
const controller = new OrbitControls(camera, renderer.domElement);
controller.enableDamping = true;
controller.dampingFactor = 0.05;
controller.minDistance = 3;
controller.maxDistance = 100;
controller.minPolarAngle = Math.PI / 4;
controller.maxPolarAngle = (3 * Math.PI) / 4;

// create a cube and torus knot and add them to the scene
const cubeGeometry = new BoxGeometry();
const cubeMaterial = new MeshPhongMaterial({ color: 0x0000ff });
const cube = new Mesh(cubeGeometry, cubeMaterial);
const cube2 = new Mesh(cubeGeometry, cubeMaterial);

cube.position.x = -1;
cube.castShadow = true;
scene.add(cube);

cube2.position.x = -4;
cube2.castShadow = true;
scene.add(cube2);



const torusKnotGeometry = new TorusKnotBufferGeometry(0.5, 0.2, 100, 100);
const torusKnotMat = new MeshStandardMaterial({
  color: 0x00ff88,
  roughness: 0.1,
});
const torusKnotMesh = new Mesh(torusKnotGeometry, torusKnotMat);

torusKnotMesh.castShadow = true;
torusKnotMesh.position.x = 2;
scene.add(torusKnotMesh);

// create a very large ground plane
const groundGeometry = new PlaneBufferGeometry(10000, 10000);
const groundMaterial = new MeshLambertMaterial({
  color: 0xf8f8f8,
});
const groundMesh = new Mesh(groundGeometry, groundMaterial);
groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// add stats
const stats = Stats();
document.body.appendChild(stats.dom);

// add gui
const gui = new GUI();
const props = {
  cubeSpeed: 0.01,
  torusSpeed: 0.03,
};

gui.add(props, 'cubeSpeed', -0.2, 0.2, 0.01)
gui.add(props, 'torusSpeed', -0.2, 0.2, 0.01)
gui.add(props, 'step', 0, 4, 0.01)

renderer.render(scene, camera);

// render the scene
let step = 0;
function animate() {
  renderer.render(scene, camera);
  stats.update();

  cube.rotation.x += props.cubeSpeed + 0.03;
  cube.rotation.y += props.cubeSpeed  + 0.03;
  cube.rotation.z += props.cubeSpeed + 0.03;

  cube2.rotation.x += props.cubeSpeed;
  cube2.rotation.y += props.cubeSpeed;
  cube2.rotation.z += props.cubeSpeed;

  torusKnotMesh.rotation.x -= props.torusSpeed;
  torusKnotMesh.rotation.y += props.torusSpeed;
  torusKnotMesh.rotation.z -= props.torusSpeed;
  // uncomment this to have the cube jump around

    step += 0.04;
    cube.position.x = 4*(Math.cos(step));
    cube.position.y = 4*Math.abs(Math.sin(step));
  controller.update();

  requestAnimationFrame(animate);
}
animate();
