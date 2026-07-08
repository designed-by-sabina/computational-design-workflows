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
    150,
    canvas.width-150
);


        this.y =
                random(
    150,
    canvas.height-150
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
            random(0.25,0.45);

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

this.x +=

Math.cos(angle)
*
this.speed;


this.y +=

Math.sin(angle)
*
this.speed;

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
    0.85;



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
            0.008;



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

            let rgb = [

Math.round(
    (a.rgb[0]+b.rgb[0])/2
),

Math.round(
    (a.rgb[1]+b.rgb[1])/2
),

Math.round(
    (a.rgb[2]+b.rgb[2])/2
)

];

           let region = {


    x,

    y,


    rgb,


    name:getColorName(rgb),


    circleA:a,


    circleB:b


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


    let insideOverlap = false;



    // check distance to both original circles

    let d1 =
        distance(

            mouseX,

            mouseY,

            region.circleA.x,

            region.circleA.y

        );



    let d2 =
        distance(

            mouseX,

            mouseY,

            region.circleB.x,

            region.circleB.y

        );



    if(

        d1 < region.circleA.radius + 5

        &&

        d2 < region.circleB.radius + 5

    ){

        insideOverlap = true;

    }



    if(insideOverlap){

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

    let hsl = rgbToHsl(
        rgb[0],
        rgb[1],
        rgb[2]
    );


    let h = hsl.h;
    let s = hsl.s;
    let l = hsl.l;


    let intensity = "";
    let brightness = "";


    // ----------------------------
    // Saturation language
    // ----------------------------
if(s < 20){

    intensity = "Cloud";

}

else if(s < 40){

    intensity = "Dusty";

}

else if(s < 65){

    intensity = "Soft";

}

    else{

        intensity = "Vivid";

    }



    // ----------------------------
    // Lightness language
    // ----------------------------

    if(l > 85){

    brightness = "Pale";

}

else if(l > 75){

    brightness = "Light";

}

else if(l < 30){

    brightness = "Deep";

}

else if(l < 45){

    brightness = "Dark";

}



    // ----------------------------
    // Hue families
    // ----------------------------

if(h < 6){

    family = "Crimson";

}

else if(h < 12){

    family = "Scarlet";

}

else if(h < 18){

    family = "Red";

}

else if(h < 24){

    family = "Ruby";

}

else if(h < 30){

    family = "Rose";

}

else if(h < 36){

    family = "Blush";

}

else if(h < 42){

    family = "Coral";

}

else if(h < 48){

    family = "Salmon";

}

else if(h < 54){

    family = "Peach";

}

else if(h < 60){

    family = "Apricot";

}

else if(h < 66){

    family = "Amber";

}

else if(h < 72){

    family = "Gold";

}

else if(h < 78){

    family = "Yellow";

}

else if(h < 84){

    family = "Lemon";

}

else if(h < 90){

    family = "Chartreuse";

}

else if(h < 96){

    family = "Lime";

}

else if(h < 102){

    family = "Spring Green";

}

else if(h < 108){

    family = "Green";

}

else if(h < 114){

    family = "Leaf";

}

else if(h < 120){

    family = "Olive";

}

else if(h < 126){

    family = "Moss";

}

else if(h < 132){

    family = "Sage";

}

else if(h < 138){

    family = "Fern";

}

else if(h < 144){

    family = "Mint";

}

else if(h < 150){

    family = "Seafoam";

}

else if(h < 156){

    family = "Aqua";

}

else if(h < 162){

    family = "Turquoise";

}

else if(h < 168){

    family = "Teal";

}

else if(h < 174){

    family = "Cyan";

}

else if(h < 180){

    family = "Ice Blue";

}

else if(h < 186){

    family = "Sky Blue";

}

else if(h < 192){

    family = "Azure";

}

else if(h < 198){

    family = "Cerulean";

}

else if(h < 204){

    family = "Blue";

}

else if(h < 210){

    family = "Cobalt";

}

else if(h < 216){

    family = "Royal Blue";

}

else if(h < 222){

    family = "Ultramarine";

}

else if(h < 228){

    family = "Indigo";

}

else if(h < 234){

    family = "Deep Blue";

}

else if(h < 240){

    family = "Violet Blue";

}

else if(h < 246){

    family = "Periwinkle";

}

else if(h < 252){

    family = "Lavender";

}

else if(h < 258){

    family = "Lilac";

}

else if(h < 264){

    family = "Purple";

}

else if(h < 270){

    family = "Amethyst";

}

else if(h < 276){

    family = "Orchid";

}

else if(h < 282){

    family = "Plum";

}

else if(h < 288){

    family = "Mauve";

}

else if(h < 294){

    family = "Magenta";

}

else if(h < 300){

    family = "Fuchsia";

}

else if(h < 306){

    family = "Pink";

}

else if(h < 312){

    family = "Rose Pink";

}

else if(h < 318){

    family = "Dusty Rose";

}

else if(h < 324){

    family = "Berry";

}

else if(h < 330){

    family = "Raspberry";

}

else if(h < 336){

    family = "Wine";

}

else if(h < 342){

    family = "Burgundy";

}

else if(h < 348){

    family = "Garnet";

}

else if(h < 354){

    family = "Ruby Red";

}

else{

    family = "Crimson";

}



    // ----------------------------
    // Special neutral handling
    // ----------------------------


    if(s < 15){

        if(l > 90){

            return "White";

        }

        else if(l < 15){

            return "Black";

        }

        else{

            return "Neutral Gray";

        }

    }



    // ----------------------------
    // Assemble name
    // ----------------------------


    let result = "";


    if(brightness){

        result += brightness + " ";

    }


    if(intensity){

        result += intensity + " ";

    }


    result += family;



    return result.trim();


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


const buttons =
document.querySelectorAll(".exercise-button");


const panels =
document.querySelectorAll(".exercise-panel");



buttons.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            buttons.forEach(b=>{

                b.classList.remove("active");

            });


            panels.forEach(panel=>{

                panel.classList.remove("active");

            });



            button.classList.add("active");



            let target =
                document.getElementById(
                    "exercise" +
                    button.dataset.canvas
                );



            if(target){

                target.classList.add("active");

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

