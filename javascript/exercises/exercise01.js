// ==========================================
// EXERCISE 01
// Interaction of Color
// Horizontal Color Fields
// ==========================================

const exercise01 = function(p) {

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-1");

        p.noLoop();

    };


    p.draw = function() {

        // Background
        p.background(219,198,255);

        p.noStroke();

        // =====================================
        // TOP RECTANGLE
        // =====================================

        p.fill(244,239,180);

        p.rect(
            120,
            170,
            560,
            90
        );

        // background cut-out

        p.fill(219,198,255);

        p.rect(
            300,
            190,
            180,
            50
        );


        // =====================================
        // BOTTOM RECTANGLE
        // =====================================

        p.fill(185,255,215);

        p.rect(
            120,
            340,
            560,
            90
        );

        // background cut-out

        p.fill(219,198,255);

        p.rect(
            300,
            360,
            180,
            50
        );

    };

};

new p5(exercise01);