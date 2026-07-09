// ==========================================
// EXERCISE 04
// 3D Josef Albers Composition
// Diagonal Striped Background + Transparent Slots
// ==========================================

let scene04, camera04, renderer04;
let group04;

function initExercise04() {
    scene04 = new THREE.Scene();
    scene04.background = new THREE.Color(0xffffff);

    camera04 = new THREE.PerspectiveCamera(
        50,
        800 / 600,
        0.1,
        1000
    );

    camera04.position.z = 8;

    renderer04 = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer04.setSize(800, 600);
    renderer04.setClearColor(0xffffff, 0);

    document
        .getElementById("canvas-container-4")
        .appendChild(renderer04.domElement);

    createStripedBackground04();

    group04 = new THREE.Group();
    scene04.add(group04);

    createFrameBox04(0, 1.8, 0, 6.4, 0.9, 0.3, 0xf4efb4);
    createFrameBox04(0, -1.8, 0, 6.4, 0.9, 0.3, 0xb9ffd7);
}

// ==========================================
// CREATE RECTANGLE WITH TRANSPARENT SLOT
// ==========================================

function createFrameBox04(x, y, z, width, height, depth, color) {
    let slotWidth = 3.6;
    let slotHeight = 0.12;

    let topBottomHeight = (height - slotHeight) / 2;
    let sideWidth = (width - slotWidth) / 2;

    // top piece
    createBox04(
        x,
        y + slotHeight / 2 + topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );

    // bottom piece
    createBox04(
        x,
        y - slotHeight / 2 - topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );

    // left piece
    createBox04(
        x - slotWidth / 2 - sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );

    // right piece
    createBox04(
        x + slotWidth / 2 + sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );
}

function createBox04(x, y, z, width, height, depth, color) {
    let geometry = new THREE.BoxGeometry(width, height, depth);

    let material = new THREE.MeshBasicMaterial({
        color: color
    });

    let box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);

    group04.add(box);
}

// ==========================================
// DIAGONAL STRIPED BACKGROUND
// ==========================================

function createStripedBackground04() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 600);

    ctx.save();

    // rotate canvas drawing for diagonal stripes
    ctx.translate(400, 300);
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-400, -300);

    ctx.fillStyle = "#000000";

    // very wide diagonal stripes
    for (let x = -800; x < 1600; x += 420) {
        ctx.fillRect(x, -600, 210, 1800);
    }

    ctx.restore();

    let texture = new THREE.CanvasTexture(canvas);

    let material = new THREE.MeshBasicMaterial({
        map: texture
    });

    let geometry = new THREE.PlaneGeometry(11, 8.25);

    let plane = new THREE.Mesh(geometry, material);
    plane.position.z = -2;

    scene04.add(plane);
}

// ==========================================
// ANIMATION
// ==========================================

function animateExercise04() {
    requestAnimationFrame(animateExercise04);

    group04.rotation.y =
        Math.sin(Date.now() * 0.001) * 0.15;

    group04.rotation.x =
        Math.cos(Date.now() * 0.001) * 0.05;

    renderer04.render(scene04, camera04);
}

// ==========================================
// START
// ==========================================

initExercise04();
animateExercise04();