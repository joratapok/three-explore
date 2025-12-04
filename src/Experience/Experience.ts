import * as THREE from 'three';

import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { World } from './world/World';
import { Sizes } from './utils/Sizes';
import { Time } from './utils/Time';
import {Debug} from "./utils/Debug";
import {ClickHandler} from "./utils/ClickHandler";
import { Resources } from './utils/Resources';
import { sources } from './sources';

export class Experience {
  public debug: Debug;
  public sizes: Sizes;
  public time: Time;
  public scene: THREE.Scene;
  public clickHandler: ClickHandler;
  public camera: Camera;
  public renderer: Renderer;
  public resources: Resources;
  public world: World;

  constructor(public canvas: HTMLCanvasElement) {
    // Global access
    // @ts-ignore
    window.experience = this;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.clickHandler = new ClickHandler(this);
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.resources = new Resources(sources);
    this.world = new World(this);

    // resize event
    this.sizes.on('resize', this.resize.bind(this));

    // tick event
    this.time.on('tick', this.update.bind(this));

  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');
    this.clickHandler.off('mouseclick');

    // Traverse whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value === 'function') {
            value.dispose();
          }
        }
      }
    })

    this.camera.orbit.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui?.destroy();
    }
  }
}
