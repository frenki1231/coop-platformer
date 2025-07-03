import { AnimationAction, AnimationMixer } from 'three';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Player } from './abstract-player';

class Robot extends Player {
  protected isFirstCamera: boolean = true;
  protected pathToModel: string = 'Animated Robot.glb';
  protected glft: GLTF;
  protected mixer: AnimationMixer;
  protected animation: AnimationAction;
  protected readonly walkAnimationName = 'RobotArmature|Robot_Walking' as const;
  protected readonly stayAnimationName = 'RobotArmature|Robot_Yes' as const;
  protected readonly runAnimationName = 'RobotArmature|Robot_Running' as const;
  protected readonly jumpAnimationName = 'RobotArmature|Robot_Jump' as const;
  protected readonly jumpIdleAnimationName = 'RobotArmature|Robot_Idle' as const;

  constructor() {
    super();
  }

  protected rotateGlft(): void {
    this.glft.scene.rotateX(Math.PI / 2);
  }
}

export const robot = new Robot();
