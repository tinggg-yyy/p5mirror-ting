let balls = [];
let springs = [];
let b1,b2,b3,b4,b5,b6,b7,bb1,bb2,bb3,bb4,bb5,bb6,bb7;

function setup() {
  createCanvas(450, 450);

  b1 = new Ball(100, 175, 10);
  balls.push(b1);
  b2 = new Ball(180, 125, 10);
  balls.push(b2);
  b3 = new Ball(270, 125, 10);
  balls.push(b3);
  b4 = new Ball(350, 175, 10);
  balls.push(b4);
  b5 = new Ball(275, 225, 10);
  balls.push(b5);
  b6 = new Ball(175, 225, 10);
  balls.push(b6);
  b7 = new Ball(225, 175, 20);
  balls.push(b7);
  
  bb1 = new Ball(100, 275, 20);
  balls.push(bb1);
  bb2 = new Ball(180, 235, 20);
  balls.push(bb2);
  bb3 = new Ball(270, 235, 20);
  balls.push(bb3);
  bb4 = new Ball(350, 275, 20);
  balls.push(bb4);
  bb5 = new Ball(275, 325, 20);
  balls.push(bb5);
  bb6 = new Ball(175, 325, 20);
  balls.push(bb6);
  bb7 = new Ball(225, 275, 20);
  balls.push(bb7);
  
  //top
  springs.push(new Spring(b1, b2, 70, 0.02));
  springs.push(new Spring(b2, b3, 70, 0.02));
  springs.push(new Spring(b3, b4, 70, 0.02));
  springs.push(new Spring(b4, b5, 75, 0.02));
  springs.push(new Spring(b5, b6, 90, 0.02));
  springs.push(new Spring(b6, b1, 75, 0.02));
  springs.push(new Spring(b7, b1, 120, 0.03));
  springs.push(new Spring(b7, b2, 80, 0.03));
  springs.push(new Spring(b7, b3, 80, 0.03));
  springs.push(new Spring(b7, b4, 120, 0.03));
  springs.push(new Spring(b7, b5, 80, 0.03));
  springs.push(new Spring(b7, b6, 80, 0.03));
  
  //bottom
  springs.push(new Spring(bb1, bb2, 90, 0.05));
  springs.push(new Spring(bb2, bb3, 90, 0.05));
  springs.push(new Spring(bb3, bb4, 90, 0.05));
  springs.push(new Spring(bb4, bb5, 100, 0.05));
  springs.push(new Spring(bb5, bb6, 120, 0.05));
  springs.push(new Spring(bb6, bb1, 100, 0.05));
  springs.push(new Spring(bb7, bb1, 160, 0.05));
  springs.push(new Spring(bb7, bb2, 100, 0.05));
  springs.push(new Spring(bb7, bb3, 100, 0.05));
  springs.push(new Spring(bb7, bb4, 160, 0.05));
  springs.push(new Spring(bb7, bb5, 100, 0.05));
  springs.push(new Spring(bb7, bb6, 100, 0.05));
  
  //connection
  springs.push(new Spring(b1, bb1, 105, 0.1));
  springs.push(new Spring(b2, bb2, 125, 0.1));
  springs.push(new Spring(b3, bb3, 125, 0.1));
  springs.push(new Spring(b4, bb4, 105, 0.1));
  springs.push(new Spring(b5, bb5, 125, 0.1));
  springs.push(new Spring(b6, bb6, 125, 0.1));
  springs.push(new Spring(b7, bb7, 95, 0.01));
}

function draw() {
  
  background(255, 200, 150);
  
  stroke(153, 70, 0);
  fill(255, 220, 150);
  beginShape();
  vertex(b1.pos.x, b1.pos.y);
  vertex(bb1.pos.x, bb1.pos.y);
  vertex(bb2.pos.x, bb2.pos.y);
  vertex(b2.pos.x, b2.pos.y);
  endShape(CLOSE);
  
  fill(255, 220, 150);
  beginShape();
  vertex(b2.pos.x, b2.pos.y);
  vertex(bb2.pos.x, bb2.pos.y);
  vertex(bb3.pos.x, bb3.pos.y);
  vertex(b3.pos.x, b3.pos.y);
  endShape(CLOSE);
  
  fill(255, 220, 150);
  beginShape();
  vertex(b3.pos.x, b3.pos.y);
  vertex(bb3.pos.x, bb3.pos.y);
  vertex(bb4.pos.x, bb4.pos.y);
  vertex(b4.pos.x, b4.pos.y);
  endShape(CLOSE);
  
  fill(255, 220, 150);
  beginShape();
  vertex(b4.pos.x, b4.pos.y);
  vertex(bb4.pos.x, bb4.pos.y);
  vertex(bb5.pos.x, bb5.pos.y);
  vertex(b5.pos.x, b5.pos.y);
  endShape(CLOSE);
  
  fill(255, 220, 150);
  beginShape();
  vertex(b5.pos.x, b5.pos.y);
  vertex(bb5.pos.x, bb5.pos.y);
  vertex(bb6.pos.x, bb6.pos.y);
  vertex(b6.pos.x, b6.pos.y);
  endShape(CLOSE);
  
  fill(255, 220, 150);
  beginShape();
  vertex(b6.pos.x, b6.pos.y);
  vertex(bb6.pos.x, bb6.pos.y);
  vertex(bb1.pos.x, bb1.pos.y);
  vertex(b1.pos.x, b1.pos.y);
  endShape(CLOSE);
  
  fill(153, 70, 0);
  beginShape();
  vertex(b1.pos.x, b1.pos.y);
  vertex(b2.pos.x, b2.pos.y);
  vertex(b3.pos.x, b3.pos.y);
  vertex(b4.pos.x, b4.pos.y);
  vertex(b5.pos.x, b5.pos.y);
  vertex(b6.pos.x, b6.pos.y);
  vertex(b1.pos.x, b1.pos.y);
  endShape(CLOSE);

  for (let s of springs) {
    s.update();
    s.display();
  }

  beginShape();
  for (let b of balls) {
    b.drag();
    b.bounce();
    b.update();
  }
  endShape(CLOSE);
}



class Spring {
  constructor(a, b, restLength, stiffness) {
    this.bobA = a;
    this.bobB = b;
    this.len = restLength;
    this.k = stiffness; 
  }
  update() {
    let vector = p5.Vector.sub(this.bobB.pos, this.bobA.pos);
    let distance = vector.mag();
    let stretch = distance - this.len;
    let strength = -1 * stretch * this.k; 
    
    let force = vector.copy();
    force.normalize();
    force.mult(strength);
    this.bobB.applyForce(force);

    let force1 = vector.copy();
    force1.normalize();
    force1.mult(strength * -1);
    this.bobA.applyForce(force1);
  }
  display() {
    noStroke();
    line(this.bobA.pos.x, this.bobA.pos.y, this.bobB.pos.x, this.bobB.pos.y);
  }
}

class Ball {
  constructor(x, y, rad) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.rad = rad;
    this.mass = rad * 0.5; // MASS!
    this.damping = 0.94;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.vel.mult(this.damping); 
  }
  applyForce(f) {
    if (this.mass > 0) {
      let force = p5.Vector.div(f, this.mass);
      this.acc.add(force);
    }
  }
 
  bounce() {
    // x
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x = -this.vel.x;
    } else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x = -this.vel.x;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = -this.vel.y;
    } else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y = -this.vel.y;
    }
  }
  drag() {
    if (mouseIsPressed) {
      let distance = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      if (distance < this.rad) {
        // in
        this.pos.x = mouseX;
        this.pos.y = mouseY;
      }
    }
  }
}
