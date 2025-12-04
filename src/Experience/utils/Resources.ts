import * as THREE from 'three';
import { EventEmitter } from './EventEmitter.js';
import { GLTFLoader } from "three/addons";
import type {ISourceTypes} from '../sources.ts';
// @ts-ignore
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';

export class Resources extends EventEmitter {
  items: {[key: string]: THREE.Texture | THREE.CubeTexture | GLTF};
  public toLoad: number;
  public loaded: number;
  loaders!: {
    gltfLoader: GLTFLoader,
    textureLoader: THREE.TextureLoader,
    cubeTextureLoader: THREE.CubeTextureLoader,
  };
  ready: boolean;
  constructor(public sources: ISourceTypes[]) {
    super();

    // Setup
    //* @type {[name: string]: file}
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.ready = !(this.sources.length > 0);

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    }
  }

  startLoading() {
    // Load all sources
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltfModel': {
          if (typeof source.path !== 'string') {
            console.error('gltfModel path must be a string');
            break;
          }
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          }, undefined, (e) => console.error('GLTF model load error', e));
          break;
        }
        case 'texture': {
          if (typeof source.path !== 'string') {
            console.error('gltfModel path must be a string');
            break;
          }
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          }, undefined, (e) => console.error('Texture load error', e));
          break;
        }
        case 'cubeTexture': {
          if (!Array.isArray(source.path)) {
            console.error('gltfModel path must be a string');
            break;
          }
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          }, undefined, (e) => console.error('CubeTexture load error', e));
          break;
        }
      }
    }
  }

  sourceLoaded(source: ISourceTypes, file: THREE.Texture | GLTF) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.ready = true;
      this.trigger("ready");
    }
  }
}
