import {Experience} from './Experience/Experience';

import './style.css'

const canvas: HTMLCanvasElement | null = document.querySelector('canvas.webgl');
if (canvas) {
  new Experience(canvas);
}
