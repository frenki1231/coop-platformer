import './style.css'

import { camera } from './init/camera';
import { renderer } from './init/renderer';
import { scene } from './init/scene';
import { generateMap } from './game/map';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

generateMap();

const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material );
cube.position.set(2, 2.5, 3)
scene.add(cube);

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});