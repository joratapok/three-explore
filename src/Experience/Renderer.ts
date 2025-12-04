import * as THREE from 'three';
import type {Experience} from './Experience.ts';

export class Renderer {
  public instance: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  private readonly scene: THREE.Scene;
  readonly sizes: {width: number; height: number};
  readonly camera: Experience['camera'];
  constructor(public experience: Experience) {
    this.canvas = experience.canvas;
    this.scene = experience.scene;
    this.sizes = experience.sizes;
    this.camera = experience.camera;
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.setup();
  }

  setup() {
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 0.9;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor('#000011');
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
