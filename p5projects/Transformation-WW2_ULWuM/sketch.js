// Note: play with the angle, positons, width and height of the rectangle!

let angle = 0;
let x = 0;
let w = 1;

function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  // update values
  angle = angle + 30;
  w = w + 5;
  //x = x + 1;
  
  // draw the shape
  push();
  blendMode(ADD);
  
  translate(width/2, height/2);
  rotate( radians(angle) );
  stroke(200, 100, 200, 70);
  noFill();
  
  rectMode(CENTER);
  rect(x, 0, 100, w);
  
  pop();
}

function keyPressed() {
  if (key == "s" || key == "S") {
    save("sketch.png");
  }
}
