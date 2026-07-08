// ==========================================
// EXERCISE 02
// Long Paper Through Two Slots
// ==========================================

const exercise02 = function(p) {

    let paperY = -1200;

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        p.background(219, 198, 255);

        p.noStroke();

        // Move one very long white paper sheet downward
        paperY += 2;

        if (paperY > 700) {
            paperY = -1200;
        }


        // Shared geometry — same as Exercise 01
        let x = 80;
        let w = 640;

        let topY = 140;
        let bottomY = 370;

        let rectH = 90;

        let slitX = 220;
        let slitW = 360;
        let slitH = 12;

        let topSlitY = 178;
        let bottomSlitY = 408;

        let paperX = slitX;
        let paperW = slitW;

        // Very long paper
        let paperH = 1200;


        // Draw color fields
        p.fill(244, 239, 180);
        p.rect(x, topY, w, rectH);

        p.fill(185, 255, 215);
        p.rect(x, bottomY, w, rectH);


        // Show paper only where it intersects each slit
        drawPaperInSlit(
            paperX,
            paperY,
            paperW,
            paperH,
            slitX,
            topSlitY,
            slitW,
            slitH
        );

        drawPaperInSlit(
            paperX,
            paperY,
            paperW,
            paperH,
            slitX,
            bottomSlitY,
            slitW,
            slitH
        );


        // Draw lavender slit openings when paper is NOT there
        drawSlitEdge(topSlitY);
        drawSlitEdge(bottomSlitY);

    };


    function drawPaperInSlit(
        paperX,
        paperY,
        paperW,
        paperH,
        slitX,
        slitY,
        slitW,
        slitH
    ) {

        let paperTop = paperY;
        let paperBottom = paperY + paperH;

        if (
            paperBottom > slitY &&
            paperTop < slitY + slitH
        ) {

            p.fill(255);

            p.rect(
                slitX,
                slitY,
                slitW,
                slitH
            );

        }

    }


    function drawSlitEdge(slitY) {

        let slitX = 220;
        let slitW = 360;
        let slitH = 12;

        let paperTop = paperY;
        let paperBottom = paperY + 1200;

        if (
            !(paperBottom > slitY &&
            paperTop < slitY + slitH)
        ) {

            p.fill(219, 198, 255);

            p.rect(
                slitX,
                slitY,
                slitW,
                slitH
            );

        }

    }

};

new p5(exercise02);