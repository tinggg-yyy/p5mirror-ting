let gui;
let ui = {
  a: 100,
  l: 20,
  i: 6,
};

let angle1 = 0;

const RESOLUTION = 50;
const FREQ_POS = 0.0035;
const FREQ_TIME = 0.0015;
let rows, cols;
let angles = [];
let vehicles = [];

function setup() {
  createCanvas(700, 700);
  gui = new dat.GUI();
  gui.add(ui, "a", 100, 500);
  gui.add(ui, "l", 20, 107.5);
  gui.add(ui, "i", 6, 25);

  //Pattern
  cols = ceil(width/ RESOLUTION);
  rows = ceil(height/ RESOLUTION);

  for (let i = 0; i < 100; i++) {
    vehicles.push(
      new Vehicle(
       width/2 + random(-0.1 * i, 0.1 * i),
       height/2 + random(-0.1 * i, 0.1 * i)
      )
    );
  }
}

function draw() {
  background(0);
  
  // vehicles
  // empty the angles array
  angles = [];
  // draw and update the flow field;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * RESOLUTION;
      let y = r * RESOLUTION;

      // angle from center
      let gridCenter = createVector(x + RESOLUTION / 2, y + RESOLUTION / 2);
      let center = createVector(width / 2, height / 2);
      let vectorToCenter = p5.Vector.sub(x, y, gridCenter);
      let rotateAngle = map(sin(frameCount * 0.01), -1, 1, 0, 45);
      vectorToCenter.rotate(radians(rotateAngle));
      let angleFromCenter = vectorToCenter.heading();

      // angle from noise
      let xFrq = x * FREQ_POS + frameCount * FREQ_TIME;
      let yFrq = y * FREQ_POS + frameCount * FREQ_TIME;
      let noiseValue = noise(xFrq, yFrq); // 0 to 1
      let angleFromNoise = map(noiseValue, 0, 1, 0, PI); // ***

      let angle2 = angleFromCenter + angleFromNoise;
      //let angle = angleFromCenter;
      //let angle = angleFromNoise;
      angles.push(angle2);
      
      
      push();
      // draw grid
      translate(x, y);
      fill(0);
      stroke(255, 100);
      rect(0, 0, RESOLUTION, RESOLUTION);

      // diplay line
      translate(RESOLUTION / 2, RESOLUTION / 2);
      let vector = p5.Vector.fromAngle(angle2);
      vector.mult(RESOLUTION / 2);
      stroke(255);
      line(0, 0, vector.x, vector.y);

      // draw index
      let index = angles.length;
      fill(255);
      noStroke();
      text(index, -15, -5);

      pop();
    }
  }

  for (let v of vehicles) {
    v.flow(angle1);
    v.update();
    v.reappear();
    //v.attractedTo();
    //v.seek(target);
    //v.display();
    v.displayPoint();
  }

  //pattern
  translate(width / 2, height / 2);
  angle1 = floor(map(ui.a, 0, width, 0, 180));
  noFill();
  //stroke(255);
  ui.i = ui.i + 0.005;
  ui.a = ui.a + 1.5;
  ui.l = ui.l + 0.1;
  if (ui.l > 107.5) {
    ui.l = 20;
  }

  for (let i = 0; i < ui.i; i++) {
    drawBranch(0, 0, (360 / ui.i) * i, ui.l);
  }
}

function drawBranch(x, y, deg, len) {
  let angle = radians(deg);
  let targetX = x + cos(angle) * len;
  let targetY = y + sin(angle) * len;
  let targetX1 = x - cos(angle) * len;
  let targetY1 = y - sin(angle) * len;

  //stroke(255);
  //line(x, y, targetX, targetY);

  if (len > 10) {
    drawBranch(targetX, targetY, deg - angle1, len * 0.7);
    drawBranch(targetX, targetY, deg + angle1, len * 0.7);
  }

  noStroke();
  fill(255, 70);
  circle(targetX, targetY, (200 / len) * noise(frameCount * 0.03));
}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    //
    this.mass = 1;
    this.size = 20;
    //
    this.angle = 0;
    //
    this.maxSpeed = 2;
    this.maxSteerForce = 0.1;
  }
  attractedTo(target) {
    let vector = p5.Vector.sub(target, this.pos);
    vector.mult(0.05);
    this.applyForce(vector);
    this.vel.mult(0.9);
  }
  flow(angle) {
    let desiredVel = p5.Vector.fromAngle(angle); // direction
    desiredVel.mult(this.maxSpeed); // desire

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxSteerForce);

    this.applyForce(steerForce);
  }
  seek(target) {
    let desiredVel = p5.Vector.sub(target, this.pos);
    desiredVel.normalize(); // direction
    desiredVel.mult(this.maxSpeed); // desire

    let steerForce = p5.Vector.sub(desiredVel, this.vel);
    steerForce.limit(this.maxSteerForce);

    this.applyForce(steerForce);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.angle = this.vel.heading();
  }
  applyForce(f) {
    if (this.mass <= 0) {
      console.log("Wrong mass");
      return;
    }
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(0);
    triangle(0, 0, -this.size, -this.size * 0.4, -this.size, this.size * 0.4);
    pop();
  }
  displayPoint() {
    push();
    stroke(255, 70);
    circle(this.pos.x, this.pos.y, 3);
    pop();
  }
}
