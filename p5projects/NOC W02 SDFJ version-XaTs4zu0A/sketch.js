let fire = [];
let word = [];
let angle1;
let angle2;
let s;
let a;
let b;
let d;
let a0;
let b0;
let rChange;


function setup() {
createCanvas(450, 450);
angle1 = -90;
rChange = 5;
}

function draw() {
background(0);
a = random(-100, width);
b = random(height - 300, height);
a0 = random(70, width-70);
b0 = random(20, height/3);

fire.push(new Fire(a, b));
if(keyIsPressed && key === "s"){
word.push(new Word(a0, b0));
}

for (let j = 0; j < word.length; j++) {
let w = word[j];
w.display();
w.bounce();
}

for (let i = 0; i < fire.length; i++) {
let f = fire[i];
f.rise();
f.reappear();
f.checkEdges();
f.display();
}
  
  
while (word.length > 20) {
word.splice(0, 1); 
}

for (let j = word.length - 1; j >= 0; j--) {
let w = word[j];
if (w.isDone) {
word.splice(j, 1); 
}
}
while (fire.length > 1000) {
fire.splice(0, 1); 
}

for (let i = fire.length - 1; i >= 0; i--) {
let f = fire[i];
if (f.isDone) {
fire.splice(i, 10); 
}
}
}

class Word{
constructor(x, y) {
this.pos = createVector(x, y);
this.vel = createVector(random(-0.5, 0.5), random(0.5, 0.5));
this.r = random(220, 255);
this.g = random(220, 255);
this.b = random(220, 255);
this.t = 90;
}
  
bounce(){
  this.pos.add(this.vel.x,this.vel.y * this.pos.y/150 * (height -mouseY)/90);
    if (this.pos.x < 70) {
      this.vel.mult(-1, 1);
    } else if (this.pos.x > width-70) {
      this.vel.mult(-1, 1);
    } 
    if (this.pos.y < 20) {
      this.vel.mult(1, -1);
    } else if (this.pos.y > height/2) {
      this.vel.mult(1, -1);
    }
  }
  
  checkEdges() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.isDone = true;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.isDone = true;
    }
  }

display(){
push();
d = random(28, 30);
translate(this.pos.x, this.pos.y);
fill(this.r, this.g, this.b, this.t);
stroke(this.r, this.g, this.b, this.t);
strokeWeight(5);
textAlign(CENTER);
textFont('Courier New', d);
text("SDFJ", 0, 0);
pop();
}
}


class Fire {
constructor(x, y) {
this.pos = createVector(x, y);
this.vel = createVector(random(-0.001, 0.001), random(0.1, 1));
this.r = 225;
this.g = random(50, 100);
this.b = random(50, 70);
this.lifespan = 90;
this.rotSpd = random(0.01, 0.03);
this.isDone = false;
}


rise() {    
this.pos.sub(this.vel);
let acc = createVector(0, 0.002);
this.vel.add(acc);
this.lifespan -= 0.1;
}

reappear(){
if (this.pos.y < 0) {
this.pos.y = height;
this.vel = createVector(random(-0.001, 0.001), random(0.02, 0.05));
return this.lifespan < 0;
}
}


checkEdges(){
if (this.pos.y < 0 || this.pos.y > height) {
this.isDone = true;
}
}


display() {
push();
blendMode(ADD);
angle2 = angle2+random(-0.2, 0.2);
s = random(this.pos.y*(height-mouseY)/250000);
translate(this.pos.x, this.pos.y);
scale(s);
rotate(radians(angle2));
noStroke();
fill(this.r, this.g, this.b, this.lifespan);
this.r += rChange;
//ellipse(this.pos.x, this.pos.y, 150, 100);
//fireshape
beginShape();
vertex(200,45); 
vertex(155,130); 
vertex(120,190); 
vertex(85,270); 
vertex(140,330); 
vertex(230,355); 
vertex(270,330); 
vertex(320,230); 
vertex(250,160); 
vertex(220,100); 
curveVertex(205,60); 
endShape(CLOSE);
pop();
}
}


