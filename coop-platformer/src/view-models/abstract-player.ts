import {
  AnimationMixer,
  PerspectiveCamera,
  Vector3,
  type AnimationAction,
  type Scene,
} from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { keyboardControl } from '../controls/keyboard';
import { JUMP_SPEED, RUN_SPEED, WALK_SPEED } from '../constants/moving';

export abstract class Player {
  protected abstract isFirstCamera: boolean;
  protected abstract walkAnimationName: string;
  protected abstract stayAnimationName: string;
  protected abstract runAnimationName: string;
  protected abstract jumpAnimationName: string;
  protected abstract jumpIdleAnimationName: string;
  protected abstract pathToModel: string;
  protected lastAnimation: string = '';
  protected abstract glft: GLTF;
  protected abstract mixer: AnimationMixer;
  protected abstract animation: AnimationAction;
  protected abstract rotateGlft(): void;
  protected isReadyForJump: boolean = true;
  protected jumpSpeed = 0;

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
    console.log(this.glft.animations);
    //this.rotateGlft();
  }

  public renderAnimation(delta: number): void {
    if (!this.glft || !this.mixer) return;
    const { firstCamera, jump } = keyboardControl;
    if (firstCamera === this.isFirstCamera) {
      this.move(delta);
      if (jump) {
        if (this.isReadyForJump) {
          this.isReadyForJump = false;
          this.jumpSpeed = JUMP_SPEED;
        }
        this.jump();
      }
    } else {
      this.setStayAnimation();
    }
    this.mixer.update(delta);
  }

  protected jump(): void {
    this.glft.scene.position.y += this.jumpSpeed;
    this.jumpSpeed -= 0.02;
    this.setJumpAnimation();
    if (this.glft.scene.position.y <= 0) {
      this.isReadyForJump = true;
      keyboardControl.jump = false;
    }
  }

  protected move(delta: number): void {
    const vector = keyboardControl.getVector();
    const cloneVector = vector.clone();
    if (!cloneVector.equals(new Vector3(0, 0, 0))) {
      if (this.isReadyForJump) {
        if (keyboardControl.run) {
          this.setRunAnimation();
        } else {
          this.setWalkAnimation();
        }
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
      const speed = keyboardControl.run ? RUN_SPEED : WALK_SPEED;
      vectorAfterRotation.multiplyScalar(delta * speed);
      this.glft.scene.position.add(vectorAfterRotation);
    } else {
      if (this.animation && this.lastAnimation !== this.stayAnimationName && this.isReadyForJump) {
        this.setStayAnimation();
      }
    }
  }

  protected setAnimation(name: string, repetitions = Infinity): void {
    const animation = this.glft.animations.find((animation) => animation.name === name);
    if (this.lastAnimation === name) return;
    if (animation) {
      this.lastAnimation = name;
      this.mixer.stopAllAction();
      this.animation = this.mixer.clipAction(animation);
      this.animation.repetitions = repetitions;
      this.animation.play();
    }
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

  protected setJumpAnimation(): void {
    if (this.lastAnimation === this.jumpIdleAnimationName) return;
    this.setAnimation(this.jumpAnimationName, 1);
    if (this.lastAnimation === this.jumpAnimationName && !this.animation.isRunning()) {
      this.setAnimation(this.jumpIdleAnimationName, Infinity);
    }
  }
}
