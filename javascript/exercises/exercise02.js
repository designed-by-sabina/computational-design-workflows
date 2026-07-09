// ==========================================
// EXERCISE 02
// Paper Through Two Slots
// ==========================================

const exercise02 = function(p) {

    // ======================================
    // SETUP
    // ======================================

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-2");

        p.noLoop();

    };

    p.draw = function() {

        p.background(219, 198, 255);
        p.noStroke();


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

        
    };

    
    }


new p5(exercise02);