import { AnimationMixer, Vector3, type AnimationAction, type Scene } from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { keyboardControl } from '../controls/keyboard';

export abstract class Player {
  protected abstract walkAnimationName: string;
  protected abstract stayAnimationName: string;
  protected abstract runAnimationName: string;
  protected abstract pathToModel: string;
  protected lastAnimation: string = '';
  protected abstract glft: GLTF;
  protected abstract mixer: AnimationMixer;
  protected abstract animation: AnimationAction;
  protected abstract setRunAnimation(): void;
  protected abstract setStayAnimation(): void;
  protected abstract setWalkAnimation(): void;
  protected abstract rotateGlft(): void;

  async init(scene: Scene): Promise<void> {
    const loader = new GLTFLoader();
    this.glft = await loader.loadAsync(this.pathToModel);
    this.mixer = new AnimationMixer(this.glft.scene);
    this.animation = this.mixer.clipAction(this.glft.animations[0]);
    this.animation.play();
    this.lastAnimation = this.glft.animations[0].name;
    scene.add(this.glft.scene);
    this.glft.scene.position.set(0, 0, 0);
    this.rotateGlft();
    console.log(this.glft.animations.map((animation) => animation.name));
  }
  public renderAnimation(delta: number): void {
    const vector = keyboardControl.getVector();
    const cloneVector = vector.clone();
    cloneVector.multiplyScalar(delta);
    if (!cloneVector.equals(new Vector3(0, 0, 0))) {
      if (keyboardControl.run) {
        this.setRunAnimation();
      } else {
        this.setWalkAnimation();
      }
      if (this.glft) {
        this.glft.scene.position.add(cloneVector);
      }
    } else {
      if (this.animation && this.lastAnimation !== this.stayAnimationName) {
        this.animation.repetitions = 0;
        if (!this.animation.isRunning()) {
          this.setStayAnimation();
        }
      }
    }
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  protected setAnimation(name: string): void {
    const animation = this.glft.animations.find((animation) => animation.name === name);
    if (this.lastAnimation === name) return;
    if (animation) {
      this.lastAnimation = name;
      this.mixer.stopAllAction();
      this.animation = this.mixer.clipAction(animation);
      this.animation.play();
      this.animation.repetitions = Infinity;
    }
  }
}
