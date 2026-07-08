// ==========================================
// EXERCISE 02
// One Paper Through Two Slots
// ==========================================

const exercise02 = function(p) {

    let paperY = -260;

    p.setup = function() {
        let canvas = p.createCanvas(800, 600);
        canvas.parent("canvas-container-2");
    };

    p.draw = function() {

        p.background(219, 198, 255);
        p.noStroke();

        paperY += 2;

        if (paperY > 620) {
            paperY = -260;
        }

        // Shared geometry
        let x = 80;
        let w = 640;

        let rectH = 90;
        let cutoutH = 12;

        let topY = 215;
        let bottomY = 317; // almost touching: 317 - (215 + 90) = 12

        let slitX = 220;
        let slitW = 360;

        let paperX = slitX;
        let paperW = slitW;
        let paperH = 260;

        // Top color field
        p.fill(244, 239, 180);
        p.rect(x, topY, w, rectH);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(x, bottomY, w, rectH);

        // One continuous paper sheet
        p.fill(255);
        p.rect(paperX, paperY, paperW, paperH);

        // Redraw the colored fields around the paper illusion
        // by covering the paper except where the slits are

        // Top field covers paper
        p.fill(244, 239, 180);
        p.rect(x, topY, w, rectH);

        // Bottom field covers paper
        p.fill(185, 255, 215);
        p.rect(x, bottomY, w, rectH);

        // Paper visible only through top slit
        p.fill(255);
        drawVisiblePaper(slitX, topY + 39, slitW, cutoutH, paperY, paperH);

        // Paper visible only through bottom slit
        drawVisiblePaper(slitX, bottomY + 39, slitW, cutoutH, paperY, paperH);

        // Lavender slot openings / edges
        p.fill(219, 198, 255);
        p.rect(slitX, topY + 39, slitW, cutoutH);

        p.fill(219, 198, 255);
        p.rect(slitX, bottomY + 39, slitW, cutoutH);

        // Thin white line inside each slot when paper is passing
        p.fill(255);
        drawVisiblePaper(slitX, topY + 39, slitW, cutoutH, paperY, paperH);
        drawVisiblePaper(slitX, bottomY + 39, slitW, cutoutH, paperY, paperH);

    };


    function drawVisiblePaper(slotX, slotY, slotW, slotH, sheetY, sheetH) {

        let sheetTop = sheetY;
        let sheetBottom = sheetY + sheetH;

        if (sheetBottom > slotY && sheetTop < slotY + slotH) {
            p.rect(slotX, slotY, slotW, slotH);
        }

    }

};

new p5(exercise02);