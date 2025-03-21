let gui;
let ui = {
  a: 100,
  l: 20,
  i: 6,
};

let angle1 = 0;

function setup() {
  createCanvas(700, 700);
  gui = new dat.GUI();
  gui.add(ui, "a", 100, 500);
  gui.add(ui, "l", 20, 107.5);
  gui.add(ui, "i", 6, 25);
}

function draw() {
  background(0);
  angle1 = floor(map(ui.a, 0, width, 0, 180));
  translate(width/2, height/2);

  noFill();
  //stroke(255);
  
  
  ui.i = ui.i + 0.003;
  ui.a = ui.a + 1.5;
  ui.l = ui.l + 0.1;
  if(ui.l > 107.5){
  ui.l = 20;
  }
  
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
    drawBranch(targetX, targetY, deg - angle1, len * 0.7);
    drawBranch(targetX, targetY, deg + angle1, len * 0.7);
  }
  
  //blendMode(ADD);
  noStroke();
  fill(255, 20);
  circle(targetX, targetY, 125/len);
}
