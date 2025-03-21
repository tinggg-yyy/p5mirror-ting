let radDist;
let angle = 0;

function setup() {
  createCanvas(500, 600);
  background(100);
}

function draw() {
  //background(100);

  push();
  translate(width / 2, height / 2);

  angle += 0.02;

  let sinForRad = sin(angle * 6) * 30;
  radDist = 150 + sinForRad;

  let x = cos(angle) * radDist;
  let y = sin(angle) * radDist;

  radDist = 150;
  let x1 = cos(angle) * radDist;
  let y1 = sin(angle) * radDist;
  
  let sinForColor = map(sin(angle * 12), -1, 1, 0, 255);
  
  stroke(sinForColor);
  line(0, 0, x, y);
  //line(x1, y1, x, y);

  pop();
}
