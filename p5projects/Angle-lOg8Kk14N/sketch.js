let angle = 0;
let x = 0;
let y = 0;

function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  angle = angle + 72;
  x++;
  y++;
  
  translate(width/2, height/2);
  //rotate(radians(frameCount));
  noFill();
  stroke(255,0,255,70);
  rectMode(CENTER);
  rect(x, 0, y, 80);
}