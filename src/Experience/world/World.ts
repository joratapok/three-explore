import * as THREE from 'three';
import {Earth} from "./Earth.js";
import type {Experience} from '../Experience.ts';

export class World {
  scene: THREE.Scene;
  resources: any;
  earth?: Earth;
  constructor(public experience: Experience) {
    this.scene = experience.scene;
    this.resources = experience.resources;

    this.resources.on('ready', () => {
      this.earth = new Earth(experience);
    });

  }
  update() {
    this?.earth?.update();
  }

  resize() {

  }

}
