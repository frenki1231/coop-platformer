import {
  AnimationMixer,
  PerspectiveCamera,
  Vector3,
  type AnimationAction,
  type Scene,
} from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { keyboardControl } from '../controls/keyboard';

export abstract class Player {
  protected abstract isFirstCamera: boolean;
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

  async init(scene: Scene, camera: PerspectiveCamera): Promise<void> {
    camera.rotateY(Math.PI);
    camera.rotateX(-Math.PI / 5);
    camera.position.set(0, 7, -10);
    const loader = new GLTFLoader();
    this.glft = await loader.loadAsync(this.pathToModel);
    this.mixer = new AnimationMixer(this.glft.scene);
    this.animation = this.mixer.clipAction(this.glft.animations[0]);
    this.animation.play();
    this.lastAnimation = this.glft.animations[0].name;
    this.glft.scene.position.set(0, 0, 0);
    this.glft.scene.add(camera);
    scene.add(this.glft.scene);
    //this.rotateGlft();
  }

  public renderAnimation(delta: number): void {
    if (!this.glft || !this.mixer) return;
    const vector = keyboardControl.getVector();
    const { firstCamera } = keyboardControl;
    if (firstCamera === this.isFirstCamera) {
      const cloneVector = vector.clone();
      if (!cloneVector.equals(new Vector3(0, 0, 0))) {
        if (keyboardControl.run) {
          this.setRunAnimation();
        } else {
          this.setWalkAnimation();
        }
        if (cloneVector.x > 0) {
          this.glft.scene.rotation.y += Math.PI / 100;
        } else if (cloneVector.x < 0) {
          this.glft.scene.rotation.y -= Math.PI / 100;
        }
        const vectorAfterRotation = new Vector3(
          cloneVector.z * Math.sin(this.glft.scene.rotation.y),
          0,
          cloneVector.z * Math.cos(this.glft.scene.rotation.y)
        ).normalize();
        const speed = keyboardControl.run ? 2 : 1;
        vectorAfterRotation.multiplyScalar(delta * speed);
        this.glft.scene.position.add(vectorAfterRotation);
      } else {
        if (this.animation && this.lastAnimation !== this.stayAnimationName) {
          this.setStayAnimation();
        }
      }
    } else {
      this.setStayAnimation();
    }
    this.mixer.update(delta);
  }

  protected setAnimation(name: string): void {
    const animation = this.glft.animations.find((animation) => animation.name === name);
    if (this.lastAnimation === name) return;
    if (animation) {
      this.lastAnimation = name;
      this.mixer.stopAllAction();
      this.animation = this.mixer.clipAction(animation);
      this.animation.play();
    }
  }
}
