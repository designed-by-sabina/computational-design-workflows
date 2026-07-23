// ==========================================
// EXERCISE 03
// 3D Josef Albers Composition
// Matched View with Exercise 04
// ==========================================

let scene03, camera03, renderer03;
let group03;

function initExercise03() {
    scene03 = new THREE.Scene();
    scene03.background = new THREE.Color(0xdbc6ff);

    camera03 = new THREE.PerspectiveCamera(
        50,
        800 / 600,
        0.1,
        1000
    );

    camera03.position.z = 8;

    renderer03 = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer03.setSize(800, 600);

    document
        .getElementById("canvas-container-3")
        .appendChild(renderer03.domElement);

    group03 = new THREE.Group();
    scene03.add(group03);

    createFrameBox03(0, 1.2, 0, 6.4, 0.9, 0.3, 0xf4efb4);
    createFrameBox03(0, -1.2, 0, 6.4, 0.9, 0.3, 0xb9ffd7);
}

function createFrameBox03(x, y, z, width, height, depth, color) {
    let slotWidth = 3.6;
    let slotHeight = 0.12;

    let topBottomHeight = (height - slotHeight) / 2;
    let sideWidth = (width - slotWidth) / 2;

    createBox03(
        x,
        y + slotHeight / 2 + topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );

    createBox03(
        x,
        y - slotHeight / 2 - topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );

    createBox03(
        x - slotWidth / 2 - sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );

    createBox03(
        x + slotWidth / 2 + sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );
}

function createBox03(x, y, z, width, height, depth, color) {
    let geometry = new THREE.BoxGeometry(width, height, depth);

    let material = new THREE.MeshBasicMaterial({
        color: color
    });

    let box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);

    group03.add(box);
}

function animateExercise03() {
    requestAnimationFrame(animateExercise03);

    group03.rotation.y =
        Math.sin(Date.now() * 0.001) * 0.15;

    group03.rotation.x =
        Math.cos(Date.now() * 0.001) * 0.05;

    renderer03.render(scene03, camera03);
}

initExercise03();
animateExercise03();