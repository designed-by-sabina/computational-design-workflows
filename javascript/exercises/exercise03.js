// ==========================================
// EXERCISE 03
// 3D Josef Albers Composition
// Responsive 4:3 Three.js canvas
// ==========================================

let scene03;
let camera03;
let renderer03;
let group03;
let container03;
let resizeObserver03;


// ==========================================
// SETTINGS
// ==========================================

const EXERCISE_03_DESIGN_WIDTH = 800;
const EXERCISE_03_DESIGN_HEIGHT = 600;

const EXERCISE_03_ASPECT_RATIO =
    EXERCISE_03_DESIGN_WIDTH /
    EXERCISE_03_DESIGN_HEIGHT;


// ==========================================
// INITIALIZE
// ==========================================

function initExercise03() {

    container03 =
        document.getElementById(
            "canvas-container-3"
        );


    if (!container03) {

        console.error(
            "Missing HTML element: #canvas-container-3"
        );

        return;

    }


    // ======================================
    // SCENE
    // ======================================

    scene03 =
        new THREE.Scene();


    scene03.background =
        new THREE.Color(
            0xdbc6ff
        );


    // ======================================
    // CAMERA
    // ======================================

    camera03 =
        new THREE.PerspectiveCamera(
            50,
            EXERCISE_03_ASPECT_RATIO,
            0.1,
            1000
        );


    camera03.position.set(
        0,
        0,
        8
    );


    camera03.lookAt(
        0,
        0,
        0
    );


    // ======================================
    // RENDERER
    // ======================================

    renderer03 =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });


    renderer03.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    /*
    Start with a valid size even though the
    Exercise 03 tab may currently be hidden.
    */

    renderer03.setSize(
        EXERCISE_03_DESIGN_WIDTH,
        EXERCISE_03_DESIGN_HEIGHT
    );


    renderer03.setClearColor(
        0xdbc6ff,
        1
    );


    renderer03.domElement.style.display =
        "block";


    renderer03.domElement.style.maxWidth =
        "100%";


    renderer03.domElement.style.maxHeight =
        "100%";


    renderer03.domElement.style.margin =
        "0 auto";


    container03.appendChild(
        renderer03.domElement
    );


    // ======================================
    // COMPOSITION
    // ======================================

    group03 =
        new THREE.Group();


    scene03.add(
        group03
    );


    createFrameBox03(
        0,
        1.2,
        0,
        6.4,
        0.9,
        0.3,
        0xf4efb4
    );


    createFrameBox03(
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
        resizeExercise03
    );


    if (
        typeof ResizeObserver !==
        "undefined"
    ) {

        resizeObserver03 =
            new ResizeObserver(
                function () {

                    resizeExercise03();

                }
            );


        resizeObserver03.observe(
            container03
        );

    }


    /*
    Exercise 03 begins inside a hidden tab.
    Resize it whenever an exercise button is
    clicked and the panel becomes visible.
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
                        "3"
                    ) {

                        requestAnimationFrame(
                            function () {

                                requestAnimationFrame(
                                    resizeExercise03
                                );

                            }
                        );

                    }

                }
            );

        }
    );


    /*
    Try again after the page layout has been
    calculated.
    */

    requestAnimationFrame(
        function () {

            requestAnimationFrame(
                resizeExercise03
            );

        }
    );

}


// ==========================================
// RESPONSIVE SIZE
// Preserves the original 4:3 proportion
// ==========================================

function resizeExercise03() {

    if (
        !container03 ||
        !renderer03 ||
        !camera03
    ) {

        return;

    }


    const availableWidth =
        container03.clientWidth;


    const availableHeight =
        container03.clientHeight;


    /*
    The tab may currently be hidden. Keep the
    existing valid renderer size and try again
    when the tab becomes visible.
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
        EXERCISE_03_ASPECT_RATIO;


    if (
        canvasHeight >
        availableHeight
    ) {

        canvasHeight =
            availableHeight;


        canvasWidth =
            canvasHeight *
            EXERCISE_03_ASPECT_RATIO;

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


    /*
    true updates both the drawing buffer and
    the visible CSS dimensions.
    */

    renderer03.setSize(
        canvasWidth,
        canvasHeight,
        true
    );


    camera03.aspect =
        EXERCISE_03_ASPECT_RATIO;


    camera03.updateProjectionMatrix();


    renderer03.render(
        scene03,
        camera03
    );

}


// ==========================================
// CREATE RECTANGLE WITH OPEN SLOT
// ==========================================

function createFrameBox03(
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

    createBox03(
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

    createBox03(
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

    createBox03(
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

    createBox03(
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

function createBox03(
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


    group03.add(
        box
    );

}


// ==========================================
// ANIMATION
// ==========================================

function animateExercise03() {

    requestAnimationFrame(
        animateExercise03
    );


    if (
        !renderer03 ||
        !scene03 ||
        !camera03 ||
        !group03
    ) {

        return;

    }


    group03.rotation.y =
        Math.sin(
            Date.now() *
            0.001
        ) *
        0.15;


    group03.rotation.x =
        Math.cos(
            Date.now() *
            0.001
        ) *
        0.05;


    renderer03.render(
        scene03,
        camera03
    );

}


// ==========================================
// START
// ==========================================

initExercise03();
animateExercise03();