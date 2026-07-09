// ==========================================
// EXERCISE 02
// Continuous Paper Through Slots
// ==========================================

const exercise02 = function(p) {

    let paperY = 0;

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        p.background(219, 198, 255);

        p.noStroke();

        // Animation speed
        paperY += 2;

        if (paperY > 160) {
            paperY = 0;
        }


        // Shared geometry
        let slotX = 220;
        let slotW = 360;
        let slotH = 12;

        let paperGap = 160;
        let paperHeight = 300;


        // Top color field
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);


        // Draw repeated moving paper sheets
        for (let y = -600; y < 800; y += paperGap) {

            let movingY = y + paperY;

            drawPaperInSlot(
                slotX,
                178,
                slotW,
                slotH,
                movingY,
                paperHeight
            );

            drawPaperInSlot(
                slotX,
                408,
                slotW,
                slotH,
                movingY,
                paperHeight
            );

        }


        // Lavender slots when paper is not passing
        p.fill(219, 198, 255);

        p.rect(slotX, 178, slotW, slotH);

        p.rect(slotX, 408, slotW, slotH);


        // Draw repeated moving paper sheets again on top of slots
        // so the white appears inside the openings
        for (let y = -600; y < 800; y += paperGap) {

            let movingY = y + paperY;

            drawPaperInSlot(
                slotX,
                178,
                slotW,
                slotH,
                movingY,
                paperHeight
            );

            drawPaperInSlot(
                slotX,
                408,
                slotW,
                slotH,
                movingY,
                paperHeight
            );

        }

    };


    function drawPaperInSlot(
        slotX,
        slotY,
        slotW,
        slotH,
        paperY,
        paperHeight
    ) {

        let paperTop = paperY;

        let paperBottom =
            paperY + paperHeight;

        if (
            paperBottom > slotY &&
            paperTop < slotY + slotH
        ) {

            p.fill(255);

            p.rect(
                slotX,
                slotY,
                slotW,
                slotH
            );

        }

    }

};

new p5(exercise02);