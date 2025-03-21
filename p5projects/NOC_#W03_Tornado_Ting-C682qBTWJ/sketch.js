let dust = [];
let a;
let b;

function setup() {
  createCanvas(450, 450);
}

function draw() {
  background(0);
  a = width/2;
  b = height -20;
  dust.push(new Dust(a, b));
  
if (mouseIsPressed === true) {
    frameRate(10);
  } else {
    frameRate(60);
  }
  
for (let i = 0; i < dust.length; i++) {
let d = dust[i];
d.rise();
d.checkEdges();
d.display();
}
  
while (dust.length > 200) {
dust.splice(0, 1); 
}
for (let i = dust.length - 1; i >= 0; i--) {
let d = dust[i];
if (d.isDone) {
dust.splice(i, 10); 
}
}
}

class Dust{
constructor(x, y) {
this.pos = createVector(x, y);
this.vel = createVector(random(-2, 2), 0);
this.float = createVector(0, random(-1, 0));
this.wind1 = createVector(random(0, 1), random(0, 0.01));
this.wind2 = createVector(random(0, 1), random(-0.01, 0));
this.r = random(0, 255);
this.g = random(0, 255);
this.b = random(0, 255);
this.t = 90;
}
  
  
rise(){
this.pos.add(this.vel);
this.pos.add(this.float);
if( this.pos.x > width/2 + (height -this.pos.y)/(width/2-mouseX)*10){
  this.vel.sub(this.wind1);
}
if( this.pos.x <= width/2 - (height -this.pos.y)/(mouseX-width/2)*10){
  this.vel.add(this.wind2);
}
}
  
  
checkEdges(){
if (this.pos.y < 0) {
this.isDone = true;
}
}

  
display(){
  push();
  blendMode(ADD);
  //translate(this.pos.x, this.pos.y);
  fill(this.r, this.g, this.b, this.t);
  noStroke();
  circle(this.pos.x, this.pos.y, 10* (height + 100 - this.pos.y)/this.pos.y);
  pop();
} 
}