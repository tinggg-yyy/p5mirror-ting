let gui;
let objParams = {
  density: 0.1,
  frameRate: 0,
};

let particle = [];
let COEFFICIENT_OF_RESISTANCE = 0.003;
let bouncing = false;

function setup() {
  createCanvas(600, 600);

  gui = new dat.GUI();
  gui.add(objParams, "frameRate").step(0.01).listen();
  gui.add(objParams, "density").min(0.07).max(0.13).step(0.001).listen();
}

function draw() {
  background(0, 30); // ***
  //background(255, 40); // ***

  //framerate
  objParams.frameRate = frameRate().toFixed(2);

  //mousepressed
  if (mouseIsPressed === true) {
    particle.push(new Particle(mouseX, 0));
  }

  for (let i = 0; i < particle.length; i++) {
    let p = particle[i];

    // control
    p.updateByGui();

    ///// ENV FORCES /////
    // fall
    let gravity = createVector(0, 0.03);
    p.applyForce(gravity);

    // waterresistance
    let resistance = p.vel.copy();
    resistance.normalize();
    resistance.mult(-1);
    let speed = p.vel.mag();
    let magnitude = speed * speed * COEFFICIENT_OF_RESISTANCE;
    resistance.mult(magnitude);
    p.applyForce(resistance);

    // float
    let depth = map(p.pos.y, 0, height, 1, 1.5);
    let buoyancy = createVector(0, -0.2);
    buoyancy.mult(p.mass * p.density * depth);
    p.applyForce(buoyancy);
    p.diffuse();

    // move
    p.update();

    // check & compare
    p.bounce();
    p.checkEdges();

    // display
    p.display();
  }

  while (particle.length > 700) {
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

  resist(r) {
    if (this.mass > 0) {
      let resistance = r.copy();
      resistance.div(this.mass);
      this.acc.mult(resistance);
    }
  }

  diffuse() {
    let diffusion = createVector(0.15, 0);

    let freqX = this.pos.x * 0.3 + frameCount * 0.01;
    let freqY = this.pos.y * 0.3 + frameCount * 0.01;
    let angle = map(noise(freqX, freqY), 0, 1, 0, PI * 3);

    // sine
    let mag = sin(-frameCount * 0.02) * 0.05;

    diffusion.rotate(angle);
    diffusion.mult(mag);
    this.applyForce(diffusion);
  }

  bounce() {
    if (this.pos.y > height) {
      this.vel.y *= -0.5; //damping
      bouncing = true;
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
    fill(255, 1);
    //fill(100, 10, 0, 5);
    noStroke();
    translate(this.pos.x, this.pos.y);

    let newX, newY, freq;
    this.dia = this.pos.y / 20 + 5;

    freq = frameCount * 0.05;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    freq = frameCount * 0.1;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    freq = frameCount * 0.2;
    newX = cos(freq) * this.dia * 0.05;
    newY = sin(freq) * this.dia * 0.05;
    circle(newX, newY, this.dia);
    circle(newX, newY, this.dia * 0.9);
    circle(newX, newY, this.dia * 0.75);

    pop();
  }
}
