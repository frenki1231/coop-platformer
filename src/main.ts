import './style.css'

import { camera } from './init/camera';
import { renderer } from './init/renderer';
import { scene } from './init/scene';

function animate() {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});