import './style.css';

import { renderer } from './init/renderer';
import { scene } from './init/scene';
import { generateMap } from './game/map';
import { BoxGeometry, Clock, Mesh, MeshBasicMaterial } from 'three';
import { renderPlayers, robotCamera, yetiCamera } from './view-models/init';

generateMap();

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const clock = new Clock();
const cube = new Mesh(geometry, material);
cube.position.set(2, 2.5, 3);
scene.add(cube);

function animate() {
  const delta = clock.getDelta();
  renderPlayers(delta);
}
renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  robotCamera.aspect = window.innerWidth / window.innerHeight;
  robotCamera.updateProjectionMatrix();
  yetiCamera.aspect = window.innerWidth / window.innerHeight;
  yetiCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
