import { AxesHelper, PerspectiveCamera, Vector3 } from "three";

export const camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const cameraOffset = new Vector3(-1, 5, -6);

camera.position.copy(cameraOffset);
camera.lookAt(5, 3, 10);
export const axesHelper = new AxesHelper(5);