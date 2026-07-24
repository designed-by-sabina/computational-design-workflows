// ==========================================
// EXERCISE 01
// Josef Albers Inspired Composition
// ==========================================

const exercise01 = function(p) {

    // ======================================
    // SETUP
    // ======================================

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-1");

        p.noLoop();

    };


    // ======================================
    // DRAW
    // ======================================

    p.draw = function() {

        // Background
        p.background(193, 170, 162);

        p.noStroke();

        // ==========================
        // TOP RECTANGLE
        // ==========================

        p.fill(244, 239, 180);

        p.rect(
            80,
            140,
            640,
            90
        );

        // Background cut-out

        p.fill(193, 170, 162);

        p.rect(
          220,   // x
    178,   // y
    360,   // width
    12     // height
        );


        // ==========================
        // BOTTOM RECTANGLE
        // ==========================

        p.fill(185, 255, 215);

        p.rect(
            80,
            370,
            640,
            90
        );

        // Background cut-out

        p.fill(193, 170, 162);
        p.rect(
               220,   // x
    408,   // y
    360,   // width
    12     // height
        );

    };

};


// ==========================================
// CREATE P5 INSTANCE
// ==========================================

new p5(exercise01);