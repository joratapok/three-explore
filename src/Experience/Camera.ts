import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {Experience} from './Experience.ts';

export class Camera {
  instance: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  sizes: { width: number; height: number };
  orbit!: OrbitControls;
  constructor(public experience: Experience) {
    this.sizes = experience.sizes;
    this.scene = experience.scene;
    this.canvas = experience.canvas;

    this.instance = new THREE.PerspectiveCamera(
      25,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    this.setup();
    this.orbitControl();
  }

  setup() {
    this.instance.position.set(12, 5, 4);
    this.scene.add(this.instance);
  }

  orbitControl() {
    this.orbit = new OrbitControls(
      this.instance,
      this.canvas
    );
    this.orbit.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbit.update();
  }
}
