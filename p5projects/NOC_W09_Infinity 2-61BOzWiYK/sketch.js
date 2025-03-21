let gui;
let ui = {
  a: 0,
  l: 20,
  r: 50,
  g: 50,
  b: 50,
  t: 5,
  i: 0,
};

let angleFromMouse = 0;

function setup() {
  createCanvas(600, 500);
  gui = new dat.GUI();
  gui.add(ui, "a", 0, 500);
  gui.add(ui, "l", 20, 200);
  gui.add(ui, "r", 50, 255);
  gui.add(ui, "g", 50, 255);
  gui.add(ui, "b", 50, 255);
  gui.add(ui, "t", 5, 15);
  gui.add(ui, "i", 0, 30);
}

function draw() {
  background(0);
  angleFromMouse = floor(map(ui.a, 0, width, 0, 180));
  translate(width/2, height/2);

  noFill();
  //stroke(255);
  for (let i = 0; i < ui.i; i++) {
  drawBranch(0, 0, 360/ui.i * i, ui.l);
  }
}

function drawBranch(x, y, deg, len) {
  let angle = radians(deg);
  let targetX = x + cos(angle) * len;
  let targetY = y + sin(angle) * len;
  let targetX1 = x - cos(angle) * len;
  let targetY1 = y - sin(angle) * len;

  line(x, y, targetX, targetY);

  if (len > 10) {
    drawBranch(targetX, targetY, deg - angleFromMouse, len * 0.7);
    drawBranch(targetX, targetY, deg + angleFromMouse, len * 0.7);
  }
  
  //blendMode(ADD);
  noStroke();
  fill(ui.r, ui.g, ui.b, ui.t);
  circle(targetX*sin(angle), targetY, 300/len);
}
