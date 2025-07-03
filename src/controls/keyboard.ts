import { Vector3 } from 'three';

class KeyboardControl {
  public moveForward: boolean = false;
  public moveBackward: boolean = false;
  public moveLeft: boolean = false;
  public moveRight: boolean = false;
  public jump: boolean = false;
  public run: boolean = false;
  public firstCamera: boolean = false;

  constructor() {
    window.addEventListener('keypress', (event) => {
      switch (event.code) {
        case 'KeyQ':
          this.firstCamera = !this.firstCamera;
          break;
        case 'Space':
          this.jump = true;
          break;
      }
    });

    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = false;
          this.moveBackward = true;
          break;
        case 'KeyA':
          this.moveLeft = false;
          this.moveRight = true;
          break;
        case 'KeyS':
          this.moveForward = true;
          this.moveBackward = false;
          break;
        case 'KeyD':
          this.moveLeft = true;
          this.moveRight = false;
          break;
        case 'ShiftLeft':
          this.run = true;
          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyW':
          this.moveBackward = false;
          break;
        case 'KeyA':
          this.moveRight = false;
          break;
        case 'KeyS':
          this.moveForward = false;
          break;
        case 'KeyD':
          this.moveLeft = false;
          break;
        case 'ShiftLeft':
          this.run = false;
          break;
      }
    });
  }

  public getVector(): Vector3 {
    return new Vector3(
      (this.moveRight ? 1 : 0) - (this.moveLeft ? 1 : 0),
      0,
      (this.moveBackward ? 1 : 0) - (this.moveForward ? 1 : 0)
    );
  }
}

export const keyboardControl = new KeyboardControl();
