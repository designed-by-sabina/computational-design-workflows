// ==========================================
// EXERCISE 02
// One Paper Through Two Slots
// ==========================================

const exercise02 = function(p) {


    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        p.background(219, 198, 255);

        p.noStroke();

        // Animate one continuous paper downward
        paperY += 2;

        if (paperY > 620) {
            paperY = -520;
        }


        // Shared geometry
        let x = 80;
        let w = 640;

        let rectH = 90;
        let cutoutH = 12;

        // Previous larger spacing
        let topY = 140;
        let bottomY = 370;

        let slitX = 220;
        let slitW = 360;

        let paperX = slitX;
        let paperW = slitW;

        // White rectangle height x2
        let paperH = 520;


        // Top color field
        p.fill(244, 239, 180);
        p.rect(x, topY, w, rectH);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(x, bottomY, w, rectH);


        // Paper visible only through top slit
        p.fill(255);
        drawVisiblePaper(
            slitX,
            topY + 39,
            slitW,
            cutoutH,
            paperY,
            paperH
        );


        // Paper visible only through bottom slit
        p.fill(255);
        drawVisiblePaper(
            slitX,
            bottomY + 39,
            slitW,
            cutoutH,
            paperY,
            paperH
        );


        // Lavender slot edges on top
        p.fill(219, 198, 255);
        p.rect(slitX, topY + 39, slitW, cutoutH);

        p.fill(219, 198, 255);
        p.rect(slitX, bottomY + 39, slitW, cutoutH);


        // White paper appears again inside the slots
        p.fill(255);
        drawVisiblePaper(
            slitX,
            topY + 39,
            slitW,
            cutoutH,
            paperY,
            paperH
        );

        drawVisiblePaper(
            slitX,
            bottomY + 39,
            slitW,
            cutoutH,
            paperY,
            paperH
        );

    };


    function drawVisiblePaper(slotX, slotY, slotW, slotH, sheetY, sheetH) {

        let sheetTop = sheetY;
        let sheetBottom = sheetY + sheetH;

        if (sheetBottom > slotY && sheetTop < slotY + slotH) {

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
