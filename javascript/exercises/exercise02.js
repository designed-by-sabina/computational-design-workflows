const exercise02 = function(p) {

    let paperOffset = 0;

    p.setup = function() {
        let canvas = p.createCanvas(800, 600);
        canvas.parent("canvas-container-2");
    };

    p.draw = function() {

        p.background(193, 170, 162);
        p.noStroke();

        paperOffset += 2;

        if (paperOffset > 120) {
            paperOffset = 0;
        }

        let slotX = 220;
        let slotW = 360;
        let slotH = 12;

        let paperHeight = 60;
        let paperGap = 120;

        // Color fields
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // Default lavender slots
        p.fill(193, 170, 162);
        p.rect(slotX, 178, slotW, slotH);
        p.rect(slotX, 408, slotW, slotH);

        // Moving paper strips
        for (let y = -600; y < 900; y += paperGap) {

            let movingY = y + paperOffset;

            drawPaperInSlot(178, movingY, paperHeight);
            drawPaperInSlot(408, movingY, paperHeight);

        }

    };


    function drawPaperInSlot(slotY, paperY, paperHeight) {

        let slotX = 220;
        let slotW = 360;
        let slotH = 12;

        let paperTop = paperY;
        let paperBottom = paperY + paperHeight;

        if (
            paperBottom > slotY &&
            paperTop < slotY + slotH
        ) {
            p.fill(255);
            p.rect(slotX, slotY, slotW, slotH);
        }

    }

};

new p5(exercise02);