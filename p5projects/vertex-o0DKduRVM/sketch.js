function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  beginShape();
  vertex(100,50);
  vertex(200,220);
  vertex(mouseX,mouseY);
  endShape(CLOSE);
}

function mousePressed(){
  console.log("vertex("+mouseX+", "+mouseY+")")
}