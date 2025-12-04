export class AnimationProgress {
  /**
   * Creates a new instance of Fireworks
   * @param {number} duration
   * @param {Object} uniformRef - Reference to the uniform - Number of particles.
   * @param {Function} [onComplete]
   */
  constructor(duration, uniformRef, onComplete) {
    this.duration = duration;
    this.uniformRef = uniformRef;
    this.startTime = null;
    this.isFinished = false;
    this.onComplete = onComplete;
  }

  start(elapsedTime) {
    this.startTime = elapsedTime / 1000;
    this.isFinished = false;
  }

  update(currentTime) {
    if (this.isFinished) return;
    if (this.startTime === null) return;

    const currentTimeSec = currentTime / 1000;

    const elapsed = currentTimeSec - this.startTime;
    let progress = elapsed / this.duration;

    // Остановка на 1.0
    if (progress >= 1.0) {
      progress = 1.0;
      this.isFinished = true;
    }

    if (this.uniformRef) {
      this.uniformRef.value = progress;
    }

    if (this.isFinished && typeof this.onComplete === 'function') {
      this.onComplete?.()
    }

    return progress;
  }

  reset() {
    this.startTime = null;
    this.isFinished = false;
    if (this.uniformRef) this.uniformRef.value = 0.0;
  }
}
