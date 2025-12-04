import * as THREE from 'three';
import GUI from 'lil-gui';
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import type {Experience} from '../Experience.ts';

export class Earth {
  scene: THREE.Scene;
  time: Experience['time'];
  resources: Experience['resources'];
  debug: Experience['debug'];
  geometry!: THREE.SphereGeometry;
  material!: THREE.ShaderMaterial;
  instance!: THREE.Mesh;

  private dayTexture!: THREE.Texture;
  private nightTexture!: THREE.Texture;
  private specularTexture!: THREE.Texture;
  private atmosphereMaterial!: THREE.ShaderMaterial;
  private atmosphere!: THREE.Mesh;
  private sunSpherical!: THREE.Spherical;
  private sunDirection!: THREE.Vector3;
  debugSun!: THREE.Mesh;
  debugFolder?: GUI;

  constructor(public experience: Experience) {
    this.scene = experience.scene;
    this.time = experience.time;
    this.resources = experience.resources;
    this.debug = experience.debug;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
    this.createAtmosphere();
    this.createSun();
  }

  createGeometry() {
    this.geometry = new THREE.SphereGeometry(2, 64, 64);
  }
  createMaterial() {
    // Textures
    this.dayTexture = this.resources.items['dayTexture'];
    this.dayTexture.colorSpace = THREE.SRGBColorSpace;
    this.dayTexture.anisotropy = 8;
    this.nightTexture = this.resources.items['nightTexture'];
    this.nightTexture.colorSpace = THREE.SRGBColorSpace;
    this.nightTexture.anisotropy = 8;
    this.specularTexture = this.resources.items['specularTexture'];
    this.specularTexture.anisotropy = 8;
    this.specularTexture.wrapS = THREE.RepeatWrapping;
    this.specularTexture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uDayTexture: new THREE.Uniform(this.dayTexture),
        uNightTexture: new THREE.Uniform(this.nightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(this.specularTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3()),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color('#00aaff')),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color('#ff6600')),
      }
    });
  }
  createMesh() {
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.instance);
  }

  createAtmosphere() {
    this.atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uSunDirection: new THREE.Uniform(new THREE.Vector3()),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color('#00aaff')),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color('#ff6600')),
      },
      side: THREE.BackSide,
      transparent: true,
    });
    this.atmosphere = new THREE.Mesh(this.geometry, this.atmosphereMaterial);
    this.atmosphere.scale.set(1.04, 1.04, 1.04);
    this.scene.add(this.atmosphere);
  }

  createSun() {
    this.sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
    this.sunDirection = new THREE.Vector3();

    // Debug
    this.debugSun = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.1, 2),
        new THREE.MeshBasicMaterial()
    );
    this.scene.add(this.debugSun);

    // Update
    const updateSun = () => {
      this.sunDirection.setFromSpherical(this.sunSpherical);
      this.debugSun.position
        .copy(this.sunDirection)
        .multiplyScalar(5);
      this.material.uniforms.uSunDirection.value.copy(this.sunDirection);
      this.atmosphereMaterial.uniforms.uSunDirection.value.copy(this.sunDirection);
    }
    updateSun();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('earth');
      this.debugFolder
        ?.add(this.sunSpherical, 'phi')
        .min(0)
        .max(Math.PI)
        .onChange(updateSun);
      this.debugFolder
        ?.add(this.sunSpherical, 'theta')
        .min(-Math.PI)
        .max(Math.PI)
        .onChange(updateSun);
    }
  }

  update() {
    this.instance.rotation.y = (this.time.elapsed / 1000) * 0.1;
    this.material.uniforms.uTime.value = this.time.elapsed;
  }
}
