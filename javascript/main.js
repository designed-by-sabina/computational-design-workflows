/* ==========================================
   TRANSPARENCY
   Digital Color Study

   Inspired by Josef Albers'
   Interaction of Color

========================================== */



// ==========================================
// CANVAS SETUP
// ==========================================


const canvas =
document.getElementById("colorCanvas");


const ctx =
canvas.getContext("2d");



const sourceLabelContainer =
document.getElementById(
    "sourceLabelContainer"
);



const discoveredLabelContainer =
document.getElementById(
    "discoveredLabelContainer"
);



const archiveContainer =
document.getElementById(
    "colorArchiveContainer"
);





let circles = [];

let discoveredColors = [];

let paused = false;


let hoverLabel = null;

let discoveryLabel = null;








// ==========================================
// CANVAS SIZE
// ==========================================


function resizeCanvas(){


    canvas.width =
        canvas.clientWidth;


    canvas.height =
        canvas.clientHeight;


}



window.addEventListener(
    "resize",
    resizeCanvas
);



resizeCanvas();









// ==========================================
// COLOR PALETTE
// ==========================================


const palette = [

    [255,180,180], // Soft Pink

    [255,220,150], // Peach

    [180,220,255], // Sky Blue

    [220,190,255], // Lavender

    [180,255,210], // Mint

    [255,190,220], // Rose

    [240,240,170]  // Cream

];









// ==========================================
// CIRCLE CLASS
// ==========================================


class Circle {


    constructor(){



        this.radius =
            random(60,140);



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
            palette[
                Math.floor(
                    Math.random()
                    *
                    palette.length
                )
            ];



        this.alpha =
            0.35;



        // slow playful movement

        this.vx =
            random(-0.4,0.4);



        this.vy =
            random(-0.4,0.4);



        this.name =
            getColorName(
                this.color
            );


    }








    update(){


        this.x += this.vx;

        this.y += this.vy;



        // natural slowdown

        this.vx *= 0.995;

        this.vy *= 0.995;





        // prevent circles from stopping

        if(
            Math.abs(this.vx)<0.15
        ){

            this.vx +=
                random(
                    -0.05,
                    0.05
                );

        }



        if(
            Math.abs(this.vy)<0.15
        ){

            this.vy +=
                random(
                    -0.05,
                    0.05
                );

        }





        // soft boundary push

        let margin =
            this.radius;



        if(
            this.x < margin
        ){

            this.vx += 0.02;

        }



        if(
            this.x >
            canvas.width-margin
        ){

            this.vx -= 0.02;

        }



        if(
            this.y < margin
        ){

            this.vy += 0.02;

        }



        if(
            this.y >
            canvas.height-margin
        ){

            this.vy -= 0.02;

        }



    }









    draw(){


        ctx.beginPath();



        ctx.fillStyle =

        `
        rgba(
        ${this.color[0]},
        ${this.color[1]},
        ${this.color[2]},
        ${this.alpha}
        )
        `;



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


for(let i=0;i<10;i++){


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


        if(!paused){

            circle.update();

        }



        circle.draw();



    });




    detectOverlaps();



    requestAnimationFrame(
        animate
    );


}



animate();









// ==========================================
// HOVER INTERACTION
// ==========================================


canvas.addEventListener(
"mousemove",
function(event){



    let rect =
        canvas.getBoundingClientRect();



    let mouseX =
        event.clientX -
        rect.left;



    let mouseY =
        event.clientY -
        rect.top;



    let hovered = null;



    circles.forEach(circle=>{


        let distance =

        Math.sqrt(

            (mouseX-circle.x)**2 +

            (mouseY-circle.y)**2

        );



        if(
            distance <
            circle.radius
        ){

            hovered = circle;

        }


    });



    showHoverLabel(
        hovered
    );



});








canvas.addEventListener(
"mouseleave",
function(){


    removeHoverLabel();


});









function showHoverLabel(circle){



    removeHoverLabel();



    if(!circle){

        return;

    }



    let label =
        document.createElement("div");



    label.className =
        "source-label";



    label.innerHTML =

    `
    <span>
    ${circle.name}
    </span>

    <span>
    RGB
    ${circle.color[0]},
    ${circle.color[1]},
    ${circle.color[2]}
    </span>

    `;



    label.style.left =
        circle.x+"px";



    label.style.top =
        circle.y+"px";



    sourceLabelContainer.appendChild(
        label
    );



    hoverLabel = label;



}








