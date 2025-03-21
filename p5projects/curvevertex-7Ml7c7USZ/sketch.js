function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  noStroke();
  fill(255, 30, 255, 70);

  beginShape();
  // add vertices here!
vertex(200,170); 
vertex(150,120); 
vertex(100,170); 
vertex(85,270); 
vertex(140,330); 
vertex(230,355); 
vertex(270,330); 
vertex(320,230); 
vertex(250,160); 
vertex(220,100); 
curveVertex(205,60); 
endShape(CLOSE);
}

function mousePressed() {
  console.log("vertex(" + mouseX + "," + mouseY + ");");
}

function keyPressed() {
  if (key == "s" || key == "S") {
    save("sketch.png");
  }
}
