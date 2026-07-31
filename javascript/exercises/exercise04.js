// ==========================================
// EXERCISE 04
// 3D Josef Albers Composition
// Responsive 4:3 Three.js canvas
// ==========================================

let scene04;
let camera04;
let renderer04;
let group04;
let container04;
let resizeObserver04;


// ==========================================
// SETTINGS
// ==========================================

const EXERCISE_04_DESIGN_WIDTH = 800;
const EXERCISE_04_DESIGN_HEIGHT = 600;

const EXERCISE_04_ASPECT_RATIO =
    EXERCISE_04_DESIGN_WIDTH /
    EXERCISE_04_DESIGN_HEIGHT;


// ==========================================
// INITIALIZE
// ==========================================

function initExercise04() {

    container04 =
        document.getElementById(
            "canvas-container-4"
        );


    if (!container04) {

        console.error(
            "Missing HTML element: #canvas-container-4"
        );

        return;

    }


    // ======================================
    // SCENE
    // ======================================

    scene04 =
        new THREE.Scene();


    scene04.background =
        new THREE.Color(
            0xffffff
        );


    // ======================================
    // CAMERA
    // ======================================

    camera04 =
        new THREE.PerspectiveCamera(
            50,
            EXERCISE_04_ASPECT_RATIO,
            0.1,
            1000
        );


    camera04.position.set(
        0,
        0,
        8
    );


    camera04.lookAt(
        0,
        0,
        0
    );


    // ======================================
    // RENDERER
    // ======================================

    renderer04 =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    renderer04.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    /*
    Start with a valid size because Exercise 04
    initially loads inside a hidden tab.
    */

    renderer04.setSize(
        EXERCISE_04_DESIGN_WIDTH,
        EXERCISE_04_DESIGN_HEIGHT
    );


    renderer04.setClearColor(
        0xffffff,
        0
    );


    renderer04.domElement.style.display =
        "block";


    renderer04.domElement.style.maxWidth =
        "100%";


    renderer04.domElement.style.maxHeight =
        "100%";


    renderer04.domElement.style.margin =
        "0 auto";


    container04.appendChild(
        renderer04.domElement
    );


    // ======================================
    // BACKGROUND
    // ======================================

    createStripedBackground04();


    // ======================================
    // COMPOSITION GROUP
    // ======================================

    group04 =
        new THREE.Group();


    scene04.add(
        group04
    );


    createFrameBox04(
        0,
        1.2,
        0,
        6.4,
        0.9,
        0.3,
        0xf4efb4
    );


    createFrameBox04(
        0,
        -1.2,
        0,
        6.4,
        0.9,
        0.3,
        0xb9ffd7
    );


    // ======================================
    // RESIZE EVENTS
    // ======================================

    window.addEventListener(
        "resize",
        resizeExercise04
    );


    if (
        typeof ResizeObserver !==
        "undefined"
    ) {

        resizeObserver04 =
            new ResizeObserver(
                function () {

                    resizeExercise04();

                }
            );


        resizeObserver04.observe(
            container04
        );

    }


    /*
    Exercise 04 starts inside a hidden panel.
    Resize it after its button is selected.
    */

    const exerciseButtons =
        document.querySelectorAll(
            ".exercise-button"
        );


    exerciseButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        button.dataset.canvas ===
                        "4"
                    ) {

                        requestAnimationFrame(
                            function () {

                                requestAnimationFrame(
                                    resizeExercise04
                                );

                            }
                        );

                    }

                }
            );

        }
    );


    /*
    Try once more after the page layout
    has been calculated.
    */

    requestAnimationFrame(
        function () {

            requestAnimationFrame(
                resizeExercise04
            );

        }
    );

}


// ==========================================
// RESPONSIVE SIZE
// Preserves the original 4:3 proportion
// ==========================================

