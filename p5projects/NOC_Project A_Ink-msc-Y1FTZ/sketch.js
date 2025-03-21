let gui;
let objParams = {
  density: 0.1,
};

let particle = [];
let x0;
let y0;
let waterlevel;

function setup() {
  createCanvas(600, 600);
  gui = new dat.GUI();
  gui.add(objParams, "density").min(0).max(1).listen();
}

function draw() {
  background(0, 70);

  //framerate
  let fps = frameRate();
  fill(255);
  noStroke();
  text(fps, 0, 600);

  //water level
  stroke(255);
  waterlevel = height / 6;
  line(0, waterlevel, width, waterlevel);

  //initial position
  x0 = width / 2;
  y0 = 0;

  particle.push(new Particle(x0, y0));
  for (let i = 0; i < particle.length; i++) {
    let p = particle[i];
    p.drip();
    p.diffuse();
    p.float();
    p.bounce();
    p.updateByGui();
    p.checkEdges();
    p.display();
  }

  while (particle.length > 1000) {
    particle.splice(0, 1);
  }
  
  for (let i = particle.length - 1; i >= 0; i--) {
    let p = particle[i];
    if (p.isDone) {
      particle.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.gravity = createVector(0, 2);
    this.buoyancy = createVector(0, -0.1);
    this.diffusion = createVector(random(-0.01, 0.01), random(-0.01, 0.01));
    this.density = 1;
    this.dia = 1;
  }

  drip() {
    this.pos.add(this.vel);
    this.pos.add(this.gravity);
  }

  diffuse() {
    if (this.pos.y > waterlevel) {
      this.vel.add(this.diffusion);
    }
  }

  float() {
    this.buoyancy.mult(this.dia * this.density);
    if (this.pos.y > waterlevel) {
      this.vel.add(this.buoyancy);
    }
  }
  
  bounce(){
    if(this.pos.y > height){
      this.vel.mult(-1);
    }
  }

  updateByGui() {
    this.density = objParams.density;
  }

  checkEdges() {
    if (this.pos.y < 0) {
      this.isDone = true;
    }
  }

  display() {
    //drawBlob
    push();
    blendMode(ADD);
    fill(255, 3);
    noStroke();
    translate(this.pos.x, this.pos.y);

    let newX, newY, freq;
    this.dia = (this.pos.y - waterlevel) / 15;

    freq = frameCount * 0.05;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    freq = frameCount * 0.06;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    freq = frameCount * 0.07;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    pop();
  }
}
