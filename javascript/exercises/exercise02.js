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

        // Same geometry as Exercise 01
        let slotX = 220;
        let slotW = 360;
        let paperH = 300;

        // Top color field
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // Lavender slots
        p.fill(219, 198, 255);
        p.rect(slotX, 178, slotW, 12);
        p.rect(slotX, 408, slotW, 12);

        // White paper visible only when it passes through slots
        drawPaperInSlot(178, paperY, paperH);
        drawPaperInSlot(408, paperY, paperH);

    };

    function drawPaperInSlot(slotY, paperY, paperH) {

        let slotX = 220;
        let slotW = 360;
        let slotH = 12;

        if (paperY + paperH > slotY && paperY < slotY + slotH) {
            p.fill(255);
            p.rect(slotX, slotY, slotW, slotH);
        }

    }

};

new p5(exercise02);