function resizeExercise04() {

    if (
        !container04 ||
        !renderer04 ||
        !camera04
    ) {

        return;

    }


    const availableWidth =
        container04.clientWidth;


    const availableHeight =
        container04.clientHeight;


    /*
    The tab may currently be hidden.
    Keep the current valid renderer size.
    */

    if (
        availableWidth <= 0 ||
        availableHeight <= 0
    ) {

        return;

    }


    let canvasWidth =
        availableWidth;


    let canvasHeight =
        canvasWidth /
        EXERCISE_04_ASPECT_RATIO;


    if (
        canvasHeight >
        availableHeight
    ) {

        canvasHeight =
            availableHeight;


        canvasWidth =
            canvasHeight *
            EXERCISE_04_ASPECT_RATIO;

    }


    canvasWidth =
        Math.max(
            1,
            Math.floor(
                canvasWidth
            )
        );


    canvasHeight =
        Math.max(
            1,
            Math.floor(
                canvasHeight
            )
        );


    renderer04.setSize(
        canvasWidth,
        canvasHeight,
        true
    );


    camera04.aspect =
        EXERCISE_04_ASPECT_RATIO;


    camera04.updateProjectionMatrix();


    renderer04.render(
        scene04,
        camera04
    );

}


// ==========================================
// CREATE RECTANGLE WITH OPEN SLOT
// ==========================================

function createFrameBox04(
    x,
    y,
    z,
    width,
    height,
    depth,
    color
) {

    const slotWidth =
        3.6;


    const slotHeight =
        0.12;


    const topBottomHeight =
        (
            height -
            slotHeight
        ) / 2;


    const sideWidth =
        (
            width -
            slotWidth
        ) / 2;


    // Top

    createBox04(
        x,
        y +
            slotHeight / 2 +
            topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );


    // Bottom

    createBox04(
        x,
        y -
            slotHeight / 2 -
            topBottomHeight / 2,
        z,
        width,
        topBottomHeight,
        depth,
        color
    );


    // Left

    createBox04(
        x -
            slotWidth / 2 -
            sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );


    // Right

    createBox04(
        x +
            slotWidth / 2 +
            sideWidth / 2,
        y,
        z,
        sideWidth,
        slotHeight,
        depth,
        color
    );

}


// ==========================================
// CREATE BOX
// ==========================================

function createBox04(
    x,
    y,
    z,
    width,
    height,
    depth,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const material =
        new THREE.MeshBasicMaterial({
            color: color
        });


    const box =
        new THREE.Mesh(
            geometry,
            material
        );


    box.position.set(
        x,
        y,
        z
    );


    group04.add(
        box
    );

}


// ==========================================
// DIAGONAL STRIPED BACKGROUND
// ==========================================

function createStripedBackground04() {

    const backgroundCanvas =
        document.createElement(
            "canvas"
        );


    backgroundCanvas.width =
        EXERCISE_04_DESIGN_WIDTH;


    backgroundCanvas.height =
        EXERCISE_04_DESIGN_HEIGHT;


    const context =
        backgroundCanvas.getContext(
            "2d"
        );


    context.fillStyle =
        "#ffffff";


    context.fillRect(
        0,
        0,
        EXERCISE_04_DESIGN_WIDTH,
        EXERCISE_04_DESIGN_HEIGHT
    );


    context.save();


    context.translate(
        EXERCISE_04_DESIGN_WIDTH / 2,
        EXERCISE_04_DESIGN_HEIGHT / 2
    );


    context.rotate(
        -Math.PI / 4
    );


    context.translate(
        -EXERCISE_04_DESIGN_WIDTH / 2,
        -EXERCISE_04_DESIGN_HEIGHT / 2
    );


    context.fillStyle =
        "#000000";


    for (
        let x = -800;
        x < 1600;
        x += 420
    ) {

        context.fillRect(
            x,
            -600,
            210,
            1800
        );

    }


    context.restore();


    const texture =
        new THREE.CanvasTexture(
            backgroundCanvas
        );


    texture.needsUpdate =
        true;


    const material =
        new THREE.MeshBasicMaterial({
            map: texture
        });


    const geometry =
        new THREE.PlaneGeometry(
            11,
            8.25
        );


    const plane =
        new THREE.Mesh(
            geometry,
            material
        );


    plane.position.z =
        -2;


    scene04.add(
        plane
    );

}


// ==========================================
// ANIMATION
// ==========================================

function animateExercise04() {

    requestAnimationFrame(
        animateExercise04
    );


    if (
        !renderer04 ||
        !scene04 ||
        !camera04 ||
        !group04
    ) {

        return;

    }


    group04.rotation.y =
        Math.sin(
            Date.now() *
            0.001
        ) *
        0.15;


    group04.rotation.x =
        Math.cos(
            Date.now() *
            0.001
        ) *
        0.05;


    renderer04.render(
        scene04,
        camera04
    );

}


// ==========================================
// START
// ==========================================

initExercise04();
animateExercise04();