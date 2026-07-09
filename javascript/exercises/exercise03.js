// ==========================================
// EXERCISE 03 — 3D Josef Albers Composition
// Three.js Version
// ==========================================

let scene03, camera03, renderer03;
let objects03 = [];

function initExercise03() {
  scene03 = new THREE.Scene();
  scene03.background = new THREE.Color(0xdbc6ff);

  camera03 = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  camera03.position.z = 8;

  renderer03 = new THREE.WebGLRenderer({ antialias: true });
  renderer03.setSize(800, 600);

  document
    .getElementById("canvas-container-3")
    .appendChild(renderer03.domElement);

  // 3D rectangles
  createBox03(0, 1.8, 0, 6.4, 0.9, 0.3, 0xf4efb4);
  createBox03(0, -1.8, 0, 6.4, 0.9, 0.3, 0xb9ffd7);

  // cut-out slots
  createBox03(0, 1.8, 0.18, 3.6, 0.12, 0.08, 0xdbc6ff);
  createBox03(0, -1.8, 0.18, 3.6, 0.12, 0.08, 0xdbc6ff);
}

function createBox03(x, y, z, width, height, depth, color) {
  let geometry = new THREE.BoxGeometry(width, height, depth);

  let material = new THREE.MeshBasicMaterial({
    color: color
  });

  let box = new THREE.Mesh(geometry, material);
  box.position.set(x, y, z);

  scene03.add(box);
  objects03.push(box);
}

function animateExercise03() {
  requestAnimationFrame(animateExercise03);

  for (let i = 0; i < objects03.length; i++) {
    objects03[i].rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
    objects03[i].rotation.x = Math.cos(Date.now() * 0.001) * 0.05;
  }

  renderer03.render(scene03, camera03);
}

initExercise03();
animateExercise03();
