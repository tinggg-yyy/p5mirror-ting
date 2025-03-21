let balls = [];

function setup() {
  createCanvas(450, 450);
  background(220);
  
}

function draw() {
  background(220);

  // generate
  if (mouseIsPressed) {
    balls.push(new Ball(mouseX, mouseY, random(50, 100)));
  }

  // update and display
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.move();
    //b.fall();
    //b.reappear();
    b.checkEdges();
    b.display();
  }

  // limit
  while (balls.length > 1000) {
    balls.splice(0, 1); // (index, howMany)
  }

  // control: if the particle is done, let's remove it!
  // FLIP the FOR LOOP!
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];
    if (b.isDone) {
      balls.splice(i, 1); // (index, howMany)
    }
  }
  
  // display the number of the particles
  text(balls.length, 10, 20);
}

function mousePressed() {
  //balls.push( new Ball(mouseX, mouseY, random(10, 20)) );
}
//

class Ball {
  constructor(x, y, dia) {
    this.pos = createVector(x, y);
    //this.vel = createVector(random(-3, 3), random(-3, 3));
    this.vel = p5.Vector.fromAngle( radians(frameCount) );
    //
    this.dia = dia;
    //
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    //
    this.rotSpd = random(0.01, 0.03);
    //
    this.isDone = false;
  }
  move() {    
    this.pos.add(this.vel); // pos += vel
    //this.pos.sub()
    //this.pos.mult()
    //this.pos.div()
  }
  fall() {
    let acc = createVector(0, 0.05);
    this.vel.add(acc);
  }
  speedUp() {
    //
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
  checkEdges() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.isDone = true;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.isDone = true;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * this.rotSpd);
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(0, 0, this.dia, this.dia * 0.8);
    pop();
  }
}

function mouseDragged(){
  
}