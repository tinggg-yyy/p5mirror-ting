let angle = 0;
let a = 0;

function setup() {
createCanvas(400, 400);
background(0);
}

function draw() {
translate(width/2, height/2);
let x = map(mouseX, 0, width, 0, width/2);
let y = map(mouseY, 0, height, 0, height/2);
let s1 = map(mouseX, 0, width, 0, 5);
let s2 = map(mouseY, 0, height, 0, 5);
let r = random(150, 200);
let g = random(80, 130);
let b = random(200, 250);
let t = random(10, 70);
a = lerp(a, width/4, 0.001);
angle = angle + 60.1;

//flower animation
push();
rotate( radians(angle) );
stroke(200, 170, 200, 80);
strokeWeight(5);
fill(r, g, b, t);
ellipseMode(CENTER);
ellipse(a, a, width/4, height/4);
pop();



push();
rotate( radians(angle) );
stroke(200, 170, 200, 80);
strokeWeight(8);
fill(r, g, b, t);
ellipseMode(CENTER);
scale(s1, s2);
ellipse(x, y, width/6, height/6);
pop();
  

push();
rotate( radians(angle) );
stroke(200, 170, 200, 80);
strokeWeight(8);
fill(r, g, b);
ellipseMode(CENTER);
scale(s1, s2);
ellipse(width/2 - x, height/2 - y, width/6, height/6);
pop();
}