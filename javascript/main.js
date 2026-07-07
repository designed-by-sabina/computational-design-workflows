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

let discoveryAreas = [];

let discoveredColors = [];


let paused = false;


let animationTime = 0;


let hoverLabel = null;


let discoveryLabel = null;


let lastDiscoveryTime = 0;


const discoveryCooldown = 3500;









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


    [255,180,190],


    [255,220,160],


    [190,225,255],


    [220,190,255],


    [180,255,215],


    [255,200,220],


    [245,235,170]


];









// ==========================================
// CIRCLE OBJECT
// ==========================================


class Circle{


constructor(){


    this.radius =
        random(70,130);



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



    this.offsetX =
        random(0,1000);


    this.offsetY =
        random(0,1000);



    this.speed =
        random(0.6,1);



    this.name =
        getColorName(
            this.color
        );



}





update(){


    let driftX =
        noise(
            animationTime +
            this.offsetX
        );


    let driftY =
        noise(
            animationTime +
            this.offsetY
        );



    this.x +=
        (driftX-0.5)
        *
        this.speed;



    this.y +=
        (driftY-0.5)
        *
        this.speed;





    let margin =
        this.radius;



    if(this.x < margin){

        this.x += 0.5;

    }



    if(
        this.x >
        canvas.width-margin
    ){

        this.x -= 0.5;

    }



    if(this.y < margin){

        this.y += 0.5;

    }



    if(
        this.y >
        canvas.height-margin
    ){

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









// ==========================================
// CREATE INITIAL CIRCLES
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









// ==========================================
// CREATE MIXED COLOR
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
normalizeColor(rgb);



if(
discoveredColors.includes(key)
){

return;

}



discoveredColors.push(key);



let name =
getColorName(rgb);



let area = {


x:x,


y:y,


radius:90,


rgb:rgb,


name:name



};



discoveryAreas.push(area);



showDiscoveryLabel(
area
);



addArchive(
area
);



}









// ==========================================
// DISCOVERY TAG
// ==========================================


function showDiscoveryLabel(area){



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
New Color Relationship
</strong>

${area.name}

<br>

RGB
${area.rgb[0]},
${area.rgb[1]},
${area.rgb[2]}

`;



label.style.left =
area.x+"px";


label.style.top =
area.y+"px";



discoveredLabelContainer.appendChild(
label
);



discoveryLabel =
label;



setTimeout(()=>{


if(discoveryLabel){


discoveryLabel.style.opacity =
0;



setTimeout(()=>{


if(discoveryLabel){

discoveryLabel.remove();

discoveryLabel=null;

}


},1000);


}


},8000);



}









// ==========================================
// HOVER LABELS
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



let circleFound = null;


let intersectionFound = null;





// check intersections first

discoveryAreas.forEach(area=>{


let d =
distance(

mouseX,

mouseY,

area.x,

area.y

);



if(
d < area.radius
){

intersectionFound =
area;

}


});





// check circles


circles.forEach(circle=>{


let d =
distance(

mouseX,

mouseY,

circle.x,

circle.y

);



if(
d < circle.radius
){

circleFound =
circle;

}


});






if(intersectionFound){


showHoverLabel(
intersectionFound
);


}

else if(circleFound){


showHoverLabel(
circleFound
);


}

else{


removeHoverLabel();


}



});









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









function removeHoverLabel(){


if(hoverLabel){

hoverLabel.remove();

hoverLabel=null;

}


}









// ==========================================
// COLOR NAMING
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



if(l>85){

prefix =
"Light ";

}

else if(l<35){

prefix =
"Deep ";

}

else if(s<40){

prefix =
"Muted ";

}




let name;



if(s<15){

name =
"Neutral Gray";

}


else if(h<15){

name =
"Red";

}

else if(h<45){

name =
"Peach";

}

else if(h<70){

name =
"Yellow";

}

else if(h<160){

name =
"Green";

}

else if(h<200){

name =
"Turquoise";

}

else if(h<250){

name =
"Blue";

}

else if(h<290){

name =
"Lavender";

}

else if(h<340){

name =
"Pink";

}

else{

name =
"Rose";

}



return prefix+name;



}









function rgbToHsl(r,g,b){


r/=255;

g/=255;

b/=255;


let max =
Math.max(r,g,b);


let min =
Math.min(r,g,b);


let h,s,l;


l =
(max+min)/2;



if(max===min){

h=0;

s=0;


}

else{


let d =
max-min;


s =
l>0.5
?
d/(2-max-min)
:
d/(max+min);



switch(max){


case r:

h =
(g-b)/d +
(g<b?6:0);

break;


case g:

h =
(b-r)/d+2;

break;


case b:

h =
(r-g)/d+4;

break;


}



h*=60;


}



return {


h:h,


s:s*100,


l:l*100


};


}









// ==========================================
// ARCHIVE
// ==========================================


function addArchive(area){



let card =
document.createElement("div");



card.className =
"color-swatch";



card.style.background =

`
rgb(
${area.rgb[0]},
${area.rgb[1]},
${area.rgb[2]}
)
`;



card.innerHTML =


`
<strong>
${area.name}
</strong>

RGB

${area.rgb[0]},
${area.rgb[1]},
${area.rgb[2]}

`;



archiveContainer.appendChild(card);



}









function normalizeColor(rgb){


return [

Math.round(rgb[0]/25)*25,

Math.round(rgb[1]/25)*25,

Math.round(rgb[2]/25)*25

].join(",");


}









// ==========================================
// SPACEBAR
// ==========================================


document.addEventListener(
"keydown",
e=>{


if(e.code==="Space"){


e.preventDefault();


paused =
!paused;


}


});









// ==========================================
// TABS
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


panels.forEach(p=>

p.classList.remove(
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
// HELPERS
// ==========================================


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




function distance(x1,y1,x2,y2){

return Math.sqrt(

(x1-x2)**2+

(y1-y2)**2

);

}




function random(min,max){

return Math.random()
*
(max-min)
+
min;

}