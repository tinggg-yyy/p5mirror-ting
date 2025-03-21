let gui;
let ui = {
  i: 2,
};
let DEBUG_MODE = false;
let img;
let penguins = [];
let fishes = [];

function setup() {
  createCanvas(600, 600);
   gui = new dat.GUI();
  gui.add(ui, "i", 2, 30).step(1).onChange(updatePenguins);
  updatePenguins();
}


function updatePenguins() {
  penguins = []; 
  for (let i = 0; i < ui.i; i++) {
    penguins.push(new Penguin(random(width), random(height), random(5, 10)));
  }
}

function draw() {
  background(100,150,220);

  for (let i = 0; i < penguins.length; i++) {
    let p = penguins[i];

    let target = createVector(mouseX, mouseY);
    p.seek(target);

    p.detect(penguins);
    p.update();
    p.reappear();
    p.display();
  }
  
  
  for (let i = 0; i < 2; i++) {
    let f = new Fish(mouseX, mouseY, 10)
    fishes.push(f);
  }

  // update and display
  for (let f of fishes) {
  f.detect();
  f.update();
  f.checkMouse();
  f.updateLifespan();
  f.display();

    if (f.isDone) f.removeFrom(fishes);
  }


  while (fishes.length > 100) {
    let index = 0;
    fishes.splice(index, 1);
  }
}

function mousePressed() {
  DEBUG_MODE = !DEBUG_MODE;
}



///// CLASS /////

class Penguin {
  constructor(x = 0, y = 0, size = 1) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(3);
    this.acc = createVector(0, 0);
    this.size = size;
    this.mass = 1;
    //
    this.angle = 0;
    //
    this.maxSpeed = 5;
    this.maxSteerForce = 0.1;
    // for detection
    this.detectVector = createVector();
    this.directionVector = createVector();
    this.predictDistance = 30;
    this.detectRadius = 50;
    this.wanderAngle = random(TWO_PI);
    this.img = loadImage("pngwing.com.png");
  }
  detect(others) {
    for (let other of others) {
      if (this != other) {
        this.detectVector = p5.Vector.mult(
          this.vel.copy().normalize(),
          this.predictDistance
        );
        let centerPos = p5.Vector.add(this.pos, this.detectVector);

        let distance = centerPos.dist(other.pos);
        if (distance < this.detectRadius) {
          this.directionVector = p5.Vector.sub(other.pos, centerPos);
          this.directionVector.setMag(this.detectRadius);
          this.directionVector.mult(-1); // flip the vector to avoid

          let directionPos = p5.Vector.add(centerPos, this.directionVector);
          this.seek(directionPos);
        }
      }
    }
  }
  seek(targetPos) {
    let desiredVec = p5.Vector.sub(targetPos, this.pos);

    let distance = desiredVec.mag();
    desiredVec.normalize();
    desiredVec.mult(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVec, this.vel);
    steerForce.limit(this.maxSteerForce);

    this.applyForce(steerForce);
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
  applyForce(f) {
    if (this.mass > 0) {
      let force = p5.Vector.div(f, this.mass);
      this.acc.add(force);
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle = this.vel.heading();
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    push(); // push for rotation
    rotate(this.angle);
    // draw the vehicle
    stroke(255);
    fill(255, 150);
    image(this.img, 0, 0, this.size*8, this.size *4);
    pop(); // pop for rotation

//     if (DEBUG_MODE) {
//       // draw detecting graphics
//       noFill();
//       stroke(255, 0, 0);
//       line(0, 0, this.detectVector.x, this.detectVector.y);

//       translate(this.detectVector.x, this.detectVector.y);
//       ellipse(0, 0, this.detectRadius * 2, this.detectRadius * 2);

//       stroke(0, 255, 0);
//       line(0, 0, this.directionVector.x, this.directionVector.y);
//     }

    pop();
  }
}


class Fish {
  constructor(x = 0, y = 0, size = 1) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = size;
    this.mass = 1;
    //
    this.angle = 0;
    //
    this.maxSpeed = 5;
    this.maxSteerForce = 0.1;
    // for detection
    this.detectVector = createVector();
    this.directionVector = createVector();
    this.predictDistance = 30;
    this.detectRadius = 50;
    this.wanderAngle = random(TWO_PI);
    //lifespan
    this.lifespan = 1.0; // 100%;
    this.lifeReduction = random(0.005, 0.012);
    this.isDone = false;

    return this;
  }
  detect() {
    this.detectVector = p5.Vector.mult(
      this.vel.copy().normalize(),
      this.predictDistance
    );
    let centerPos = p5.Vector.add(this.pos, this.detectVector);

    this.wanderAngle += random(-0.2, 0.2);

    this.directionVector = p5.Vector.fromAngle(this.wanderAngle);
    this.directionVector.setMag(this.detectRadius);

    let directionPos = p5.Vector.add(centerPos, this.directionVector);
    this.seek(directionPos);
  }
  seek(targetPos) {
    let desiredVec = p5.Vector.sub(targetPos, this.pos);

    let distance = desiredVec.mag();
    desiredVec.normalize();
    desiredVec.mult(this.maxSpeed);

    let steerForce = p5.Vector.sub(desiredVec, this.vel);
    steerForce.limit(this.maxSteerForce);

    this.applyForce(steerForce);
  }

  applyForce(f) {
    if (this.mass > 0) {
      let force = p5.Vector.div(f, this.mass);
      this.acc.add(force);
    }
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.angle = this.vel.heading();
  }
  checkMouse() {
    let distance = dist(this.detectVector.x, this.detectVector.y, mouseX, mouseY);
    if (distance < this.detectRadius) {
      this.isDone = true;
    }
  }
  updateLifespan() {
    if (this.lifespan > 0) {
      this.lifespan -= this.lifeReduction;
    } else {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  removeFrom(array) {
    if (this.isDone) {
      let index = array.indexOf(this);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    push(); // push for rotation
    rotate(this.angle);
    // draw the vehicle
    stroke(255);
    fill(255, 150);
    triangle(0, 0, -this.size, -this.size * 0.4, -this.size, this.size * 0.4);
    pop(); // pop for rotation

//  if (DEBUG_MODE) {
//       // draw detecting graphics
//       noFill();
//       stroke(255, 0, 0);
//       line(0, 0, this.detectVector.x, this.detectVector.y);

//       translate(this.detectVector.x, this.detectVector.y);
//       ellipse(0, 0, this.detectRadius * 2, this.detectRadius * 2);

//       stroke(0, 255, 0);
//       line(0, 0, this.directionVector.x, this.directionVector.y);
//     }

    pop();
  }
}
