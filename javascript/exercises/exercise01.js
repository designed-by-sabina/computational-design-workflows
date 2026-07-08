// ==========================================
// EXERCISE 01
// ==========================================

const exercise01 = function(p) {

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-1");

        p.noLoop();   // Static composition
    };


    p.draw = function() {

        // Background
        p.background(219,198,255);

        // Left square
        p.fill(244,239,180);
        p.noStroke();
        p.rect(166,225,150,150);

        // Right square
        p.fill(185,255,215);
        p.rect(482,225,150,150);

    };

};


// Create this p5 instance
new p5(exercise01);