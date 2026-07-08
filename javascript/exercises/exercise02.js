// ==========================================
// EXERCISE 02
// Josef Albers Inspired Animated Composition
// ==========================================

const exercise02 = function(p) {

    let sliderY = -120;

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

    };


    p.draw = function() {

        // Background
        p.background(219, 198, 255);

        // Animate white rectangle downward
        sliderY += 2;

        if (sliderY > p.height + 120) {
            sliderY = -120;
        }

        p.noStroke();

        // Top rectangle
        p.fill(244, 239, 180);
        p.rect(80, 140, 640, 90);

        // Bottom rectangle
        p.fill(185, 255, 215);
        p.rect(80, 370, 640, 90);

        // Moving white rectangle
        p.fill(255);
        p.rect(220, sliderY, 360, 80);

        // Top cut-out / slit
        p.fill(219, 198, 255);
        p.rect(220, 178, 360, 12);

        // Bottom cut-out / slit
        p.fill(219, 198, 255);
        p.rect(220, 408, 360, 12);

    };

};

new p5(exercise02);