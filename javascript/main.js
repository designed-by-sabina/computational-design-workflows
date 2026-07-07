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







// ==========================================
// RESIZE CANVAS
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


    [255,180,180], // pink

    [255,220,150], // peach

    [180,220,255], // blue

    [220,190,255], // lavender

    [180,255,210], // mint

    [255,190,220], // rose

    [240,240,170]  // cream


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
                    Math.random()*palette.length
                )
            ];



        this.alpha =
            0.35;



        this.vx =
            random(-1,1);



        this.vy =
            random(-1,1);



        this.name =
            getColorName(
                this.color
            );


    }







    update(){


        this.x += this.vx;

        this.y += this.vy;



        // gentle attraction toward center

        let centerX =
            canvas.width/2;


        let centerY =
            canvas.height/2;



        this.vx +=
            (centerX-this.x)
            *0.0008;



        this.vy +=
            (centerY-this.y)
            *0.0008;





        // speed limit

        let maxSpeed = 1.2;



        this.vx =
            Math.max(
                Math.min(
                    this.vx,
                    maxSpeed
                ),
                -maxSpeed
            );



        this.vy =
            Math.max(
                Math.min(
                    this.vy,
                    maxSpeed
                ),
                -maxSpeed
            );



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
// CREATE INITIAL COMPOSITION
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



        drawSourceLabel(circle);



    });




    detectOverlaps();



    requestAnimationFrame(
        animate
    );


}



animate();









// ==========================================
// ORIGINAL COLOR LABELS
// ==========================================


function drawSourceLabel(circle){


    let existing =
        document.getElementById(
            "source-"+circle.name
        );



    if(!existing){


        let label =
            document.createElement("div");



        label.className =
            "source-label";



        label.id =
            "source-"+circle.name;



        label.innerHTML =

        `
        <span>${circle.name}</span>
        <span>
        ${circle.color[0]}
        /
        ${circle.color[1]}
        /
        ${circle.color[2]}
        </span>
        `;



        sourceLabelContainer.appendChild(label);



        existing = label;


    }




    existing.style.left =
        circle.x+"px";



    existing.style.top =
        circle.y+"px";


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
// CREATE DISCOVERED COLOR
// ==========================================


function createDiscovery(x,y){



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



    discoveredColors.push(key);



    let name =
        getColorName(rgb);




    createDiscoveryLabel(
        x,
        y,
        name,
        rgb
    );



    createArchiveCard(
        name,
        rgb
    );


}









// ==========================================
// DISCOVERY LABEL
// ==========================================


function createDiscoveryLabel(
    x,
    y,
    name,
    rgb
){



    let label =
        document.createElement("div");



    label.className =
        "discovered-label";



    label.innerHTML =

    `
    <strong>${name}</strong>

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


}









// ==========================================
// COLOR ARCHIVE
// ==========================================


function createArchiveCard(
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
    <strong>${name}</strong>

    ${rgb[0]},
    ${rgb[1]},
    ${rgb[2]}

    `;



    archiveContainer.appendChild(
        card
    );


}









// ==========================================
// COLOR NAME FUNCTION
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




    for(let c in colors){


        let values =
            c.split(",")
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
                colors[c];


        }


    }



    return closest;


}









// ==========================================
// SPACEBAR OBSERVATION MODE
// ==========================================


document.addEventListener(
    "keydown",
    function(event){


        if(event.code==="Space"){


            event.preventDefault();


            paused =
                !paused;


        }


    }
);









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


        }
    );


});









// ==========================================
// RANDOM NUMBER
// ==========================================


function random(min,max){


    return Math.random()
    *(max-min)+min;


}