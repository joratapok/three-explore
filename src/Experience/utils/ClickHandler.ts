import {EventEmitter} from './EventEmitter.js'
import type {Experience} from '../Experience.ts';
import type {Sizes} from './Sizes.ts';

export class ClickHandler extends EventEmitter {
  public sizes: Sizes;
  public cursor: {x: number, y: number};
  constructor(public experience: Experience) {
    super();
    this.sizes = experience.sizes;

    this.cursor = {x: 0, y: 0}

    // Click event
    window.addEventListener('click', (e) => {
      this.cursor.x = e.clientX / this.sizes.width - 0.5;
      this.cursor.y = e.clientY / this.sizes.height - 0.5;

      this.trigger('mouseclick');
    })
  }
}
