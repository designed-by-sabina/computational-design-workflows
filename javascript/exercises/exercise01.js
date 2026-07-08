// ==========================================
// EXERCISE 01
// ==========================================

const exercise01 = function(p) {

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-1");

        p.noLoop();
    };


    p.draw = function() {

        p.background(219,198,255);

        p.fill(244,239,180);
        p.noStroke();
        p.rect(166,225,200,250);

        p.fill(219,198,255);
        p.noStroke();
        p.rect(180,300,70,70);

        p.fill(185,255,215);
        p.noStroke();
        p.rect(482,225,200,250);

        p.fill(219,198,255);
        p.noStroke();
        p.rect(598,300,70,70);

    };

};

new p5(exercise01);