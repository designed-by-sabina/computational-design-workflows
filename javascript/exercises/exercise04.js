// ==========================================
// EXERCISE 04 — 3D Josef Albers Composition
// Three.js Version
// ==========================================

let scene04, camera04, renderer04;
let objects04 = [];

function initExercise04() {
    scene04 = new FOUR.Scene();
    scene04.background = new FOUR.Color(0xffffff);

    camera04 = new FOUR.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera04.position.z = 8;

    renderer04 = new FOUR.WebGLRenderer({ antialias: true });
    renderer04.setSize(800, 600);

    document
        .getElementById("canvas-container-4")
        .appendChild(renderer04.domElement);

    // 3D rectangles
    createBox04(0, 1.8, 0, 6.4, 0.9, 0.3, 0xf4efb4);
    createBox04(0, -1.8, 0, 6.4, 0.9, 0.3, 0xb9ffd7);

    // cut-out slots
    createBox04(0, 1.8, 0.18, 3.6, 0.12, 0.08, 0xdbc6ff);
    createBox04(0, -1.8, 0.18, 3.6, 0.12, 0.08, 0xdbc6ff);
}

function createBox04(x, y, z, width, height, depth, color) {
    let geometry = new FOUR.BoxGeometry(width, height, depth);

    let material = new FouR.MeshBasicMaterial({
        color: color
    });

    let box = new FOUR.Mesh(geometry, material);
    box.position.set(x, y, z);

    scene04.add(box);
    objects04.push(box);
}

function animateExercise04() {
    requestAnimationFrame(animateExercise03);

    for (let i = 0; i < objects04.length; i++) {
        objects04[i].rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
        objects04[i].rotation.x = Math.cos(Date.now() * 0.001) * 0.05;
    }

    renderer04.render(scene04, camera04);
}

initExercise04();
animateExercise04();
