/* ==========================================
   TRANSPARENCY
   Digital Color Study

   Inspired by Josef Albers'
   Interaction of Color

========================================== */



// ===============================
// CANVAS
// ===============================


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

let discoveryAreas = [];

let paused = false;

let animationTime = 0;

let hoverLabel = null;

let discoveryLabel = null;

let lastDiscoveryTime = 0;

const discoveryCooldown = 4000;









// ===============================
// RESIZE
// ===============================


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









// ===============================
// COLORS
// ===============================


const palette = [

    [255,180,180],

    [255,220,150],

    [180,220,255],

    [220,190,255],

    [180,255,210],

    [255,190,220],

    [240,240,170]

];









// ===============================
// CIRCLE CLASS
// ===============================


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



    // organic movement

    this.offsetX =
        random(0,1000);


    this.offsetY =
        random(0,1000);



    // faster movement

    this.speed =
        random(0.5,0.9);



    this.name =
        getColorName(
            this.color
        );


}






update(){


    let dx =
        noise(
            animationTime +
            this.offsetX
        );


    let dy =
        noise(
            animationTime +
            this.offsetY
        );



    this.x +=
        (dx-0.5)
        *
        this.speed;



    this.y +=
        (dy-0.5)
        *
        this.speed;




    // boundaries


    let margin =
        this.radius;



    if(this.x < margin){

        this.x += 0.5;

    }



    if(this.x >
       canvas.width-margin){

        this.x -= 0.5;

    }



    if(this.y < margin){

        this.y += 0.5;

    }



    if(this.y >
       canvas.height-margin){

        this.y -= 0.5;

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









// ===============================
// CREATE CIRCLES
// ===============================


for(let i=0;i<9;i++){


    circles.push(
        new Circle()
    );


}









// ===============================
// ANIMATION
// ===============================


function animate(){


    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    animationTime += 0.01;



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









// ===============================
// HOVER
// ===============================


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




    let circleHover = null;

    let discoveryHover = null;




    circles.forEach(circle=>{


        let d =

        distance(
            mouseX,
            mouseY,
            circle.x,
            circle.y
        );


        if(d < circle.radius){

            circleHover = circle;

        }


    });





    discoveryAreas.forEach(area=>{


        let d =

        distance(
            mouseX,
            mouseY,
            area.x,
            area.y
        );


        if(
            d <
            area.radius
        ){

            discoveryHover = area;

        }


    });





    if(discoveryHover){

        showDiscoveryHoverLabel(
            discoveryHover
        );

    }

    else if(circleHover){

        showCircleHoverLabel(
            circleHover
        );

    }

    else{

        removeHoverLabel();

    }



});









function showCircleHoverLabel(circle){


    removeHoverLabel();



    let label =
        document.createElement("div");



    label.className =
        "source-label";



    label.innerHTML =

    `
    <span>${circle.name}</span>

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









function showDiscoveryHoverLabel(area){


    removeHoverLabel();



    let label =
        document.createElement("div");



    label.className =
        "source-label";



    label.innerHTML =

    `
    <span>${area.name}</span>

    <span>
    RGB
    ${area.rgb[0]},
    ${area.rgb[1]},
    ${area.rgb[2]}
    </span>

    `;



    label.style.left =
        area.x+"px";


    label.style.top =
        area.y+"px";



    sourceLabelContainer.appendChild(
        label
    );



    hoverLabel = label;


}








function removeHoverLabel(){


    if(hoverLabel){

        hoverLabel.remove();

        hoverLabel=null;

    }


}









// ===============================
// OVERLAPS
// ===============================


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



let d =
distance(
a.x,
a.y,
b.x,
b.y
);



let overlap =
a.radius +
b.radius -
d;



let required =

(a.radius+b.radius)
*
0.30;



if(overlap > required){



let now =
Date.now();



if(
now-lastDiscoveryTime
>
discoveryCooldown
){



createDiscovery(
(a.x+b.x)/2,
(a.y+b.y)/2
);



lastDiscoveryTime =
now;


}


}



}


}


}









function createDiscovery(x,y){


let pixel =
ctx.getImageData(
x,
y,
1,
1
).data;



let rgb=[

pixel[0],

pixel[1],

pixel[2]

];



let key =
normalizeColor(rgb);



if(
discoveredColors.includes(key)
){

return;

}



discoveredColors.push(key);



let name =
getColorName(rgb);



discoveryAreas.push({

x:x,

y:y,

radius:80,

name:name,

rgb:rgb

});



showDiscoveryLabel(
x,
y,
name,
rgb
);



addArchive(
name,
rgb
);



}









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



discoveryLabel =
label;



setTimeout(()=>{


if(discoveryLabel){

discoveryLabel.style.opacity=0;


setTimeout(()=>{

if(discoveryLabel){

discoveryLabel.remove();

discoveryLabel=null;

}

},1000);


}


},8000);



}









function addArchive(name,rgb){


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

RGB

${rgb[0]},
${rgb[1]},
${rgb[2]}
`;



archiveContainer.appendChild(card);



}









// ===============================
// COLORS
// ===============================


function normalizeColor(rgb){

return [

Math.round(rgb[0]/20)*20,

Math.round(rgb[1]/20)*20,

Math.round(rgb[2]/20)*20

].join(",");

}






function getColorName(rgb){


let colors={


"255,180,180":"Soft Pink",

"255,220,150":"Peach",

"180,220,255":"Sky Blue",

"220,190,255":"Lavender",

"180,255,210":"Mint",

"255,190,220":"Rose",

"240,240,170":"Cream"


};



let closest="Mixed Color";

let best=Infinity;



for(let c in colors){


let v =
c.split(",")
.map(Number);



let d =

distance(
rgb[0],
rgb[1],
rgb[2],
v[0],
v[1],
v[2]
);



if(d<best){

best=d;

closest=colors[c];

}


}



return closest;


}









// ===============================
// SPACEBAR
// ===============================


document.addEventListener(
"keydown",
function(e){


if(e.code==="Space"){


e.preventDefault();


paused =
!paused;


}


});









// ===============================
// TABS
// ===============================


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



panels.forEach(p=>

p.classList.remove("active")

);



tab.classList.add("active");



document
.getElementById(
"exercise"+tab.dataset.canvas
)
.classList.add("active");


});



});









// ===============================
// HELPERS
// ===============================


function distance(x1,y1,x2,y2){

return Math.sqrt(

(x1-x2)**2+

(y1-y2)**2

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