function removeHoverLabel(){


    if(hoverLabel){

        hoverLabel.remove();

        hoverLabel = null;

    }


}









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

                (a.x-b.x)**2 +

                (a.y-b.y)**2

            );



            if(
                distance <
                a.radius+b.radius
            ){



                createDiscovery(

                    (a.x+b.x)/2,

                    (a.y+b.y)/2

                );


            }



        }



    }



}









// ==========================================
// DISCOVER NEW COLOR
// ==========================================


function createDiscovery(
x,
y
){



    let pixel =
        ctx.getImageData(
            x,
            y,
            1,
            1
        ).data;



    let rgb = [

        pixel[0],

        pixel[1],

        pixel[2]

    ];



    let key =
        rgb.join(",");



    if(
        discoveredColors.includes(key)
    ){

        return;

    }



    discoveredColors.push(
        key
    );



    let name =
        getColorName(rgb);



    showDiscoveryLabel(
        x,
        y,
        name,
        rgb
    );



    addArchiveColor(
        name,
        rgb
    );



}









// ==========================================
// TEMPORARY DISCOVERY LABEL
// ==========================================


function showDiscoveryLabel(
x,
y,
name,
rgb
){


    if(discoveryLabel){

        discoveryLabel.remove();

    }



    let label =
        document.createElement("div");



    label.className =
        "discovered-label";



    label.innerHTML =

    `
    <strong>
    ${name}
    </strong>

    RGB

    ${rgb[0]},
    ${rgb[1]},
    ${rgb[2]}

    `;



    label.style.left =
        x+"px";



    label.style.top =
        y+"px";



    discoveredLabelContainer.appendChild(
        label
    );



    discoveryLabel = label;



    setTimeout(()=>{


        if(discoveryLabel){

            discoveryLabel.remove();

            discoveryLabel = null;

        }


    },4000);



}









// ==========================================
// COLOR ARCHIVE
// ==========================================


function addArchiveColor(
name,
rgb
){


    let card =
        document.createElement("div");



    card.className =
        "color-swatch";



    card.style.background =

    `
    rgb(
    ${rgb[0]},
    ${rgb[1]},
    ${rgb[2]}
    )
    `;



    card.innerHTML =

    `
    <strong>
    ${name}
    </strong>

    RGB

    ${rgb[0]},
    ${rgb[1]},
    ${rgb[2]}

    `;



    archiveContainer.appendChild(
        card
    );


}









// ==========================================
// COLOR NAMING
// ==========================================


function getColorName(rgb){



    let colors = {


        "255,180,180":
        "Soft Pink",


        "255,220,150":
        "Peach",


        "180,220,255":
        "Sky Blue",


        "220,190,255":
        "Lavender",


        "180,255,210":
        "Mint",


        "255,190,220":
        "Rose",


        "240,240,170":
        "Cream"


    };



    let closest =
        "Mixed Color";



    let smallest =
        Infinity;



    for(let color in colors){


        let values =
            color.split(",")
            .map(Number);



        let distance =

        Math.sqrt(

            (rgb[0]-values[0])**2 +

            (rgb[1]-values[1])**2 +

            (rgb[2]-values[2])**2

        );



        if(distance < smallest){


            smallest =
                distance;


            closest =
                colors[color];


        }


    }



    return closest;



}









// ==========================================
// SPACEBAR PAUSE
// ==========================================


document.addEventListener(
"keydown",
function(event){



    if(event.code === "Space"){


        event.preventDefault();



        paused =
            !paused;


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

            t.classList.remove(
                "active"
            )

        );



        panels.forEach(panel=>

            panel.classList.remove(
                "active"
            )

        );



        tab.classList.add(
            "active"
        );



        document
        .getElementById(
            "exercise"+
            tab.dataset.canvas
        )
        .classList.add(
            "active"
        );


    });


});









// ==========================================
// RANDOM NUMBER
// ==========================================


function random(min,max){


    return Math.random()
    *
    (max-min)
    +
    min;


}