// ==========================================
// EXERCISE 02
// Long Paper Through Two Color Fields
// ==========================================

const exercise02 = function(p) {

    let paperY = -1600;

    p.setup = function() {
        let canvas = p.createCanvas(800, 600);
        canvas.parent("canvas-container-2");
    };

    p.draw = function() {

        p.background(219, 198, 255);
        p.noStroke();

        paperY += 3;

        if (paperY > 700) {
            paperY = -1600;
        }

        // Same composition coordinates as Exercise 01
        let x = 80;
        let w = 640;

        let topY = 140;
        let bottomY = 370;
        let rectH = 90;

        let paperX = 220;
        let paperW = 360;
        let paperH = 1600;

        let windowH = 45;

        let topWindowY = 140;
        let bottomWindowY = 370;

        // Top color field
        p.fill(244, 239, 180);
        p.rect(x, topY, w, rectH);

        // Bottom color field
        p.fill(185, 255, 215);
        p.rect(x, bottomY, w, rectH);

        // Paper visible through top field opening
        drawPaperWindow(
            paperX,
            paperY,
            paperW,
            paperH,
            paperX,
            topWindowY,
            paperW,
            windowH
        );

        // Paper visible through bottom field opening
        drawPaperWindow(
            paperX,
            paperY,
            paperW,
            paperH,
            paperX,
            bottomWindowY,
            paperW,
            windowH
        );

        // Draw thin lavender slit line over each field
        p.fill(219, 198, 255);
        p.rect(220, 178, 360, 12);
        p.rect(220, 408, 360, 12);
    };


    function drawPaperWindow(
        paperX,
        paperY,
        paperW,
        paperH,
        windowX,
        windowY,
        windowW,
        windowH
    ) {

        let paperTop = paperY;
        let paperBottom = paperY + paperH;

        let windowTop = windowY;
        let windowBottom = windowY + windowH;

        if (paperBottom > windowTop && paperTop < windowBottom) {
            p.fill(255);
            p.rect(windowX, windowY, windowW, windowH);
        }
    }

};

new p5(exercise02);
