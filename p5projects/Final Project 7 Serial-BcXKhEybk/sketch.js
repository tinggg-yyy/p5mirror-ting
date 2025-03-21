let serial;
let latestData = "waiting for data";

let gui;
let ui = {
  a: 100,
  l: 20,
  i: 6,
  back: 0.5,
  leave: 0,
  scale: 150,
};
let objParams = {
  frameRate: 0,
};

const RESOLUTION = 50;
const FREQ_POS = 0.0035;
const FREQ_TIME = 0.0015;
let rows, cols;
let angles = [];
let vehicles = [];
let scene = 1;

function setup() {
  createCanvas(700, 700);

  //Serial
  serial = new p5.SerialPort();
  serial.list();
  serial.open("/dev/tty.usbmodem101");
  serial.on("connected", serverConnected);
  serial.on("list", gotList);
  serial.on("data", gotData);
  serial.on("error", gotError);
  serial.on("open", gotOpen);
  serial.on("close", gotClose);

  //GUI
  gui = new dat.GUI();
  gui.add(ui, "a", 100, 500);
  gui.add(ui, "l", 20, 120);
  gui.add(ui, "i", 6, 25);
  gui.add(ui, "back", 0.5, 3).step(0.01).listen();
  gui.add(ui, "leave", 0, 1).step(0.01).listen();
  gui.add(ui, "scale", 100, 300);
  gui.add(objParams, "frameRate").step(0.01).listen();

  //Pattern
  cols = ceil(width / RESOLUTION);
  rows = ceil(height / RESOLUTION);
}

function draw() {
  background(0);

  fill(255);
  //text(latestData, 10, 20);

  objParams.frameRate = frameRate().toFixed(2);

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
      let vectorToCenter = p5.Vector.sub(center, gridCenter);
      let rotateAngle = map(sin(frameCount * 0.02), -1, 1, 0, 160);
      vectorToCenter.rotate(radians(rotateAngle)); //frameCount * 0.n决定了范围
      let angleFromCenter = vectorToCenter.heading();

      // angle from noise
      let xFrq = x * FREQ_POS + frameCount * FREQ_TIME;
      let yFrq = y * FREQ_POS + frameCount * FREQ_TIME;
      let noiseValue = noise(xFrq, yFrq); // 0 to 1
      let angleFromNoise = map(noiseValue, 0, 1, 0, PI * 4); // ***

      let angleCombined = angleFromCenter * ui.back + angleFromNoise * ui.leave;
      angles.push(angleCombined);

      if (false) {
        push();
        // draw grid
        translate(x, y);
        fill(0);
        stroke(255, 100);
        rect(0, 0, RESOLUTION, RESOLUTION);

        // diplay line
        translate(RESOLUTION / 2, RESOLUTION / 2);
        let vector = p5.Vector.fromAngle(angleCombined);
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
  }

  for (let v of vehicles) {
    // angles
    let col = floor(v.pos.x / RESOLUTION); // x
    let row = floor(v.pos.y / RESOLUTION); // y
    let colNum = width / RESOLUTION; // width
    let index = col + row * colNum; // x + y * w
    let angle = angles[index];
    v.flow(angle);

    // attraction
    // if (keyIsPressed) {
    //   v.attractedTo(v0);
    // }

    v.update();
    v.reappear();
    //v.attractedTo();
    //v.seek(target);
    //v.display();
    v.displayPoint();
  }

  //Heart Beat trigger wave
  if (latestData > 0) {
    //ui.a =  1.5 + latestData*10;
    //ui.i = 0.006 + latestData;
    ui.l = 1 + latestData * 5;
    ui.back = (20-latestData) * 0.1;
    ui.leave = latestData * 0.05;
    for (let i = 0; i < 5; i++) {
      let pos = p5.Vector.random2D();
      pos.mult((ui.scale * ui.l) / 100);
      vehicles.push(new Vehicle(width / 2 + pos.x, height / 2 + pos.y));
      //vehicles[i] = new Vehicle(width / 2 + pos.x, height / 2 + pos.y);
      //translate(-width / 2, -height / 3);//initial position
    }
        //patterns
  angle1 = floor(map(ui.a, 0, width, 0, 180));
  noFill();
  ui.i = ui.i + 0.006;
  ui.a = ui.a + 1.5;
  //ui.l = ui.l + 0.1;
   if ( latestData >= 20) {
     ui.i = 6;
     ui.l = 0;
     ui.a = 100;
   }

    
    //pattern1
  translate(width / 2, height / 3+height/8);
  for (let i = 0; i < ui.i; i++) {
    drawBranch(0, 0, (360 / ui.i) * i, ui.l);
  }
  //pattern2
  translate(-width / 8, height / 3-height/8);
  for (let i = 0; i < ui.i; i++) {
    drawBranch(0, 0, (360 / ui.i) * i, ui.l);
  }
  //pattern3
  translate(width / 4, 0);
  for (let i = 0; i < ui.i; i++) {
    drawBranch(0, 0, (360 / ui.i) * i, ui.l);
  }
  }

  while (vehicles.length > 3000) {
    vehicles.splice(0, 1);
  }
}

function mousePressed() {
  v0 = new Vehicle(width / 2, height / 2, 1);
  for (let i = 0; i < 1000; i++) {
    let pos = p5.Vector.random2D();
    pos.mult((ui.scale * ui.l) / 100);
    // vehicles.push(new Vehicle(width / 3 + pos.x, 2* height / 3 + pos.y));
    //vehicles.push(new Vehicle(2* width / 3 + pos.x, 2* height / 3 + pos.y));
    //vehicles[i] = new Vehicle(width / 2 + pos.x, height / 2 + pos.y);
  }
}

function keyPressed() {
  if (key === "1") {
    scene = scene + 1;
    if (scene > 4) {
      scene = 1;
    }
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  
//   if(key == "a"|| key == "A"){
//     for (let v of vehicles) {
//             v.attractedTo(v0);
//     }
// }
}

function drawBranch(x, y, deg, len) {
  let angle = radians(deg);
  let targetX = x + cos(angle) * len;
  let targetY = y + sin(angle) * len;
  let targetX1 = x - cos(angle) * len;
  let targetY1 = y - sin(angle) * len;

  if (len > 10) {
    drawBranch(targetX, targetY, deg - angle1, len * 0.7);
    drawBranch(targetX, targetY, deg + angle1, len * 0.7);
  }

  noStroke();
  fill(255, 30);
  if (scene === 1) {
    circle(targetX, targetY, (200 / len) * noise(frameCount * 0.03));
  }
  if (scene === 2) {
    circle(
      targetX * sin(angle),
      targetY,
      (200 / len) * noise(frameCount * 0.03)
    );
  }
  if (scene === 3) {
    circle(
      targetX * sin(angle),
      targetY * cos(angle),
      (200 / len) * noise(frameCount * 0.03)
    );
  }
  if (scene === 4) {
    circle(
      targetX * sin(angle),
      targetY * sin(angle),
      (200 / len) * noise(frameCount * 0.03)
    );
  }
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
  attractedTo(other) {
    let vector = p5.Vector.sub(other.pos, this.pos);
    vector.mult(0.002 );
    this.applyForce(vector);
    this.vel.mult(0.8);
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
      //console.log("Wrong mass");
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
    fill(255, 40);
    circle(this.pos.x, this.pos.y, 3 * cos(this.pos.x - width / 2));
    //circle(this.pos.x, this.pos.y, 3 * noise(frameCount * 0.01));
    pop();
  }
}

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  //console.log(currentString);
  latestData = parseInt(currentString);
}
