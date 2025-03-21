let gui;
let objParams = {
  density: 0.1,
  frameRate: 0,
};

let particle = [];
let x0;
let y0;
let waterlevel;

function setup() {
  createCanvas(600, 600);
 

  waterlevel = height / 6;

  gui = new dat.GUI();
  gui.add(objParams, "frameRate").step(0.01).listen();
  gui.add(objParams, "density").min(0.1).max(0.15).step(0.001).listen();
}

function draw() {
    background(0,10);// ***

  //framerate
  objParams.frameRate = frameRate().toFixed(2);

  //water level
  stroke(255);
  line(0, waterlevel, width, waterlevel);

  //initial position
  x0 = width / 2;
  y0 = 0;

  particle.push(new Particle(x0, y0));

  for (let i = 0; i < particle.length; i++) {
    let p = particle[i];

    // control
    p.updateByGui();

    ///// ENV FORCES /////
    // fall
    let gravity = createVector(0, 0.01);
    p.applyForce(gravity);

    // float
    if (p.pos.y > waterlevel) {
      let depth = map(p.pos.y, waterlevel, height, 1, 1.5);
      let buoyancy = createVector(0, -0.1);
      buoyancy.mult(p.mass * p.density * depth);
      p.applyForce(buoyancy);

      p.diffuse();
    }

    // move
    p.update();
    
    //damping
    
    

    // check & compare
    p.bounce();
    p.checkEdges();

    // display
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
    this.acc = createVector(0, 0);

    this.mass = 1;
    this.density = 1;
    this.dia = this.mass * this.density;
  }
  update() {
    // drip!
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  applyForce(f) {
    if (this.mass > 0) {
      let force = f.copy();
      force.div(this.mass);
      this.acc.add(force);
    }
  }
  diffuse() {
    //let force = p5.Vector.fromAngle(0);
    let force = createVector(1, 0);

    let freqX = this.pos.x * 0.01 + frameCount * 0.05;
    let freqY = this.pos.y * 0.02 + frameCount * 0.05;
    let angle = map(noise(freqX, freqY), 0, 1, 0, PI * 4);

    // sine
    let mag = 0.02;

    force.rotate(angle);
    force.mult(mag);
    this.applyForce(force);
  }

  bounce() {
    if (this.pos.y > height) {
      this.vel.y *= -1;
    }
  }
  checkEdges() {
    if (this.pos.y < 0) {
      this.isDone = true;
    }
  }

  updateByGui() {
    this.density = objParams.density;
  }

  display() {
    //drawBlob
    push();
    blendMode(ADD);
    fill(255, 53);
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
