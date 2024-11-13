import { GV } from "/scripts/globalVars.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { toRadians } from "./utils";
import { formState } from "./formAnims";

import {
  LinearFilter,
  LinearMipMapLinearFilter,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Quaternion,
  Euler,
} from "three";

function modifyTexture(texture) {
  // Set anisotropy to the maximum supported by the device
  texture.anisotropy = GV.renderer.capabilities.getMaxAnisotropy();

  // Enable mipmaps generation for better scaling
  texture.generateMipmaps = true;

  // Set texture filtering for sharpness
  texture.minFilter = LinearMipMapLinearFilter;
  texture.magFilter = LinearFilter;

  // Optional: Update the texture if needed
  texture.needsUpdate = true;
}

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera aspect ratio and renderer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  GV.renderer.setSize(width, height);

  setMailFormW();
});

export function setMailFormW() {
  const localMobileCheck = window.innerWidth <= 600;

  const mailForm = document.getElementById("mailForm");
  if (formState.isClosed) {
    mailForm.style.width = "calc(100% - 40px)";
    // console.log("sizing for a closed form");
  } else {
    if (localMobileCheck) mailForm.style.width = `100%`;
    else mailForm.style.width = "500px";
    // console.log("sizing for an open form");
  }
}

// Scene setup
const scene = new Scene();
const camera = new PerspectiveCamera(
  25, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(0, 0, 80);

GV.renderer.setPixelRatio(window.devicePixelRatio);
GV.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(GV.renderer.domElement); // Add this line

// Add lights
const ambientLight = new AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xf1e8e2, 2);
directionalLight.position.set(0.4, 1, 1);
scene.add(directionalLight);

const blueLight = new DirectionalLight(0x0a9ad9, 4);
blueLight.position.set(-3.0, -2, 2);
scene.add(blueLight);

GV.renderer.setSize(window.innerWidth, window.innerHeight);
// GV.renderer.outputEncoding = THREE.sRGBEncoding;
GV.renderer.generateMipmaps = true;

scene.background = null; // Remove the background

// Loaders
const mtlLoader = new MTLLoader();
mtlLoader.load("modelInfo/Puzzle_Box.mtl", (materials) => {
  materials.preload();

  // Loop through each material
  for (const materialName in materials.materials) {
    const material = materials.materials[materialName];

    // Access and modify the diffuse map (color texture)
    if (material.map) {
      modifyTexture(material.map);
    }

    // Access and modify the bump map
    if (material.bumpMap) {
      modifyTexture(material.bumpMap);
    }

    // Access and modify other maps as needed (e.g., specularMap, normalMap)
    if (material.specularMap) {
      modifyTexture(material.specularMap);
    }
  }

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(
    "modelInfo/Puzzle Box.obj",
    (object) => {
      GV.loadedObject = object;
      scene.add(object);
    },
    (xhr) => {
      const mailForm = document.getElementById("mailForm");
      mailForm.style.opacity = 1;
    },
    (error) => {
      console.log("ERROR: " + error);
    }
  );
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (GV.loadedObject) {
    if (!GV.isDragging) {
      GV.loadedObject.rotation.y += 0.005;
    } else {
      GV.loadedObject.rotation.y *= 0.95;
    }
  }

  var friction = 0.9; // Deceleration factor

  if (!GV.isDragging) {
    GV.rotationVelocity.x *= friction;
    GV.rotationVelocity.y *= friction;

    if (
      Math.abs(GV.rotationVelocity.x) > 0.01 ||
      Math.abs(GV.rotationVelocity.y) > 0.01
    ) {
      var deltaRotationQuaternion = new Quaternion().setFromEuler(
        new Euler(
          toRadians(GV.rotationVelocity.y),
          toRadians(GV.rotationVelocity.x),
          0,
          "XYZ"
        )
      );

      GV.loadedObject.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        GV.loadedObject.quaternion
      );
    } else {
      // Stop rotation when velocity is low
      GV.rotationVelocity.x = 0;
      GV.rotationVelocity.y = 0;
    }
  }

  // controls.update();
  GV.renderer.render(scene, camera);
}
animate();
