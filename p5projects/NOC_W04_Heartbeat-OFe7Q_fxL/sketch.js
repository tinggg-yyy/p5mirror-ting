let COEFFICIENT_OF_RESISTANCE = 0.02;
let hearts = [];
let h0;

function setup() {
  createCanvas(450, 450);
  background(0);

  h0 = new Heart(width  / 2, height / 2, 15);

  for (let i = 0; i < 30; i++) {
    let h = new Heart(random(width), random(height), random(10, 20));
    hearts.push(h);
  }
}

function draw() {
  background(0, 30);

  for (let i = 0; i < hearts.length; i++) {
    let h = hearts[i];

    // attraction
    if (mouseIsPressed) {
      h.attractedTo(h0);
    }

    // resistance
    let resistance = h.vel.copy();
    resistance.normalize();
    resistance.mult(-1);
    let speed = h.vel.mag();
    let magnitude = speed * speed * COEFFICIENT_OF_RESISTANCE;
    resistance.mult(magnitude);
    h.applyForce(resistance);
    h.checkCollision(hearts);
    h.update();
    h.bounce();
    h.display();
  }
}

class Heart {
  constructor(x, y, rad) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.acc = createVector(0, 0);
    this.rad = rad;
    this.mass = rad * 0.5;
    this.color = color(255);
    this.elasticity = random(0.5, 1.0);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(f) {
    if (this.mass > 0) {
      let force = p5.Vector.div(f, this.mass);
      this.acc.add(force);
    }
  }

  attractedTo(other) {
    let force = p5.Vector.sub(other.pos, this.pos);
    force.mult(0.1);
    this.applyForce(force);
  }

  checkCollision(other) {
    for (let i = 0; i < hearts.length; i++) {
      let other = hearts[i];
      if (this != other) {
        let distance = this.pos.dist(other.pos);
        if (distance < this.rad + other.rad) {
          let force;
          force = p5.Vector.sub(other.pos, this.pos);
          force.normalize();
          force.mult(-1);
          force.mult(other.vel.mag());
          force.mult(other.elasticity);
          this.applyForce(force);

          force = p5.Vector.sub(this.pos, other.pos);
          force.normalize();
          force.mult(-1);
          force.mult(this.vel.mag());
          force.mult(this.elasticity);
          other.applyForce(force);
        }
      }
    }
  }

  bounce() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x = -this.vel.x;
    } else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = -this.vel.y;
    } else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y = -this.vel.y;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    let r = map(this.elasticity, 0.5, 1.0, 100, 255);
    let g = 0;
    let b = map(this.elasticity, 0.5, 1.0, 255, 100);
    let t = map(this.elasticity, 0.5, 1.0, 70, 100);
    fill(r, g, b, t);
    // heart shape by Supriyo: https://editor.p5js.org/Supriyo/sketches/N2nRmPYL7
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const r = this.rad / 10;
      const x = r * 16 * pow(sin(a), 3);
      const y =
        -r * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
      vertex(x, y);
    }
    endShape();
    pop();
  }
}
