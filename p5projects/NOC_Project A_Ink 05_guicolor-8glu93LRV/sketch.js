let gui;
let ui = {
  r: 0,
  g: 0,
  b: 0,
};
let objParams = {
  density: 0.1,
  frameRate: 0,
};

let particle = [];
let p0; 
let COEFFICIENT_OF_RESISTANCE = 0.003;
let bouncing = false;

function setup() {
  createCanvas(600, 600);

  gui = new dat.GUI();
  gui.add(ui, "r", 0, 255);
  gui.add(ui, "g", 0, 255);
  gui.add(ui, "b", 0, 255);
  gui.add(objParams, "frameRate").step(0.01).listen();
  gui.add(objParams, "density").min(0.07).max(0.13).step(0.001).listen();
}

function draw() {
  //background(0, 20); // ***
  background(255, 20); // ***

  //framerate
  objParams.frameRate = frameRate().toFixed(2);

  //mousepressed
  if (mouseIsPressed === true) {
    particle.push(new Particle(mouseX, 0));
  }
  // p0 = new Particle(mouseX, random(200, 600));

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
    
    //attraction
    //p.attractedTo(p0);
    
//     //spinning
//     let centerPos = createVector(width/2, random(height/2, height));
//   let angle = map(mouseX, 0, width, 0, 10);
    
//     let vector = p5.Vector.sub(centerPos, p.pos);
//     vector.normalize();
//     vector.mult(0.1);
//     vector.rotate( radians(angle) );
//     p.applyForce(vector);

    // move
    p.update();

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
    let diffusion = createVector(0.15, 0);

    let freqX = this.pos.x * 0.5 + frameCount * 0.01;
    let freqY = this.pos.y * 0.5 + frameCount * 0.01;
    let angle = map(noise(freqX, freqY), 0, 1, 0, PI * 4);

    // sine
    let mag = sin(-frameCount * 0.02) * 0.07;

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
  
  attractedTo(other) {
    let force = p5.Vector.sub(other.pos, this.pos);
    force.mult(0.1);
    this.applyForce(force);
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
    //blendMode(ADD);
    blendMode(MULTIPLY);
    fill(ui.r,ui.g,ui.b, 5);
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
