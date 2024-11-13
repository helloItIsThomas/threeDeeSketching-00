import { GV } from "/scripts/globalVars";
import { Quaternion, Euler } from "three";
import { toRadians } from "./utils";

// Declare rotation velocity in a higher scope
GV.rotationVelocity = { x: 0, y: 0 };

export function handleRotation(e) {
  var dampingFactor = 0.5;

  if (GV.isDragging) {
    var deltaMove = {
      x: (e.offsetX - GV.previousMousePosition.x) * dampingFactor,
      y: (e.offsetY - GV.previousMousePosition.y) * dampingFactor,
    };

    // Apply rotation immediately
    var deltaRotationQuaternion = new Quaternion().setFromEuler(
      new Euler(toRadians(deltaMove.y), toRadians(deltaMove.x), 0, "XYZ")
    );

    GV.loadedObject.quaternion.multiplyQuaternions(
      deltaRotationQuaternion,
      GV.loadedObject.quaternion
    );

    // Update rotation velocity for deceleration
    GV.rotationVelocity.x = deltaMove.x;
    GV.rotationVelocity.y = deltaMove.y;

    GV.previousMousePosition = {
      x: e.offsetX,
      y: e.offsetY,
    };
  }
}

export function handleZoom(e) {
  const zoomFactor = 0.0333;
  const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
  const maxScale = 4.0; // Define a maximum scale value

  // Adjust the scale of the loaded object
  GV.loadedObject.scale.x += delta;
  GV.loadedObject.scale.y += delta;
  GV.loadedObject.scale.z += delta;

  // Ensure the scale doesn't go below a minimum value or above a maximum value
  GV.loadedObject.scale.x = Math.max(
    0.1,
    Math.min(maxScale, GV.loadedObject.scale.x)
  );
  GV.loadedObject.scale.y = Math.max(
    0.1,
    Math.min(maxScale, GV.loadedObject.scale.y)
  );
  GV.loadedObject.scale.z = Math.max(
    0.1,
    Math.min(maxScale, GV.loadedObject.scale.z)
  );
}

// Add event listener for mouse wheel
window.addEventListener("wheel", handleZoom);

// Handle pinch zoom
export const handlePinchZoom = {
  initialDistance: null,

  start(e) {
    const [touch1, touch2] = e.touches;
    this.initialDistance = Math.hypot(
      touch2.pageX - touch1.pageX,
      touch2.pageY - touch1.pageY
    );
  },

  move(e) {
    const [touch1, touch2] = e.touches;
    const currentDistance = Math.hypot(
      touch2.pageX - touch1.pageX,
      touch2.pageY - touch1.pageY
    );

    if (this.initialDistance) {
      const zoomFactor = (currentDistance - this.initialDistance) * 0.01;
      const maxScale = 4.0;

      GV.loadedObject.scale.x += zoomFactor;
      GV.loadedObject.scale.y += zoomFactor;
      GV.loadedObject.scale.z += zoomFactor;

      GV.loadedObject.scale.x = Math.max(
        0.1,
        Math.min(maxScale, GV.loadedObject.scale.x)
      );
      GV.loadedObject.scale.y = Math.max(
        0.1,
        Math.min(maxScale, GV.loadedObject.scale.y)
      );
      GV.loadedObject.scale.z = Math.max(
        0.1,
        Math.min(maxScale, GV.loadedObject.scale.z)
      );

      this.initialDistance = currentDistance;
    }
  },
};
