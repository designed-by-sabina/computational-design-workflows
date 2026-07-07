/* ==========================================
   TRANSPARENCY
   Digital Color Study

   Inspired by Josef Albers'
   Interaction of Color
========================================== */



// ==========================================
// CANVAS
// ==========================================

const canvas =
document.getElementById("colorCanvas");

const ctx =
canvas.getContext("2d");

const sourceLabelContainer =
document.getElementById("sourceLabelContainer");

const discoveredLabelContainer =
document.getElementById("discoveredLabelContainer");

const archiveContainer =
document.getElementById("colorArchiveContainer");



// ==========================================
// GLOBAL STATE
// ==========================================

let circles = [];

let paused = false;

let animationTime = 0;

let hoverLabel = null;

let discoveryLabel = null;



// active overlap regions
let overlapRegions = [];



// discovered archive
let discoveredColors = [];



let lastDiscovery = 0;

const DISCOVERY_COOLDOWN = 2500;



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

    {
        rgb:[255,188,196],
        name:"Soft Pink"
    },

    {
        rgb:[255,222,170],
        name:"Peach"
    },

    {
        rgb:[191,224,255],
        name:"Sky Blue"
    },

    {
        rgb:[219,198,255],
        name:"Lavender"
    },

    {
        rgb:[185,255,215],
        name:"Mint"
    },

    {
        rgb:[255,205,225],
        name:"Rose"
    },

    {
        rgb:[244,239,180],
        name:"Cream"
    }

];



// ==========================================
// CIRCLE CLASS
// ==========================================

class Circle{

    constructor(){


        this.radius =
            random(70,135);



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



        let color =
            palette[
                Math.floor(
                    Math.random()
                    *
                    palette.length
                )
            ];



        this.rgb =
            color.rgb;



        this.name =
            color.name;



        this.alpha =
            0.34;



        // each circle gets its own movement personality

        this.offsetX =
            random(0,5000);

        this.offsetY =
            random(0,5000);

        this.speed =
             random(0.8,1.1);

        this.phase =
            random(0,1000);

        this.homeX = this.x;

        this.homeY = this.y;

        this.driftX = 0;

        this.driftY = 0;

    }



  update(){


    // continuously changing direction

    let angle =

    noise(
        animationTime * 0.35 +
        this.offsetX
    )
    *
    Math.PI
    *
    2;



// floating movement

this.driftX +=

    Math.cos(angle)
    *
    0.03;



this.driftY +=

    Math.sin(angle)
    *
    0.03;



// limit accumulated movement

this.driftX *= 0.98;

this.driftY *= 0.98;



this.x += this.driftX;

this.y += this.driftY;


// =================================
// SOFT PERSONAL SPACE
// =================================


circles.forEach(other=>{


    if(other === this){

        return;

    }


    let dx =
        this.x - other.x;


    let dy =
        this.y - other.y;


    let distance =
        Math.sqrt(
            dx*dx +
            dy*dy
        );



    let minimumDistance =

        (this.radius +
        other.radius)
        *
        0.55;



    if(
        distance < minimumDistance
        &&
        distance > 0
    ){


        let push =

            (
                minimumDistance -
                distance
            )
            *
            0.002;



        this.x +=
            (dx/distance)
            *
            push;



        this.y +=
            (dy/distance)
            *
            push;


    }


});



    // subtle transparency breathing

    this.alpha =

        0.32 +

        Math.sin(
            animationTime * 0.8 +
            this.phase
        )
        *
        0.04;



    // stronger soft boundary steering

    let margin =
        this.radius;



    if(this.x < margin){

        this.x += 1.5;

        this.offsetX += 0.5;

    }



    if(
        this.x >
        canvas.width-margin
    ){

        this.x -= 1.5;

        this.offsetX += 0.5;

    }



    if(this.y < margin){

        this.y += 1.5;

        this.offsetY += 0.5;

    }



    if(
        this.y >
        canvas.height-margin
    ){

        this.y -= 1.5;

        this.offsetY += 0.5;

    }



}



