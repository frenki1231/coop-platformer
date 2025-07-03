import { FogExp2, Scene } from 'three';
import { ambientLight, dirLight, hemLight } from './light';
import { map } from '../game/map';
import { backgroundTexture } from './sky';
import { axesHelper } from './camera';

export const scene = new Scene();

scene.add(ambientLight, dirLight, dirLight.target, hemLight, map, axesHelper);

scene.background = backgroundTexture;
scene.fog = new FogExp2(0x006400, 0.01);