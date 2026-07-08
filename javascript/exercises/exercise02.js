// ==========================================
// EXERCISE 02
// Paper Through Two Slots
// ==========================================

const exercise02 = function(p) {

    let paperY = -300;

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        p.background(219, 198, 255);

        p.noStroke();

        paperY += 2;

        if (paperY > p.height + 300) {
            paperY = -300;
        }

        // White paper
        // Same width as the slot
        // Height is half the canvas
        p.fill(255);
        p.rect(220, paperY, 360, 300);

        // Top color field
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        // Top slot / cut-out
        p.fill(219, 198, 255);
        p.rect(220, 178, 360, 12);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // Bottom slot / cut-out
        p.fill(219, 198, 255);
        p.rect(220, 408, 360, 12);

    };

};

new p5(exercise02);
