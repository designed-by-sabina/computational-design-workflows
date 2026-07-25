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



/* ==========================================
   COLOR NAMING — via W3C CSS Color Module Level 4
   Replaces ad-hoc RGB-distance naming with:
     1. sRGB -> OKLab conversion (per CSS Color 4 spec)
     2. Nearest-match against the 147 standard CSS
        named colors, compared perceptually in OKLab

   Drop this in ABOVE where getColorName() is currently
   defined in main.js, then delete the old getColorName
   function — this one is a straight replacement with
   the same signature: getColorName(rgb) -> string
   ========================================== */

// ------------------------------------------
// 1. CSS Level 4 named colors (the 147 keywords)
//    Source of truth: https://www.w3.org/TR/css-color-4/#named-colors
// ------------------------------------------
const CSS_NAMED_COLORS = {
  aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4",
  azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000",
  blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a",
  burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e",
  coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c",
  cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b",
  darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b",
  darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc",
  darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b",
  darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3",
  deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969",
  dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", forestgreen:"#228b22",
  fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700",
  goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f",
  grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c",
  indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa",
  lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6",
  lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3",
  lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a",
  lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899",
  lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32",
  linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa",
  mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371",
  mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", mediumturquoise:"#48d1cc", mediumvioletred:"#c71585",
  midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5",
  navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000",
  olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6",
  palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093",
  papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb",
  plum:"#dda0dd", powderblue:"#b0e0e6", purple:"#800080", rebeccapurple:"#663399",
  red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513",
  salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee",
  sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd",
  slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f",
  steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8",
  tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3",
  white:"#ffffff", whitesmoke:"#f5f5f5", yellow:"#ffff00", yellowgreen:"#9acd32"
};

// ------------------------------------------
// 2. sRGB -> OKLab conversion
//    (matrices per the CSS Color Module Level 4 spec,
//    https://www.w3.org/TR/css-color-4/#color-conversion-code)
// ------------------------------------------
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklab([r, g, b]) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  // linear sRGB -> LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_, // L
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_, // a
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_  // b
  ];
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ------------------------------------------
// 3. Precompute OKLab for every named color once
// ------------------------------------------
const NAMED_COLORS_OKLAB = Object.entries(CSS_NAMED_COLORS).map(
  ([name, hex]) => ({ name, oklab: rgbToOklab(hexToRgb(hex)) })
);

// ------------------------------------------
// 4. Public function — same signature as before
// ------------------------------------------
function getColorName(rgb) {
  const target = rgbToOklab(rgb);
  let closest = null;
  let closestDist = Infinity;

  for (const entry of NAMED_COLORS_OKLAB) {
    const dL = target[0] - entry.oklab[0];
    const da = target[1] - entry.oklab[1];
    const db = target[2] - entry.oklab[2];
    const dist = dL * dL + da * da + db * db;
    if (dist < closestDist) {
      closestDist = dist;
      closest = entry.name;
    }
  }

  return titleCase(closest);
}

function titleCase(str) {
  // splits camel-ish CSS names like "cornflowerblue" -> "Cornflowerblue"
  // (CSS names are single words, so this just capitalizes)
  return str.charAt(0).toUpperCase() + str.slice(1);
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

