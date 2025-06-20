import { AnimationAction, AnimationMixer, Vector3 } from 'three';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Player } from './abstract-player';

class Robot extends Player {
  protected pathToModel: string = 'Animated Robot.glb';
  protected glft: GLTF;
  protected mixer: AnimationMixer;
  protected animation: AnimationAction;
  protected readonly walkAnimationName = 'RobotArmature|Robot_Walking' as const;
  protected readonly stayAnimationName = 'RobotArmature|Robot_Yes' as const;
  protected readonly runAnimationName = 'RobotArmature|Robot_Running' as const;

  constructor() {
    super();
  }

  protected rotateGlft(): void {
    this.glft.scene.rotateX(Math.PI / 2);
  }

  protected setRunAnimation(): void {
    this.setAnimation(this.runAnimationName);
  }

  protected setStayAnimation(): void {
    this.setAnimation(this.stayAnimationName);
  }

  protected setWalkAnimation(): void {
    this.setAnimation(this.walkAnimationName);
  }
}

export const robot = new Robot();
