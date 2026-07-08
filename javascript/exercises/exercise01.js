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

    // ==========================
    // TOP RECTANGLE
    // ==========================

    p.fill(244,239,180);

    p.rect(
        80,
        140,
        640,
        90
    );

    // Background cut-out

    p.fill(219,198,255);

    p.rect(
        345,
        160,
        110,
        50
    );


    // ==========================
    // BOTTOM RECTANGLE
    // ==========================

    p.fill(185,255,215);

    p.rect(
        80,
        370,
        640,
        90
    );

    // Background cut-out

    p.fill(219,198,255);

    p.rect(
        345,
        390,
        110,
        50
    );

};
}