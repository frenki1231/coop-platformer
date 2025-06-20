import { Vector3 } from 'three';

class KeyboardControl {
  public moveForward: boolean = false;
  public moveBackward: boolean = false;
  public moveLeft: boolean = false;
  public moveRight: boolean = false;
  public jump: boolean = false;
  public run: boolean = false;

  constructor() {
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = true;
          this.moveBackward = false;
          break;
        case 'KeyA':
          this.moveLeft = true;
          this.moveRight = false;
          break;
        case 'KeyS':
          this.moveForward = false;
          this.moveBackward = true;
          break;
        case 'KeyD':
          this.moveRight = true;
          this.moveLeft = false;
          break;
        case 'Space':
          this.jump = true;
          break;
        case 'ShiftLeft':
          this.run = true;
          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = false;
          break;
        case 'KeyA':
          this.moveLeft = false;
          break;
        case 'KeyS':
          this.moveBackward = false;
          break;
        case 'KeyD':
          this.moveRight = false;
          break;
        case 'Space':
          this.jump = false;
          break;
        case 'ShiftLeft':
          this.run = false;
          break;
      }
    });
  }

  public getVector(): Vector3 {
    const speed = this.run ? 2 : 1;
    return new Vector3(
      (this.moveRight ? speed : 0) - (this.moveLeft ? speed : 0),
      (this.moveForward ? speed : 0) - (this.moveBackward ? speed : 0),
      0
    );
  }
}

export const keyboardControl = new KeyboardControl();
