import { Clock, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { robot } from './view-models/robot';
import { yeti } from './view-models/yeti';
import { keyboardControl } from './controls/keyboard';

// Создаем сцену, камеру и рендерер
export const scene = new Scene();
const clock = new Clock();
const robotCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const yetiCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const light = new DirectionalLight(0xffffff, 10);
light.position.set(5, 10, 7.5);
scene.add(light);

robot.init(scene, robotCamera);
yeti.init(scene, yetiCamera);
function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  setUpCamera();
  robot.renderAnimation(delta);
  yeti.renderAnimation(delta);
}
animate();

function setUpCamera() {
  renderer.clear();
  const { firstCamera } = keyboardControl;
  if (firstCamera) {
    renderCamera(robotCamera, yetiCamera);
  } else {
    renderCamera(yetiCamera, robotCamera);
  }
}

function renderCamera(camera1: PerspectiveCamera, camera2: PerspectiveCamera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setScissorTest(true);
  renderer.setViewport(0, 0, width, height);
  renderer.setScissor(0, 0, width, height);
  renderer.render(scene, camera1);
  const miniWidth = width / 5;
  const miniHeight = height / 5;
  renderer.setViewport(0, height - miniHeight, miniWidth, miniHeight);
  renderer.setScissor(0, height - miniHeight, miniWidth, miniHeight);
  renderer.render(scene, camera2);
}
