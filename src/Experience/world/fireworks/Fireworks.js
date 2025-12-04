import * as THREE from "three";

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import {AnimationProgress} from "../../utils/AnimationProgress.js";
import {Time} from "../../utils/Time.js";

export class Fireworks {
  /**
   * Creates a new instance of Fireworks
   * @param {Object} experience - The main experience object (typically from your app).
   * @param {number} count - Number of particles.
   * @param {THREE.Vector3} [position=new THREE.Vector3()] - Base position for the group.
   * @param {number} [size=50] - Scale/size of each instance.
   * @param {number} [radius=1]
   * @param {THREE.Color} [color=new THREE.Color('#8affff')] - Base color for the particles.
   * @param {Function} [onDestroy] - Base color for the particles.
   */
  constructor(
    experience,
    count,
    position = new THREE.Vector3(),
    size = 0.5,
    radius = 1,
    color = new  THREE.Color('#8affff'),
    onDestroy
  ) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;
    this.sizes = experience.sizes
    this.texture = this.getRandomTexture();
    this.resolution = new THREE.Vector2(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio);
    this.onDestroy = onDestroy;

    // props
    this.count = count;
    this.position = position;
    this.size = size;
    this.radius = radius;
    this.color = color;

    this.createGeometry();
    this.createMaterial();
    this.createPoints();
    this.createAnimationProgress();
  }

  createGeometry() {
    this.positionsArray = new Float32Array(this.count * 3);
    this.sizesArray = new Float32Array(this.count);
    this.timeMultiplierArray = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const spherical = new THREE.Spherical(
        this.radius,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );

      // Распределение по сфере
      const position = new THREE.Vector3();
      position.setFromSpherical(spherical)
      this.positionsArray[i3    ] = position.x;
      this.positionsArray[i3 + 1] = position.y;
      this.positionsArray[i3 + 2] = position.z;

      // Распределение от -0.5 до 0.5 (куб)
      // this.positionsArray[i3    ] = Math.random() - 0.5;
      // this.positionsArray[i3 + 1] = Math.random() - 0.5;
      // this.positionsArray[i3 + 2] = Math.random() - 0.5;

      this.sizesArray[i] = Math.random();
      this.timeMultiplierArray[i] = 1 + Math.random();
    }

    this. geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positionsArray, 3));
    this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(this.sizesArray, 1));
    this.geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(this.timeMultiplierArray, 1));
  }

  getRandomTexture() {
    const index = Math.floor(Math.random() * 8);
    return this.resources.items[index];
  }

  createMaterial() {
    this.texture.flipY = false;
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: { value: this.size },
        uResolution: {value: this.resolution},
        uTexture: { value: this.texture },
        uColor: { value: this.color },
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  createPoints() {
    this.instance = new THREE.Points(this.geometry, this.material);
    this.instance.position.copy(this.position);
    this.scene.add(this.instance);
  }

  // Создаем класс, который будет увеличивать uProgress
  createAnimationProgress() {
    this.animationProgress = new AnimationProgress(3, this.material.uniforms.uProgress, this.destroy.bind(this));
    this.animationProgress.start(this.time.elapsed);
  }

  destroy() {
    this.scene.remove(this.instance);
    this.geometry.dispose();
    this.material.dispose();

    this.onDestroy?.();
  }

  resize() {
    this.resolution.set(this.sizes.width * this.sizes.pixelRatio, this.sizes.height * this.sizes.pixelRatio);
    this.material.uniforms.uResolution.value = this.resolution;
  }

  update() {
    this.animationProgress?.update(this.time.elapsed);
  }
}
