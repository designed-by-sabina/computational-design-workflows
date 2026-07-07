/* ==========================================
   TRANSPARENCY
   Inspired by Josef Albers'
   Interaction of Color

   Main interactions:
   - floating transparent circles
   - color mixing
   - RGB labels
   - pause/resume
========================================== */



// ==========================================
// MAIN CANVAS SETUP
// ==========================================

const canvas = document.getElementById("colorCanvas");
const ctx = canvas.getContext("2d");

const labelContainer = document.getElementById("labelContainer");

let circles = [];

let animationPaused = false;

let animationFrame;



// ==========================================
// RESIZE CANVAS
// ==========================================

function resizeCanvas(){

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();



// ==========================================
// COLOR PALETTE
// pastel transparent colors
// ==========================================


const colors = [

    [255,180,180],
    [255,220,150],
    [180,220,255],
    [220,190,255],
    [180,255,210],
    [255,190,220],
    [240,240,170]

];



// ==========================================
// CIRCLE CLASS
// ==========================================


class Circle {


    constructor(){

        this.radius =
            random(50,150);


        this.x =
            random(
                this.radius,
                canvas.width-this.radius
            );


        this.y =
            random(
                this.radius,
                canvas.height-this.radius
            );


        this.color =
            colors[
                Math.floor(
                    Math.random()*colors.length
                )
            ];


        this.alpha = 0.35;


        // very slow movement

        this.vx =
            random(-0.5,0.5);


        this.vy =
            random(-0.5,0.5);


    }



    update(){


        // movement

        this.x += this.vx;
        this.y += this.vy;



        // soft attraction away from edges

        let margin = 150;


        if(this.x < margin){

            this.vx +=0.01;

        }


        if(this.x > canvas.width-margin){

            this.vx -=0.01;

        }


        if(this.y < margin){

            this.vy +=0.01;

        }


        if(this.y > canvas.height-margin){

            this.vy -=0.01;

        }



        // keep speed controlled

        this.vx *=0.995;
        this.vy *=0.995;



    }



    draw(){


        ctx.beginPath();


        ctx.fillStyle =
        `rgba(
            ${this.color[0]},
            ${this.color[1]},
            ${this.color[2]},
            ${this.alpha}
        )`;


        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );


        ctx.fill();


    }



}



// ==========================================
// CREATE CIRCLES
// ==========================================


for(let i=0;i<9;i++){

    circles.push(
        new Circle()
    );

}




// ==========================================
// ANIMATION LOOP
// ==========================================


function animate(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    circles.forEach(circle=>{


        if(!animationPaused){

            circle.update();

        }


        circle.draw();


    });



    detectOverlaps();



    animationFrame =
        requestAnimationFrame(
            animate
        );


}


animate();





// ==========================================
// OVERLAP DETECTION
// ==========================================


function detectOverlaps(){


    for(
        let i=0;
        i<circles.length;
        i++
    ){


        for(
            let j=i+1;
            j<circles.length;
            j++
        ){


            let a =
                circles[i];


            let b =
                circles[j];



            let distance =
            Math.sqrt(
                (a.x-b.x)**2+
                (a.y-b.y)**2
            );



            if(
                distance <
                a.radius+b.radius
            ){


                showColorLabel(
                    (a.x+b.x)/2,
                    (a.y+b.y)/2
                );


            }


        }

    }

}





// ==========================================
// COLOR LABEL
// ==========================================


let lastLabelTime = 0;


function showColorLabel(x,y){


    let now =
        Date.now();


    // prevents too many labels

    if(
        now-lastLabelTime <1500
    ){

        return;

    }


    lastLabelTime = now;



    let rgb =
        getPixelColor(
            x,
            y
        );



    let name =
        getColorName(rgb);



    let label =
        document.createElement("div");


    label.className =
        "color-label";


    label.style.left =
        x+"px";


    label.style.top =
        y+"px";



    label.innerHTML =

    `
    <strong>${name}</strong>
    RGB:
    ${rgb[0]},
    ${rgb[1]},
    ${rgb[2]}
    `;



    labelContainer.appendChild(label);



    setTimeout(()=>{

        label.remove();

    },2500);



}






// ==========================================
// SAMPLE REAL CANVAS COLOR
// ==========================================


function getPixelColor(x,y){


    let pixel =
        ctx.getImageData(
            x,
            y,
            1,
            1
        ).data;



    return [

        pixel[0],
        pixel[1],
        pixel[2]

    ];


}





// ==========================================
// SIMPLE COLOR NAME DATABASE
// ==========================================


function getColorName(rgb){


    let names = {


        "255,200,200":
        "Soft Pink",


        "200,220,255":
        "Light Blue",


        "220,200,255":
        "Lavender",


        "200,255,220":
        "Mint",


        "255,220,180":
        "Peach",


        "240,240,190":
        "Cream"


    };


    let closest =
        "Mixed Color";


    let smallest =
        Infinity;



    for(let color in names){


        let values =
            color.split(",")
            .map(Number);



        let distance =

        Math.sqrt(

            (rgb[0]-values[0])**2+
            (rgb[1]-values[1])**2+
            (rgb[2]-values[2])**2

        );



        if(distance < smallest){

            smallest = distance;

            closest =
            names[color];

        }


    }


    return closest;


}





// ==========================================
// SPACEBAR PAUSE / RESUME
// ==========================================


document.addEventListener(
"keydown",
function(event){


    if(event.code==="Space"){

        event.preventDefault();


        animationPaused =
            !animationPaused;


    }


});






// ==========================================
// EXERCISE TABS
// ==========================================


const tabs =
document.querySelectorAll(".tab");


const panels =
document.querySelectorAll(".exercise-panel");



tabs.forEach(tab=>{


    tab.addEventListener(
        "click",
        ()=>{


            tabs.forEach(t=>
                t.classList.remove("active")
            );


            panels.forEach(panel=>
                panel.classList.remove("active")
            );



            tab.classList.add("active");



            let number =
                tab.dataset.canvas;



            document
            .getElementById(
                "exercise"+number
            )
            .classList.add("active");



        }
    );


});




// ==========================================
// RANDOM NUMBER FUNCTION
// ==========================================


function random(min,max){

    return Math.random()*(max-min)+min;

}