
// let serial; 
// let portName = '/dev/cu.usbmodem101'; 
// let options = { baudrate: 9600}; 
// serial.open(portName, options);
// let inData;      


// GUI
let gui;
let ui = {
  a: 0,
  l: 20,
  // r: 50,
  // g: 50,
  // b: 50,
  // t: 5,
  i: 0,
};

//Pattern
const RESOLUTION = 50;
const FREQ_POS = 0.0035;
const FREQ_TIME = 0.0015;
let rows, cols;
let angleui = 0;
let angles = [];
let vehicles = [];

function setup() {
  createCanvas(800, 800);
  background(0);

  //Serial
  //   serial = new p5.SerialPort();       // make a new instance of the serialport library
  //   serial.on('list', printList);  // set a callback function for the serialport list event
  //   serial.on('connected', serverConnected); // callback for connecting to the server
  //   serial.on('open', portOpen);        // callback for the port opening
  //   serial.on('data', serialEvent);     // callback for when new data arrives
  //   serial.on('error', serialError);    // callback for errors
  //   serial.on('close', portClose);      // callback for the port closing

  //   serial.list();                      // list the serial ports
  //   serial.open(portName);              // open a serial port

  //GUI
  gui = new dat.GUI();
  gui.add(ui, "a", 0, 500);
  gui.add(ui, "l", 5, 200);
  // gui.add(ui, "r", 50, 255);
  // gui.add(ui, "g", 50, 255);
  // gui.add(ui, "b", 50, 255);
  // gui.add(ui, "t", 5, 15);
  gui.add(ui, "i", 0, 10);

  //Pattern
  cols = ceil(width / RESOLUTION);
  rows = ceil(height / RESOLUTION);

  for (let i = 0; i < 100; i++) {
    vehicles.push(
      new Vehicle(
        width / 2 + random(-0.1 * i, 0.1 * i),
        height / 2 + random(-0.1 * i, 0.1 * i)
      )
    );
  }
}

// get the list of ports:
// function printList(portList) {
//   // portList is an array of serial port names
//   for (var i = 0; i < portList.length; i++) {
//     // Display the list the console:
//     console.log(i + portList[i]);
//   }
// }

// function serverConnected() {
//   console.log('connected to server.');
// }

// function portOpen() {
//   console.log('the serial port opened.')
// }

// function serialEvent() {
//  inData = Number(serial.read());
// }

// function serialError(err) {
//   console.log('Something went wrong with the serial port. ' + err);
// }

// function portClose() {
//   console.log('The serial port closed.');
// }

function draw() {
  //background(0);

  //data
  //  text("sensor value: " + inData, 30, 50);
  angleui = floor(map(ui.a, 0, width, 0, 180));

  noFill();
  //stroke(255);
  for (let i = 0; i < ui.i; i++) {
    drawBranch(width / 2, height / 2, (360 / ui.i) * i, ui.l);
  }

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
      let angleFromNoise = map(noiseValue, 0, 1, 0, PI * 6); // ***

      let angle = angleFromCenter + angleFromNoise;
      angles.push(angle);

      push();

      // draw grid
      translate(x, y);
      fill(0);
      stroke(255, 100);
      //rect(0, 0, RESOLUTION, RESOLUTION);

      // diplay line
      translate(RESOLUTION / 2, RESOLUTION / 2);
      let vector = p5.Vector.fromAngle(angle);
      vector.mult(RESOLUTION / 2);
      stroke(255);
      //line(0, 0, vector.x, vector.y);

      // draw index
      let index = angles.length;
      fill(255);
      noStroke();
      //text(index, -15, -5);

      pop();
    }
  }

  // vehicles
  for (let v of vehicles) {
    let c = floor(v.pos.x / RESOLUTION);
    let r = floor(v.pos.y / RESOLUTION);
    let index = c + r * cols;
    let angle = angles[index];
    v.flow(angle);
    v.update();
    v.reappear();
    //v.attractedTo();
    //v.seek(target);
    //v.display();
    v.displayPoint();
  }
}

function drawBranch(x, y, deg, len) {
  let angle = radians(deg);
  let targetX = x + cos(angle) * len;
  let targetY = y + sin(angle) * len;
  let targetX1 = x - cos(angle) * len;
  let targetY1 = y - sin(angle) * len;

  let target = createVector(targetX, targetY);
  for (let v of vehicles) {
    v.seek(target);
    //v.attractedTo(target);
  }

  //line(x, y, targetX, targetY);

  if (len > 10) {
    drawBranch(targetX, targetY, deg - angleui, len * 0.7);
    drawBranch(targetX, targetY, deg + angleui, len * 0.7);
  }

  //blendMode(ADD);
  //noStroke();
  //fill(ui.r, ui.g, ui.b, ui.t);
  //circle(targetX, targetY, 300/len);
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
    if (300 < this.pos < 500) {
      let desiredVel = p5.Vector.fromAngle(angle); // direction
      desiredVel.mult(this.maxSpeed); // desire

      let steerForce = p5.Vector.sub(desiredVel, this.vel);
      steerForce.limit(this.maxSteerForce);

      this.applyForce(steerForce);
    }
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
    point(this.pos.x, this.pos.y);
    pop();
  }
}
