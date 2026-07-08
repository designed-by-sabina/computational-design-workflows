// ==========================================
// EXERCISE 02
// Paper Sliding Through Slots
// ==========================================

const exercise02 = function(p) {

    let paperY = -160;

    p.setup = function() {
        let canvas = p.createCanvas(800, 600);
        canvas.parent("canvas-container-2");
    };

    p.draw = function() {

        p.background(219, 198, 255);
        p.noStroke();

        paperY += 2;

        if (paperY > 620) {
            paperY = -160;
        }

        // Color fields
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // Paper visible through each slot as it passes
        drawPaperThroughSlot(178, paperY);
        drawPaperThroughSlot(408, paperY - 230);

        // Slot lines on top
        p.fill(219, 198, 255);
        p.rect(220, 178, 360, 12);

        p.fill(219, 198, 255);
        p.rect(220, 408, 360, 12);
    };


    function drawPaperThroughSlot(slotY, currentY) {

        let paperX = 220;
        let paperW = 360;
        let paperH = 160;

        let paperTop = currentY;
        let paperBottom = currentY + paperH;

        if (paperBottom > slotY && paperTop < slotY + 90) {

            p.fill(255);

            p.rect(
                paperX,
                Math.max(slotY, paperTop),
                paperW,
                Math.min(paperBottom, slotY + 90) - Math.max(slotY, paperTop)
            );
        }
    }

};

new p5(exercise02);