    draw(){

        ctx.beginPath();

        ctx.fillStyle =

        `rgba(
            ${this.rgb[0]},
            ${this.rgb[1]},
            ${this.rgb[2]},
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
// ANIMATION
// ==========================================

function animate(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    if(!paused){

        animationTime += 0.008;

    }



    overlapRegions = [];



    circles.forEach(circle=>{

        if(!paused){

            circle.update();

        }

        circle.draw();

    });



    // these functions will be added
    // in Part 2

    detectOverlaps();

    renderDiscoveryLabel();



    requestAnimationFrame(
        animate
    );

}

animate();

// ==========================================
// LIVE OVERLAP DETECTION
// ==========================================

function detectOverlaps(){

    overlapRegions = [];

    const now = Date.now();

    for(let i=0;i<circles.length;i++){

        for(let j=i+1;j<circles.length;j++){

            let a = circles[i];
            let b = circles[j];

            let d = distance(
                a.x,
                a.y,
                b.x,
                b.y
            );

            let overlap =
                a.radius +
                b.radius -
                d;

            // only significant overlaps

            let threshold =
                (a.radius+b.radius)
                *0.30;

            if(overlap < threshold){

                continue;

            }

            let x =
                (a.x+b.x)/2;

            let y =
                (a.y+b.y)/2;

            // sample actual color on canvas

            let pixel =
                ctx.getImageData(
                    Math.round(x),
                    Math.round(y),
                    1,
                    1
                ).data;

            let rgb = [

                pixel[0],
                pixel[1],
                pixel[2]

            ];

            let region = {

                x,

                y,

                rgb,

                name:getColorName(rgb),

                radius:Math.min(
                    overlap*0.45,
                    60
                )

            };

            overlapRegions.push(
                region
            );

            if(

                now-lastDiscovery >

                DISCOVERY_COOLDOWN

            ){

                registerDiscovery(
                    region
                );

            }

        }

    }

}


// ==========================================
// DISCOVERIES
// ==========================================

function registerDiscovery(region){

    let key =
        normalizeColor(
            region.rgb
        );

    if(
        discoveredColors.includes(
            key
        )
    ){

        return;

    }

    discoveredColors.push(
        key
    );

    lastDiscovery =
        Date.now();

    discoveryLabel = {

        ...region,

        created:lastDiscovery

    };

    addArchiveSwatch(
        region

    );

}

// ==========================================
// DISCOVERY LABEL
// ==========================================

function renderDiscoveryLabel(){

    if(!discoveryLabel){

        return;

    }

    discoveredLabelContainer.innerHTML = "";

    let age =

        Date.now()

        -

        discoveryLabel.created;

    if(age>8000){

        discoveryLabel = null;

        return;

    }

    let opacity = 1;

    if(age>7000){

        opacity =
            1-
            (
                age-7000
            )/1000;

    }

    let label =
        document.createElement("div");

    label.className =
        "discovered-label";

    label.style.left =
        discoveryLabel.x+"px";

    label.style.top =
        discoveryLabel.y+"px";

    label.style.opacity =
        opacity;

    label.innerHTML =

    `
    <strong>

    ${discoveryLabel.name}

    </strong>

    <br>

    RGB

    ${discoveryLabel.rgb[0]},
    ${discoveryLabel.rgb[1]},
    ${discoveryLabel.rgb[2]}

    `;

    discoveredLabelContainer.appendChild(
        label
    );

}


// ==========================================
// ARCHIVE
// ==========================================

function addArchiveSwatch(region){

    let swatch =
        document.createElement("div");

    swatch.className =
        "color-swatch";

    swatch.style.background =

        `rgb(
            ${region.rgb[0]},
            ${region.rgb[1]},
            ${region.rgb[2]}
        )`;

    swatch.innerHTML =

    `
    <strong>

    ${region.name}

    </strong>

    <br>

    RGB

    ${region.rgb[0]},
    ${region.rgb[1]},
    ${region.rgb[2]}

    `;

    archiveContainer.appendChild(
        swatch

    );

}




// ==========================================
// COLOR GROUPING
// ==========================================

function normalizeColor(rgb){

    // finer grouping than before

    let r =
        Math.round(
            rgb[0]/10
        )*10;

    let g =
        Math.round(
            rgb[1]/10
        )*10;

    let b =
        Math.round(
            rgb[2]/10
        )*10;

    return `${r},${g},${b}`;

}





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



        let foundOverlap =
            null;


        let foundCircle =
            null;



        // Check overlap regions first
        // because they are the more important
        // Albers color interactions


        overlapRegions.forEach(region=>{


            let d =
                distance(

                    mouseX,

                    mouseY,

                    region.x,

                    region.y

                );



            if(
                d <
                region.radius
            ){

                foundOverlap =
                    region;

            }


        });






        // Check original circles


        circles.forEach(circle=>{


            let d =
                distance(

                    mouseX,

                    mouseY,

                    circle.x,

                    circle.y

                );



            if(
                d <
                circle.radius
            ){

                foundCircle =
                    circle;

            }


        });







        if(foundOverlap){


            showHoverLabel(
                foundOverlap
            );


        }

        else if(foundCircle){


            showHoverLabel(
                {

                    x:
                    foundCircle.x,


                    y:
                    foundCircle.y,


                    rgb:
                    foundCircle.rgb,


                    name:
                    foundCircle.name

                }
            );


        }

        else{


            removeHoverLabel();


        }


    }

);






// remove label when leaving canvas

canvas.addEventListener(

    "mouseleave",

    function(){

        removeHoverLabel();

    }

);









// ==========================================
// CREATE HOVER LABEL
// ==========================================


function showHoverLabel(item){


    removeHoverLabel();



    let label =
        document.createElement("div");



    label.className =
        "source-label";



    label.innerHTML =


    `

    <strong>
    ${item.name}
    </strong>

    <br>

    RGB

    ${item.rgb[0]},
    ${item.rgb[1]},
    ${item.rgb[2]}

    `;



    label.style.left =
        item.x+"px";



    label.style.top =
        item.y+"px";



    sourceLabelContainer.appendChild(
        label
    );



    hoverLabel =
        label;



}









// ==========================================
// REMOVE HOVER LABEL
// ==========================================


function removeHoverLabel(){


    if(hoverLabel){


        hoverLabel.remove();


        hoverLabel =
            null;


    }


}



// ==========================================
// COLOR NAMING USING HSL PERCEPTION
// ==========================================


function getColorName(rgb){


    let hsl =
        rgbToHsl(

            rgb[0],

            rgb[1],

            rgb[2]

        );



    let h =
        hsl.h;



    let s =
        hsl.s;



    let l =
        hsl.l;



    let prefix = "";



    // lightness description


    if(l > 85){

        prefix =
            "Light ";

    }

    else if(l < 35){

        prefix =
            "Deep ";

    }

    else if(s < 45){

        prefix =
            "Muted ";

    }






    let name;



    // hue families


    if(s < 15){

        name =
            "Neutral Gray";

    }


    else if(h < 15){

        name =
            "Red";

    }


    else if(h < 45){

        name =
            "Peach";

    }


    else if(h < 70){

        name =
            "Yellow";

    }


    else if(h < 160){

        name =
            "Green";

    }


    else if(h < 200){

        name =
            "Turquoise";

    }


    else if(h < 250){

        name =
            "Blue";

    }


    else if(h < 290){

        name =
            "Lavender";

    }


    else if(h < 340){

        name =
            "Pink";

    }


    else{

        name =
            "Rose";

    }



    return prefix + name;



}









// ==========================================
// RGB TO HSL
// ==========================================


function rgbToHsl(r,g,b){


    r /= 255;

    g /= 255;

    b /= 255;



    let max =
        Math.max(
            r,
            g,
            b
        );



    let min =
        Math.min(
            r,
            g,
            b
        );



    let h;

    let s;

    let l =
        (max+min)/2;



    if(max===min){


        h = 0;

        s = 0;


    }

    else{


        let d =
            max-min;



        s =

        l > 0.5

        ?

        d /
        (2-max-min)

        :

        d /
        (max+min);




        switch(max){


            case r:

                h =
                (g-b)
                /
                d
                +
                (g<b ? 6 : 0);

                break;



            case g:

                h =
                (b-r)
                /
                d
                +
                2;

                break;



            case b:

                h =
                (r-g)
                /
                d
                +
                4;

                break;


        }



        h *= 60;


    }



    return {


        h:h,


        s:s*100,


        l:l*100


    };


}









// ==========================================
// SPACEBAR PAUSE / RESUME
// ==========================================


document.addEventListener(

    "keydown",

    function(event){



        if(event.code === "Space"){


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
document.querySelectorAll(
    ".tab"
);



const panels =
document.querySelectorAll(
    ".exercise-panel"
);



tabs.forEach(tab=>{


    tab.addEventListener(

        "click",

        function(){



            tabs.forEach(t=>{


                t.classList.remove(
                    "active"
                );


            });




            panels.forEach(panel=>{


                panel.classList.remove(
                    "active"
                );


            });





            tab.classList.add(
                "active"
            );





            let target =

                document.getElementById(

                    "exercise"
                    +
                    tab.dataset.canvas

                );



            if(target){

                target.classList.add(
                    "active"
                );

            }



        }


    );


});









// ==========================================
// UTILITY FUNCTIONS
// ==========================================


function distance(
    x1,
    y1,
    x2,
    y2
){


    return Math.sqrt(

        (x2-x1)**2

        +

        (y2-y1)**2

    );


}









function noise(value){


    return (

        Math.sin(value)

        +

        Math.sin(value*0.37)

        +

        Math.sin(value*0.11)


    )

    /

    3

    *

    0.5

    +

    0.5;



}









function random(min,max){


    return Math.random()

    *

    (max-min)

    +

    min;



}

