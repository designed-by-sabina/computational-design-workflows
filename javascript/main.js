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
            random(0.8,1.3);

        this.phase =
            random(0,1000);

    }



    update(){


        // smooth drifting direction

        let angle =

            noise(
                animationTime*0.7 +
                this.offsetX
            )

            *

            Math.PI

            *

            2;



        this.x +=

            Math.cos(angle)

            *

            this.speed;



        this.y +=

            Math.sin(angle)

            *

            this.speed;



        // subtle breathing transparency

        this.alpha =

            0.30 +

            Math.sin(

                animationTime*0.5 +

                this.phase

            )

            *

            0.05;



        // gentle edge avoidance

        const margin =
            this.radius;



        if(this.x < margin){

            this.x += 0.8;

        }

        if(this.x > canvas.width-margin){

            this.x -= 0.8;

        }

        if(this.y < margin){

            this.y += 0.8;

        }

        if(this.y > canvas.height-margin){

            this.y -= 0.8;

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