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
  protected readonly jumpAnimationName = 'CharacterArmature|Jump' as const;
  protected readonly jumpIdleAnimationName = 'CharacterArmature|Jump_Idle' as const;
  protected readonly deathAnimationName = 'CharacterArmature|Death' as const;
  protected startPosition: Vector3 = new Vector3(1, 3, 3);

  constructor() {
    super();
  }

  protected rotateGlft(): void {
    this.glft.scene.rotateX(Math.PI / 2);
  }
}

export const yeti = new Yeti();
