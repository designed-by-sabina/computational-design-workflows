// ==========================================
// EXERCISE 01
// ==========================================

const exercise01 = function(p) {

    p.setup = function() {

        let canvas = p.createCanvas(800, 600);

        canvas.parent("canvas-container-1");

        p.noLoop();   // Static composition
    };


    p.draw = function() {

        // Background
        p.background(219,198,255);

      // rectangle: x, y, width, height
  fill(244, 239, 180);  // Yellow
  noStroke();         // No border
  rect(166, 225, 200, 200);

  // rectangle: x, y, width, height
  fill(219,198,255);  // Yellow
  noStroke();         // No border
  rect(180, 300, 70, 70);

  // rectangle: x, y, width, height
  fill(185, 255, 215);  // Yellow
  noStroke();         // No border
  rect(482, 225, 200, 200);
  
  // rectangle: x, y, width, height
  fill(219,198,255);  // Yellow
  noStroke();         // No border
  rect(598, 300, 70, 70);

    };

};


// Create this p5 instance
new p5(exercise01);