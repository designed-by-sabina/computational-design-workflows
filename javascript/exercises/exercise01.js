// ==========================================
// EXERCISE 01
// Symmetrical Albers-inspired composition
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

        // Left large square
        p.fill(244,239,180);
        p.noStroke();
        p.rect(140,200,200,200);

        // Left inner cut-out
        p.fill(185,255,215);
        p.rect(170,265,80,80);

        // Right large square
        p.fill(185,255,215);
        p.noStroke();
        p.rect(460,200,200,200);

        // Right inner cut-out
        p.fill(244,239,180);
        p.rect(550,265,80,80);

    };

};

new p5(exercise01);