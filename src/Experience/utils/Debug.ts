import GUI from 'lil-gui';

export class Debug {
  public active = false;
  public ui?: GUI;
  constructor() {
    this.active = window.location.hash === '#debug';
    if (this.active) {
      this.ui = new GUI();
      this.ui.close();
    }
  }
}
