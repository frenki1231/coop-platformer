import { PerspectiveCamera } from 'three';
import { robot } from './robot';
import { yeti } from './yeti';
import { keyboardControl } from '../controls/keyboard';
import { scene } from '../init/scene';
import { renderer } from '../init/renderer';

export const robotCamera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
export const yetiCamera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

robot.init(scene, robotCamera);
yeti.init(scene, yetiCamera);
export function renderPlayers(delta: number) {
  setUpCamera();
  robot.renderAnimation(delta);
  yeti.renderAnimation(delta);
}

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
