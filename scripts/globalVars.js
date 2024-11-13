import { WebGLRenderer } from "three";

export const GV = {
  renderer: new WebGLRenderer({
    antialias: true,
    alpha: true,
  }),
  loadedObject: null,
  isDragging: false,
  rotationVelocity: { x: 0, y: 0 },
  previousMousePosition: {
    x: 0,
    y: 0,
  },
};
