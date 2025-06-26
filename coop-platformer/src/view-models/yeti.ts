import { AnimationAction, AnimationMixer, Vector3 } from 'three';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Player } from './abstract-player';

class Yeti extends Player {
  protected isFirstCamera: boolean = false;
  protected pathToModel: string = 'Yeti.glb';
  protected glft: GLTF;
  protected mixer: AnimationMixer;
  protected animation: AnimationAction;
  protected readonly walkAnimationName = 'CharacterArmature|Walk' as const;
  protected readonly stayAnimationName = 'CharacterArmature|Yes' as const;
  protected readonly runAnimationName = 'CharacterArmature|Run' as const;

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

export const yeti = new Yeti();
