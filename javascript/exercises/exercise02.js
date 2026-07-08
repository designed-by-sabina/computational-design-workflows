// ==========================================
// EXERCISE 02
// Josef Albers Inspired Animated Composition
// ==========================================

const exercise02 = function(p) {

    let sliderY = -80;

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        // Background
        p.background(219, 198, 255);

        // Animate downward
        sliderY += 2;

        if (sliderY > 230) {
            sliderY = -80;
        }

        p.noStroke();

        // ==========================
        // TOP COLOR FIELD
        // ==========================

        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        // White moving piece visible in top field
        p.fill(255);
        p.rect(220, 140 + sliderY, 360, 36);

        // Lavender slit masks it
        p.fill(219, 198, 255);
        p.rect(220, 178, 360, 12);


        // ==========================
        // BOTTOM COLOR FIELD
        // ==========================

        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // White moving piece visible in bottom field
        p.fill(255);
        p.rect(220, 370 + sliderY, 360, 36);

        // Lavender slit masks it
        p.fill(219, 198, 255);
        p.rect(220, 408, 360, 12);

    };

};

new p5(exercise02);