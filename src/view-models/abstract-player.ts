import {
  AnimationMixer,
  Mesh,
  PerspectiveCamera,
  Raycaster,
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
  protected abstract deathAnimationName: string;
  protected abstract pathToModel: string;
  protected abstract glft: GLTF;
  protected abstract mixer: AnimationMixer;
  protected abstract animation: AnimationAction;
  protected abstract startPosition: Vector3;
  protected abstract rotateGlft(): void;

  protected isReadyForJump: boolean = true;
  protected lastAnimation: string = '';
  protected jumpSpeed = 0;
  protected isAlive: boolean = true;
  protected rayCaster = new Raycaster();
  protected downVector = new Vector3(0, -1, 0);
  protected moveVector = new Vector3(0, 0, 1);
  protected scene: Scene;

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
    this.glft.scene.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
    this.glft.scene.add(camera);
    this.scene = scene;
    scene.add(this.glft.scene);
    //this.rotateGlft();
  }

  public renderAnimation(delta: number): void {
    if (!this.glft || !this.mixer) return;
    if (this.isAlive) {
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
    } else {
      const { resetUser } = keyboardControl;
      if (resetUser) {
        keyboardControl.resetUser = false;
        this.resetUser();
      }
    }
    this.mixer.update(delta);
  }

  protected jump(): void {
    this.glft.scene.position.y += this.jumpSpeed;
    this.jumpSpeed -= 0.02;
    this.setJumpAnimation();
    if (this.jumpSpeed < -2) {
      this.setDeath();
      keyboardControl.jump = false;
    }
    if (!this.isFalling()) {
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
      if (this.isCanMove()) {
        this.glft.scene.position.add(vectorAfterRotation);
      }
    } else {
      if (this.animation && this.lastAnimation !== this.stayAnimationName && this.isReadyForJump) {
        this.setStayAnimation();
      }
    }
    if (this.isLava()) {
      this.setDeath();
    }
    if (!keyboardControl.jump) {
      if (this.isFalling()) {
        this.isReadyForJump = false;
        this.falling();
      } else {
        this.isReadyForJump = true;
        this.jumpSpeed = 0;
      }
    }
  }

  protected isFalling(): boolean {
    this.rayCaster.set(this.glft.scene.position, this.downVector);
    const intersects = this.rayCaster.intersectObjects(this.scene.children);
    return intersects.length === 0 || intersects[0].distance > 0.6;
  }

  protected isCanMove(): boolean {
    const rotation = keyboardControl.moveBackward
      ? this.glft.scene.rotation.y
      : this.glft.scene.rotation.y - Math.PI;
    this.moveVector.set(1 * Math.sin(rotation), 0, 1 * Math.cos(rotation));
    this.rayCaster.set(this.glft.scene.position, this.moveVector);
    const intersects = this.rayCaster.intersectObjects(this.scene.children);
    return intersects.length === 0 || intersects[0].distance > 0.5;
  }

  protected isLava(): boolean {
    this.rayCaster.set(this.glft.scene.position, this.downVector);
    const intersects = this.rayCaster.intersectObjects(this.scene.children);
    const mesh = intersects[0]?.object as Mesh;
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    return intersects.length > 0 && intersects[0].distance <= 0.6 && material.userData.type === 'l';
  }

  protected falling(): void {
    this.setAnimation(this.jumpIdleAnimationName);
    this.glft.scene.position.y += this.jumpSpeed;
    this.jumpSpeed -= 0.01;
    if (this.jumpSpeed < -2) {
      this.setDeath();
    }
  }

  protected resetUser(): void {
    this.glft.scene.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z);
    this.isAlive = true;
    this.isReadyForJump = true;
    this.jumpSpeed = 0;
    this.glft.scene.rotation.y = 0;
    this.glft.scene.rotation.x = 0;
    this.glft.scene.rotation.z = 0;
    this.setAnimation(this.stayAnimationName);
  }

  protected setAnimation(name: string, repetitions = Infinity, clampWhenFinished = false): void {
    const animation = this.glft.animations.find((animation) => animation.name === name);
    if (this.lastAnimation === name) return;
    if (animation) {
      this.lastAnimation = name;
      this.mixer.stopAllAction();
      this.animation = this.mixer.clipAction(animation);
      this.animation.repetitions = repetitions;
      this.animation.clampWhenFinished = clampWhenFinished;
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

  protected setDeath(): void {
    this.isAlive = false;
    this.setAnimation(this.deathAnimationName, 1, true);
  }

  protected setJumpAnimation(): void {
    if (this.lastAnimation === this.jumpIdleAnimationName) return;
    this.setAnimation(this.jumpAnimationName, 1);
    if (this.lastAnimation === this.jumpAnimationName && !this.animation.isRunning()) {
      this.setAnimation(this.jumpIdleAnimationName);
    }
  }
}
