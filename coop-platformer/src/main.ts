import { Clock, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { robot } from './view-models/robot';

// Создаем сцену, камеру и рендерер
export const scene = new Scene();
const clock = new Clock();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const light = new DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

camera.position.z = 10;

robot.init(scene);
function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  robot.renderAnimation(delta);
}
animate();
